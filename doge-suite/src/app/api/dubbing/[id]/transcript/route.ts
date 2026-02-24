import { NextRequest, NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

/**
 * GET /api/dubbing/[id]/transcript?lang=source&format=srt
 * Proxy a GET /v1/dubbing/{id}/transcripts/{lang}/format/{fmt}
 * Retorna la transcripción en SRT o WebVTT.
 */
export async function GET(
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
    const lang =
        req.nextUrl.searchParams.get("lang") || "source";
    const format =
        req.nextUrl.searchParams.get("format") || "srt";

    try {
        const url =
            `${ELEVEN_BASE}/dubbing/${id}` +
            `/transcripts/${lang}/format/${format}`;

        const res = await fetch(url, {
            headers: { "xi-api-key": apiKey },
        });

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
