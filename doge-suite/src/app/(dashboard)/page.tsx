import {
    Globe,
    FileText,
    Image,
    Mic,
    ArrowRight,
} from "lucide-react";

// Resumen de módulos para el dashboard
const MODULES = [
    {
        title: "Guión Pipeline",
        description:
            "Parser de guiones, blacklists, workflow de validación",
        icon: FileText,
        href: "/guion",
        gradient: "gradient-teal",
        color: "text-blue-400",
        status: "Próximamente",
    },
    {
        title: "Asset Factory",
        description:
            "Kanban de assets, generación bulk/hero con fal.ai",
        icon: Image,
        href: "/assets",
        gradient: "gradient-teal",
        color: "text-emerald-400",
        status: "Próximamente",
    },
    {
        title: "Audio Hub",
        description:
            "TTS batch, reproductor QA, regenerar segmentos",
        icon: Mic,
        href: "/audio",
        gradient: "gradient-amber",
        color: "text-amber-400",
        status: "Próximamente",
    },
    {
        title: "Localización",
        description:
            "Traducción 27 idiomas, dubbing, patching, alignment",
        icon: Globe,
        href: "/localization",
        gradient: "gradient-purple",
        color: "text-violet-400",
        status: "Activo",
    },
] as const;

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    DOGE Creative Suite
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Pipeline de producción creativa para QPH —
                    27 idiomas, cero confianza ciega.
                </p>
            </div>

            {/* KPIs rápidos */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Idiomas", value: "27", sub: "activos" },
                    {
                        label: "QA Automático",
                        value: "0%",
                        sub: "coverage",
                    },
                    {
                        label: "Blacklists",
                        value: "3/27",
                        sub: "idiomas",
                    },
                    {
                        label: "Episodios",
                        value: "—",
                        sub: "en pipeline",
                    },
                ].map((kpi) => (
                    <div
                        key={kpi.label}
                        className="glass-card px-5 py-4"
                    >
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {kpi.label}
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {kpi.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {kpi.sub}
                        </p>
                    </div>
                ))}
            </div>

            {/* Grid de módulos */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">
                    Módulos
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {MODULES.map((mod) => (
                        <a
                            key={mod.title}
                            href={mod.href}
                            className={
                                "glass-card group flex flex-col gap-3 " +
                                "p-5 transition-all duration-300 " +
                                "hover:border-primary/30 hover:shadow-lg " +
                                "hover:shadow-primary/5"
                            }
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={
                                            "flex h-10 w-10 items-center " +
                                            "justify-center rounded-lg " +
                                            mod.gradient
                                        }
                                    >
                                        <mod.icon
                                            className={"h-5 w-5 " + mod.color}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {mod.title}
                                        </h3>
                                        <span
                                            className={
                                                "text-[10px] font-semibold " +
                                                "uppercase tracking-wider " +
                                                (mod.status === "Activo"
                                                    ? "text-emerald-400"
                                                    : "text-zinc-500")
                                            }
                                        >
                                            {mod.status}
                                        </span>
                                    </div>
                                </div>
                                <ArrowRight
                                    className={
                                        "h-4 w-4 text-muted-foreground " +
                                        "transition-transform " +
                                        "group-hover:translate-x-1 " +
                                        "group-hover:text-foreground"
                                    }
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {mod.description}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
