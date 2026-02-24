import { Image } from "lucide-react";

export default function AssetsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Asset Factory
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Kanban de assets, generación bulk/hero con fal.ai.
                </p>
            </div>
            <div
                className={
                    "glass-card flex flex-col items-center " +
                    "justify-center gap-4 py-20"
                }
            >
                <div
                    className={
                        "flex h-16 w-16 items-center justify-center " +
                        "rounded-2xl bg-emerald-500/10"
                    }
                >
                    <Image className="h-8 w-8 text-emerald-400" />
                </div>
                <p className="text-lg font-medium">
                    Próximamente
                </p>
                <p className="max-w-sm text-center text-sm text-muted-foreground">
                    Este módulo permitirá gestionar assets visuales
                    con un Kanban interactivo y generar imágenes en
                    batch con IA.
                </p>
            </div>
        </div>
    );
}
