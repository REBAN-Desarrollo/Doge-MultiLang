import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL =
    "https://openrouter.ai/api/v1/chat/completions";

/**
 * POST /api/llm/translate
 *
 * Traduce diálogos del DOCX a un idioma target
 * usando OpenRouter (Gemini/GPT/Claude).
 *
 * Body: {
 *   dialogues: { character: string, text: string }[],
 *   targetLang: string,  // "en", "pt", etc.
 *   context?: string     // info extra para el LLM
 * }
 *
 * Returns: {
 *   translations: string[]
 * }
 */
export async function POST(req: NextRequest) {
    const apiKey =
        process.env.OPENROUTER_API_KEY_TRANSLATION ||
        process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            {
                error:
                    "OPENROUTER_API_KEY_TRANSLATION " +
                    "no configurada",
            },
            { status: 500 }
        );
    }

    const body = await req.json();
    const {
        dialogues,
        targetLang = "en",
        context = "",
    } = body as {
        dialogues: {
            character: string;
            text: string;
        }[];
        targetLang: string;
        context?: string;
    };

    if (
        !dialogues ||
        !Array.isArray(dialogues) ||
        dialogues.length === 0
    ) {
        return NextResponse.json(
            { error: "Sin diálogos para traducir" },
            { status: 400 }
        );
    }

    // Construir el prompt — solo texto, sin
    // nombres de personaje (esos ya se muestran
    // en la UI aparte)
    const dialogueLines = dialogues
        .map(
            (d, i) =>
                `[${i}] ${d.text}`
        )
        .join("\n");

    const langNames: Record<string, string> = {
        en: "English",
        pt: "Brazilian Portuguese",
        fr: "French",
        de: "German",
        it: "Italian",
        ja: "Japanese",
        ko: "Korean",
        zh: "Mandarin Chinese",
        ar: "Arabic",
        ru: "Russian",
        tr: "Turkish",
        hi: "Hindi",
    };
    const langName =
        langNames[targetLang] ||
        targetLang.toUpperCase();

    // Extraer nombres únicos para el filtro
    const charNames = [
        ...new Set(
            dialogues.map((d) =>
                d.character.toLowerCase()
            )
        ),
    ];

    const systemPrompt =
        `You are a professional dubbing ` +
        `translator for animated children's ` +
        `shows. Translate dialogue lines ` +
        `from Spanish to ${langName}.\n\n` +
        `CRITICAL RULES:\n` +
        `- Translate ONLY the dialogue text\n` +
        `- Do NOT include character names ` +
        `or prefixes like "Maestro:" or ` +
        `"Teacher:" in your output\n` +
        `- Keep the same tone and emotion\n` +
        `- This is a children's show, keep ` +
        `language appropriate\n` +
        `- Match approximate lip-sync length\n` +
        `- Return ONLY a JSON array of ` +
        `translated strings\n` +
        `- Each element = translated dialogue ` +
        `text only, no speaker labels\n` +
        (context
            ? `\nContext: ${context}\n`
            : "");

    const userPrompt =
        `Translate these ${dialogues.length} ` +
        `dialogue lines to ${langName}.\n` +
        `Return ONLY the translated text, ` +
        `NO character names.\n\n` +
        `${dialogueLines}\n\n` +
        `Return a JSON array with exactly ` +
        `${dialogues.length} strings. ` +
        `Example: ["Hello!", "How are you?"]`;

    try {
        const res = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer":
                    "https://doge-suite.reban.com",
                "X-Title": "Doge Suite Translation",
            },
            body: JSON.stringify({
                model: "xiaomi/mimo-v2-flash",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 4096,
            }),
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                {
                    error: `OpenRouter: ${res.status}`,
                    detail: text,
                },
                { status: res.status }
            );
        }

        const data = await res.json();
        const content =
            data.choices?.[0]?.message?.content ||
            "";

        // Parsear JSON del response
        const jsonStr = content
            .replace(/^```json\s*/i, "")
            .replace(/```\s*$/, "")
            .trim();

        let translations: string[];
        try {
            translations = JSON.parse(jsonStr);
        } catch {
            translations = jsonStr
                .split("\n")
                .filter(
                    (l: string) =>
                        l.trim().length > 0
                )
                .map(
                    (l: string) =>
                        l
                            .replace(
                                /^\d+[.\)]\s*/,
                                ""
                            )
                            .replace(/^"/, "")
                            .replace(/"[,]?$/, "")
                );
        }

        // Post-procesamiento: strip nombres
        // de personaje que el LLM pudo incluir
        translations = translations.map((t) => {
            let cleaned = t.trim();
            // Quitar "Nombre: " al inicio
            for (const name of charNames) {
                const re = new RegExp(
                    `^${name}\\s*:\\s*`,
                    "i"
                );
                cleaned = cleaned.replace(
                    re,
                    ""
                );
            }
            // Patrones genéricos en inglés
            cleaned = cleaned
                .replace(
                    /^(Teacher|Friend|Director|Principal|Kid|Boy|Girl|Mom|Dad|Singer|Security|Designer|Manager|Host|Driver)\s*:\s*/i,
                    ""
                );
            return cleaned;
        });

        // Validar longitud
        if (
            translations.length !==
            dialogues.length
        ) {
            console.warn(
                `Translation count mismatch: ` +
                `got ${translations.length}, ` +
                `expected ${dialogues.length}`
            );
            while (
                translations.length <
                dialogues.length
            ) {
                translations.push(
                    "(sin traducción)"
                );
            }
            translations = translations.slice(
                0,
                dialogues.length
            );
        }

        return NextResponse.json({
            translations,
            model: data.model,
            usage: data.usage,
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
