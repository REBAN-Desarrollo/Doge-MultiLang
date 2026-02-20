"""
Planchado API — 3 tipos de sesiones de planchado QPH.

Planchado sessions are stored in activity_events with:
  event_type = 'planchado_scheduled' (create)
  event_type = 'planchado_completed' (complete)

Tipos:
  historia  — Script reading (miercoles)
  assets    — Visual prep (viernes)
  portada   — Thumbnail review (variable)

Guard G2 checks activity_events for 'planchado_completed' to allow
in_production transitions.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from services.platform.db import get_db_session
from services.platform.identity.auth_service import get_current_user
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

logger = structlog.get_logger("api.v1.creative.content.planchado")

router = APIRouter(
    prefix="/content/erp/v2",
    tags=["Planchado"],
)

PLANCHADO_TYPES = {"historia", "assets", "portada"}


# =============================================================================
# REQUEST / RESPONSE SCHEMAS
# =============================================================================


class CreatePlanchadoRequest(BaseModel):
    """Register a planchado session for an item."""

    planchado_type: str = Field(
        ..., description="Tipo de planchado: historia | assets | portada"
    )
    scheduled_at: datetime = Field(..., description="Scheduled datetime for session")
    participants: list[UUID] = Field(
        default_factory=list, description="UUIDs of participants"
    )
    notes: str | None = Field(None, description="Optional session notes")


class CompletePlanchadoRequest(BaseModel):
    """Mark a planchado session as completed."""

    outcomes: dict[str, Any] = Field(
        default_factory=dict, description="Session outcomes (flexible JSONB)"
    )
    notes: str | None = Field(None, description="Completion notes")


class PlanchadoResponse(BaseModel):
    """Single planchado event."""

    id: UUID
    item_id: UUID
    event_type: str
    actor_id: UUID | None
    payload: dict[str, Any]
    created_at: datetime


class PlanchadoListResponse(BaseModel):
    """Paginated list of planchado events for an item."""

    items: list[PlanchadoResponse]
    total: int
    limit: int
    offset: int


# =============================================================================
# HELPERS
# =============================================================================


async def _get_item_medio_id(item_id: UUID, session: AsyncSession) -> UUID:
    """Resolve item → product → medio_id. Raises 404 if not found."""
    result = await session.execute(
        text(
            """
            SELECT p.medio_id
            FROM product_items pi
            JOIN products p ON p.id = pi.product_id
            WHERE pi.id = :item_id
            LIMIT 1
            """
        ),
        {"item_id": item_id},
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(404, f"Item {item_id} not found")
    return UUID(str(row[0]))


async def _require_medio_access(
    user_id: UUID, medio_id: UUID, session: AsyncSession
) -> None:
    """Raise 403 if user has no access to medio."""
    result = await session.execute(
        text(
            """
            SELECT 1 FROM user_medios
            WHERE user_id = :user_id AND medio_id = :medio_id
            LIMIT 1
            """
        ),
        {"user_id": user_id, "medio_id": medio_id},
    )
    if not result.fetchone():
        raise HTTPException(403, "No tienes acceso a este medio")


async def _get_planchado_event(
    planchado_id: UUID, session: AsyncSession
) -> dict[str, Any]:
    """Fetch a planchado event by id. Raises 404 if not found."""
    result = await session.execute(
        text(
            """
            SELECT id, item_id, event_type, actor_id, payload, created_at
            FROM activity_events
            WHERE id = :id
              AND event_type IN ('planchado_scheduled', 'planchado_completed')
            LIMIT 1
            """
        ),
        {"id": planchado_id},
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(404, f"Planchado {planchado_id} not found")
    return {
        "id": row[0],
        "item_id": row[1],
        "event_type": row[2],
        "actor_id": row[3],
        "payload": row[4],
        "created_at": row[5],
    }


# =============================================================================
# ENDPOINTS
# =============================================================================


@router.post(
    "/items/{item_id}/planchados",
    response_model=PlanchadoResponse,
    status_code=201,
)
async def create_planchado(
    item_id: UUID,
    body: CreatePlanchadoRequest,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """
    Register a planchado session for a product item.

    Stores as activity_event with event_type='planchado_scheduled'.
    Guard G2 later looks for 'planchado_completed' events.
    """
    if body.planchado_type not in PLANCHADO_TYPES:
        raise HTTPException(
            422,
            f"planchado_type debe ser uno de: {', '.join(sorted(PLANCHADO_TYPES))}",
        )

    user_id = UUID(current_user.get("id", current_user.get("sub")))
    medio_id = await _get_item_medio_id(item_id, session)
    await _require_medio_access(user_id, medio_id, session)

    event_id = uuid.uuid4()
    payload: dict[str, Any] = {
        "planchado_type": body.planchado_type,
        "scheduled_at": body.scheduled_at.isoformat(),
        "participants": [str(p) for p in body.participants],
        "notes": body.notes,
    }

    await session.execute(
        text(
            """
            INSERT INTO activity_events
                (id, item_id, event_category, event_type, actor_id, payload)
            VALUES
                (:id, :item_id, 'human', 'planchado_scheduled', :actor_id, :payload::jsonb)
            """
        ),
        {
            "id": event_id,
            "item_id": item_id,
            "actor_id": user_id,
            "payload": __import__("json").dumps(payload),
        },
    )
    await session.commit()

    logger.info(
        "planchado.created",
        planchado_id=str(event_id),
        item_id=str(item_id),
        planchado_type=body.planchado_type,
        actor_id=str(user_id),
    )

    return PlanchadoResponse(
        id=event_id,
        item_id=item_id,
        event_type="planchado_scheduled",
        actor_id=user_id,
        payload=payload,
        created_at=datetime.utcnow(),
    )


@router.get("/items/{item_id}/planchados", response_model=PlanchadoListResponse)
async def list_planchados(
    item_id: UUID,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """
    List all planchado events (scheduled + completed) for an item.
    """
    user_id = UUID(current_user.get("id", current_user.get("sub")))
    medio_id = await _get_item_medio_id(item_id, session)
    await _require_medio_access(user_id, medio_id, session)

    count_result = await session.execute(
        text(
            """
            SELECT COUNT(*) FROM activity_events
            WHERE item_id = :item_id
              AND event_type IN ('planchado_scheduled', 'planchado_completed')
            """
        ),
        {"item_id": item_id},
    )
    total: int = count_result.scalar_one()

    rows_result = await session.execute(
        text(
            """
            SELECT id, item_id, event_type, actor_id, payload, created_at
            FROM activity_events
            WHERE item_id = :item_id
              AND event_type IN ('planchado_scheduled', 'planchado_completed')
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
            """
        ),
        {"item_id": item_id, "limit": limit, "offset": offset},
    )
    rows = rows_result.fetchall()

    items = [
        PlanchadoResponse(
            id=row[0],
            item_id=row[1],
            event_type=row[2],
            actor_id=row[3],
            payload=row[4] or {},
            created_at=row[5],
        )
        for row in rows
    ]

    return PlanchadoListResponse(items=items, total=total, limit=limit, offset=offset)


@router.patch("/planchados/{planchado_id}/complete", response_model=PlanchadoResponse)
async def complete_planchado(
    planchado_id: UUID,
    body: CompletePlanchadoRequest,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """
    Mark a planchado session as completed.

    Creates a NEW activity_event with event_type='planchado_completed'.
    Guard G2 queries for this event type to evaluate the advisory gate.

    The completed event references the original scheduled event via
    payload.planchado_scheduled_id.
    """
    user_id = UUID(current_user.get("id", current_user.get("sub")))

    original = await _get_planchado_event(planchado_id, session)
    item_id: UUID = UUID(str(original["item_id"]))
    medio_id = await _get_item_medio_id(item_id, session)
    await _require_medio_access(user_id, medio_id, session)

    # Build completion payload from original + outcomes
    original_payload: dict[str, Any] = original["payload"] or {}
    completion_payload: dict[str, Any] = {
        "planchado_type": original_payload.get("planchado_type"),
        "planchado_scheduled_id": str(planchado_id),
        "outcomes": body.outcomes,
        "notes": body.notes,
        "participants": original_payload.get("participants", []),
    }

    event_id = uuid.uuid4()
    await session.execute(
        text(
            """
            INSERT INTO activity_events
                (id, item_id, event_category, event_type, actor_id, payload)
            VALUES
                (:id, :item_id, 'human', 'planchado_completed', :actor_id, :payload::jsonb)
            """
        ),
        {
            "id": event_id,
            "item_id": item_id,
            "actor_id": user_id,
            "payload": __import__("json").dumps(completion_payload),
        },
    )
    await session.commit()

    logger.info(
        "planchado.completed",
        planchado_id=str(planchado_id),
        completion_event_id=str(event_id),
        item_id=str(item_id),
        planchado_type=completion_payload.get("planchado_type"),
        actor_id=str(user_id),
    )

    return PlanchadoResponse(
        id=event_id,
        item_id=item_id,
        event_type="planchado_completed",
        actor_id=user_id,
        payload=completion_payload,
        created_at=datetime.utcnow(),
    )
