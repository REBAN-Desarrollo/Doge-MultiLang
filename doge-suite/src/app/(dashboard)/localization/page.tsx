"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Globe,
    Filter,
    BarChart3,
    CheckCircle2,
    AlertTriangle,
    Clock,
    XCircle,
    Loader2,
    Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LanguageGrid } from "@/components/language-grid";
import { FileUpload } from "@/components/file-upload";
import { LANGUAGES } from "@/lib/mock-languages";
import { createDubbingProject } from "@/lib/elevenlabs";
import { cn } from "@/lib/utils";

// Calcular KPIs desde los datos
function computeKpis() {
    const total = LANGUAGES.filter(
        (l) => l.family !== "source"
    ).length;

    const translated = LANGUAGES.filter(
        (l) =>
            l.family !== "source" && l.translation === "done"
    ).length;

    const dubbed = LANGUAGES.filter(
        (l) =>
            l.family !== "source" && l.dubbing === "done"
    ).length;

    const qaPass = LANGUAGES.filter(
        (l) =>
            l.family !== "source" && l.qaAuto === "pass"
    ).length;

    const qaFail = LANGUAGES.filter(
        (l) =>
            l.family !== "source" && l.qaAuto === "fail"
    ).length;

    const inProgress = LANGUAGES.filter(
        (l) =>
            l.family !== "source" &&
            ["translating", "generating", "queued"].includes(
                l.translation
            )
    ).length;

    return {
        total,
        translated,
        dubbed,
        qaPass,
        qaFail,
        inProgress,
    };
}

const TIER_FILTERS = [
    { label: "Todos", value: null },
    { label: "Tier 1", value: 1 },
    { label: "Tier 2", value: 2 },
    { label: "Tier 3", value: 3 },
] as const;

const TARGET_LANG_OPTIONS = [
    { code: "en", label: "🇺🇸 English" },
    { code: "pt", label: "🇧🇷 Português" },
    { code: "de", label: "🇩🇪 Deutsch" },
    { code: "fr", label: "🇫🇷 Français" },
    { code: "it", label: "🇮🇹 Italiano" },
    { code: "ja", label: "🇯🇵 日本語" },
    { code: "ko", label: "🇰🇷 한국어" },
] as const;

export default function LocalizationPage() {
    const router = useRouter();
    const [activeTier, setActiveTier] = useState<
        number | null
    >(null);
    const [file, setFile] = useState<File | null>(null);
    const [targetLangs, setTargetLangs] =
        useState<string[]>(["en"]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<
        string | null
    >(null);

    const kpis = computeKpis();

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
            // Navegar a la página de detalle
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
                                "justify-center rounded-lg gradient-purple"
                            }
                        >
                            <Globe className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                            <h1
                                className={
                                    "text-2xl font-bold tracking-tight"
                                }
                            >
                                Localización
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Pipeline multi-idioma — traducción,
                                dubbing, QA
                            </p>
                        </div>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={
                        "border-violet-500/20 bg-violet-500/10 " +
                        "text-violet-300"
                    }
                >
                    {kpis.total} idiomas
                </Badge>
            </div>

            {/* ── Crear nuevo proyecto de dubbing ────── */}
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
                                    "rounded-md border border-border " +
                                    "bg-background px-3 text-sm"
                                }
                            >
                                🇲🇽 Español (ES)
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                Idiomas target
                                <span className="ml-2 text-[10px] text-violet-400">
                                    {targetLangs.length} seleccionado{targetLangs.length !== 1 ? "s" : ""}
                                </span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {TARGET_LANG_OPTIONS.map((o) => {
                                    const active = targetLangs.includes(o.code);
                                    return (
                                        <button
                                            key={o.code}
                                            type="button"
                                            onClick={() => toggleLang(o.code)}
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
                                })}
                            </div>
                        </div>
                        <Button
                            onClick={handleCreateProject}
                            disabled={!file || uploading || targetLangs.length === 0}
                            className="w-full gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2
                                        className="h-4 w-4 animate-spin"
                                    />
                                    Subiendo a ElevenLabs...
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

            {/* KPIs */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <KpiCard
                    icon={CheckCircle2}
                    iconColor="text-emerald-400"
                    label="Traducidos"
                    value={kpis.translated}
                    total={kpis.total}
                    gradient="gradient-teal"
                />
                <KpiCard
                    icon={BarChart3}
                    iconColor="text-blue-400"
                    label="Doblados"
                    value={kpis.dubbed}
                    total={kpis.total}
                    gradient="gradient-teal"
                />
                <KpiCard
                    icon={CheckCircle2}
                    iconColor="text-emerald-400"
                    label="QA Pass"
                    value={kpis.qaPass}
                    total={kpis.total}
                    gradient="gradient-teal"
                />
                <KpiCard
                    icon={XCircle}
                    iconColor="text-red-400"
                    label="QA Fail"
                    value={kpis.qaFail}
                    total={kpis.total}
                    gradient="gradient-amber"
                />
                <KpiCard
                    icon={Clock}
                    iconColor="text-amber-400"
                    label="En proceso"
                    value={kpis.inProgress}
                    total={kpis.total}
                    gradient="gradient-amber"
                />
            </div>

            <Separator className="opacity-50" />

            {/* Filtros de Tier */}
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    Filtrar:
                </span>
                {TIER_FILTERS.map((f) => (
                    <Button
                        key={f.label}
                        variant={
                            activeTier === f.value ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setActiveTier(f.value)}
                        className={cn(
                            "h-7 rounded-full px-3 text-xs",
                            activeTier === f.value &&
                            "bg-primary text-primary-foreground"
                        )}
                    >
                        {f.label}
                    </Button>
                ))}
            </div>

            {/* Grid de idiomas */}
            <div className="glass-card overflow-hidden p-0">
                <LanguageGrid
                    languages={LANGUAGES}
                    activeTier={activeTier}
                />
            </div>

            {/* Leyenda */}
            <div
                className={
                    "flex flex-wrap gap-x-6 gap-y-2 text-xs " +
                    "text-muted-foreground"
                }
            >
                <span className="flex items-center gap-1.5">
                    <span
                        className={
                            "inline-block h-2 w-2 rounded-full " +
                            "bg-emerald-400"
                        }
                    />
                    Completado
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className={
                            "inline-block h-2 w-2 rounded-full " +
                            "bg-amber-400"
                        }
                    />
                    En proceso
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className={
                            "inline-block h-2 w-2 rounded-full " +
                            "bg-red-400"
                        }
                    />
                    Fallo
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className={
                            "inline-block h-2 w-2 rounded-full " +
                            "bg-zinc-600"
                        }
                    />
                    No iniciado
                </span>
                <Separator
                    orientation="vertical"
                    className="h-4 opacity-30"
                />
                <span>
                    <strong className="text-violet-300">T1</strong>
                    {" "}Humano + Auto
                </span>
                <span>
                    <strong className="text-blue-300">T2</strong>
                    {" "}Sample 30%
                </span>
                <span>
                    <strong className="text-zinc-400">T3</strong>
                    {" "}Auto-only
                </span>
            </div>
        </div>
    );
}

/** Tarjeta de KPI compacta */
function KpiCard({
    icon: Icon,
    iconColor,
    label,
    value,
    total,
    gradient,
}: {
    icon: React.ElementType;
    iconColor: string;
    label: string;
    value: number;
    total: number;
    gradient: string;
}) {
    const pct =
        total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div className="glass-card flex items-center gap-3 px-4 py-3">
            <div
                className={cn(
                    "flex h-9 w-9 shrink-0 items-center",
                    "justify-center rounded-lg",
                    gradient
                )}
            >
                <Icon className={cn("h-4 w-4", iconColor)} />
            </div>
            <div className="min-w-0">
                <p
                    className={
                        "text-xs font-medium uppercase " +
                        "tracking-wider text-muted-foreground"
                    }
                >
                    {label}
                </p>
                <p className="text-lg font-bold leading-tight">
                    {value}
                    <span className="text-sm text-muted-foreground">
                        /{total}
                    </span>
                </p>
                {/* Barra de progreso */}
                <div
                    className={
                        "mt-1 h-1 w-full overflow-hidden " +
                        "rounded-full bg-white/5"
                    }
                >
                    <div
                        className={cn(
                            "h-full rounded-full transition-all " +
                            "duration-700 ease-out",
                            pct >= 80
                                ? "bg-emerald-400"
                                : pct >= 40
                                    ? "bg-amber-400"
                                    : "bg-red-400"
                        )}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
