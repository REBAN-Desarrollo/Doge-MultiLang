"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Globe,
    Rocket,
    AlertTriangle,
    Clock,
    CheckCircle2,
    Loader2,
    XCircle,
    ArrowRight,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/file-upload";
import { createDubbingProject } from "@/lib/elevenlabs";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ── Tipos ──

interface DubbingProject {
    dubbing_id: string;
    name: string;
    status: string;
    source_language?: string;
    target_languages: string[];
    created_at: string;
    error?: string;
}

const TARGET_LANG_OPTIONS = [
    { code: "en", label: "🇺🇸 English" },
    { code: "pt", label: "🇧🇷 Português" },
    { code: "de", label: "🇩🇪 Deutsch" },
    { code: "fr", label: "🇫🇷 Français" },
    { code: "it", label: "🇮🇹 Italiano" },
    { code: "ja", label: "🇯🇵 日本語" },
    { code: "ko", label: "🇰🇷 한국어" },
] as const;

const STATUS_CONFIG: Record<
    string,
    {
        label: string;
        icon: React.ElementType;
        color: string;
        bg: string;
    }
> = {
    dubbed: {
        label: "Listo",
        icon: CheckCircle2,
        color: "text-emerald-400",
        bg: "border-emerald-500/20 bg-emerald-500/10",
    },
    dubbing: {
        label: "Procesando",
        icon: Clock,
        color: "text-amber-400",
        bg: "border-amber-500/20 bg-amber-500/10",
    },
    transcribing: {
        label: "Transcribiendo",
        icon: Clock,
        color: "text-blue-400",
        bg: "border-blue-500/20 bg-blue-500/10",
    },
    translating: {
        label: "Traduciendo",
        icon: Clock,
        color: "text-violet-400",
        bg: "border-violet-500/20 bg-violet-500/10",
    },
    failed: {
        label: "Error",
        icon: XCircle,
        color: "text-red-400",
        bg: "border-red-500/20 bg-red-500/10",
    },
};

function getStatusConfig(status: string) {
    return (
        STATUS_CONFIG[status] || {
            label: status,
            icon: Clock,
            color: "text-zinc-400",
            bg: "border-zinc-500/20 bg-zinc-500/10",
        }
    );
}

function timeAgo(dateStr: string): string {
    const diff =
        Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `hace ${days}d`;
}

// ── Componente Principal ──

export default function LocalizationPage() {
    const router = useRouter();

    // Formulario nuevo proyecto
    const [file, setFile] = useState<File | null>(null);
    const [targetLangs, setTargetLangs] =
        useState<string[]>(["en"]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<
        string | null
    >(null);

    // Lista de proyectos
    const [projects, setProjects] = useState<
        DubbingProject[]
    >([]);
    const [loadingProjects, setLoadingProjects] =
        useState(true);
    const [projectsError, setProjectsError] = useState<
        string | null
    >(null);

    const handleFileSelect = useCallback(
        (f: File) => setFile(f),
        []
    );

    const toggleLang = (code: string) => {
        setTargetLangs((prev) =>
            prev.includes(code)
                ? prev.filter((c) => c !== code)
                : [...prev, code]
        );
    };

    // ── Cargar proyectos ──
    const loadProjects = useCallback(async () => {
        setLoadingProjects(true);
        setProjectsError(null);
        try {
            const res = await fetch("/api/dubbing");
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            // ElevenLabs devuelve { dubs: [...] }
            const list = Array.isArray(data)
                ? data
                : data.dubs ||
                data.dubbing ||
                data.results ||
                [];
            setProjects(list);
        } catch (err) {
            setProjectsError(
                err instanceof Error
                    ? err.message
                    : "Error al cargar proyectos"
            );
        } finally {
            setLoadingProjects(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    // ── Crear proyecto ──
    const handleCreateProject = async () => {
        if (!file || targetLangs.length === 0) return;
        setUploading(true);
        setUploadError(null);
        try {
            const result = await createDubbingProject(
                file,
                file.name.replace(/\.[^.]+$/, ""),
                "es",
                targetLangs.join(",")
            );
            router.push(
                `/localization/${result.dubbing_id}`
            );
        } catch (err) {
            setUploadError(
                err instanceof Error
                    ? err.message
                    : "Error al crear proyecto"
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div
                            className={
                                "flex h-10 w-10 items-center " +
                                "justify-center rounded-lg " +
                                "gradient-purple"
                            }
                        >
                            <Globe className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Localización
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Dubbing multi-idioma con
                                ElevenLabs
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadProjects}
                    className="h-8 w-8 p-0"
                    title="Refrescar proyectos"
                >
                    <RefreshCw
                        className={cn(
                            "h-4 w-4",
                            loadingProjects &&
                            "animate-spin"
                        )}
                    />
                </Button>
            </div>

            {/* ── Nuevo Proyecto de Dubbing ── */}
            <div className="glass-card space-y-4 p-5">
                <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-violet-400" />
                    <h2 className="text-sm font-semibold">
                        Nuevo Proyecto de Dubbing
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Upload */}
                    <FileUpload
                        onFileSelect={handleFileSelect}
                        loading={uploading}
                        hint="MP4, MP3 o WAV — episodio a doblar"
                    />

                    {/* Configuración */}
                    <div className="space-y-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                Idioma fuente
                            </label>
                            <div
                                className={
                                    "flex h-10 items-center " +
                                    "rounded-md border " +
                                    "border-border " +
                                    "bg-background px-3 " +
                                    "text-sm"
                                }
                            >
                                🇲🇽 Español (ES)
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                Idiomas target
                                <span className="ml-2 text-[10px] text-violet-400">
                                    {targetLangs.length}{" "}
                                    seleccionado
                                    {targetLangs.length !==
                                        1
                                        ? "s"
                                        : ""}
                                </span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {TARGET_LANG_OPTIONS.map(
                                    (o) => {
                                        const active =
                                            targetLangs.includes(
                                                o.code
                                            );
                                        return (
                                            <button
                                                key={
                                                    o.code
                                                }
                                                type="button"
                                                onClick={() =>
                                                    toggleLang(
                                                        o.code
                                                    )
                                                }
                                                className={cn(
                                                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                                                    active
                                                        ? "border-violet-500/50 bg-violet-500/20 text-violet-200"
                                                        : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                                                )}
                                            >
                                                {o.label}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={handleCreateProject}
                            disabled={
                                !file ||
                                uploading ||
                                targetLangs.length === 0
                            }
                            className="w-full gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Subiendo a
                                    ElevenLabs...
                                </>
                            ) : (
                                <>
                                    <Rocket className="h-4 w-4" />
                                    Crear Proyecto
                                </>
                            )}
                        </Button>
                        {uploadError && (
                            <p className="flex items-center gap-1 text-xs text-red-400">
                                <AlertTriangle className="h-3 w-3" />
                                {uploadError}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <Separator className="opacity-30" />

            {/* ── Lista de Proyectos ── */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-violet-400" />
                    <h2 className="text-sm font-semibold">
                        Proyectos
                    </h2>
                    {!loadingProjects && (
                        <Badge
                            variant="outline"
                            className="text-[10px]"
                        >
                            {projects.length}
                        </Badge>
                    )}
                </div>

                {/* Loading */}
                {loadingProjects && (
                    <div className="glass-card flex items-center justify-center py-12">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* Error */}
                {projectsError && !loadingProjects && (
                    <div className="glass-card flex flex-col items-center gap-3 py-12">
                        <p className="text-sm text-red-400">
                            ⚠️ {projectsError}
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadProjects}
                        >
                            Reintentar
                        </Button>
                    </div>
                )}

                {/* Vacío */}
                {!loadingProjects &&
                    !projectsError &&
                    projects.length === 0 && (
                        <div className="glass-card flex flex-col items-center gap-2 py-12 text-center">
                            <Globe className="h-8 w-8 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                                No hay proyectos todavía
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                                Sube un archivo arriba
                                para crear tu primer
                                proyecto de dubbing
                            </p>
                        </div>
                    )}

                {/* Lista */}
                {!loadingProjects &&
                    !projectsError &&
                    projects.length > 0 && (
                        <div className="space-y-2">
                            {projects.map((project) => {
                                const cfg =
                                    getStatusConfig(
                                        project.status
                                    );
                                const StatusIcon =
                                    cfg.icon;

                                return (
                                    <Link
                                        key={
                                            project.dubbing_id
                                        }
                                        href={`/localization/${project.dubbing_id}`}
                                        className={cn(
                                            "glass-card group flex items-center gap-4",
                                            "p-4 transition-all duration-200",
                                            "hover:border-primary/30",
                                            "hover:shadow-lg",
                                            "hover:shadow-primary/5"
                                        )}
                                    >
                                        {/* Icono status */}
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 shrink-0",
                                                "items-center justify-center",
                                                "rounded-lg",
                                                project.status ===
                                                    "dubbed"
                                                    ? "gradient-teal"
                                                    : project.status ===
                                                        "failed"
                                                        ? "gradient-amber"
                                                        : "gradient-purple"
                                            )}
                                        >
                                            <StatusIcon
                                                className={cn(
                                                    "h-4 w-4",
                                                    cfg.color
                                                )}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate font-semibold">
                                                    {project.name ||
                                                        "Sin nombre"}
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "shrink-0 text-[10px]",
                                                        cfg.bg,
                                                        cfg.color
                                                    )}
                                                >
                                                    {
                                                        cfg.label
                                                    }
                                                </Badge>
                                            </div>
                                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>
                                                    {project.target_languages
                                                        ?.map(
                                                            (
                                                                l
                                                            ) =>
                                                                l.toUpperCase()
                                                        )
                                                        .join(
                                                            ", "
                                                        ) ||
                                                        "—"}
                                                </span>
                                                <span>
                                                    •
                                                </span>
                                                <span>
                                                    {timeAgo(
                                                        project.created_at
                                                    )}
                                                </span>
                                                <span className="hidden font-mono text-[10px] sm:inline">
                                                    {project.dubbing_id.slice(
                                                        0,
                                                        8
                                                    )}
                                                    …
                                                </span>
                                            </div>
                                        </div>

                                        {/* Flecha */}
                                        <ArrowRight
                                            className={cn(
                                                "h-4 w-4 shrink-0",
                                                "text-muted-foreground",
                                                "transition-transform",
                                                "group-hover:translate-x-1",
                                                "group-hover:text-foreground"
                                            )}
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
            </div>
        </div>
    );
}
