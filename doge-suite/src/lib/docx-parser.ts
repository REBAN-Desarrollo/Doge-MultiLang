/**
 * DOCX Script Parser — TypeScript port
 * Basado en el parser de AI-Studio:
 * `AI-Studio/backend/services/process/docx_parser.py`
 *
 * Usa mammoth para convertir DOCX → texto plano,
 * luego extrae PERSONAJE: diálogo de la sección
 * "Desarrollo de Guión".
 */
import mammoth from "mammoth";

// ── Tipos ──

export interface DialogLine {
    character: string;
    text: string;
    lineNumber: number;
}

export interface SceneBlock {
    number: number;
    title: string;
    dialogues: DialogLine[];
}

export interface ParsedScript {
    filename: string;
    scenes: SceneBlock[];
    characters: string[];
    totalDialogues: number;
    totalChars: number;
}

// ── Regex patterns ──

// Encabezados de escena formales:
// ESCENA 1, ESC. 2, SCENE 3
const SCENE_HEADER_RE = new RegExp(
    "^(?:ESCENA|ESC\\.?|SCENE)\\s*" +
    "(\\d+(?:\\.\\d+)?)\\s*[-–—:.]?\\s*(.*)$",
    "i"
);

// Número de escena desnudo: solo un número
// (como aparece en tablas del DOCX de QPH)
const BARE_SCENE_RE = /^(\d+(?:\.\d+)?)$/;

// PERSONAJE: texto del diálogo
// Soporta tildes y ñ en nombres
const DIALOGUE_RE = new RegExp(
    "^([A-Za-záéíóúñÁÉÍÓÚÑ]" +
    "[A-Za-záéíóúñÁÉÍÓÚÑ\\s\\d]*?)" +
    "(?:\\s*\\([^)]*\\))?\\s*[:]\\s*(.+)$",
    "u"
);

// ── Líneas a ignorar ──
// Patrones que NO son diálogo ni continuación

/** Palabras clave que indican metadata, no voz */
const SKIP_WORDS = new Set([
    "listo", "libre", "pendiente",
]);

/** Patrones para ignorar líneas */
function isSkippableLine(line: string): boolean {
    const lower = line.toLowerCase().trim();

    // Vacía
    if (!lower) return true;

    // URLs
    if (
        lower.startsWith("http") ||
        lower.startsWith("//") ||
        lower.startsWith("www.")
    )
        return true;

    // Metadatos de una sola palabra
    if (SKIP_WORDS.has(lower)) return true;

    // Nombres de fondo/escenario (sin ":")
    // que se confunden con contenido
    // <= 3 palabras sin verbo → probablemente
    // nombre de fondo
    const wordCount = lower.split(/\s+/).length;
    if (wordCount <= 2 && !lower.includes(":"))
        return true;

    // Stage directions (acciones de personaje)
    // Generalmente empiezan con artículo/verbo
    // en tercera persona o empiezan con "Se ve"
    if (
        lower.startsWith("se ve ") ||
        lower.startsWith("se le ") ||
        lower.startsWith("entra ") ||
        lower.startsWith("sale ") ||
        lower.startsWith("su amigo ") ||
        lower.startsWith("les pregunta ") ||
        lower.startsWith("le pregunta ") ||
        lower.startsWith("le dice ") ||
        lower.startsWith("el maestro ") ||
        lower.startsWith("la directora ") ||
        lower.startsWith("empieza a ") ||
        lower.startsWith("dice ") ||
        lower.startsWith("pasan ") ||
        lower.startsWith("camina ") ||
        lower.startsWith("todos ") ||
        lower.startsWith("-marcados ")
    )
        return true;

    return false;
}

/**
 * Determinar si una línea es una acotación
 * (stage direction) vs continuación de diálogo.
 *
 * Las acotaciones hablan en tercera persona
 * del personaje, los diálogos en primera.
 */
function isStageDirection(line: string): boolean {
    const lower = line.toLowerCase().trim();

    // Patrones comunes de acotaciones
    const stagePatterns = [
        /^se ve\b/,
        /^se le\b/,
        /^se \w+ (con|al|a |en |de )/,
        /^el \w+ (se |lo |la |le |entra|sale)/,
        /^la \w+ (se |lo |la |le |entra|sale)/,
        /^los \w+ (se |lo |la |le |entra|sale)/,
        /^las \w+ (se |lo |la |le |entra|sale)/,
        /^entra\b/,
        /^sale\b/,
        /^camina\b/,
        /^corre\b/,
        /^pasan\b/,
        /^dice\b/,
        /^le dice\b/,
        /^le pregunta\b/,
        /^les dice\b/,
        /^les pregunta\b/,
        /^empieza a\b/,
        /^todos (?:gaspean|se |lo |van)/,
        /^su amigo\b/,
        /\bse asienta\b/,
        /\bse sienta\b/,
        /\bse levanta\b/,
        /\bse acerca\b/,
        /\bse quita\b/,
        /\bse pone\b/,
        /\bavientaa?\b/,
        /\bsale del\b/,
        /\bentra a\b/,
        /\bcon una\b.*\ben la\b/,
    ];

    return stagePatterns.some((p) =>
        p.test(lower)
    );
}

// ── Parser principal ──

/**
 * Parsear un archivo DOCX desde un buffer.
 */
export async function parseDocxBuffer(
    buffer: ArrayBuffer,
    filename: string
): Promise<ParsedScript> {
    const result = await mammoth.extractRawText({
        arrayBuffer: buffer,
    });
    const rawText = result.value;

    return parseTextContent(rawText, filename);
}

/**
 * Parsear texto plano ya extraído.
 * Busca la sección "Desarrollo de Guión" y
 * desde ahí extrae escenas y diálogos.
 */
export function parseTextContent(
    rawText: string,
    filename: string
): ParsedScript {
    const lines = rawText.split("\n");
    const scenes: SceneBlock[] = [];
    let currentScene: SceneBlock | null = null;
    let lastSpeaker: string | null = null;

    // Buscar donde empieza el contenido real
    // (después de "Desarrollo de Guión")
    let startIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim()
            .toLowerCase();
        if (
            trimmed.includes(
                "desarrollo de guión"
            ) ||
            trimmed.includes(
                "desarrollo de guion"
            )
        ) {
            startIdx = i + 1;
            break;
        }
    }

    // Si no encontramos la sección, empezar
    // desde el principio (fallback)
    if (startIdx === 0) {
        // Buscar primer número de escena
        for (let i = 0; i < lines.length; i++) {
            const trimmed = lines[i].trim();
            if (
                BARE_SCENE_RE.test(trimmed) &&
                parseFloat(trimmed) === 1
            ) {
                startIdx = i;
                break;
            }
        }
    }

    let blankCount = 0;

    for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
            blankCount++;
            // 3+ blanks = column/section break
            if (blankCount >= 3) {
                lastSpeaker = null;
            }
            continue;
        }

        const prevBlanks = blankCount;
        blankCount = 0;

        // ¿Encabezado de escena formal?
        const sceneMatch =
            SCENE_HEADER_RE.exec(line);
        if (sceneMatch) {
            const num = parseFloat(
                sceneMatch[1]
            );
            const title =
                sceneMatch[2].trim() ||
                `Escena ${num}`;
            currentScene = {
                number: num,
                title,
                dialogues: [],
            };
            scenes.push(currentScene);
            lastSpeaker = null;
            continue;
        }

        // ¿Número de escena desnudo?
        const bareMatch =
            BARE_SCENE_RE.exec(line);
        if (bareMatch) {
            const num = parseFloat(
                bareMatch[1]
            );
            const lastSceneNum =
                currentScene?.number ?? 0;
            if (
                num > lastSceneNum ||
                num === 1
            ) {
                currentScene = {
                    number: num,
                    title: `Escena ${num}`,
                    dialogues: [],
                };
                scenes.push(currentScene);
                lastSpeaker = null;
            }
            continue;
        }

        // ¿Línea de diálogo? (PERSONAJE: texto)
        const dialogueMatch =
            DIALOGUE_RE.exec(line);
        if (dialogueMatch) {
            const character = dialogueMatch[1]
                .trim()
                .split(/\s+/)
                .map(
                    (w) =>
                        w.charAt(0)
                            .toUpperCase() +
                        w.slice(1).toLowerCase()
                )
                .join(" ");
            const text =
                dialogueMatch[2].trim();

            // Filtrar metadata
            const metaKeys = [
                "fecha", "nombre clave",
                "género", "genero",
                "logline", "sitio", "formato",
                "idea", "escritor", "referencia",
                "publicación", "publicacion",
                "inspiración", "inspiracion",
                "personaje", "aspecto neutro",
                "nombre del archivo",
                "variantes", "estado",
                "fondos", "notas", "objetos",
                "animador", "fondo", "español",
                "desarrollo", "escena",
                "documento portadas",
                "banda fb", "cambio de vestuario",
                "fb", "yt", "tt",
            ];
            const charLower = character
                .toLowerCase();
            if (
                metaKeys.includes(charLower)
            ) {
                lastSpeaker = null;
                continue;
            }

            // Filtrar URLs y referencias
            const fullLine = line.toLowerCase();
            if (
                fullLine.includes("http") ||
                fullLine.includes("youtu") ||
                fullLine.includes(".com/") ||
                fullLine.includes(".be/") ||
                fullLine.includes("recrear") ||
                fullLine.includes(
                    "ver referencia"
                ) ||
                fullLine.includes(
                    "referencia visual"
                )
            ) {
                lastSpeaker = null;
                continue;
            }

            lastSpeaker = character;

            if (!currentScene) {
                currentScene = {
                    number: 1,
                    title: "Sin título",
                    dialogues: [],
                };
                scenes.push(currentScene);
            }

            if (text) {
                currentScene.dialogues.push({
                    character,
                    text,
                    lineNumber: i + 1,
                });
            }
        } else if (
            currentScene &&
            lastSpeaker &&
            prevBlanks <= 2 &&
            line.length >= 5 &&
            /^[a-záéíóúñ¿¡]/.test(line) &&
            !isSkippableLine(line) &&
            !isStageDirection(line)
        ) {
            // Continuación: solo si empieza
            // con minúscula (texto hablado)
            // y viene justo después
            currentScene.dialogues.push({
                character: lastSpeaker,
                text: line,
                lineNumber: i + 1,
            });
        } else {
            // Cualquier otra línea rompe
            // la cadena de continuación
            lastSpeaker = null;
        }
    }

    // Construir resultado
    const charSet = new Set<string>();
    let totalDialogues = 0;
    let totalChars = 0;

    for (const scene of scenes) {
        totalDialogues += scene.dialogues.length;
        for (const d of scene.dialogues) {
            charSet.add(d.character);
            totalChars += d.text.length;
        }
    }

    return {
        filename,
        scenes,
        characters: [...charSet].sort(),
        totalDialogues,
        totalChars,
    };
}

/**
 * Aplanar todas las escenas en una lista
 * lineal de diálogos para la UI.
 */
export function flattenDialogues(
    script: ParsedScript
): (DialogLine & { scene: number })[] {
    return script.scenes.flatMap((s) =>
        s.dialogues.map((d) => ({
            ...d,
            scene: s.number,
        }))
    );
}
