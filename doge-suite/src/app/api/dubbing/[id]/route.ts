import { NextRequest, NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

/**
 * GET /api/dubbing/[id]
 *
 * Primero consulta el STATUS del proyecto via
 * GET /v1/dubbing/{dubbing_id}. Si aún está procesando,
 * retorna el status. Si está listo, consulta el
 * Resource API para los segmentos detallados.
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "ELEVENLABS_API_KEY no configurada" },
            { status: 500 }
        );
    }

    const { id } = await params;

    try {
        // Paso 1: Consultar status del proyecto
        const statusRes = await fetch(
            `${ELEVEN_BASE}/dubbing/${id}`,
            { headers: { "xi-api-key": apiKey } }
        );

        if (!statusRes.ok) {
            const text = await statusRes.text();
            return NextResponse.json(
                {
                    error: `ElevenLabs: ${statusRes.status}`,
                    detail: text,
                },
                { status: statusRes.status }
            );
        }

        const statusData = await statusRes.json();

        // Si no está listo, retornar solo el status
        if (statusData.status !== "dubbed") {
            return NextResponse.json({
                _type: "status",
                dubbing_id: statusData.dubbing_id,
                name: statusData.name,
                status: statusData.status,
                source_language: statusData.source_language,
                target_languages: statusData.target_languages,
                editable: statusData.editable,
                created_at: statusData.created_at,
                error: statusData.error,
                media_metadata: statusData.media_metadata,
            });
        }

        // Paso 2: Si está listo, obtener recurso completo
        const resourceRes = await fetch(
            `${ELEVEN_BASE}/dubbing/resource/${id}`,
            { headers: { "xi-api-key": apiKey } }
        );

        if (!resourceRes.ok) {
            // Si el Resource API falla, aún retornar
            // el status como fallback
            return NextResponse.json({
                _type: "status",
                dubbing_id: statusData.dubbing_id,
                name: statusData.name,
                status: statusData.status,
                source_language: statusData.source_language,
                target_languages: statusData.target_languages,
                editable: statusData.editable,
                created_at: statusData.created_at,
                media_metadata: statusData.media_metadata,
                _resource_error: `Resource API: ${resourceRes.status}`,
            });
        }

        const resourceData = await resourceRes.json();
        return NextResponse.json({
            _type: "resource",
            ...resourceData,
        });
    } catch (err) {
        return NextResponse.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : "Error desconocido",
            },
            { status: 500 }
        );
    }
}
