/**
 * DOCX Script Parser — TypeScript port
 * Basado en el parser de AI-Studio:
 * `AI-Studio/backend/services/process/docx_parser.py`
 *
 * Usa mammoth para convertir DOCX → texto plano,
 * luego aplica los mismos regex patterns del parser
 * original de Python para extraer PERSONAJE: diálogo.
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

// ── Regex patterns (del parser Python) ──

// ESCENA 1, ESC. 2, SCENE 3
const SCENE_RE = new RegExp(
    "^(?:ESCENA|ESC\\.?|SCENE)\\s*(\\d+(?:\\.\\d+)?)" +
    "\\s*[-–—:.]?\\s*(.*)$",
    "i"
);

// PERSONAJE: texto del diálogo
// Soporta tildes y ñ en nombres
const DIALOGUE_RE = new RegExp(
    "^([A-Za-záéíóúñÁÉÍÓÚÑ]" +
    "[A-Za-záéíóúñÁÉÍÓÚÑ\\s\\d]*?)" +
    "(?:\\s*\\([^)]*\\))?\\s*[:]\\s*(.+)$",
    "u"
);

// ── Parser principal ──

/**
 * Parsear un archivo DOCX desde un buffer (ArrayBuffer).
 * No necesita python-docx; usa mammoth en JS.
 */
export async function parseDocxBuffer(
    buffer: ArrayBuffer,
    filename: string
): Promise<ParsedScript> {
    // mammoth en browser usa arrayBuffer, no Node Buffer
    const result = await mammoth.extractRawText({
        arrayBuffer: buffer,
    });
    const rawText = result.value;

    return parseTextContent(rawText, filename);
}

/**
 * Parsear texto plano ya extraído.
 * Detecta escenas y diálogos con los mismos
 * regex del parser de AI-Studio.
 */
export function parseTextContent(
    rawText: string,
    filename: string
): ParsedScript {
    const lines = rawText.split("\n");
    const scenes: SceneBlock[] = [];
    let currentScene: SceneBlock | null = null;
    let lastSpeaker = "NARRADOR";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // ¿Es encabezado de escena?
        const sceneMatch = SCENE_RE.exec(line);
        if (sceneMatch) {
            const num = parseFloat(sceneMatch[1]);
            const title =
                sceneMatch[2].trim() || `Escena ${num}`;
            currentScene = {
                number: num,
                title,
                dialogues: [],
            };
            scenes.push(currentScene);
            continue;
        }

        // ¿Es línea de diálogo? (PERSONAJE: texto)
        const dialogueMatch = DIALOGUE_RE.exec(line);
        if (dialogueMatch) {
            const character = dialogueMatch[1]
                .trim()
                .split(/\s+/)
                .map(
                    (w) =>
                        w.charAt(0).toUpperCase() +
                        w.slice(1).toLowerCase()
                )
                .join(" ");
            const text = dialogueMatch[2].trim();
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
            line.length >= 2 &&
            !line.startsWith("*") &&
            currentScene
        ) {
            // Línea de continuación → mismo speaker
            currentScene.dialogues.push({
                character: lastSpeaker,
                text: line,
                lineNumber: i + 1,
            });
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
