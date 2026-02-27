/**
 * Voice Manifest — persistencia y herencia
 * de mapeo personaje → voz por proyecto.
 *
 * MVP: localStorage. Futuro: base de datos.
 */

import type {
    VoiceManifest,
    CharacterVoice,
} from "@/types/ssot";

const STORAGE_KEY = "doge_voice_manifests";

// ── Persistencia ──────────────────────────────

/** Obtener todos los manifests guardados */
export function getAllManifests(): Record<
    string,
    VoiceManifest
> {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

/** Guardar manifest de un proyecto */
export function saveManifest(
    projectId: string,
    manifest: VoiceManifest
): void {
    const all = getAllManifests();
    all[projectId] = {
        ...manifest,
        updated_at: new Date().toISOString(),
    };
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(all)
    );
}

/** Cargar manifest de un proyecto */
export function loadManifest(
    projectId: string
): VoiceManifest | null {
    const all = getAllManifests();
    return all[projectId] || null;
}

/** Eliminar manifest de un proyecto */
export function deleteManifest(
    projectId: string
): void {
    const all = getAllManifests();
    delete all[projectId];
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(all)
    );
}

// ── Herencia ──────────────────────────────────

/**
 * Buscar manifests de la misma serie para
 * sugerir voces heredadas.
 *
 * Busca por prefix del nombre del proyecto.
 * Ej: "QPH" matchea "QPH_EscuelaRock",
 *     "QPH Short GatoAguja", etc.
 *
 * Retorna el manifest más reciente de la serie.
 */
export function findPreviousManifest(
    seriesPrefix: string,
    excludeProjectId?: string
): VoiceManifest | null {
    const all = getAllManifests();
    let latest: VoiceManifest | null = null;
    let latestTime = 0;

    for (const [id, manifest] of Object.entries(
        all
    )) {
        if (id === excludeProjectId) continue;

        // Matchea por series_prefix o por
        // nombre del proyecto
        const matchesPrefix =
            manifest.series_prefix === seriesPrefix;

        if (!matchesPrefix) continue;

        const time = new Date(
            manifest.updated_at
        ).getTime();
        if (time > latestTime) {
            latestTime = time;
            latest = manifest;
        }
    }

    return latest;
}

/**
 * Crear un manifest nuevo sugiriendo voces
 * de un proyecto anterior de la misma serie.
 *
 * Los personajes que se repiten obtienen
 * la voz heredada + badge "inherited_from".
 * Los personajes nuevos quedan vacíos.
 */
export function createManifestWithInheritance(
    projectId: string,
    seriesPrefix: string,
    detectedCharacters: string[],
    sourceLang: string = "es"
): VoiceManifest {
    const previous = findPreviousManifest(
        seriesPrefix,
        projectId
    );

    const previousMap = new Map<
        string,
        CharacterVoice
    >();
    if (previous) {
        for (const char of previous.characters) {
            previousMap.set(
                char.name.toLowerCase(),
                char
            );
        }
    }

    const characters: CharacterVoice[] =
        detectedCharacters.map((name) => {
            const prev = previousMap.get(
                name.toLowerCase()
            );
            if (prev) {
                return {
                    ...prev,
                    inherited_from: previous!.project_id,
                };
            }
            return {
                name,
                voice_ids_by_lang: {},
            };
        });

    const now = new Date().toISOString();
    return {
        project_id: projectId,
        series_prefix: seriesPrefix,
        source_language: sourceLang,
        characters,
        created_at: now,
        updated_at: now,
    };
}

/**
 * Actualizar la voz de un personaje en un
 * manifest. Aplica a TODOS los idiomas si
 * applyToAll es true.
 */
export function updateCharacterVoice(
    manifest: VoiceManifest,
    characterName: string,
    voiceId: string,
    language: string,
    applyToAll: boolean = false
): VoiceManifest {
    const updated = { ...manifest };
    updated.characters = manifest.characters.map(
        (char) => {
            if (
                char.name.toLowerCase() !==
                characterName.toLowerCase()
            ) {
                return char;
            }

            const newVoiceIds = {
                ...char.voice_ids_by_lang,
            };

            if (applyToAll) {
                // Misma voz para todos los idiomas
                // target del proyecto
                // (la voz ElevenLabs es multilingüe)
                for (const lang of Object.keys(
                    newVoiceIds
                )) {
                    newVoiceIds[lang] = voiceId;
                }
                newVoiceIds[language] = voiceId;
            } else {
                newVoiceIds[language] = voiceId;
            }

            return {
                ...char,
                voice_ids_by_lang: newVoiceIds,
            };
        }
    );

    updated.updated_at = new Date().toISOString();
    return updated;
}

/**
 * Contar cuántos personajes tienen voz
 * asignada para un idioma.
 */
export function getAssignmentProgress(
    manifest: VoiceManifest,
    language: string
): { assigned: number; total: number } {
    const total = manifest.characters.length;
    const assigned = manifest.characters.filter(
        (c) => c.voice_ids_by_lang[language]
    ).length;
    return { assigned, total };
}
