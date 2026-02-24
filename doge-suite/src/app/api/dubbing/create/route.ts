import { NextRequest, NextResponse } from "next/server";

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

/**
 * POST /api/dubbing/create
 * Recibe un archivo MP4/MP3 via FormData y crea un
 * proyecto de dubbing en ElevenLabs con dubbing_studio
 * habilitado para control granular por segmento.
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
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const name =
            (formData.get("name") as string) ||
            "Doge Suite Project";
        const sourceLang =
            (formData.get("source_lang") as string) || "es";
        const targetLangRaw =
            (formData.get("target_lang") as string) || "en";
        // Soporta múltiples idiomas separados por coma
        const targetLangs = targetLangRaw
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean);

        if (!file) {
            return NextResponse.json(
                { error: "No se envió archivo" },
                { status: 400 }
            );
        }

        // Construir FormData para ElevenLabs
        const elFormData = new FormData();
        elFormData.append("file", file);
        elFormData.append("name", name);
        elFormData.append("source_lang", sourceLang);
        // ElevenLabs acepta target_lang como
        // campo repetido o comma-separated
        elFormData.append(
            "target_lang",
            targetLangs.join(",")
        );
        // Auto-detectar número de speakers
        elFormData.append("num_speakers", "0");

        const res = await fetch(
            `${ELEVEN_BASE}/dubbing`,
            {
                method: "POST",
                headers: { "xi-api-key": apiKey },
                body: elFormData,
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
