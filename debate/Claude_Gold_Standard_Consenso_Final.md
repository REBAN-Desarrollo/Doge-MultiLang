# Claude Gold Standard - Consenso Final (2026-02-20)

| Campo | Valor |
|:------|:------|
| Fecha | 2026-02-20 |
| Autor | Claude Opus 4.6 (4 agentes especializados) |
| Estado | **CANONICO** (latest) |
| Metodo | 4 agentes paralelos (Consensus Arbiter, Architecture Synthesizer, Operations & Safety, Roadmap & Risk) sintetizando 10 documentos de debate + gold_standard_workflow + 5 docs de gold_standard_sections |
| Reemplaza | Todos los documentos previos de debate (ver Seccion 14: Linaje Documental) |
| Fuentes primarias | Claude Pipeline Debate, Mega Propuesta Final, Codex Gold Standard Unificado, Gemini 3.1 PRO Deep Audit, Gemini Deep Thinking Deep Audit, Sonnet Devil's Advocate Critique, Claude Addendum Deep Research, Gaps Pendientes Deep Research, MEGA BARRIDO Multi-Agente 10 Agentes, Propuesta Equipo No Tecnica |

---

## Tabla de Contenidos

1. [Resumen Ejecutivo Consensuado](#seccion-1)
2. [Matriz de Consenso / Disenso Completa](#seccion-2)
3. [Estado Real del Sistema](#seccion-3)
4. [Arquitectura Target (Consenso Final)](#seccion-4)
5. [Estrategia ElevenLabs API (Febrero 2026)](#seccion-5)
6. [Cadena de Traduccion Optimizada (DTR)](#seccion-6)
7. [Sistema de QA (4 Gates + Tiering)](#seccion-7)
8. [Safety, Blacklists y Compliance](#seccion-8)
9. [Tropicalizacion y Adaptacion Cultural](#seccion-9)
10. [Roadmap de Implementacion (Consenso)](#seccion-10)
11. [Registro de Riesgos y Supuestos](#seccion-11)
12. [Decisiones Pendientes](#seccion-12)
13. [Objetivos SMART y Metricas](#seccion-13)
14. [Linaje Documental](#seccion-14)
15. [Apendices A-E](#apendices)

---

<a id="seccion-1"></a>
## 1. RESUMEN EJECUTIVO CONSENSUADO

### 1.1 Planteamiento del Problema (verificado por todas las fuentes)

QuePerroHilo (QPH) produce contenido animado infantil (audiencia 8-15 anos) que se dobla a 27 idiomas usando ElevenLabs. El proceso actual adolece de **cero metricas de calidad**, **cero automatizacion de QA**, y **confianza ciega en 26 de 27 idiomas** (solo ingles se revisa manualmente por Saul/Ivan). Con 353 millones de visualizaciones anuales y aproximadamente $330K USD de revenue, el canal opera un modelo de "publicar y rezar" que expone a la marca a riesgos regulatorios (contenido infantil en 27 idiomas sin moderacion), perdida de audiencia (AVD cae hasta -58% en Tamil, -49% en CJK), e ineficiencia financiera (idiomas Tier 3 con ROI negativo siguen activos sin datos que lo justifiquen).

AI-Studio ya tiene Phase 1 (Pre-produccion) y Phase 2 (Produccion) parcialmente implementadas (~3,000 lineas de codigo reportadas por agentes), pero este codigo **nunca ha sido validado en produccion** (PR #71 lleva 14+ meses sin merge). Solo falta Phase 3: QA Automation -- pero la premisa de que el codigo existente "funciona" es una hipotesis con confianza baja (~30%) hasta que se ejecute un test E2E real.

### 1.2 Top 5 Hallazgos con Consenso Unanime o Cuasi-Unanime

| # | Hallazgo | Fuentes que lo confirman |
|:--|:---------|:------------------------|
| **H1** | **API-first, GUI como fallback.** El pipeline debe operar via API de ElevenLabs; la Web UI es para excepciones, no flujo principal. | Claude Pipeline, Mega Propuesta, Codex GS-03, Gemini 3.1 PRO, Gemini Deep Thinking, Mega Barrido, Propuesta No Tecnica |
| **H2** | **Cero metricas de calidad actualmente.** No se mide WER, COMET, MOS, timing drift, speaker consistency ni ningun KPI de calidad en 26 de 27 idiomas. Esto es insostenible para contenido infantil. | Claude Pipeline, Sonnet Devil's Advocate, Codex, Gemini 3.1 PRO, Gemini Deep Thinking, Mega Barrido, Gaps Pendientes, Propuesta No Tecnica |
| **H3** | **Blacklists insuficientes (3 de 27 idiomas).** Solo existen blacklists para AR, DE y una global de 6 palabras. Faltan 24 idiomas, lo que representa riesgo regulatorio critico (COPPA, AVMSD, KCSC) para contenido infantil. | Claude Pipeline, Sonnet, Codex, Gemini 3.1 PRO, Gemini Deep Thinking, Mega Barrido, Propuesta No Tecnica |
| **H4** | **Piloto E2E obligatorio antes de escalar.** Ningun plan de implementacion debe ejecutarse sin verificar primero que el codigo existente funciona con un episodio real. "IMPLEMENTADO" en documentos no equivale a funcional en produccion. | Claude Pipeline, Sonnet, Codex, Gemini 3.1 PRO, Mega Barrido, Mega Propuesta |
| **H5** | **Manual Dub CSV NO es pilar permanente.** ElevenLabs marca el CSV como "experimental, production use strongly discouraged." El consenso es usar la Dubbing Resource API para control granular de segmentos. | Claude Pipeline, Sonnet, Codex, Gemini 3.1 PRO, Mega Barrido, Mega Propuesta |

### 1.3 Top 5 Acciones Recomendadas con Consenso

| # | Accion | Fuentes que la respaldan |
|:--|:-------|:------------------------|
| **A1** | **Verificar estado real de AI-Studio y PR #71** con un test E2E usando un episodio real, antes de escribir una sola linea de codigo nuevo. | Claude Pipeline, Sonnet, Codex, Gemini 3.1 PRO, Gemini Deep Thinking, Mega Barrido, Mega Propuesta |
| **A2** | **Implementar QA automatizado** basado en WER + metricas de calidad (COMET/xCOMET, UTMOS, timing drift) con tiering por idioma. | Claude Pipeline, Addendum, Codex, Gemini 3.1 PRO, Gemini Deep Thinking, Mega Propuesta, Propuesta No Tecnica |
| **A3** | **Crear blacklists para los 27 idiomas** usando LLM para draft + validacion por hablantes nativos. Complementar con Scribe v2 entity detection + Azure/Perspective API. | Claude Pipeline, Addendum, Codex, Gemini 3.1 PRO, Gemini Deep Thinking, Mega Propuesta, Propuesta No Tecnica |
| **A4** | **Adoptar Dubbing Resource API** para control granular por segmento (patch atomico), junto con Forced Alignment API y Pronunciation Dictionaries. | Claude Pipeline, Addendum, Codex, Gemini 3.1 PRO, Gemini Deep Thinking, Mega Barrido, Mega Propuesta |
| **A5** | **Obtener y analizar datos de ROI por idioma** cruzando YouTube Analytics con costos de produccion, para decidir que idiomas mantener, pausar o priorizar. | Sonnet, Gaps Pendientes, Gemini Deep Thinking, Mega Propuesta, Propuesta No Tecnica |

### 1.4 Datos Financieros Clave (de Gaps_Pendientes_Deep_Research)

**Revenue por mercado principal (YouTube Analytics 2025):**

| Pais | Revenue USD | Views | Idioma dominante | RPM relativo |
|:-----|:-----------|:------|:-----------------|:-------------|
| US | $123,633 | 23.1M | en | Baseline alto |
| MX | $66,410 | 81.0M | es | Baseline |
| BR | $18,616 | 36.8M | pt | Medio |
| DE | $12,853 | 3.1M | de | **x7.2 (premium)** |
| IT | $10,631 | 4.9M | it | Alto |

**AVD (Average View Duration) por cluster de idiomas:**

| Cluster | AVD | Delta vs ES (4:41) |
|:--------|:----|:-------------------|
| Original (ES) | 4:41 | baseline |
| Europeos (DE, FR, IT) | ~3:37 | -22% a -24% |
| PT-BR | 3:49 | -18% |
| EN (master) | 3:04 | -35% |
| CJK (JA, KO, ZH) | ~2:24 | -49% |
| Tamil | 1:58 | -58% |

**Costo de QA por episodio (estimaciones corregidas):**

| Escenario | Costo/Episodio |
|:----------|:---------------|
| Estimacion original del master plan | ~$1.20 (descartado, confianza 35%) |
| Estimacion corregida con 4 Gates completos (Addendum) | **~$46-63** |
| Revision humana completa (27 idiomas) | $5,400 - $8,100 |
| **Ahorro de la solucion propuesta vs full humano** | **~97%** |

**Idiomas candidatos a pausar (ROI negativo o marginal):**
- Tamil: 30K views, ~$10 revenue, AVD 1:58
- Filipino: 46K views, ~$50 revenue, AVD 2:24
- Chino/Mandarin: 65K views, ~$140 revenue, AVD 2:24
- Coreano: 629K views, ~$611 revenue, AVD 2:27

---

<a id="seccion-2"></a>
## 2. MATRIZ DE CONSENSO / DISENSO COMPLETA

### 2.1 Consensos Unanimes (TODAS las fuentes coinciden)

| # | Tema | Consenso |
|:--|:-----|:---------|
| CU-01 | API-first, GUI como fallback | La Web UI de ElevenLabs es para excepciones. El flujo principal debe ser via API. |
| CU-02 | Se necesita WER automatizado | Actualmente no se mide WER en ningun idioma. Implementar medicion es prerrequisito para cualquier mejora. |
| CU-03 | Manual Dub CSV NO es pilar unico | CSV es experimental; usar Dubbing Resource API para control granular. |
| CU-04 | Blacklists actuales insuficientes | 3 de 27 idiomas con blacklist es negligencia regulatoria para contenido infantil. |
| CU-05 | Piloto E2E obligatorio antes de escalar | Ningun codigo nuevo sin verificar lo existente con un episodio real. |
| CU-06 | Pipeline vive en AI-Studio, no en Doge-MultiLang | Doge-MultiLang = config + docs + blacklists. El runtime vive en AI-Studio. |
| CU-07 | `auto_assign_voices` es parametro fantasma | No existe en la API de ElevenLabs. Fue alucinado. No usar. |
| CU-08 | `from_content_json` bloqueado en plan Pro | Requiere contactar ventas/upgrade a Enterprise. No asumir disponibilidad. |
| CU-09 | El "Guion Zombie" es un problema real | Fernando altera tiempos en post-produccion; el docx/JSON original queda desfasado. |
| CU-10 | Tiering de idiomas es necesario | No todos los idiomas merecen el mismo nivel de revision. Estratificacion por Tiers segun ROI/importancia. |

### 2.2 Consensos Mayoritarios (mayoria coincide, algunos disienten)

| # | Tema | Posicion mayoritaria | Disidentes | Arbitraje final |
|:--|:-----|:---------------------|:-----------|:----------------|
| CM-01 | **Cadena de traduccion ES->EN->Target** | Mayoria acepta ES->EN->Target como flujo actual viable. | Gemini 3.1 PRO y Deep Thinking proponen Dynamic Translation Routing: ES->Target directo para romances. | Adoptar como spike en Phase 1: Probar ES->PT-BR directo vs ES->EN->PT-BR con COMET scores (8h). |
| CM-02 | **Arquitectura QA: 4 Gates** | 4 Gates secuenciales (Pre-flight, EN Audit, Multi-idioma, Audio). | Gemini Deep Thinking: 4 Gates es waterfall bloqueante, inviable para 5 personas y 27 idiomas. | 4 Gates con tiering asincrono: Gates 1-2 blocking, Gates 3-4 async por idioma/tier. |
| CM-03 | **Guion SSOT: .docx de Andrea** | .docx como realidad operativa con docx_parser.py (435 lineas). | Ambos Gemini proponen CMS (Notion/Airtable) para eliminar parser. | Mantener .docx corto plazo (Phase 0-2), evaluar CMS en Phase 4. |
| CM-04 | **Costo de QA: $1.20 vs $46-63** | $1.20 es hipotesis no verificada. Addendum corrige a $46-63. | -- | **$46-63 adoptado.** $1.20 formalmente descartado. |
| CM-05 | **Blacklists: manual vs API safety** | Blacklists JSON manuales expandidas a 27 idiomas. | Gemini propone Azure/Perspective API como capa primaria. | Hibrido: Scribe v2 entity detection + blacklists JSON + evaluar Azure en Phase 2. |
| CM-06 | **Numero de idiomas: 16 vs 17 vs 27** | 27 operativo total. 17 con tiering. 16 en master plan. | Nadie defiende posicion especifica. | 27 es operativo total. 17 con tiering definido. Crear lista canonica unificada. |

### 2.3 Divergencias Resueltas

| # | Tema | Resolucion adoptada |
|:--|:-----|:--------------------|
| DR-01 | **Donde vive el pipeline** | **AI-Studio.** PRD_FINAL queda SUPERSEDED. Doge-MultiLang = hub de conocimiento. |
| DR-02 | **PR #71: funcional vs stale** | Tratar como hipotesis hasta E2E test. Confianza: ~30%. Verificar Dia 1. |
| DR-03 | **alignment_engine.py: existe vs fantasma** | Existe con confianza media (60%). Requiere test funcional. Forced Alignment API es alternativa nativa. |
| DR-04 | **Re-Alignment: custom vs Forced Alignment API** | Ambos complementarios: FA API como primaria, alignment_engine como fallback para fuzzy match. |
| DR-05 | **STT: siempre dual vs por excepcion** | Scribe v2 como STT primario (gratis). Gemini/Deepgram solo por excepcion (WER > umbral). |
| DR-06 | **Dos planes incompatibles coexisten** | PRD_FINAL formalmente SUPERSEDED. Mega Propuesta Final es documento rector. |
| DR-07 | **Evaluacion de proveedor ElevenLabs** | No cambiar en MVP. Benchmark anual programado Q2 2026 para Tier 3. |

### 2.4 Divergencias Abiertas (requieren datos)

| # | Tema | Accion para resolver |
|:--|:-----|:---------------------|
| DA-01 | Fernando puede exportar stems por personaje? | Entrevista directa con Fernando (30 min). |
| DA-02 | Saul/Ivan quieren migrar a AI-Studio? | Demo de 1 hora con episodio real + feedback. |
| DA-03 | Whisper funciona bien en Tier 3 (Tamil, Malay, Filipino)? | Benchmark Whisper en 5 min de audio TA/MS/FIL (1 dia). |
| DA-04 | Traduccion directa ES->Target mejora calidad? | Spike de 8h: ES->PT-BR directo con COMET scores vs cadena actual. |
| DA-05 | Cuantos idiomas en MVP Phase 3? | Decidir despues de ROI por idioma (Phase 0, Semana 2). |
| DA-06 | AVD bajo en CJK: calidad TTS o factores culturales? | Benchmark MOS (UTMOS) por idioma en 1 episodio (8h). |

### 2.5 Contribuciones Unicas por Fuente

| Fuente | Insight unico | Status |
|:-------|:-------------|:-------|
| **Claude Pipeline Debate** | Descubrio AI-Studio ya tiene ~3,000 lineas Phase 1+2. Identifico gap critico: dubbing_pipeline.py desconectado de dubbing_service.py. Bugs P0/P1. | Adoptado (verificacion pendiente) |
| **Claude Mega Propuesta Final** | Sintetizo 4 perspectivas AI en matriz consenso/disenso. Roadmap 5 fases (175-224h). 22 asunciones con nivel de confianza. | Adoptado como documento rector |
| **Claude Addendum Deep Research** | Multi-LLM Translation Audit. Pipeline de audio (UTMOS, emotion2vec+, ECAPA-TDNN). Correccion QA $1.20 -> $46-63. Kaizen con Mem0. | Adoptado |
| **Sonnet Devil's Advocate** | PR #71 posiblemente stale 14 meses. Levantamientos NO validados (70-80%). Fuzzy match falla en ad-libs. 5 dias de verificacion antes de codigo. | Adoptado (advertencias = riesgos P0/P1) |
| **Codex Gold Standard Unificado** | GS-01 a GS-05 (SSOT 4 capas, nada lee docx crudo, API-first, re-mapping prohibido, trazabilidad). Matriz canonica de endpoints. | Adoptado (principios arquitectonicos) |
| **Gemini 3.1 PRO Deep Audit** | Traduccion Directa para romances. QA STT por excepcion. Respeto a herramientas del equipo. | Evaluando (spike adoptado) |
| **Gemini Deep Thinking Deep Audit** | Dynamic Translation Routing. String Length Expansion. Model Tiering financiero. Positive Cultural Dictionary con JSON. | Evaluando (DTR como spike, PCD adoptado) |
| **MEGA BARRIDO 10 Agentes** | Confirmo 0 llamadas HTTP a ElevenLabs en Doge-MultiLang. 5 contradicciones de endpoints. 7 smoke tests concretos. | Adoptado |
| **Gaps Pendientes Deep Research** | Datos reales YouTube Analytics 2025: AVD, revenue, ROI por idioma. Tamil/Filipino/ZH con retorno negativo. | Adoptado (datos criticos) |
| **Propuesta Equipo No Tecnica** | RACI completo. Plan de contingencia. 8 decisiones con opciones/deadlines. Ejemplo paso-a-paso. 7 Objetivos SMART. | Adoptado (comunicacion equipo) |

---

<a id="seccion-3"></a>
## 3. ESTADO REAL DEL SISTEMA

### 3.1 Codigo Existente en AI-Studio (verificado)

| Componente | Archivo real | Lineas | Status | Notas |
|:-----------|:-------------|:-------|:-------|:------|
| Script Parser (docx) | `services/process/docx_parser.py` | 435 | Phase 1 - IMPLEMENTADO | 3 modos de parsing. Sanitizador integrado. Metodo `to_elevenlabs_content_json()`. |
| Modelos Pydantic | `models_dubbing.py` | 125 | Phase 1 - IMPLEMENTADO | Schemas de datos para dubbing. |
| Rutas API REST | `api/v1/creative/dubbing_routes.py` | 129 | Phase 2 - IMPLEMENTADO | 11 endpoints REST funcionales. |
| Servicio Dubbing | `dubbing_service.py` | 304 | Phase 2 - IMPLEMENTADO | Logica de negocio completa: CRUD proyectos, idiomas, callbacks. |
| Cliente ElevenLabs | `services/model_gateway/providers/elevenlabs.py` | 880 | Phase 2 - IMPLEMENTADO | Wrapper async completo. Basado en API dic 2024 -- NO tiene Dubbing Resource API, Forced Alignment ni Scribe v2. |
| Alignment Engine | `services/process/alignment_engine.py` | 120 | Phase 2 - IMPLEMENTADO | Fuzzy match Whisper-to-Manifest. SI EXISTE (resolviendo contradiccion del master plan). |
| Frontend Dubbing | `apps/studio/src/app/dubbing/` | 14 componentes React | Phase 2 - IMPLEMENTADO | 4 modos: Video, Script, Manual, Smart. |
| Pipeline ERP | `services/creative/content_erp/dubbing_pipeline.py` | 284 | Phase 2.5 - PARCIAL, DESCONECTADO | WER real (dynamic programming, Levenshtein). Cost estimation. Pre-scanner hook. |
| Pre-scanner | `services/creative/content_erp/prescanner.py` | 378 | Phase 2.5 - PARCIAL, DESCONECTADO | Heuristicas locales + LLM scan via Gemini Flash. Anti-prompt-injection. |
| Tests unitarios | `test_dubbing_pipeline.py` | ~30 tests | Phase 2.5 - PARCIAL | Cobertura del pipeline ERP. No cubre integracion con API layer. |

**Total codigo existente: ~2,675 lineas en 7 archivos backend + 14 componentes frontend + 30 tests unitarios.**

### 3.2 WARNING: "Implementado" != Funcional

#### Evidencia A FAVOR de funcionalidad
- Los archivos existen con las lineas reportadas. `docx_parser.py` tiene 3 modos funcionales.
- `elevenlabs.py` es wrapper async de 880 lineas.
- `dubbing_pipeline.py` tiene WER computation REAL y 30 tests unitarios.

#### Evidencia EN CONTRA de funcionalidad
1. **PR #71 lleva 14 meses sin merge.** Si fuera funcional, estaria mergeado.
2. **Saul e Ivan siguen usando la Web UI de ElevenLabs directamente.**
3. **Cero episodios reales procesados** por el pipeline.
4. **La API de ElevenLabs cambio significativamente** entre dic 2024 y feb 2026. Faltan ~15 endpoints criticos.
5. **Confianza estimada en 60-70%** (lectura de codigo, no ejecucion).

#### Bugs P0 y P1 documentados

| Severidad | Bug | Fix estimado |
|:----------|:----|:-------------|
| **P0** | `run_prescanner_for_job()` crashea si `prescan_script()` retorna None | 1h |
| **P1** | `WERResult.language` siempre default a ES (metricas por idioma inservibles) | 30min |
| **Info** | `elevenlabs.py` no tiene Dubbing Resource API, Forced Alignment, Scribe v2 | 6h update |

#### Gap estructural: Pipeline desconectado de Service

```
  API Layer (Phase 2)                    ERP Layer (Phase 2.5)
  =====================                  =======================
  dubbing_routes.py (129L)               dubbing_pipeline.py (284L)
  dubbing_service.py (304L)              prescanner.py (378L)
  elevenlabs.py (880L)                   test_dubbing_pipeline.py
       |                                      |
       +------------- GAP CRITICO ------------+
                 NO SE CONECTAN
```

**Consecuencia:** WER computation, cost estimation, pre-scanning YA EXISTEN pero son INACCESIBLES desde el flujo principal. Son dos sistemas paralelos que nunca se comunican.

**Accion correctiva:** Crear adaptador con 3 funciones: `pre_scan_before_create()`, `compute_wer_after_generation()`, `estimate_cost()`. Esfuerzo: 8h.

### 3.3 Phase 3: Lo que NO EXISTE (debe construirse)

| Componente faltante | Funcion | Esfuerzo |
|:---------------------|:--------|:---------|
| `audit_service.py` | Orquestador QA central: Dual STT, WER, clasificacion, tiering | 10-14h |
| `validate_speakers.py` | Comparar pistas detectadas vs voice_manifest.json | 10-12h |
| Dashboard QA | Tablero Metabase con semaforo por idioma | 10-14h |
| 24 de 27 blacklists | Diccionarios de terminos prohibidos por idioma | 2-3 dias |
| Pronunciation Dictionaries | Reglas IPA por personaje por idioma via API | 3-4h |
| Dubbing Resource API (en elevenlabs.py) | Suite CRUD de segments | 8-10h |
| Forced Alignment integration | Timestamps por palabra post-dubbing | 3-4h |
| Content Safety layer | use_profanity_filter + Scribe v2 + LLM Judge | 4-6h |
| Tropicalizacion automatica | cultural_matrix_global.json con mappings culturales | 16-20h |
| Batch processing | Cola con rate limits, prioridad por tier | 8-10h |
| Metricas de naturalidad (MOS) | UTMOS para MOS score por segmento | 4h |

**Total Phase 3 estimado: 100-130h de desarrollo.**

### 3.4 Estado de Doge-MultiLang (este repo)

| Categoria | Cantidad | Descripcion |
|:----------|:---------|:------------|
| Documentacion | 70+ archivos | Levantamientos, planes, specs, debates |
| Knowledgebase ElevenLabs | 150+ archivos | Snapshot API actualizado a 2026-02-20 |
| Blacklists | 3 archivos JSON | global (6 palabras), AR (5), DE (2). Total: 13 entradas |
| Scripts/utilidades | 4 archivos | Ninguno es pipeline E2E |

**Rol definido (consenso):** Configuracion (blacklists, mappings, glossarios) + Documentacion + Scripts auxiliares + Knowledgebase. **NO contiene pipeline de runtime.**

---

<a id="seccion-4"></a>
## 4. ARQUITECTURA TARGET (CONSENSO FINAL)

### 4.1 Principios Arquitectonicos Adoptados

**GS-01: SSOT en 4 capas (Codex)**
`dialogue_objects.json` (texto), `voice_manifest.json` (casting), `timing_objects.json` (timing), `qa_report.json` (QA).

**GS-02: Nada downstream lee docx directo (Codex)**
El `.docx` se procesa UNA vez por `docx_parser.py`. Despues, todo consume JSON.

**GS-03: API-first, GUI-fallback (unanime)**
Pipeline primario es programatico via API. GUI es plan B.

**GS-04: Re-mapping manual prohibido (Codex)**
Sin `voice_manifest.json` valido, el pipeline SE BLOQUEA.

**GS-05: Trazabilidad obligatoria (Codex)**
Toda correccion queda en log: `heuristic | reconciled | manual_override`, con actor y razon.

**MP4 de Fernando = SSOT de audio**
El `.docx` esta "muerto" despues de la edicion de Fernando. El MP4 final es la UNICA fuente de verdad.

**ES->EN->Resto con modificaciones DTR**
- Cluster A (Romance): ES -> Target directo (PT, FR, IT, RO)
- Cluster B (Germanico): ES -> Target directo + revision (DE, NL, SV)
- Cluster C (Distante): ES -> EN (enriched JSON) -> Target

**Validacion por Tiers**

| Tier | Idiomas | Revenue | WER umbral | Revision humana | Modelo TTS |
|:-----|:--------|:--------|:-----------|:----------------|:-----------|
| **Tier 1** | ES, EN, PT-BR, DE, IT, FR | ~94% | < 5% | SI, 100% | Eleven v3 |
| **Tier 2** | AR, KO, JA, HI, ZH, RU, TR | ~4% | < 10% | Muestreo 30% | Eleven v3 / Flash v2.5 |
| **Tier 3** | ID, TH, VI, PL, UK, EL, TA, MS, FIL, SV, NL, RO + resto | ~2% | < 15% | Solo automatico | Flash v2.5 |

### 4.2 Diagrama de Flujo Completo (Pipeline E2E)

```
=== INGESTION (Fase 0) ===============================================

  .docx (Andrea)  +  manifest.json (Ramon)  +  MP4 Final (Fernando)
       |                    |                        |
       v                    v                        v
  docx_parser.py      voice_manifest         Whisper STT / Forced
  (435L, existe)      import                  Alignment API
       |                    |                        |
       v                    v                        v
  dialogue_objects     voice_manifest          timing real
  .json (SSOT #1)     .json (SSOT #2)         del MP4 final
       |                    |                        |
       +--------------------+------------------------+
                            |
                   alignment_engine.py (120L, existe)
                   fuzzy match guion <-> audio real
                            |
=== PRE-SCAN (Gate 1: Pre-Flight) ===================================
                            |
                   prescanner.py (378L, existe) +
                   blacklist JSONs (27 idiomas) +
                   cultural_matrix_global.json (PCD) +
                   ElevenLabs use_profanity_filter ($0) +
                   Scribe v2 entity_detection
                            |
              BLOCK? -------+------- PASS / WARN
              |                         |
        STOP: humano                    |
        debe resolver                   |
                                        |
=== TRADUCCION con DTR (Gate 2: EN Master Audit) ====================
                                        |
              [Dynamic Translation Router]
              |              |              |
         Cluster A      Cluster B      Cluster C
         (Romance)      (Germanico)    (Distante)
              |              |              |
         ES -> PT/FR    ES -> DE/NL    ES -> EN(enriched
         /IT/RO         /SV + revision  JSON) -> Target
         directo        humana (DE)
              |              |              |
              +--------------+--------------+
                             |
                   [Gate 2: EN Master Audit]
                   COMET > 0.85 + 3 LLM Judges +
                   Saul/Ivan revision 100%
                   SI EN FALLA: toda la cadena se detiene
                             |
                   [Gate 3: Multi-Language Audit]
                   Tier 1: COMET + Judges + humano 100%
                   Tier 2: COMET + GEMBA-MQM + muestreo 30%
                   Tier 3: chrF++ + blacklist + safety (auto)
                             |
=== TTS GENERATION (ElevenLabs) =====================================
                             |
              Audio Isolation + Pronunciation Dictionaries (.PLS)
              Model Tiering: Eleven v3 (Tier 1+2) / Flash v2.5 (Tier 3)
              Dubbing Resource API (segment CRUD)
                             |
=== QA VALIDATION (Gate 4: Audio Output) ============================
                             |
              Dual STT + Forced Alignment + Scribe v2
                             |
              audit_service.py (NUEVO)
              wer_calculator | timing_checker | mos_predictor
              emotion_matcher | speaker_verify | classifier
                             |
         HIGH CONF.     MEDIUM         LOW CONF.
         AUTO-APROBAR   MUESTREO       REVISION OBLIGATORIA
                             |
=== POST-PRODUCCION & SSOT RE-ALIGNMENT =============================
                             |
              Fernando mezcla -> MP4 final
              Forced Alignment API -> timing_objects.json actualizado
              SRTs exactos para YouTube
                             |
=== PUBLICACION ==================================================
              qa_report.json (SSOT #4) generado
              OUTPUT: audio.mp4 + qa_report.json + subtitulos.srt
```

### 4.3 Los 4 JSONs Canonicos (Codex SSOT)

**1. `dialogue_objects.json`** -- Text SSOT (productor: docx_parser.py)
Campos clave: `line_id`, `emotion`, `visual_context`, `max_duration_ms`, `is_onomatopoeia`.

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

**2. `voice_manifest.json`** -- Voice SSOT (productor: Ramon + Daniel)
Campos clave: `pronunciation_dictionary_id`, `voice_ids_by_lang`, `formality`.

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

**3. `timing_objects.json`** -- Timing SSOT (productor: audit_service + Forced Alignment)
Campos clave: `alignment_source`, `drift_ms`, `drift_pct`, `drift_source`.

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

**4. `qa_report.json`** -- QA SSOT (productor: audit_service)
Campos clave: `gates`, `mqm_total_points`, `tts_model_used`, `reviewed_by`, `verdict`.

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

---

<a id="seccion-5"></a>
## 5. ESTRATEGIA ELEVENLABS API (Febrero 2026)

### 5.1 APIs a USAR (16 endpoints)

| # | API | Endpoint | Metodo | Status | Esfuerzo |
|:--|:----|:---------|:-------|:-------|:---------|
| 1 | Dubbing Create | `/v1/dubbing` | POST | YA IMPLEMENTADO | 0h |
| 2 | Get Dubbing Resource | `/v1/dubbing/resource/{dubbing_id}` | GET | NO implementado | 2h |
| 3 | Create Segment | `/v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/segment` | POST | NO implementado | 1h |
| 4 | Update Segment | `/v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language}` | PATCH | NO implementado | 1h |
| 5 | Delete Segment | `/v1/dubbing/resource/{dubbing_id}/segment/{segment_id}` | DELETE | NO implementado | 0.5h |
| 6 | Transcribe Segments | `/v1/dubbing/resource/{dubbing_id}/transcribe` | POST | NO implementado | 1h |
| 7 | Translate Segments | `/v1/dubbing/resource/{dubbing_id}/translate` | POST | NO implementado | 1h |
| 8 | Dub Segments | `/v1/dubbing/resource/{dubbing_id}/dub` | POST | NO implementado | 1h |
| 9 | Render Project | `/v1/dubbing/resource/{dubbing_id}/render/{language}` | POST | NO implementado | 2h |
| 10 | Migrate Segments | `/v1/dubbing/resource/{dubbing_id}/migrate-segments` | POST | NO implementado | 1h |
| 11 | Get Similar Voices | `/v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/similar-voices` | GET | NO implementado | 0.5h |
| 12 | Forced Alignment | `/v1/forced-alignment` | POST | NO implementado | 3h |
| 13 | Speech-to-Text (Scribe v2) | `/v1/speech-to-text` | POST | PARCIAL | 2h |
| 14 | Pronunciation Dictionaries | `/v1/pronunciation-dictionaries/add-from-file` | POST | NO implementado | 3h |
| 15 | Audio Isolation | `/v1/audio-isolation` | POST | NO implementado | 2h |
| 16 | PVC Speaker Separation | `/v1/voices/pvc/{voice_id}/samples/{sample_id}/separate-speakers` | POST | NO implementado | 4h |

**Total esfuerzo de integracion API: ~25h**

### 5.2 APIs Descubiertas (no en debate previo)

| # | Capacidad | Impacto |
|:--|:----------|:--------|
| 1 | Render con tracks_zip / clips_zip / aaf | **ALTO** -- Fernando obtiene stems por speaker + AAF para DaVinci/ProTools |
| 2 | `use_profanity_filter` [BETA] | **ALTO** -- Safety GRATUITA ($0). Activar inmediatamente (P0) |
| 3 | STT Keyterm Prompting | **ALTO** -- Forzar reconocimiento de "Doge", "Michi", etc. |
| 4 | STT export a SRT/VTT | **MEDIO** -- Subtitulos automaticos como subproducto |
| 5 | PVC Speaker Separation | **ALTO** -- Separar speakers del audio de Fernando (hasta 9) |
| 6 | GET /v1/usage | **MEDIO** -- Monitoreo de costos en tiempo real |
| 7 | target_accent [Experimental] | **MEDIO** -- Control de acento (pt-br vs pt-pt) |
| 8 | Request Stitching | **MEDIO** -- Consistencia de prosodia entre segmentos editados |

### 5.3 APIs a NO USAR

| API | Razon |
|:----|:------|
| **Manual Dub CSV** | "experimental and production use is strongly discouraged" |
| **from_content_json** | Bloqueado en plan Pro |
| **Text-to-Dialogue v3** | Alpha con restricciones comerciales |
| **auto_assign_voices** | **NO EXISTE** (alucinado) |

### 5.4 Contradicciones de Endpoints

| # | Contradiccion | Status |
|:--|:-------------|:-------|
| 1 | `resource` vs `resources` | CERRADA: singular (`/resource/`) |
| 2 | `segment/{id}` vs `segment/{id}/{language}` | CERRADA: ruta completa con `{language}` |
| 3 | `audio-isolation` vs `audio-isolation/convert` | **ABIERTA**: smoke test #7 |
| 4 | `auto_assign_voices` | CERRADA: NO EXISTE |
| 5 | `from_content_json` disponibilidad | **ABIERTA**: requiere validacion con cuenta real |

### 5.5 Smoke Tests Prioritarios

| Orden | Endpoint | Criterio Go/No-Go |
|:------|:---------|:-------------------|
| 1 | `GET /v1/voices` | HTTP 200 y `voices[]` no vacio |
| 2 | `POST /v1/speech-to-text` (scribe_v2) | HTTP 200, texto coherente, entity_detection retorna categorias |
| 3 | `GET /v1/dubbing/resource/{id}` | HTTP 200 con `segments[]` (confirma ruta singular) |
| 4 | `POST .../migrate-segments` | Mutacion confirmada |
| 5 | `PATCH .../segment/{id}/{language}` | Patch aplica sin re-render total |
| 6 | `POST /v1/forced-alignment` | Alineacion valida con loss < 1.0 |
| 7 | `POST /v1/audio-isolation` (ambas variantes) | Go a ruta que responda 200 consistentemente |

**Tiempo estimado: 4-6 horas.**

---

<a id="seccion-6"></a>
## 6. CADENA DE TRADUCCION OPTIMIZADA (Dynamic Translation Routing)

### 6.1 Problema: Efecto Telefono Descompuesto

Cada error en ES->EN se multiplica x26 idiomas downstream sin contencion.

**Correlacion entre distancia linguistica y caida de AVD:**

| Cluster | AVD | Delta vs ES | Revenue % |
|:--------|:----|:------------|:----------|
| Original (ES) | 4:31 | baseline | 58% |
| Master (EN) | 3:04 | **-35%** | 24% |
| Romance (PT, FR, IT) | 3:40 | -22% | 11% |
| CJK (JA, KO, ZH) | 2:24 | **-49%** | ~0.6% |
| Tamil | 1:58 | **-58%** | <0.01% |

### 6.2 Dynamic Translation Routing (DTR)

| Cluster | Idiomas | Ruta | Metricas | Revision humana |
|:--------|:--------|:-----|:---------|:----------------|
| **A (Romance)** | PT-BR, FR, IT, RO | ES -> Target directo | xCOMET > 0.85 | No (solo Tier 1 por revenue) |
| **B (Germanico)** | DE, NL, SV | ES -> Target directo | xCOMET > 0.85 + GEMBA-MQM | SI obligatoria (DE) |
| **C (Distante)** | EN, JA, KO, ZH, AR, HI, TR, ID, TH, VI, TA, MS, FIL, RU, PL, UK, EL | ES -> EN(enriched JSON) -> Target | xCOMET + 3 LLM Judges / chrF++ | Por tiering |

**Schema del JSON enriquecido (Enriched Pivot para Cluster C):**

```json
{
  "line_id": "EP052_S04_L001",
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

### 6.3 String Length Expansion Control

| Familia | Idiomas | Factor vs ES | Accion |
|:--------|:--------|:-------------|:-------|
| Romance | PT, FR, IT, RO | 1.0-1.15x | Sin ajuste |
| Germanico | DE, NL, SV | 1.1-1.25x | Monitorear |
| CJK (silabas orales) | JA, KO, ZH | 1.2-1.4x | `max_target_syllables` obligatorio |
| Dravidico | TA | 1.3-1.5x | **Transcreacion obligatoria** |

**Regla:** Si `ratio > 1.3`, el sistema fuerza transcreacion/resumen antes de TTS.

### 6.4 Hipotesis a Validar con Piloto

| ID | Hipotesis | Esfuerzo |
|:---|:----------|:---------|
| H1 | ES->PT directo > ES->EN->PT (xCOMET >= 5 puntos mejor) | 4-8h |
| H2 | Caida AVD CJK tiene 3 causas cuantificables (TTS + expansion + cultura) | 16h |
| H3 | EN master mejora con enriched pivot JSON | 4h |
| H4 | Transcreacion forzada por `max_target_syllables` no degrada fidelidad | 4h |
| H5 | Calidad TTS varia significativamente por idioma (MOS benchmark) | 8h |
| H6 | ElevenLabs soporta dubbing ES->PT-BR directo | 1h |
| H7 | Flash v2.5 vs Eleven v3: diferencia en CJK | 4h |

---

<a id="seccion-7"></a>
## 7. SISTEMA DE QA (4 Gates + Tiering)

### 7.1 Arquitectura de 4 Gates (Consenso)

Gates 1-2 son **BLOCKING** (critical path). Gates 3-4 operan **ASYNC** por idioma/tier.

**Gate 1: Pre-Flight** -- Blacklists + safety pre-screening + timing estimation + expansion check. Sistema automatico, humano solo si BLOCK.

**Gate 2: EN Master Audit** -- COMET > 0.85 + 3 LLM Judges + GEMBA-MQM + Saul/Ivan 100%. Si EN falla, NINGUN otro idioma se procesa.

**Gate 3: Multi-Idioma** -- Validacion por tier: Tier 1 (COMET + Judges + humano 100%), Tier 2 (COMET + GEMBA-MQM + muestreo 30%), Tier 3 (chrF++ + blacklist auto). Cada idioma async e independiente.

**Gate 4: Audio Output** -- Dual STT + WER + MOS (UTMOS) + emocion (emotion2vec+) + timing drift (DTW + WhisperX) + speaker consistency (ECAPA-TDNN).

### 7.2 Tiering por Idioma

| Tier | Idiomas | WER | Revision | Revenue | TTS | Costo QA/ep |
|:-----|:--------|:----|:---------|:--------|:----|:------------|
| **1** | EN, PT-BR, DE, IT, FR | < 5% | 100% humana | ~94% | Eleven v3 | ~$46-63 |
| **2** | AR, KO, JA, HI, ZH | < 10% | Muestreo 30% | ~4% | Eleven v3 | ~$3-6 |
| **3** | Resto | < 15% | Solo auto | ~2% | Flash v2.5 | ~$1-3 |

### 7.3 Herramientas Recomendadas (Stack)

**P0 (inmediato):** COMET/xCOMET-XL, GEMBA-MQM, Whisper large-v3, Scribe v2, Claude Sonnet, GPT-4o.
**P1 (Phase 1-2):** Deepgram Nova-3, SenseVoice, UTMOS, emotion2vec+, librosa, WhisperX, chrF++, Gemini Flash.
**P2 (Phase 3+):** ECAPA-TDNN, Mem0, Metabase, Azure Content Safety, Perspective API.

### 7.4 Costo Real de QA (Corregido)

| Escenario | Costo/Episodio |
|:----------|:---------------|
| Solo QA automatizado | ~$6-13 |
| QA auto + humano Tier 1 (RECOMENDADO) | **~$46-63** |
| Revision humana completa 27 idiomas | ~$5,400-8,100 |
| **Ahorro neto** | **~97%** |

Costo anual estimado (52 episodios): ~$2,392-3,276.

---

<a id="seccion-8"></a>
## 8. SAFETY, BLACKLISTS Y COMPLIANCE

### 8.1 Estado Actual (Critico)

- **3 de 27** idiomas con blacklist. **Total: 13 entradas.**
- **Cero** content safety automatizado.
- **Cero** referencia a COPPA/AVMSD/NRTA/KCSC en el repo.
- QPH publica contenido para ninos 8-15 sin revision en 26/27 idiomas.

### 8.2 Framework de Safety Escalonado (5 capas)

1. **ElevenLabs `use_profanity_filter`** -- BETA, $0. P0: activar inmediatamente.
2. **Scribe v2 entity detection** -- 56 tipos, 90+ idiomas. P0: auditoria post-generacion.
3. **Blacklists por idioma** -- 27 JSONs curados. P1: completar en Phase 2.
4. **Azure/Perspective API** -- Segunda opinion. P2: complemento para Tier 1.
5. **LLM Safety Judge** -- Casos ambiguos. P1.

**Regla para contenido infantil:** `severity > 0` en CUALQUIER capa = **BLOCK**. Tolerancia cero.

### 8.3 Categorias de Contenido

| Categoria | MQM pts | Accion |
|:----------|:--------|:-------|
| **Cat. A -- Critical** | 25 | BLOQUEO automatico inmediato |
| **Cat. B -- Major** | 5 | FLAG + revision humana |
| **Cat. C -- Minor** | 1 | FLAG informativo |

**Cat. A permitidas: 0 en TODOS los tiers (zero tolerance).**

### 8.4 Regulaciones por Mercado

| Region | Regulacion | Implicacion clave para QPH |
|:-------|:-----------|:--------------------------|
| EEUU | COPPA | Activar profanity_filter, blacklist EN con sustancias/violencia |
| UE | AVMSD Art. 28b | Blacklists todos idiomas EU activas |
| China | NRTA + CAC | Zero tolerance politica/religion. Contenido "positivo" |
| Corea | KCSC | Blacklist KO alineada con categorias KCSC |
| Japon | BPO | Onomatopeyas criticas (4,500 en JA) |
| Medio Oriente | Estandares islamicos | Cero cerdo/khanzir. Cero romantico. Validacion nativa obligatoria |
| India | CBFC | Multi-religioso. Vaca = sagrada. No asumir dieta carnivora |

---

<a id="seccion-9"></a>
## 9. TROPICALIZACION Y ADAPTACION CULTURAL

### 9.1 Escala de Adaptacion

```
Traduccion < Localizacion < Transcreacion < TROPICALIZACION
(palabras)   (formato+UI)   (mensaje)       (cultura completa)
```

QPH necesita: **Localizacion + Tropicalizacion selectiva.**

### 9.2 Diccionario Cultural Positivo (PCD)

Archivo: `knowledgebase/cultural_mappings/cultural_matrix_global.json`

7 categorias: comida, animales, modismos, exclamaciones, onomatopeyas, neutralizacion religiosa, humor.

**Mecanismo en pipeline:**
1. Gate 1: prescanner consulta PCD para validar mapeos
2. Traduccion: locale inyectado como System Prompt
3. Onomatopeyas: bypass LLM con `replace()` directo si `is_onomatopoeia: true`
4. Gate 3: valida formalidad y sensibilidades
5. Kaizen: correcciones se integran via Mem0

### 9.3 Matriz de Pronombres y Formalidad

**Regla general:** Registro informal entre personajes de la misma edad. Formal solo con adultos de autoridad.

| Idioma | Registro QPH | Usar | Evitar |
|:-------|:-------------|:-----|:-------|
| DE | Informal | `du` | `Sie` |
| FR | Informal | `tu`, `on` | `vous` |
| JA | Casual | `~da`, `~yo`, `boku`/`atashi` | Keigo |
| KO | Medio-informal | Haoche/haerache | Hapsyoche |
| HI | Informal-medio | `tum` | `aap`, `tu` (muy informal) |
| AR | Informal | Formas informales, genero correcto | Ultra-formales |
| PT-BR | Informal | `voce` | `o senhor`/`a senhora` |

### 9.4 Onomatopeyas: Top Adaptaciones

| Concepto | ES | EN | DE | JA | KO | AR |
|:---------|:---|:---|:---|:---|:---|:---|
| Perro | guau guau | woof woof | wau wau | wan wan | meong meong | haw haw |
| Gato | miau | meow | miau | nyan | yaong | miyau |
| Risa | jajaja | hahaha | hahaha | ahaha | kkkk | hahaha |
| Explosion | bum | boom | bumm | don | kwang | buum |
| Llanto | buaaa | waah | wah | uwaan | heung heung | waaa |
| Asco | guacala | eww | igitt | geh | euk | uff |

**Mecanismo:** Cuando `is_onomatopoeia: true`, bypass de LLM con lookup directo desde PCD.

---

<a id="seccion-10"></a>
## 10. ROADMAP DE IMPLEMENTACION (CONSENSO)

### 10.1 Semana 0: Verificacion (CERO codigo nuevo)

| Dia | Accion | Entregable |
|:----|:-------|:-----------|
| 1 | Verificar PR #71 en AI-Studio. Fix bugs P0/P1 con tests. | PR verificado. Bugs corregidos. Estado real documentado. |
| 2 | Spike API: probar 7 endpoints criticos con API key real. | Semaforo por endpoint: Verde/Amarillo/Rojo. |
| 3 | Entrevistas: 30 min Saul/Ivan + 30 min Fernando. | Confirmacion/negacion de supuestos S-03, S-04, S-07. |
| 4 | YouTube Analytics: AVD, revenue, ROI por idioma (12 meses). | Tabla ROI por idioma. Input para D-002 y D-005. |
| 5 | Decisiones D-001 a D-004. Limpiar repo. ADR cierra PRD_FINAL. | Decisiones documentadas. Repo limpio. |

### 10.2 Phase 0: Quick Wins (Semanas 1-2) -- 16h

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| 0.1 | Integrar dubbing_pipeline.py <-> dubbing_service.py (adaptador) | 8h |
| 0.2 | Agregar Dubbing Resource API a elevenlabs.py | 6h |
| 0.3 | CLAUDE.md, .gitignore, commitear archivos, limpiar repo | 2h |

### 10.3 Phase 1: QA Pipeline (Semanas 3-5) -- 34-46h

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| 1.1 | audit_service.py (orquestador QA, 4 Gates, tiering) | 10-14h |
| 1.2 | prompt_scanner.py (extension prescanner + blacklists + PCD) | 5h |
| 1.3 | whisper_client.py (Whisper + Deepgram dual) | 4h |
| 1.4 | wer_calculator.py (jiwer, normalizacion por idioma) | 2-3h |
| 1.5 | timing_checker.py (DTW via librosa, drift detection) | 2h |
| 1.6 | Forced Alignment integration | 3-4h |
| 1.7 | Endpoints de auditoria (4 nuevos en dubbing_routes.py) | 5h |
| 1.8 | Modelo SQL (audit_jobs + audit_results) | 3h |

### 10.4 Phase 2: Speaker Detection + Blacklists (Semanas 6-8) -- 31-38h

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| 2.1 | validate_speakers.py (ECAPA-TDNN, fuzzy match) | 10-12h |
| 2.2 | 24 blacklists faltantes (LLM draft + validacion nativa Tier 1) | 16-20h |
| 2.3 | Pronunciation Dictionaries (IPA por personaje via API) | 3-4h |
| 2.4 | Blacklists Tier 1 completas y validadas | 2 dias |

### 10.5 Phase 3: Automatizacion Completa (Semanas 9-12) -- 36-46h

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| 3.1 | Flujo E2E via API (27 idiomas sin Web UI) | 14-18h |
| 3.2 | Batch processing (cola, rate limits, prioridad por tier) | 8-10h |
| 3.3 | Dashboard QA (Metabase, semaforo por idioma) | 10-14h |
| 3.4 | Onboarding Saul/Ivan (guia + demo + periodo paralelo) | 4h |

### 10.6 Phase 4: Avanzado (Semanas 13+) -- 50-64h

ROI Dashboard, Tropicalizacion automatica, Analisis de audio avanzado (UTMOS, emotion2vec+), Kaizen loop (Mem0, PDCA, OVEJA).

### 10.7 Resumen

| Fase | Semanas | Horas |
|:-----|:--------|:------|
| Semana 0: Verificacion | 0 | 5 dias |
| Phase 0: Quick Wins | 1-2 | 16h |
| Phase 1: QA Pipeline | 3-5 | 34-46h |
| Phase 2: Speakers + Blacklists | 6-8 | 31-38h |
| Phase 3: Automatizacion | 9-12 | 36-46h |
| Phase 4: Avanzado | 13+ | 50-64h |
| **TOTAL** | | **~175-224h** |

### 10.8 Exit Criteria por Fase

| Fase | Exit Criteria (Evidencia Concreta) |
|:-----|:-----------------------------------|
| **Phase 0** | (1) Bug P0 fix con test unitario pasando, (2) Bug P1 fix con test, (3) pipeline.py y service.py conectados con test de integracion, (4) UN episodio real procesado E2E sin intervencion, (5) .gitignore y CLAUDE.md creados |
| **Phase 1** | (1) WER medido para 27 idiomas en 1 episodio, (2) audit_service.py con tests, (3) COMET score > 0.85 en Tier 1, (4) Zero Category A flags en episodio de prueba, (5) Endpoints de auditoria funcionando |
| **Phase 2** | (1) 27 blacklists existentes y validadas, (2) Speaker detection accuracy > 90% en episodio de prueba, (3) Dubbing Resource API integrada y probada, (4) validate_speakers.py con tests |
| **Phase 3** | (1) 1 episodio procesado sin Web UI, (2) Batch de 3 episodios sin error, (3) Dashboard QA mostrando datos reales, (4) Saul/Ivan capacitados (demo + feedback positivo) |
| **Phase 4** | (1) ROI por idioma calculado para ultimos 3 meses, (2) Tropicalizacion activa para Tier 1, (3) Kaizen loop produciendo mejoras medibles (FTR mejora >10%), (4) Decision D-005 (pausar idiomas) tomada con datos |

### 10.9 Lo que se Descarta Definitivamente

1. PRD_FINAL.md (18 scripts greenfield) -- SUPERSEDED
2. Crear docx_parser.py desde cero (ya existe, 435L)
3. Crear elevenlabs_api_client.py desde cero (ya existe, 880L)
4. Estimacion de 75h greenfield (real: 175-224h de integracion + QA)
5. Manual Dub CSV como solucion permanente
6. Asumir "IMPLEMENTADO" = funcional sin test E2E

### 10.10 No-Go (Bloqueos Duros)

1. No codificar contra endpoints conflictivos sin smoke test previo.
2. No asumir "implementado" en docs = funcional en produccion.
3. No lanzar 27 idiomas con blacklists 3/27.
4. No usar parametros no verificados (`auto_assign_voices`, `from_content_json`).
5. No mover runtime a Doge-MultiLang si depende de AI-Studio.

---

<a id="seccion-11"></a>
## 11. REGISTRO DE RIESGOS Y SUPUESTOS

### 11.1 Supuestos NO Verificados

| # | Supuesto | Confianza | Accion |
|:--|:---------|:----------|:-------|
| S-01 | Phase 1+2 en AI-Studio (PR #71) funciona | 30% | Verificar Dia 1 |
| S-02 | Costo QA ~$1.20/proyecto | 15% orig / 80% corregido | Adoptar $46-63 |
| S-03 | Saul/Ivan aceptan migrar a AI-Studio | 50% | Entrevista Dia 3 |
| S-04 | Fernando puede exportar stems por personaje | 20% | Entrevista Dia 3 |
| S-05 | Whisper WER < 5% en todos idiomas incl. CJK | 40% | Benchmark Semana 3 |
| S-06 | TTS ElevenLabs calidad consistente 27 idiomas | 50% | Benchmark MOS Semana 3 |
| S-07 | Levantamientos reflejan realidad | 70-80% | Validar Dia 3 |
| S-08 | `auto_assign_voices` existe | **DESMENTIDO** | Eliminado del plan |
| S-09 | Manual Dub CSV acepta timestamps esperados | 35% | Spike Dia 2 |
| S-10 | alignment_engine.py funcional | 25% | Verificar Dia 1 |

### 11.2 Riesgos Ordenados por Impacto

| # | Riesgo | Prob. | Impacto | Mitigacion |
|:--|:-------|:------|:--------|:-----------|
| R-01 | PR #71 stale/roto | ALTA | CRITICO | Verificar Dia 1. Si roto: D-001 |
| R-02 | Saul/Ivan rechazan migracion | MEDIA | ALTO | Demo Dia 3. Plan B: backend silencioso |
| R-03 | Fernando no exporta stems | ALTA | ALTO | Render API tracks_zip como alternativa |
| R-04 | API ElevenLabs cambio en 14 meses | ALTA | ALTO | Spike Dia 2, 7 smoke tests |
| R-05 | CJK Audio problemas no solucionables | MEDIA | ALTO | Diagnosticar con benchmarks MOS |
| R-06 | 9/13 pistas audio no automatizables | ALTA | MEDIO | Scope explicito: audit_service cubre Pistas 10-12 |
| R-07 | Costo estimado incorrecto ($1.20 vs $46-63) | CONFIRMADO | ALTO | Presentar ROI a Management |
| R-08 | Fuzzy match falla en ad-libs de Fernando | MEDIA | MEDIO | Flag "linea sin match" + Forced Alignment API |
| R-09 | Sin plan de rollback | MEDIA | MEDIO | Documentar procedimiento Web UI |
| R-10 | 27 idiomas sin datos ROI | MEDIA | MEDIO | YouTube Analytics Dia 4 |

### 11.3 Incertidumbres que Este Repo NO Puede Cerrar

1. Estado real ejecutable de AI-Studio / PR #71
2. Disponibilidad real por plan/cuenta de endpoints sensibles
3. Credenciales, rate limits y cuotas vigentes
4. ROI real por idioma con data viva
5. Calidad final por idioma sin pruebas sobre episodios reales

---

<a id="seccion-12"></a>
## 12. DECISIONES PENDIENTES

| # | Decision | Opciones | Deadline | Recomendacion |
|:--|:---------|:---------|:---------|:--------------|
| D-001 | Extender AI-Studio o rebuild? | A) Mergear PR #71. B) Fork. C) Solo Phase 3. D) Abandono. | Dia 5 | Depende de verificacion Dia 1 |
| D-002 | Idiomas en MVP? | A) 5 (Tier 1). B) 10 (Tier 1+2). C) 27. | Post ROI Dia 4 | **Opcion A: Tier 1** |
| D-003 | CSV vs Resource API? | A) CSV. B) Resource API. C) Hibrido. | Post spike Dia 2 | **Opcion B: Resource API** |
| D-004 | Separacion audio para QA? | A) Fernando stems. B) Re-Alignment. C) tracks_zip. D) B+C. | Post entrevista Dia 3 | **Opcion C: tracks_zip** |
| D-005 | Pausar idiomas bajo ROI? | A) Mantener 27. B) Pausar negativos. C) Degradar a auto. | Post datos ROI | Requiere datos |
| D-006 | Strictness de safety (Gate 1)? | A) Estricto. B) Moderado. C) Permisivo. | 3 de marzo | **Opcion B** |
| D-007 | Upgrade plan ElevenLabs? | A) Mantener Pro. B) Scale. C) Enterprise. | Post spike Dia 2 | Depende de limitaciones |
| D-008 | Timeline migracion guionismo? | A) Paralelo Phase 2. B) Post Phase 3. C) No migrar. | Post Phase 2 | **Opcion B** |

---

<a id="seccion-13"></a>
## 13. OBJETIVOS SMART Y METRICAS

### 13.1 Baseline y Metas 30/60/90 Dias

| Metrica | Hoy | 30 Dias | 60 Dias | 90 Dias |
|:--------|:----|:--------|:--------|:--------|
| Idiomas con revision | 1/27 | 5/27 | 10/27 | **27/27** |
| WER Tier 1 | Desconocido | Medido | < 8% | **< 5%** |
| Blacklists activas | 3/27 | 3/27 | 10/27 | **27/27** |
| FTR (First Time Right) | Desconocido | Medido | > 40% | **> 60%** |
| Cat. A publicado (Tier 1) | Desconocido | 0 | 0 | **0** |
| ROI por idioma calculado | 0 | 0 | 5 idiomas | **27 idiomas** |

### 13.2 Los 7 Objetivos SMART

| # | Objetivo | Deadline |
|:--|:---------|:---------|
| O1 | Medir calidad 27 idiomas (WER baseline) | Semana 3 |
| O2 | Zero Cat. A en Tier 1 | Semana 6 |
| O3 | 27 blacklists completas | Semana 6 |
| O4 | Dashboard QA funcional | Semana 10 |
| O5 | FTR > 60% | Semana 12 |
| O6 | ROI por idioma calculado | Semana 12 |
| O7 | Kaizen loop activo | Semana 16 |

### 13.3 KPIs de Mejora Continua (Kaizen)

| Metrica | Target | Frecuencia |
|:--------|:-------|:-----------|
| FTR | > 60% Phase 1, > 80% Phase 3 | Semanal |
| Error Recurrence Rate | < 20% | Mensual |
| CAPA Effectiveness | > 70% | Trimestral |
| Mean Corrections/Episode | Decreciente (-10%/mes) | Semanal |
| Cat. A Escape Rate | 0% (tolerancia cero) | Semanal |
| AVD Delta por idioma | Tendencia hacia 0% | Mensual |

**Reunion OVEJA (3 indicadores):**
1. Semaforo por idioma (Verde/Amarillo/Rojo)
2. FTR de la semana
3. Tendencia (Mejorando/Estancado/Empeorando)

---

<a id="seccion-14"></a>
## 14. LINAJE DOCUMENTAL

### 14.1 Documentos Absorbidos por Este Consenso Final

| Documento | Autor | Fecha | Status nuevo |
|:----------|:------|:------|:-------------|
| `debate/Claude_Pipeline_Debate.md` | Claude (v1-v3) | 2025-12 a 2026-02 | **ELIMINADO** -- hallazgos en Secciones 1-3, checklist 13 pistas en Apendice A |
| `debate/Claude_Mega_Propuesta_Final.md` | Claude Opus | 2026-02-19 | **ELIMINADO** -- roadmap y decisiones en Secciones 10-12 |
| `debate/Claude_Addendum_Deep_Research.md` | Claude Opus | 2026-02-19 | **ELIMINADO** -- herramientas QA en Secciones 7-8, valor unico preservado en Apendices A-E |
| `debate/Codex_2026-02-20_Gold_Standard_Unificado.md` | Codex (GPT-5) | 2026-02-20 | ABSORBIDO -- GS-01 a GS-05 y matriz endpoints en Secciones 4-5 |
| `debate/Gemini_3.1_PRO_Deep_Audit_QPH.md` | Gemini 3.1 PRO | 2026-02-20 | ABSORBIDO -- traduccion directa y STT por excepcion en Secciones 6-7 |
| `debate/Gemini_Deep_Thinking_Deep_Audit_QPH.md` | Gemini Deep Thinking | 2026-02-20 | ABSORBIDO -- DTR, expansion, model tiering en Secciones 6-7 |
| `debate/Sonnet_Devil_Advocate_Critique.md` | Sonnet | 2026-02-19 | ABSORBIDO -- advertencias como riesgos en Seccion 11 |
| `debate/Gaps_Pendientes_Deep_Research.md` | Claude | 2026-02-19 | ABSORBIDO -- datos YouTube Analytics en Secciones 1, 6, 10 |
| `debate/MEGA_BARRIDO_MULTIAGENTE_10_AGENTES.md` | 10 agentes | 2026-02-20 | ABSORBIDO -- inventario y contradicciones en Secciones 3, 5 |
| `docs/gold_standard_workflow.md` | Equipo | 2026-02-18 | ABSORBIDO -- endpoints corregidos en Seccion 5 |
| `docs/gold_standard_sections_*.md` (5 archivos) | Equipo | 2026-02-19 | ABSORBIDOS -- contenido expandido y corregido en Secciones 3-13 |

### 14.2 Documentos que Este Archivo NO Reemplaza

| Documento | Razon |
|:----------|:------|
| `debate/prompts/` (directorio) | Prompts operativos, no contenido de debate |
| `analysis/prd_final.md` | Cerrado como SUPERSEDED por ADR (Seccion 10.8), pero conservado como referencia historica |
| `docs/levantamientos/*.md` | Registros operativos de levantamientos con stakeholders |
| `README.md` | Documento de navegacion del repo |
| `MASTER_INDEX.md` | Indice SSOT del repo |

### 14.3 Archivos de Trabajo Generados Durante la Sintesis

Estos archivos fueron generados por los 4 agentes durante la construccion de este consenso y contienen las secciones detalladas sin consolidar:

| Archivo | Agente | Contenido |
|:--------|:-------|:----------|
| `docs/gold_standard_sections_3_6.md` | Architecture Synthesizer | Secciones 3-6 con schemas JSON completos y diagramas |
| `docs/gold_standard_sections_7_9_ops_safety.md` | Operations & Safety | Secciones 7-9 con tablas completas de herramientas y regulaciones |
| `docs/gold_standard_sections_roadmap_risk.md` | Roadmap & Risk | Secciones 10-13 con exit criteria detallados y SMART expandidos |

**Nota:** Estos archivos de trabajo contienen versiones mas detalladas de cada seccion (schemas JSON completos, tablas expandidas, exit criteria por fase, SMART con desglose E/M/A/R/T). Consultar para detalle fino.

### 14.4 Documento Canonico Vigente

**El presente archivo (`debate/Claude_Gold_Standard_Consenso_Final.md`) es el documento canonico vigente del proyecto Doge-MultiLang a partir del 2026-02-20.**

Cualquier contradiccion entre este documento y documentos previos se resuelve a favor de este archivo. Los documentos absorbidos conservan valor historico pero no deben usarse como fuente de decisiones sin verificar contra este consenso.

---

*Documento generado por 4 agentes Claude Opus 4.6 (Consensus Arbiter + Architecture Synthesizer + Operations & Safety + Roadmap & Risk) sintetizando 10 documentos de debate + 6 documentos tecnicos del repositorio Doge-MultiLang. Fecha: 2026-02-20.*

---

# APENDICES

> Los siguientes apendices preservan el valor unico de los documentos eliminados (`Claude_Pipeline_Debate.md`, `Claude_Addendum_Deep_Research.md`, `Claude_Mega_Propuesta_Final.md`) que no estaba cubierto en las secciones principales.

---

## Apendice A: Pipeline de Verificacion de Audio (Detalle)

### A.1 Diagrama Completo de Verificacion Post-Generacion

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

### A.2 Mejores STT por Familia de Idiomas

| Familia | Mejor STT | Alternativa | Notas |
|:--------|:----------|:------------|:------|
| **Ingles** | Whisper (2.7% WER) | Deepgram Nova-3 | Ambos excelentes |
| **Arabe** | Deepgram Nova-3 (modelo monolingue) | Whisper | Deepgram tiene modelo AR dedicado |
| **CJK (JA, KO, ZH)** | SenseVoice (<80ms, ASR+SER) | Whisper | SenseVoice es 5-15x mas rapido |
| **Hindi** | Deepgram Nova-3 | Whisper | Modelo HI dedicado |
| **Tamil/Malay** | Whisper | Deepgram (>20% mejor WER) | Idiomas de bajos recursos; WER alto |
| **Europeos (DE, FR, IT, RU)** | Whisper | Deepgram | Ambos buenos |
| **Turco/Indonesio** | Whisper | Azure Speech | Whisper razonable |
| **Safety pre-screening** | ElevenLabs Scribe v2 | Whisper + LLM | Scribe v2 entity detection con `offensive_language` nativa; $0 adicional |

### A.3 Herramientas de Deteccion de Emocion

| Herramienta | Idiomas | Funcion | Costo | Prioridad |
|:------------|:--------|:--------|:------|:----------|
| **emotion2vec+** | 10+ idiomas | 9 clases de emocion, SOTA en IEMOCAP | Gratis (open source, 90-300M params) | **ALTA** |
| **SenseVoice** | 50+ idiomas | ASR + SER + language ID en un modelo | Gratis (open source, <80ms) | **ALTA** (especialmente CJK) |
| **EmoBox** | 14 idiomas | Benchmark + toolkit para SER | Gratis | MEDIA (benchmarking) |

**Uso para QPH:** Comparar la emocion detectada en el audio doblado vs la emocion anotada en el guion (campo `emotion` de dialogue_objects.json). Si Gabriel dice "Hola amigos!" con emocion="happy" pero el audio en japones suena "sad", FLAG.

### A.4 Checklist de Audio QA (13 Pistas)

| # | Pista | Criterio PASS/FAIL | Automatizable? |
|:--|:------|:-------------------|:---------------|
| 1 | Claridad de voz | -14 LUFS | SI (pyloudnorm) |
| 2 | SFX sync | <=2 frames | PARCIAL |
| 3 | BGM levels | >=6dB below voice | SI (librosa) |
| 4 | Lip sync | Visual match | NO |
| 5 | Clipping | 0 dBFS ceiling | SI (librosa peak detection) |
| 6 | TTS quality | Natural, no robotic | SI (UTMOS MOS > 3.5) |
| 7 | Dubbing sync | Timing match with ES | SI (DTW + Forced Alignment) |
| 8 | WER verification | vs texto esperado | SI (Whisper + jiwer) |
| 9 | Speaker consistency | Voz correcta por personaje | SI (ECAPA-TDNN) |
| 10 | Emocion/tono | Match con guion | SI (emotion2vec+) |
| 11 | Silencios | Sin artefactos en pausas | SI (SNR check) |
| 12 | Transiciones | Smooth entre segmentos | PARCIAL |
| 13 | Overall quality | Evaluacion integral | NO (humano) |

**Pistas 1-3, 5-11 son automatizables** por audit_service.py. Pistas 4, 12-13 requieren intervencion humana.

### A.5 Lo que ElevenLabs SI y NO Verifica

**ElevenLabs SI provee (feb 2026):**
- Campo `loss` por caracter/palabra en Forced Alignment (confianza de alineacion)
- Scribe v2 entity detection: `pii`, `phi`, `pci`, `offensive_language`, `other` (56 tipos)
- Pronunciation Dictionaries: reglas IPA persistentes, versionadas, CRUD completo
- Audio Isolation API: separacion voz/background programatica
- PVC Speaker Separation: separar speakers de audio multi-speaker
- migrate-segments: reasignacion masiva de speakers
- get-similar-voices: top 10 voces similares por speaker

**ElevenLabs NO provee (QPH debe construir):**
- MOS / naturalidad (usar UTMOS)
- Deteccion de emociones (usar emotion2vec+ o SenseVoice)
- Drift de timing cross-idioma (usar DTW + WhisperX)
- Verificacion de consistencia de speaker cross-episodio (usar ECAPA-TDNN)
- Deteccion de artefactos de audio (usar librosa)
- Auditoria de calidad de traduccion (usar COMET + GEMBA-MQM + LLM judges)

---

## Apendice B: Stack Completo de Herramientas con Referencias

### B.1 Stack Recomendado

| Capa | Herramienta | Licencia | Referencia |
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
| Memoria correcciones | **Mem0** | Apache 2.0 | github.com/mem0ai/mem0 |
| Dashboard QA | **Metabase** | AGPL | metabase.com |
| Sentiment multilingue | **tabularisai model** | Open source | huggingface.co/tabularisai |
| Pronunciation rules | **ElevenLabs Pronunciation Dict.** | Incluido en plan | elevenlabs.io |
| Audio pre-processing | **ElevenLabs Audio Isolation** | Incluido en plan | elevenlabs.io |
| Speaker correction | **ElevenLabs migrate-segments** | Incluido en plan | elevenlabs.io |
| Safety pre-screen | **ElevenLabs Scribe v2** | Incluido en plan | elevenlabs.io |

### B.2 Alternativas por Componente

| Componente | Mejor | Alternativa 1 | Alternativa 2 |
|:-----------|:------|:--------------|:--------------|
| Metricas traduccion | COMET | MetricX (11B, mas lento) | chrF++ (mas simple) |
| Auditoria sin referencia | Rubric-MQM | GEMBA-MQM original | Lokalise AI LQA (SaaS) |
| STT | Whisper + Deepgram | Azure Speech | AWS Transcribe |
| Emocion | emotion2vec+ | SenseVoice | EmoBox |
| Speaker | ECAPA-TDNN | Resemblyzer | pyannote.audio |
| Memoria | Mem0 | RAG custom | Airtable manual |
| Dashboard | Metabase | Grafana | Superset |
| Pronunciacion | ElevenLabs Pron. Dict. | Custom IPA + Whisper | Espeak-ng |
| Audio isolation | ElevenLabs Audio Isolation | Demucs (Meta, open source) | Adobe Podcast Enhance |
| Safety screening | ElevenLabs Scribe v2 | Perspective API (Google) | OpenAI Moderation API |

---

## Apendice C: Alternativas de Gate por Tier

### C.1 Gate 1 (Pre-flight) - Safety Screening

| Opcion | Pros | Contras | Costo | Recomendacion |
|:-------|:-----|:--------|:------|:--------------|
| **A) Scribe v2 entity detection** | Nativo, $0, 56 tipos entidad | Solo en transcripcion, no traduccion | $0 | **Primera linea** |
| **B) OpenAI Moderation API** | Robusto, multilingue | Costo API adicional | ~$0.001/req | Complemento Tier 1 |
| **C) Perspective API** | Gratis hasta 1QPS | Menos categorias | $0 (rate limited) | Alternativa gratuita |
| **D) LLM Judge** | Contexto cultural, matices | Mas caro, lento | ~$0.01-0.03/seg | Casos ambiguos |

### C.2 Gate 2 (Traduccion EN) - Auditoria

| Opcion | Pros | Contras | Costo | Recomendacion |
|:-------|:-----|:--------|:------|:--------------|
| **A) COMET + 3 LLM Judges** | Mas robusto, consenso | Mas caro | ~$2-5/ep | **Tier 1** |
| **B) COMET + 1 LLM** | Mas barato, 80% precision | Bias modelo unico | ~$0.50-1/ep | Tier 2 |
| **C) Solo metricas (COMET + chrF++)** | Gratis, rapido | No detecta errores culturales | $0 | Tier 3 |
| **D) Rubric-MQM v2.0** | Auto-post-editing incluido | Un solo framework | ~$1-2/ep | Alternativa a 3 judges |

### C.3 Gate 4 (Audio) - Verificacion

| Opcion | Pros | Contras | Costo | Recomendacion |
|:-------|:-----|:--------|:------|:--------------|
| **A) Whisper + Deepgram dual** | Alta confianza, consenso | 2 APIs | ~$3-6/ep | **Tier 1** |
| **B) Scribe v2 + Whisper** | 1 API externa, Scribe incluido | Scribe menos maduro | ~$1.5-3/ep | **Alternativa costo-eficiente** |
| **C) Solo Whisper** | Barato, un proveedor | Sin consenso | ~$1.5-3/ep | Tier 3 |
| **D) SenseVoice (CJK) + Whisper** | Optimo por familia | Mas complejo | ~$2-4/ep | Maximizar CJK |

### C.4 Combinacion Recomendada por Tier

| Tier | Gate 1 | Gate 2 | Gate 3 | Gate 4 | Costo/ep |
|:-----|:-------|:-------|:-------|:-------|:---------|
| **1** | Scribe v2 + OpenAI Moderation | COMET + 3 LLM Judges | GEMBA-MQM + COMET | Whisper + Deepgram dual | ~$8-13 |
| **2** | Scribe v2 | COMET + 1 LLM | GEMBA-MQM | Scribe v2 + Whisper | ~$3-6 |
| **3** | Scribe v2 | COMET + chrF++ | chrF++ | Solo Whisper | ~$1-3 |

---

## Apendice D: Modulo Kaizen (Mejora Continua)

### D.1 Ciclo PDCA para Dubbing QPH

```
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

### D.2 Taxonomia de Errores MQM Adaptada

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

**Puntuacion:** Minor = 1 punto, Major = 5 puntos, Critical = 25 puntos. Umbral de aprobacion por tier.

### D.3 Memoria de Correcciones con Mem0

**Mem0** (open source, 41K GitHub stars, github.com/mem0ai/mem0) es un layer de memoria persistente para agentes AI.

```
FLUJO:
  Episodio 1: Saul corrige "no." -> "no," en linea 42
    -> Mem0 almacena: {pattern: "no.", replacement: "no,", context: "antes de mayuscula"}

  Episodio 2: prescanner detecta "no." en linea 17
    -> Mem0 consulta: "he visto este patron?"
    -> Mem0 responde: "Si, correccion automatica"
    -> Se aplica ANTES de enviar a ElevenLabs

  Resultado: Error manual -> automatico
```

**Tipos de memorias para QPH:**
1. Correcciones de blacklist expandidas
2. Mapeos speaker -> voice corregidos
3. Ajustes de timing por idioma
4. Overrides de traduccion (modismos)
5. Reglas de onomatopeyas descubiertas

### D.4 Feedback Loop de Audiencia

```
YouTube Analytics API (retention curves, comments)
  |
  v
Sentiment Analysis multilingue (tabularisai, 27 idiomas)
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

**Ejemplo de deteccion:** EP042 en arabe: retencion cae 40% en min 3:20, comentarios AR negativos, segmento tiene WER 18% y speaker error -> Re-auditar, corregir, actualizar Mem0.

### D.5 Captura de Conocimiento Tribal

1. Pasar transcripcion Q8 (Saul/Ivan) por LLM
2. Extraer todas las reglas "si X entonces haz Y"
3. Almacenar como JSON estructurado en knowledgebase
4. Cargar en Mem0 como memorias iniciales

```json
{
  "rule_id": "TK-001",
  "source": "Q8_SAUL_IVAN",
  "pattern": "ElevenLabs detecta speaker 2 como speaker 1",
  "action": "Verificar mapeo de voces contra manifest.json",
  "frequency": "frecuente",
  "languages_affected": "todos"
}
```

---

## Apendice E: Desglose de Costos por Componente

### E.1 Costo por Episodio (27 idiomas, ~10 min video, ~2000 palabras)

| Componente | Costo | Notas |
|:-----------|:------|:------|
| ElevenLabs (generacion) | Incluido en plan Pro | Ya lo pagan |
| COMET/xCOMET | ~$0.00 | Open source, self-hosted |
| GEMBA-MQM (3 jueces LLM) | ~$2-5 | Claude + GPT-4o + Gemini Flash |
| STT dual (Whisper + Deepgram) | ~$3-6 | 27 idiomas x 10 min |
| Audio checks (librosa/pyloudnorm) | ~$0.00 | CPU-only, milisegundos |
| UTMOS naturalidad | ~$0.00 | Open source, self-hosted |
| emotion2vec+ tono | ~$0.00 | Open source, self-hosted |
| Speaker verification (ECAPA-TDNN) | ~$0.00 | Open source, self-hosted |
| GPU compute (modelos self-hosted) | ~$1-2 | ~$0.30/hr A10G spot |
| **Subtotal automatico** | **~$6-13** | |
| Revision humana Tier 1 (5 idiomas) | ~$40-50 | Saul/Ivan, tiempo interno |
| **TOTAL POR EPISODIO** | **~$46-63** | vs $5,400-$8,100 full humano |

### E.2 Costo Anual Estimado

| Concepto | Calculo | Total |
|:---------|:--------|:------|
| QA auto + humano Tier 1 (52 ep/ano) | 52 x ~$55 | ~$2,860/ano |
| Revision humana completa (referencia) | 52 x ~$6,750 | ~$351,000/ano |
| **Ahorro neto** | | **~97%** |
