"use client";

import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    /** Formatos aceptados (e.g., ".mp4,.mp3,.wav") */
    accept?: string;
    /** Callback cuando se selecciona un archivo */
    onFileSelect: (file: File) => void;
    /** Si está cargando */
    loading?: boolean;
    /** Texto de ayuda */
    hint?: string;
}

export function FileUpload({
    accept = ".mp4,.mp3,.wav",
    onFileSelect,
    loading = false,
    hint = "MP4, MP3 o WAV",
}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFile = useCallback(
        (f: File) => {
            setFile(f);
            onFileSelect(f);
        },
        [onFileSelect]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
        },
        [handleFile]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
        },
        [handleFile]
    );

    const clear = () => setFile(null);

    // Tamaño legible
    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(0)} KB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (file) {
        return (
            <div
                className={cn(
                    "glass-card flex items-center gap-4 p-4"
                )}
            >
                <div
                    className={
                        "flex h-10 w-10 shrink-0 items-center " +
                        "justify-center rounded-lg bg-violet-500/15"
                    }
                >
                    <File className="h-5 w-5 text-violet-400" />
                </div>
                <div className="min-w-0 flex-1">
                    <p
                        className={
                            "truncate text-sm font-medium"
                        }
                    >
                        {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatSize(file.size)} •{" "}
                        {file.type || "archivo"}
                    </p>
                </div>
                {!loading && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clear}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        );
    }

    return (
        <label
            onDrop={handleDrop}
            onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            className={cn(
                "glass-card flex cursor-pointer flex-col",
                "items-center justify-center gap-3 p-8",
                "transition-all duration-200",
                "hover:border-primary/30",
                dragOver &&
                "border-primary/50 bg-primary/5 " +
                "shadow-lg shadow-primary/10"
            )}
        >
            <div
                className={cn(
                    "flex h-12 w-12 items-center justify-center",
                    "rounded-xl bg-violet-500/10",
                    "transition-transform duration-200",
                    dragOver && "scale-110"
                )}
            >
                <Upload
                    className="h-6 w-6 text-violet-400"
                />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium">
                    Arrastra un archivo o{" "}
                    <span className="text-primary underline">
                        selecciona
                    </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    {hint}
                </p>
            </div>
            <input
                type="file"
                accept={accept}
                onChange={handleInputChange}
                className="hidden"
            />
        </label>
    );
}
