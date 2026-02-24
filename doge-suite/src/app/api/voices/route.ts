import { NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io";

/**
 * GET /api/voices
 * Proxy a GET /v2/voices?page_size=100
 * Retorna todas las voces disponibles en la cuenta.
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
            `${ELEVEN_BASE}/v2/voices?page_size=100`,
            { headers: { "xi-api-key": apiKey } }
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

        // Mapear a solo los campos que necesitamos
        // para el voice selector
        const voices = (data.voices || []).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (v: any) => ({
                voice_id: v.voice_id,
                name: v.name,
                category: v.category,
                labels: v.labels || {},
                preview_url: v.preview_url || null,
            })
        );

        return NextResponse.json({
            voices,
            total: voices.length,
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
