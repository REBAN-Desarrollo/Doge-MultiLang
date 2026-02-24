import { NextRequest, NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

/**
 * GET /api/dubbing/[id]/audio?lang=en
 * Proxy a GET /v1/dubbing/{id}/audio/{lang}
 * Retorna el audio doblado como stream.
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
        req.nextUrl.searchParams.get("lang") || "en";

    try {
        const res = await fetch(
            `${ELEVEN_BASE}/dubbing/${id}/audio/${lang}`,
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

        // Stream del audio como respuesta
        const contentType =
            res.headers.get("content-type") ||
            "audio/mpeg";

        const blob = await res.blob();
        const buffer = await blob.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition":
                    `attachment; filename="dub_${id}_${lang}.mp3"`,
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
