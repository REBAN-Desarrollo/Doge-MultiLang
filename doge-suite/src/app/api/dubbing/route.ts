import { NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

/**
 * GET /api/dubbing
 * Lista todos los proyectos de dubbing desde
 * ElevenLabs.
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
            `${ELEVEN_BASE}/dubbing`,
            {
                headers: { "xi-api-key": apiKey },
                // No cachear — siempre datos frescos
                cache: "no-store",
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

        const data = await res.json();
        return NextResponse.json(data);
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
