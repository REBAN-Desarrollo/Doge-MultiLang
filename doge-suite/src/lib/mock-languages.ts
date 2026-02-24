// Datos mock de los 27 idiomas del pipeline QPH
// Estructura basada en el grid del spec 04_localization.md

export type LangStatus =
    | "done"
    | "ok"
    | "pass"
    | "fail"
    | "pending"
    | "queued"
    | "translating"
    | "generating"
    | "not_started"
    | "na";

export interface LanguageRow {
    /** Código ISO del idioma */
    code: string;
    /** Nombre del idioma */
    name: string;
    /** Emoji de bandera */
    flag: string;
    /** Tier de QA (1, 2, o 3) */
    tier: 1 | 2 | 3;
    /** Familia lingüística para routing */
    family: "source" | "romance" | "cjk" | "other";
    /** Status de traducción */
    translation: LangStatus;
    /** Status de dubbing */
    dubbing: LangStatus;
    /** Score de QA automático (WER) */
    qaAuto: LangStatus;
    /** WER score si aplica */
    werScore?: number;
    /** Status de QA humano */
    qaHuman: LangStatus;
}

/** Los 27 idiomas del pipeline QPH con datos mock */
export const LANGUAGES: LanguageRow[] = [
    // Fuente
    {
        code: "es",
        name: "Español",
        flag: "🇲🇽",
        tier: 1,
        family: "source",
        translation: "na",
        dubbing: "na",
        qaAuto: "na",
        qaHuman: "na",
    },
    // Tier 1 (5 idiomas — revisión humana + auto)
    {
        code: "en",
        name: "English",
        flag: "🇺🇸",
        tier: 1,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.03,
        qaHuman: "pass",
    },
    {
        code: "pt",
        name: "Português",
        flag: "🇧🇷",
        tier: 1,
        family: "romance",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.04,
        qaHuman: "pending",
    },
    {
        code: "de",
        name: "Deutsch",
        flag: "🇩🇪",
        tier: 1,
        family: "other",
        translation: "done",
        dubbing: "queued",
        qaAuto: "not_started",
        qaHuman: "not_started",
    },
    {
        code: "fr",
        name: "Français",
        flag: "🇫🇷",
        tier: 1,
        family: "romance",
        translation: "done",
        dubbing: "queued",
        qaAuto: "not_started",
        qaHuman: "not_started",
    },
    // Tier 2 (5 idiomas — sampling 30%)
    {
        code: "it",
        name: "Italiano",
        flag: "🇮🇹",
        tier: 2,
        family: "romance",
        translation: "done",
        dubbing: "generating",
        qaAuto: "not_started",
        qaHuman: "not_started",
    },
    {
        code: "ja",
        name: "日本語",
        flag: "🇯🇵",
        tier: 2,
        family: "cjk",
        translation: "done",
        dubbing: "fail",
        qaAuto: "fail",
        werScore: 0.12,
        qaHuman: "not_started",
    },
    {
        code: "ko",
        name: "한국어",
        flag: "🇰🇷",
        tier: 2,
        family: "cjk",
        translation: "translating",
        dubbing: "not_started",
        qaAuto: "not_started",
        qaHuman: "not_started",
    },
    {
        code: "ar",
        name: "العربية",
        flag: "🇸🇦",
        tier: 2,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.06,
        qaHuman: "pending",
    },
    {
        code: "ru",
        name: "Русский",
        flag: "🇷🇺",
        tier: 2,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.05,
        qaHuman: "not_started",
    },
    // Tier 3 (17 idiomas — auto-only)
    {
        code: "hi",
        name: "हिन्दी",
        flag: "🇮🇳",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.07,
        qaHuman: "na",
    },
    {
        code: "zh",
        name: "中文",
        flag: "🇨🇳",
        tier: 3,
        family: "cjk",
        translation: "done",
        dubbing: "queued",
        qaAuto: "not_started",
        qaHuman: "na",
    },
    {
        code: "th",
        name: "ไทย",
        flag: "🇹🇭",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "not_started",
        qaAuto: "not_started",
        qaHuman: "na",
    },
    {
        code: "vi",
        name: "Tiếng Việt",
        flag: "🇻🇳",
        tier: 3,
        family: "other",
        translation: "translating",
        dubbing: "not_started",
        qaAuto: "not_started",
        qaHuman: "na",
    },
    {
        code: "id",
        name: "Bahasa",
        flag: "🇮🇩",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.04,
        qaHuman: "na",
    },
    {
        code: "ms",
        name: "Melayu",
        flag: "🇲🇾",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.05,
        qaHuman: "na",
    },
    {
        code: "tr",
        name: "Türkçe",
        flag: "🇹🇷",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "queued",
        qaAuto: "not_started",
        qaHuman: "na",
    },
    {
        code: "pl",
        name: "Polski",
        flag: "🇵🇱",
        tier: 3,
        family: "other",
        translation: "pending",
        dubbing: "not_started",
        qaAuto: "not_started",
        qaHuman: "na",
    },
    {
        code: "nl",
        name: "Nederlands",
        flag: "🇳🇱",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.03,
        qaHuman: "na",
    },
    {
        code: "sv",
        name: "Svenska",
        flag: "🇸🇪",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.04,
        qaHuman: "na",
    },
    {
        code: "da",
        name: "Dansk",
        flag: "🇩🇰",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "generating",
        qaAuto: "not_started",
        qaHuman: "na",
    },
    {
        code: "fi",
        name: "Suomi",
        flag: "🇫🇮",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "fail",
        werScore: 0.11,
        qaHuman: "na",
    },
    {
        code: "no",
        name: "Norsk",
        flag: "🇳🇴",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.04,
        qaHuman: "na",
    },
    {
        code: "el",
        name: "Ελληνικά",
        flag: "🇬🇷",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "queued",
        qaAuto: "not_started",
        qaHuman: "na",
    },
    {
        code: "he",
        name: "עברית",
        flag: "🇮🇱",
        tier: 3,
        family: "other",
        translation: "translating",
        dubbing: "not_started",
        qaAuto: "not_started",
        qaHuman: "na",
    },
    {
        code: "cs",
        name: "Čeština",
        flag: "🇨🇿",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "pass",
        werScore: 0.05,
        qaHuman: "na",
    },
    {
        code: "ta",
        name: "தமிழ்",
        flag: "🇱🇰",
        tier: 3,
        family: "other",
        translation: "done",
        dubbing: "done",
        qaAuto: "fail",
        werScore: 0.15,
        qaHuman: "na",
    },
];

/**
 * Devuelve un color/clase CSS según el status
 */
export function getStatusStyle(status: LangStatus) {
    switch (status) {
        case "done":
        case "ok":
        case "pass":
            return {
                bg: "bg-emerald-500/15",
                text: "text-emerald-400",
                dot: "bg-emerald-400",
                label: statusLabel(status),
            };
        case "pending":
        case "queued":
        case "translating":
        case "generating":
            return {
                bg: "bg-amber-500/15",
                text: "text-amber-400",
                dot: "bg-amber-400",
                label: statusLabel(status),
            };
        case "fail":
            return {
                bg: "bg-red-500/15",
                text: "text-red-400",
                dot: "bg-red-400",
                label: statusLabel(status),
            };
        case "not_started":
            return {
                bg: "bg-zinc-500/10",
                text: "text-zinc-500",
                dot: "bg-zinc-600",
                label: "—",
            };
        case "na":
            return {
                bg: "bg-transparent",
                text: "text-zinc-600",
                dot: "bg-zinc-700",
                label: "N/A",
            };
    }
}

function statusLabel(s: LangStatus): string {
    const labels: Record<LangStatus, string> = {
        done: "Listo",
        ok: "OK",
        pass: "Pass",
        fail: "Fail",
        pending: "Pendiente",
        queued: "En cola",
        translating: "Traduciendo...",
        generating: "Generando...",
        not_started: "—",
        na: "N/A",
    };
    return labels[s];
}
