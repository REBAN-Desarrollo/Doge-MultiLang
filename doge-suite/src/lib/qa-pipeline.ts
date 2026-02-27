/**
 * QA Pipeline — 4 Gates del Gold Standard
 *
 * Gate 1: Pre-Flight (BLOCKING)
 *   Blacklists, safety, anti-patrones, expansión
 *
 * Gate 2: EN Master Audit (BLOCKING)
 *   COMET >0.85, LLM Judges, revisión humana
 *
 * Gate 3: Multi-Idioma (ASYNC por tier)
 *   T1: COMET+humano, T2: muestreo, T3: auto
 *
 * Gate 4: Audio Output (ASYNC)
 *   WER, MOS, timing drift, speaker consistency
 */

import type {
    QAReport,
    GateResult,
    GateStatus,
    LanguageTier,
    QAError,
} from "@/types/ssot";
import { getLanguageTier } from "@/types/ssot";

// ── Gate Names ────────────────────────────────

export const GATE_NAMES = {
    preflight: "Pre-Flight",
    en_master: "EN Master Audit",
    multi_lang: "Multi-Idioma",
    audio_output: "Audio Output",
} as const;

export const GATE_DESCRIPTIONS = {
    preflight:
        "Blacklists, safety, anti-patrones " +
        "narrativos, expansión de texto",
    en_master:
        "COMET >0.85, 3 LLM Judges, " +
        "revisión Saul/Ivan 100%",
    multi_lang:
        "Validación por tier: T1 COMET+humano, " +
        "T2 muestreo 30%, T3 auto",
    audio_output:
        "WER, MOS (UTMOS), timing drift, " +
        "speaker consistency, emoción",
} as const;

export type GateKey = keyof typeof GATE_NAMES;

// ── Persistence (localStorage MVP) ────────────

const STORAGE_KEY = "doge_qa_reports";

export function getAllReports(): Record<
    string,
    Record<string, QAReport>
> {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

/** Guardar QA report de un proyecto + idioma */
export function saveReport(
    projectId: string,
    language: string,
    report: QAReport
): void {
    const all = getAllReports();
    if (!all[projectId]) all[projectId] = {};
    all[projectId][language] = report;
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(all)
    );
}

/** Cargar QA report de un proyecto + idioma */
export function loadReport(
    projectId: string,
    language: string
): QAReport | null {
    const all = getAllReports();
    return all[projectId]?.[language] || null;
}

/** Cargar todos los reports de un proyecto */
export function loadProjectReports(
    projectId: string
): Record<string, QAReport> {
    const all = getAllReports();
    return all[projectId] || {};
}

// ── Factory ───────────────────────────────────

function createEmptyGate(
    gate: 1 | 2 | 3 | 4,
    name: string
): GateResult {
    return {
        gate,
        name,
        status: "pending",
        errors: [],
    };
}

/** Crear un QA report vacío (todo pending) */
export function createEmptyReport(
    projectId: string,
    language: string
): QAReport {
    const tier = getLanguageTier(language);
    return {
        episode_id: projectId,
        language,
        tier,
        gates: {
            preflight: createEmptyGate(
                1,
                GATE_NAMES.preflight
            ),
            en_master: createEmptyGate(
                2,
                GATE_NAMES.en_master
            ),
            multi_lang: createEmptyGate(
                3,
                GATE_NAMES.multi_lang
            ),
            audio_output: createEmptyGate(
                4,
                GATE_NAMES.audio_output
            ),
        },
        metrics: {
            category_a_flags: 0,
        },
        errors: [],
        verdict: "pending",
        reviewed_by: "system",
        timestamp: new Date().toISOString(),
    };
}

// ── Gate Updates ───────────────────────────────

/** Actualizar el status de un gate */
export function updateGateStatus(
    report: QAReport,
    gate: GateKey,
    status: GateStatus,
    errors: QAError[] = [],
    metrics?: Record<string, number>
): QAReport {
    const updated = { ...report };
    updated.gates = { ...report.gates };
    updated.gates[gate] = {
        ...report.gates[gate],
        status,
        errors,
        executed_at: new Date().toISOString(),
        executed_by: "system",
        metrics,
    };

    // Recalcular errores globales y verdict
    updated.errors = [
        ...updated.gates.preflight.errors,
        ...updated.gates.en_master.errors,
        ...updated.gates.multi_lang.errors,
        ...updated.gates.audio_output.errors,
    ];

    updated.metrics = {
        ...updated.metrics,
        category_a_flags: updated.errors.filter(
            (e) => e.severity === "critical"
        ).length,
    };

    updated.verdict = computeVerdict(updated);
    updated.timestamp = new Date().toISOString();

    return updated;
}

// ── Verdict Computation ───────────────────────

function computeVerdict(
    report: QAReport
): QAReport["verdict"] {
    const gates = Object.values(report.gates);

    // Si algún gate falló → rejected
    if (gates.some((g) => g.status === "fail")) {
        return "rejected";
    }

    // Si algún gate tiene warning → conditional
    if (gates.some((g) => g.status === "warning")) {
        return "conditional";
    }

    // Si todos pasaron → approved
    if (gates.every((g) => g.status === "pass")) {
        return "approved";
    }

    // Aún hay gates pendientes
    return "pending";
}

// ── Utilidades ────────────────────────────────

/** Progreso general: cuántos gates completados */
export function getGateProgress(
    report: QAReport
): {
    completed: number;
    total: number;
    passed: number;
    failed: number;
} {
    const gates = Object.values(report.gates);
    return {
        completed: gates.filter(
            (g) =>
                g.status !== "pending" &&
                g.status !== "running"
        ).length,
        total: 4,
        passed: gates.filter(
            (g) => g.status === "pass"
        ).length,
        failed: gates.filter(
            (g) => g.status === "fail"
        ).length,
    };
}

/** Color del verdict para UI */
export function getVerdictColor(
    verdict: QAReport["verdict"]
): string {
    switch (verdict) {
        case "approved":
            return "text-emerald-400";
        case "conditional":
            return "text-amber-400";
        case "rejected":
            return "text-red-400";
        default:
            return "text-zinc-400";
    }
}

/** Color del gate status para UI */
export function getGateStatusColor(
    status: GateStatus
): string {
    switch (status) {
        case "pass":
            return "text-emerald-400";
        case "warning":
            return "text-amber-400";
        case "fail":
            return "text-red-400";
        case "running":
            return "text-blue-400";
        case "skipped":
            return "text-zinc-500";
        default:
            return "text-zinc-400";
    }
}

/** Icono emoji del gate status */
export function getGateStatusIcon(
    status: GateStatus
): string {
    switch (status) {
        case "pass":
            return "🟢";
        case "warning":
            return "🟡";
        case "fail":
            return "🔴";
        case "running":
            return "🔵";
        case "skipped":
            return "⚫";
        default:
            return "⚪";
    }
}

/**
 * ¿Gate 2 es aplicable? Solo si el idioma EN
 * está como target (o es el master audit)
 */
export function isGateApplicable(
    gate: GateKey,
    language: string,
    _tier: LanguageTier
): boolean {
    if (gate === "en_master") {
        return language === "en";
    }
    return true;
}
