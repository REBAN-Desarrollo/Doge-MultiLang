/**
 * Cliente TypeScript para las API routes internas de
 * ElevenLabs. Todas las llamadas pasan por nuestros
 * API Routes de Next.js (server-side) para proteger
 * la API key.
 */

const API_BASE = "/api";

// ── Tipos ──────────────────────────────────────────

export interface DubbingCreateResponse {
    dubbing_id: string;
    expected_duration_sec: number;
}

export interface MediaReference {
    src: string;
    content_type: string;
    duration_secs: number;
    url: string;
    is_audio: boolean;
}

export interface SubtitleFrame {
    start_time: number;
    end_time: number;
    lines: string[];
}

export interface DubbedSegment {
    start_time: number;
    end_time: number;
    text?: string;
    subtitles: SubtitleFrame[];
    audio_stale: boolean;
    media_ref?: MediaReference;
}

export interface SpeakerSegment {
    id: string;
    start_time: number;
    end_time: number;
    text: string;
    subtitles: SubtitleFrame[];
    /** Dubs por idioma: { "en": DubbedSegment, ... } */
    dubs: Record<string, DubbedSegment>;
}

export interface SpeakerTrack {
    id: string;
    media_ref: MediaReference;
    speaker_name: string;
    voices: Record<string, string>;
    segments: string[];
}

export interface Render {
    id: string;
    version: number;
    language?: string;
    type?: string;
    media_ref?: MediaReference;
    status: "complete" | "processing" | "failed";
}

export interface DubbingResource {
    id: string;
    version: number;
    source_language: string;
    target_languages: string[];
    input: MediaReference;
    background?: MediaReference;
    foreground?: MediaReference;
    speaker_tracks: Record<string, SpeakerTrack>;
    speaker_segments: Record<string, SpeakerSegment>;
    renders: Record<string, Render>;
}

export interface AccountInfo {
    subscription: {
        character_count: number;
        character_limit: number;
    };
}

// ── Funciones del cliente ──────────────────────────

/** Verificar API key y obtener info de la cuenta */
export async function getAccountInfo(): Promise<
    AccountInfo
> {
    const res = await fetch(`${API_BASE}/elevenlabs`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            err.error || "Error al verificar API key"
        );
    }
    return res.json();
}

/**
 * Crear un proyecto de dubbing subiendo un archivo.
 * Usa FormData para enviar el MP4/MP3.
 */
export async function createDubbingProject(
    file: File,
    name: string,
    sourceLang: string = "es",
    targetLang: string = "en"
): Promise<DubbingCreateResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("source_lang", sourceLang);
    formData.append("target_lang", targetLang);

    const res = await fetch(
        `${API_BASE}/dubbing/create`,
        { method: "POST", body: formData }
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            err.error || "Error al crear proyecto"
        );
    }
    return res.json();
}

/**
 * Obtener el recurso de dubbing con todos los
 * segmentos, speakers y renders.
 */
export async function getDubbingResource(
    dubbingId: string
): Promise<DubbingResource> {
    const res = await fetch(
        `${API_BASE}/dubbing/${dubbingId}`
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            err.error || "Error al obtener recurso"
        );
    }
    return res.json();
}

/**
 * Traducir segmentos específicos a idiomas
 * específicos.
 */
export async function translateSegments(
    dubbingId: string,
    segments: string[],
    languages?: string[]
): Promise<{ version: number }> {
    const body: Record<string, unknown> = { segments };
    if (languages) body.languages = languages;

    const res = await fetch(
        `${API_BASE}/dubbing/${dubbingId}/translate`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            err.error || "Error al traducir segmentos"
        );
    }
    return res.json();
}

/**
 * Generar dub (audio) para segmentos específicos.
 */
export async function dubSegments(
    dubbingId: string,
    segments: string[],
    languages?: string[]
): Promise<{ version: number }> {
    const body: Record<string, unknown> = { segments };
    if (languages) body.languages = languages;

    const res = await fetch(
        `${API_BASE}/dubbing/${dubbingId}/dub`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            err.error || "Error al doblar segmentos"
        );
    }
    return res.json();
}

/**
 * Renderizar el proyecto completo para un idioma.
 */
export async function renderProject(
    dubbingId: string,
    language: string,
    renderType: string = "mp3"
): Promise<{ version: number; render_id: string }> {
    const res = await fetch(
        `${API_BASE}/dubbing/${dubbingId}/render`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language,
                render_type: renderType,
            }),
        }
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            err.error || "Error al renderizar"
        );
    }
    return res.json();
}
