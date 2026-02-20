## 8. ESTRATEGIA ELEVENLABS API (Febrero 2026)

### 8.1 APIs a USAR

| # | API | Endpoint REAL | Metodo | Funcion | Status Actual | Esfuerzo |
|:--|:----|:-------------|:-------|:--------|:-------------|:---------|
| 1 | **Dubbing Create** | `/v1/dubbing` | `POST` multipart/form-data | Crear proyecto de doblaje completo a partir de video/audio + idioma target | YA IMPLEMENTADO en `elevenlabs.py` (880L) | 0h |
| 2 | **Get Dubbing Resource** | `/v1/dubbing/resource/{dubbing_id}` | `GET` | Obtener estado completo del proyecto: segmentos, speakers, renders, idiomas | NO implementado | 2h |
| 3 | **Create Segment** | `/v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/segment` | `POST` application/json | Crear segmento nuevo con start/end time para un speaker. NO genera audio automaticamente | NO implementado | 1h |
| 4 | **Update Segment** | `/v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language}` | `PATCH` application/json | Modificar texto y/o tiempos de UN segmento en UN idioma especifico. NO regenera el dub | NO implementado | 1h |
| 5 | **Delete Segment** | `/v1/dubbing/resource/{dubbing_id}/segment/{segment_id}` | `DELETE` | Eliminar segmento completo de todas las lenguas | NO implementado | 0.5h |
| 6 | **Transcribe Segments** | `/v1/dubbing/resource/{dubbing_id}/transcribe` | `POST` application/json | Regenerar transcripciones para segmentos especificos. NO regenera traducciones ni dubs | NO implementado | 1h |
| 7 | **Translate Segments** | `/v1/dubbing/resource/{dubbing_id}/translate` | `POST` application/json | Regenerar traducciones para segmentos/idiomas especificos. Auto-transcribe faltantes. NO regenera dubs | NO implementado | 1h |
| 8 | **Dub Segments** | `/v1/dubbing/resource/{dubbing_id}/dub` | `POST` application/json | Regenerar audio doblado para segmentos/idiomas especificos. Auto-transcribe y traduce faltantes | NO implementado | 1h |
| 9 | **Render Project** | `/v1/dubbing/resource/{dubbing_id}/render/{language}` | `POST` application/json | Renderizar output final: mp4, aac, mp3, wav, aaf, tracks_zip, clips_zip con normalize_volume | NO implementado | 2h |
| 10 | **Migrate Segments** | `/v1/dubbing/resource/{dubbing_id}/migrate-segments` | `POST` application/json | Reasignar uno o mas segmentos a un speaker diferente en bulk | NO implementado | 1h |
| 11 | **Get Similar Voices** | `/v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/similar-voices` | `GET` | Top 10 voces similares a un speaker, con voice_id, nombre, descripcion y preview audio | NO implementado | 0.5h |
| 12 | **Forced Alignment** | `/v1/forced-alignment` | `POST` multipart/form-data | Alinear audio con texto: timing por caracter y por palabra con score de confianza (loss) | NO implementado | 3h |
| 13 | **Speech-to-Text (Scribe v2)** | `/v1/speech-to-text` | `POST` multipart/form-data | Transcripcion con diarizacion, entity_detection, keyterm prompting, export a SRT/VTT, tag_audio_events | PARCIAL (solo v1) | 2h |
| 14 | **Pronunciation Dictionaries** | `/v1/pronunciation-dictionaries/add-from-file` | `POST` multipart/form-data | Crear diccionario desde archivo .PLS con reglas IPA, versionado, workspace_access compartido | NO implementado | 3h |
| 15 | **Audio Isolation** | `/v1/audio-isolation` | `POST` multipart/form-data | Remover ruido de fondo del audio de Fernando. Retorna audio limpio como binary stream | NO implementado | 2h |
| 16 | **PVC Speaker Separation** | `/v1/voices/pvc/{voice_id}/samples/{sample_id}/separate-speakers` | `POST` | Separar speakers de audio multi-speaker (hasta 9 speakers por muestra) | NO implementado | 4h |

**Total esfuerzo de integracion API: ~25h** (distribuidas en Phases 1-3 del roadmap)

---

### 8.2 APIs DESCUBIERTAS (no mencionadas en ningun documento previo del debate)

Estas 8 capacidades NO fueron identificadas en ninguno de los documentos de debate previos (claude_debate.md, Codex_2026-02-20_Gold_Standard_Unificado.md, devil_advocate_critique.md, Gemini_Multi_opinion.md) ni en la mega propuesta original. Provienen del analisis directo de la referencia API de febrero 2026.

| # | API / Capacidad | Endpoint / Parametro | Impacto para QPH |
|:--|:---------------|:---------------------|:-----------------|
| 1 | **Render con tracks_zip / clips_zip / aaf** | `POST /v1/dubbing/resource/{dubbing_id}/render/{language}` con `render_type` = `tracks_zip`, `clips_zip`, o `aaf` | **ALTO.** Fernando obtiene stems por speaker + archivo AAF para importar directo a DaVinci Resolve o ProTools. Elimina la mezcla manual y permite correccion quirurgica por pista |
| 2 | **use_profanity_filter [BETA]** | Parametro `use_profanity_filter: true` en `POST /v1/dubbing` | **ALTO.** Filtro nativo de profanidad que censura con `[censored]` en la transcripcion. Capa de safety GRATUITA para contenido infantil sin necesidad de herramientas externas |
| 3 | **STT Keyterm Prompting** | Parametro `keyterms: string[]` en `POST /v1/speech-to-text` (maximo 100 terminos, cada uno < 50 caracteres, <= 5 palabras) | **ALTO.** Forzar reconocimiento correcto de nombres de personajes QPH (Gabriel, etc.) y terminos propios del universo narrativo. Elimina errores recurrentes de STT en nombres propios |
| 4 | **STT export a SRT/VTT** | Parametro `additional_formats: [{format: "srt"}]` o `[{format: "vtt"}]` en `POST /v1/speech-to-text` | **MEDIO.** Generacion automatica de subtitulos por idioma como subproducto del pipeline de QA, sin trabajo adicional. Tambien soporta docx, html, pdf, segmented_json, txt |
| 5 | **PVC Speaker Separation** | `POST /v1/voices/pvc/{voice_id}/samples/{sample_id}/separate-speakers` | **ALTO.** Separar el audio multi-speaker de Fernando programaticamente (hasta 9 speakers). Resuelve la Opcion C del D-004 sin depender de que Fernando exporte stems manualmente |
| 6 | **GET /v1/usage** (inferido de la arquitectura API) | `GET /v1/usage` | **MEDIO.** Monitoreo de costos en tiempo real por workspace. Permite implementar alertas de presupuesto y calcular ROI por idioma automaticamente |
| 7 | **target_accent [Experimental]** | Parametro `target_accent: string` en `POST /v1/dubbing` | **MEDIO.** Control de acento por idioma target. Por ejemplo: `pt-br` vs `pt-pt`, `es-mx` vs `es-es`. Informa tanto la seleccion de voces como el dialecto de traduccion preferido |
| 8 | **Request Stitching** (patron cookbook) | Patron documentado para TTS: enviar `previous_text` y `next_text` como contexto entre chunks | **MEDIO.** Mantiene consistencia de prosodia y voz cuando se regeneran segmentos individuales post-correccion. Evita el efecto "audio parchado" entre segmentos editados y no editados |

---

### 8.3 APIs a NO USAR

| API | Endpoint / Mecanismo | Razon de exclusion |
|:----|:---------------------|:-------------------|
| **Manual Dub CSV** | `POST /v1/dubbing` con `mode: "manual"` y `csv_file` | Marcado textualmente como "experimental and production use is strongly discouraged" en la documentacion oficial. Consenso de 3 de 4 opiniones AI: CSV NO es pilar del pipeline |
| **from_content_json** | Parametro en dubbing create | Bloqueado en plan Pro. Requiere contactar ventas para habilitar. Incompatible con el tier de QPH hasta que se negocie upgrade |
| **Text-to-Dialogue v3** | API separada (eleven_v3) | En fase Alpha con restricciones comerciales. Ademas, Request Stitching NO esta disponible para este modelo |
| **auto_assign_voices** | Parametro fantasma | **NO EXISTE** como parametro en ningun endpoint documentado de la Dubbing API. Existe como feature en Studio API (audiobooks), pero NO en dubbing. A-021 = FALSA |

---

### 8.4 Key Parameters Reference

#### 8.4.1 POST /v1/dubbing (Crear proyecto)

| Parametro | Tipo | Requerido | Descripcion |
|:----------|:-----|:----------|:------------|
| `file` | binary | No* | Archivo de audio/video para doblar. *Exactamente uno de `file` o `source_url` es requerido |
| `source_url` | string | No* | URL del archivo fuente (alternativa a file) |
| `source_lang` | string | No | Idioma fuente. ISO 639-1 o 639-3. Default: `auto` (deteccion automatica) |
| `target_lang` | string | SI | Idioma target. ISO 639-1 o 639-3 |
| `target_accent` | string | No | **[Experimental]** Acento a aplicar. Informa seleccion de voces y dialecto de traduccion |
| `num_speakers` | integer | No | Numero de speakers. Default: `0` (deteccion automatica). Maximo no documentado |
| `dubbing_studio` | boolean | No | Default: `false`. **DEBE ser `true`** para habilitar Dubbing Resource API (edicion granular de segmentos) |
| `use_profanity_filter` | boolean | No | **[BETA]** Censurar profanidades con `[censored]` en transcripciones |
| `drop_background_audio` | boolean | No | Default: `false`. Eliminar track de fondo. Util para monologos o discursos |
| `disable_voice_cloning` | boolean | No | Default: `false`. Usar voces similares de la biblioteca en vez de clonar. Consume slots de custom voices |
| `mode` | enum | No | `automatic` (default) o `manual`. Manual = experimental, NO usar |
| `watermark` | boolean | No | Default: `false`. Aplicar watermark al video de salida |
| `highest_resolution` | boolean | No | Default: `false`. Usar maxima resolucion disponible |
| `start_time` / `end_time` | integer | No | Recortar segmento del archivo fuente (en segundos) |
| `csv_file` | binary | No | Archivo CSV con metadata. Solo para `mode: manual`. NO USAR |

**Response:** `{ dubbing_id: string, expected_duration_sec: number }`

#### 8.4.2 PATCH /v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language} (Actualizar segmento)

| Parametro | Ubicacion | Tipo | Requerido | Descripcion |
|:----------|:----------|:-----|:----------|:------------|
| `dubbing_id` | path | string | SI | ID del proyecto de dubbing |
| `segment_id` | path | string | SI | ID del segmento a modificar |
| `language` | path | string | SI | Codigo ISO del idioma a actualizar (e.g., `en`, `pt`, `de`) |
| `text` | body | string | No | Nuevo texto para el segmento en ese idioma |
| `start_time` | body | number (double) | No | Nuevo tiempo de inicio en segundos |
| `end_time` | body | number (double) | No | Nuevo tiempo de fin en segundos |

**CRITICO:** El path requiere los 3 parametros: `dubbing_id` + `segment_id` + `language`. Es singular: `/resource/` (no `/resources/`), `/segment/` (no `/segments/`). NO regenera el dub automaticamente -- se debe llamar a `/dub` despues.

**Response:** `{ version: integer }`

#### 8.4.3 POST /v1/speech-to-text (Scribe v2)

| Parametro | Tipo | Requerido | Descripcion |
|:----------|:-----|:----------|:------------|
| `model_id` | enum | SI | `scribe_v1` o `scribe_v2`. **Usar `scribe_v2`** para entity detection y keyterms |
| `file` | binary | No* | Audio/video a transcribir. Max 3GB. *Exactamente uno de `file` o `cloud_storage_url` |
| `cloud_storage_url` | string | No* | URL HTTPS del archivo. Max 2GB. Soporta S3, GCS, R2, CDNs |
| `language_code` | string | No | ISO 639-1/639-3. Default: auto-detect |
| `keyterms` | string[] | No | Lista de hasta **100 terminos** para sesgar reconocimiento. Cada uno < 50 chars, <= 5 palabras. **Costo adicional** |
| `entity_detection` | string \| string[] | No | Categorias: `all`, `pii`, `phi`, `pci`, `offensive_language`, `other`. Retorna entidades con `text`, `entity_type`, `start_char`, `end_char`. **Costo adicional** |
| `tag_audio_events` | boolean | No | Default: `true`. Etiquetar eventos como (laughter), (footsteps) en la transcripcion |
| `diarize` | boolean | No | Default: `false`. Anotar que speaker habla en cada momento |
| `diarization_threshold` | number | No | Umbral de diarizacion (default ~0.22). Solo valido con `diarize=true` y `num_speakers=null` |
| `num_speakers` | integer | No | Maximo de speakers a predecir. Maximo: 32. Default: maximo del modelo |
| `timestamps_granularity` | enum | No | `none`, `word` (default), `character`. Nivel de detalle de timestamps |
| `additional_formats` | ExportOptions[] | No | Exportar a: `srt`, `vtt`, `docx`, `html`, `pdf`, `segmented_json`, `txt`. Cada formato acepta `include_speakers`, `include_timestamps`, `max_segment_duration_s`, `max_segment_chars` |
| `webhook` | boolean | No | Default: `false`. Procesamiento asincrono con entrega por webhook |
| `webhook_metadata` | string \| object | No | Metadata personalizada para correlacionar webhooks. Max 16KB, profundidad max 2 niveles |
| `use_multi_channel` | boolean | No | Default: `false`. Transcribir canales independientemente (max 5 canales). Respuesta incluye `channel_index` por palabra |
| `temperature` | number | No | Rango 0.0-2.0. Mayor = mas diverso, menos determinista |
| `seed` | integer | No | Rango 0-2147483647. Mejor esfuerzo para reproducibilidad |

**Response words incluyen:** `text`, `start`, `end`, `type` (word/spacing/audio_event), `speaker_id`, `logprob` (confianza: [-inf, 0], mayor = mejor)

#### 8.4.4 POST /v1/forced-alignment (Alineacion forzada)

| Parametro | Tipo | Requerido | Descripcion |
|:----------|:-----|:----------|:------------|
| `file` | binary | SI | Audio a alinear. Todos los formatos principales. Max 1GB |
| `text` | string | SI | Texto a alinear con el audio. Cualquier formato. Diarizacion NO soportada |
| `enabled_spooled_file` | boolean | No | Default: `false`. Streaming por chunks para archivos grandes que no caben en memoria |

**Response:**
- `characters[]`: array con `{ text: string, start: number, end: number }` por cada caracter
- `words[]`: array con `{ text: string, start: number, end: number, loss: number }` por cada palabra
- `loss`: number -- score promedio de confianza de alineacion para toda la transcripcion (calculado desde todos los caracteres)

**Uso para QPH:** Comparar `loss` por palabra entre audio original (ES) y audio doblado (EN, DE, etc.) para detectar drift de timing y segmentos donde la alineacion es pobre. Un `loss` alto indica baja confianza = segmento candidato a revision humana.

#### 8.4.5 POST /v1/dubbing/resource/{dubbing_id}/render/{language} (Render final)

| Parametro | Ubicacion | Tipo | Requerido | Descripcion |
|:----------|:----------|:-----|:----------|:------------|
| `dubbing_id` | path | string | SI | ID del proyecto |
| `language` | path | string | SI | Codigo del idioma target (e.g., `es`, `en`). Usar `original` para track fuente |
| `render_type` | body | enum | SI | `mp4`, `aac`, `mp3`, `wav`, `aaf`, `tracks_zip`, `clips_zip` |
| `normalize_volume` | body | boolean | No | Normalizar volumen del audio renderizado |

**Formatos clave para QPH:**
- `mp4`: entrega final para YouTube
- `wav`: master de audio sin compresion para Fernando
- `tracks_zip`: **ZIP con stems separados por speaker** -- Fernando puede mezclar en DaVinci/ProTools
- `clips_zip`: **ZIP con clips individuales por segmento** -- util para reemplazos quirurgicos
- `aaf`: **Advanced Authoring Format** -- import directo a ProTools/DaVinci con timeline preservado

**Response:** `{ version: integer, render_id: string }` -- renders son asincronos. Verificar estado con `GET /v1/dubbing/resource/{dubbing_id}`.

---

## 9. BLACKLISTS Y ADAPTACION CULTURAL

### 9.1 Estado actual

El estado actual de las blacklists y la adaptacion cultural en el repo Doge-MultiLang es **criticamente insuficiente** para contenido infantil distribuido a 27 idiomas:

| Dimension | Estado | Riesgo |
|:----------|:-------|:-------|
| Blacklists existentes | 3 archivos JSON: `blacklist_global.json` (6 palabras), `blacklist_ar.json` (5 palabras), `blacklist_de.json` (2 palabras). **Total: 13 entradas** | **CRITICO** |
| Idiomas cubiertos | 3 de 27 (global + AR + DE). **24 idiomas con CERO blacklist** | **CRITICO** |
| Integracion en pipeline | `prescanner.py` (378L en AI-Studio) **NO lee los archivos blacklist** del repo Doge-MultiLang | **ALTO** |
| Directorio by_language/ | Referenciado en `blacklist_global.json` como ruta de archivos por idioma. **El directorio NO EXISTE** | **MEDIO** |
| Diccionario cultural positivo | **NO EXISTE** -- solo se define "que no decir", nunca "que si decir" | **ALTO** |
| Regulaciones por mercado | **NO DOCUMENTADAS** en el repo. Cero referencia a COPPA, AVMSD, NRTA, KCSC | **ALTO** |
| Onomatopeyas | Mencionadas en Q8 como problema recurrente pero **SIN tabla de mapeo** | **MEDIO** |
| Registro de formalidad | Documentado parcialmente en `07_CORE_MULTI_LANGUAGE.md` (du/Sie en DE) pero **sin tabla consolidada** | **MEDIO** |

> **Contexto critico:** QPH produce contenido para audiencia de 8-15 anos que se publica sin revision humana en 26 de 27 idiomas. Un insulto cultural no detectado llega a millones de ninos.

---

### 9.2 Framework de 3 capas

El framework consolida las recomendaciones de todos los documentos de debate (Claude, Devil's Advocate, Codex, Gemini) y del addendum de deep research en una arquitectura de 3 capas defensivas que operan en secuencia.

#### Capa 1 -- API de Content Safety (pre-TTS)

Detectar contenido inapropiado ANTES de enviar a ElevenLabs para generacion de audio. Costo de prevencion << costo de correccion.

| Mecanismo | Endpoint / Herramienta | Funcion | Costo | Prioridad |
|:----------|:----------------------|:--------|:------|:----------|
| **ElevenLabs use_profanity_filter** | `POST /v1/dubbing` con `use_profanity_filter: true` | Censurar profanidades en transcripciones con `[censored]`. Nativo, sin configuracion | $0 (incluido en plan) | **P0 -- activar inmediatamente** |
| **Scribe v2 entity_detection** | `POST /v1/speech-to-text` con `entity_detection: "offensive_language"` | Detectar 56 tipos de entidades incluyendo categoria `offensive_language` con posiciones exactas en el texto (start_char, end_char) | Costo adicional STT | **P0 -- usar en auditoria post-generacion** |
| **LLM Safety Judge** | Claude Sonnet / GPT-4o via API | Evaluar segmentos flaggeados con contexto cultural. Categorizar en A (bloquear) / B (revisar) / C (advertir) | ~$0.01-0.03/segmento | **P1 -- para casos ambiguos** |
| **Azure AI Content Safety o Google Perspective API** | APIs externas | Segunda opinion para Tier 1. Perspective API: gratis hasta 1 QPS | $0 - $0.001/req | **P2 -- complemento opcional** |

**Regla de umbral para contenido infantil:** `severity > 0` en CUALQUIER categoria = **BLOCK**. Tolerancia cero. El contenido se detiene hasta revision humana.

#### Capa 2 -- Blacklists por idioma (27 archivos JSON)

Archivos de configuracion en Doge-MultiLang que `prescanner.py` DEBE leer antes de enviar texto a ElevenLabs.

**Estructura de cada archivo** (`knowledgebase/blacklists/blacklist_{lang}.json`):

```json
{
  "language": "ar",
  "version": "1.0.0",
  "last_updated": "2026-02-20",
  "validated_by": "native_speaker_name",
  "entries": [
    {
      "term": "khanzir",
      "category": "A",
      "severity": "critical",
      "regex_pattern": "\\bkhanzir\\b|\\bخنزير\\b",
      "replacement_suggestion": "ghayr nazif (sucio/desordenado)",
      "context": "Animal haram en islam. Usar como insulto es ofensivo en todo contexto arabe",
      "added_by": "llm_draft",
      "validated": true
    }
  ]
}
```

**Categorias de severidad:**

| Categoria | Severidad | Accion del pipeline | Ejemplo |
|:----------|:----------|:-------------------|:--------|
| **A** | Critical (25 pts) | **BLOCK** -- pipeline se detiene, requiere intervencion humana | Insulto racial, referencia sexual, contenido haram |
| **B** | Major (5 pts) | **WARN** -- flag para revision, pipeline continua con advertencia | Doble sentido, slang potencialmente ofensivo |
| **C** | Minor (1 pt) | **LOG** -- registrar para mejora continua, pipeline continua | Informalidad excesiva, termino desaconsejado |

**Plan de generacion de las 24 blacklists faltantes:**

| Paso | Accion | Tiempo | Responsable |
|:-----|:-------|:-------|:------------|
| 1 | LLM genera draft de 50-100 terminos por idioma usando contexto infantil (8-15 anos) | 4h (automatizado) | Daniel |
| 2 | Revision por hablante nativo (freelancer o contacto interno) | 1-2h por idioma | Nativos |
| 3 | Validacion cruzada: segundo LLM verifica que no haya falsos positivos | 2h (automatizado) | Daniel |
| 4 | Merge a repo con campo `validated: true/false` | 1h | Daniel |
| **Total** | | **2-3 dias** para 24 idiomas | |

**Integracion obligatoria:** `prescanner.py` DEBE ser modificado para:
1. Leer archivos de `knowledgebase/blacklists/blacklist_{lang}.json`
2. Aplicar regex patterns contra cada linea del guion parseado
3. Retornar lista de matches con categoria/severidad/sugerencia de reemplazo
4. Bloquear pipeline si hay CUALQUIER match de Categoria A

#### Capa 3 -- Diccionario Cultural Positivo (cultural_matrix_global.json)

Las blacklists dicen "que NO decir". El diccionario cultural positivo dice "que SI decir". Consolida las recomendaciones de Gemini Deep Thinking y del Addendum de deep research.

**Estructura del archivo** (`knowledgebase/cultural_mappings/cultural_matrix_global.json`):

```json
{
  "version": "1.0.0",
  "project_directives": {
    "target_audience": "8-15",
    "violence_level": "zero",
    "translation_philosophy": "localization + selective tropicalization",
    "profanity_tolerance": "zero",
    "romantic_content": "none"
  },
  "locales": {
    "ar": {
      "compliance_framework": "Islamic media standards + national media councils",
      "formality_register": {
        "children_to_children": "informal",
        "children_to_adults": "semi-formal",
        "pronoun_default": "informal gendered"
      },
      "cultural_sensitivities": [
        "animal_haram: cerdo/khanzir NUNCA como insulto ni referencia casual",
        "religious_neutrality: evitar referencias a deidades no islamicas",
        "romantic_content: CERO contenido romantico en cualquier forma"
      ],
      "slang_mapping": {
        "que_padre": { "equivalent": "yaa salaam!", "context": "exclamacion positiva" },
        "genial": { "equivalent": "mumtaz!", "context": "aprobacion" },
        "que_asco": { "equivalent": "uff!", "context": "disgusto leve, evitar insultos" }
      },
      "onomatopoeias_override": {
        "dog_bark": "haw haw",
        "cat_meow": "miyau",
        "explosion": "buum",
        "laughter": "hahaha",
        "hit": "bakh",
        "surprise": "ya!",
        "pain": "aakh!",
        "crying": "waaa"
      }
    }
  }
}
```

**Campos por locale:**

| Campo | Tipo | Funcion |
|:------|:-----|:--------|
| `compliance_framework` | string | Marco regulatorio aplicable (COPPA, AVMSD, NRTA, KCSC, etc.) |
| `formality_register` | object | Reglas de tu/vous, du/Sie, etc. por contexto de interaccion |
| `cultural_sensitivities` | string[] | Lista de reglas culturales especificas que el LLM debe respetar |
| `slang_mapping` | object | Mapeo de modismos ES-MX a equivalentes locales con contexto |
| `onomatopoeias_override` | object | Tabla de lookup directa: cuando `is_onomatopoeia=true`, usar este valor en vez de inferencia LLM |

**Bypass programatico de onomatopeyas:** Cuando el prescanner detecta que una linea es una onomatopeya pura (e.g., "Guau guau!", "Bum!"), se aplica el lookup table directamente SIN pasar por el LLM de traduccion. Esto evita traducciones literales absurdas como "Woof woof" -> "Guau guau" -> "ワンワン" donde el LLM podria equivocarse con la cadena de traduccion.

---

### 9.3 Onomatopeyas: tabla de adaptacion

Los sonidos NO son universales entre culturas. Un perro dice "woof" en ingles pero "wan wan" en japones. Para contenido animado infantil, las onomatopeyas son frecuentes y su mala adaptacion rompe la inmersion.

| Sonido | ES | EN | DE | JA | KO | AR | PT-BR | FR |
|:-------|:---|:---|:---|:---|:---|:---|:------|:---|
| **Perro** | guau guau | woof woof | wau wau | wan wan | meong meong | haw haw | au au | ouaf ouaf |
| **Gato** | miau | meow | miau | nyan | yaong | miyau | miau | miaou |
| **Explosion** | bum | boom | bumm | don | kwang | buum | bum | boum |
| **Risa** | jajaja | hahaha | hahaha | ahaha | kkkk | hahaha | hahaha | hahaha |
| **Golpe** | pum | bam | peng | bashi | tak | bakh | pum | paf |
| **Sorpresa** | oh! | oh! | oh! | e! / ara! | heol! | ya! | oh! | oh la la! |
| **Dolor** | ay! | ouch! | au! / aua! | itai! | aya! | aakh! | ai! | aie! |
| **Llanto** | buaaa | waah | wah | uwaan | heung heung | waaa | buaaa | ouin ouin |
| **Miedo** | ahhh | ahhh | ahhh | kyaa! | kkya! | ahhh | ahhh | aaah |
| **Asco** | guacala | eww | igitt | geh | euk | uff | eca | beurk |
| **Aplauso** | clap clap | clap clap | klatsch | pachi pachi | jjak jjak | tasfiq | palmas | clap clap |
| **Estornudo** | achu | achoo | hatschi | hakushon | echi | atsa | atchim | atchoum |

> **Nota sobre japones:** El japones tiene aproximadamente 4,500 onomatopeyas, versus unas 1,200 en ingles. Es el idioma que requiere mayor trabajo de adaptacion. Incluye categorias como giongo (sonidos reales), gitaigo (condiciones/estados), y gijougo (emociones) que no tienen equivalente directo.

---

### 9.4 Registro de formalidad por idioma

Para contenido infantil (audiencia 8-15 anos), la regla general es: usar registro INFORMAL entre personajes de la misma edad. El registro formal solo aparece cuando un nino habla con un adulto de autoridad.

| Idioma | Registro QPH (entre ninos) | Forma a USAR | Forma a EVITAR | Notas |
|:-------|:--------------------------|:-------------|:---------------|:------|
| **Aleman (DE)** | Informal | `du` (tu), `euch` (vosotros) | `Sie` (usted), `Ihnen` | Mezclar du/Sie en un mismo dialogo es discordante. Mantener `du` consistente. Solo `Sie` para profesores/policias |
| **Frances (FR)** | Informal | `tu` entre ninos, `on` coloquial | `vous` (usted/ustedes formal) | `vous` solo para adultos de autoridad. `on` es comun en habla infantil coloquial |
| **Japones (JA)** | Casual / plain form | Formas casuales: `~da`, `~yo`, `~ne` | Keigo completo: `~desu`, `~masu`, `~gozaimasu` | Preservar matices via patrones de habla (particulas, contracciones), no traduccion literal. Pronombres frecuentemente omitidos |
| **Coreano (KO)** | Haoche/haerache (medio-informal) | Nivel medio de los 7 niveles de habla | Hapsyoche (formal alto), hapshoche | Coreano tiene 7 niveles de formalidad. Usar nivel medio-informal para dialogo entre pares. Pronombres frecuentemente omitidos |
| **Hindi (HI)** | Informal-medio | `tum` (tu informal-medio) | `aap` (usted formal) | 3 niveles: `tu` (muy informal/irrespetuoso) < `tum` (informal amigable) < `aap` (formal/respetuoso). `tum` es el correcto para ninos |
| **Indonesio (ID)** | Informal | `aku` (yo), `kamu` (tu) | `saya` (yo formal), `Anda` (usted) | `saya`/`Anda` es demasiado formal para ninos. `aku`/`kamu` es el registro natural infantil |
| **Ruso (RU)** | Informal | `ty` (tu), formas verbales singulares | `Vy` (usted), formas verbales plurales corteses | `Vy` solo para adultos autoritarios (maestros, padres en contexto serio) |
| **Turco (TR)** | Informal | `sen` (tu), sufijos informales | `siz` (usted), sufijos formales | `siz` solo para adultos/figuras de respeto |
| **Portugues BR (PT-BR)** | Informal | `voce` (tu/usted neutro) | `o senhor/a senhora` (muy formal) | `voce` funciona como neutro en Brasil. Evitar `tu` que varia por region. `voce` es la opcion segura pan-brasilena |
| **Arabe (AR)** | Informal | Formas verbales informales, genero gramatical correcto | Formas ultra-formales | Menos complejidad pronominal que lenguas asiaticas, pero genero gramatical en sustantivos y verbos es critico |
| **Chino Mandarin (ZH)** | Informal | `ni` (tu) | `nin` (usted) | `nin` solo para ancianos o figuras de gran respeto. Estructura gramatical no cambia tanto por formalidad |

---

### 9.5 Regulaciones por mercado

Cada mercado tiene regulaciones especificas para contenido infantil. QPH debe cumplir con el marco mas estricto aplicable a cada idioma/region.

| Mercado | Marco Regulatorio | Requisito clave para contenido infantil | Implicacion para QPH |
|:--------|:-----------------|:---------------------------------------|:---------------------|
| **EEUU** | COPPA (Children's Online Privacy Protection Act, actualizado abril 2025) | Filtros de violencia, sustancias, datos de menores de 13. No recolectar datos de ninos sin consentimiento verificable | Activar `use_profanity_filter`. Asegurar que entity_detection no almacene PII de menores. Blacklist EN debe incluir terminologia de sustancias/violencia |
| **Union Europea** | AVMSD Art. 28b (Audiovisual Media Services Directive) | Proteger menores de contenido que perjudique desarrollo fisico, mental o moral. Plataformas responsables de moderacion | Blacklists de todos los idiomas EU (DE, FR, IT, ES, PT, NL, PL, RO, etc.) deben estar activas. Registro de formalidad apropiado por edad |
| **China** | NRTA (National Radio and Television Administration) + CAC "Modo Menor" (abril 2025) | Debe "promover valores socialistas". Limites estrictos de tiempo de visualizacion. Prohibido contenido que "induzca adiccion" en menores | Blacklist ZH requiere revision especializada. Evitar cualquier referencia politica/religiosa. Contenido debe ser "positivo y edificante" |
| **Corea del Sur** | KCSC (Korea Communications Standards Commission) | Sistema de calificacion por edad. Estandares especificos de violencia y lenguaje para contenido juvenil | Blacklist KO debe alinearse con categorias KCSC. Registro de habla debe ser apropiado (nivel medio-informal) |
| **Japon** | BPO (Broadcasting Ethics & Program Improvement Organization) - autorregulacion + CERO A rating | Basado en quejas. Politica 2025 protege libertad creativa pero con limites claros. CERO A = apto para todas las edades | El contenido animado japones tiene estandares especificos. Blacklist JA debe considerar contexto cultural de anime. Onomatopeyas son criticas |
| **Medio Oriente** (AR, regiones del Golfo) | Consejos nacionales de medios + estandares islamicos | Contenido haram filtrado (cerdo, alcohol, deidades no islamicas). Restricciones romanticas absolutas. Genero gramatical correcto | Blacklist AR es la mas sensible. Cero referencias a cerdo como animal/insulto. Cero contenido romantico. Validacion por hablante nativo arabe OBLIGATORIA |
| **India** | CBFC guidelines + Information Technology (Intermediary Guidelines) Rules 2021 | Proteccion de menores. No violencia grafica. Sensibilidad religiosa (hindu, musulman, sikh, etc.) | Blacklist HI debe cubrir sensibilidades multi-religiosas. Usar `tum` (informal-medio). Evitar referencias a castas |
| **Brasil** | ECA (Estatuto da Crianca e do Adolescente) + Classificacao Indicativa | Sistema de clasificacion por edad. Contenido infantil no puede contener violencia, drogas, contenido sexual | Blacklist PT-BR relativamente sencilla pero debe incluir regionalismos ofensivos. Usar `voce` como pronombre neutro |
| **Turquia** | RTUK (Radio and Television Supreme Council) | Estandares estrictos para contenido juvenil. Sensibilidad a contenido religioso y politico | Blacklist TR debe considerar sensibilidades seculares y religiosas. Registro `sen` (informal) entre ninos |
| **Indonesia** | KPI (Komisi Penyiaran Indonesia) | Estandares de contenido para menores alineados con valores islamicos y Pancasila | Similar a Medio Oriente en sensibilidad religiosa. Registro `aku`/`kamu` informal. Blacklist ID debe cubrir sensibilidades islamicas |

> **HALLAZGO CRITICO del Addendum:** La moderacion AI es hasta un 30% MENOS precisa en idiomas de bajos recursos (coreano, malayo, filipino, tamil). Estos son exactamente los idiomas Tier 3 de QPH. Paradojicamente, Tier 3 necesita MAS chequeo de safety, no menos. Esto refuerza la necesidad de blacklists exhaustivas como complemento a la deteccion automatica.
