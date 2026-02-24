"use client";

import {
    useEffect,
    useState,
    useCallback,
    useRef,
    use,
} from "react";
import {
    ArrowLeft,
    Download,
    Loader2,
    RefreshCw,
    Clock,
    Play,
    Pause,
    FileText,
    LayoutList,
    Mic,
    Upload,
    X,
    Pencil,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { VoiceSelector } from "@/components/voice-selector";
import {
    DubbingTimeline,
    type TimelineSegment,
} from "@/components/dubbing-timeline";
import {
    parseDocxBuffer,
    flattenDialogues,
    type ParsedScript,
    type DialogLine,
} from "@/lib/docx-parser";

// ── Tipos ──

interface DubbingStatus {
    dubbing_id: string;
    name: string;
    status: string;
    source_language?: string;
    target_languages: string[];
    created_at: string;
    error?: string;
    media_metadata?: {
        content_type: string;
        duration: number;
    };
}

interface SrtCue {
    index: number;
    start: string;
    end: string;
    text: string;
    startSec: number;
    endSec: number;
}


type Params = Promise<{ id: string }>;

/** Labels para el status */
const STATUS_LABELS: Record<string, string> = {
    dubbing: "Procesando dub...",
    transcribing: "Transcribiendo audio...",
    translating: "Traduciendo segmentos...",
    dubbed: "Listo",
    failed: "Error en procesamiento",
};

/** Parsear timestamps SRT a segundos */
function srtTimeToSec(t: string): number {
    const [h, m, rest] = t.split(":");
    const [s, ms] = rest.split(",");
    return +h * 3600 + +m * 60 + +s + +(ms || 0) / 1000;
}

function parseSrt(srt: string): SrtCue[] {
    const blocks = srt.trim().split(/\n\n+/);
    return blocks.map((block) => {
        const lines = block.split("\n");
        const index = parseInt(lines[0], 10);
        const [start, end] = (lines[1] || "").split(" --> ").map((s) => s.trim());
        const text = lines.slice(2).join("\n");
        return {
            index, start, end, text,
            startSec: srtTimeToSec(start || "0:0:0,0"),
            endSec: srtTimeToSec(end || "0:0:0,0"),
        };
    });
}

function fmtTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Componente Principal ──

export default function DubbingDetailPage(props: { params: Params }) {
    const { id: dubbingId } = use(props.params);

    // Status
    const [status, setStatus] = useState<DubbingStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Transcripción
    const [srcCues, setSrcCues] = useState<SrtCue[]>([]);
    const [dubCues, setDubCues] = useState<SrtCue[]>([]);
    const [loadingTx, setLoadingTx] = useState(false);

    // DOCX script
    const [script, setScript] = useState<ParsedScript | null>(null);

    // Audio player
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);


    // Voice mapping: character → voice_id
    const [voiceMap, setVoiceMap] = useState<Record<string, string>>({});

    // Per-dialogue TTS state
    const [generatingTTS, setGeneratingTTS] = useState<string | null>(null);
    const [ttsAudios, setTtsAudios] = useState<Record<string, string>>({});

    // Timeline selection + text editing
    const [selectedSegment, setSelectedSegment] = useState<TimelineSegment | null>(null);
    const [textOverrides, setTextOverrides] = useState<Record<string, string>>({});

    const pollRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    // ── Cargar status ──
    const loadStatus = useCallback(async () => {
        try {
            const res = await fetch(`/api/dubbing/${dubbingId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setStatus(data);
            setError(null);
            if (data.status !== "dubbed" && data.status !== "failed") {
                pollRef.current = setTimeout(loadStatus, 5000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar");
        } finally {
            setLoading(false);
        }
    }, [dubbingId]);

    useEffect(() => {
        loadStatus();
        return () => { if (pollRef.current) clearTimeout(pollRef.current); };
    }, [loadStatus]);

    // ── Cargar transcripciones ──
    const loadTranscripts = useCallback(async () => {
        if (!status || status.status !== "dubbed") return;
        setLoadingTx(true);
        try {
            const srcRes = await fetch(`/api/dubbing/${dubbingId}/transcript?lang=source&format=srt`);
            if (srcRes.ok) {
                const srcData = await srcRes.json();
                if (srcData.srt) setSrcCues(parseSrt(srcData.srt));
            }
            if (status.target_languages.length > 0) {
                const lang = status.target_languages[0];
                const dubRes = await fetch(`/api/dubbing/${dubbingId}/transcript?lang=${lang}&format=srt`);
                if (dubRes.ok) {
                    const dubData = await dubRes.json();
                    if (dubData.srt) setDubCues(parseSrt(dubData.srt));
                }
            }
        } catch { /* nice-to-have */ }
        finally { setLoadingTx(false); }
    }, [dubbingId, status]);

    useEffect(() => {
        if (status?.status === "dubbed") loadTranscripts();
    }, [status?.status, loadTranscripts]);

    // ── DOCX upload handler ──
    const handleDocxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const buf = await file.arrayBuffer();
            const parsed = await parseDocxBuffer(buf, file.name);
            setScript(parsed);
        } catch (err) {
            console.error("Error parsing DOCX:", err);
        }
    };

    // ── Audio controls ──
    const audioUrl = status?.status === "dubbed"
        ? `/api/dubbing/${dubbingId}/audio?lang=${status.target_languages[0] || "en"}`
        : null;

    const togglePlay = () => {
        const el = audioRef.current;
        if (!el) return;
        if (playing) { el.pause(); } else { el.play(); }
        setPlaying(!playing);
    };

    const seekTo = (sec: number) => {
        const el = audioRef.current;
        if (!el) return;

        // Actualizar UI inmediatamente
        setCurrentTime(sec);

        // Si no cargó metadata, esperar a que cargue
        if (el.readyState < 1) {
            const onLoaded = () => {
                el.removeEventListener(
                    "loadedmetadata", onLoaded
                );
                el.currentTime = sec;
                const onSeeked = () => {
                    el.removeEventListener(
                        "seeked", onSeeked
                    );
                    el.play();
                    setPlaying(true);
                };
                el.addEventListener(
                    "seeked", onSeeked
                );
            };
            el.addEventListener(
                "loadedmetadata", onLoaded
            );
            el.load();
            return;
        }

        // Audio ya cargado: seek y esperar
        // confirmación antes de reproducir
        el.currentTime = sec;
        const onSeeked = () => {
            el.removeEventListener(
                "seeked", onSeeked
            );
            el.play();
            setPlaying(true);
        };
        el.addEventListener("seeked", onSeeked);
    };

    // ── TTS por diálogo ──
    const generateTTS = async (dialogue: DialogLine & { scene: number }, idx: number) => {
        const voiceId = voiceMap[dialogue.character];
        if (!voiceId) return;

        const key = `${dialogue.scene}-${idx}`;
        setGeneratingTTS(key);

        try {
            // Obtener contexto de diálogos adyacentes
            const allDialogues = script ? flattenDialogues(script) : [];
            const dIdx = allDialogues.findIndex(
                (d) => d.lineNumber === dialogue.lineNumber
            );
            const prevText = dIdx > 0 ? allDialogues[dIdx - 1].text : undefined;
            const nextText = dIdx < allDialogues.length - 1 ? allDialogues[dIdx + 1].text : undefined;

            const res = await fetch("/api/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: dialogue.text,
                    voice_id: voiceId,
                    language_code: status?.target_languages[0] || "en",
                    previous_text: prevText,
                    next_text: nextText,
                }),
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setTtsAudios((prev) => ({ ...prev, [key]: url }));
            }
        } catch (err) {
            console.error("TTS error:", err);
        } finally {
            setGeneratingTTS(null);
        }
    };

    const duration = status?.media_metadata?.duration ?? 0;

    // ── Timeline segments (desde SRT cues) ──
    const timelineSegments: TimelineSegment[] = srcCues.map((cue, i) => {
        // Intentar matchear personaje desde DOCX si está disponible
        let character = "Speaker";
        if (script) {
            const allD = flattenDialogues(script);
            // Fuzzy match por texto similar
            const match = allD.find((d) =>
                cue.text.toLowerCase().includes(d.text.slice(0, 20).toLowerCase()) ||
                d.text.toLowerCase().includes(cue.text.slice(0, 20).toLowerCase())
            );
            if (match) character = match.character;
        }
        return {
            id: `src-${i}`,
            character,
            text: cue.text,
            startSec: cue.startSec,
            endSec: cue.endSec,
            status: "original" as const,
        };
    });

    // ── Loading state ──
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // ── Error state ──
    if (error) {
        return (
            <div className="animate-fade-in space-y-6">
                <BackLink />
                <div className="glass-card flex flex-col items-center gap-3 py-16">
                    <p className="text-red-400">⚠️ {error}</p>
                    <Button variant="ghost" size="sm" onClick={() => { setLoading(true); loadStatus(); }}>
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    // ── Processing / Failed ──
    if (status && status.status !== "dubbed") {
        const label = STATUS_LABELS[status.status] ?? status.status;
        return (
            <div className="animate-fade-in space-y-6">
                <BackLink />
                <div className="glass-card flex flex-col items-center gap-5 py-16">
                    {status.status === "failed" ? (
                        <>
                            <span className="text-2xl">❌</span>
                            <p className="font-bold text-red-400">Dubbing falló</p>
                            <p className="text-sm text-muted-foreground">{status.error || "Error desconocido"}</p>
                        </>
                    ) : (
                        <>
                            <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
                            <p className="text-lg font-bold">{label}</p>
                            <p className="text-sm text-muted-foreground">
                                ElevenLabs procesa tu archivo. Esto puede tomar 1-5 min.
                            </p>
                            {duration > 0 && (
                                <p className="font-mono text-xs text-muted-foreground">
                                    Duración: {fmtTime(duration)} • {status.target_languages.map((l) => l.toUpperCase()).join(", ")}
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" /> Auto-refresh cada 5s...
                            </div>
                        </>
                    )}
                </div>
                <p className="text-center font-mono text-xs text-muted-foreground">ID: {dubbingId}</p>
            </div>
        );
    }

    // ── Dubbed / Ready ──
    const targetLang = status?.target_languages[0] || "en";
    const activeSrcIdx = srcCues.findIndex((c) => currentTime >= c.startSec && currentTime < c.endSec);
    const activeDubIdx = dubCues.findIndex((c) => currentTime >= c.startSec && currentTime < c.endSec);

    // Personajes del DOCX o del timeline
    const allCharacters = script
        ? script.characters
        : [...new Set(timelineSegments.map((s) => s.character))];

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <BackLink />
                    <h1 className="text-2xl font-bold tracking-tight">
                        {status?.name || "Dubbing Project"}
                    </h1>
                    <p className="font-mono text-xs text-muted-foreground">ID: {dubbingId}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                        ✓ Doblado
                    </Badge>
                    <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-300">
                        {targetLang.toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => { setLoading(true); loadStatus(); }} className="h-8 w-8 p-0">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Audio player */}
            <div className="glass-card space-y-4 p-5">
                <div className="flex items-center gap-2">
                    <Volume2Icon />
                    <h2 className="text-sm font-semibold">Audio Doblado — {targetLang.toUpperCase()}</h2>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">{fmtTime(duration)}</span>
                </div>

                {audioUrl && (
                    <>
                        <audio ref={audioRef} src={audioUrl} preload="auto"
                            onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
                            onEnded={() => setPlaying(false)}
                        />
                        <div className="flex items-center gap-3">
                            <Button size="sm" variant="outline" onClick={togglePlay} className="h-10 w-10 rounded-full p-0">
                                {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                            </Button>
                            <div className="flex-1">
                                <div className="group relative h-2 cursor-pointer overflow-hidden rounded-full bg-white/5"
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        seekTo(((e.clientX - rect.left) / rect.width) * duration);
                                    }}>
                                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-100"
                                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
                                </div>
                                <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                                    <span>{fmtTime(currentTime)}</span>
                                    <span>{fmtTime(duration)}</span>
                                </div>
                            </div>
                            <a href={audioUrl} download={`dub_${targetLang}.mp3`} className="shrink-0">
                                <Button size="sm" variant="outline" className="gap-1.5">
                                    <Download className="h-3.5 w-3.5" /> MP3
                                </Button>
                            </a>
                        </div>
                    </>
                )}
            </div>

            {/* DOCX Upload (si no hay script cargado) */}
            {!script && (
                <div className="glass-card flex items-center gap-3 p-4">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Sube el .docx del guión para ver QUIÉN dice QUÉ
                    </span>
                    <label className="ml-auto cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10">
                        Subir DOCX
                        <input type="file" accept=".docx" onChange={handleDocxUpload} className="hidden" />
                    </label>
                </div>
            )}

            {/* Script info badge */}
            {script && (
                <div className="glass-card flex flex-wrap items-center gap-3 p-4">
                    <FileText className="h-4 w-4 text-violet-400" />
                    <span className="text-sm font-medium">{script.filename}</span>
                    <Badge variant="outline" className="text-xs">
                        {script.totalDialogues} diálogos
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {script.characters.length} personajes
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {script.scenes.length} escenas
                    </Badge>
                </div>
            )}

            {/* ━━ Grid: Transcripción (izq) + Voces (der) ━━ */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                {/* Transcripción — mitad izquierda */}
                <div className="glass-card flex flex-col p-5 max-h-[600px]">
                    <div className="mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-violet-400" />
                        <h2 className="text-sm font-semibold">Transcripción</h2>
                        {loadingTx && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                    </div>

                    {srcCues.length === 0 && dubCues.length === 0 && !loadingTx && (
                        <p className="flex-1 flex items-center justify-center text-sm text-muted-foreground">No hay transcripciones disponibles.</p>
                    )}

                    {(srcCues.length > 0 || dubCues.length > 0) && (
                        <div className="flex-1 min-h-0 grid grid-cols-2 gap-4 overflow-y-auto pr-1">
                            <TranscriptColumn
                                label="🇲🇽 Fuente (ES)"
                                cues={srcCues}
                                activeIdx={activeSrcIdx}
                                onSeek={seekTo}
                                accentColor="violet"
                            />
                            <TranscriptColumn
                                label={`${targetLang === "en" ? "🇺🇸" : "🌍"} Dub (${targetLang.toUpperCase()})`}
                                cues={dubCues}
                                activeIdx={activeDubIdx}
                                onSeek={seekTo}
                                accentColor="blue"
                            />
                        </div>
                    )}
                </div>

                {/* Voces — mitad derecha */}
                <div className="glass-card flex flex-col p-5 max-h-[600px]">
                    <div className="mb-4 flex items-center gap-2">
                        <Mic className="h-4 w-4 text-violet-400" />
                        <h2 className="text-sm font-semibold">Asignar Voces</h2>
                        <Badge variant="outline" className="ml-2 text-[10px]">
                            {Object.keys(voiceMap).length} / {allCharacters.length}
                        </Badge>
                    </div>

                    {allCharacters.length === 0 && (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            Sube un .docx para ver los personajes y asignar voces.
                        </p>
                    )}

                    <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
                        {allCharacters.map((char) => (
                            <VoiceSelector
                                key={char}
                                character={char}
                                selectedVoiceId={voiceMap[char] || null}
                                onSelect={(voiceId) =>
                                    setVoiceMap((prev) => ({
                                        ...prev,
                                        [char]: voiceId,
                                    }))
                                }
                            />
                        ))}
                    </div>

                    {script && Object.keys(voiceMap).length > 0 && (
                        <>
                            <Separator className="opacity-30" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Generar Diálogos Individuales
                            </h3>
                            <div className="max-h-[250px] space-y-1 overflow-y-auto pr-2">
                                {flattenDialogues(script).map((d, i) => {
                                    const key = `${d.scene}-${i}`;
                                    const hasVoice = !!voiceMap[d.character];
                                    const hasAudio = !!ttsAudios[key];
                                    const isGenerating = generatingTTS === key;

                                    return (
                                        <div key={i} className={cn(
                                            "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                                            hasAudio ? "bg-emerald-500/5" : "hover:bg-accent/30"
                                        )}>
                                            <span className="w-16 shrink-0 text-[10px] font-bold uppercase text-muted-foreground">
                                                {d.character.slice(0, 8)}
                                            </span>
                                            <span className="flex-1 truncate text-sm">{d.text}</span>

                                            {hasAudio && (
                                                <audio src={ttsAudios[key]} controls className="h-7 w-36" />
                                            )}

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                disabled={!hasVoice || isGenerating}
                                                onClick={() => generateTTS(d, i)}
                                                className="h-7 shrink-0 gap-1 text-xs"
                                            >
                                                {isGenerating ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <Mic className="h-3 w-3" />
                                                )}
                                                {hasAudio ? "Re-gen" : "Generar"}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ━━ Timeline (full width) ━━ */}
            {timelineSegments.length > 0 && (
                <div className="glass-card p-5 space-y-3">
                    <div className="flex items-center gap-2">
                        <LayoutList className="h-4 w-4 text-violet-400" />
                        <h2 className="text-sm font-semibold">Timeline</h2>
                        <span className="ml-auto text-[10px] text-muted-foreground">
                            Click en un bloque para seleccionar y editar
                        </span>
                    </div>
                    <DubbingTimeline
                        segments={timelineSegments}
                        duration={duration}
                        currentTime={currentTime}
                        selectedId={selectedSegment?.id || null}
                        onSeek={seekTo}
                        onSelect={(seg) => setSelectedSegment(seg)}
                    />

                    {/* Panel de detalle del segmento seleccionado */}
                    {selectedSegment && (
                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Pencil className="h-3.5 w-3.5 text-violet-400" />
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    {selectedSegment.character}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                    {fmtTime(selectedSegment.startSec)} → {fmtTime(selectedSegment.endSec)}
                                </span>
                                <button
                                    onClick={() => setSelectedSegment(null)}
                                    className="ml-auto rounded-md p-1 hover:bg-white/10"
                                >
                                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                            </div>

                            <textarea
                                value={textOverrides[selectedSegment.id] ?? selectedSegment.text}
                                onChange={(e) =>
                                    setTextOverrides((prev) => ({
                                        ...prev,
                                        [selectedSegment.id]: e.target.value,
                                    }))
                                }
                                rows={3}
                                className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-violet-500/50"
                            />

                            <div className="flex items-center gap-2">
                                {voiceMap[selectedSegment.character] ? (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={generatingTTS === selectedSegment.id}
                                        onClick={async () => {
                                            const segId = selectedSegment.id;
                                            const voiceId = voiceMap[selectedSegment.character];
                                            if (!voiceId) return;
                                            setGeneratingTTS(segId);
                                            try {
                                                const text = textOverrides[segId] ?? selectedSegment.text;
                                                const res = await fetch("/api/tts", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        text,
                                                        voice_id: voiceId,
                                                        language_code: status?.target_languages[0] || "en",
                                                    }),
                                                });
                                                if (res.ok) {
                                                    const blob = await res.blob();
                                                    const url = URL.createObjectURL(blob);
                                                    setTtsAudios((prev) => ({ ...prev, [segId]: url }));
                                                }
                                            } catch (err) {
                                                console.error("TTS error:", err);
                                            } finally {
                                                setGeneratingTTS(null);
                                            }
                                        }}
                                        className="gap-1.5"
                                    >
                                        {generatingTTS === selectedSegment.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Mic className="h-3 w-3" />
                                        )}
                                        {ttsAudios[selectedSegment.id] ? "Regenerar" : "Generar TTS"}
                                    </Button>
                                ) : (
                                    <span className="text-xs text-amber-400/80">
                                        ⚠ Asigna una voz a &quot;{selectedSegment.character}&quot; en la sección Voces
                                    </span>
                                )}

                                {ttsAudios[selectedSegment.id] && (
                                    <audio
                                        src={ttsAudios[selectedSegment.id]}
                                        controls
                                        className="h-8 flex-1"
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info footer */}
            <Separator className="opacity-30" />
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>Creado: {new Date(status?.created_at || "").toLocaleString("es-MX")}</span>
                <span>Duración: {fmtTime(duration)}</span>
                <span>Idiomas: {status?.target_languages.map((l) => l.toUpperCase()).join(", ")}</span>
            </div>
        </div>
    );
}

// ── Sub-componentes ──

function BackLink() {
    return (
        <Link href="/localization" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Localización
        </Link>
    );
}

function Volume2Icon() {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
        </div>
    );
}

function TranscriptColumn({ label, cues, activeIdx, onSeek, accentColor }: {
    label: string;
    cues: SrtCue[];
    activeIdx: number;
    onSeek: (sec: number) => void;
    accentColor: "violet" | "blue";
}) {
    const ringClass = accentColor === "violet"
        ? "bg-violet-500/15 ring-1 ring-violet-500/30"
        : "bg-blue-500/15 ring-1 ring-blue-500/30";

    // Refs para auto-scroll al cue activo
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        if (activeIdx >= 0 && itemRefs.current[activeIdx]) {
            itemRefs.current[activeIdx]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [activeIdx]);

    return (
        <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <div className="space-y-1">
                {cues.map((cue, i) => (
                    <button
                        key={i}
                        ref={(el) => { itemRefs.current[i] = el; }}
                        onClick={() => onSeek(cue.startSec)}
                        className={cn("w-full rounded-lg px-3 py-2 text-left transition-all", i === activeIdx ? ringClass : "hover:bg-accent/30")}
                    >
                        <span className="font-mono text-[10px] text-muted-foreground">{cue.start}</span>
                        <p className="text-sm leading-relaxed">{cue.text}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
