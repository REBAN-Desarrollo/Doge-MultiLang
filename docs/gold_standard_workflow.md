# 🏆 Gold Standard: Doge-MultiLang Workflow (v1.1)

Este documento establece el estándar de excelencia para la traducción, doblaje y animación de los proyectos de Que Perro Hilo, unificando los levantamientos históricos de Enero con la tecnología de ElevenLabs Studio 2025.

---

## 💎 1. El Guion: "Absolute SSOT" (Andrea's Standard)
**Regla de Oro:** Ningún audio se genera sin un guion "planchado" y bloqueado.
- **Formato:** `.docx` con estilos de párrafo definidos (Hablante: Diálogo).
- **Validación:** El script debe pasar el `11_ANDREA_GUION_CHECKLIST.md` (0 errores de ortografía, nombres consistentes, tono Doge).
- **Extracción:** Uso estricto de `planchado.py` para separar diálogos de metadatos de escena.

---

## 🎭 2. La Voz: "Kid-Friendly Doge" (Saúl's Standard)
**Regla de Oro:** El tono debe resonar con niños de 6 a 12 años (según `25_12_24_persona_kids_6_12.md`).
- **Localización:** No es traducción literal; es adaptación cultural (ES-LATAM) usando la guía `25_12_24_guide_es_latam.md`.
- **Auditoría de Blacklist:** Cumplimiento del 100% de las `blacklist_*.json` (27 idiomas target). Cualquier palabra prohibida detiene el pipeline.
- **Pronunciation Dictionaries:** Reglas IPA por personaje para garantizar pronunciación consistente de nombres (Gabriel, Valentina) en todos los idiomas. Complementa blacklists: blacklists bloquean lo malo, dictionaries aseguran lo correcto.
- **Consistencia:** Las voces deben mantenerse idénticas a través de los episodios (Voice ID Whitelist).

---

## ⏱️ 3. El Timing: "The Fernando Delta" (Fernando's Standard)
**Regla de Oro:** El audio debe encajar en el video original sin intervención manual.
- **Sincronización:** Extracción de `word_timestamps` estructurados de la API de ElevenLabs.
- **Silencios Automáticos:** Inyección de tags SSML `<break time="X.Xs" />` basados en la duración del video de referencia (Jan 2026 Timing Rules).
- **Compresión Creativa:** Si el audio traducido excede el tiempo disponible en el video, el Auditor AI (Claude) debe re-escribir el diálogo para acortarlo sin perder el sentido.

---

## 🤖 4. Auditoría Multi-Agente: "The Mirror Gate"
**Regla de Oro:** Todo bloque de diálogo debe ser auditado por dos modelos de IA antes de ser "planchado" final.
- **Agente A (Estructurador):** Valida precisión técnica y cumplimiento de Blacklist.
- **Agente B (Crítico Creativo):** Valida naturalidad, tono para niños y ritmo de actuación.
- **Gatekeeper (Gemini):** Compara ambas opiniones y genera el reporte final de aprobación (`26_02_18_checklist_audio_qa.md`).

---

## 🛠️ 5. Ejecución Técnica (Dubbing API 2026)

### Motor de Generación
- **Modelo principal:** `Eleven Flash v2.5` (32 idiomas, 40K chars, costo eficiente, ~75ms latencia)
- **Modelo alternativo a evaluar:** `Eleven v3` (70+ idiomas, 5K chars, multi-speaker dialogue nativo, emocionalmente mas rico — ideal para diálogo infantil animado, pero limite de caracteres menor)
- **STT:** `Scribe v2` (90+ idiomas, entity detection con categoría `offensive_language`, keyterm prompting para nombres de personajes)

### Endpoints Correctos (Dubbing API, NO Studio API)

| Endpoint | Función |
|:---------|:--------|
| `POST /v1/dubbing` | Crear proyecto de doblaje (`dubbing_studio: true` obligatorio para habilitar Resource API) |
| `GET /v1/dubbing/{dubbing_id}` | Consultar estado del proyecto |
| `GET /v1/dubbing/resource/{dubbing_id}` | Obtener recurso completo (speakers, segments, languages) |
| `POST /v1/dubbing/resource/{dubbing_id}/migrate-segments` | Reasignar segmentos a otro speaker en bulk (`segment_ids[]` + `speaker_id`) |
| `GET /v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/similar-voices` | Top 10 voces similares a speaker detectado |
| `PATCH /v1/dubbing/resource/{dubbing_id}/segment/{segment_id}` | Editar segmento individual (texto, timing) |
| `POST /v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/transcribe` | Re-transcribir segmento |
| `POST /v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/translate` | Re-traducir segmento |
| `POST /v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/dub` | Re-generar audio de segmento |
| `POST /v1/dubbing/resource/{dubbing_id}/render` | Renderizar proyecto completo |
| `POST /v1/dubbing/resource/{dubbing_id}/add-language` | Agregar idioma al proyecto |
| `POST /v1/speech-to-text` | STT Scribe v2 (model_id: `scribe_v2`) |
| `POST /v1/forced-alignment` | Forced Alignment (29 idiomas, timestamps word-level) |
| `POST /v1/audio-isolation/convert` | Aislar voz de background audio |

### Parámetros Clave de `POST /v1/dubbing`
- `dubbing_studio: true` — Habilita edición via Dubbing Resource API
- `disable_voice_cloning: false` (default) — Usa clones de voz; `true` = usa voces similares de la Voice Library
- `target_accent: "es-MX"` — [Experimental] Acento para selección de voces e informar dialecto de traducción
- `drop_background_audio: false` — `true` mejora calidad en speeches/monólogos sin background
- `use_profanity_filter: true` — [BETA] Censura profanidades en transcripción
- `num_speakers: 0` — 0 = detección automática de speakers

### Herramientas Complementarias

| Herramienta | Función |
|:------------|:--------|
| **Pronunciation Dictionaries** | Reglas IPA por personaje (alias + phoneme), versionadas, CRUD completo via API |
| **Audio Isolation API** | Pre-procesar MP4 de Fernando para remover background antes de dubbing |
| **PVC Speaker Separation** | Separar speakers de audio multi-speaker programáticamente (alternativa a stems de Fernando) |

### ⚠️ ERRATAS CORREGIDAS (v1.0 → v1.1)
- ~~`v1/studio/projects`~~ → `POST /v1/dubbing` (Studio API es para audiobooks, NO para dubbing)
- ~~`PATCH /v1/studio/projects/{id}/chapters/{id}`~~ → Dubbing Resource API (segment CRUD)
- ~~`auto_assign_voices: "alpha"`~~ → No existe. Usar `disable_voice_cloning` para control de voz
- Forced Alignment soporta **29 idiomas** (multilingual v2), no 150+

---
*Este es el Estándar de Oro. Cualquier desviación de este proceso se considera un riesgo técnico para el proyecto.*

> **Changelog v1.1 (2026-02-20):** Sección 5 reescrita completamente. Endpoints corregidos de Studio API a Dubbing API. Parámetro `auto_assign_voices` eliminado (no existe). Agregados: Pronunciation Dictionaries, Audio Isolation API, PVC Speaker Separation, modelo Eleven v3, STT Scribe v2. Forced Alignment corregido a 29 idiomas.
