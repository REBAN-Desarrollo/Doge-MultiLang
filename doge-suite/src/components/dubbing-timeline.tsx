"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut } from "lucide-react";

// ── Tipos ──

export interface TimelineSegment {
    id: string;
    character: string;
    text: string;
    startSec: number;
    endSec: number;
    /** Estado del segmento */
    status: "original" | "translated" | "dubbed";
}

interface DubbingTimelineProps {
    segments: TimelineSegment[];
    /** Duración total en segundos */
    duration: number;
    /** Tiempo actual de reproducción */
    currentTime: number;
    /** ID del segmento seleccionado */
    selectedId: string | null;
    /** Callback al clickear un segmento */
    onSeek: (timeSec: number) => void;
    /** Callback al seleccionar un segmento */
    onSelect: (segment: TimelineSegment) => void;
}

// Colores por personaje (se repiten cíclicamente)
const SPEAKER_COLORS = [
    "bg-violet-500/40 border-violet-500/60",
    "bg-blue-500/40 border-blue-500/60",
    "bg-emerald-500/40 border-emerald-500/60",
    "bg-amber-500/40 border-amber-500/60",
    "bg-rose-500/40 border-rose-500/60",
    "bg-cyan-500/40 border-cyan-500/60",
    "bg-fuchsia-500/40 border-fuchsia-500/60",
    "bg-lime-500/40 border-lime-500/60",
];

const SPEAKER_SELECTED = [
    "ring-2 ring-violet-400 bg-violet-500/60",
    "ring-2 ring-blue-400 bg-blue-500/60",
    "ring-2 ring-emerald-400 bg-emerald-500/60",
    "ring-2 ring-amber-400 bg-amber-500/60",
    "ring-2 ring-rose-400 bg-rose-500/60",
    "ring-2 ring-cyan-400 bg-cyan-500/60",
    "ring-2 ring-fuchsia-400 bg-fuchsia-500/60",
    "ring-2 ring-lime-400 bg-lime-500/60",
];

const LABEL_W = 112; // px — ancho fijo de labels

/** Formatear segundos a MM:SS */
function fmtTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

// Niveles de zoom
const ZOOM_LEVELS = [1, 1.5, 2, 3, 5, 8];

export function DubbingTimeline({
    segments,
    duration,
    currentTime,
    selectedId,
    onSeek,
    onSelect,
}: DubbingTimelineProps) {
    // ── Zoom ──
    const [zoomIdx, setZoomIdx] = useState(0);
    const zoom = ZOOM_LEVELS[zoomIdx];
    const scrollRef = useRef<HTMLDivElement>(null);

    // ── Drag del playhead ──
    const dragging = useRef(false);
    const trackRef = useRef<HTMLDivElement>(null);

    /** Calcular tiempo desde posición X del mouse
     *  relativo al contenedor scrollable */
    const timeFromMouseX = useCallback(
        (clientX: number) => {
            const track = trackRef.current;
            if (!track) return 0;
            const rect = track.getBoundingClientRect();
            const pct = Math.max(
                0,
                Math.min(
                    1,
                    (clientX - rect.left) / rect.width
                )
            );
            return pct * duration;
        },
        [duration]
    );

    const handleDragStart = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            dragging.current = true;
            onSeek(timeFromMouseX(e.clientX));

            const onMove = (ev: MouseEvent) => {
                if (dragging.current) {
                    onSeek(
                        timeFromMouseX(ev.clientX)
                    );
                }
            };
            const onUp = () => {
                dragging.current = false;
                window.removeEventListener(
                    "mousemove",
                    onMove
                );
                window.removeEventListener(
                    "mouseup",
                    onUp
                );
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        },
        [timeFromMouseX, onSeek]
    );

    // Agrupar segmentos por speaker (filas)
    const speakers = useMemo(() => {
        const map = new Map<
            string,
            TimelineSegment[]
        >();
        for (const seg of segments) {
            const arr = map.get(seg.character) || [];
            arr.push(seg);
            map.set(seg.character, arr);
        }
        return Array.from(map.entries());
    }, [segments]);

    // Map speaker → color index
    const speakerColorMap = useMemo(() => {
        const m = new Map<string, number>();
        speakers.forEach(([name], i) => {
            m.set(name, i % SPEAKER_COLORS.length);
        });
        return m;
    }, [speakers]);

    // Marcas de tiempo en el eje X
    const timeMarks = useMemo(() => {
        if (duration <= 0) return [];
        const baseInterval =
            duration > 300 ? 60 : duration > 60 ? 30 : 10;
        const interval = Math.max(
            5,
            Math.round(baseInterval / zoom)
        );
        const marks: number[] = [];
        for (let t = 0; t <= duration; t += interval) {
            marks.push(t);
        }
        return marks;
    }, [duration, zoom]);

    if (segments.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                No hay segmentos en la timeline.
            </div>
        );
    }

    const playheadPct =
        duration > 0
            ? (currentTime / duration) * 100
            : 0;

    const ROW_H = 36;

    return (
        <div className="space-y-2">
            {/* ── Zoom + time display ── */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() =>
                        setZoomIdx((i) =>
                            Math.max(0, i - 1)
                        )
                    }
                    disabled={zoomIdx === 0}
                    className="rounded-md p-1 text-muted-foreground hover:bg-white/10 hover:text-white disabled:opacity-30"
                    title="Alejar"
                >
                    <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[3ch] text-center text-[10px] font-medium text-muted-foreground">
                    {zoom}x
                </span>
                <button
                    onClick={() =>
                        setZoomIdx((i) =>
                            Math.min(
                                ZOOM_LEVELS.length - 1,
                                i + 1
                            )
                        )
                    }
                    disabled={
                        zoomIdx ===
                        ZOOM_LEVELS.length - 1
                    }
                    className="rounded-md p-1 text-muted-foreground hover:bg-white/10 hover:text-white disabled:opacity-30"
                    title="Acercar"
                >
                    <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {fmtTime(currentTime)} /{" "}
                    {fmtTime(duration)}
                </span>
            </div>

            {/* ── Layout: labels fijos + tracks
                scrollables ── */}
            <div className="flex rounded-lg border border-white/10 bg-white/[0.02]">
                {/* Columna fija: labels */}
                <div
                    className="shrink-0 border-r border-white/10"
                    style={{ width: LABEL_W }}
                >
                    {/* Espacio para el header del
                        eje de tiempo */}
                    <div
                        className="border-b border-white/10"
                        style={{ height: 28 }}
                    />
                    {/* Nombres de speakers */}
                    {speakers.map(([name]) => (
                        <div
                            key={name}
                            className="flex items-center justify-end truncate pr-3 text-xs font-medium"
                            style={{ height: ROW_H }}
                        >
                            {name}
                        </div>
                    ))}
                </div>

                {/* Columna scrollable: timeline */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-x-auto"
                >
                    <div
                        style={{
                            width: `${zoom * 100}%`,
                            minWidth: "100%",
                        }}
                    >
                        {/* Eje de tiempo + playhead
                            handle */}
                        <div
                            ref={trackRef}
                            className="relative cursor-pointer border-b border-white/10 select-none"
                            style={{ height: 28 }}
                            onMouseDown={
                                handleDragStart
                            }
                        >
                            {timeMarks.map((t) => (
                                <span
                                    key={t}
                                    className="absolute top-1 -translate-x-1/2 text-[10px] text-muted-foreground"
                                    style={{
                                        left: `${(t / duration) * 100}%`,
                                    }}
                                >
                                    {fmtTime(t)}
                                </span>
                            ))}

                            {/* Playhead */}
                            <div
                                className="absolute top-0 h-full pointer-events-none"
                                style={{
                                    left: `${playheadPct}%`,
                                }}
                            >
                                <div className="absolute left-0 top-0 h-full w-0.5 bg-red-500" />
                                <div
                                    className="absolute -left-[5px] bottom-0 cursor-grab active:cursor-grabbing pointer-events-auto"
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeft:
                                            "6px solid transparent",
                                        borderRight:
                                            "6px solid transparent",
                                        borderBottom:
                                            "8px solid #ef4444",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Filas de segmentos */}
                        {speakers.map(
                            ([name, segs]) => {
                                const colorIdx =
                                    speakerColorMap.get(
                                        name
                                    ) || 0;
                                const colorClass =
                                    SPEAKER_COLORS[
                                    colorIdx
                                    ];
                                const selectedClass =
                                    SPEAKER_SELECTED[
                                    colorIdx
                                    ];

                                return (
                                    <div
                                        key={name}
                                        className="relative cursor-pointer"
                                        style={{
                                            height: ROW_H,
                                        }}
                                        onMouseDown={(
                                            e
                                        ) => {
                                            const rect =
                                                e.currentTarget.getBoundingClientRect();
                                            const pct =
                                                (e.clientX -
                                                    rect.left) /
                                                rect.width;
                                            onSeek(
                                                pct *
                                                duration
                                            );
                                        }}
                                    >
                                        <div className="absolute inset-0 rounded bg-white/[0.02]" />

                                        {/* Playhead
                                            line */}
                                        <div
                                            className="absolute top-0 h-full w-0.5 bg-red-500/50 pointer-events-none"
                                            style={{
                                                left: `${playheadPct}%`,
                                            }}
                                        />

                                        {segs.map(
                                            (seg) => {
                                                const left =
                                                    (seg.startSec /
                                                        duration) *
                                                    100;
                                                const width =
                                                    ((seg.endSec -
                                                        seg.startSec) /
                                                        duration) *
                                                    100;
                                                const isActive =
                                                    currentTime >=
                                                    seg.startSec &&
                                                    currentTime <
                                                    seg.endSec;
                                                const isSelected =
                                                    seg.id ===
                                                    selectedId;

                                                return (
                                                    <div
                                                        key={
                                                            seg.id
                                                        }
                                                        title={`${seg.character}: ${seg.text.slice(0, 60)}...`}
                                                        onClick={(
                                                            e
                                                        ) => {
                                                            e.stopPropagation();
                                                            onSeek(
                                                                seg.startSec
                                                            );
                                                            onSelect(
                                                                seg
                                                            );
                                                        }}
                                                        onMouseDown={(
                                                            e
                                                        ) =>
                                                            e.stopPropagation()
                                                        }
                                                        className={cn(
                                                            "absolute top-1 bottom-1 rounded-sm border transition-all cursor-pointer",
                                                            "hover:brightness-125",
                                                            isSelected
                                                                ? selectedClass
                                                                : colorClass,
                                                            isActive &&
                                                            !isSelected &&
                                                            "ring-1 ring-white/50 brightness-150"
                                                        )}
                                                        style={{
                                                            left: `${left}%`,
                                                            width: `${Math.max(width, 0.3)}%`,
                                                        }}
                                                    >
                                                        {width >
                                                            3 && (
                                                                <span className="absolute inset-0 flex items-center overflow-hidden px-1 text-[9px] leading-tight text-white/70">
                                                                    {seg.text.slice(
                                                                        0,
                                                                        30
                                                                    )}
                                                                </span>
                                                            )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                {speakers.map(([name]) => {
                    const idx =
                        speakerColorMap.get(name) || 0;
                    const bg = SPEAKER_COLORS[idx]
                        .split(" ")[0]
                        .replace("/40", "/60");
                    return (
                        <div
                            key={name}
                            className="flex items-center gap-1"
                        >
                            <div
                                className={cn(
                                    "h-2.5 w-2.5 rounded-sm",
                                    bg
                                )}
                            />
                            {name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
