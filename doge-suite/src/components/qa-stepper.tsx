"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Shield,
    FileCheck,
    Globe,
    Volume2,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { QAReport, GateStatus } from "@/types/ssot";
import {
    GATE_NAMES,
    GATE_DESCRIPTIONS,
    type GateKey,
    getGateStatusColor,
    getGateStatusIcon,
    getVerdictColor,
    getGateProgress,
    createEmptyReport,
    loadReport,
} from "@/lib/qa-pipeline";

// ── Props ──

interface QAStepperProps {
    projectId: string;
    languages: string[];
    /** Idioma actualmente seleccionado */
    selectedLang?: string;
    /** Callback para ejecutar un gate */
    onRunGate?: (
        gate: GateKey,
        language: string
    ) => void;
    className?: string;
}

// ── Gate config ──

const GATE_ICONS = {
    preflight: Shield,
    en_master: FileCheck,
    multi_lang: Globe,
    audio_output: Volume2,
} as const;

const GATE_ORDER: GateKey[] = [
    "preflight",
    "en_master",
    "multi_lang",
    "audio_output",
];

// ── Status dot ──

function StatusDot({
    status,
    size = "md",
}: {
    status: GateStatus;
    size?: "sm" | "md";
}) {
    const sizeClass =
        size === "sm" ? "h-2 w-2" : "h-3 w-3";

    const colorMap: Record<GateStatus, string> = {
        pass: "bg-emerald-400 shadow-emerald-400/50",
        warning:
            "bg-amber-400 shadow-amber-400/50",
        fail: "bg-red-400 shadow-red-400/50",
        running:
            "bg-blue-400 shadow-blue-400/50 animate-pulse",
        skipped: "bg-zinc-600",
        pending: "bg-zinc-600",
    };

    return (
        <span
            className={cn(
                "inline-block rounded-full shadow-sm",
                sizeClass,
                colorMap[status]
            )}
        />
    );
}

// ── Componente Principal ──

export function QAStepper({
    projectId,
    languages,
    selectedLang,
    onRunGate,
    className,
}: QAStepperProps) {
    const [activeLang, setActiveLang] = useState(
        selectedLang || languages[0] || "en"
    );
    const [expanded, setExpanded] = useState(false);
    const [version, setVersion] = useState(0);

    const handleRunGate = useCallback(
        (gate: GateKey) => {
            if (onRunGate) {
                onRunGate(gate, activeLang);
                // Forzar re-render para
                // recargar el report
                setVersion((v) => v + 1);
            }
        },
        [onRunGate, activeLang]
    );

    // Cargar report del idioma activo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _reload = version; // fuerza re-render
    const report: QAReport =
        loadReport(projectId, activeLang) ||
        createEmptyReport(projectId, activeLang);

    const progress = getGateProgress(report);

    return (
        <div
            className={cn(
                "glass-card space-y-3 p-5",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-violet-400" />
                    <h3 className="text-sm font-semibold">
                        QA Pipeline
                    </h3>
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-[10px]",
                            getVerdictColor(
                                report.verdict
                            )
                        )}
                    >
                        {report.verdict ===
                            "approved"
                            ? "Aprobado"
                            : report.verdict ===
                                "conditional"
                                ? "Condicional"
                                : report.verdict ===
                                    "rejected"
                                    ? "Rechazado"
                                    : `${progress.completed}/4`}
                    </Badge>
                    <Link
                        href={`/localization/${projectId}/qa`}
                        className={cn(
                            "text-[10px]",
                            "text-muted-foreground",
                            "hover:text-violet-400",
                            "underline-offset-2",
                            "hover:underline",
                            "transition-colors"
                        )}
                    >
                        Ver detalle →
                    </Link>
                </div>

                {/* Selector de idioma */}
                <div className="flex items-center gap-2">
                    <select
                        value={activeLang}
                        onChange={(e) =>
                            setActiveLang(
                                e.target.value
                            )
                        }
                        className={cn(
                            "rounded-md border",
                            "border-border",
                            "bg-background",
                            "px-2 py-1 text-xs"
                        )}
                    >
                        {languages.map((l) => (
                            <option
                                key={l}
                                value={l}
                            >
                                {l.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() =>
                            setExpanded(!expanded)
                        }
                        className={cn(
                            "rounded-md p-1",
                            "text-muted-foreground",
                            "hover:bg-accent/50",
                            "transition-colors"
                        )}
                    >
                        {expanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Stepper visual */}
            <div className="flex items-center gap-1">
                {GATE_ORDER.map((key, i) => {
                    const gate = report.gates[key];
                    const Icon = GATE_ICONS[key];
                    const isBlocking =
                        key === "preflight" ||
                        key === "en_master";

                    return (
                        <div
                            key={key}
                            className="flex flex-1 items-center"
                        >
                            {/* Gate card */}
                            <div
                                className={cn(
                                    "flex flex-1 items-center",
                                    "gap-2 rounded-lg",
                                    "border px-3 py-2",
                                    "transition-all",
                                    gate.status ===
                                        "pass"
                                        ? "border-emerald-500/20 bg-emerald-500/5"
                                        : gate.status ===
                                            "fail"
                                            ? "border-red-500/20 bg-red-500/5"
                                            : gate.status ===
                                                "warning"
                                                ? "border-amber-500/20 bg-amber-500/5"
                                                : "border-border bg-background"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "h-4 w-4 shrink-0",
                                        getGateStatusColor(
                                            gate.status
                                        )
                                    )}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <StatusDot
                                            status={
                                                gate.status
                                            }
                                            size="sm"
                                        />
                                        <span className="truncate text-xs font-medium">
                                            {
                                                GATE_NAMES[
                                                key
                                                ]
                                            }
                                        </span>
                                    </div>
                                    {isBlocking && (
                                        <span className="text-[9px] text-muted-foreground/60">
                                            BLOCKING
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Flecha entre gates */}
                            {i < 3 && (
                                <ArrowRight className="mx-1 h-3 w-3 shrink-0 text-muted-foreground/30" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Detalles expandibles */}
            {expanded && (
                <div className="space-y-2 pt-2">
                    {GATE_ORDER.map((key) => {
                        const gate =
                            report.gates[key];
                        const Icon =
                            GATE_ICONS[key];

                        return (
                            <div
                                key={key}
                                className={cn(
                                    "rounded-lg border",
                                    "border-border/50",
                                    "bg-background/50",
                                    "p-3"
                                )}
                            >
                                <div className="flex items-start gap-2">
                                    <Icon
                                        className={cn(
                                            "mt-0.5 h-4 w-4",
                                            "shrink-0",
                                            getGateStatusColor(
                                                gate.status
                                            )
                                        )}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold">
                                                    Gate{" "}
                                                    {
                                                        gate.gate
                                                    }

                                                    :{" "}
                                                    {
                                                        GATE_NAMES[
                                                        key
                                                        ]
                                                    }
                                                </span>
                                                <span className="text-[10px]">
                                                    {getGateStatusIcon(
                                                        gate.status
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {gate.executed_at && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(
                                                            gate.executed_at
                                                        ).toLocaleString(
                                                            "es-MX"
                                                        )}
                                                    </span>
                                                )}
                                                {onRunGate && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-6 gap-1 px-2 text-[10px]"
                                                        onClick={() =>
                                                            handleRunGate(key)
                                                        }
                                                    >
                                                        <PlayCircle className="h-3 w-3" />
                                                        Run
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            {
                                                GATE_DESCRIPTIONS[
                                                key
                                                ]
                                            }
                                        </p>

                                        {/* Errores */}
                                        {gate.errors
                                            .length >
                                            0 && (
                                                <div className="mt-2 space-y-1">
                                                    {gate.errors.map(
                                                        (
                                                            err,
                                                            i
                                                        ) => (
                                                            <div
                                                                key={
                                                                    i
                                                                }
                                                                className={cn(
                                                                    "flex items-start gap-1.5",
                                                                    "rounded px-2 py-1",
                                                                    "text-[11px]",
                                                                    err.severity ===
                                                                        "critical"
                                                                        ? "bg-red-500/10 text-red-300"
                                                                        : err.severity ===
                                                                            "major"
                                                                            ? "bg-amber-500/10 text-amber-300"
                                                                            : "bg-zinc-500/10 text-zinc-300"
                                                                )}
                                                            >
                                                                <span className="shrink-0">
                                                                    {err.severity ===
                                                                        "critical"
                                                                        ? "🔴"
                                                                        : err.severity ===
                                                                            "major"
                                                                            ? "🟡"
                                                                            : "⚪"}
                                                                </span>
                                                                <span>
                                                                    {
                                                                        err.detail
                                                                    }
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                        {/* Métricas */}
                                        {gate.metrics &&
                                            Object
                                                .keys(
                                                    gate.metrics
                                                )
                                                .length >
                                            0 && (
                                                <div className="mt-2 flex flex-wrap gap-3">
                                                    {Object.entries(
                                                        gate.metrics
                                                    ).map(
                                                        ([
                                                            k,
                                                            v,
                                                        ]) => (
                                                            <span
                                                                key={
                                                                    k
                                                                }
                                                                className="text-[10px] text-muted-foreground"
                                                            >
                                                                <span className="font-mono">
                                                                    {
                                                                        k
                                                                    }
                                                                </span>
                                                                :{" "}
                                                                <span className="font-semibold text-foreground">
                                                                    {typeof v ===
                                                                        "number"
                                                                        ? v.toFixed(
                                                                            2
                                                                        )
                                                                        : v}
                                                                </span>
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
