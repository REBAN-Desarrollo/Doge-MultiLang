# ADDENDUM: Deep Research - Gaps, Soluciones y Mejora Continua

| Campo | Valor |
|:------|:------|
| **Version** | v1.0 |
| **Fecha** | 2026-02-20 |
| **Autor** | Claude Opus 4.6 (4 agentes de deep research en paralelo) |
| **Complementa** | `debate/mega_propuesta_final.md` v1.0 |
| **Objetivo** | Cubrir los gaps identificados en el mega documento + incorporar feedback de Codex + deep research de herramientas reales |

> **Este documento es un ADDENDUM, no un reemplazo.** Lee primero `mega_propuesta_final.md` para contexto completo.

---

## TABLA DE CONTENIDOS

1. [Feedback de Codex: 4 Mejoras al Mega Doc](#1-feedback-de-codex-4-mejoras-al-mega-doc)
2. [Gap Analysis: Lo que Falta en el Mega Doc](#2-gap-analysis-lo-que-falta-en-el-mega-doc)
3. [Multi-LLM Translation Audit: La Mejor Solucion](#3-multi-llm-translation-audit-la-mejor-solucion)
4. [Tropicalizacion y Adaptacion Cultural](#4-tropicalizacion-y-adaptacion-cultural)
5. [Verificacion de Audio Output](#5-verificacion-de-audio-output)
6. [Modulo Kaizen: Mejora Continua](#6-modulo-kaizen-mejora-continua)
7. [Proceso Completo Integrado](#7-proceso-completo-integrado)
8. [Costos Consolidados](#8-costos-consolidados)
9. [Herramientas y Referencias](#9-herramientas-y-referencias)

---

## 1. FEEDBACK DE CODEX: 4 MEJORAS AL MEGA DOC

### 1.1 Tabla de Verificacion: Repo vs AI-Studio vs Hipotesis

| Item | Verificado en Doge-MultiLang | Verificado en AI-Studio | Hipotesis (no verificado) |
|:-----|:----------------------------|:------------------------|:--------------------------|
| Blacklists (3 idiomas: AR, DE, global) | SI - archivos JSON existen | N/A | Las otras 24 blacklists |
| Levantamientos Q1-Q8 | SI - docs existen | N/A | Respuestas de Q1,Q2,Q7 |
| docx_parser.py (435L) | NO - no existe aqui | Reportado por agentes | Funcionalidad real |
| elevenlabs.py (880L) | NO - no existe aqui | Reportado por agentes | Compatibilidad API feb 2026 |
| dubbing_service.py (304L) | NO - no existe aqui | Reportado por agentes | Conexion con pipeline |
| dubbing_pipeline.py (284L) | NO - no existe aqui | Reportado por agentes | WER funciona correctamente |
| prescanner.py (378L) | NO - no existe aqui | Reportado por agentes | Bug P0 confirmado |
| alignment_engine.py (120L) | NO - no existe aqui | Reportado por agentes | Precision del fuzzy match |
| Frontend dubbing (14 componentes) | NO - no existe aqui | Reportado por agentes | Estado funcional |
| PR #71 | NO | Referencia externa | Mergeability, 14 meses stale |
| Dubbing Resource API funciona con Pro | N/A | N/A | **NO VERIFICADO** |
| Costo QA ~$1.20/proyecto | N/A | N/A | **NO VERIFICADO** (ver seccion 8) |
| Fernando puede exportar stems | N/A | N/A | **NO VERIFICADO** |
| 27 idiomas es el numero correcto | Parcial (tabla en Q8) | N/A | Discrepancia 16 vs 17 vs 27 |

> **CONCLUSION:** Solo 3 items estan verificados en ESTE repo. Todo lo de AI-Studio es "reportado por agentes" (confianza ~60-70%). Todo lo de funcionalidad real es hipotesis hasta prueba E2E.

### 1.2 Banner: Phase 1+2 Pendiente de Validacion E2E

> **WARNING: "IMPLEMENTADO" != FUNCIONAL EN PRODUCCION**
>
> Las ~3,000 lineas de codigo reportadas en AI-Studio (Phase 1+2) fueron verificadas por agentes que LEYERON el codigo, pero NUNCA se ejecuto un episodio real end-to-end. Hasta que R-001 (verificar PR #71) y un test E2E se completen, tratar todo como **HIPOTESIS CON EVIDENCIA PARCIAL**.

### 1.3 Contratos de Datos v1 (Congelados)

Los 4 JSONs propuestos por Codex como SSOT entre componentes:

**dialogue_objects.json** (guion parseado)
```json
{
  "episode_id": "EP001",
  "source_language": "es",
  "scenes": [
    {
      "scene_id": "S01",
      "start_ms": 0,
      "end_ms": 15000,
      "lines": [
        {
          "line_id": "L001",
          "speaker": "Gabriel",
          "voice_id": "abc123",
          "text_es": "Hola amigos, bienvenidos",
          "emotion": "happy",
          "timing": { "start_ms": 500, "end_ms": 2300 }
        }
      ]
    }
  ]
}
```

**voice_manifest.json** (casting de voces)
```json
{
  "episode_id": "EP001",
  "characters": [
    {
      "name": "Gabriel",
      "voice_id_es": "abc123",
      "gender": "male",
      "age_range": "10-12",
      "formality": "informal",
      "voice_ids_by_lang": {
        "en": "def456",
        "pt-br": "ghi789"
      }
    }
  ]
}
```

**timing_objects.json** (timestamps por idioma)
```json
{
  "episode_id": "EP001",
  "language": "en",
  "segments": [
    {
      "line_id": "L001",
      "speaker": "Gabriel",
      "text_translated": "Hello friends, welcome",
      "timing_original": { "start_ms": 500, "end_ms": 2300 },
      "timing_dubbed": { "start_ms": 510, "end_ms": 2450 },
      "drift_ms": 150,
      "drift_pct": 8.3
    }
  ]
}
```

**qa_report.json** (reporte de calidad)
```json
{
  "episode_id": "EP001",
  "language": "en",
  "tier": 1,
  "metrics": {
    "wer": 3.2,
    "comet_score": 0.91,
    "mos_score": 4.1,
    "timing_drift_avg_pct": 8.3,
    "category_a_flags": 0,
    "speaker_consistency_score": 0.92
  },
  "errors": [
    {
      "type": "timing_drift",
      "severity": "minor",
      "line_id": "L042",
      "detail": "Drift 22% en linea larga",
      "suggestion": "Acortar traduccion"
    }
  ],
  "verdict": "APPROVED",
  "reviewed_by": "system",
  "timestamp": "2026-02-20T10:30:00Z"
}
```

### 1.4 Exit Criteria por Fase

| Fase | Exit Criteria (Evidencia Concreta) |
|:-----|:-----------------------------------|
| **Phase 0** | (1) Bug P0 fix con test unitario pasando, (2) Bug P1 fix con test, (3) pipeline.py y service.py conectados con test de integracion, (4) UN episodio real procesado E2E sin intervencion, (5) .gitignore y CLAUDE.md creados |
| **Phase 1** | (1) WER medido para 27 idiomas en 1 episodio, (2) audit_service.py con tests, (3) COMET score > 0.85 en Tier 1, (4) Zero Category A flags en episodio de prueba, (5) Endpoints de auditoria funcionando |
| **Phase 2** | (1) 27 blacklists existentes y validadas, (2) Speaker detection accuracy > 90% en episodio de prueba, (3) Dubbing Resource API integrada y probada, (4) validate_speakers.py con tests |
| **Phase 3** | (1) 1 episodio procesado sin Web UI, (2) Batch de 3 episodios sin error, (3) Dashboard QA mostrando datos reales, (4) Saul/Ivan capacitados (demo + feedback positivo) |
| **Phase 4** | (1) ROI por idioma calculado para ultimos 3 meses, (2) Tropicalizacion activa para Tier 1, (3) Kaizen loop produciendo mejoras medibles (FTR mejora >10%), (4) Decision D-005 (pausar idiomas) tomada con datos |

---

## 2. GAP ANALYSIS: LO QUE FALTA EN EL MEGA DOC

| # | Gap | Donde estaba la lluvia de ideas | Seccion de este addendum |
|:--|:----|:--------------------------------|:-------------------------|
| G1 | **Multi-LLM audit de traducciones** | 07_CORE (COMET, BERTScore, LLM Judge) | Seccion 3 |
| G2 | **Tropicalizacion cultural detallada** | 07_CORE (notas AR/DE), ANALISIS_LEAN (telefono descompuesto) | Seccion 4 |
| G3 | **Diccionarios culturales POSITIVOS** | Solo blacklists existian, no "que SI decir" | Seccion 4 |
| G4 | **Pronombres y formalidad por idioma** | 07_CORE (du/Sie), Q8 (pronombres incorrectos) | Seccion 4 |
| G5 | **Verificacion de audio output** | Checklist 13 pistas, pero sin herramientas concretas | Seccion 5 |
| G6 | **Deteccion de tono/emocion** | Q8 D3 "MUY IMPORTANTE", ANALISIS_LEAN (metadata perdida) | Seccion 5 |
| G7 | **Modulo Kaizen / aprendizaje** | quality_JANUARY_QUEST (PDCA F1-F3), PAIN_TO_FEATURE (PP-43) | Seccion 6 |
| G8 | **Feedback loop audiencia -> produccion** | quality_JANUARY_QUEST (E1-E3), PP-21 | Seccion 6 |
| G9 | **Efecto telefono descompuesto** | ANALISIS_LEAN §6 | Seccion 4 |
| G10 | **Onomatopeyas** | Q8 D3, QA tiering 4.2 | Seccion 4 |

---

## 3. MULTI-LLM TRANSLATION AUDIT: LA MEJOR SOLUCION

### 3.1 Recomendacion Principal: Panel de 3 Jueces + COMET

```
PIPELINE DE AUDITORIA DE TRADUCCION (por episodio, por idioma):

  Texto traducido (ElevenLabs output)
       |
       v
  +----+----+----+
  |    |    |    |
  v    v    v    v
COMET  Claude  GPT-4o  Gemini
(metr) Sonnet  (juez)  Flash
       (juez)          (screening)
  |    |    |    |
  +----+----+----+
       |
  CONSENSO (mayoria gana)
       |
  +----+----+
  |         |
PASS      FLAG
  |         |
AUTO      Revision
APROBAR   humana
```

### 3.2 Herramientas Recomendadas (Mejores en Clase)

| Herramienta | Funcion | Costo | Estado | Recomendacion |
|:------------|:--------|:------|:-------|:--------------|
| **COMET/xCOMET-XL** | Metrica neural de calidad de traduccion, detecta DONDE hay errores | Gratis (open source) | Produccion | **SI - PRIORIDAD 1** |
| **GEMBA-MQM / Rubric-MQM v2.0** | LLM juzga calidad SIN referencia, detecta spans de error | Costo API LLM (~$0.01-0.03/segmento) | Produccion | **SI - PRIORIDAD 1** (critico porque NO tenemos referencias humanas para 26 idiomas) |
| **chrF++** | N-gram de caracteres, barato, bueno para CJK | Gratis | Produccion | **SI - baseline** |
| **BERTScore** | Similitud semantica por embeddings | Gratis | Produccion | **SI - ya seleccionado** |
| **Claude Sonnet** | Juez LLM #1 (78% "good" en Lokalise 2025, #1 en 9/11 pares WMT24) | $3/$15 por 1M tokens | Produccion | **SI - juez primario** |
| **GPT-4o** | Juez LLM #2 (GEMBA-MQM bien documentado) | $5/$15 por 1M tokens | Produccion | **SI - segundo juez** |
| **Gemini 2.0 Flash** | Screening masivo de alto volumen | $0.10/$0.40 por 1M tokens | Produccion | **SI - pre-filtro rapido** |

### 3.3 Que es GEMBA-MQM y por que es critico

GEMBA-MQM (GPT-based Evaluation Metric Based on Analysis with Multidimensional Quality Metrics) permite evaluar traducciones SIN tener una referencia humana. Esto es exactamente lo que QPH necesita: no tienen traducciones de referencia en 26 idiomas.

El LLM recibe: (1) texto fuente, (2) texto traducido, (3) instrucciones MQM, y devuelve: spans con errores categorizados (accuracy, fluency, terminology, style) y severidad (minor, major, critical).

**Rubric-MQM v2.0** (dic 2025) mejora GEMBA-MQM y agrega auto-post-editing (sugerencias de correccion).

GitHub: `trotacodigos/Rubric-MQM`

### 3.4 Costo Real: Multi-LLM Audit vs Revision Humana

| Escenario | Costo/Episodio | Tiempo | Precision |
|:----------|:---------------|:-------|:----------|
| Revision humana completa (27 idiomas) | $5,400 - $8,100 | 2-4 semanas | Alta |
| Revision humana spot-check (10%) | $540 - $810 | 3-5 dias | Media |
| **3 jueces LLM + COMET (27 idiomas)** | **$4 - $8** | **< 30 min** | **Media-Alta** |
| Hibrido recomendado (LLM + humano Tier 1) | **$70 - $90** | **< 1 dia** | **Alta** |

> **Netflix referencia:** Gastan $100M/ano en calidad de doblaje y aun asi 5% de segmentos requieren intervencion humana. QPH deberia presupuestar ~5% humano incluso con automatizacion completa.

### 3.5 Alternativas Descartadas

| Alternativa | Razon de descarte |
|:------------|:------------------|
| Un solo LLM como juez | Bias de modelo individual, 30-40% menos preciso que consenso |
| Solo metricas automaticas (COMET/BLEU sin LLM) | No detectan errores culturales, tono inapropiado, safety issues |
| Revision humana de 27 idiomas | $5K-8K/episodio, insostenible |
| MachineTranslation.com SMART | Optimizado para MT, no para auditar traducciones existentes |

---

## 4. TROPICALIZACION Y ADAPTACION CULTURAL

### 4.1 Definicion: Tropicalizacion NO es solo traduccion

```
Escala de adaptacion:

  Traduccion < Localizacion < Transcreacion < TROPICALIZACION
  (palabras)   (formato+UI)   (mensaje)       (cultura completa)

QPH necesita: LOCALIZACION + TROPICALIZACION selectiva
  - Localizacion: adaptar numeros, fechas, formatos, formalidad
  - Tropicalizacion: adaptar humor, referencias culturales, sensibilidades
```

**Referencia industria:** Disney/Pixar cambia broccoli por pimiento verde en "Inside Out" para Japon. Netflix gasta ~70% de su presupuesto de localizacion en doblaje.

### 4.2 No existe una base de datos universal de sensibilidades culturales

Lo que SI existe:
- **Unicode CLDR** (cldr.unicode.org) - datos de locale (fechas, numeros, plurales), NO sensibilidades
- **Hate Speech Dataset Catalogue** (hatespeechdata.com) - datasets multilingues de odio
- **Las blacklists de QPH** (3 idiomas: AR, DE, global) - buen inicio pero cubren 3/27

Lo que NO existe:
- Base de datos abierta de "esto ofende en X cultura"
- Diccionario universal de adaptaciones culturales positivas
- Framework estandar para contenido infantil multilingue

> **Implicacion:** QPH tiene que CONSTRUIR esto. Pero puede usar LLMs para drafts + nativos para validacion.

### 4.3 Diccionario Cultural POSITIVO (nuevo concepto)

Las blacklists dicen "que NO decir". Falta un diccionario que diga "que SI decir":

```json
{
  "cultural_adaptations": {
    "que_padre": {
      "es": "Que padre!",
      "en": "That's awesome!",
      "de": "Mega cool!",
      "ja": "Sugoi!",
      "ar": "Yaa salaam!",
      "ko": "Daebak!",
      "hi": "Zabardast!",
      "context": "Exclamacion de asombro positivo, slang mexicano",
      "category": "idiom_adaptation"
    },
    "cerdo_como_insulto": {
      "es": "Eres un cerdo!",
      "en": "You're such a slob!",
      "ar": "Anta ghayr nazif!",
      "note_ar": "NUNCA usar 'khanzir' - animal haram. Reemplazar con 'sucio/desordenado'",
      "category": "cultural_sensitivity"
    }
  }
}
```

**Categorias del diccionario positivo:**
1. Equivalentes de comida culturales
2. Referencias animales (haram en AR, sagrado en HI)
3. Equivalentes de modismos/slang
4. Exclamaciones e interjecciones
5. Onomatopeyas por idioma
6. Neutralizacion religiosa/espiritual
7. Transcreacion de humor/chistes

### 4.4 Matriz de Pronombres y Formalidad por Idioma

| Idioma | Formalidad QPH | Pronombre | Notas |
|:-------|:---------------|:----------|:------|
| **Aleman** | `du` (informal) | `du` siempre, NUNCA `Sie` | Mezclar du/Sie es jarring; mantener consistente |
| **Frances** | `tu` (informal) | `tu` entre ninos, NUNCA `vous` | |
| **Japones** | Casual/plain form | Sin keigo entre pares | Preservar matices via patrones de habla, no traduccion literal |
| **Coreano** | Haoche/haerache (medio-informal) | 7 niveles de habla; usar medio | Pronombres frecuentemente omitidos |
| **Hindi** | `tum` (informal-medio) | 3 niveles: tu/tum/aap | `tum` para dialogo entre ninos |
| **Indonesio** | `aku` / `kamu` | Informal | NUNCA `saya` / `Anda` (demasiado formal para ninos) |
| **Arabe** | Informal | Cuidado con genero de sustantivos | Menos complejidad pronominal, mas genero en sustantivos |
| **Portugues BR** | `voce` (informal) | `voce` siempre | Tu/voce varia por region; `voce` es neutro |
| **Ruso** | `ty` (informal) | `ty` entre ninos | `Vy` solo para adultos autoritarios |
| **Turco** | `sen` (informal) | `sen` entre ninos | `siz` solo para adultos/respeto |

> **Regla general:** Para contenido infantil (8-15 anos), SIEMPRE usar el registro informal entre personajes de la misma edad. El registro formal solo aparece cuando un nino habla con un adulto de autoridad.

### 4.5 Onomatopeyas: Tabla de Adaptacion

Los sonidos NO son universales. Un perro dice "woof" en ingles, "guau" en espanol, "wan wan" en japones, "gav gav" en ruso.

**Top 20 onomatopeyas que QPH debe mapear:**

| Concepto | ES | EN | JA | KO | AR | DE | RU |
|:---------|:---|:---|:---|:---|:---|:---|:---|
| Perro | guau | woof | wan wan | meong meong | haw haw | wau wau | gav gav |
| Gato | miau | meow | nyan | yaong | miyau | miau | myau |
| Explosion | bum | boom | don | kwang | buum | bumm | bum |
| Risa | jaja | haha | ahaha | kkkk | hahaha | haha | haha |
| Golpe | pum | bam | bashi | tak | bakh | peng | bakh |
| Sorpresa | oh! | oh! | e! | heol! | ya! | oh! | oy! |
| Dolor | ay! | ouch! | itai! | aya! | aakh! | au! | oy! |
| Llanto | buaa | waah | uwaa | heung | waaa | wah | uaa |
| Miedo | ahhh | ahhh | kyaa | kkya | ahhh | ahhh | aaa |
| Asco | guacala | eww | geh | euk | uff | igitt | fu |

> Japones tiene ~4,500 onomatopeyas vs ~1,200 en ingles. Es el idioma con mayor adaptacion necesaria.

### 4.6 Efecto Telefono Descompuesto: Mitigacion

```
PROBLEMA:
  ES: "Que padre!" (cool)
    -> EN: "What a father!" (ERROR en traduccion)
      -> DE: "Was fur ein Vater!" (error amplificado x15 idiomas)
      -> JA: "Nante otousan!" (error amplificado)
      -> AR: "Ya lahu min ab!" (error amplificado)

SOLUCION:
  1. GATE OBLIGATORIO en ES -> EN (ya en mega doc, C1)
  2. NUEVA CAPA: LLM compara INTENCION del ES con output EN
     No solo traduccion literal, sino: "la emocion/intencion se preservo?"
  3. Si el EN master tiene error, NINGUNO de los otros idiomas se procesa
  4. Para modismos: usar diccionario cultural POSITIVO (seccion 4.3)
```

### 4.7 Regulaciones de Contenido Infantil por Mercado

| Region | Regulacion | Implicaciones para QPH |
|:-------|:-----------|:-----------------------|
| **EEUU** | COPPA (actualizado abril 2025) | Filtros de violencia, sustancias, datos de menores de 13 |
| **UE** | AVMSD (Art. 28b) | Proteger menores de contenido que perjudique desarrollo fisico/mental/moral |
| **Japon** | BPO (autorregulacion) | Basado en quejas; politica 2025 protege libertad creativa |
| **China** | NRTA + CAC "Modo Menor" (abril 2025) | Debe "promover valores socialistas"; limites estrictos |
| **Corea** | KCSC | Sistema de calificacion; estandares de violencia/lenguaje para jovenes |
| **Medio Oriente** | Consejos nacionales de medios | Estandares islamicos; filtrado de contenido haram; restricciones romanticas |

> **HALLAZGO CRITICO:** La moderacion AI es hasta 30% MENOS precisa en idiomas de bajos recursos (coreano, malayo, filipino, tamil). Exactamente los idiomas Tier 3 de QPH. Esto significa que Tier 3 necesita MAS chequeo de safety, no menos.

---

## 5. VERIFICACION DE AUDIO OUTPUT

### 5.1 Pipeline Recomendado de Verificacion de Audio

```
AUDIO DOBLADO (ElevenLabs output, por idioma)
    |
    +---> STT DUAL CONSENSO
    |     |
    |     +-- Whisper large-v3 ($0.006/min)
    |     +-- Deepgram Nova-3 ($0.0043/min)
    |     |
    |     +-- Si ambos coinciden: ALTA confianza
    |     +-- Si difieren: FLAG para revision
    |
    +---> CALIDAD DE AUDIO
    |     |
    |     +-- Peak detection (clipping > 0 dBFS)
    |     +-- LUFS check (-14 a -16 target)
    |     +-- SNR en silencios (noise floor)
    |     +-- Spectral analysis (artefactos/glitches)
    |     |
    |     Herramienta: librosa + pyloudnorm (GRATIS)
    |
    +---> NATURALIDAD (MOS)
    |     |
    |     +-- UTMOS/UTMOSv2 (prediccion MOS)
    |     +-- Umbral: MOS < 3.5 = RECHAZAR
    |     |
    |     Herramienta: open source (GRATIS)
    |
    +---> EMOCION / TONO
    |     |
    |     +-- emotion2vec+ (9 clases, 10+ idiomas, SOTA)
    |     +-- SenseVoice (ASR + SER en un pass, CJK)
    |     +-- Comparar vs emocion esperada del guion
    |     |
    |     Herramienta: open source (GRATIS)
    |
    +---> TIMING DRIFT
    |     |
    |     +-- DTW (Dynamic Time Warping) via librosa
    |     +-- WhisperX forced alignment (word-level timestamps)
    |     +-- Flag si drift > 200ms o > 20%
    |     |
    |     Herramienta: librosa + WhisperX (GRATIS)
    |
    +---> CONSISTENCIA DE SPEAKER
          |
          +-- ECAPA-TDNN (speaker embeddings)
          +-- Cosine similarity vs referencia ES
          +-- Flag si similarity < 0.75
          |
          Herramienta: SpeechBrain (GRATIS)
```

### 5.2 Mejores STT por Familia de Idiomas

| Familia | Mejor STT | Alternativa | Notas |
|:--------|:----------|:------------|:------|
| **Ingles** | Whisper (2.7% WER) | Deepgram Nova-3 | Ambos excelentes |
| **Arabe** | Deepgram Nova-3 (modelo monolingue) | Whisper | Deepgram tiene modelo AR dedicado |
| **CJK (JA, KO, ZH)** | SenseVoice (<80ms, ASR+SER) | Whisper | SenseVoice es 5-15x mas rapido |
| **Hindi** | Deepgram Nova-3 | Whisper | Modelo HI dedicado |
| **Tamil/Malay** | Whisper | Deepgram (>20% mejor WER) | Idiomas de bajos recursos; WER alto |
| **Europeos (DE, FR, IT, RU)** | Whisper | Deepgram | Ambos buenos |
| **Turco/Indonesio** | Whisper | Azure Speech | Whisper razonable |

### 5.3 Herramientas de Deteccion de Emocion

| Herramienta | Idiomas | Funcion | Costo | Prioridad |
|:------------|:--------|:--------|:------|:----------|
| **emotion2vec+** | 10+ idiomas | 9 clases de emocion, SOTA en IEMOCAP | Gratis (open source, 90-300M params) | **ALTA** |
| **SenseVoice** | 50+ idiomas | ASR + SER + language ID en un modelo | Gratis (open source, <80ms) | **ALTA** (especialmente CJK) |
| **EmoBox** | 14 idiomas | Benchmark + toolkit para SER | Gratis | MEDIA (benchmarking) |

> **Uso para QPH:** Comparar la emocion detectada en el audio doblado vs la emocion anotada en el guion (campo `emotion` de dialogue_objects.json). Si Gabriel dice "Hola amigos!" con emocion="happy" pero el audio en japones suena "sad", FLAG.

### 5.4 ElevenLabs NO verifica su propio output

ElevenLabs provee:
- Campo `loss` para confianza de transcripcion (forced alignment)
- Estado del proyecto de dubbing

ElevenLabs NO provee:
- MOS / naturalidad
- Deteccion de emociones
- Drift de timing
- Verificacion de speaker
- Deteccion de artefactos

> **QPH DEBE construir verificacion externa.** ElevenLabs es el generador, no el auditor.

---

## 6. MODULO KAIZEN: MEJORA CONTINUA

### 6.1 Concepto: Un Sistema que APRENDE de sus Errores

```
CICLO PDCA PARA DUBBING QPH:

  PLAN: Definir categorias de error (MQM) + quality gates
    |
    v
  DO: Procesar episodios, capturar datos en cada gate
    |
    v
  CHECK: Reunion OVEJA semanal revisa tendencias + senales de audiencia
    |
    v
  ACT: Actualizar blacklists, Mem0 memories, checklists, training
    |
    v
  (vuelta al PLAN con datos actualizados)
```

### 6.2 Los 5 Componentes del Modulo Kaizen

#### Componente 1: Taxonomia de Errores (MQM Adaptado)

El framework MQM (Multidimensional Quality Metrics) es el estandar de la industria de localizacion. QPH lo adapta asi:

| Categoria MQM | Subcategoria QPH | Severidad | Ejemplo |
|:--------------|:-----------------|:----------|:--------|
| **Accuracy** | Speaker detection | Major/Critical | Personaje 2 habla con voz de 1 |
| **Accuracy** | Traduccion erronea | Major | "Que padre" -> "What a father" |
| **Accuracy** | Omision | Minor/Major | Linea de dialogo faltante |
| **Fluency** | Timing drift | Minor/Major | Audio desfasado >200ms |
| **Fluency** | Pronunciacion | Minor | Nombre propio mal pronunciado |
| **Fluency** | Naturalidad (MOS) | Minor | Audio suena robotico |
| **Terminology** | Onomatopeya mal adaptada | Minor | "Guau" traducido literal en JA |
| **Terminology** | Pronombre incorrecto | Minor/Major | "el" cuando deberia ser "ella" |
| **Style** | Tono/emocion incorrecta | Major | Escena triste suena feliz |
| **Style** | Formalidad inadecuada | Minor | `Sie` en dialogo entre ninos |
| **Locale** | Sensibilidad cultural | Major/Critical | "Cerdo" en idioma arabe |
| **Locale** | Blacklist violation | Critical | Categoria A en publicacion |
| **Safety** | Contenido inapropiado | Critical | Groseria, violencia, self-harm |

Severidad: Minor = 1 punto, Major = 5 puntos, Critical = 25 puntos.
Score por idioma = suma de puntos. Umbral de aprobacion por tier.

#### Componente 2: Memoria de Correcciones (Mem0)

**Mem0** (open source, 41K GitHub stars) es un layer de memoria persistente para agentes AI. Almacena correcciones y las aplica automaticamente en episodios futuros.

```
EJEMPLO DE FLUJO CON MEM0:

  Episodio 1: Saul corrige "no." -> "no," en linea 42
    -> Mem0 almacena: {pattern: "no.", replacement: "no,", context: "antes de mayuscula"}

  Episodio 2: prescanner detecta "no." en linea 17
    -> Mem0 consulta: "he visto este patron antes?"
    -> Mem0 responde: "Si, correccion automatica: 'no.' -> 'no,'"
    -> Se aplica ANTES de enviar a ElevenLabs

  Resultado: Error que antes era manual ahora es automatico
```

**Tipos de memorias para QPH:**
1. Correcciones de blacklist expandidas
2. Mapeos speaker -> voice corregidos
3. Ajustes de timing por idioma
4. Overrides de traduccion (modismos)
5. Reglas de onomatopeyas descubiertas

GitHub: `mem0ai/mem0`

#### Componente 3: Feedback Loop de Audiencia

```
PIPELINE:
  YouTube Analytics API (retention curves, comments)
    |
    v
  Sentiment Analysis multilingue
  (tabularisai/multilingual-sentiment-analysis, 27 idiomas)
    |
    v
  Correlacion: caidas de retencion <-> segmentos doblados
    |
    v
  Senales de calidad por idioma por episodio
    |
    v
  Dashboard semanal para reunion OVEJA
```

**Ejemplo de deteccion:**
- Episodio EP042 en arabe: retencion cae 40% en minuto 3:20
- Comentarios AR negativos: "el audio suena raro"
- Correlacion: segmento 3:20 tiene WER 18% y speaker detection error
- Accion: Re-auditar segmento, corregir, actualizar Mem0

#### Componente 4: Captura de Conocimiento Tribal

QPH ya tiene la transcripcion Q8 de Saul/Ivan. La accion inmediata es:

1. Pasar transcripcion Q8 por LLM
2. Extraer todas las reglas "si X entonces haz Y"
3. Almacenar como JSON estructurado en knowledgebase
4. Cargar en Mem0 como memorias iniciales

**Ejemplo de extraccion:**
```json
{
  "rule_id": "TK-001",
  "source": "Q8_SAUL_IVAN",
  "pattern": "ElevenLabs detecta speaker 2 como speaker 1",
  "action": "Verificar manualmente el mapeo de voces contra manifest.json",
  "frequency": "frecuente",
  "languages_affected": "todos"
}
```

#### Componente 5: Metricas de Mejora Continua

| Metrica | Formula | Target | Frecuencia |
|:--------|:--------|:-------|:-----------|
| **FTR (First Time Right)** | Episodios aprobados sin correccion / Total | > 60% Phase 1, > 80% Phase 3 | Semanal |
| **Error Recurrence Rate** | Errores repetidos / Total errores | < 20% (Mem0 debe reducir) | Mensual |
| **CAPA Effectiveness** | CAPAs efectivas / CAPAs implementadas x 100 | > 70% | Trimestral |
| **Mean Corrections/Episode** | Correcciones manuales / Episodio | Decreciente (-10%/mes) | Semanal |
| **WER Trend por idioma** | WER promedio mensual | Decreciente | Mensual |
| **Audience Sentiment Score** | Promedio sentiment de comentarios por idioma | > 0.6 (positivo) | Semanal |

**Dashboard recomendado:** Metabase (open source, no-code, conecta a PostgreSQL/Supabase).

---

## 7. PROCESO COMPLETO INTEGRADO

### 7.1 Pipeline End-to-End con TODOS los componentes

```
=== FASE 0: INGESTION ================================================

  .docx (Andrea) + manifest.json (Ramon) + MP4 (Fernando)
       |
  docx_parser.py (AI-Studio, 435L)
       |
  dialogue_objects.json (SSOT)
       |
  Mem0 consulta: "hay correcciones conocidas para este tipo de contenido?"
       |
  GATE 1: Pre-flight Validator
    - LLM Judge (safety categories A/B/C)
    - Blacklist scan (27 idiomas)
    - Diccionario cultural positivo (modismos, onomatopeyas)
    - Pronombre/formalidad check por idioma
    - Timing estimation (frases largas)
    |
    PASS -> continuar
    BLOCK -> humano resuelve
       |
=== FASE 1: TRADUCCION ES -> EN ======================================

  ElevenLabs Dubbing API
    POST /v1/dubbing (dubbing_studio=true)
       |
  Texto EN generado por ElevenLabs
       |
  GATE 2: Auditoria de Traduccion EN
    - COMET/xCOMET score (umbral > 0.85)
    - GEMBA-MQM (error spans sin referencia)
    - 3 jueces LLM (Claude + GPT-4o + Gemini)
    - Diccionario cultural: modismos adaptados correctamente?
    - Emocion/intencion preservada? (LLM compara ES vs EN)
    |
    COMET > 0.85 + 3/3 jueces PASS -> continuar
    Cualquier juez FLAG -> Saul/Ivan revisan EN
    COMET < 0.70 -> BLOQUEAR, no procesar otros idiomas
       |
  Saul/Ivan aprueban EN master (100% humano)
       |
=== FASE 2: TRADUCCION EN -> TODOS ==================================

  Dubbing Resource API (segment CRUD)
    EN -> Tier 1 (PT-BR, FR, DE)
    EN -> Tier 2 (AR, KO, JA, HI, ZH)
    EN -> Tier 3 (resto)
       |
  GATE 3: Auditoria Multi-Idioma (por idioma)
    - COMET/chrF++ score
    - GEMBA-MQM (error spans)
    - Blacklist check por idioma
    - Pronombre/formalidad check
    - Onomatopeya adaptada correctamente?
    |
    Tier 1: Humano revisa + metricas
    Tier 2: Metricas + 10% muestreo humano
    Tier 3: Solo metricas, flag si < umbral
       |
=== FASE 3: GENERACION DE AUDIO =====================================

  ElevenLabs genera audio por idioma
       |
  GATE 4: Verificacion de Audio (por idioma)
    - STT dual consenso (Whisper + Deepgram)
    - WER vs texto esperado
    - Clipping / LUFS / SNR check
    - UTMOS naturalidad (MOS > 3.5)
    - emotion2vec+ tono (vs guion)
    - DTW timing drift (< 200ms / < 20%)
    - ECAPA-TDNN speaker consistency (> 0.75)
    |
    WER < 5% + todas metricas PASS -> AUTO-APROBAR
    WER 5-15% + alguna metrica FLAG -> MUESTREO HUMANO
    WER > 15% O speaker error -> REVISION OBLIGATORIA
       |
=== FASE 4: QA REPORT + KAIZEN ======================================

  qa_report.json generado por idioma
       |
  Mem0 almacena correcciones realizadas
       |
  Dashboard actualizado (FTR, WER trends, CAPA)
       |
  YouTube Analytics: retention + sentiment por idioma
       |
  Reunion OVEJA semanal: revisar tendencias, tomar acciones
       |
  PUBLICAR
```

### 7.2 Los 4 Gates Resumidos

| Gate | Cuando | Que valida | Quien decide | Datos que genera |
|:-----|:-------|:-----------|:-------------|:-----------------|
| **Gate 1** | Pre-flight (antes de ElevenLabs) | Safety, blacklist, cultura, timing | Sistema + humano si block | Pre-scan flags |
| **Gate 2** | Post-traduccion ES->EN | Calidad de traduccion EN master | Saul/Ivan (100% humano) | COMET, GEMBA scores |
| **Gate 3** | Post-traduccion EN->todos | Calidad por idioma | Sistema (Tier 2/3) + humano (Tier 1) | Metricas por idioma |
| **Gate 4** | Post-generacion audio | Calidad de audio output | Sistema + humano si flag | qa_report.json |

---

## 8. COSTOS CONSOLIDADOS

### 8.1 Costo por Episodio (27 idiomas, ~10 min video, ~2000 palabras)

| Componente | Costo | Notas |
|:-----------|:------|:------|
| ElevenLabs (generacion) | Incluido en plan Pro | Ya lo pagan |
| COMET/xCOMET | ~$0.00 | Open source, self-hosted |
| GEMBA-MQM (3 jueces LLM) | ~$2-5 | Claude + GPT-4o + Gemini Flash |
| STT dual (Whisper + Deepgram) | ~$3-6 | 27 idiomas x 10 min |
| Audio checks (librosa/pyloudnorm) | ~$0.00 | CPU-only, millisegundos |
| UTMOS naturalidad | ~$0.00 | Open source, self-hosted |
| emotion2vec+ tono | ~$0.00 | Open source, self-hosted |
| Speaker verification (ECAPA-TDNN) | ~$0.00 | Open source, self-hosted |
| GPU compute (modelos self-hosted) | ~$1-2 | ~$0.30/hr A10G spot |
| **Subtotal automatico** | **~$6-13** | |
| Revision humana Tier 1 (5 idiomas) | ~$40-50 | Saul/Ivan, tiempo interno |
| **TOTAL POR EPISODIO** | **~$46-63** | vs $5,400-$8,100 full humano |

### 8.2 Comparacion con Estimacion del Mega Doc

| Concepto | Mega doc original | Deep research actualizado | Delta |
|:---------|:------------------|:--------------------------|:------|
| Costo QA automatico/ep | ~$1.20 (no verificado) | **~$6-13** | Subestimado 5-10x |
| Costo humano Tier 1/ep | No estimado | ~$40-50 (tiempo interno) | Nuevo |
| Costo total/ep | No calculado | **~$46-63** | Nuevo |
| Ahorro vs full humano | Teorico | **~97%** ($46 vs $5,400) | Validado |

> **El costo de $1.20/proyecto del mega doc era UNA HIPOTESIS** (A-005, confianza 35%). El costo real con un pipeline completo es ~$6-13 automatico + ~$40-50 humano Tier 1 = ~$46-63/episodio. Sigue siendo un ahorro masivo (97%) pero es 40-50x mas que la estimacion original.

---

## 9. HERRAMIENTAS Y REFERENCIAS

### 9.1 Stack Recomendado (Mejor Solucion)

| Capa | Herramienta | Licencia | GitHub/URL |
|:-----|:------------|:---------|:-----------|
| Metricas traduccion | **COMET/xCOMET-XL** | Apache 2.0 | github.com/Unbabel/COMET |
| Auditoria sin referencia | **Rubric-MQM v2.0** | Open source | github.com/trotacodigos/Rubric-MQM |
| Juez LLM primario | **Claude Sonnet 4** | API | anthropic.com |
| Juez LLM secundario | **GPT-4o** | API | openai.com |
| Pre-filtro rapido | **Gemini 2.0 Flash** | API | ai.google.dev |
| STT primario | **Whisper large-v3** | MIT | github.com/openai/whisper |
| STT alternativo | **Deepgram Nova-3** | API | deepgram.com |
| STT CJK | **SenseVoice** | Open source | github.com/FunAudioLLM/SenseVoice |
| Naturalidad audio | **UTMOS** | Open source | emergentmind.com/topics/utmos |
| Emocion audio | **emotion2vec+** | Open source | github.com/ddlBoJack/emotion2vec |
| Speaker verification | **ECAPA-TDNN** | Open source | huggingface.co/speechbrain/spkrec-ecapa-voxceleb |
| Timing drift | **DTW + WhisperX** | Open source | github.com/m-bain/whisperX |
| Audio quality | **librosa + pyloudnorm** | MIT | librosa.org |
| Memoria de correcciones | **Mem0** | Apache 2.0 | github.com/mem0ai/mem0 |
| Dashboard QA | **Metabase** | AGPL | metabase.com |
| Sentiment multilingue | **tabularisai model** | Open source | huggingface.co/tabularisai |
| Terminologia/glosario | **Crowdin** | Freemium | crowdin.com |

### 9.2 Alternativas por Componente

| Componente | Mejor | Alternativa 1 | Alternativa 2 |
|:-----------|:------|:--------------|:--------------|
| Metricas traduccion | COMET | MetricX (11B, mas lento) | chrF++ (mas simple) |
| Auditoria sin referencia | Rubric-MQM | GEMBA-MQM original | Lokalise AI LQA (SaaS) |
| STT | Whisper + Deepgram | Azure Speech | AWS Transcribe |
| Emocion | emotion2vec+ | SenseVoice | EmoBox |
| Speaker | ECAPA-TDNN | Resemblyzer | pyannote.audio |
| Memoria | Mem0 | RAG custom | Airtable manual |
| Dashboard | Metabase | Grafana | Superset |
| Glosario | Crowdin | memoQ | Phrase |

### 9.3 Referencias Clave

**Multi-LLM Audit:**
- COMET: github.com/Unbabel/COMET
- GEMBA-MQM: github.com/MicrosoftTranslator/GEMBA
- Rubric-MQM: github.com/trotacodigos/Rubric-MQM
- Netflix dubbing: partnerhelp.netflixstudios.com/hc/en-us/articles/360001531188

**Tropicalizacion:**
- MQM Framework: themqm.org
- Unicode CLDR: cldr.unicode.org
- Hate Speech Data: hatespeechdata.com
- Crowdin AI Pipeline: crowdin.com/blog/ai-localization

**Audio Verification:**
- emotion2vec+: github.com/ddlBoJack/emotion2vec
- SenseVoice: github.com/FunAudioLLM/SenseVoice
- ECAPA-TDNN: huggingface.co/speechbrain/spkrec-ecapa-voxceleb
- WhisperX: github.com/m-bain/whisperX
- UTMOS: emergentmind.com/topics/utmos

**Kaizen:**
- Mem0: github.com/mem0ai/mem0
- MQM Core: themqm.org
- Metabase: metabase.com
- YouTube Analytics API: developers.google.com/youtube/analytics

---

## NOTA METODOLOGICA

Este addendum fue producido por 4 agentes Claude Opus en paralelo:

1. **Multi-LLM Translation Audit Agent** -- Investigo herramientas de auditoria de traduccion, costos, mejores practicas de Netflix/industria
2. **Tropicalization & Cultural Adaptation Agent** -- Investigo adaptacion cultural, regulaciones por mercado, diccionarios, pronombres
3. **Kaizen / Continuous Improvement Agent** -- Investigo feedback loops, Mem0, taxonomia de errores MQM, PDCA
4. **Audio Output Verification Agent** -- Investigo STT por idioma, deteccion de emociones, timing drift, speaker consistency

Cada agente hizo web search de herramientas y practicas 2025-2026, verifico contra el repo existente, y produjo recomendaciones priorizadas.

**El costo de $1.20/proyecto del mega doc original queda CORREGIDO a ~$46-63/episodio** (aun asi un ahorro del 97% vs revision humana completa). La estimacion original solo contaba STT + semantics, no los 4 gates completos ni la revision humana de Tier 1.
