import { FileText } from "lucide-react";

export default function GuionPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Guión Pipeline
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Parser de guiones, blacklists y workflow de
                    validación.
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
                        "rounded-2xl bg-blue-500/10"
                    }
                >
                    <FileText className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-lg font-medium">
                    Próximamente
                </p>
                <p className="max-w-sm text-center text-sm text-muted-foreground">
                    Este módulo permitirá ingestar guiones, parsear
                    diálogos y validar contra blacklists de 27
                    idiomas.
                </p>
            </div>
        </div>
    );
}
