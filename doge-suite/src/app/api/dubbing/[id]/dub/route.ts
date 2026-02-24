import { NextRequest, NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

/**
 * POST /api/dubbing/[id]/dub
 * Proxy a POST /v1/dubbing/resource/{id}/dub.
 * Genera audio doblado para segmentos específicos.
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

    try {
        const res = await fetch(
            `${ELEVEN_BASE}/dubbing/resource/${id}/dub`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
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
