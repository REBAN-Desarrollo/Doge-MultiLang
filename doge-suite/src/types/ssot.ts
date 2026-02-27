/**
 * SSOT Types — 4 JSONs canónicos del pipeline
 * de localización (Gold Standard Sección 4.3).
 *
 * Estos tipos son el contract entre todos los
 * módulos de doge-suite.
 */

// ── 1. Dialogue Objects ───────────────────────
// Productor: docx_parser → procesa el .docx
// de Andrea una sola vez

export interface DialogueLine {
    line_id: string;
    speaker: string;
    text_es: string;
    emotion?:
    | "happy"
    | "sad"
    | "angry"
    | "neutral"
    | "excited"
    | "scared"
    | "confused";
    visual_context?: string;
    max_duration_ms?: number;
    is_onomatopoeia?: boolean;
    timing?: {
        start_ms: number;
        end_ms: number;
    };
}

export interface DialogueScene {
    scene_id: string;
    start_ms: number;
    end_ms: number;
    lines: DialogueLine[];
}

export interface DialogueObjects {
    episode_id: string;
    source_language: string;
    total_lines: number;
    total_scenes: number;
    scenes: DialogueScene[];
}

// ── 2. Voice Manifest ─────────────────────────
// Productor: UI de asignación en doge-suite
// Mapeo personaje → voz por idioma

export interface CharacterVoice {
    name: string;
    /** voice_id del idioma fuente (ES) */
    voice_id_source?: string;
    gender?: "male" | "female" | "neutral";
    age_range?: string;
    formality?: "formal" | "informal" | "mixed";
    /** voice_id por idioma target */
    voice_ids_by_lang: Record<string, string>;
    /** ID del pronunciation dictionary */
    pronunciation_dictionary_id?: string;
    /** De dónde se heredó esta voz */
    inherited_from?: string;
}

export interface VoiceManifest {
    /** ID del proyecto de dubbing (ElevenLabs) */
    project_id: string;
    /** Prefijo de serie para herencia */
    series_prefix?: string;
    episode_id?: string;
    source_language: string;
    characters: CharacterVoice[];
    created_at: string;
    updated_at: string;
}

// ── 3. Timing Objects ─────────────────────────
// Productor: audit_service + Forced Alignment
// Timestamps reales post-dubbing

export interface TimingSegment {
    line_id: string;
    speaker: string;
    text_translated: string;
    timing_original: {
        start_ms: number;
        end_ms: number;
    };
    timing_dubbed: {
        start_ms: number;
        end_ms: number;
    };
    drift_ms: number;
    drift_pct: number;
    alignment_source?: "forced_alignment" | "whisper";
}

export interface TimingObjects {
    episode_id: string;
    language: string;
    segments: TimingSegment[];
}

// ── 4. QA Report ──────────────────────────────
// Productor: audit_service (4 Gates)
// Resultados de auditoría por idioma

/** Status de un gate individual */
export type GateStatus =
    | "pending"
    | "running"
    | "pass"
    | "warning"
    | "fail"
    | "skipped";

/** Tier de idioma según Gold Standard */
export type LanguageTier = 1 | 2 | 3;

export interface QAError {
    type:
    | "blacklist"
    | "timing_drift"
    | "wer_high"
    | "speaker_mismatch"
    | "safety"
    | "narrative"
    | "audio_quality"
    | "expansion"
    | "other";
    severity: "critical" | "major" | "minor";
    /** Puntos MQM: critical=25, major=5, minor=1 */
    mqm_points: number;
    line_id?: string;
    detail: string;
    suggestion?: string;
}

export interface GateResult {
    gate: 1 | 2 | 3 | 4;
    name: string;
    status: GateStatus;
    /** Timestamp de ejecución */
    executed_at?: string;
    /** Quién ejecutó (system | nombre) */
    executed_by?: string;
    errors: QAError[];
    /** Métricas específicas del gate */
    metrics?: Record<string, number>;
}

export interface QAReport {
    episode_id: string;
    language: string;
    tier: LanguageTier;
    /** Los 4 gates */
    gates: {
        preflight: GateResult;
        en_master: GateResult;
        multi_lang: GateResult;
        audio_output: GateResult;
    };
    /** Métricas globales */
    metrics: {
        wer?: number;
        comet_score?: number;
        mos_score?: number;
        timing_drift_avg_pct?: number;
        category_a_flags: number;
        speaker_consistency_score?: number;
        narrative_score?: number;
        vocal_5d_score?: number;
    };
    /** Todos los errores */
    errors: QAError[];
    verdict:
    | "approved"
    | "conditional"
    | "rejected"
    | "pending";
    reviewed_by: string;
    timestamp: string;
}

// ── Tiering ───────────────────────────────────

export const TIER_CONFIG: Record<
    LanguageTier,
    {
        wer_threshold: number;
        human_review: string;
        tts_model: string;
        languages: string[];
    }
> = {
    1: {
        wer_threshold: 5,
        human_review: "100%",
        tts_model: "eleven_v3",
        languages: [
            "en",
            "pt",
            "de",
            "it",
            "fr",
        ],
    },
    2: {
        wer_threshold: 10,
        human_review: "30% muestreo",
        tts_model: "eleven_v3",
        languages: [
            "ar",
            "ko",
            "ja",
            "hi",
            "zh",
            "ru",
            "tr",
        ],
    },
    3: {
        wer_threshold: 15,
        human_review: "Solo automático",
        tts_model: "flash_v2_5",
        languages: [
            "id",
            "th",
            "vi",
            "pl",
            "uk",
            "el",
            "ta",
            "ms",
            "fil",
            "sv",
            "nl",
            "ro",
        ],
    },
};

/** Obtener el tier de un idioma */
export function getLanguageTier(
    lang: string
): LanguageTier {
    if (lang === "es") return 1; // fuente
    for (const [tier, config] of Object.entries(
        TIER_CONFIG
    )) {
        if (config.languages.includes(lang)) {
            return Number(tier) as LanguageTier;
        }
    }
    return 3; // default
}
