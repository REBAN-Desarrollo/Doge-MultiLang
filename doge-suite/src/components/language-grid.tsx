"use client";

import { cn } from "@/lib/utils";
import {
    type LanguageRow,
    type LangStatus,
    getStatusStyle,
} from "@/lib/mock-languages";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface LanguageGridProps {
    languages: LanguageRow[];
    /** Filtro activo de tier */
    activeTier: number | null;
}

/** Celda de status con dot + label */
function StatusCell({
    status,
    werScore,
}: {
    status: LangStatus;
    werScore?: number;
}) {
    const style = getStatusStyle(status);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={cn(
                        "flex items-center gap-2 rounded-md px-2.5 py-1.5",
                        style.bg,
                        "transition-colors duration-200"
                    )}
                >
                    <span
                        className={cn(
                            "inline-block h-2 w-2 shrink-0 rounded-full",
                            style.dot
                        )}
                    />
                    <span
                        className={cn(
                            "text-xs font-medium",
                            style.text
                        )}
                    >
                        {style.label}
                    </span>
                </div>
            </TooltipTrigger>
            {werScore !== undefined && (
                <TooltipContent>
                    <p>
                        WER: {(werScore * 100).toFixed(1)}%
                        {werScore > 0.08 && " ⚠️ Alto"}
                    </p>
                </TooltipContent>
            )}
        </Tooltip>
    );
}

/** Tier badge */
function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
    const styles: Record<number, string> = {
        1: "bg-violet-500/15 text-violet-300 border-violet-500/20",
        2: "bg-blue-500/15 text-blue-300 border-blue-500/20",
        3: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
    };
    return (
        <Badge
            variant="outline"
            className={cn(
                "text-[10px] font-semibold",
                styles[tier]
            )}
        >
            T{tier}
        </Badge>
    );
}

/** Familia lingüística badge */
function FamilyBadge({
    family,
}: {
    family: LanguageRow["family"];
}) {
    const labels: Record<string, string> = {
        source: "Fuente",
        romance: "Romance",
        cjk: "CJK",
        other: "Pivote EN",
    };
    const styles: Record<string, string> = {
        source: "text-amber-400",
        romance: "text-emerald-400",
        cjk: "text-rose-400",
        other: "text-zinc-400",
    };
    return (
        <span
            className={cn(
                "text-[10px] font-medium",
                styles[family]
            )}
        >
            {labels[family]}
        </span>
    );
}

export function LanguageGrid({
    languages,
    activeTier,
}: LanguageGridProps) {
    const filtered =
        activeTier !== null
            ? languages.filter((l) => l.tier === activeTier)
            : languages;

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
                <thead>
                    <tr
                        className={
                            "border-b border-border text-left " +
                            "text-xs font-medium uppercase tracking-wider " +
                            "text-muted-foreground"
                        }
                    >
                        <th className="pb-3 pl-4 pr-2">Idioma</th>
                        <th className="px-2 pb-3">Tier</th>
                        <th className="px-2 pb-3">Ruta</th>
                        <th className="px-2 pb-3">Traducción</th>
                        <th className="px-2 pb-3">Dubbing</th>
                        <th className="px-2 pb-3">QA Auto</th>
                        <th className="px-2 pb-3 pr-4">QA Humano</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((lang, i) => (
                        <tr
                            key={lang.code}
                            className={cn(
                                "border-b border-border/50",
                                "transition-colors hover:bg-accent/30",
                                "animate-fade-in"
                            )}
                            style={{
                                animationDelay: `${i * 30}ms`,
                                animationFillMode: "both",
                            }}
                        >
                            {/* Idioma */}
                            <td className="py-3 pl-4 pr-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-lg leading-none">
                                        {lang.flag}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {lang.name}
                                        </p>
                                        <p
                                            className={
                                                "font-mono text-[10px] " +
                                                "text-muted-foreground"
                                            }
                                        >
                                            {lang.code.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Tier */}
                            <td className="px-2 py-3">
                                <TierBadge tier={lang.tier} />
                            </td>

                            {/* Familia / ruta */}
                            <td className="px-2 py-3">
                                <FamilyBadge family={lang.family} />
                            </td>

                            {/* Traducción */}
                            <td className="px-2 py-3">
                                <StatusCell
                                    status={lang.translation}
                                />
                            </td>

                            {/* Dubbing */}
                            <td className="px-2 py-3">
                                <StatusCell status={lang.dubbing} />
                            </td>

                            {/* QA Auto */}
                            <td className="px-2 py-3">
                                <StatusCell
                                    status={lang.qaAuto}
                                    werScore={lang.werScore}
                                />
                            </td>

                            {/* QA Humano */}
                            <td className="px-2 py-3 pr-4">
                                <StatusCell status={lang.qaHuman} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filtered.length === 0 && (
                <div
                    className={
                        "flex items-center justify-center py-12 " +
                        "text-sm text-muted-foreground"
                    }
                >
                    No hay idiomas en este tier.
                </div>
            )}
        </div>
    );
}
