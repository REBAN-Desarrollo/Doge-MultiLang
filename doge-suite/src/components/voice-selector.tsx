"use client";

import { useEffect, useState, useRef } from "react";
import {
    Volume2,
    ChevronDown,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tipos ──

interface Voice {
    voice_id: string;
    name: string;
    category: string;
    labels: Record<string, string>;
    preview_url: string | null;
}

interface VoiceSelectorProps {
    /** Personaje asignado */
    character: string;
    /** voice_id seleccionado */
    selectedVoiceId: string | null;
    /** Callback cuando el usuario elige una voz */
    onSelect: (voiceId: string) => void;
}

// Cache global de voces para no re-fetchear
let voicesCache: Voice[] | null = null;

export function VoiceSelector({
    character,
    selectedVoiceId,
    onSelect,
}: VoiceSelectorProps) {
    const [voices, setVoices] = useState<Voice[]>(
        voicesCache || []
    );
    const [loading, setLoading] = useState(
        voicesCache === null
    );
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const previewRef = useRef<HTMLAudioElement>(null);
    const [previewing, setPreviewing] = useState<
        string | null
    >(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cargar voces
    useEffect(() => {
        if (voicesCache) {
            setVoices(voicesCache);
            setLoading(false);
            return;
        }
        async function fetchVoices() {
            try {
                const res = await fetch("/api/voices");
                if (res.ok) {
                    const data = await res.json();
                    voicesCache = data.voices;
                    setVoices(data.voices);
                }
            } catch {
                // Silencio — voces no disponibles
            } finally {
                setLoading(false);
            }
        }
        fetchVoices();
    }, []);

    // Cerrar dropdown al click fuera
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    e.target as Node
                )
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClick
            );
    }, []);

    // Preview de voz
    const playPreview = (
        url: string,
        voiceId: string
    ) => {
        if (previewing === voiceId) {
            previewRef.current?.pause();
            setPreviewing(null);
            return;
        }
        if (previewRef.current) {
            previewRef.current.src = url;
            previewRef.current.play();
            setPreviewing(voiceId);
        }
    };

    const selectedVoice = voices.find(
        (v) => v.voice_id === selectedVoiceId
    );

    // Filtrar voces
    const filtered = voices.filter(
        (v) =>
            v.name.toLowerCase().includes(
                search.toLowerCase()
            ) ||
            Object.values(v.labels).some((l) =>
                l.toLowerCase().includes(search.toLowerCase())
            )
    );

    // Categorías para agrupar
    const categories = [
        "premade",
        "cloned",
        "generated",
        "professional",
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <audio
                ref={previewRef}
                onEnded={() => setPreviewing(null)}
            />

            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    "border-white/10 bg-white/5 hover:bg-white/10",
                    open && "ring-1 ring-violet-500/50"
                )}
            >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {character}
                </span>
                <span className="mx-1 text-white/20">→</span>
                {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                ) : selectedVoice ? (
                    <span className="truncate font-medium">
                        {selectedVoice.name}
                    </span>
                ) : (
                    <span className="text-muted-foreground">
                        Seleccionar voz...
                    </span>
                )}
                <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-[320px] rounded-xl border border-white/10 bg-zinc-900 p-2 shadow-2xl">
                    {/* Búsqueda */}
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar voz..."
                        className="mb-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-violet-500/50"
                        autoFocus
                    />

                    {/* Lista */}
                    <div className="max-h-[250px] overflow-y-auto">
                        {categories.map((cat) => {
                            const catVoices = filtered.filter(
                                (v) => v.category === cat
                            );
                            if (catVoices.length === 0) return null;
                            return (
                                <div key={cat} className="mb-2">
                                    <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        {cat}
                                    </p>
                                    {catVoices.map((v) => (
                                        <button
                                            key={v.voice_id}
                                            onClick={() => {
                                                onSelect(v.voice_id);
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                                                v.voice_id === selectedVoiceId
                                                    ? "bg-violet-500/15 text-violet-300"
                                                    : "hover:bg-white/5"
                                            )}
                                        >
                                            <span className="truncate flex-1 text-left">
                                                {v.name}
                                            </span>
                                            {/* Labels */}
                                            {v.labels?.accent && (
                                                <span className="text-[10px] text-muted-foreground">
                                                    {v.labels.accent}
                                                </span>
                                            )}
                                            {/* Preview */}
                                            {v.preview_url && (
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        playPreview(
                                                            v.preview_url!,
                                                            v.voice_id
                                                        );
                                                    }}
                                                    className={cn(
                                                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer",
                                                        previewing === v.voice_id
                                                            ? "bg-violet-500 text-white"
                                                            : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                                    )}
                                                >
                                                    <Volume2 className="h-3 w-3" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                        {filtered.length === 0 && (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                Sin resultados
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
