# Workflow 08: Audio y TTS (Celula 3)

**Tiempo:** 1-2 dias | **Responsable:** Ramon (C3 Audio Lead), Alan/Ramon (Factory Managers)
**Output:** Archivos de audio TTS por escena, organizados por episodio

---

## Objetivo

Generar los dialogos de audio (TTS) para un episodio QPH a partir del guion aprobado, asignando voces consistentes por personaje y validando calidad antes de entregar a post-produccion.

---

## Trigger

**Guion Locked** (Script Lock): El guion ha sido aprobado en Planchado de Historia (Workflow 03) y no tendra mas cambios de texto.

> Si el guion cambia despues del lock, se debe re-disparar este workflow completo.

---

## Flujo del Proceso

```
  GUION LOCKED (.docx)
       |
  [1] Extraer Dialogos ─────── DocxParser / ExtraerDialogos.py
       |
  [2] Mapear Voces ──────────── VoiceMapper (Personaje -> VoiceID)
       |                         Cargar manifest previo si existe
       |
  [3] Sanitizar Texto ──────── Regex + limpieza pre-TTS
       |                         "no." -> "no", puntuacion ambigua
       |
  [4] Generar TTS ───────────── ElevenLabs API (por escena/dialogo)
       |                         Cola de generacion con WebSocket progress
       |
  [5] Validar Calidad ──────── QA segun tier del segmento
       |                         Tier 1: auto-pass | Tier 2: sampling | Tier 3: full
       |
  [6] Export ────────────────── Archivos organizados por episodio/escena
       |
  [7] Entregar ──────────────── A Fernando (Post-produccion, Workflow 06)
                                 + manifest.json para Dubbing (Workflow 09)
```

---

## Pasos Detallados

### Paso 1: Extraer Dialogos del Guion

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Guion `.docx` aprobado (Script Lock) |
| **Herramienta** | `docx_parser.py` / ExtraerDialogos.py |
| **Output** | JSON con dialogos por escena y personaje |
| **Validacion** | Verificar que todos los personajes fueron detectados, onomatopeyas preservadas |

### Paso 2: Mapear Voces a Personajes

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Lista de personajes + pool de voces ElevenLabs |
| **Herramienta** | VoiceMapper UI o `manifest.json` de episodio previo |
| **Output** | Mapeo `Personaje -> VoiceID` |
| **Regla** | Si el personaje ya existe en la serie, REUTILIZAR el VoiceID. Narrador es fijo para toda la serie. |
| **Responsable** | Ramon |

### Paso 3: Sanitizar Texto Pre-TTS

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Dialogos JSON |
| **Herramienta** | Sanitizador regex (automatico) |
| **Reglas** | `no.` -> `no`, `Sr.` -> `Senor`, limpieza de puntuacion ambigua |
| **Output** | Dialogos JSON sanitizado |

### Paso 4: Generar TTS via ElevenLabs

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Dialogos sanitizados + VoiceIDs |
| **Herramienta** | ElevenLabs TTS API (`POST /v1/text-to-speech/{voice_id}`) |
| **Modo** | Por escena (todos los dialogos de una escena en secuencia) |
| **Progreso** | WebSocket para monitoreo en tiempo real |
| **Output** | Archivos de audio `.mp3` por dialogo |
| **Responsable** | Sistema (automatico), Ramon supervisa |

### Paso 5: Validar Calidad de Audio

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Audio generado + texto original |
| **Metodo** | Segun tier del segmento (ver `06_CORE_AUDIO_TTS.md` seccion 4) |
| **Checks** | Consistencia de voz, timing vs escena, deteccion de silencios anomalos, WER check |
| **Output** | Audio aprobado o flags para re-generacion |
| **Responsable** | Automatico (Tier 1), Ramon (Tier 2-3) |

**Quality Gates:**

| Gate | Criterio | Accion si Falla |
|:-----|:---------|:----------------|
| **Consistencia de voz** | VoiceID correcto para cada personaje | Re-generar con VoiceID correcto |
| **Timing** | Audio no excede duracion de escena | Dividir dialogo largo en 2 lineas |
| **Deteccion de silencios** | No hay silencios anomalos > 2s | Revisar y re-generar segmento |
| **WER < 10%** | Transcripcion vs texto original | Revision auditiva manual |

### Paso 6: Exportar Audio

| Aspecto | Detalle |
|:--------|:--------|
| **Estructura** | `output/{serie}/{episodio}/audio/escena_{N}/dialogo_{M}.mp3` |
| **Manifest** | `manifest.json` con casting, estilos, metadata |
| **Output** | Carpeta completa lista para post-produccion |

### Paso 7: Entregar

| Destinatario | Que Recibe | Para Que |
|:-------------|:-----------|:---------|
| **Fernando (Post)** | Audio por escena + video guide | Ensamblar, ajustar pacing/pitch |
| **Saul/Ivan (Dubbing)** | `manifest.json` | Heredar casting para doblaje multi-idioma |

---

## Roles

| Rol | Persona | Responsabilidad |
|:----|:--------|:----------------|
| **Audio Lead (C3)** | Ramon | Mapeo de voces, supervision de generacion, QA |
| **Factory Manager** | Alan/Ramon | Coordinacion con otras celulas |
| **Sistema** | AI-Studio | Extraccion, sanitizacion, generacion, export |

---

## Herramientas

| Herramienta | Proposito | Ubicacion |
|:------------|:----------|:----------|
| `docx_parser.py` | Extraer dialogos de .docx | `apps/backend/services/docx_parser.py` |
| ExtraerDialogos.py | Script legacy de extraccion | Scripts de produccion |
| DescargarTTS.py | Script legacy de generacion | Scripts de produccion |
| ElevenLabs TTS API | Generacion de audio | API externa |
| VoiceMapper | UI de mapeo personaje->voz | `apps/studio/` modulo Voice |

---

## Output

- Archivos de audio `.mp3` por escena/dialogo
- `manifest.json` con casting y metadata
- Reporte de QA (si hubo flags)

---

## Dependencias

| Depende De | Workflow |
|:-----------|:---------|
| Guion Locked | Workflow 03 (Planchado Historia) |
| Pool de Voces | ElevenLabs account configurado |

| Es Dependencia De | Workflow |
|:-------------------|:---------|
| Post-produccion | Workflow 06 (Produccion - Celula 5 Ensamble) |
| Doblaje multi-idioma | Workflow 09 (Dubbing) |

---

**Fuentes:**
- `_recovery/NEW_FEATURES/TTS/VOICE_TTS_PLAN.md`
- `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md`
- `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/01_Analysis/FLUJO_ACTUAL.md`

---

## Seleccion de Modelo ElevenLabs

Cada modelo tiene un perfil distinto. Ramon elige el modelo en el Paso 3 antes de generar.

| Modelo | Caso de Uso | Notas |
|:-------|:------------|:------|
| **Flash v2.5** | Default para produccion. Rapido y economico. | Primera opcion si no hay requisito especial. |
| **Turbo v2.5** | Balance calidad/velocidad. | Para episodios con fechas ajustadas. |
| **Multilingual v2** | Mejor normalizacion de numeros y fechas en espanol. | Usar cuando el guion tiene cifras, fechas o abreviaciones. |
| **v3 Alpha** | Mayor rango emocional. | Para personajes con actuacion muy expresiva. Evaluar costo antes de usar. |

> La seleccion de modelo se guarda en el `manifest.json` para trazabilidad y re-generacion consistente.

---

## Filtrado de Voces por Idioma/Acento

Al mapear voces en el Paso 2, usar los filtros del VoiceMapper para encontrar voces en espanol:

| Filtro | Descripcion |
|:-------|:------------|
| **Mexican** | Acento mexicano. Prioridad para personajes principales de QPH. |
| **Spanish** | Acento espanol (Espana). Para personajes con rol especifico. |
| **International** | Acento neutro latinoamericano. Para narrador o personajes secundarios. |

---

## Procesamiento de Audio por Personaje (Fase 2)

Ajustes opcionales de velocidad y tono aplicados DESPUES de generar, antes del export:

| Parametro | Rango | Herramienta |
|:----------|:------|:------------|
| **Velocidad (Speed)** | 0.5x - 2.0x | `audio_processor.py` -> `apply_speed()` |
| **Tono (Pitch)** | -12 a +12 semitonos | `audio_processor.py` -> `apply_pitch()` |
| **Batch** | Varios audios por personaje | `audio_processor.py` -> `process_batch()` |

Estos ajustes se configuran en el `VoiceMapper` (slider Speed + slider Pitch) y se aplican en lote antes del merge por escena.

Cache de audios: Si un dialogo ya fue generado y no ha cambiado, el sistema no re-genera. La cache usa `{personaje, escena, orden, hash_texto}` como clave.

---

## Funcionalidades Planificadas (Backlog)

Funciones identificadas en el analisis legacy, pendientes de implementacion:

### Criticas (Alta prioridad)

| Funcionalidad | Descripcion | API |
|:--------------|:------------|:----|
| **Timestamps / SRT** | Generar archivos `.srt` automaticamente al producir audio. | `with_timestamps=True` en generacion. |
| **Forced Alignment** | Obtener timestamps word-level de audios ya existentes. Uso: subtitulos frame-perfect, verificacion de sincronía. | `/v1/forced-alignment` endpoint. |
| **Importar guion desde Google Docs** | Importar directamente desde directorio compartido. Facilita colaboracion en tiempo real. | Google Docs API / Google Drive API. |

### Mediano Plazo

| Funcionalidad | Descripcion | API |
|:--------------|:------------|:----|
| **Historial de Generaciones** | Ver ultimas 10-20 generaciones para re-descargar sin regenerar. Ahorro de creditos. | `GET /v1/history` |
| **Preview rapido de linea** | Generar SOLO una linea como prueba desde el SceneQueue, sin procesar todo el guion. | TTS estandar con dialogo individual. |
| **Indicador de costo estimado** | Mostrar costo aproximado en caracteres/creditos ANTES de generar. Usa `character_count` del status. | Ya disponible en backend. |
| **Batch Processing Multi-Guion** | Cola de varios guiones para procesamiento overnight. | Cola de generacion existente. |
| **Clonacion de Voz (IVC)** | Clonar una voz desde muestra de audio (~1-2 min). | `voices.ivc.create()` |
| **Speech-to-Speech** | Cambiar la voz de un audio existente a otra voz ElevenLabs. Uso: revoicing, correcciones rapidas. | `speech_to_speech.convert()` |
| **Diccionarios de Pronunciacion** | Reglas como `"AI-Studio"` -> `"Estudio de IA"`. Backend preparado, falta UI. | Configuracion en backend. |

### UX

| Mejora | Descripcion |
|:-------|:------------|
| **Persistencia de configuracion** | Guardar en `localStorage` el ultimo modelo, idioma, velocidad al cerrar. Restaurar al abrir. |

---

## Estado de Implementacion (Legacy Checklist)

Estado documentado del modulo de voz al momento del analisis legacy (Dic 2025):

### Implementado (MVP)
- Backend: `services/elevenlabs.py` (get_voices, text_to_speech, get_subscription)
- Backend: `services/docx_parser.py` (parse_script, extract_characters)
- API: GET /status, GET /voices, POST /upload, POST /generate, GET/DELETE /generate/{job_id}
- Frontend: VoiceMapper con filtros de idioma, ScriptUploader, SceneQueue
- WebSocket para progreso de generacion en tiempo real

### Pendiente
- Tests: `test_docx_parser.py`, `test_elevenlabs_client.py`, `test_voice_endpoints.py`
- Audio processing por personaje (speed/pitch sliders en VoiceMapper)
- Audio merger por escena con pausas configurables
- Cache de audios para evitar re-generacion
- Preview de costo antes de generar
- Timestamps/SRT automatico
- Prueba con guion real: `Un guardaespaldas escolar.docx`
