import { NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

/**
 * GET /api/elevenlabs
 * Verifica la API key y retorna info de la cuenta
 * (créditos usados / disponibles).
 */
export async function GET() {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "ELEVENLABS_API_KEY no configurada" },
            { status: 500 }
        );
    }

    try {
        const res = await fetch(
            `${ELEVEN_BASE}/user/subscription`,
            {
                headers: { "xi-api-key": apiKey },
            }
        );

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                {
                    error: `ElevenLabs API error: ${res.status}`,
                    detail: text,
                },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({
            subscription: {
                character_count: data.character_count,
                character_limit: data.character_limit,
                tier: data.tier,
            },
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
