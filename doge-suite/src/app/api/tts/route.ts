import { NextRequest, NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

/**
 * POST /api/tts
 * Genera audio TTS para un diálogo individual.
 * Body: { text, voice_id, language_code?, previous_text?, next_text? }
 * Retorna audio MP3.
 */
export async function POST(req: NextRequest) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "ELEVENLABS_API_KEY no configurada" },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const {
            text,
            voice_id,
            language_code,
            previous_text,
            next_text,
        } = body as {
            text: string;
            voice_id: string;
            language_code?: string;
            previous_text?: string;
            next_text?: string;
        };

        if (!text || !voice_id) {
            return NextResponse.json(
                { error: "text y voice_id son requeridos" },
                { status: 400 }
            );
        }

        // Construir payload para ElevenLabs TTS
        const payload: Record<string, unknown> = {
            text,
            model_id: "eleven_multilingual_v2",
        };

        if (language_code) {
            payload.language_code = language_code;
        }
        // Request stitching para continuidad natural
        if (previous_text) {
            payload.previous_text = previous_text;
        }
        if (next_text) {
            payload.next_text = next_text;
        }

        const res = await fetch(
            `${ELEVEN_BASE}/text-to-speech/${voice_id}` +
            `?output_format=mp3_44100_128`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                {
                    error: `ElevenLabs TTS: ${res.status}`,
                    detail: text,
                },
                { status: res.status }
            );
        }

        // Stream del audio como respuesta
        const blob = await res.blob();
        const buffer = await blob.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition":
                    'inline; filename="tts_output.mp3"',
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
