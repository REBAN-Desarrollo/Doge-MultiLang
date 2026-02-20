## 5. Arquitectura — Cadena de Traduccion Optimizada

### 5.1 Problema: El efecto telefono descompuesto

La cadena actual opera como un juego de telefono descompuesto a escala industrial:

```
ES (original) --> EN (pivot) --> 26 idiomas downstream
```

Cada error introducido en la traduccion ES-->EN se multiplica x26. No hay mecanismo de contencion: si el EN master tiene un defecto semantico, TODOS los idiomas hijos lo heredan sin posibilidad de correccion retroactiva.

**Evidencia concreta del problema:**

| Tipo de perdida | Ejemplo real QPH | Consecuencia downstream |
|:----------------|:-----------------|:------------------------|
| Erradicacion de genero/numero | "Las perritas estan asustadas" --> "The little dogs are scared" --> FR: "Les petits chiens" (masculino generico) | Fidelidad del guion destruida en lenguas romances |
| Destruccion de formalidad (T/V) | "Oye tu, ven aqui!" --> "Hey you, come here!" --> DE: "Kommen Sie hier!" (formal) | Ninos de 8-15 anos escuchan a un perro animado hablar como banquero |
| Neutralizacion del afecto | "Que padre, guey!" --> "How cool, dude!" --> JA: traduccion literal sin alma | El chiste muere antes de llegar a Asia |
| Perdida de diminutivos | "Michito" --> "Little cat" --> 26 traducciones planas | Intimidad emocional infantil eliminada |

**Datos de AVD que respaldan la tesis:**

- PT-BR muestra el mejor AVD relativo (-19%), idioma con ~89% de cognados con ES. Sugiere que la ruta directa ES-->PT seria superior.
- CJK sufre caida de -49% AVD. La triple penalizacion: error de pivot + string expansion + TTS inadecuado.
- Tamil: -58% AVD. Peor caso. Lengua aglutinante + bajo recurso + pivot destructivo.
- DE: aunque tiene x7.2 RPM (mercado mas valioso por vista), la traduccion pierde el registro informal critico para contenido infantil.

**Conclusion de la literatura academica:** Utiyama & Isahara (2007) y Guerreiro et al. (2024) demuestran que la traduccion pivot induce "Perdida de Informacion Asimetrica" (Semantic Loss). El ingles, siendo un idioma de "bajo contexto" (sin generos flexivos, sin distincion tu/usted, sin diminutivos productivos), actua como embudo destructor de pragmatica.

### 5.2 Propuesta: Dynamic Translation Routing (DTR)

Sintesis de Mega Propuesta (Claude) + Deep Thinking (Gemini) + Deep Research (Addendum). En vez de un pivot estatico y universal, el backend implementa un enrutador dinamico que selecciona la via de traduccion segun la distancia filogenetica del idioma objetivo.

#### Cluster A — Romance (PT-BR, IT, FR, RO): ES --> Target directo

- **Justificacion linguistica:** Alta afinidad morfologica con el espanol. PT-BR comparte ~89% de vocabulario cognado. FR/IT/RO comparten genero gramatical, diminutivos productivos y estructura T/V.
- **Implementacion:** LLM recibe texto ES + System Prompt con reglas de formalidad + PCD (Diccionario Cultural Positivo). Sin paso por ingles.
- **Impacto esperado:** +15 a +20 puntos porcentuales en xCOMET. Recuperacion directa del AVD en Europa y Latinoamerica.
- **Revenue en juego:** ~11% combinado (PT ~7%, FR ~2%, IT ~1.5%, RO <0.5%).

#### Cluster B — Germanico (DE, NL, SV): ES --> Target directo + revision humana

- **Justificacion financiera:** DE tiene x7.2 RPM — cada vista alemana vale 7.2x una vista en ES. Justifica inversion en revision humana.
- **Implementacion:** Traduccion directa ES-->DE con System Prompt estricto: `"MANDATORY: Always use informal 'du'/'ihr'. 'Sie' is BANNED."` + revision humana post-traduccion.
- **Particularidad NL/SV:** Corpus paralelo ES-->NL/SV menor que ES-->DE. Evaluar por episodio si LLM produce calidad suficiente para ruta directa; fallback a pivot enriquecido si xCOMET < 0.80.

#### Cluster C — Distante (EN, CJK, AR, HI, TR, SEA, etc.): ES --> EN --> Target con "Pivote Enriquecido"

- **Justificacion:** Para idiomas filogeneticamente distantes o de bajo recurso, la traduccion directa desde ES aun puede inducir alucinaciones. El ingles se mantiene como puente, pero NUNCA como simple string de texto.
- **Implementacion:** El EN Master se genera como objeto JSON enriquecido con metadatos pragmaticos:

```json
{
  "line_id": "L042",
  "source_es": "Que padre, guey! Mira eso.",
  "en_literal": "How cool, dude! Look at that.",
  "intent": "Expression of extreme informal excitement and amazement to a peer.",
  "speaker_age": 10,
  "target_formality": "Casual (Banmal/Plain form), child-appropriate.",
  "max_target_syllables": 12,
  "visual_context": "Doge senalando emocionado a un arcoiris gigante.",
  "emotion": "happy_excited"
}
```

- **Por que funciona:** El LLM traductor al japones recibe contexto sociolinguistico completo. Evita Keigo (lenguaje honorifico), emplea sufijos amigables (-kun, -chan), usa jerga juvenil local ("Sugoi!"). El campo `intent` previene la perdida semantica que causa el pivot simple.

#### Tabla resumen DTR

| Cluster | Idiomas | Ruta | Metricas de control | Revision humana |
|:--------|:--------|:-----|:--------------------|:----------------|
| A (Romance) | PT, FR, IT, RO | ES --> Target | xCOMET > 0.85 | No (solo Tier 1) |
| B (Germanico) | DE, NL, SV | ES --> Target | xCOMET > 0.85 + GEMBA-MQM | SI obligatoria (DE) |
| C (Distante) | EN, JA, KO, ZH, AR, HI, TR, ID, TH, VI, TA, MS, FIL, RU, PL, UK, EL | ES --> EN(enriched) --> Target | xCOMET + 3 LLM Judges (Tier 1-2) / chrF++ (Tier 3) | Por tiering |

### 5.3 String Length Expansion — Control de Pacing

Hallazgo critico de Gemini Deep Thinking que los 4 modelos anteriores no abordaron:

**El problema:** Lenguas aglutinantes (Tamil, turco, finlandes) y CJK requieren 30-50% mas tiempo vocal para expresar el mismo contenido que el espanol. Cuando ElevenLabs recibe un texto que excede la duracion del segmento de animacion, el motor TTS acelera la voz antinaturalmente — el "efecto ardilla". Este efecto es un contribuyente directo al colapso de -58% AVD en Tamil.

**La solucion — campo `max_target_syllables`:**

1. **Pre-TTS text-length check:** Antes de enviar a ElevenLabs, calcular: `ratio = len(texto_target) / len(texto_es)`. Si `ratio > 1.3`, el sistema obliga al LLM a realizar transcreacion/resumen.
2. **El campo fuerza al LLM** a producir una version que quepa en la ventana temporal: no traduce literal, sino que transcrea preservando intencion y emocion dentro de las silabas permitidas.
3. **Validacion post-TTS:** Si el audio generado excede `max_duration_ms` del segmento en >20%, Gate 4 lo flaggea automaticamente.

**Factores de expansion por familia linguistica:**

| Familia | Factor tipico vs ES | Accion |
|:--------|:--------------------|:-------|
| Romance (PT, FR, IT) | 1.0-1.15x | Sin ajuste |
| Germanico (DE, NL) | 1.1-1.25x | Monitorear |
| CJK (JA, KO, ZH) | 0.8-1.0x (caracteres) / 1.2-1.4x (silabas orales) | `max_target_syllables` obligatorio |
| Dravidico (TA) | 1.3-1.5x | Transcreacion obligatoria |
| Aglutinante (TR, FI, HU) | 1.2-1.4x | `max_target_syllables` activo |
| Arabe | 1.0-1.2x | Monitorear genero |

### 5.4 Hipotesis a validar con piloto

| ID | Hipotesis | Metrica | Criterio de exito |
|:---|:----------|:--------|:------------------|
| H1 | La ruta directa ES-->PT produce mayor COMET que ES-->EN-->PT | xCOMET score, 50 segmentos paralelos | xCOMET directo > xCOMET pivot por >= 5 puntos |
| H2 | La caida de AVD en CJK es causada por: (a) TTS quality, (b) string expansion, (c) perdida cultural. Cuantificar contribucion de cada factor | AVD delta, A/B test con episodio corregido | AVD mejora >= 10% con DTR + expansion control |
| H3 | El EN master actual (AVD -35%) puede mejorarse con contexto enriquecido de traduccion | AVD EN, COMET score EN | AVD EN mejora >= 5% con enriched pivot |
| H4 | La transcreacion forzada por `max_target_syllables` no degrada la fidelidad semantica | COMET + juicio humano, 20 segmentos TA | COMET >= 0.80 + aprobacion humana >= 90% |

---

## 6. Arquitectura — Sistema de Calidad (4 Gates Mejorado)

### 6.1 Los 4 Gates

Arquitectura de validacion en 4 etapas que sintetiza: Mega Propuesta (Claude) para la estructura base, Addendum Deep Research para herramientas especificas, Codex para contratos SSOT, y Gemini Deep Thinking para la critica de escalabilidad y model tiering.

---

#### Gate 1 — Pre-Flight (antes de enviar a ElevenLabs)

**Objetivo:** Detectar y bloquear problemas en el texto ANTES de gastar creditos de API.

| Check | Herramienta | Criterio | Accion |
|:------|:------------|:---------|:-------|
| Blacklist scan 27 idiomas | blacklist JSONs (Doge-MultiLang) + prescanner.py | Match exacto o fuzzy en cualquier idioma | BLOCK si Cat. A (contenido sexual, autolesion). WARN si Cat. B (groseria leve) |
| Deteccion de modismos/idioms | LLM (Gemini Flash, costo minimo) | Frase marcada como modismo regional | WARN: verificar que diccionario cultural positivo tiene mapeo |
| Identificacion de onomatopeyas | Flag `is_onomatopoeia` en guion + LLM fallback | Sonido animal/accion detectado | WARN: verificar tabla `onomatopoeias_override` en PCD |
| Estimacion de timing | `len(texto_target_estimado) / max_duration_ms` | Frase excede +20% en lenguas expansivas (TA, TR, DE) | WARN: solicitar transcreacion |
| String Length Expansion check | Ratio silabas target vs ES | `ratio > 1.3` para Cluster C | BLOCK hasta transcreacion aprobada |
| Pronombre/formalidad check | Reglas por idioma del PCD | du/Sie, tu/vous, banmal/jondaenmal | WARN si registro no coincide con `target_formality` |
| Safety pre-screening | ElevenLabs Scribe v2 entity detection (costo $0) | Categorias: `offensive_language`, `pii`, `phi` | BLOCK si severity > 0 (zero tolerance, contenido infantil) |

**Decision final Gate 1:** `PASS` / `WARN` (continua con flags) / `BLOCK` (humano debe resolver)

---

#### Gate 2 — EN Master Audit (despues de ES --> EN)

**Objetivo:** Garantizar que el EN master sea semanticamente fiel al ES original. Si el EN falla, NINGUN otro idioma se procesa. Este gate es la barrera contra el efecto telefono descompuesto.

| Check | Herramienta | Umbral | Accion |
|:------|:------------|:-------|:-------|
| Calidad de traduccion metrica | COMET / xCOMET-XL (open source, gratis) | > 0.85 PASS / 0.70-0.85 WARN / < 0.70 BLOCK | BLOCK detiene toda la cadena downstream |
| Panel de 3 jueces LLM | Claude Sonnet (#1 WMT24, 9/11 pares) + GPT-4o (GEMBA-MQM documentado) + Gemini Flash (screening rapido) | Consenso por mayoria | FLAG si cualquier juez detecta error Major/Critical |
| Deteccion de errores sin referencia | GEMBA-MQM / Rubric-MQM v2.0 | Error spans categorizados (accuracy, fluency, terminology, style) con severidad | Major/Critical --> revision obligatoria |
| Preservacion de intencion/emocion | LLM compara `intent` del source ES vs output EN | Intencion preservada: SI/NO | NO --> BLOCK, re-traducir con contexto ajustado |
| Verificacion de diccionario cultural | Lookup automatico de modismos vs PCD | Modismo presente en PCD y correctamente mapeado | WARN si modismo no tiene mapeo EN |

**Capa humana obligatoria:** Saul e Ivan revisan el 100% del EN master independientemente de las metricas automaticas. La auditoria humana NO es opcional para Gate 2. Razon: el EN es el ancestro de 26 idiomas; un falso negativo aqui tiene costo multiplicativo.

**Decision final Gate 2:** `PASS` (COMET > 0.85 + 3/3 jueces + humano aprueba) / `BLOCK` (cualquier metrica critica falla o humano rechaza)

---

#### Gate 3 — Multi-Language Audit (despues de EN --> All)

**Objetivo:** Validar la calidad de cada idioma downstream con intensidad proporcional a su valor comercial (RPM) y riesgo regulatorio.

**Tiering por prioridad de idioma:**

| Tier | Idiomas | Revenue share | Checks | Revision humana |
|:-----|:--------|:--------------|:-------|:----------------|
| **Tier 1** | EN, PT-BR, DE, IT, FR | ~94% combinado | COMET + 3 LLM Judges + GEMBA-MQM + blacklist + pronombre + onomatopeya + cultural | SI, 100% |
| **Tier 2** | AR, KO, JA, HI, ZH | ~4% combinado | COMET + GEMBA-MQM (sin referencia) + blacklist + safety flags | Muestreo 30% |
| **Tier 3** | RU, TR, ID, TH, VI, PL, UK, EL, TA, MS, FIL, SV, NL, RO + resto | ~2% combinado | chrF++ + blacklist automatizado + safety API | Solo automatico |

**Checks per-language universales (todos los tiers):**

1. **Blacklist scan** por idioma especifico
2. **Pronombre/formalidad** validacion contra PCD
3. **Onomatopeya** verificacion contra tabla `onomatopoeias_override`
4. **Cultural flags** revisados contra `cultural_matrix_global.json`
5. **Safety screening** via Scribe v2 entity detection

**Decision final Gate 3 por idioma:** `APPROVED` / `FLAGGED` (pasa a revision) / `BLOCKED` (re-traducir)

---

#### Gate 4 — Audio Output Verification

**Objetivo:** Validar la calidad del audio sintetizado por ElevenLabs DESPUES de la generacion TTS. Este gate opera sobre archivos de audio, no sobre texto.

**Pipeline de verificacion completo:**

| Dimension | Herramienta | Metrica | Umbral | Accion si falla |
|:----------|:------------|:--------|:-------|:----------------|
| **Transcripcion** | Dual STT: Whisper large-v3 + Deepgram Nova-3 (consenso) | Acuerdo entre ambos STT | Si difieren: FLAG para revision | Revision manual del segmento |
| **Fidelidad textual** | WER (jiwer) contra texto esperado de traduccion | WER | < 5% AUTO-APROBAR / 5-15% MUESTREO / > 15% REVISION OBLIGATORIA | Segun umbral |
| **Calidad de audio** | librosa + pyloudnorm (gratis) | LUFS (-14 a -16 target), clipping (> 0 dBFS), SNR en silencios | Fuera de rango | Re-generar segmento |
| **Naturalidad** | UTMOS / UTMOSv2 (prediccion MOS, open source) | MOS score | < 3.5 = RECHAZAR | Re-generar con modelo TTS diferente |
| **Emocion/tono** | emotion2vec+ (9 clases, 10+ idiomas, SOTA) + SenseVoice (CJK) | Emocion detectada vs campo `emotion` de dialogue_objects.json | Mismatch > 50% confianza | FLAG: revision humana |
| **Timing drift** | DTW (Dynamic Time Warping, librosa) + WhisperX (forced alignment word-level) | Delta temporal vs segmento original | > 200ms absoluto O > 20% relativo = FLAG | Transcreacion + re-generacion |
| **Consistencia de speaker** | ECAPA-TDNN (speaker embeddings, SpeechBrain) | Cosine similarity vs referencia ES del mismo personaje | < 0.75 = FLAG | Verificar voice_id, posible re-asignacion |

**STT optimo por familia linguistica:**

| Familia | STT primario | STT alternativo | Notas |
|:--------|:-------------|:----------------|:------|
| Ingles | Whisper (2.7% WER) | Deepgram Nova-3 | Ambos excelentes |
| Arabe | Deepgram Nova-3 (modelo AR dedicado) | Whisper | Deepgram superior en AR |
| CJK (JA, KO, ZH) | SenseVoice (<80ms, ASR+SER integrado) | Whisper | SenseVoice 5-15x mas rapido |
| Hindi | Deepgram Nova-3 (modelo HI dedicado) | Whisper | |
| Tamil/Malay | Whisper | Deepgram | WER alto en ambos; idiomas de bajo recurso |
| Europeos (DE, FR, IT, RU) | Whisper | Deepgram | Ambos buenos |
| Safety pre-screen (90+ idiomas) | ElevenLabs Scribe v2 | Whisper + LLM | Scribe v2: entity detection nativa, $0 adicional |

### 6.2 Mejora: Event-Driven vs Waterfall

Gemini Deep Thinking critico la arquitectura de 4 Gates como "cascada bloqueante". Textualmente: *"Es fisicamente imposible y financieramente inviable que un equipo de 5 personas ejecute 4 puertas de validacion humana/hibrida para 27 idiomas por cada episodio."*

**Propuesta mejorada — modelo hibrido:**

```
Gates 1-2: BLOCKING (critical path)
  - Sin Gate 1 aprobado, no se genera nada.
  - Sin Gate 2 aprobado (EN master), no se procesan otros idiomas.
  - Estos son secuenciales y obligatorios.

Gates 3-4: ASYNC por idioma y por tier
  - Cada idioma se procesa independientemente.
  - Tier 3 puede publicar mientras Tier 1 espera revision humana.
  - Un idioma BLOCKED no detiene a los demas.
  - Arquitectura basada en eventos (message queue):
    evento: "traduccion_pt_completada" --> trigger: Gate 3 para PT
    evento: "audio_de_generado" --> trigger: Gate 4 para DE
```

**Resultado:**
- Sin cuello de botella en idiomas de baja prioridad.
- Los 5 idiomas Tier 1 reciben atencion humana completa.
- Los 22 idiomas Tier 2/3 fluyen por QA sintetico sin bloquear la publicacion.
- Safety se mantiene: NINGUN idioma se publica con flags Critical no resueltos.

### 6.3 Model Tiering (TTS)

Hallazgo de Gemini Deep Thinking: el debate asumio un modelo TTS unico para todo el ecosistema. Esto es financieramente ineficiente.

**Estrategia de ruteo TTS basada en RPM:**

| Tier | Modelo TTS | Costo relativo | Idiomas | Justificacion |
|:-----|:-----------|:---------------|:--------|:--------------|
| **Tier 1** | Eleven v3 (expresivo, multimodal, conversacional) | Alto | ES, EN, PT-BR, DE, IT, FR | Estos idiomas generan ~94% del revenue. Las micro-emociones y la expresividad afectiva son criticas para retener audiencia infantil. El costo premium se justifica por RPM. |
| **Tier 2** | Eleven v3 | Alto | JA, KO, ZH, AR, HI | Mercados CJK tienen caida severa de AVD. Eleven v3 necesario para intentar recuperar retencion via calidad acustica superior. |
| **Tier 3** | Flash v2.5 (rapido, ~50% mas barato) | Bajo | Los restantes 17 idiomas | Estos idiomas combinados aportan <2% del revenue. Un 90% de calidad es aceptable si el costo de produccion tiende a cero. |

**Regla de decision:** `IF language.rpm_multiplier >= 2.0 THEN use eleven_v3 ELSE use flash_v2_5`

**Nota sobre flexibilidad:** El tiering no es estatico. Si YouTube Analytics muestra que un idioma Tier 3 comienza a ganar traccion (ej. indonesio sube a 3% del revenue), se promueve a Tier 2 con Eleven v3 automaticamente.

---

## 7. Contratos de Datos SSOT

### 7.1 Reglas Gold Standard

Las 5 reglas fundamentales establecidas por Codex (GPT-5) como invariantes del sistema. Ninguna parte del pipeline puede operar si estas reglas no se cumplen.

| Regla | Nombre | Descripcion | Implicacion practica |
|:------|:-------|:------------|:---------------------|
| **GS-01** | SSOT en 4 capas | Toda la informacion del pipeline vive en 4 JSONs canonicos: texto, voz, timing, QA. No hay fuente de verdad alternativa. | Si un componente necesita datos, los lee del JSON correspondiente. Nunca del .docx, nunca de memoria, nunca de la GUI. |
| **GS-02** | Nada downstream lee docx directo | El .docx de Andrea se procesa UNA vez por `docx_parser.py` y produce `dialogue_objects.json`. A partir de ahi, todo el pipeline consume JSON. | El .docx es un artefacto de entrada. Despues del parseo, es "read-only historico". Cualquier correccion se hace en el JSON, no en el Word. |
| **GS-03** | API-first, GUI-fallback | La UI de ElevenLabs (Dubbing Studio) sirve para excepciones y control manual. El pipeline primario es programatico via API. | El flujo normal es: script --> API --> resultado. La GUI es el plan B cuando algo falla y requiere intervencion visual humana. |
| **GS-04** | Re-mapping manual prohibido | Si no existe un `voice_manifest.json` valido que mapee cada personaje a su `voice_id` por idioma, el pipeline SE BLOQUEA. No se permite asignar voces "de memoria" o ad-hoc. | Esto previene el error critico donde Personaje A habla con voz de Personaje B. Sin manifest, no hay generacion. |
| **GS-05** | Timing sin trazabilidad no se publica | Toda correccion de silencios, speaker boundary, o timing drift debe dejar registro de: fuente (`heuristic` / `reconciled` / `manual_override`), quien la hizo, cuando, y por que. | Esto cumple el requisito de auditabilidad. Si un segmento tiene timing ajustado, el `qa_report.json` debe contener la traza completa. |

### 7.2 Los 4 JSON Contracts

Los 4 contratos de datos SSOT que conectan todos los componentes del pipeline. Cada JSON es propiedad de un proceso especifico y consumido por los demas como lectura.

---

#### 1. `dialogue_objects.json` — Text SSOT

**Productor:** `docx_parser.py` (Phase 0)
**Consumidores:** prescanner, traductor LLM, ElevenLabs API, audit_service, dashboard QA

```json
{
  "episode_id": "EP052",
  "source_language": "es",
  "parser_version": "2.1.0",
  "parsed_at": "2026-02-20T08:00:00Z",
  "scenes": [
    {
      "scene_id": "S04",
      "start_ms": 45000,
      "end_ms": 62000,
      "lines": [
        {
          "line_id": "EP052_S04_L001",
          "speaker": "michi_cat",
          "voice_id": "ref:voice_manifest",
          "text_es": "No manches! El perro Doge se llevo mi pelota.",
          "emotion": "angry_crying",
          "is_onomatopoeia": false,
          "intensity_score": 0.8,
          "visual_context": "Michi senalando a lo lejos, frustrado y a punto de llorar.",
          "timing": {
            "start_ms": 45500,
            "end_ms": 48700,
            "max_duration_ms": 3200
          }
        }
      ]
    }
  ]
}
```

**Campos clave:**
- `line_id`: Identificador unico global. Formato: `{episode}_{scene}_{line}`.
- `emotion`: Se mapea directamente a los `audio_tags` de Eleven v3.
- `visual_context`: Contexto inyectable como System Instructions al LLM traductor (enriquece el pivot para Cluster C).
- `max_duration_ms`: Permite el calculo de string length expansion pre-TTS.

---

#### 2. `voice_manifest.json` — Voice SSOT

**Productor:** Ramon (ingenieria de audio) + Daniel (configuracion API)
**Consumidores:** ElevenLabs API, validate_speakers.py, audit_service

```json
{
  "episode_id": "EP052",
  "manifest_version": "1.0.0",
  "updated_at": "2026-02-19T16:00:00Z",
  "characters": [
    {
      "character_id": "michi_cat",
      "display_name": "Michi",
      "gender": "female",
      "age_range": "8-10",
      "formality": "informal",
      "voice_id_es": "abc123_es",
      "pronunciation_dictionary_id": "dict_michi_v3",
      "voice_ids_by_lang": {
        "en": "def456_en",
        "pt-br": "ghi789_pt",
        "de": "jkl012_de",
        "ja": "mno345_ja"
      }
    }
  ]
}
```

**Campos clave:**
- `pronunciation_dictionary_id`: Referencia al diccionario IPA de ElevenLabs que fija la pronunciacion de nombres propios ("Doge" = /doʊdʒ/) globalmente.
- `voice_ids_by_lang`: Mapeo explicito personaje-->voz por idioma. GS-04 exige que este campo exista y sea valido.
- `formality`: Informa al LLM traductor el registro apropiado para este personaje.

---

#### 3. `timing_objects.json` — Timing SSOT

**Productor:** `audit_service.py` + Forced Alignment API (post-generacion)
**Consumidores:** Fernando (post-produccion), exportador SRT, dashboard QA

```json
{
  "episode_id": "EP052",
  "language": "en",
  "generated_at": "2026-02-20T10:15:00Z",
  "alignment_source": "elevenlabs_forced_alignment_v2",
  "segments": [
    {
      "line_id": "EP052_S04_L001",
      "speaker": "michi_cat",
      "text_translated": "No way! That dog Doge took my ball!",
      "timing_original": {
        "start_ms": 45500,
        "end_ms": 48700
      },
      "timing_dubbed": {
        "start_ms": 45520,
        "end_ms": 48950
      },
      "drift_ms": 250,
      "drift_pct": 7.8,
      "drift_source": "heuristic",
      "flagged": false
    }
  ]
}
```

**Campos clave:**
- `alignment_source`: Trazabilidad obligatoria (GS-05). Indica si el timing viene de heuristica, forced alignment API, o manual override.
- `drift_ms` / `drift_pct`: Desviacion absoluta y relativa. Gate 4 flaggea si > 200ms o > 20%.
- `drift_source`: Enum de `heuristic` | `reconciled` | `manual_override`. Si es `manual_override`, debe existir un campo adicional `override_by` y `override_reason`.

---

#### 4. `qa_report.json` — QA SSOT

**Productor:** `audit_service.py` (Phase 1)
**Consumidores:** Dashboard QA, Kaizen/Mem0, reunion OVEJA semanal

```json
{
  "episode_id": "EP052",
  "language": "en",
  "tier": 1,
  "tts_model_used": "eleven_v3",
  "generated_at": "2026-02-20T11:00:00Z",
  "gates": {
    "gate_1": {"status": "PASS", "flags": 0, "blocks": 0},
    "gate_2": {"status": "PASS", "comet_score": 0.91, "llm_judges": "3/3 PASS", "human_reviewer": "saul"},
    "gate_3": {"status": "PASS", "comet_score": 0.89, "gemba_mqm_errors": 1, "gemba_mqm_severity": "minor"},
    "gate_4": {"status": "APPROVED", "details": "below"}
  },
  "metrics": {
    "wer": 3.2,
    "comet_score": 0.91,
    "mos_score": 4.1,
    "timing_drift_avg_pct": 7.8,
    "category_a_flags": 0,
    "speaker_consistency_score": 0.92,
    "emotion_match_pct": 95.0
  },
  "errors": [
    {
      "error_id": "ERR-001",
      "type": "timing_drift",
      "mqm_category": "fluency",
      "severity": "minor",
      "mqm_points": 1,
      "line_id": "EP052_S04_L001",
      "detail": "Drift 7.8% en linea con emocion alta",
      "suggestion": "Dentro de tolerancia, no requiere accion"
    }
  ],
  "verdict": "APPROVED",
  "reviewed_by": "system + saul",
  "mqm_total_points": 1,
  "timestamp": "2026-02-20T11:30:00Z"
}
```

**Campos clave:**
- `gates`: Registro explicito del resultado de cada gate para este idioma.
- `mqm_total_points`: Score acumulado del framework MQM adaptado. Minor = 1pt, Major = 5pt, Critical = 25pt. Umbral de aprobacion por tier.
- `tts_model_used`: Trazabilidad del modelo TTS (Eleven v3 vs Flash v2.5).
- `reviewed_by`: `system` para automatico, nombre de persona para revision humana. GS-05 exige esta trazabilidad.

### 7.3 `cultural_matrix_global.json` — Cultural SSOT (5to contrato)

Contrato nuevo propuesto por Gemini Deep Thinking como el "Positive Cultural Dictionary (PCD)". Mientras las blacklists dicen "que NO decir", este JSON instruye al pipeline sobre "que SI decir" y "COMO decirlo" por idioma.

**Productor:** Equipo QPH (draft LLM + validacion nativos) + Daniel (mantenimiento)
**Consumidores:** Traductor LLM (inyectado como System Prompt), prescanner, Gate 1, Gate 3

```json
{
  "schema_version": "1.0.0",
  "updated_at": "2026-02-20T09:00:00Z",

  "project_directives": {
    "target_audience": "kids_8_15",
    "violence_level": "absolute_zero",
    "translation_philosophy": "localize_intent_not_literal_words",
    "brand_names_immutable": ["Doge", "Michi", "QuePerroHilo", "QPH"],
    "content_rating": "G / All Ages"
  },

  "locales": {
    "de-DE": {
      "compliance_framework": "AVMSD_EU",
      "formality_register": "MANDATORY: Always use informal 'du' or 'ihr' for peers and child audiences. The use of formal 'Sie' is BANNED.",
      "slang_mapping": {
        "Que padre!": {"target": "Wie krass! / Wie cool!", "intent": "Innocent amazement"},
        "No manches!": {"target": "Echt jetzt?! / Krass!", "intent": "Disbelief/surprise"},
        "Guey": {"target": "Alter / Digga", "intent": "Casual peer address, child-safe"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Wau wau!",
        "cat_meow": "Miau!",
        "crying": "Baeaeaeh!",
        "explosion": "Bumm!",
        "laughter": "Haha!"
      },
      "forbidden_terms": ["ref:blacklist_de.json"],
      "notes": "DE es el mercado mas valioso por vista (x7.2 RPM). Justifica revision humana en cada episodio."
    },
    "ja-JP": {
      "compliance_framework": "BPO_Japan",
      "formality_register": "MANDATORY: Use casual speech (Plain form / da/yo endings). Avoid standard Keigo (desu/masu) between young friends. Keigo ONLY when child addresses adult authority figure.",
      "honorifics_rules": {
        "male_peer": "-kun",
        "female_peer": "-chan",
        "small_animal": "-chan",
        "adult_authority": "-sensei or -san",
        "self_reference": "boku (male) / atashi (female)"
      },
      "slang_mapping": {
        "Que padre!": {"target": "Sugoi! / Yabai!", "intent": "Excited amazement"},
        "No manches!": {"target": "Uso! / Maji de?!", "intent": "Disbelief"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Wan wan!",
        "cat_meow": "Nyan!",
        "crying": "Uwaa!",
        "explosion": "Don!",
        "laughter": "Ahaha!"
      },
      "forbidden_terms": ["ref:blacklist_ja.json"],
      "notes": "Japones tiene ~4,500 onomatopeyas. Este mapeo cubre las mas frecuentes en QPH; expandir segun episodios."
    },
    "ar-SA": {
      "compliance_framework": "National_Media_Council",
      "formality_register": "Informal. Cuidado con genero gramatical en sustantivos y adjetivos.",
      "cultural_sensitivities": {
        "animal_references": "NUNCA usar 'khanzir' (cerdo) como insulto — animal haram. Reemplazar con 'ghayr nazif' (sucio/desordenado).",
        "religious_references": "Neutralizar toda referencia religiosa especifica. No mencionar festividades no islamicas.",
        "food_references": "Verificar que alimentos mencionados sean halal."
      },
      "slang_mapping": {
        "Que padre!": {"target": "Ya salaam!", "intent": "Amazement"},
        "No manches!": {"target": "Mish maaqul!", "intent": "Disbelief"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Haw haw!",
        "cat_meow": "Miyau!",
        "crying": "Waaa!",
        "explosion": "Buum!",
        "laughter": "Hahaha!"
      },
      "forbidden_terms": ["ref:blacklist_ar.json"]
    },
    "ko-KR": {
      "compliance_framework": "KCSC",
      "formality_register": "Haoche/Haerache (medio-informal). 7 niveles de habla en coreano; usar nivel medio para dialogos entre ninos.",
      "slang_mapping": {
        "Que padre!": {"target": "Daebak!", "intent": "Amazement"},
        "No manches!": {"target": "Heol! / Jinjja?!", "intent": "Disbelief"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Meong meong!",
        "cat_meow": "Yaong!",
        "crying": "Heung heung!",
        "explosion": "Kwang!",
        "laughter": "Kkkk!"
      },
      "forbidden_terms": ["ref:blacklist_ko.json"]
    },
    "hi-IN": {
      "compliance_framework": "CBFC_India",
      "formality_register": "Usar 'tum' (informal-medio) entre ninos. 3 niveles: tu (muy informal) / tum (normal) / aap (formal). NUNCA 'aap' entre amigos ninos.",
      "cultural_sensitivities": {
        "animal_references": "La vaca es sagrada. Evitar referencias negativas a vacas.",
        "food_references": "Vegetarianismo prevalente. No asumir dieta carnivora."
      },
      "slang_mapping": {
        "Que padre!": {"target": "Zabardast! / Mast!", "intent": "Amazement"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Bhau bhau!",
        "cat_meow": "Myaau!",
        "crying": "Waa!",
        "explosion": "Dhamaka!",
        "laughter": "Haha!"
      },
      "forbidden_terms": ["ref:blacklist_hi.json"]
    },
    "pt-BR": {
      "compliance_framework": "ECA_Brazil",
      "formality_register": "Usar 'voce' (informal) siempre. 'Tu' varia por region; 'voce' es neutro nacional.",
      "slang_mapping": {
        "Que padre!": {"target": "Que massa! / Que legal!", "intent": "Amazement"},
        "No manches!": {"target": "Nao acredito! / Caramba!", "intent": "Disbelief"},
        "Guey": {"target": "Mano / Cara", "intent": "Casual peer address"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Au au!",
        "cat_meow": "Miau!",
        "crying": "Buaa!",
        "explosion": "Bum!",
        "laughter": "Kkk! / Haha!"
      },
      "forbidden_terms": ["ref:blacklist_pt.json"]
    },
    "fr-FR": {
      "compliance_framework": "CSA_France",
      "formality_register": "MANDATORY: 'tu' entre ninos. NUNCA 'vous' entre pares. 'Vous' SOLO cuando nino habla con adulto de autoridad.",
      "slang_mapping": {
        "Que padre!": {"target": "Trop cool! / Genial!", "intent": "Amazement"},
        "No manches!": {"target": "C'est pas vrai! / Serieux?!", "intent": "Disbelief"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Ouaf ouaf!",
        "cat_meow": "Miaou!",
        "crying": "Ouin ouin!",
        "explosion": "Boum!",
        "laughter": "Haha!"
      },
      "forbidden_terms": ["ref:blacklist_fr.json"]
    },
    "it-IT": {
      "compliance_framework": "AGCOM_Italy",
      "formality_register": "Usar 'tu' entre ninos. 'Lei' SOLO para adultos de autoridad.",
      "slang_mapping": {
        "Que padre!": {"target": "Che figata! / Troppo forte!", "intent": "Amazement"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Bau bau!",
        "cat_meow": "Miao!",
        "crying": "Buaa!",
        "explosion": "Bum!",
        "laughter": "Ahaha!"
      },
      "forbidden_terms": ["ref:blacklist_it.json"]
    },
    "ru-RU": {
      "compliance_framework": "Roskomnadzor",
      "formality_register": "Usar 'ty' (informal) entre ninos. 'Vy' SOLO para adultos autoritarios.",
      "slang_mapping": {
        "Que padre!": {"target": "Kruto! / Ofiget!", "intent": "Amazement"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Gav gav!",
        "cat_meow": "Myau!",
        "crying": "Uaa!",
        "explosion": "Bum!",
        "laughter": "Haha!"
      },
      "forbidden_terms": ["ref:blacklist_ru.json"]
    },
    "tr-TR": {
      "compliance_framework": "RTUK_Turkey",
      "formality_register": "Usar 'sen' (informal) entre ninos. 'Siz' SOLO para adultos/respeto.",
      "slang_mapping": {
        "Que padre!": {"target": "Cok havalı! / Muhtesem!", "intent": "Amazement"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Hav hav!",
        "cat_meow": "Miyav!",
        "crying": "Vaa!",
        "explosion": "Bum!",
        "laughter": "Hahaha!"
      },
      "forbidden_terms": ["ref:blacklist_tr.json"]
    },
    "id-ID": {
      "compliance_framework": "KPI_Indonesia",
      "formality_register": "Usar 'aku'/'kamu' (informal). NUNCA 'saya'/'Anda' (demasiado formal para ninos).",
      "slang_mapping": {
        "Que padre!": {"target": "Keren banget! / Gokil!", "intent": "Amazement"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Guk guk!",
        "cat_meow": "Meong!",
        "crying": "Huaa!",
        "explosion": "Bum!",
        "laughter": "Wkwkwk!"
      },
      "forbidden_terms": ["ref:blacklist_id.json"]
    },
    "zh-CN": {
      "compliance_framework": "NRTA_CAC_Minor_Mode",
      "formality_register": "Informal conversacional. Evitar lenguaje excesivamente coloquial de internet (slang de Bilibili).",
      "cultural_sensitivities": {
        "political_references": "Zero tolerance. Ninguna referencia politica, historica sensible, o territorial.",
        "content_values": "Debe 'promover valores socialistas' segun regulacion NRTA. Evitar individualismo extremo."
      },
      "slang_mapping": {
        "Que padre!": {"target": "Tai ku le! / Hao li hai!", "intent": "Amazement"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Wang wang!",
        "cat_meow": "Miao!",
        "crying": "Wuwu!",
        "explosion": "Hong!",
        "laughter": "Haha!"
      },
      "forbidden_terms": ["ref:blacklist_zh.json"],
      "notes": "Mercado chino tiene regulacion mas estricta. Revisar por episodio si se distribuye en China continental."
    }
  },

  "global_onomatopoeias_override": {
    "dog_bark": {"es": "Guau!", "en": "Woof!", "description": "Ladrido de perro"},
    "cat_meow": {"es": "Miau!", "en": "Meow!", "description": "Maullido de gato"},
    "explosion": {"es": "Bum!", "en": "Boom!", "description": "Explosion"},
    "laughter": {"es": "Jaja!", "en": "Haha!", "description": "Risa"},
    "punch": {"es": "Pum!", "en": "Bam!", "description": "Golpe"},
    "surprise": {"es": "Oh!", "en": "Oh!", "description": "Sorpresa"},
    "pain": {"es": "Ay!", "en": "Ouch!", "description": "Dolor"},
    "crying": {"es": "Buaa!", "en": "Waah!", "description": "Llanto"},
    "fear": {"es": "Ahhh!", "en": "Ahhh!", "description": "Miedo"},
    "disgust": {"es": "Guacala!", "en": "Eww!", "description": "Asco"}
  }
}
```

**Mecanismo de uso en el pipeline:**

1. **Gate 1 (Pre-flight):** El prescanner consulta `cultural_matrix_global.json` para validar que modismos del guion ES tienen mapeo en el PCD.
2. **Traduccion LLM:** El contenido relevante del locale se inyecta como System Prompt al traductor. El LLM no "adivina" el tono; recibe instrucciones explicitas.
3. **Onomatopeyas:** Si `dialogue_objects.json` marca `is_onomatopoeia: true`, el pipeline puentea la inferencia del LLM y extrae el valor exacto de `onomatopoeias_override`. El perro dice "Wan wan!" en Japon sin negociacion.
4. **Gate 3 (Multi-language):** Valida que la traduccion respeta las reglas de formalidad y sensibilidades culturales del locale.
5. **Kaizen:** Correcciones descubiertas por nativos o Mem0 se integran como nuevas entradas en el PCD para episodios futuros.
