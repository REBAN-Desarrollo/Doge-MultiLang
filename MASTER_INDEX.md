# MASTER INDEX — Doge-MultiLang (SSOT)

> Indice maestro de todos los documentos del repositorio. Fuente unica de verdad para navegacion.

**Generado:** 2026-02-20 | **Total archivos:** 254 | **Total .md:** 222

---

## Resumen

| Directorio | Archivos | Tipos | Proposito |
|:-----------|:---------|:------|:----------|
| `/` (root) | 4 | .md, .py, .pptx, .gitignore | Proyecto raiz |
| `analysis/` | 10 | .md, .json | Deep research: 4 waves de analisis |
| `debate/` | 7 | .md | Gold Standard canonico + debate multi-AI + auditorias |
| `docs/` | 2 | .md | Workflow gold standard + Gaps (YouTube Analytics) |
| `docs/levantamientos/` | 53 | .md, .txt, .docx | Entrevistas, specs, cuestionarios, destilados |
| `knowledgebase/` | 6 | .jsonl, .json, .py, .md | RAG sources, transform script |
| `knowledgebase/elevenlabs_api/` | 158 | .md | API reference ElevenLabs (Feb 2026) |
| `knowledgebase/blacklists/` | 3 | .json | Blacklists por idioma |
| `knowledgebase/theories/` | 3 | .md | Sintesis teoricas |
| `knowledgebase/_metadata/` | 6 | .md, .txt | Trazabilidad y proveniencia |
| `SMART/` | 5 | .md | Objetivos SMART por stakeholder |
| `scripts/` | 2 | .py | Scripts de produccion |
| `debate/prompts/` | 1 | .md | Prompts para auditorias AI |

---

## 1. ROOT

| Archivo | Tipo | Proposito |
|:--------|:-----|:----------|
| `README.md` | doc | README principal del proyecto |
| `MASTER_INDEX.md` | doc | Este archivo — indice maestro SSOT |
| `analysis_calc.py` | script | Calculos de revenue QPH por idioma (views, RPM, multipliers) |
| `QPH_Problematicas_Equipo_v6.pptx` | presentacion | Presentacion de problematicas para el equipo |
| `.gitignore` | config | Archivos excluidos del repo |

---

## 2. ANALYSIS/ — Deep Research (10 archivos)

Resultado de 4 waves de analisis ejecutadas el 2026-02-19. Cada wave profundiza mas.

| # | Archivo | Titulo | Wave | Confianza |
|:--|:--------|:-------|:-----|:----------|
| 1 | [`prd_final.md`](analysis/prd_final.md) | PRD FINAL: Doge-MultiLang Audio Pipeline | W4 (sintesis) | — |
| 2 | [`wave_1_executive_summary.md`](analysis/wave_1_executive_summary.md) | WAVE 1: Discovery Matrix | W1 | — |
| 3 | [`wave_1_discovery_report.json`](analysis/wave_1_discovery_report.json) | WAVE 1: Discovery Report (raw JSON) | W1 | — |
| 4 | [`wave_2_t6_data_structure_mapping.md`](analysis/wave_2_t6_data_structure_mapping.md) | T6: Data Structure Mapping | W2 | 0.87 |
| 5 | [`wave_2_t7_gap_analysis_matrix.md`](analysis/wave_2_t7_gap_analysis_matrix.md) | T7: Gap Analysis Matrix | W2 | 0.88 |
| 6 | [`wave_2_t8_ssot_crossreference.md`](analysis/wave_2_t8_ssot_crossreference.md) | T8: SSOT Cross-Reference | W2 | 0.87 |
| 7 | [`wave_2_consolidated_report.md`](analysis/wave_2_consolidated_report.md) | WAVE 2: Consolidated Report | W2 | — |
| 8 | [`wave_3_t9_translation_audit.md`](analysis/wave_3_t9_translation_audit.md) | T9: Translation/Speaker Quality Audit | W3 | 0.89 |
| 9 | [`wave_3_t10_architecture_audit.md`](analysis/wave_3_t10_architecture_audit.md) | T10: Architecture & Implementation Readiness | W3 | 0.90 |
| 10 | [`wave_3_consolidated_audit.md`](analysis/wave_3_consolidated_audit.md) | WAVE 3: Consolidated Audit Report | W3 | — |

### Flujo de lectura recomendado

```
PRD FINAL (sintesis completa)
    ↑
Wave 3 Consolidated (audit)
    ↑
Wave 2 Consolidated (deep analysis)
    ↑
Wave 1 Executive Summary (discovery)
```

Si necesitas detalle, lee los reportes individuales T6-T10.

---

## 3. DEBATE/ — Gold Standard + Debate Multi-AI (7 archivos)

El Gold Standard v1.0 es el documento canonico que consolida 10+ perspectivas AI. Los demas archivos son auditorias independientes y documentos complementarios.

| # | Archivo | Titulo | Autor | Status |
|:--|:--------|:-------|:------|:-------|
| 1 | [`Claude_Gold_Standard_Consenso_Final.md`](debate/Claude_Gold_Standard_Consenso_Final.md) | **Gold Standard v1.0** (~1,400 lineas) | Claude Opus 4.6 | **CANONICO (SSOT)** |
| 2 | [`Codex_2026-02-20_Gold_Standard_Unificado.md`](debate/Codex_2026-02-20_Gold_Standard_Unificado.md) | Gold Standard Unificado | Codex (GPT-5) | Vigente |
| 3 | [`Sonnet_Devil_Advocate_Critique.md`](debate/Sonnet_Devil_Advocate_Critique.md) | Devil's Advocate + Phase 0 | Claude Sonnet 4.6 | Actualizado |
| 4 | [`Gemini_3.1_PRO_Deep_Audit_QPH.md`](debate/Gemini_3.1_PRO_Deep_Audit_QPH.md) | Deep Audit QPH (Exhaustive) | Gemini 2.5 Pro | Vigente |
| 5 | [`Gemini_Deep_Thinking_Deep_Audit_QPH.md`](debate/Gemini_Deep_Thinking_Deep_Audit_QPH.md) | Step-Back / Zoom-Out Analysis | Gemini (Deep Thinking) | Vigente |
| 6 | [`Propuesta_Equipo_No_Tecnica.md`](debate/Propuesta_Equipo_No_Tecnica.md) | Propuesta para Equipo (no tecnica) | Equipo | Vigente |

**Archivos eliminados (absorbidos en Gold Standard):** Claude_Mega_Propuesta_Final, Claude_Pipeline_Debate, Claude_Addendum_Deep_Research, Codex_Gold_Standard, Gemini_Swarm_Multi_Opinion, MEGA_BARRIDO_MULTIAGENTE_10_AGENTES.

**Archivo movido:** `Gaps_Pendientes_Deep_Research.md` → `docs/` (datos de YouTube Analytics).

**Subfolder `debate/prompts/`:**

| Archivo | Proposito |
|:--------|:----------|
| [`gemini_deep_audit_prompt.md`](debate/prompts/gemini_deep_audit_prompt.md) | Prompt template para generar Gemini_3.1_PRO_Deep_Audit_QPH.md |

### Mapa de consolidacion

```
Claude Pipeline Debate (hechos verificados)
    + Claude Addendum (deep research, tools, costs)
    + Claude Mega Propuesta (plan optimo, 15 agentes)
    + Sonnet Devil's Advocate (riesgos, prudencia)
    + Codex Gold Standard (contratos formales)
    + Gemini Swarm (tacticas, SSML, patches)
    + MEGA BARRIDO (10 agentes, audit repo)
    ───────────────────────────────
    = Gold Standard v1.0 (documento canonico consolidado)
```

---

## 4. DOCS/ — Workflow y Levantamientos

### 4.1 Documentos directos

| Archivo | Titulo | Version |
|:--------|:-------|:--------|
| [`gold_standard_workflow.md`](docs/gold_standard_workflow.md) | Gold Standard: Doge-MultiLang Workflow | v1.1 |
| [`Gaps_Pendientes_Deep_Research.md`](docs/Gaps_Pendientes_Deep_Research.md) | Gaps Pendientes: AVD x Calidad (YouTube Analytics) | — |

### 4.2 Levantamientos (51 archivos)

Ver [`docs/levantamientos/README.md`](docs/levantamientos/README.md) para el indice detallado.

#### Por categoria

**Reglas CORE (5):**

| Archivo | Titulo | Tema |
|:--------|:-------|:-----|
| [`02_core_narrative_bible.md`](docs/levantamientos/02_core_narrative_bible.md) | Biblia Narrativa | Narrativa, tono, personajes |
| [`04_core_timing_rules.md`](docs/levantamientos/04_core_timing_rules.md) | Reglas de Timing | Silencios, sincronizacion |
| [`06_core_audio_tts.md`](docs/levantamientos/06_core_audio_tts.md) | Audio y TTS | Speaker types, pipeline TTS |
| [`07_core_multi_language.md`](docs/levantamientos/07_core_multi_language.md) | Multi-Idioma y Doblaje | 17 idiomas, blacklists, WER |
| [`11_andrea_guion_checklist.md`](docs/levantamientos/11_andrea_guion_checklist.md) | Checklist Guion Andrea | Aprobacion de guion |

**Cuestionarios (8):**

| Archivo | Persona | Status |
|:--------|:--------|:-------|
| [`q1_andrea_gm.md`](docs/levantamientos/q1_andrea_gm.md) | Andrea (GM) | Template |
| [`q2_alan_ramon_factory.md`](docs/levantamientos/q2_alan_ramon_factory.md) | Alan + Ramon (Factory) | Template |
| [`q7_fernando_postprod.md`](docs/levantamientos/q7_fernando_postprod.md) | Fernando (Post-prod) | **SIN LLENAR — BLOCKER** |
| [`q8_saul_ivan_dubbing.md`](docs/levantamientos/q8_saul_ivan_dubbing.md) | Saul + Ivan (Dubbing) | **SIN LLENAR — BLOCKER** |
| [`guionismo_january_quest.md`](docs/levantamientos/guionismo_january_quest.md) | Guionistas | Completado |
| [`postproduccion_january_quest.md`](docs/levantamientos/postproduccion_january_quest.md) | Post-produccion | Completado |
| [`produccion_january_quest.md`](docs/levantamientos/produccion_january_quest.md) | Produccion | Completado |
| [`quality_january_quest.md`](docs/levantamientos/quality_january_quest.md) | Calidad | Completado |

**Workflows (5):**

| Archivo | Area |
|:--------|:-----|
| [`08_audio_tts_workflow.md`](docs/levantamientos/08_audio_tts_workflow.md) | Audio y TTS (Celula 3) |
| [`09_dubbing_workflow.md`](docs/levantamientos/09_dubbing_workflow.md) | Doblaje (Celula 7) |
| [`11_fernando_daily_ops.md`](docs/levantamientos/11_fernando_daily_ops.md) | Post-produccion (Fernando) |
| [`26_02_12_sonorizacion_workflow.md`](docs/levantamientos/26_02_12_sonorizacion_workflow.md) | Sonorizacion (Celula 4) |
| [`flujo_actual.md`](docs/levantamientos/flujo_actual.md) | Flujo actual end-to-end |

**Dashboards por rol (3):**

| Archivo | Rol |
|:--------|:----|
| [`factory_alan_ramon.md`](docs/levantamientos/factory_alan_ramon.md) | Factory Managers (C2-C5, C7) |
| [`dubbing_saul_ivan.md`](docs/levantamientos/dubbing_saul_ivan.md) | Dubbing (C7 Traduccion) |
| [`postprod_fernando.md`](docs/levantamientos/postprod_fernando.md) | Post-produccion (Audio, Mezcla) |

**Deep Dives Diciembre 2025 (15):**

| Archivo | Tema |
|:--------|:-----|
| [`25_12_24_master_plan_dubbing.md`](docs/levantamientos/25_12_24_master_plan_dubbing.md) | Master plan dubbing |
| [`25_12_24_technical_spec_elevenlabs.md`](docs/levantamientos/25_12_24_technical_spec_elevenlabs.md) | UI Blueprint: Mega Dubbing Tab |
| [`25_12_24_requirements_dubbing.md`](docs/levantamientos/25_12_24_requirements_dubbing.md) | Stakeholders y compromisos |
| [`25_12_24_benchmark_research_dubbing.md`](docs/levantamientos/25_12_24_benchmark_research_dubbing.md) | Benchmarks COMET, xCOMET |
| [`25_12_24_glossary_strategy_idiomas.md`](docs/levantamientos/25_12_24_glossary_strategy_idiomas.md) | Glosario y termbase |
| [`25_12_24_guide_es_latam.md`](docs/levantamientos/25_12_24_guide_es_latam.md) | Localizacion ES-LATAM |
| [`25_12_24_persona_kids_6_12.md`](docs/levantamientos/25_12_24_persona_kids_6_12.md) | Persona: Kids 6-12 |
| [`25_12_24_target_audience_gaps.md`](docs/levantamientos/25_12_24_target_audience_gaps.md) | Gaps de audiencia |
| [`25_12_24_cuestionario_detalle_multirol.md`](docs/levantamientos/25_12_24_cuestionario_detalle_multirol.md) | Cuestionario multirol |
| [`25_12_24_validation_flow_tiering_qa.md`](docs/levantamientos/25_12_24_validation_flow_tiering_qa.md) | Flujo de validacion QA |
| [`25_12_xx_voice_tts_checklist.md`](docs/levantamientos/25_12_xx_voice_tts_checklist.md) | Checklist voice/TTS |
| [`25_12_xx_sonorizacion_checklist.md`](docs/levantamientos/25_12_xx_sonorizacion_checklist.md) | Checklist sonorizacion |
| [`25_12_xx_tts_plan_mejoras_espanol.md`](docs/levantamientos/25_12_xx_tts_plan_mejoras_espanol.md) | Mejoras TTS espanol |
| [`25_12_xx_tts_elevenlabs_checklist.md`](docs/levantamientos/25_12_xx_tts_elevenlabs_checklist.md) | Checklist ElevenLabs |
| [`25_12_xx_tts_legacy_plan.md`](docs/levantamientos/25_12_xx_tts_legacy_plan.md) | Plan legacy TTS |

**Febrero 2026 — QA y Planning (5):**

| Archivo | Tema |
|:--------|:-----|
| [`26_02_06_q8_draft_saul_ivan_dubbing.md`](docs/levantamientos/26_02_06_q8_draft_saul_ivan_dubbing.md) | Q8 Draft (70-80% confianza) |
| [`26_02_12_qa_tiering_por_stage.md`](docs/levantamientos/26_02_12_qa_tiering_por_stage.md) | QA Tiering por stage |
| [`26_02_18_checklist_audio_qa.md`](docs/levantamientos/26_02_18_checklist_audio_qa.md) | Checklist Audio QA |
| [`26_02_19_phase3_qa_implementation_plan.md`](docs/levantamientos/26_02_19_phase3_qa_implementation_plan.md) | Plan implementacion Phase 3 |
| [`26_01_15_entrevista_qph_andrea_iris_daniel.md`](docs/levantamientos/26_01_15_entrevista_qph_andrea_iris_daniel.md) | Transcripcion entrevista |

**Destilados (2):**

| Archivo | Tema |
|:--------|:-----|
| [`04_EVIDENCE_destilado_multiidioma.md`](docs/levantamientos/04_EVIDENCE_destilado_multiidioma.md) | Destilado multi-idioma de 15 archivos 04_EVIDENCE (AI-Studio) |
| [`REBAN_destilado_multiidioma.md`](docs/levantamientos/REBAN_destilado_multiidioma.md) | Destilado multi-idioma de 10 archivos REBAN (Guionismo): ADN QPH, specs audio, safety |

**Otros (10):**

| Archivo | Tema |
|:--------|:-----|
| [`analisis_lean.md`](docs/levantamientos/analisis_lean.md) | Analisis Lean (mudas) |
| [`pain_to_feature_matrix.md`](docs/levantamientos/pain_to_feature_matrix.md) | Pain-to-Feature Matrix |
| [`sonorizacion_plan.md`](docs/levantamientos/sonorizacion_plan.md) | Plan sonorizacion |
| [`voice_tts_plan.md`](docs/levantamientos/voice_tts_plan.md) | Plan voice/TTS |
| [`README.md`](docs/levantamientos/README.md) | Indice de levantamientos |

---

## 5. KNOWLEDGEBASE/ — ElevenLabs RAG (176 archivos)

Ver [`knowledgebase/README.md`](knowledgebase/README.md) para guia de uso.

### 5.1 Archivos raiz

| Archivo | Tamano | Proposito | En .gitignore? |
|:--------|:-------|:----------|:---------------|
| `elevenlabs_final.jsonl` | 2.8 MB | RAG principal (735 entries) | **SI** |
| `elevenlabs_helper.json` | 471 KB | Endpoints frecuentes | **SI** |
| `elevenlabs_docs.json` | 969 KB | Referencia general API | **SI** |
| `kb_post_procesado.md` | 2.1 KB | Notas del proceso transform | No |
| `transform.py` | 7.9 KB | Generador del JSONL | No |
| `README.md` | — | Indice del knowledgebase | No |

### 5.2 elevenlabs_api/ (158 archivos .md)

Documentacion directa de ElevenLabs API (Feb 2026). Ver [`knowledgebase/elevenlabs_api/README.md`](knowledgebase/elevenlabs_api/README.md).

| Categoria | Archivos | Contenido |
|:----------|:---------|:----------|
| API Reference | 92 | Endpoints: TTS, STT, Dubbing, Voices, Studio, Forced Alignment |
| Product Guides | 10 | Voiceover Studio, Dubbing Studio, Voice Cloning |
| Cookbooks | 20 | Streaming, pronunciation, batch STT, cloning recipes |
| Overview | 7 | Models v3/Flash, capabilities, best practices |
| Tier 1 Supplement | 12 | Dubbing cookbook, errors, billing, latencia |
| Tier 2 Supplement | 16 | Security, zero-retention, SDK, websockets |

### 5.3 blacklists/ (3 archivos .json)

| Archivo | Idioma | Contenido |
|:--------|:-------|:----------|
| `blacklist_global.json` | Todos | Categorias A/B/C globales |
| `blacklist_ar.json` | Arabe | Terminos culturales/religiosos |
| `blacklist_de.json` | Aleman | Terminos historicos + formalidad |

**Faltantes:** 24 idiomas sin blacklist (ES, EN, PT, FR, KO, JA, HI, ZH, IT, PL, RU, TR, FIL, ID, y mas).

### 5.4 theories/ (3 archivos .md)

| Archivo | Titulo | Tema |
|:--------|:-------|:-----|
| [`audio_pipeline_synthesis.md`](knowledgebase/theories/audio_pipeline_synthesis.md) | Sintesis del Pipeline de Audio | Workflow Saul + Fernando |
| [`model_comparison_benchmark.md`](knowledgebase/theories/model_comparison_benchmark.md) | Benchmarking de Modelos | GPT-4o vs Claude 3.5 Sonnet |
| [`translation_workflow_v1.md`](knowledgebase/theories/translation_workflow_v1.md) | Translation Theories v1 | Optimizacion del pipeline |

### 5.5 _metadata/ (6 archivos)

| Archivo | Tipo | Proposito |
|:--------|:-----|:----------|
| `README.md` | .md | Indice de metadata |
| `EXIT_REPORT_JAN2026.md` | .md | Reporte crawl Apify ($4.25, quality gates) |
| `KB_STATUS_JAN2026.md` | .md | Score card: 87/100, 441 records |
| `KB_STATUS_FEB2026.md` | .md | Score card: 96/100, 157 files, $0.00 |
| `POST_PROCESADO.md` | .md | Docs del script transform.py |
| `llms_txt_full_index.txt` | .txt | Indice maestro: 663 URLs de elevenlabs.io |

---

## 6. SCRIPTS/ (2 archivos)

| Archivo | Proposito | Dependencias |
|:--------|:----------|:-------------|
| [`planchado.py`](scripts/planchado.py) | API de sesiones de planchado QPH (3 tipos: historia/assets/portada) | FastAPI, Pydantic, SQLAlchemy |
| [`generate_pptx_equipo.py`](scripts/generate_pptx_equipo.py) | Genera presentacion PPTX para equipo QPH | python-pptx |

**Nota:** Los 18 scripts del pipeline (docx_parser, voice_mapper, tts_batch, etc.) estan planeados en el PRD pero se implementan en AI-Studio, no aqui.

---

## 7. SMART/ — Objetivos por Stakeholder (5 archivos)

Objetivos SMART (Specific, Measurable, Achievable, Relevant, Time-bound) derivados del Gold Standard y Phase 0.

| Archivo | Stakeholder | Enfoque |
|:--------|:------------|:--------|
| [`README.md`](SMART/README.md) | Todos | Indice y referencia cruzada |
| [`ANDREA_GIO_producto_blacklists_cultura.md`](SMART/ANDREA_GIO_producto_blacklists_cultura.md) | Andrea + Gio | Blacklists, PCD, compliance, QA contenido |
| [`ALAN_postproduccion_multiidioma.md`](SMART/ALAN_postproduccion_multiidioma.md) | Alan | Mapa de procesos, gaps handoff, tiempos, publicacion |
| [`RAMON_desarrollo_onboarding.md`](SMART/RAMON_desarrollo_onboarding.md) | Ramon | Onboarding repo, fix bugs, endpoints API, spike DTR |
| [`DANIEL_deep_research.md`](SMART/DANIEL_deep_research.md) | Daniel | Deep research, benchmarks, decisiones, soporte tecnico |

---

## Navegacion rapida por necesidad

### Quiero entender el proyecto

1. [`README.md`](README.md) — Vision general
2. [`debate/Propuesta_Equipo_No_Tecnica.md`](debate/Propuesta_Equipo_No_Tecnica.md) — Explicacion accesible
3. [`analysis/prd_final.md`](analysis/prd_final.md) — PRD tecnico completo

### Quiero ver el plan tecnico

1. [`debate/Claude_Gold_Standard_Consenso_Final.md`](debate/Claude_Gold_Standard_Consenso_Final.md) — Gold Standard v1.0 (SSOT canonico)
2. [`analysis/prd_final.md`](analysis/prd_final.md) — 18 scripts, roadmap, costos
3. [`docs/gold_standard_workflow.md`](docs/gold_standard_workflow.md) — Workflow con endpoints

### Quiero datos de ElevenLabs

1. [`knowledgebase/README.md`](knowledgebase/README.md) — Guia de uso del KB
2. [`knowledgebase/elevenlabs_api/README.md`](knowledgebase/elevenlabs_api/README.md) — Indice de 158 docs
3. `knowledgebase/elevenlabs_final.jsonl` — RAG principal (en .gitignore)

### Quiero entender un area especifica

| Area | Documentos clave |
|:-----|:-----------------|
| Guion | `q1_andrea_gm.md`, `11_andrea_guion_checklist.md`, `02_core_narrative_bible.md` |
| TTS | `06_core_audio_tts.md`, `08_audio_tts_workflow.md`, `voice_tts_plan.md` |
| Dubbing | `07_core_multi_language.md`, `09_dubbing_workflow.md`, `25_12_24_master_plan_dubbing.md` |
| QA | `26_02_12_qa_tiering_por_stage.md`, `26_02_18_checklist_audio_qa.md`, `25_12_24_validation_flow_tiering_qa.md` |
| Post-prod | `11_fernando_daily_ops.md`, `postprod_fernando.md`, `04_core_timing_rules.md` |
| Sonorizacion | `sonorizacion_plan.md`, `26_02_12_sonorizacion_workflow.md`, `25_12_xx_sonorizacion_checklist.md` |
| Glosario | `25_12_24_glossary_strategy_idiomas.md`, blacklists en `knowledgebase/blacklists/` |
| Audiencia | `25_12_24_persona_kids_6_12.md`, `25_12_24_guide_es_latam.md`, `25_12_24_target_audience_gaps.md` |

### Quiero ver objetivos y asignaciones

1. [`SMART/README.md`](SMART/README.md) — Indice de objetivos por stakeholder
2. [`SMART/DANIEL_deep_research.md`](SMART/DANIEL_deep_research.md) — Calendario consolidado y dependencias
3. [`docs/levantamientos/04_EVIDENCE_destilado_multiidioma.md`](docs/levantamientos/04_EVIDENCE_destilado_multiidioma.md) — Datos operativos de dubbing (destilado)

### Quiero ver que opina cada AI

| Modelo | Documento | Angulo |
|:-------|:----------|:-------|
| **Consolidado** | `Claude_Gold_Standard_Consenso_Final.md` | **Gold Standard v1.0 — SSOT canonico** |
| Claude Sonnet | `Sonnet_Devil_Advocate_Critique.md` | Riesgos, prudencia + Phase 0 verificacion |
| GPT-5 / Codex | `Codex_2026-02-20_Gold_Standard_Unificado.md` | Contratos formales, SSOT |
| Gemini Pro | `Gemini_3.1_PRO_Deep_Audit_QPH.md` | Audit exhaustivo |
| Gemini Deep | `Gemini_Deep_Thinking_Deep_Audit_QPH.md` | Macro-arquitectura |

---

## Archivos en .gitignore

Estos archivos son referenciados en la documentacion pero NO estan en el repositorio:

| Archivo | Tamano | Como regenerar |
|:--------|:-------|:---------------|
| `knowledgebase/elevenlabs_final.jsonl` | 2.8 MB | `cd knowledgebase && python transform.py` |
| `knowledgebase/elevenlabs_helper.json` | 471 KB | Generado por transform.py |
| `knowledgebase/elevenlabs_docs.json` | 969 KB | Generado por transform.py |

---

## Blockers activos

| Blocker | Archivo | Impacto | Accion |
|:--------|:--------|:--------|:-------|
| Q7 sin llenar | `q7_fernando_postprod.md` | Script #5 (silencios), Layer 2 timing | Entrevistar a Fernando |
| Q8 sin llenar | `q8_saul_ivan_dubbing.md` | Script #6 (speaker merge), M3 | Entrevistar a Saul/Ivan |
| 24 blacklists faltantes | `knowledgebase/blacklists/` | M5 (24 idiomas sin proteccion) | Script #17 (blacklist_generator) |
| Voice Segments v3 | No existe | M3 (phantom feature) | Usar Voiceover Studio + ffmpeg fallback |

---

**Generado por:** Claude Opus 4.6 | **Fecha:** 2026-02-20 | **Repo:** REBAN-Desarrollo/Doge-MultiLang
