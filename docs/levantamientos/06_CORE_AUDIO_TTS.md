# 06 CORE: Audio y TTS - Especificacion Consolidada

**Version:** 1.0 | **Fecha:** 2026-02-06
**Fuentes:** `_recovery/NEW_FEATURES/TTS/VOICE_TTS_PLAN.md`, `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md`, `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/01_Analysis/FLUJO_ACTUAL.md`

---

## 1. Proposito

Definir las reglas fundamentales de generacion de audio (TTS) para el pipeline de produccion QPH. Cubre perfiles de voz, pipeline de generacion, tiering de calidad y reglas de consistencia entre episodios.

---

## 2. Perfiles de Voz por Tipo de Personaje

Cada personaje en un episodio QPH se clasifica en uno de 4 tipos. La clasificacion determina la voz asignada, el nivel de QA y las reglas de consistencia.

| Tipo | Descripcion | Reglas de Voz | Ejemplo QPH |
|:-----|:------------|:--------------|:------------|
| **Protagonista** | Personaje central de la historia. Maximo 2 por episodio. | Voz unica, alta expresividad, speed/pitch personalizados. Se reutiliza si el personaje aparece en multiples episodios. | Gabriel, Noha |
| **Antagonista** | Opositor o fuente de conflicto. | Voz contrastante al protagonista. Tono mas grave o agudo segun el contraste narrativo. | Madre autoritaria, bully escolar |
| **Narrador** | Voz en off que guia la historia. | Tono neutro, "storytime". Consistente en TODA la serie (no cambia entre episodios). Velocidad moderada. | Narrador QPH |
| **Secundario** | Personajes de soporte, apariciones breves. | Voces del pool generico. No requiere consistencia entre episodios salvo que sea recurrente. | Maestro, amigo, vecino |

### 2.1 Desmontaje Semantico (Intenciones)

Antes de generar TTS, cada personaje tiene intenciones emocionales definidas por escena:

```
[PERSONAJE] | Intencion
----------------------------
Narrador    | Neutral, storytime
Personaje A | Ebrio, palabras arrastradas
Personaje B | Susurros, tension
Personaje C | Gritando, desesperacion
```

> Las emociones modifican la longitud real de las frases TTS. Esto obliga a ajustar acciones para mantener coherencia con el timing visual.

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/01_Analysis/FLUJO_ACTUAL.md` (Fase 2: Desmontaje Semantico)

---

## 3. Pipeline de Generacion TTS

### 3.1 Flujo End-to-End

```
  GUION (.docx)
       |
       v
  [1] Extraer Dialogos ──────── ExtraerDialogos / DocxParser
       |
       v
  [2] Mapeo de Voces ─────────── VoiceMapper (Personaje -> VoiceID)
       |
       v
  [3] Generacion TTS ─────────── ElevenLabs API (por escena)
       |
       v
  [4] QA de Audio ────────────── Validacion segun tier
       |
       v
  [5] Export por Escena ──────── Archivos audio organizados
```

### 3.2 Detalle por Paso

| Paso | Input | Herramienta | Output | Responsable |
|:-----|:------|:------------|:-------|:------------|
| **1. Extraer Dialogos** | Guion `.docx` aprobado | `docx_parser.py` / ExtraerDialogos.py | JSON con dialogos por escena y personaje | Sistema (automatico) |
| **2. Mapeo de Voces** | Lista de personajes | VoiceMapper UI o JSON previo | Mapeo `Personaje -> VoiceID` de ElevenLabs | Ramon (C3) |
| **3. Generacion TTS** | Dialogos + VoiceIDs | ElevenLabs TTS API | Archivos de audio por dialogo | Sistema (cola automatica) |
| **4. QA de Audio** | Audio generado vs guion | Revision auditiva + metricas | Audio aprobado o flags | Segun tier (ver seccion 4) |
| **5. Export** | Audio aprobado | Sistema de archivos | Carpeta por episodio/escena | Sistema (automatico) |

### 3.3 Sanitizacion Pre-Generacion

Antes de enviar texto a ElevenLabs, el sistema aplica sanitizacion automatica:

| Problema | Regla | Ejemplo |
|:---------|:------|:--------|
| `no.` interpretado como `number` | Regex: remover punto despues de "no" | `no.` -> `no` |
| Onomatopeyas no detectadas | Preservar en texto | `Ay!`, `Pum!` se mantienen |
| Puntuacion ambigua | Limpieza regex + LLM ligero | `Sr.` -> `Senor` en contexto TTS |

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md` (Solucion D2: Sanitizador de Script)

---

## 4. Tiering de Calidad

### 4.1 Tres Niveles

| Tier | Nombre | Metodo QA | Cuando Aplica |
|:-----|:-------|:----------|:--------------|
| **Tier 1** | Auto-pass | WER < 5% + similarity > 0.95 + consenso STT | Segmentos cortos, narrador, dialogos simples |
| **Tier 2** | Sampling | WER 5-15% o discrepancia menor. Muestreo humano de ~30% | Dialogos con emocion, escenas de accion |
| **Tier 3** | Full Review | WER > 15% o sin consenso. Revision humana obligatoria | Escenas climax, dialogos criticos, contenido sensible |

### 4.2 Metricas de Calidad

| Metrica | Descripcion | Target |
|:--------|:------------|:-------|
| **WER (Word Error Rate)** | Transcripcion del audio generado vs texto original | < 10% promedio |
| **Similaridad Semantica** | Embeddings del texto esperado vs transcripcion | > 0.85 |
| **Consenso STT** | Whisper y Gemini coinciden en transcripcion | > 90% segmentos |
| **Timing Ratio** | Caracteres/segundo del audio | < 15 chars/seg (evitar efecto "ardilla") |

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Quality/VALIDATION_FLOW_TIERING.md` (Seccion 3: Tiering de Validaciones)

---

## 5. Capacidades y Limitaciones de ElevenLabs API

### 5.1 APIs Disponibles

| API | Endpoint | Uso en QPH |
|:----|:---------|:-----------|
| **TTS** | `POST /v1/text-to-speech/{voice_id}` | Generacion de dialogos individuales |
| **Studio Projects** | `POST /v1/studio/projects` | Proyectos estructurados con `from_content_json` |
| **Dubbing** | `POST /v1/dubbing` | Doblaje multi-idioma de video |
| **Speech-to-Text** | `POST /v1/speech-to-text` | Transcripcion para validacion |
| **Forced Alignment** | `POST /v1/forced-alignment` | Verificacion timestamps texto-audio |

### 5.2 Limitaciones Conocidas

| Limitacion | Impacto | Mitigacion |
|:-----------|:--------|:-----------|
| Filtros de seguridad por idioma | Palabras como "muerte", "sexy" bloqueadas en ciertos idiomas | Diccionario de blacklist + sinonimos (pre-scan) |
| Compresion de silencios | No respeta silencios del audio original | Manual Dub CSV con timestamps exactos |
| Mezcla de personajes | Multiples voces detectadas como una sola | Voice Segments v3 con etiquetado por orador |
| Audio "comido" (clipping) | Silabas cortadas al final de frases | Fixed Duration + buffer de respiro |
| Bug `no.` -> `number` | Palabra simple malinterpretada | Sanitizador regex pre-envio |

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md` (Seccion: Problemas Identificados - 7 Mudas)

---

## 6. Reglas de Consistencia entre Episodios

### 6.1 Persistencia de Voice IDs

| Regla | Descripcion |
|:------|:------------|
| **Narrador fijo** | El narrador usa el MISMO VoiceID en todos los episodios de la serie |
| **Personajes recurrentes** | Si un personaje aparece en Cap 1 y Cap 5, DEBE usar el mismo VoiceID |
| **Casting por proyecto** | Se mantiene un mapeo `Personaje -> VoiceID` persistente por serie |
| **Export to Dubbing** | El modulo Voice genera un `manifest.json` con casting que se hereda al dubbing |

### 6.2 Formato de Manifest

```json
{
  "serie": "QuePerroHilo",
  "episodio": "Cap 01",
  "personajes": [
    { "nombre": "Gabriel", "voice_id": "abc123", "tipo": "protagonista" },
    { "nombre": "Narrador", "voice_id": "def456", "tipo": "narrador" }
  ],
  "escenas": [
    { "id": 1, "dialogos": 12, "duracion_estimada": "02:15" }
  ]
}
```

### 6.3 Regla de "Single Source of Truth" del Texto

> El MP4 final de Fernando (post-produccion) se convierte en la UNICA fuente de verdad para el audio. El guion `.docx` original puede estar desactualizado si Fernando recorto o modifico dialogos.

**Protocolo de recuperacion:**
1. Transcribir MP4 final con Whisper (texto real + timestamps)
2. Usar `manifest.json` de Ramon SOLO para mapeo de voces
3. Fuzzy match: alinear texto transcrito con personajes conocidos

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md` (Seccion: El Problema del "Guion Zombie")

---

## 7. Estimacion de Tiempos y Costos

### 7.1 Tiempos de Produccion (Guion Tipico: 347 dialogos, ~42K caracteres)

| Escenario | Tiempo Manual | Tiempo Automatizado | Ahorro |
|:----------|:-------------|:--------------------|:-------|
| Generacion TTS (ES) | ~2 hrs | ~20 min | 83% |
| Mapeo de personajes por episodio | ~10 min | 0 (automatico con manifest) | 100% |

### 7.2 Regla de Pulgar

- Manual: ~4-5 min trabajo / min video
- Automatizado: ~0.5 min trabajo / min video

---

## 8. Relacion con Otros Documentos CORE

| Documento | Relacion con Audio/TTS |
|:----------|:-----------------------|
| `04_CORE_TIMING_RULES.md` | Timing narrativo define duracion maxima por escena -> limita caracteres TTS |
| `05_CORE_CONTENT_MODERATION.md` | Palabras prohibidas aplican tambien al texto enviado a TTS |
| `07_CORE_MULTI_LANGUAGE.md` | TTS en espanol es la base; dubbing hereda mapping de voces |
| `02_OPERATIONS/08_audio_tts_workflow.md` | Workflow operativo detallado de este spec |
| `02_OPERATIONS/09_dubbing_workflow.md` | Workflow de doblaje que consume el output de TTS |
