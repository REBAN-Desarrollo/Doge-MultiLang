import { NextRequest, NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

/**
 * POST /api/dubbing/[id]/render
 * Proxy a POST /v1/dubbing/resource/{id}/render/{lang}
 * Renderiza el audio final para un idioma.
 */
export async function POST(
    req: NextRequest,
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
    const body = await req.json();
    const { language, render_type = "mp3" } = body;

    if (!language) {
        return NextResponse.json(
            { error: "Falta 'language' en el body" },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `${ELEVEN_BASE}/dubbing/resource/${id}` +
            `/render/${language}`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ render_type }),
            }
        );

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                {
                    error: `ElevenLabs: ${res.status}`,
                    detail: text,
                },
                { status: res.status }
            );
        }

        return NextResponse.json(await res.json());
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
