import { Mic } from "lucide-react";

export default function AudioPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Audio Hub
                </h1>
                <p className="mt-1 text-muted-foreground">
                    TTS batch, reproductor QA y regeneración de
                    segmentos.
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
                        "rounded-2xl bg-amber-500/10"
                    }
                >
                    <Mic className="h-8 w-8 text-amber-400" />
                </div>
                <p className="text-lg font-medium">
                    Próximamente
                </p>
                <p className="max-w-sm text-center text-sm text-muted-foreground">
                    Este módulo permitirá generar audio TTS en batch,
                    escuchar resultados y regenerar segmentos
                    individuales.
                </p>
            </div>
        </div>
    );
}
