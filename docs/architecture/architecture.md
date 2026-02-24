# Arquitectura — DOGE Creative Suite v1.0

Decisiones de arquitectura (ADRs) y stack tecnologico.

---

## ADR-001: App nueva vs extender AI-Studio

**Contexto**: AI-Studio (REBAN ERP v3.0) ya tiene FastAPI + Next.js + ElevenLabs + fal.ai + Supabase. Gemini propuso construir desde cero.

**Decision**: **App nueva desde cero**, inspirada en patrones de AI-Studio pero 70% mas simple.

**Justificacion**:
- AI-Studio tiene 19K LOC de backend, 530+ docs, 15 servicios, multi-tenant RBAC, RAG, GPU workers. Es overkill para 5-6 usuarios internos.
- Extender AI-Studio significaria cargar con deuda tecnica de features que no necesitamos (OpenTelemetry, PostHog, RALPH agents, multi-tenant).
- Una app nueva permite: deploy rapido (dias, no semanas), onboarding simple para el equipo, y agregar features sin miedo a romper el ERP de produccion.

**Patrones que SI reutilizamos de AI-Studio**:

| Patron | De AI-Studio | Simplificado Como |
|--------|-------------|-------------------|
| Provider SSOT | `model_gateway/providers/` (1 cliente por API) | `providers/` (mismo patron, menos providers) |
| Config | Pydantic Settings + AliasChoices | Identico, menos variables |
| Auth | Supabase JWT + JWKS cache | Identico |
| Middleware | 6 capas (Log -> CORS -> PNA -> Security -> Tenant -> Rate) | 3 capas (Log -> CORS -> Auth) |
| Frontend layout | 6-layer provider cascade | 3 capas (AuthGate -> AppShell -> Content) |
| UI components | shadcn/ui + Radix primitives | shadcn/ui (sin composed components custom) |

---

## ADR-002: Gemini propuso LoRAs y ComfyUI — no existen

**Contexto**: Gemini 3.1 Pro no pudo leer AI-Studio ni DOGE-Studio-Personajes. Asumio que existian LoRAs de Stable Diffusion y ComfyUI local.

**Realidad**:
- DOGE-Studio-Personajes usa **Google Gemini API** (gemini-2.5-flash-image), NO Stable Diffusion
- No hay LoRAs almacenados, no hay trigger words para SD, no hay ComfyUI
- AI-Studio tiene ComfyUI **explicitamente deshabilitado** (ADR-026: cloud-first)
- Gemini propuso MinIO cuando ya existe Cloudflare R2 y Supabase Storage
- Gemini propuso Celery cuando ya existe Trigger.dev (y nosotros usaremos ARQ, mas ligero)

**Decision**: Usar fal.ai como proveedor primario de imagenes (como AI-Studio). Integrar perfiles de DOGE-Studio-Personajes como catalogo de estilos (no como modelos locales).

---

## ADR-003: Todo en Railway

**Contexto**: AI-Studio usa Vercel (frontend) + Railway (backend). Gemini propuso servidor local + Linode.

**Decision**: **Todo en Railway** (frontend + backend + worker + Redis).

**Justificacion**:
- Un solo proveedor = un solo dashboard, un solo billing, networking interno gratis
- Railway soporta monorepos: cada servicio apunta a su subdirectorio
- Next.js en Railway funciona bien (no necesita Edge de Vercel para una app interna de 5-6 personas)
- Redis managed en Railway = 1 click, sin mantener
- Costo estimado: ~$75-125/mes (Pro plan)

---

## ADR-004: ARQ sobre Celery

**Contexto**: AI-Studio usa Trigger.dev v3. Gemini propuso Celery. Necesitamos cola de tareas para: generacion de imagenes, TTS batch, traducciones.

**Decision**: **ARQ** (Asynchronous Redis Queue).

**Justificacion**:
- Async-nativo (built on asyncio) — perfecto para FastAPI
- Solo necesita Redis (ya lo tenemos en Railway)
- ~3 dependencias vs ~20+ de Celery
- Sin overhead de RabbitMQ, Flower, beat scheduler
- Production-ready para I/O-bound tasks (llamadas a APIs externas)
- Deploy: 1 servicio adicional en Railway con `arq app.workers.settings.WorkerSettings`

---

## ADR-005: Supabase Storage sobre MinIO

**Contexto**: Gemini propuso MinIO local. AI-Studio usa Cloudflare R2.

**Decision**: **Supabase Storage** (inicio), migrar a R2 si escala.

**Justificacion**:
- Ya incluido en Supabase Pro (100GB)
- Auth-integrated: RLS policies controlan acceso por usuario
- Un solo SDK para DB + Auth + Storage + Realtime
- Zero infra adicional (no hay que instalar/mantener MinIO)
- Si los costos de egress superan ~$50/mes, migrar a Cloudflare R2 (S3-compatible, zero egress fees)

---

## ADR-006: SSE sobre WebSockets para progreso

**Contexto**: Necesitamos mostrar progreso en tiempo real de tareas largas (imagen: ~5s, TTS batch: ~60s, traduccion 27 idiomas: ~300s).

**Decision**: **Server-Sent Events (SSE)** para progreso de tareas + **Supabase Realtime** para colaboracion.

**Justificacion**:
- El progreso es unidireccional (server -> client). No necesitamos bidireccionalidad.
- SSE funciona sobre HTTP estandar — sin configuracion especial en Railway/proxies
- Auto-reconnect built-in en el browser (EventSource API)
- FastAPI: 5 lineas de codigo (`StreamingResponse` con `text/event-stream`)
- Supabase Realtime (que usa WebSocket internamente) para: notificar a otros usuarios cuando un job termina, presencia de equipo

---

## Stack Tecnologico Final

| Capa | Tecnologia | Version | Justificacion |
|------|-----------|---------|---------------|
| **Monorepo** | Turborepo + pnpm | Latest | Cache de builds, mas simple que Nx |
| **Frontend** | Next.js (App Router) + TypeScript | 15.x | SSR, API routes, streaming |
| **UI Kit** | shadcn/ui + Tailwind CSS | v4 | Personalizable, accesible, dashboard-ready |
| **State (client)** | Zustand | Latest | Simple, sin boilerplate |
| **Backend** | FastAPI + Pydantic v2 | Python 3.12+ | Async nativo, OpenAPI auto-docs |
| **Auth** | Supabase Auth (SSR) + JWT verify | Latest | Zero codigo de auth propio |
| **Database** | Supabase PostgreSQL | Pro | RLS, Realtime, Storage incluido |
| **File Storage** | Supabase Storage | Pro (100GB) | Auth-integrated, CDN incluido |
| **Task Queue** | ARQ + Redis | Latest | Async-nativo, minimalista |
| **Real-time** | SSE + Supabase Realtime | N/A | Progreso + colaboracion |
| **Hosting** | Railway | Pro | 4 servicios en 1 proyecto |
| **AI: Images** | fal.ai (flux, turbo) | API | Cloud-first, pay-per-image |
| **AI: Audio** | ElevenLabs | API | TTS, Dubbing, Scribe, Forced Alignment |
| **AI: LLMs** | OpenRouter (Claude, Gemini, GPT) | API | Routing inteligente, un solo API key |
| **Secrets** | Railway env vars | N/A | Nunca en codigo |

---

## Costo Mensual Estimado

| Item | Costo |
|------|-------|
| Railway Pro (4 servicios) | ~$50-80 |
| Supabase Pro | $25 |
| ElevenLabs (por uso) | Variable |
| fal.ai (por uso) | Variable |
| OpenRouter (por uso) | Variable |
| **Total infra fija** | **~$75-105/mes** |
