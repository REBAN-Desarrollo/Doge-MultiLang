"use client";

import { cn } from "@/lib/utils";
import type { SpeakerSegment } from "@/lib/elevenlabs";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface SegmentTableProps {
    segments: SpeakerSegment[];
    /** IDs de segmentos seleccionados */
    selected: Set<string>;
    /** Toggle selección de un segmento */
    onToggle: (id: string) => void;
    /** Toggle selección de todos */
    onToggleAll: () => void;
    /** Idiomas target configurados */
    targetLanguages: string[];
}

/** Formatear segundos a MM:SS.ms */
function formatTime(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toFixed(1).padStart(4, "0")}`;
}

export function SegmentTable({
    segments,
    selected,
    onToggle,
    onToggleAll,
    targetLanguages,
}: SegmentTableProps) {
    const allSelected =
        segments.length > 0 &&
        segments.every((s) => selected.has(s.id));

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
                <thead>
                    <tr
                        className={
                            "border-b border-border text-left " +
                            "text-xs font-medium uppercase " +
                            "tracking-wider text-muted-foreground"
                        }
                    >
                        <th className="pb-3 pl-4 pr-2">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={onToggleAll}
                                className={
                                    "h-3.5 w-3.5 rounded border-border " +
                                    "accent-primary"
                                }
                            />
                        </th>
                        <th className="px-2 pb-3">#</th>
                        <th className="px-2 pb-3">Tiempo</th>
                        <th className="px-2 pb-3">
                            Texto (fuente)
                        </th>
                        {targetLanguages.map((lang) => (
                            <th key={lang} className="px-2 pb-3">
                                {lang.toUpperCase()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {segments.map((seg, i) => {
                        const isSelected = selected.has(seg.id);
                        return (
                            <tr
                                key={seg.id}
                                onClick={() => onToggle(seg.id)}
                                className={cn(
                                    "cursor-pointer border-b",
                                    "border-border/50",
                                    "transition-colors",
                                    isSelected
                                        ? "bg-primary/5"
                                        : "hover:bg-accent/30"
                                )}
                            >
                                {/* Checkbox */}
                                <td className="py-3 pl-4 pr-2">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className={
                                            "h-3.5 w-3.5 rounded " +
                                            "border-border accent-primary"
                                        }
                                    />
                                </td>

                                {/* Índice */}
                                <td className="px-2 py-3">
                                    <span
                                        className={
                                            "font-mono text-xs " +
                                            "text-muted-foreground"
                                        }
                                    >
                                        {i + 1}
                                    </span>
                                </td>

                                {/* Timestamps */}
                                <td className="px-2 py-3">
                                    <span
                                        className={
                                            "font-mono text-xs " +
                                            "text-muted-foreground"
                                        }
                                    >
                                        {formatTime(seg.start_time)}
                                        {" → "}
                                        {formatTime(seg.end_time)}
                                    </span>
                                </td>

                                {/* Texto fuente */}
                                <td className="max-w-xs px-2 py-3">
                                    <p className="text-sm leading-relaxed">
                                        {seg.text}
                                    </p>
                                </td>

                                {/* Status por idioma */}
                                {targetLanguages.map((lang) => {
                                    const dub = seg.dubs[lang];
                                    return (
                                        <td key={lang} className="px-2 py-3">
                                            <DubStatus dub={dub} />
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {segments.length === 0 && (
                <div
                    className={
                        "flex items-center justify-center py-12 " +
                        "text-sm text-muted-foreground"
                    }
                >
                    No hay segmentos disponibles.
                </div>
            )}
        </div>
    );
}

/** Indicador de estado del dub de un segmento */
function DubStatus({
    dub,
}: {
    dub?: {
        text?: string;
        audio_stale: boolean;
        media_ref?: { url: string };
    };
}) {
    if (!dub) {
        return (
            <Badge
                variant="outline"
                className={
                    "border-zinc-700 text-[10px] " +
                    "text-zinc-500"
                }
            >
                —
            </Badge>
        );
    }

    if (dub.audio_stale || !dub.media_ref) {
        // Traducido pero no doblado aún
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        variant="outline"
                        className={
                            "border-amber-500/30 " +
                            "bg-amber-500/10 text-[10px] " +
                            "text-amber-400"
                        }
                    >
                        Traducido
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs text-xs">
                        {dub.text || "Sin texto"}
                    </p>
                </TooltipContent>
            </Tooltip>
        );
    }

    // Doblado con audio
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge
                    variant="outline"
                    className={
                        "border-emerald-500/30 " +
                        "bg-emerald-500/10 text-[10px] " +
                        "text-emerald-400"
                    }
                >
                    ✓ Doblado
                </Badge>
            </TooltipTrigger>
            <TooltipContent>
                <p className="max-w-xs text-xs">
                    {dub.text || "Audio listo"}
                </p>
            </TooltipContent>
        </Tooltip>
    );
}
