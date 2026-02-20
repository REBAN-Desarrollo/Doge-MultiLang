## SECTION 7: SISTEMA DE QA (4 Gates + Tiering)

### 7.1 Arquitectura de 4 Gates (Consenso)

La arquitectura de QA de QPH se estructura en 4 Gates secuenciales-asincronos. Gates 1-2 son BLOCKING (critical path): sin Gate 1 aprobado no se genera nada, sin Gate 2 aprobado (EN master) no se procesan otros idiomas. Gates 3-4 operan de forma ASINCRONA por idioma y por tier, permitiendo que Tier 3 publique mientras Tier 1 espera revision humana.

Este modelo hibrido (blocking + async) resuelve la critica de Gemini Deep Thinking de que un modelo waterfall puro de 4 Gates humanos para 27 idiomas "colapsaria la operacion" de un equipo de 5 personas.

---

#### Gate 1: Pre-Flight (antes de enviar a ElevenLabs)

**Objetivo:** Detectar y bloquear problemas en el texto ANTES de gastar creditos de API.

| Check | Herramienta | Criterio | Accion |
|:------|:------------|:---------|:-------|
| Blacklist scan 27 idiomas | Blacklist JSONs (`knowledgebase/blacklists/`) + `prescanner.py` | Match exacto o fuzzy en cualquier idioma | BLOCK si Cat. A (sexual, autolesion, haram). WARN si Cat. B (groseria leve) |
| Safety pre-screening | ElevenLabs `use_profanity_filter` (BETA, $0) | Censura profanidades en transcripcion con `[censored]` | BLOCK si severity > 0 (zero tolerance contenido infantil) |
| Deteccion de modismos | LLM (Gemini Flash, costo minimo) | Frase marcada como modismo regional | WARN: verificar mapeo en `cultural_matrix_global.json` (PCD) |
| Identificacion de onomatopeyas | Flag `is_onomatopoeia` en guion + LLM fallback | Sonido animal/accion detectado | WARN: verificar tabla `onomatopoeias_override` en PCD |
| Estimacion de timing | `len(texto_target_estimado) / max_duration_ms` | Frase excede +20% en lenguas expansivas (TA, TR, DE) | WARN: solicitar transcreacion |
| String Length Expansion | Ratio silabas target vs ES | `ratio > 1.3` para Cluster C (distante) | BLOCK hasta transcreacion aprobada |
| Pronombre/formalidad check | Reglas por idioma del PCD | du/Sie, tu/vous, banmal/jondaenmal | WARN si registro no coincide con `target_formality` |

**Quien decide:** Sistema automatico. Humano interviene solo si BLOCK.
**Datos que genera:** Pre-scan flags (lista de warnings + blocks por linea de dialogo).
**Tools:** `prescanner.py`, blacklist JSONs, `cultural_matrix_global.json`, ElevenLabs `use_profanity_filter`, Gemini Flash.

**Decision final Gate 1:** `PASS` / `WARN` (continua con flags) / `BLOCK` (humano debe resolver).

---

#### Gate 2: Traduccion ES -> EN (EN Master Audit)

**Objetivo:** Garantizar que el EN master sea semanticamente fiel al ES original. Si el EN falla, NINGUN otro idioma se procesa. Este gate es la barrera contra el efecto telefono descompuesto.

| Check | Herramienta | Umbral | Accion |
|:------|:------------|:-------|:-------|
| Calidad de traduccion metrica | COMET / xCOMET-XL (open source, gratis) | > 0.85 PASS / 0.70-0.85 WARN / < 0.70 BLOCK | BLOCK detiene toda la cadena downstream |
| Panel de 3 jueces LLM | Claude Sonnet (#1 WMT24) + GPT-4o (GEMBA-MQM documentado) + Gemini Flash (screening) | Consenso por mayoria | FLAG si cualquier juez detecta error Major/Critical |
| Deteccion de errores sin referencia | GEMBA-MQM / Rubric-MQM v2.0 | Error spans categorizados: accuracy, fluency, terminology, style | Major/Critical --> revision obligatoria |
| Preservacion de intencion/emocion | LLM compara `intent` del source ES vs output EN | Intencion preservada: SI/NO | NO --> BLOCK, re-traducir con contexto ajustado |
| Verificacion diccionario cultural | Lookup automatico de modismos vs PCD | Modismo presente en PCD y correctamente mapeado | WARN si modismo no tiene mapeo EN |

**Quien decide:** Sistema automatico + Saul/Ivan (100% revision humana obligatoria).
**Datos que genera:** COMET score, GEMBA-MQM error spans, veredicto de 3 jueces LLM, campo `human_reviewer`.
**Tools:** COMET/xCOMET-XL, Rubric-MQM v2.0, Claude Sonnet, GPT-4o, Gemini Flash, `cultural_matrix_global.json`.

**Capa humana obligatoria:** Saul e Ivan revisan el 100% del EN master independientemente de las metricas automaticas. El EN es el ancestro de los idiomas Cluster C; un falso negativo aqui tiene costo multiplicativo x26.

**Decision final Gate 2:** `PASS` (COMET > 0.85 + 3/3 jueces + humano aprueba) / `BLOCK` (cualquier metrica critica falla o humano rechaza).

---

#### Gate 3: Multi-Idioma (EN -> Todos los idiomas)

**Objetivo:** Validar la calidad de cada idioma downstream con intensidad proporcional a su valor comercial (RPM) y riesgo regulatorio.

| Check | Tier 1 | Tier 2 | Tier 3 |
|:------|:-------|:-------|:-------|
| Calidad traduccion | COMET + 3 LLM Judges + GEMBA-MQM | COMET + GEMBA-MQM (sin referencia) | chrF++ + blacklist auto |
| Blacklist scan | Si, idioma especifico | Si | Si |
| Pronombre/formalidad | Validacion contra PCD | Validacion contra PCD | Automatica |
| Onomatopeya | Verificacion contra `onomatopoeias_override` | Verificacion | Automatica |
| Cultural flags | `cultural_matrix_global.json` revision completa | Flags automaticos | Solo safety API |
| Safety screening | Scribe v2 entity detection + Azure/Perspective API | Scribe v2 entity detection | Scribe v2 entity detection |
| Revision humana | SI, 100% | Muestreo 30% | Solo automatico |

**Quien decide:** Sistema automatico para Tier 2/3. Humano para Tier 1.
**Datos que genera:** COMET/chrF++ score por idioma, GEMBA-MQM error spans, blacklist matches, cultural flags, safety flags.
**Tools:** COMET, GEMBA-MQM, chrF++, Scribe v2, Azure Content Safety / Perspective API, blacklist JSONs, PCD.

**Operacion asincrona:** Cada idioma se procesa independientemente. Tier 3 puede publicarse mientras Tier 1 espera revision humana. Un idioma BLOCKED no detiene a los demas. Safety se mantiene: NINGUN idioma se publica con flags Critical no resueltos.

**Decision final Gate 3 por idioma:** `APPROVED` / `FLAGGED` (pasa a revision) / `BLOCKED` (re-traducir).

---

#### Gate 4: Audio Output (Post-TTS)

**Objetivo:** Validar la calidad del audio sintetizado por ElevenLabs DESPUES de la generacion TTS. Opera sobre archivos de audio, no sobre texto.

| Dimension | Herramienta | Metrica | Umbral | Accion si falla |
|:----------|:------------|:--------|:-------|:----------------|
| **Transcripcion** | Dual STT: Whisper large-v3 + Deepgram Nova-3 (consenso) | Acuerdo entre ambos STT | Si difieren: FLAG | Revision manual del segmento |
| **Fidelidad textual** | WER (jiwer) contra texto esperado | WER | < 5% AUTO-APROBAR / 5-15% MUESTREO / > 15% REVISION | Segun umbral |
| **Calidad de audio** | librosa + pyloudnorm | LUFS (-14 a -16), clipping (> 0 dBFS), SNR | Fuera de rango | Re-generar segmento |
| **Naturalidad** | UTMOS / UTMOSv2 (prediccion MOS, open source) | MOS score | < 3.5 = RECHAZAR | Re-generar con modelo TTS diferente |
| **Emocion/tono** | emotion2vec+ (9 clases, 10+ idiomas) + SenseVoice (CJK) | Emocion detectada vs campo `emotion` del guion | Mismatch > 50% confianza | FLAG: revision humana |
| **Timing drift** | DTW (librosa) + WhisperX (forced alignment word-level) | Delta temporal vs segmento original | > 200ms absoluto O > 20% relativo | Transcreacion + re-generacion |
| **Consistencia de speaker** | ECAPA-TDNN (speaker embeddings, SpeechBrain) | Cosine similarity vs referencia ES | < 0.75 = FLAG | Verificar voice_id, posible re-asignacion |

**Quien decide:** Sistema automatico. Humano revisa solo si FLAG/RECHAZAR.
**Datos que genera:** `qa_report.json` completo con WER, MOS, emotion match, drift, speaker consistency, veredicto.
**Tools:** Whisper, Deepgram Nova-3, SenseVoice, jiwer, librosa, pyloudnorm, UTMOS, emotion2vec+, WhisperX, ECAPA-TDNN.

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

**Decision final Gate 4:** `APPROVED` (todas metricas pasan) / `FLAGGED` (alguna metrica fuera de umbral) / `REJECTED` (metrica critica falla).

---

### 7.2 Tiering por Idioma (Consenso)

Tabla consolidada que sintetiza: Mega Propuesta (Claude) para estructura base, Addendum para costos corregidos, Gemini Deep Thinking para model tiering por RPM, Gemini 3.1 Pro para correccion de STT dual, y Gaps Pendientes para datos reales de AVD y revenue.

| Tier | Idiomas | WER umbral | Revision humana | Revenue% (est.) | Modelo TTS | Costo QA/episodio |
|:-----|:--------|:-----------|:----------------|:----------------|:-----------|:------------------|
| **Tier 1** | EN, PT-BR, DE, IT, FR | < 5% | SI, 100% obligatoria | ~94% combinado | Eleven v3 (expresivo) | ~$8-13 auto + ~$40-50 humano |
| **Tier 2** | AR, KO, JA, HI, ZH | < 10% | Muestreo 30% | ~4% combinado | Eleven v3 (para recuperar AVD CJK) | ~$3-6 automatizado |
| **Tier 3** | RU, TR, ID, TH, VI, PL, UK, EL, TA, MS, FIL, SV, NL, RO + resto | < 15% | Solo automatico | ~2% combinado | Flash v2.5 (50% mas barato) | ~$1-3 automatizado |

**Regla de decision TTS:** `IF language.rpm_multiplier >= 2.0 THEN use eleven_v3 ELSE use flash_v2_5`

**Nota sobre flexibilidad:** El tiering no es estatico. Si YouTube Analytics muestra que un idioma Tier 3 comienza a ganar traccion (ejemplo: indonesio sube a 3% del revenue), se promueve a Tier 2 con Eleven v3. Candidatos a pausar/evaluar segun datos reales de Gaps Pendientes:
- Tamil: 30K views, ~$10 revenue, AVD 1:58 -- costo > revenue
- Filipino: 46K views, ~$50 revenue, AVD 2:24 -- costo > revenue
- Chino/Mandarin: 65K views, ~$140 revenue, AVD 2:24 -- marginal
- Coreano: 629K views, ~$611 revenue, AVD 2:27 -- break-even

---

### 7.3 Herramientas Recomendadas (Stack)

Tabla completa de herramientas para el pipeline de QA, consolidando Addendum, Gemini audits, y Mega Barrido:

| Herramienta | Funcion | Costo | Licencia | Prioridad |
|:------------|:--------|:------|:---------|:----------|
| **COMET / xCOMET-XL** | Metrica neural de calidad de traduccion. Detecta DONDE hay errores. Reference-free via Quality Estimation | Gratis (self-hosted) | Apache 2.0 | **P0** |
| **GEMBA-MQM / Rubric-MQM v2.0** | LLM juzga calidad SIN referencia humana. Detecta error spans categorizados (accuracy, fluency, terminology, style) con severidad | ~$0.01-0.03/segmento (API LLM) | Open source | **P0** |
| **Whisper large-v3** | STT primario. 2.7% WER en ingles. Soporte multilingue amplio | $0.006/min (OpenAI API) o gratis self-hosted | MIT | **P0** |
| **Deepgram Nova-3** | STT alternativo para consenso dual. Modelos dedicados para AR, HI. Mejor que Whisper en ciertas familias | $0.0043/min | Propietario (API) | **P1** |
| **SenseVoice** | ASR + SER (Speech Emotion Recognition) integrado. <80ms latencia. Optimo para CJK (50+ idiomas) | Gratis (self-hosted) | Open source | **P1** |
| **ElevenLabs Scribe v2** | STT con entity detection (56 tipos: `offensive_language`, `pii`, `phi`, `pci`). Keyterm prompting (100 terminos). Export SRT/VTT. 90+ idiomas | Incluido en plan Pro | Propietario (incluido) | **P0** |
| **UTMOS / UTMOSv2** | Prediccion de MOS (naturalidad acustica). Umbral: < 3.5 = rechazar audio | Gratis (self-hosted) | Open source | **P1** |
| **emotion2vec+** | Deteccion de emocion en audio. 9 clases, 10+ idiomas, SOTA en IEMOCAP. 90-300M params | Gratis (self-hosted) | Open source | **P1** |
| **ECAPA-TDNN** | Speaker embeddings para verificacion de consistencia de voz. Cosine similarity vs referencia ES | Gratis (self-hosted) | Open source (SpeechBrain) | **P2** |
| **librosa + pyloudnorm** | Analisis de audio: LUFS, clipping, SNR, DTW para timing drift, espectral para artefactos | Gratis | MIT | **P1** |
| **WhisperX** | Forced alignment a nivel de palabra. Timestamps de alta precision para drift detection | Gratis (self-hosted) | Open source | **P1** |
| **Mem0** | Memoria persistente de correcciones para agentes AI. 41K GitHub stars. Almacena patrones de error para prevencion automatica en episodios futuros | Gratis (self-hosted) | Apache 2.0 | **P2** |
| **Metabase** | Dashboard QA open source, no-code. Conecta a PostgreSQL/Supabase. Semaforos por idioma, tendencias WER, FTR | Gratis (self-hosted) | AGPL | **P2** |
| **chrF++** | N-gram de caracteres. Barato, bueno para CJK. Baseline para Tier 3 | Gratis | Open source | **P1** |
| **Claude Sonnet** | Juez LLM #1. #1 en 9/11 pares WMT24, 78% "good" en Lokalise 2025 | $3/$15 por 1M tokens | API | **P0** |
| **GPT-4o** | Juez LLM #2. GEMBA-MQM bien documentado | $5/$15 por 1M tokens | API | **P0** |
| **Gemini 2.0 Flash** | Pre-filtro rapido de alto volumen. Screening masivo | $0.10/$0.40 por 1M tokens | API | **P1** |
| **Azure AI Content Safety** | Safety API corporativa. 100+ idiomas. Metricas de severidad: odio, violencia, autolesion, sexual | ~$0.001/req | Propietario (API) | **P2** |
| **Perspective API (Google)** | Toxicidad multilingue. Gratis hasta 1 QPS | $0 (rate limited) | API gratuita | **P2** |

---

### 7.4 Alternativas por Gate y Tier

Matriz de combinacion recomendada por Tier, sintetizando Addendum seccion 10.2 con correcciones de Gemini 3.1 Pro (STT por excepcion):

| Tier | Gate 1 (Safety) | Gate 2 (Traduccion EN) | Gate 3 (Multi-idioma) | Gate 4 (Audio) | Costo estimado/ep |
|:-----|:----------------|:-----------------------|:----------------------|:---------------|:-------------------|
| **Tier 1** | Scribe v2 + `use_profanity_filter` + LLM Safety Judge + Azure/Perspective API | COMET + 3 LLM Judges (Claude + GPT-4o + Gemini) + GEMBA-MQM + humano 100% | GEMBA-MQM + COMET + blacklist + PCD + humano 100% | Whisper + Deepgram dual + UTMOS + emotion2vec+ + ECAPA-TDNN + librosa | ~$8-13 auto + ~$40-50 humano |
| **Tier 2** | Scribe v2 + `use_profanity_filter` + blacklists | COMET + 1 LLM Judge + GEMBA-MQM | GEMBA-MQM + blacklist + PCD | Scribe v2 + Whisper + UTMOS | ~$3-6 |
| **Tier 3** | Scribe v2 + `use_profanity_filter` + blacklists | COMET + chrF++ (metricas automaticas solamente) | chrF++ + blacklist auto + safety API | Solo Whisper + librosa basico | ~$1-3 |

**Alternativas evaluadas y descartadas por Gate:**

- **Gate 1:** OpenAI Moderation API descartada como primera linea (costo adicional innecesario cuando Scribe v2 es gratis). Reservada como complemento para Tier 1.
- **Gate 2:** Un solo LLM como juez descartado (bias de modelo individual, 30-40% menos preciso que consenso). Lokalise AI LQA descartada (vendor lock-in, costo mensual).
- **Gate 3:** COMET con pseudo-referencia descartado para Tier 3 (mas complejo y caro). Crowdin AI Review reservado solo si el equipo adopta Crowdin como TMS.
- **Gate 4:** STT dual masivo en Tier 3 descartado (Gemini 3.1 Pro lo identifico como "mito presupuestario"). Gemini como STT complementario solo activado por excepcion (WER > 15%).

---

### 7.5 Costo Real de QA (Corregido)

La estimacion original de ~$1.20/proyecto era una hipotesis con confianza del 35% (A-005 del registro de asunciones). Tras deep research con precios reales de febrero 2026:

| Componente | Estimacion Original | Estimacion Corregida | Delta |
|:-----------|:--------------------|:---------------------|:------|
| STT (Whisper + Deepgram) | ~$1.02 (solo Whisper) | ~$3-6 (27 idiomas x dual STT Tier 1) | Subestimado 3-6x |
| LLM Screening (Gemini Flash) | ~$0.17 | ~$2-5 (3 jueces LLM para Gate 2-3) | Subestimado 12-30x |
| Metricas open source (COMET, UTMOS, emotion2vec+, ECAPA-TDNN, librosa) | No estimado | ~$0.00 (self-hosted) | Nuevo |
| GPU compute para modelos self-hosted | No estimado | ~$1-2 (A10G spot) | Nuevo |
| **Subtotal QA automatizado** | **~$1.20** | **~$6-13** | **Subestimado 5-10x** |
| Revision humana Tier 1 (Saul/Ivan, 5 idiomas) | No estimado | ~$40-50 (tiempo interno) | Nuevo |
| **TOTAL por episodio** | **~$1.20** | **~$46-63** | **Subestimado 40-50x** |

**Comparacion con revision humana completa:**

| Escenario | Costo/Episodio | Cobertura |
|:----------|:---------------|:----------|
| Solo QA automatizado | ~$6-13 | 27 idiomas, metricas objetivas (suficiente para Tier 3) |
| QA auto + humano Tier 1 (RECOMENDADO) | ~$46-63 | 27 idiomas auto + 5 idiomas revision humana |
| Revision humana completa (27 idiomas x nativo) | ~$5,400-8,100 | 27 idiomas, 2-4 semanas |
| Hibrido LLM + humano Tier 1 | ~$70-90 | Alta precision, < 1 dia |

**Ahorro neto:** El modelo recomendado ($46-63/episodio) representa un ahorro del ~97% respecto a revision humana completa. Costo anual estimado (52 episodios): ~$2,392-3,276 vs ~$280,800-421,200 con revision humana completa.

**Referencia industria:** Netflix gasta ~$100M/ano en calidad de doblaje y aun asi ~5% de segmentos requieren intervencion humana. QPH deberia presupuestar ~5% humano incluso con automatizacion completa.

---

### 7.6 Exit Criteria por Fase

Criterios de salida concretos y verificables para cada fase del roadmap, consolidando Addendum seccion 1.4 con ajustes del Mega Barrido:

| Fase | Exit Criteria (Evidencia Concreta) |
|:-----|:-----------------------------------|
| **Phase 0** | (1) Bug P0 corregido con test unitario pasando (`prescanner` nunca crashea en `None`). (2) Bug P1 corregido con test (`WERResult.language` refleja idioma real). (3) `dubbing_pipeline.py` y `dubbing_service.py` conectados con test de integracion. (4) UN episodio real procesado E2E sin intervencion manual. (5) `.gitignore` y `CLAUDE.md` creados. (6) Spike de API documentado: endpoints confirmados/rechazados. |
| **Phase 1** | (1) WER medido para al menos 5 idiomas Tier 1 con datos reales de 1 episodio. (2) `audit_service.py` operativo y orquestando los 4 Gates con tests. (3) COMET score > 0.85 en Tier 1 (EN master). (4) Zero Category A flags en episodio de prueba. (5) Endpoints de auditoria expuestos y documentados. (6) Forced Alignment integrado en `elevenlabs.py`. |
| **Phase 2** | (1) 27 blacklists JSON existentes y validadas (LLM draft + revision nativa para Tier 1). (2) Speaker detection accuracy > 90% en episodio de prueba (`validate_speakers.py` funcional). (3) Dubbing Resource API integrada: parcheo granular de segmentos confirmado. (4) Pronunciation Dictionaries cargados para los 5 personajes principales. |
| **Phase 3** | (1) 1 episodio procesado sin Web UI de ElevenLabs. (2) Batch de 3 episodios sin error. (3) Dashboard QA mostrando datos reales con semaforos por idioma. (4) Saul/Ivan capacitados (demo + feedback positivo documentado). (5) Guia de onboarding escrita. |
| **Phase 4** | (1) ROI por idioma calculado para ultimos 3 meses con datos reales de YouTube Analytics. (2) Tropicalizacion automatica con `cultural_matrix_global.json` inyectado en prompts de traduccion. (3) Kaizen loop produciendo mejoras medibles: FTR mejora > 10% respecto a Phase 3. (4) Decision D-005 (pausar idiomas de bajo ROI) tomada con datos. (5) Mem0 almacenando correcciones y aplicandolas automaticamente. |

---

## SECTION 8: SAFETY, BLACKLISTS Y COMPLIANCE

### 8.1 Estado Actual (Critico)

El estado actual de safety y content moderation en el proyecto Doge-MultiLang es **criticamente insuficiente** para un canal de contenido infantil (audiencia 8-15 anos) distribuido a 27 idiomas con 353 millones de visualizaciones anuales:

| Dimension | Estado Actual | Riesgo |
|:----------|:-------------|:-------|
| Blacklists existentes | 3 archivos JSON: `blacklist_global.json` (6 palabras), `blacklist_ar.json` (5 palabras), `blacklist_de.json` (2 palabras). **Total: 13 entradas** | **CRITICO** |
| Idiomas cubiertos | 3 de 27 (global + AR + DE). **24 idiomas con CERO blacklist** | **CRITICO** |
| Content Safety automatizado | **NO EXISTE.** Cero integracion con APIs de moderacion (Azure, Perspective, Scribe v2 entity detection) | **CRITICO** |
| Integracion en pipeline | `prescanner.py` (378L en AI-Studio) **NO lee los archivos blacklist** del repo Doge-MultiLang | **ALTO** |
| Directorio `by_language/` | Referenciado en `blacklist_global.json` como ruta de archivos por idioma. **El directorio NO EXISTE** | **MEDIO** |
| Diccionario cultural positivo | **NO EXISTE** -- solo se define "que no decir", nunca "que si decir" | **ALTO** |
| Regulaciones documentadas | **CERO referencia** a COPPA, AVMSD, NRTA, KCSC en el repo | **ALTO** |
| Riesgo regulatorio inmediato | COPPA (EEUU), AVMSD (UE), KCSC (Corea), NRTA (China) | **CRITICO** |

**Contexto critico:** QPH publica contenido para ninos de 8-15 anos sin revision humana en 26 de 27 idiomas. Una alucinacion del modelo TTS que genere lenguaje vulgar, o un error de traduccion culturalmente ofensivo en un idioma que nadie del equipo domina, llega a millones de ninos sin filtro alguno.

**Hallazgo del Addendum:** La moderacion AI es hasta un 30% MENOS precisa en idiomas de bajos recursos (coreano, malayo, filipino, tamil) -- exactamente los idiomas Tier 3 de QPH. Paradojicamente, Tier 3 necesita MAS chequeo de safety, no menos.

---

### 8.2 Framework de Safety Escalonado

El framework consolida las recomendaciones de todos los documentos de debate en una arquitectura de 5 capas defensivas que operan en secuencia. Principio rector: defensa en profundidad. Ninguna capa unica es suficiente; el poder esta en la combinacion.

#### Capa 1: ElevenLabs `use_profanity_filter` (BETA, gratuito)

- **Endpoint:** `POST /v1/dubbing` con parametro `use_profanity_filter: true`
- **Funcion:** Censura profanidades en transcripciones con `[censored]`. Nativo de ElevenLabs, sin configuracion adicional.
- **Limitacion:** Solo opera sobre transcripcion interna de ElevenLabs, no sobre traducciones externas. Es una primera linea de defensa, no un sistema completo.
- **Prioridad:** **P0 -- activar inmediatamente.** Cero costo, cero esfuerzo. No hay razon para no tenerlo activo.

#### Capa 2: ElevenLabs Scribe v2 entity detection (gratuito)

- **Endpoint:** `POST /v1/speech-to-text` con `model_id: "scribe_v2"` y `entity_detection: "offensive_language"`
- **Funcion:** 56 tipos de entidades detectadas con posiciones exactas (`start_char`, `end_char`). Categorias: `pii`, `phi`, `pci`, `offensive_language`, `other`. Soporta 90+ idiomas.
- **Uso para QPH:** Post-generacion: los audios sintetizados en 27 idiomas se transcriben con Scribe v2. Si `offensive_language` detecta entidades con severity > 0, el audio se bloquea antes de publicacion.
- **Prioridad:** **P0 -- usar en auditoria post-generacion (Gate 4).** Incluido en plan Pro.

#### Capa 3: Blacklists por idioma (27 archivos JSON)

- **Ubicacion:** `knowledgebase/blacklists/blacklist_{lang}.json`
- **Funcion:** Lista curada de terminos inaceptables por idioma, con regex patterns, categorias de severidad, y sugerencias de reemplazo.
- **Operacion:** `prescanner.py` DEBE leer estos archivos y aplicar regex patterns contra cada linea del guion parseado ANTES de enviar a ElevenLabs.
- **Plan de generacion de las 24 blacklists faltantes:**

| Paso | Accion | Tiempo | Responsable |
|:-----|:-------|:-------|:------------|
| 1 | LLM genera draft de 50-100 terminos por idioma usando contexto infantil (8-15 anos) | 4h (automatizado) | Daniel |
| 2 | Revision por hablante nativo (freelancer o contacto interno) | 1-2h por idioma | Nativos |
| 3 | Validacion cruzada: segundo LLM verifica que no haya falsos positivos | 2h (automatizado) | Daniel |
| 4 | Merge a repo con campo `validated: true/false` | 1h | Daniel |
| **Total** | | **2-3 dias** para 24 idiomas | |

- **Prioridad:** **P1 -- completar en Phase 2 del roadmap.**

#### Capa 4: Azure AI Content Safety / Perspective API (complemento)

- **Azure AI Content Safety:** API corporativa calibrada para 100+ idiomas. Metricas de severidad para Odio, Violencia, Autolesion, Contenido Sexual. ~$0.001/request.
- **Google Perspective API:** Deteccion de toxicidad multilingue. Gratis hasta 1 QPS.
- **Uso para QPH:** Segunda opinion para contenido flaggeado por Capa 1-3. Especialmente util para idiomas Tier 2-3 donde las blacklists locales son menos exhaustivas y la moderacion AI tiene 30% menos precision.
- **Prioridad:** **P2 -- complemento opcional, activar para Tier 1 en Phase 2.**

#### Capa 5: LLM Safety Judge (para casos ambiguos)

- **Herramientas:** Claude Sonnet / GPT-4o via API.
- **Funcion:** Evaluar segmentos flaggeados por Capas 1-4 con contexto cultural completo. El LLM recibe: texto original ES + traduccion + idioma target + reglas culturales del PCD + contexto de la escena.
- **Categorizacion:** A (BLOQUEAR) / B (REVISAR) / C (ADVERTIR).
- **Costo:** ~$0.01-0.03/segmento.
- **Prioridad:** **P1 -- para casos ambiguos donde las capas automaticas no son concluyentes.**

**Regla de umbral para contenido infantil:** `severity > 0` en CUALQUIER capa = **BLOCK**. Tolerancia cero. El contenido se detiene hasta revision humana.

---

### 8.3 Categorias de Contenido

Sistema de categorizacion de severidad basado en el framework MQM adaptado para contenido infantil, consolidando todas las fuentes:

#### Cat. A -- Critical (25 puntos MQM)

- **Definicion:** Contenido que NUNCA debe aparecer en produccion infantil.
- **Accion:** **BLOQUEO automatico inmediato.** Pipeline se detiene. Requiere intervencion humana.
- **Ejemplos:**
  - Groserias/profanidad explicita en cualquier idioma
  - Violencia grafica (descripciones de dano fisico)
  - Contenido de autolesion (self-harm)
  - Contenido sexual o romantico
  - Insultos raciales/etnicos
  - Referencia a sustancias (drogas, alcohol)
  - Contenido haram en idiomas arabes (cerdo como insulto, deidades no islamicas)
  - Alucinacion TTS que produce lenguaje vulgar

#### Cat. B -- Major (5 puntos MQM)

- **Definicion:** Contenido potencialmente inapropiado que requiere juicio humano.
- **Accion:** **FLAG + revision humana.** Pipeline continua con advertencia visible.
- **Ejemplos:**
  - Referencias culturales sensibles (festividades religiosas, comida no halal)
  - Doble sentido en idioma target que no existe en ES original
  - Slang que podria ser ofensivo en ciertas regiones del idioma target
  - Uso de registro formal incorrecto (Sie en dialogo entre ninos)
  - Referencia a animales sagrados/haram en contexto negativo (vaca en HI, cerdo en AR)
  - Contenido que podria "inducir adiccion" segun regulacion NRTA (China)

#### Cat. C -- Minor (1 punto MQM)

- **Definicion:** Desviaciones de calidad que se registran pero no bloquean.
- **Accion:** **FLAG informativo.** Pipeline continua. Se registra para mejora continua (Kaizen/Mem0).
- **Ejemplos:**
  - Tono ligeramente inapropiado para la edad target
  - Formalidad incorrecta pero no ofensiva
  - Onomatopeya no adaptada (traduccion literal en vez de equivalente cultural)
  - Termino desaconsejado pero no ofensivo
  - Regionalismos que podrian confundir pero no ofender

**Umbral de aprobacion por Tier:**

| Tier | Puntos MQM maximos para APROBAR | Cat. A permitidas | Cat. B maximas |
|:-----|:--------------------------------|:------------------|:---------------|
| Tier 1 | 5 puntos total | 0 (zero tolerance) | 1 (requiere revision) |
| Tier 2 | 15 puntos total | 0 (zero tolerance) | 3 |
| Tier 3 | 25 puntos total | 0 (zero tolerance) | 5 |

---

### 8.4 Regulaciones por Mercado

Tabla consolidada del Addendum seccion 4.7, expandida con implicaciones concretas para QPH:

| Region | Regulacion | Requisito clave | Implicaciones para QPH |
|:-------|:-----------|:----------------|:-----------------------|
| **EEUU** | COPPA (Children's Online Privacy Protection Act, actualizado abril 2025) | Filtros de violencia, sustancias, datos de menores de 13. No recolectar datos de ninos sin consentimiento verificable | Activar `use_profanity_filter`. Asegurar que `entity_detection` no almacene PII de menores. Blacklist EN debe incluir terminologia de sustancias/violencia. Mayor mercado por revenue (~$124K) |
| **Union Europea** | AVMSD Art. 28b (Audiovisual Media Services Directive) | Proteger menores de contenido que perjudique desarrollo fisico, mental o moral. Plataformas responsables de moderacion | Blacklists de todos los idiomas EU (DE, FR, IT, ES, PT, NL, PL, RO) deben estar activas. Registro de formalidad apropiado por edad |
| **China** | NRTA (National Radio and Television Administration) + CAC "Modo Menor" (abril 2025) | Debe "promover valores socialistas". Limites estrictos de tiempo de visualizacion. Prohibido contenido que "induzca adiccion" | Blacklist ZH requiere revision especializada. Zero tolerance en referencias politicas/religiosas/territoriales. Contenido debe ser "positivo y edificante" |
| **Corea del Sur** | KCSC (Korea Communications Standards Commission) | Sistema de calificacion por edad. Estandares especificos de violencia y lenguaje para contenido juvenil | Blacklist KO debe alinearse con categorias KCSC. Registro de habla apropiado (haoche/haerache, nivel medio-informal) |
| **Japon** | BPO (Broadcasting Ethics & Program Improvement Organization) - autorregulacion | Basado en quejas. Protege libertad creativa pero con limites claros | Contenido animado tiene estandares especificos. Blacklist JA debe considerar contexto cultural de anime. Onomatopeyas son criticas (4,500 en JA) |
| **Medio Oriente** (AR, Golfo) | Consejos nacionales de medios + estandares islamicos | Contenido haram filtrado. Restricciones romanticas absolutas. Genero gramatical correcto | Blacklist AR es la mas sensible. Cero cerdo/khanzir. Cero contenido romantico. Validacion por hablante nativo OBLIGATORIA |
| **India** | CBFC guidelines + IT (Intermediary Guidelines) Rules 2021 | Proteccion de menores. No violencia grafica. Sensibilidad religiosa multi-fe | Blacklist HI debe cubrir sensibilidades multi-religiosas (hindu, musulman, sikh). Vaca = sagrada. Evitar referencias a castas |
| **Brasil** | ECA (Estatuto da Crianca e do Adolescente) + Classificacao Indicativa | Sistema de clasificacion por edad. Cero violencia, drogas, contenido sexual en contenido infantil | Blacklist PT-BR relativamente sencilla. Incluir regionalismos ofensivos. Usar `voce` como pronombre neutro |
| **Turquia** | RTUK (Radio and Television Supreme Council) | Estandares estrictos para contenido juvenil. Sensibilidad a contenido religioso y politico | Blacklist TR debe considerar sensibilidades seculares y religiosas. Registro `sen` (informal) entre ninos |
| **Indonesia** | KPI (Komisi Penyiaran Indonesia) | Estandares alineados con valores islamicos y Pancasila | Similar a Medio Oriente en sensibilidad religiosa. Registro `aku`/`kamu` informal. Blacklist ID: sensibilidades islamicas |
| **Rusia** | Roskomnadzor | Restricciones amplias de contenido para menores. Legislacion de "propaganda" aplicable | Blacklist RU conservadora. Registro `ty` informal. Revenue bajo ($6 directo, posiblemente mas via VPN desde US/DE) |

---

## SECTION 9: TROPICALIZACION Y ADAPTACION CULTURAL

### 9.1 Definicion: Tropicalizacion != Traduccion

La escala de adaptacion linguistica, de menor a mayor profundidad:

```
Traduccion < Localizacion < Transcreacion < TROPICALIZACION
(palabras)   (formato+UI)   (mensaje)       (cultura completa)
```

| Nivel | Que adapta | Ejemplo QPH |
|:------|:-----------|:------------|
| **Traduccion** | Palabras. Sustitucion lexica directa | "Hola amigos" --> "Hello friends" |
| **Localizacion** | Formato, UI, numeros, fechas, pronombres, formalidad | Cambiar `du` por `Sie` segun contexto. Adaptar formatos de fecha |
| **Transcreacion** | El mensaje y la intencion, no las palabras | "Que padre!" --> "Sugoi!" (JA) en vez de traduccion literal "Nante otousan!" |
| **Tropicalizacion** | La cultura completa: humor, referencias, sensibilidades, onomatopeyas, registros de habla, comida, animales, festividades | Cambiar broccoli por pimiento verde para Japon (referencia Inside Out/Pixar). Cambiar "cerdo" por "sucio" en AR |

**QPH necesita:** Localizacion + Tropicalizacion selectiva.
- **Localizacion:** Adaptar pronombres, formalidad, formatos, registros de habla por idioma.
- **Tropicalizacion:** Adaptar humor, referencias culturales, sensibilidades religiosas/alimentarias, onomatopeyas.

**Referencia industria:** Disney/Pixar cambia broccoli por pimiento verde en "Inside Out" para Japon. Netflix gasta ~70% de su presupuesto de localizacion en doblaje y adaptacion cultural.

---

### 9.2 Diccionario Cultural Positivo (PCD)

Las blacklists dicen "que NO decir". El Positive Cultural Dictionary (PCD) dice "que SI decir" y "COMO decirlo". Este concepto fue propuesto originalmente en el Addendum y expandido por Gemini Deep Thinking.

**Archivo:** `knowledgebase/cultural_mappings/cultural_matrix_global.json`

**Estructura JSON:**

```json
{
  "schema_version": "1.0.0",
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
      "formality_register": "MANDATORY: Always use 'du'/'ihr'. 'Sie' is BANNED.",
      "slang_mapping": {
        "Que padre!": {"target": "Wie krass! / Wie cool!", "intent": "Innocent amazement"},
        "No manches!": {"target": "Echt jetzt?! / Krass!", "intent": "Disbelief/surprise"},
        "Guey": {"target": "Alter / Digga", "intent": "Casual peer address, child-safe"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Wau wau!", "cat_meow": "Miau!", "crying": "Baeaeaeh!",
        "explosion": "Bumm!", "laughter": "Haha!"
      }
    },
    "ja-JP": {
      "compliance_framework": "BPO_Japan",
      "formality_register": "MANDATORY: Casual speech (da/yo endings). Avoid Keigo between friends.",
      "honorifics_rules": {
        "male_peer": "-kun", "female_peer": "-chan",
        "small_animal": "-chan", "adult_authority": "-sensei/-san"
      },
      "slang_mapping": {
        "Que padre!": {"target": "Sugoi! / Yabai!", "intent": "Excited amazement"},
        "No manches!": {"target": "Uso! / Maji de?!", "intent": "Disbelief"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Wan wan!", "cat_meow": "Nyan!", "crying": "Uwaa!",
        "explosion": "Don!", "laughter": "Ahaha!"
      }
    },
    "ar-SA": {
      "compliance_framework": "National_Media_Council + Islamic standards",
      "cultural_sensitivities": {
        "animal_references": "NUNCA 'khanzir' (cerdo). Reemplazar con 'ghayr nazif' (sucio).",
        "religious_references": "Neutralizar toda referencia religiosa especifica.",
        "food_references": "Verificar que alimentos sean halal."
      },
      "slang_mapping": {
        "Que padre!": {"target": "Ya salaam!", "intent": "Amazement"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Haw haw!", "cat_meow": "Miyau!", "crying": "Waaa!",
        "explosion": "Buum!", "laughter": "Hahaha!"
      }
    },
    "ko-KR": {
      "compliance_framework": "KCSC",
      "formality_register": "Haoche/Haerache (nivel medio-informal de 7 niveles).",
      "slang_mapping": {
        "Que padre!": {"target": "Daebak!", "intent": "Amazement"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Meong meong!", "cat_meow": "Yaong!", "crying": "Heung heung!",
        "explosion": "Kwang!", "laughter": "Kkkk!"
      }
    },
    "hi-IN": {
      "compliance_framework": "CBFC_India",
      "formality_register": "'tum' (informal-medio). NUNCA 'aap' entre amigos ninos.",
      "cultural_sensitivities": {
        "animal_references": "Vaca = sagrada. Evitar referencias negativas.",
        "food_references": "Vegetarianismo prevalente. No asumir dieta carnivora."
      },
      "slang_mapping": {
        "Que padre!": {"target": "Zabardast! / Mast!", "intent": "Amazement"}
      },
      "onomatopoeias_override": {
        "dog_bark": "Bhau bhau!", "cat_meow": "Myaau!", "explosion": "Dhamaka!"
      }
    }
  }
}
```

**Categorias del PCD:**

1. **Comida:** Equivalentes culturales. Verificar halal (AR), vegetariano (HI), sin cerdo (AR, ID).
2. **Animales:** Cerdo = haram en AR/ID. Vaca = sagrada en HI. Perro puede ser negativo en ciertos contextos arabes.
3. **Modismos/slang:** Mapeos de expresiones mexicanas a equivalentes locales con contexto de intencion.
4. **Exclamaciones e interjecciones:** "Que padre!" a equivalentes por idioma (Sugoi, Daebak, Ya salaam, etc.).
5. **Onomatopeyas:** Tabla de lookup directa (ver seccion 9.4). Bypass del LLM cuando `is_onomatopoeia = true`.
6. **Neutralizacion religiosa/espiritual:** Remover o neutralizar referencias a deidades especificas. Cero festividades no islamicas en AR. Cero contenido politico en ZH.
7. **Humor:** Transcreacion, no traduccion. El chiste mexicano se adapta al equivalente cultural local preservando la intencion comica.

**Mecanismo de uso en el pipeline:**

1. **Gate 1 (Pre-flight):** El prescanner consulta el PCD para validar que modismos del guion ES tienen mapeo.
2. **Traduccion LLM:** El locale relevante se inyecta como System Prompt. El LLM no "adivina" el tono; recibe instrucciones explicitas.
3. **Onomatopeyas:** Si `is_onomatopoeia: true`, el pipeline puentea la inferencia del LLM y extrae el valor exacto de `onomatopoeias_override`. Reemplazo directo (`replace()` en JSON), no inferencia.
4. **Gate 3 (Multi-language):** Valida que la traduccion respeta reglas de formalidad y sensibilidades.
5. **Kaizen:** Correcciones descubiertas se integran como nuevas entradas en el PCD via Mem0.

---

### 9.3 Matriz de Pronombres y Formalidad

Tabla completa consolidando Addendum seccion 4.4, Gemini Deep Thinking (T-V distinction), y gold_standard_sections_8_9.

**Regla general:** Para contenido infantil (8-15 anos), SIEMPRE usar el registro informal entre personajes de la misma edad. El registro formal solo aparece cuando un nino habla con un adulto de autoridad.

| Idioma | Registro QPH (entre ninos) | Forma a USAR | Forma a EVITAR | Notas |
|:-------|:--------------------------|:-------------|:---------------|:------|
| **Aleman (DE)** | Informal | `du` (tu), `euch` (vosotros) | `Sie` (usted), `Ihnen` | Mezclar du/Sie en un mismo dialogo es discordante. Solo `Sie` para profesores/policias. DE = mercado x7.2 RPM, justifica revision humana |
| **Frances (FR)** | Informal | `tu` entre ninos, `on` coloquial | `vous` (usted formal) | `vous` solo para adultos de autoridad. `on` es comun en habla infantil |
| **Japones (JA)** | Casual / plain form | `~da`, `~yo`, `~ne`. `boku` (male) / `atashi` (female) | Keigo: `~desu`, `~masu`, `~gozaimasu`. `anata` | Preservar matices via patrones de habla (particulas, contracciones). Pronombres frecuentemente omitidos. Honorificos: `-kun` (male peer), `-chan` (female peer, animales) |
| **Coreano (KO)** | Haoche/haerache (medio-informal) | Nivel medio de 7 niveles de habla | Hapsyoche (formal alto) | 7 niveles de formalidad. Usar nivel medio-informal para pares. Pronombres frecuentemente omitidos |
| **Hindi (HI)** | Informal-medio | `tum` (tu informal-medio) | `aap` (usted formal), `tu` (muy informal/irrespetuoso) | 3 niveles: `tu` < `tum` < `aap`. `tum` es el correcto entre amigos ninos |
| **Indonesio (ID)** | Informal | `aku` (yo), `kamu` (tu) | `saya` (yo formal), `Anda` (usted) | `saya`/`Anda` demasiado formal. `aku`/`kamu` es registro natural infantil |
| **Arabe (AR)** | Informal | Formas verbales informales, genero gramatical correcto | Formas ultra-formales | Menos complejidad pronominal que lenguas asiaticas. Genero en sustantivos y verbos es critico |
| **Portugues BR (PT-BR)** | Informal | `voce` (neutro) | `o senhor`/`a senhora`, `tu` regional | `voce` funciona como neutro pan-brasileno. Evitar `tu` que varia por region |
| **Ruso (RU)** | Informal | `ty` (tu), formas singulares | `Vy` (usted), formas plurales corteses | `Vy` solo para adultos autoritarios (maestros, padres serios) |
| **Turco (TR)** | Informal | `sen` (tu), sufijos informales | `siz` (usted), sufijos formales | `siz` solo para adultos/figuras de respeto |
| **Chino Mandarin (ZH)** | Informal | `ni` (tu) | `nin` (usted) | `nin` solo para ancianos o figuras de gran respeto. Estructura gramatical cambia poco por formalidad |
| **Italiano (IT)** | Informal | `tu` entre ninos | `Lei` (usted formal) | `Lei` SOLO para adultos de autoridad |

---

### 9.4 Onomatopeyas: Tabla de Adaptacion

Los sonidos NO son universales entre culturas. Para contenido animado infantil, las onomatopeyas son frecuentes y su mala adaptacion rompe la inmersion. Consolidacion de Addendum seccion 4.5 + Gemini audits + gold_standard_sections_8_9.

**Top 20 onomatopeyas que QPH debe mapear:**

| Concepto | ES | EN | DE | JA | KO | AR | PT-BR | FR | RU | TR | HI | ID |
|:---------|:---|:---|:---|:---|:---|:---|:------|:---|:---|:---|:---|:---|
| **Perro** | guau guau | woof woof | wau wau | wan wan | meong meong | haw haw | au au | ouaf ouaf | gav gav | hav hav | bhau bhau | guk guk |
| **Gato** | miau | meow | miau | nyan | yaong | miyau | miau | miaou | myau | miyav | myaau | meong |
| **Explosion** | bum | boom | bumm | don | kwang | buum | bum | boum | bum | bum | dhamaka | bum |
| **Risa** | jajaja | hahaha | hahaha | ahaha | kkkk | hahaha | hahaha / kkk | hahaha | haha | hahaha | haha | wkwkwk |
| **Golpe** | pum | bam | peng | bashi | tak | bakh | pum | paf | bakh | - | - | - |
| **Sorpresa** | oh! | oh! | oh! | e! / ara! | heol! | ya! | oh! | oh la la! | oy! | - | - | - |
| **Dolor** | ay! | ouch! | au! / aua! | itai! | aya! | aakh! | ai! | aie! | oy! | - | - | - |
| **Llanto** | buaaa | waah | wah | uwaan | heung heung | waaa | buaaa | ouin ouin | uaa | vaa | waa | huaa |
| **Miedo** | ahhh | ahhh | ahhh | kyaa! | kkya! | ahhh | ahhh | aaah | aaa | - | - | - |
| **Asco** | guacala | eww | igitt | geh | euk | uff | eca | beurk | fu | - | - | - |
| **Aplauso** | clap clap | clap clap | klatsch | pachi pachi | jjak jjak | tasfiq | palmas | clap clap | - | - | - | - |
| **Estornudo** | achu | achoo | hatschi | hakushon | echi | atsa | atchim | atchoum | - | - | - | - |

**Nota sobre japones:** El japones tiene aproximadamente 4,500 onomatopeyas versus unas 1,200 en ingles. Incluye categorias como `giongo` (sonidos reales), `gitaigo` (condiciones/estados) y `gijougo` (emociones) que no tienen equivalente directo en idiomas occidentales. Es el idioma con mayor trabajo de adaptacion necesaria.

**Mecanismo de bypass programatico:** Cuando `dialogue_objects.json` marca `is_onomatopoeia: true`, el pipeline ejecuta un `replace()` directo desde la tabla `onomatopoeias_override` del PCD, SIN pasar por el LLM de traduccion. Esto evita traducciones literales absurdas y garantiza inmersion cultural.

---

### 9.5 Efecto Telefono Descompuesto: Mitigacion

El efecto telefono descompuesto es la amplificacion exponencial de errores cuando la cadena de traduccion pasa por un idioma intermedio (ES --> EN --> 26 idiomas). Cada error en el EN master se hereda por TODOS los idiomas downstream sin posibilidad de correccion retroactiva.

**Ejemplo real del problema:**

```
ES: "Que padre!" (cool, expresion de asombro positivo)
  --> EN: "What a father!" (ERROR: traduccion literal del modismo)
    --> DE: "Was fur ein Vater!" (error amplificado)
    --> JA: "Nante otousan!" (error amplificado)
    --> AR: "Ya lahu min ab!" (error amplificado)
    --> ... x 26 idiomas con el mismo error
```

**Flujo de mitigacion (5 capas defensivas):**

```
CAPA 1: GATE OBLIGATORIO EN ES --> EN (Gate 2)
  - COMET > 0.85 obligatorio
  - 3 jueces LLM evaluan la traduccion
  - Si COMET < 0.70, TODA la cadena downstream se bloquea
       |
CAPA 2: LLM COMPARA INTENCION (no solo palabras)
  - El LLM recibe el campo `intent` del ES original
  - Evalua: "la emocion/intencion se preservo en EN?"
  - Si la intencion NO se preservo --> BLOCK y re-traducir
       |
CAPA 3: DICCIONARIO CULTURAL POSITIVO (PCD)
  - Para modismos conocidos ("Que padre!", "No manches!", "Guey")
  - Mapeo directo a equivalentes por idioma
  - El LLM traductor recibe la sugerencia del PCD como System Prompt
       |
CAPA 4: PIVOTE ENRIQUECIDO (para Cluster C)
  - El EN master NO es un simple string de texto
  - Es un JSON con metadatos: intent, speaker_age, formality, max_syllables
  - El LLM al traducir a JA/KO/AR recibe contexto sociolinguistico completo
       |
CAPA 5: VALIDACION HUMANA 100% EN EN MASTER
  - Saul/Ivan revisan CADA linea del EN master
  - Si el EN master tiene errores, NO se procesan otros idiomas
  - Esta capa es la ultima barrera contra el telefono descompuesto
```

**Regla cardinal:** Si el EN master tiene un error semantico, NINGUN otro idioma se procesa. Gate 2 es BLOCKING.

---

### 9.6 Workflow de Guionismo Optimizado

Evolucion gradual en 3 fases, sintetizando gold_standard_sections_10_12 con las recomendaciones de Gemini Deep Thinking (erradicar .docx) y Sonnet (cuidar resistencia operativa de Andrea). Principio: No revolucion, evolucion. Andrea es una guionista creativa, no una ingeniera de datos.

#### Fase A: Fix parser (0 cambio para Andrea)

**Duracion:** Semana 1-2 | **Esfuerzo:** 6-8h | **Impacto en Andrea:** Ninguno

Andrea sigue escribiendo en Word exactamente como hoy. Los cambios son internos al pipeline:

- **Fix Bug P0:** Guard clause en `prescanner.py` para que nunca crashee en `None`. Test unitario obligatorio.
- **Fix Bug P1:** Propagacion correcta de `language` en `WERResult`.
- **Capa de validacion post-parse:** Nuevo modulo `parse_validator.py` que asigna un `confidence_score` (0.0-1.0) a cada campo extraido:
  - `confidence >= 0.85` --> campo aceptado automaticamente
  - `confidence 0.5-0.85` --> flag amarillo, confirmacion humana
  - `confidence < 0.5` --> flag rojo, intervencion manual
- **Output mejorado:** `dialogue_objects.json` incluye `_parse_confidence` por campo y `_ambiguous_lines[]`.

#### Fase B: Plantilla Word estructurada (Cambio Minimo)

**Duracion:** Semana 3-5 | **Esfuerzo:** 4-6h template + 3h parser update | **Impacto en Andrea:** Bajo

Andrea usa una plantilla `.docx` con campos obligatorios delimitados: `[ESCENA]`, `[PERSONAJE]`, `[EMOCION]`, `[LINEA]`, `[NOTAS_VISUALES]`, `[ONOMATOPEYA]`. El parser reconoce delimitadores en lugar de inferir estructura de lenguaje natural.

- Tasa de error del parser baja de ~15-20% (formato libre) a ~2-5% (semi-estructurado).
- `max_duration_ms` se calcula automaticamente desde timing de animacion.

#### Fase C: CMS/Notion (Maximo beneficio)

**Duracion:** Semana 8-12 | **Esfuerzo:** 16-20h setup + migracion | **Impacto en Andrea:** Medio-Alto

Andrea escribe directamente en campos tipados con dropdowns. El `.docx` y el parser desaparecen por completo.

| Campo en CMS/Notion | Tipo | Beneficio |
|:---------------------|:-----|:----------|
| `segment_id` | Formula auto-generada | Elimina errores de nomenclatura |
| `character_id` | Select dropdown (cerrado) | Imposible escribir variantes ("Michi_cat" vs "michi" vs "Michi") |
| `text_es` | Rich text | Andrea escribe libremente |
| `emotion_tag` | Select dropdown | Mapeo directo a `audio_tags` de Eleven v3 |
| `is_onomatopoeia` | Checkbox | Activa bypass de lookup table automatico |
| `visual_context` | Long text | Contexto inyectable como RAG al LLM traductor. Elimina ambiguedad en 27 idiomas |
| `max_duration_ms` | Number (auto-calculado) | Viene del timing de animacion |

**Beneficios cuantificables de Fase C:**
- **Cero crashes P0:** `prescanner.py` se vuelve obsoleto. Un script `fetch_script_db.py` descarga JSON inmaculado via API de Notion.
- **Linter en tiempo real:** Si Andrea escribe 20 silabas pero la escena dura 3.2 segundos, el sistema rechaza y exige acortar. Error corregido en la mente de la creadora, no quemando creditos de API.
- **Inyeccion RAG de contexto visual:** `visual_context` se pasa como system instructions al LLM. Desambigua "pelota" (futbol vs canica) en 27 idiomas.
- **Export directo a JSON:** 0% error de parsing, 100% campos tipados y validados.

**Riesgo de gestion de cambio:** Si la nueva interfaz anade un 20% de friccion a la chispa creativa de Andrea, la transicion fracasara. La Fase C solo se ejecuta si Andrea valida un prototipo en sesion de prueba. No se impone.
