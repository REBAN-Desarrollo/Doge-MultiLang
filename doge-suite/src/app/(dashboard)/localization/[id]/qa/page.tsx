"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Shield,
    FileCheck,
    Globe,
    Volume2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { QAReport } from "@/types/ssot";
import { getLanguageTier } from "@/types/ssot";
import {
    GATE_NAMES,
    GATE_DESCRIPTIONS,
    type GateKey,
    getGateStatusIcon,
    getVerdictColor,
    getGateProgress,
    createEmptyReport,
    loadProjectReports,
} from "@/lib/qa-pipeline";

type Params = Promise<{ id: string }>;

const GATE_ORDER: GateKey[] = [
    "preflight",
    "en_master",
    "multi_lang",
    "audio_output",
];

const GATE_ICONS = {
    preflight: Shield,
    en_master: FileCheck,
    multi_lang: Globe,
    audio_output: Volume2,
} as const;

export default function QADetailPage(
    props: { params: Params }
) {
    const { id: projectId } = use(props.params);
    const reports = loadProjectReports(projectId);

    // Determinar idiomas del proyecto
    const languages = useMemo(() => {
        const fromReports = Object.keys(reports);
        if (fromReports.length > 0) {
            return fromReports;
        }
        // Fallback: mostrar Tier 1
        return ["en", "pt", "de", "it", "fr"];
    }, [reports]);

    // Generar reports para idiomas sin datos
    const allReports: Record<string, QAReport> =
        useMemo(() => {
            const result: Record<
                string,
                QAReport
            > = {};
            for (const lang of languages) {
                result[lang] =
                    reports[lang] ||
                    createEmptyReport(
                        projectId,
                        lang
                    );
            }
            return result;
        }, [languages, reports, projectId]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href={`/localization/${projectId}`}
                    className={cn(
                        "inline-flex items-center",
                        "gap-1 text-sm",
                        "text-muted-foreground",
                        "hover:text-foreground"
                    )}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al proyecto
                </Link>

                <div className="mt-3 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-violet-400" />
                    <h1 className="text-xl font-bold">
                        QA Pipeline
                    </h1>
                    <Badge
                        variant="outline"
                        className="text-xs"
                    >
                        {languages.length} idiomas
                    </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    Matriz de calidad por idioma
                    — 4 Gates del Gold Standard
                </p>
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>🟢 Pass</span>
                <span>🟡 Warning</span>
                <span>🔴 Fail</span>
                <span>⚪ Pendiente</span>
                <span>🔵 Ejecutando</span>
                <span>⚫ Saltado</span>
                <span className="ml-4 border-l border-border pl-4">
                    T1 = Tier 1 (100% review) •
                    T2 = Tier 2 (30% muestreo) •
                    T3 = Tier 3 (auto)
                </span>
            </div>

            {/* Tabla Matriz */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                                Idioma
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                                Tier
                            </th>
                            {GATE_ORDER.map(
                                (key) => {
                                    const Icon =
                                        GATE_ICONS[
                                        key
                                        ];
                                    return (
                                        <th
                                            key={
                                                key
                                            }
                                            className="px-3 py-2 text-center"
                                        >
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-[11px] font-semibold text-muted-foreground">
                                                    {
                                                        GATE_NAMES[
                                                        key
                                                        ]
                                                    }
                                                </span>
                                            </div>
                                        </th>
                                    );
                                }
                            )}
                            <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                                Veredicto
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                                WER
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                                Errores
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {languages.map(
                            (lang) => {
                                const report =
                                    allReports[
                                    lang
                                    ];
                                const tier =
                                    getLanguageTier(
                                        lang
                                    );
                                const progress =
                                    getGateProgress(
                                        report
                                    );

                                const tierColors: Record<
                                    number,
                                    string
                                > = {
                                    1: "bg-emerald-500/20 text-emerald-300",
                                    2: "bg-amber-500/20 text-amber-300",
                                    3: "bg-zinc-500/20 text-zinc-300",
                                };

                                const verdictLabels: Record<
                                    string,
                                    string
                                > = {
                                    approved:
                                        "✅ Aprobado",
                                    conditional:
                                        "⚠️ Condicional",
                                    rejected:
                                        "❌ Rechazado",
                                    pending:
                                        `⏳ ${progress.completed}/4`,
                                };

                                return (
                                    <tr
                                        key={lang}
                                        className={cn(
                                            "border-b border-border/30",
                                            "transition-colors",
                                            "hover:bg-accent/20"
                                        )}
                                    >
                                        {/* Idioma */}
                                        <td className="px-3 py-2.5">
                                            <span className="font-mono font-semibold uppercase">
                                                {
                                                    lang
                                                }
                                            </span>
                                        </td>

                                        {/* Tier */}
                                        <td className="px-3 py-2.5">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px]",
                                                    tierColors[
                                                    tier
                                                    ]
                                                )}
                                            >
                                                T
                                                {
                                                    tier
                                                }
                                            </Badge>
                                        </td>

                                        {/* Gates */}
                                        {GATE_ORDER.map(
                                            (
                                                key
                                            ) => {
                                                const gate =
                                                    report
                                                        .gates[
                                                    key
                                                    ];
                                                const isNA =
                                                    key ===
                                                    "en_master" &&
                                                    lang !==
                                                    "en";

                                                return (
                                                    <td
                                                        key={
                                                            key
                                                        }
                                                        className="px-3 py-2.5 text-center"
                                                    >
                                                        {isNA ? (
                                                            <span className="text-xs text-muted-foreground/40">
                                                                —
                                                            </span>
                                                        ) : (
                                                            <span className="text-base">
                                                                {getGateStatusIcon(
                                                                    gate.status
                                                                )}
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            }
                                        )}

                                        {/* Veredicto */}
                                        <td className="px-3 py-2.5 text-center">
                                            <span
                                                className={cn(
                                                    "text-xs font-medium",
                                                    getVerdictColor(
                                                        report.verdict
                                                    )
                                                )}
                                            >
                                                {
                                                    verdictLabels[
                                                    report
                                                        .verdict
                                                    ]
                                                }
                                            </span>
                                        </td>

                                        {/* WER */}
                                        <td className="px-3 py-2.5 text-center font-mono text-xs">
                                            {report
                                                .metrics
                                                .wer !=
                                                null
                                                ? `${report.metrics.wer.toFixed(1)}%`
                                                : "—"}
                                        </td>

                                        {/* Errores */}
                                        <td className="px-3 py-2.5 text-center">
                                            {report
                                                .errors
                                                .length >
                                                0 ? (
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[10px]",
                                                        report
                                                            .metrics
                                                            .category_a_flags >
                                                            0
                                                            ? "border-red-500/30 text-red-400"
                                                            : "border-amber-500/30 text-amber-400"
                                                    )}
                                                >
                                                    {
                                                        report
                                                            .errors
                                                            .length
                                                    }
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/40">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>

            {/* Gate descriptions */}
            <div className="grid grid-cols-2 gap-3">
                {GATE_ORDER.map((key) => {
                    const Icon = GATE_ICONS[key];
                    const isBlocking =
                        key === "preflight" ||
                        key === "en_master";

                    return (
                        <div
                            key={key}
                            className={cn(
                                "rounded-lg border",
                                "border-border/50",
                                "bg-card/50 p-3"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-violet-400" />
                                <span className="text-xs font-semibold">
                                    {GATE_NAMES[key]}
                                </span>
                                {isBlocking && (
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[9px]",
                                            "border-red-500/20",
                                            "text-red-400"
                                        )}
                                    >
                                        BLOCKING
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                                {
                                    GATE_DESCRIPTIONS[
                                    key
                                    ]
                                }
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
