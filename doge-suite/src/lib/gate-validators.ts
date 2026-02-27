/**
 * Gate Validators — lógica real de cada Gate
 *
 * Gate 1: Pre-Flight (blacklists, safety,
 *         expansión, anti-patrones)
 * Gate 2: EN Master (placeholder → necesita
 *         COMET/LLM judges)
 * Gate 3: Multi-Idioma (por tier)
 * Gate 4: Audio Output (WER via STT)
 */

import type {
    QAError,
    QAReport,
    GateStatus,
} from "@/types/ssot";
import { getLanguageTier, TIER_CONFIG } from "@/types/ssot";
import type { GateKey } from "./qa-pipeline";
import {
    updateGateStatus,
    createEmptyReport,
    saveReport,
    loadReport,
} from "./qa-pipeline";
import type { ParsedScript } from "./docx-parser";

// ═══════════════════════════════════════════════
// GATE 1: PRE-FLIGHT
// ═══════════════════════════════════════════════

/** Palabras y frases bloqueadas */
const BLACKLIST_ES = [
    // Marcas registradas que no se deben traducir
    "coca cola", "pepsi", "mcdonald",
    "starbucks", "netflix", "disney",
    // Contenido de seguridad (QPH es para niños)
    "matar", "asesinar", "suicidar",
    "drogas", "heroína", "cocaína",
    "sexo", "violación",
    // Anti-patrones narrativos
    "jajaja", "xd", "lol", "omg",
    "wtf", "lmao",
];

/** Frases que suenan mal traducidas */
const ANTI_PATTERNS_ES = [
    {
        pattern: /esto va a estar en un\w*/i,
        detail:
            "Frase coloquial difícil de traducir",
    },
    {
        pattern: /no manch\w*/i,
        detail:
            "Expresión regional (México) sin " +
            "equivalente universal",
    },
    {
        pattern: /\bwey\b|\bgüey\b/i,
        detail:
            "Slang mexicano — usar alternativa " +
            "neutra para doblaje",
    },
    {
        pattern: /\bneta\b/i,
        detail:
            "Slang mexicano — ambiguo en " +
            "traducción automática",
    },
];

/**
 * Ratio máximo de expansión ES→EN/otros.
 * Si el texto traducido crece más de este %
 * respecto al original, puede no caber
 * en el timing.
 */
const MAX_EXPANSION_RATIO = 1.35; // +35%

/**
 * Ejecutar Gate 1: Pre-Flight
 * Usa los datos del DOCX parseado.
 */
export function runGate1PreFlight(
    script: ParsedScript
): {
    status: GateStatus;
    errors: QAError[];
    metrics: Record<string, number>;
} {
    const errors: QAError[] = [];
    let blacklistHits = 0;
    let safetyFlags = 0;
    let antiPatternHits = 0;

    // Recorrer todos los diálogos
    for (const scene of script.scenes) {
        for (const line of scene.dialogues) {
            const textLower = line.text.toLowerCase();

            // ── Blacklist check ──
            for (const word of BLACKLIST_ES) {
                if (textLower.includes(word)) {
                    blacklistHits++;
                    const isSafety = [
                        "matar", "asesinar", "suicidar",
                        "drogas", "heroína", "cocaína",
                        "sexo", "violación",
                    ].includes(word);

                    if (isSafety) safetyFlags++;

                    errors.push({
                        type: isSafety
                            ? "safety"
                            : "blacklist",
                        severity: isSafety
                            ? "critical"
                            : "major",
                        mqm_points: isSafety ? 25 : 5,
                        line_id: `L${line.lineNumber}`,
                        detail:
                            `"${word}" en línea ` +
                            `${line.lineNumber} ` +
                            `(${line.character}): ` +
                            `"${line.text.substring(0, 60)}..."`,
                        suggestion: isSafety
                            ? "Revisar contenido para " +
                            "audiencia infantil"
                            : "Verificar que no sea marca " +
                            "registrada o usar genérico",
                    });
                }
            }

            // ── Anti-patrones ──
            for (const ap of ANTI_PATTERNS_ES) {
                if (ap.pattern.test(line.text)) {
                    antiPatternHits++;
                    errors.push({
                        type: "narrative",
                        severity: "minor",
                        mqm_points: 1,
                        line_id: `L${line.lineNumber}`,
                        detail:
                            `Anti-patrón en L${line.lineNumber}` +
                            ` (${line.character}): ` +
                            `${ap.detail}`,
                        suggestion:
                            "Considerar reformular para " +
                            "mejor traducibilidad",
                    });
                }
            }

            // ── Expansión estimada ──
            // Regla general: EN es ~30% más largo
            // que ES. Si el texto ES ya es largo,
            // el EN podría no caber.
            const estimatedEN =
                line.text.length * MAX_EXPANSION_RATIO;
            if (estimatedEN > 200) {
                errors.push({
                    type: "expansion",
                    severity: "minor",
                    mqm_points: 1,
                    line_id: `L${line.lineNumber}`,
                    detail:
                        `Línea larga (${line.text.length} ` +
                        `chars, estimado EN: ` +
                        `${Math.round(estimatedEN)}). ` +
                        `Posible timing issue.`,
                    suggestion:
                        "Considerar dividir en 2 líneas",
                });
            }
        }
    }

    // Determinar status
    let status: GateStatus = "pass";
    if (safetyFlags > 0) {
        status = "fail"; // BLOCKING
    } else if (blacklistHits > 0) {
        status = "warning";
    } else if (antiPatternHits > 3) {
        status = "warning";
    }

    return {
        status,
        errors,
        metrics: {
            total_lines: script.totalDialogues,
            total_chars: script.totalChars,
            blacklist_hits: blacklistHits,
            safety_flags: safetyFlags,
            anti_patterns: antiPatternHits,
            expansion_warnings: errors.filter(
                (e) => e.type === "expansion"
            ).length,
        },
    };
}

// ═══════════════════════════════════════════════
// GATE 2: EN MASTER AUDIT
// ═══════════════════════════════════════════════

/**
 * Gate 2 — Auditoría del master EN.
 * Compara texto fuente (ES) vs dub (EN).
 *
 * En MVP: conteo de segmentos + validación
 * de que existe traducción para cada uno.
 * Futuro: COMET score + LLM judges.
 */
export function runGate2ENMaster(
    sourceTexts: string[],
    translatedTexts: string[]
): {
    status: GateStatus;
    errors: QAError[];
    metrics: Record<string, number>;
} {
    const errors: QAError[] = [];
    let missingTranslations = 0;
    let shortTranslations = 0;

    for (let i = 0; i < sourceTexts.length; i++) {
        const src = sourceTexts[i];
        const tgt = translatedTexts[i];

        if (!tgt || tgt.trim().length === 0) {
            missingTranslations++;
            errors.push({
                type: "other",
                severity: "critical",
                mqm_points: 25,
                line_id: `seg-${i}`,
                detail:
                    `Segmento ${i + 1} sin traducción ` +
                    `EN: "${src.substring(0, 50)}..."`,
            });
            continue;
        }

        // Traducción sospechosamente corta
        // (<30% del original)
        const ratio = tgt.length / src.length;
        if (ratio < 0.3 && src.length > 10) {
            shortTranslations++;
            errors.push({
                type: "other",
                severity: "major",
                mqm_points: 5,
                line_id: `seg-${i}`,
                detail:
                    `Segmento ${i + 1} tradución ` +
                    `muy corta (${Math.round(ratio * 100)}%` +
                    ` del original)`,
            });
        }
    }

    const coverage =
        sourceTexts.length > 0
            ? (sourceTexts.length - missingTranslations) /
            sourceTexts.length
            : 0;

    let status: GateStatus = "pass";
    if (missingTranslations > 0) {
        status = "fail";
    } else if (shortTranslations > 2) {
        status = "warning";
    }

    return {
        status,
        errors,
        metrics: {
            total_segments: sourceTexts.length,
            translated: sourceTexts.length -
                missingTranslations,
            coverage: Math.round(coverage * 100),
            short_translations: shortTranslations,
            // Futuro: comet_score, llm_judge_score
        },
    };
}

// ═══════════════════════════════════════════════
// GATE 3: MULTI-IDIOMA
// ═══════════════════════════════════════════════

/**
 * Gate 3 — Validación multi-idioma por tier.
 * Verifica que los dubs existan para cada
 * idioma target.
 */
export function runGate3MultiLang(
    language: string,
    translatedSegments: number,
    totalSegments: number
): {
    status: GateStatus;
    errors: QAError[];
    metrics: Record<string, number>;
} {
    const errors: QAError[] = [];
    const tier = getLanguageTier(language);
    const config = TIER_CONFIG[tier];
    const coverage =
        totalSegments > 0
            ? (translatedSegments / totalSegments) *
            100
            : 0;

    if (coverage < 100) {
        errors.push({
            type: "other",
            severity: coverage < 80
                ? "critical"
                : "major",
            mqm_points: coverage < 80 ? 25 : 5,
            detail:
                `${language.toUpperCase()}: ` +
                `${translatedSegments}/${totalSegments}` +
                ` segmentos traducidos ` +
                `(${coverage.toFixed(0)}%)`,
        });
    }

    let status: GateStatus = "pass";
    if (coverage < 80) status = "fail";
    else if (coverage < 100) status = "warning";

    return {
        status,
        errors,
        metrics: {
            tier,
            coverage: Math.round(coverage),
            wer_threshold: config.wer_threshold,
            // Futuro: comet_score por idioma
        },
    };
}

// ═══════════════════════════════════════════════
// GATE 4: AUDIO OUTPUT
// ═══════════════════════════════════════════════

/**
 * Gate 4 — Validación de audio output.
 * Compara texto esperado vs STT del audio.
 *
 * Calcula WER (Word Error Rate) simple.
 */
export function computeWER(
    reference: string,
    hypothesis: string
): number {
    const refWords = reference
        .toLowerCase()
        .trim()
        .split(/\s+/);
    const hypWords = hypothesis
        .toLowerCase()
        .trim()
        .split(/\s+/);

    if (refWords.length === 0) return 0;

    // Levenshtein a nivel de palabras
    const m = refWords.length;
    const n = hypWords.length;
    const dp: number[][] = Array.from(
        { length: m + 1 },
        () => Array(n + 1).fill(0)
    );

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (refWords[i - 1] === hypWords[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] =
                    1 +
                    Math.min(
                        dp[i - 1][j],     // deletion
                        dp[i][j - 1],     // insertion
                        dp[i - 1][j - 1]  // substitution
                    );
            }
        }
    }

    return (dp[m][n] / m) * 100;
}

/**
 * Gate 4 — Evaluar audio output.
 * Compara pares de (texto esperado, STT result).
 */
export function runGate4AudioOutput(
    language: string,
    pairs: Array<{
        expected: string;
        sttResult: string;
    }>
): {
    status: GateStatus;
    errors: QAError[];
    metrics: Record<string, number>;
} {
    const errors: QAError[] = [];
    const tier = getLanguageTier(language);
    const threshold = TIER_CONFIG[tier].wer_threshold;

    let totalWER = 0;
    let highWERCount = 0;

    for (let i = 0; i < pairs.length; i++) {
        const { expected, sttResult } = pairs[i];
        const wer = computeWER(expected, sttResult);

        totalWER += wer;

        if (wer > threshold) {
            highWERCount++;
            errors.push({
                type: "wer_high",
                severity: wer > threshold * 2
                    ? "critical"
                    : "major",
                mqm_points: wer > threshold * 2 ? 25 : 5,
                line_id: `seg-${i}`,
                detail:
                    `Segmento ${i + 1}: WER ` +
                    `${wer.toFixed(1)}% ` +
                    `(umbral T${tier}: ${threshold}%)`,
                suggestion:
                    `Esperado: "${expected.substring(0, 50)}"` +
                    ` | STT: "${sttResult.substring(0, 50)}"`,
            });
        }
    }

    const avgWER =
        pairs.length > 0
            ? totalWER / pairs.length
            : 0;

    let status: GateStatus = "pass";
    if (avgWER > threshold * 1.5) {
        status = "fail";
    } else if (avgWER > threshold) {
        status = "warning";
    }

    return {
        status,
        errors,
        metrics: {
            avg_wer: Math.round(avgWER * 10) / 10,
            wer_threshold: threshold,
            high_wer_segments: highWERCount,
            total_segments: pairs.length,
            tier,
        },
    };
}

// ═══════════════════════════════════════════════
// ORQUESTADOR
// ═══════════════════════════════════════════════

/**
 * Ejecutar un gate específico y guardarlo
 * en el QA report del proyecto.
 */
export function executeGate(
    projectId: string,
    language: string,
    gate: GateKey,
    result: {
        status: GateStatus;
        errors: QAError[];
        metrics?: Record<string, number>;
    }
): QAReport {
    let report =
        loadReport(projectId, language) ||
        createEmptyReport(projectId, language);

    report = updateGateStatus(
        report,
        gate,
        result.status,
        result.errors,
        result.metrics
    );

    saveReport(projectId, language, report);
    return report;
}
