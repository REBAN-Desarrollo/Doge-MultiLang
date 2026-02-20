# MEGA PROPUESTA FINAL: Doge-MultiLang Pipeline

| Campo | Valor |
|:------|:------|
| **Version** | v1.0 FINAL |
| **Fecha** | 2026-02-20 |
| **Autor** | Claude Opus 4.6 (15 agentes: 10 lectores Wave 1 + 5 sintetizadores Wave 2) |
| **Fuentes** | 79 archivos del repo + 4 opiniones AI + codigo verificado de AI-Studio |
| **Objetivo** | Propuesta definitiva que sintetiza TODAS las perspectivas y produce un plan ejecutable |

> **Este documento reemplaza:** PRD_FINAL.md (superseded), claude_debate.md (incorporado), y todas las propuestas individuales anteriores.

---

## TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Matriz de Consenso / Disenso](#2-matriz-de-consenso--disenso)
3. [Estado Actual del Proyecto](#3-estado-actual-del-proyecto)
4. [Arquitectura Target](#4-arquitectura-target)
5. [Estrategia de API ElevenLabs](#5-estrategia-de-api-elevenlabs)
6. [Plan de Integracion](#6-plan-de-integracion)
7. [Roadmap de Implementacion](#7-roadmap-de-implementacion)
8. [Matriz de Riesgos y Gaps](#8-matriz-de-riesgos-y-gaps)
9. [Registro de Asunciones](#9-registro-de-asunciones)
10. [Log de Decisiones Pendientes](#10-log-de-decisiones-pendientes)
11. [Mapa del Repositorio](#11-mapa-del-repositorio)
12. [Acciones Inmediatas](#12-acciones-inmediatas)

---

## 1. RESUMEN EJECUTIVO

### El problema
QPH (QuePerroHilo) produce contenido animado infantil (8-15 anos) que se dobla a 27 idiomas usando ElevenLabs. El proceso actual tiene cero metricas de calidad, cero automatizacion, y confia ciegamente en 26 de 27 idiomas. Solo ingles se revisa manualmente.

### El hallazgo critico
AI-Studio ya tiene **Phase 1 + Phase 2 implementadas** (~3,000 lineas de codigo funcional verificado por 6 agentes). El plan original del swarm (PRD_FINAL.md) que proponia 18 scripts greenfield y 75h de trabajo es **SUPERSEDED**. Solo falta **Phase 3: QA Automation**.

### La sintesis de 4 perspectivas AI

| Perspectiva | Contribucion principal |
|:------------|:----------------------|
| **Claude Opus** (claude_debate.md) | Los HECHOS: codigo verificado, bugs encontrados, lineas contadas |
| **Devil's Advocate** (devil_advocate_critique.md) | La PRUDENCIA: asunciones cuestionadas, riesgos no vistos |
| **Codex / GPT-5** (codex_gold_standard.md) | La ESTRUCTURA: contratos de datos formales, reglas de integridad |
| **Gemini Multi** (Gemini_Multi_opinion.md) | Las TACTICAS: SSML, patches granulares, auto_assign_voices |

### El plan optimo
- **Trabajo real necesario:** ~175-224h total (5 fases)
- **MVP funcional con QA basico:** ~46-61h (Phase 0 + Phase 1)
- **Principio rector:** Verificar ANTES de construir. Cada hora de verificacion ahorra 5-10h de retrabajo.

---

## 2. MATRIZ DE CONSENSO / DISENSO

### 2.1 Puntos donde TODAS las opiniones convergen

| # | Consenso | Claude | Devil's Advocate | Codex | Gemini |
|:--|:---------|:-------|:-----------------|:------|:-------|
| C1 | **API-first, GUI como fallback** | L213-221 | L137-147 | L51-52 (GS-03) | L30-35 |
| C2 | **Guion .docx = SSOT del texto** | L107-115 | L396-414 | L43 (GS-01) | L10 |
| C3 | **Se necesita WER automatizado** | L228-248 | L189-203 | L79 | L42 |
| C4 | **Manual Dub CSV NO es pilar unico** | L547-548 | L123 | L97 (No-go #2) | Implica SSML |
| C5 | **Blacklists actuales insuficientes** (3 de 27 idiomas) | L301 | L437-454 | L85 | L18-19 |
| C6 | **Piloto end-to-end obligatorio antes de escalar** | L152-162 | L462-468 | L103-104 | L32 |

### 2.2 Puntos donde las opiniones divergen

| # | Tema | Resolucion adoptada |
|:--|:-----|:--------------------|
| D1 | Donde vive el pipeline | **AI-Studio** (Claude). Doge-MultiLang = config + docs |
| D2 | Estado del codigo existente | **Verificado por agentes** (Claude v3) pero requiere test E2E (Devil's Advocate) |
| D3 | Tiempo de verificacion | **3 dias** (compromiso: no 2h como Claude ni 5 dias como Devil's Advocate) |
| D4 | Formato de datos intermedio | **Dubbing Resource API** (reemplaza CSV). Adoptar 4 JSONs de Codex como contratos |
| D5 | Scope de idiomas | **Tier 1 primero** (5 idiomas MVP), evaluar ROI para decidir Tier 2/3 |
| D6 | Costo de QA | **No verificado** - requiere spike real antes de afirmar $1.20/proyecto |
| D7 | Re-Alignment Engine | **Usar alignment_engine.py existente** + Forced Alignment como complemento |
| D8 | Validacion humana previa | **SI, obligatorio** - 30 min Saul/Ivan + 30 min Fernando (Devil's Advocate tiene razon) |

### 2.3 Insights unicos adoptados

| Fuente | Insight | Accion |
|:-------|:--------|:-------|
| Claude | `dubbing_pipeline.py` desconectado de `dubbing_service.py` | Integrar como Phase 0 |
| Claude | Bugs P0 (prescanner crash) y P1 (WER language default) | Fix inmediato |
| Claude | Forced Alignment NEW (150+ idiomas) | Adoptar para drift detection |
| Devil's Advocate | Fuzzy match falla en ad-libs de Fernando | Manejar "linea sin match" explicitamente |
| Devil's Advocate | Evaluar alternativas a ElevenLabs | Benchmark anual en Q2 2026 |
| Devil's Advocate | Rechazo organizacional de Saul/Ivan | Demo obligatoria antes de onboarding |
| Codex | 4 JSONs SSOT canonicos | Adoptar como contratos entre componentes |
| Codex | Re-mapping manual PROHIBIDO (GS-04) | Sin manifest valido, pipeline se bloquea |
| Codex | Trazabilidad obligatoria (GS-05) | Toda correccion deja traza: quien/cuando/por que |
| Gemini | SSML `<break>` para inyeccion de silencios | Adoptar en Phase 2 |
| Gemini | `auto_assign_voices: "alpha"` | Evaluar en spike de API |
| Gemini | PATCH granular por capitulo | Usar Dubbing Resource API en vez de regenerar todo |

### 2.4 Contradicciones resueltas

| # | Contradiccion | Resolucion |
|:--|:-------------|:-----------|
| X1 | Existe o no `docx_parser.py`? | EXISTE en AI-Studio (435L), NO en Doge-MultiLang. Ambos correctos, diferente alcance |
| X2 | Crear pipeline en Doge-MultiLang? | NO. Pipeline en AI-Studio. Doge-MultiLang = config + docs |
| X3 | alignment_engine.py existe o es fantasma? | EXISTE (120L, verificado). Pendiente: test funcional E2E |
| X5 | Evaluar cambiar de proveedor? | No en MVP. Benchmark anual en Q2 2026 |
| X7 | Costo $1.20 es confiable? | NO verificado. Requiere spike con precios actuales |

---

## 3. ESTADO ACTUAL DEL PROYECTO

### 3.1 Codigo existente en AI-Studio (verificado)

```
PHASE 1 (Pre-produccion): IMPLEMENTADO
  docx_parser.py       - 435 lineas, 3 modos, sanitizador
  models_dubbing.py    - 125 lineas, Pydantic schemas

PHASE 2 (Produccion): IMPLEMENTADO
  dubbing_routes.py    - 129 lineas, 11 endpoints REST
  dubbing_service.py   - 304 lineas, logica de negocio
  elevenlabs.py        - 880 lineas, wrapper async completo
  alignment_engine.py  - 120 lineas, fuzzy match
  Frontend dubbing     - 14 componentes React, 4 modos

PHASE 2.5 (ERP - parcial, DESCONECTADO):
  dubbing_pipeline.py  - 284 lineas, WER (Levenshtein), cost estimation
  prescanner.py        - 378 lineas, heuristicas + Gemini Flash LLM
  SQL schema           - dubbing_jobs + dubbing_tracks (wer_score columna)
  30 tests unitarios   - test_dubbing_pipeline.py

PHASE 3 (QA Automation): NO EXISTE
  audit_service.py        = NO EXISTE
  validate_speakers.py    = NO EXISTE
  Dashboard QA            = NO EXISTE
  Dual STT integration    = NO EXISTE
```

### 3.2 Los 3 problemas estructurales criticos

**PROBLEMA #1: Dos sistemas paralelos desconectados**

```
  API Layer (Phase 2)            ERP Layer (Phase 2.5)
  dubbing_routes.py (129L)       dubbing_pipeline.py (284L)
  dubbing_service.py (304L)      prescanner.py (378L)
  elevenlabs.py (880L)           test_dubbing_pipeline.py
       |                              |
  Endpoints REST                 WER computation
  CRUD ElevenLabs                Cost estimation
  Upload Video/Script            Pre-scan heuristics
       |                              |
       +------------ GAP -------------+
              NO SE CONECTAN
```

**PROBLEMA #2: API de ElevenLabs cambio (dic 2024 vs feb 2026)**

| Feature | Dic 2024 | Feb 2026 | Impacto |
|:--------|:---------|:---------|:--------|
| Manual Dub CSV | "Holy Grail" viable | "Experimental, production use strongly discouraged" | CSV NO es la solucion |
| Dubbing Resource API | Basica | Suite CRUD completa de segments | REEMPLAZA al CSV |
| Forced Alignment | No existia | ACTIVO, 150+ idiomas | NUEVO para drift detection |
| from_content_json | No existia | Requiere ventas (bloqueado en Pro) | BLOQUEADO |
| STT Scribe v1 | 29 idiomas | 90+ idiomas, entity detection | Mucho mas potente |

**PROBLEMA #3: Cero metricas operativas**
- WER: "No, no la medimos" (Q8, L169)
- Tasa de error por idioma: "No tienen" (Q8, L174)
- Tiempo de dubbing completo: "No sabe" (Q8, L190)

### 3.3 Bugs conocidos

| Severidad | Archivo | Bug |
|:----------|:--------|:----|
| **P0** | `dubbing_pipeline.py` | `run_prescanner_for_job()` crashea si `prescan_script()` retorna None |
| **P1** | `dubbing_pipeline.py` | `WERResult.language` siempre default a ES |
| **Info** | `elevenlabs.py` | No tiene Dubbing Resource API ni Forced Alignment |

---

## 4. ARQUITECTURA TARGET

### 4.1 Diagrama de flujo completo

```
INPUTS:
  .docx (Andrea)  +  manifest.json (Ramon)  +  MP4 Final (Fernando)
       |                    |                        |
       v                    v                        v
=== FASE 0: INGESTION Y RE-ALIGNMENT (AI-Studio) ==================
       |                    |                        |
  docx_parser.py      manifest import         Whisper STT
  (435L, existe)      (ya existe)              (nuevo)
       |                    |                        |
       +--------------------+------------------------+
                            |
                   alignment_engine.py (120L, existe)
                   fuzzy match guion <-> audio real
                            |
                   Holy Grail Data:
                   speaker + start + end + transcript
                            |
=== FASE 1: PRE-SCAN =============================================
                            |
                   prescanner.py (378L, existe)
                   + blacklist JSONs (Doge-MultiLang)
                            |
                   status = pass / warn / block
                            |
              block? -------+------- pass/warn
              |                         |
        STOP: humano                    |
        debe resolver                   |
                                        |
=== FASE 2: GENERACION (ElevenLabs API) ===========================
                                        |
              POST /v1/dubbing          Dubbing Resource API
              (dubbing_studio=true)     (segment CRUD, NUEVO)
              (ya en elevenlabs.py)     (agregar a elevenlabs.py)
                         |                       |
                    ES -> EN (master)            |
                    EN -> Tier 1 (PT,FR,DE)      |
                    EN -> Tier 2 (AR,KO,JA,HI,ZH)|
                    EN -> Tier 3 (resto)         |
                         |                       |
                         +-----------+-----------+
                                     |
                        Audio generado x N idiomas
                                     |
=== FASE 3: VALIDACION POST-GENERACION ============================
                                     |
              +----------------------+----------------------+
              |                      |                      |
         Whisper STT           Forced Alignment       ElevenLabs STT
         (OpenAI)              (ElevenLabs, NUEVO)    (Scribe, gratis)
         $0.006/min            150+ idiomas            Pre-check Tier 1
              |                      |                      |
              v                      v                      v
              +----------- audit_service.py (NUEVO) --------+
              |  wer_calculator  |  timing_checker  |  classifier  |
              +----------------------------------------------------+
                                     |
              +----------------------+----------------------+
              |                      |                      |
         HIGH CONFIDENCE        MEDIUM                 LOW CONFIDENCE
         WER < 5%               WER 5-15%              WER > 15%
              |                      |                      |
         AUTO-APROBAR           REVISION RAPIDA        REVISION OBLIGATORIA
              |                      |                      |
              +----------------------+----------------------+
                                     |
                              OUTPUT FINAL:
                              audio.mp4 + qa_report.json
                              por idioma por episodio
```

### 4.2 Principios arquitectonicos adoptados

1. **MP4 de Fernando = SSOT de audio** (Guion Zombie: el docx de Andrea esta "muerto" despues de la edicion de Fernando)
2. **ES -> EN -> Resto** (cadena en cascada; EN se valida al 100% humano)
3. **Validacion por Tiers:**
   - Tier 1 (EN, PT-BR, FR, DE): WER < 5%, revision humana obligatoria
   - Tier 2 (AR, KO, JA, HI, ZH): WER < 10%, muestreo inteligente
   - Tier 3 (resto): WER < 15%, solo automatico
4. **Dubbing Resource API reemplaza CSV manual** (ElevenLabs marca CSV como "experimental")
5. **Whisper primario, Gemini solo en investigacion** (segmentos con WER > umbral)
6. **Sin manifest valido, pipeline se bloquea** (GS-04 de Codex)
7. **Toda correccion deja traza** (GS-05 de Codex: quien/cuando/por que)

---

## 5. ESTRATEGIA DE API ELEVENLABS

### APIs a USAR

| API | Funcion | Implementada? | Esfuerzo |
|:----|:--------|:--------------|:---------|
| POST /v1/dubbing | Crear proyecto | SI (elevenlabs.py) | 0h |
| Dubbing Resource API | Control granular segments | NO | 6h |
| Forced Alignment | Validar timestamps post-dubbing | NO | 3h |
| STT Scribe v1 | Pre-check Tier 1 (gratis en Pro) | PARCIAL | 2h |
| Whisper API (OpenAI) | WER formal post-generacion | NO | 3h |
| GET transcript | Input para validacion | SI (elevenlabs.py) | 0h |

### APIs a NO USAR

| API | Razon |
|:----|:------|
| Manual Dub CSV | "Experimental, production use strongly discouraged" |
| from_content_json | Bloqueado en plan Pro (requiere ventas) |
| Text-to-Dialogue v3 | Alpha con restriccion comercial |

---

## 6. PLAN DE INTEGRACION

### Conectar dubbing_pipeline.py con dubbing_service.py

```
ANTES (desconectados):
  dubbing_routes.py --- dubbing_service.py --- elevenlabs.py --- ElevenLabs API
  dubbing_pipeline.py --- prescanner.py --- Gemini Flash

DESPUES (integrados):
  dubbing_routes.py
       |
  dubbing_service.py  <---- ADAPTADOR ----> dubbing_pipeline.py
       |                                          |
  elevenlabs.py                              prescanner.py
       |                                          |
  ElevenLabs API                            Gemini Flash
```

**Acciones concretas:**
1. Fix P0: null check en prescanner (1h)
2. Fix P1: language propagation en WERResult (30min)
3. Crear adaptador en dubbing_service.py: `pre_scan_before_create()`, `compute_wer_after_generation()`, `estimate_cost()` (4h)
4. Agregar hooks en dubbing_routes.py (2h)
5. Unificar schema SQL (1h)

**Total integracion: ~8.5h**

---

## 7. ROADMAP DE IMPLEMENTACION

### Resumen por fases

| Fase | Semanas | Horas | Entregable Principal |
|:-----|:--------|:------|:---------------------|
| **Phase 0** | 1 | 12-15h | Bugs corregidos, sistemas conectados, episodio E2E probado |
| **Phase 1** | 2-3 | 34-46h | audit_service + prompt_scanner + WER medido x 27 idiomas |
| **Phase 2** | 4-6 | 39-49h | validate_speakers + 24 blacklists + Dubbing Resource API |
| **Phase 3** | 7-10 | 40-50h | Flujo E2E sin Web UI + batch + dashboard |
| **Phase 4** | 11+ | 50-64h | ROI por idioma + tropicalizacion + analytics |
| **TOTAL** | | **175-224h** | De 0% a ~100% cobertura QA automatizado |

### Phase 0: Quick Wins (Semana 1, 12-15h)

| # | Entregable | Esfuerzo | Metrica de exito |
|:--|:-----------|:---------|:-----------------|
| 0.1 | Fix P0: crash prescanner | 1h | prescanner nunca crashea en None |
| 0.2 | Fix P1: WERResult.language | 1h | WERResult refleja idioma real |
| 0.3 | Integrar pipeline <-> service | 6-8h | WER se computa y guarda automaticamente |
| 0.4 | Verificar PR #71 + E2E test | 2-3h | Un episodio pasa sin intervencion manual |
| 0.5 | Limpieza repo (.gitignore, CLAUDE.md) | 2h | git status limpio, 43MB docx ignorado |

### Phase 1: QA Pipeline (Semanas 2-3, 34-46h)

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| 1.1 | prompt_scanner.py (extiende prescanner + blacklists) | 5h |
| 1.2 | whisper_client.py (wrapper OpenAI, chunking, retry, cache) | 4h |
| 1.3 | wer_calculator.py (jiwer, normalizacion por idioma) | 2-3h |
| 1.4 | timing_checker.py (delta% duracion, umbral +20%) | 2h |
| 1.5 | audit_service.py (orquestador QA central, tiering) | 10-14h |
| 1.6 | Forced Alignment en elevenlabs.py | 3-4h |
| 1.7 | Endpoints API de auditoria (4 nuevos) | 5h |
| 1.8 | Modelo de datos SQL (audit_jobs + audit_results) | 3h |

### Phase 2: Speaker Detection + Blacklists (Semanas 4-6, 39-49h)

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| 2.1 | validate_speakers.py (fuzzy match vs manifest) | 10-12h |
| 2.2 | Dubbing Resource API en elevenlabs.py | 6-8h |
| 2.3 | 24 blacklists faltantes (LLM draft + revision nativa) | 16-20h |
| 2.4 | validate_blacklists.py (CI check en Doge-MultiLang) | 3h |
| 2.5 | Integrar alignment_engine con audit_service | 4-6h |

### Phase 3: Automatizacion Completa (Semanas 7-10, 40-50h)

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| 3.1 | Flujo E2E via API (sin Web UI) | 14-18h |
| 3.2 | Batch processing (cola, rate limits, prioridad por tier) | 8-10h |
| 3.3 | Dashboard QA minimo (badges, reportes, filtros) | 10-14h |
| 3.4 | Onboarding + guia para Alan | 4h |
| 3.5 | benchmark_costs.py (costo real por episodio) | 4h |

### Phase 4: Avanzado (Semanas 11+, 50-64h)

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| 4.1 | ROI Dashboard por idioma (YouTube Analytics + costos) | 16-20h |
| 4.2 | Tropicalizacion automatica (mappings culturales) | 12-16h |
| 4.3 | Analisis de audio avanzado (LUFS, clipping, consistencia) | 8-10h |
| 4.4 | Reporte automatico por episodio (13 pistas) | 6-8h |
| 4.5 | Metricas historicas y tendencias | 8-10h |

### Archivos a crear/modificar

**En Doge-MultiLang:**
```
.gitignore                                    (Phase 0)
CLAUDE.md                                     (Phase 0)
scripts/validate_blacklists.py                (Phase 2)
scripts/benchmark_costs.py                    (Phase 3)
knowledgebase/blacklists/blacklist_en.json    (Phase 2)
knowledgebase/blacklists/blacklist_pt.json    (Phase 2)
knowledgebase/blacklists/blacklist_fr.json    (Phase 2)
  ... +21 archivos mas de blacklist ...
knowledgebase/cultural_mappings/tropicalizacion.json (Phase 4)
docs/guides/guia_dubbing_ai_studio.md         (Phase 3)
```

**En AI-Studio:**
```
services/creative/content_erp/prescanner.py        (Phase 0 - fix bug)
services/creative/content_erp/dubbing_pipeline.py  (Phase 0 - fix bug)
services/dubbing_service.py                        (Phase 0 - integrar)
services/creative/prompt_scanner.py                (Phase 1 - nuevo)
services/stt/whisper_client.py                     (Phase 1 - nuevo)
services/qa/wer_calculator.py                      (Phase 1 - nuevo)
services/qa/timing_checker.py                      (Phase 1 - nuevo)
services/qa/audit_service.py                       (Phase 1 - nuevo)
services/qa/validate_speakers.py                   (Phase 2 - nuevo)
services/model_gateway/providers/elevenlabs.py     (Phase 1+2 - extender)
api/v1/creative/dubbing_routes.py                  (Phase 1 - agregar endpoints)
services/creative/batch_dubbing.py                 (Phase 3 - nuevo)
services/creative/tropicalizer.py                  (Phase 4 - nuevo)
services/qa/audio_analyzer.py                      (Phase 4 - nuevo)
services/analytics/language_roi.py                 (Phase 4 - nuevo)
```

---

## 8. MATRIZ DE RIESGOS Y GAPS

### P0 - CRITICO

| ID | Riesgo/Gap | Impacto | Mitigacion | Owner | Esfuerzo |
|:---|:-----------|:--------|:-----------|:------|:---------|
| R-001 | PR #71 potencialmente stale (14 meses) | Toda la premisa "solo falta Phase 3" se derrumba | Verificar, ejecutar E2E con episodio real | Daniel | 2-4h |
| R-002 | API ElevenLabs desactualizada vs KB dic 2024 | Holy Grail CSV NO viable; from_content_json BLOQUEADO | Spike tecnico 1 dia con API actual | Daniel | 8h |
| R-003 | Bug P0: prescanner crash en None | Pipeline ERP inutilizable | Guard clause + test unitario | Daniel | 1h |
| G-001 | pipeline.py y service.py DESCONECTADOS | WER y prescanning existen pero no se ejecutan | Crear adaptador en service.py | Daniel | 8h |

### P1 - ALTO

| ID | Riesgo/Gap | Impacto | Mitigacion | Owner | Esfuerzo |
|:---|:-----------|:--------|:-----------|:------|:---------|
| R-004 | Levantamientos NO validados (70-80% confianza) | Prioridades pueden estar mal ordenadas | Entrevistas: 30min Saul/Ivan + 30min Fernando | Daniel | 2-3h |
| R-005 | 24/27 idiomas sin blacklist (contenido infantil!) | Contenido inapropiado llega a millones de ninos | LLM drafts + revision de nativos | Daniel + team | 2-3 dias |
| R-006 | Validacion Tier 2/3 imposible sin hablantes nativos | "Confianza ciega en ElevenLabs" | Spot-checks mensuales + evaluar pausar idiomas | Management | Decision |
| R-007 | Bug P1: WERResult.language = ES siempre | Metricas por idioma inservibles, tiering roto | Fix propagacion de parametro | Daniel | 30min |
| R-008 | 27 idiomas sin datos de ROI | Posible pasivo financiero sin detectar | YouTube Analytics + costo por idioma | Daniel + Mgmt | 4h |
| R-009 | Andrea "confia plenamente" = sesgo QA | Gate de calidad = rubber-stamping | audit_service.py como capa independiente | Daniel | 10h |
| R-010 | Saul/Ivan pueden rechazar AI-Studio | Phase 1+2 inutilizadas | Demo 1h con episodio real antes de onboarding | Daniel | 2h |

### P2 - MEDIO

| ID | Riesgo/Gap | Impacto | Mitigacion |
|:---|:-----------|:--------|:-----------|
| R-011 | Fernando podria NO poder exportar stems | Opcion A muere, 100% Opcion B | Preguntar en entrevista R-004 |
| R-012 | Fuzzy match falla en ad-libs de Fernando | Personaje A habla con voz de B | Manejar "linea sin match" explicitamente |
| R-013 | Whisper precision baja en Tier 3 (TA, MS, FIL) | Falsos positivos masivos en auditoria | Benchmark Whisper antes de usar como juez |
| R-014 | Costo $1.20/proyecto no verificado | ROI proyectado puede estar inflado | Verificar precios actuales |
| G-002 | No existe plan de rollback | Episodio bloqueado si AI-Studio falla | Documentar procedimiento de emergencia |
| G-003 | PRD_FINAL y claude_debate coexisten como planes | Confusion para el equipo | ADR que cierre formalmente |
| G-004 | 9/13 pistas del checklist fuera del scope de dubbing | Expectativas infladas sobre automatizacion | Documentar alcance real |
| G-005 | Discrepancia numerica: 16 vs 17 vs 27 idiomas | No se puede planear recursos | Definir lista canonica |
| G-006 | Docx 43MB sin .gitignore | Infla el repo permanentemente | Agregar a .gitignore inmediato |

### P3 - BAJO

| ID | Riesgo/Gap |
|:---|:-----------|
| R-015 | ElevenLabs puede no ser el mejor proveedor en feb 2026. Benchmark anual Q2 2026 |
| G-007 | No hay datos de quejas de audiencia por idioma |
| G-008 | Blacklists duplicadas en docs/levantamientos/ y knowledgebase/blacklists/ |
| G-009 | Blacklist global solo tiene 6 palabras |
| G-010 | No existen CLAUDE.md, requirements.txt, ni ejemplos JSON |

---

## 9. REGISTRO DE ASUNCIONES

| ID | Asuncion | Confianza | Verificable? |
|:---|:---------|:----------|:-------------|
| A-001 | Phase 1+2 estan implementadas y funcionales en AI-Studio | **BAJA (30%)** | Si: ejecutar E2E |
| A-002 | alignment_engine.py funciona (120L verificadas) | **MEDIA (60%)** | Si: test con datos reales |
| A-003 | PR #71 es mergeable sin trabajo significativo | **MUY BAJA (15%)** | Si: abrir PR en GitHub |
| A-004 | Dubbing Resource API funciona con plan Pro | **MEDIA (50%)** | Si: test con API key |
| A-005 | Costo QA ~$1.20/proyecto | **BAJA (35%)** | Si: verificar precios actuales |
| A-006 | Fernando puede exportar stems por personaje | **MUY BAJA (20%)** | Si: preguntar a Fernando |
| A-007 | Saul/Ivan quieren migrar a AI-Studio | **DESCONOCIDA** | Si: demo + feedback |
| A-008 | Las 7 Mudas estan bien priorizadas | **MEDIA-BAJA (40%)** | Si: entrevista directa |
| A-009 | Whisper audita calidad en 27 idiomas | **BAJA (25%)** para Tier 3 | Si: benchmark TA, MS, FIL |
| A-010 | 27 idiomas es el numero correcto | **MEDIA (50%)** | Si: YouTube Analytics |
| A-011 | Flujo creativo no va a cambiar | **ALTA (80%)** | No: hablar con management |
| A-014 | Fuzzy match alignment funciona con precision suficiente | **DESCONOCIDA** | Si: test con episodio con ad-libs |
| A-015 | Doge-MultiLang = repo de config, no de pipeline | **ALTA (75%)** | No: decision arquitectural |
| A-016 | Audiencia QPH = ninos 8-15 anos | **ALTA (85%)** | No: datos demograficos YouTube |
| A-017 | Q1, Q2, Q7 vacios no contienen info critica faltante | **BAJA (30%)** | Si: llenar cuestionarios |
| A-019 | Cadena ES -> EN -> resto es la correcta | **ALTA (80%)** | Parcialmente: confirmar con Saul/Ivan |

---

## 10. LOG DE DECISIONES PENDIENTES

| ID | Decision | Opciones | Quien decide | Deadline |
|:---|:---------|:---------|:-------------|:---------|
| D-001 | Greenfield parcial o extension AI-Studio? | A) Extender (~28h) B) Reconstruir (~60h) | Daniel (tras R-001) | Antes de escribir codigo |
| D-002 | Cuantos idiomas en MVP Phase 3? | A) Tier 1 (5) B) Tier 1+2 (10) C) Todos (27) | Daniel + Mgmt (tras R-008) | Despues de ROI |
| D-003 | CSV Manual vs Dubbing Resource API? | A) CSV (experimental) B) Resource API (soportado) | Daniel (tras R-002) | Despues de spike |
| D-004 | Opcion A (Stems) o B (Re-Alignment)? | A) Stems B) Re-Alignment C) Ambos | Daniel + Fernando | Despues de R-004 |
| D-005 | Pausar idiomas de bajo ROI? | A) Mantener 27 B) Pausar bajo ROI C) Degradar a solo automatico | Management | Despues de R-008 |
| D-006 | Quien resuelve bugs AI-Studio en produccion? | A) Daniel SLA B) Saul/Ivan rollback C) On-call | Daniel + Mgmt | Antes de onboarding |
| D-007 | Upgrade plan ElevenLabs a Enterprise? | A) Quedarse Pro B) Upgrade C) Negociar parcial | Management | Despues de R-002 |

---

## 11. MAPA DEL REPOSITORIO

### Inventario: 79 archivos

| Categoria | Cantidad | Tamano total |
|:----------|:---------|:-------------|
| SSOT (fuentes de verdad) | 33 | ~900KB |
| DRAFT (borradores) | 21 | ~280KB |
| LEGACY (dic 2024, historico) | 17 | ~145KB |
| REDUNDANT (duplicados) | 3 | ~6.5KB |
| OPINION (debate multi-AI) | 4 | ~65KB |
| CONFIG | 1 | 510B |
| **Total** | **79** | **~48MB** (43MB es el docx) |

### Estado: 10 commiteados, 70 sin rastrear

**URGENTE:** 70 de 79 archivos estan UNTRACKED. Un `git clean` pierde casi toda la documentacion.

### Archivos faltantes criticos

| Archivo | Prioridad |
|:--------|:----------|
| `CLAUDE.md` | CRITICA |
| `requirements.txt` / `pyproject.toml` | ALTA |
| Cualquier script en `scripts/` | ALTA |
| `.github/ISSUE_TEMPLATE/` | MEDIA |
| Schemas JSON de ejemplo | MEDIA |

### Recomendaciones de limpieza

1. **Agregar docx al .gitignore** (43MB bomba para git)
2. **Eliminar 3 blacklists duplicadas** en `docs/levantamientos/` (ya existen en `knowledgebase/blacklists/`)
3. **Mover `planchado.py`** de `docs/levantamientos/` a `scripts/`
4. **Mover WAVE_* y PRD_FINAL** a `docs/waves/`
5. **Reescribir `docs/levantamientos/README.md`** (es artefacto de AI-Studio, no de este repo)
6. **Commitear los 70 archivos** antes de que se pierdan

### Rol definido de Doge-MultiLang

Este repo NO contiene el pipeline principal. Ese vive en AI-Studio. Doge-MultiLang es:
1. **Configuracion:** Blacklists, mappings culturales, glossarios
2. **Documentacion:** Levantamientos, planes, specs, debates
3. **Scripts auxiliares:** Benchmarks, validaciones, analisis one-off
4. **Knowledgebase:** KB de ElevenLabs (dic 2024, referencia historica)

---

## 12. ACCIONES INMEDIATAS

### Secuencia recomendada

**Semana 1 (verificacion -- CERO codigo nuevo):**

| Dia | Accion | Riesgo que resuelve |
|:----|:-------|:--------------------|
| 1 | Verificar PR #71, ejecutar pipeline E2E | R-001 |
| 1 | Fix bugs P0 y P1 | R-003, R-007 |
| 2 | Spike tecnico API ElevenLabs actual | R-002 |
| 2 | Limpieza repo: .gitignore, CLAUDE.md, commit 70 archivos | G-006, G-010 |
| 3 | Entrevistas: 30min Saul/Ivan + 30min Fernando | R-004, R-011 |
| 3 | Tomar decisiones D-001, D-003, D-004 | - |

**Semana 2 (fundamentos):**
1. Integrar dubbing_pipeline con dubbing_service (G-001, 8h)
2. Crear blacklists Tier 1 (R-005, 2 dias)
3. Extraer datos ROI por idioma (R-008, 4h)
4. Tomar decisiones D-002, D-005

**Semana 3+ (implementacion Phase 1):**
1. audit_service.py (10h)
2. Agregar Dubbing Resource API a elevenlabs.py (6h)
3. Endpoints de auditoria (5h)
4. Demo con Saul/Ivan (R-010)

### Lo que se descarta definitivamente

1. PRD_FINAL.md (18 scripts greenfield) -- **SUPERSEDED**
2. Crear `docx_parser.py` desde cero -- ya existe (435L en AI-Studio)
3. Crear `elevenlabs_api_client.py` desde cero -- ya existe (880L)
4. Estimar 75h de trabajo greenfield -- el trabajo real es integracion
5. Manual Dub CSV como solucion permanente -- consenso de 3 opiniones
6. Asumir "IMPLEMENTADO" = funcional en produccion -- verificar primero

---

## NOTA METODOLOGICA

Este documento fue producido por un mega swarm de 15 agentes Claude:

**Wave 1 (10 agentes lectores):** Cada agente leyo un subconjunto de los 79 archivos del repo y produjo una extraccion estructurada.

**Wave 2 (5 agentes sintetizadores Opus):**
1. **Opinion Consensus Matrix** -- Cruzo las 4 opiniones AI y produjo consensos/disensos
2. **Technical Architecture** -- Analizo codigo existente y produjo la arquitectura target
3. **Implementation Roadmap** -- Leyo specs y produjo el roadmap de 5 fases
4. **Risk & Gap Matrix** -- Consolido riesgos de todas las fuentes en matriz priorizada
5. **Repo Map & Inventory** -- Catalogo los 79 archivos con categorias y recomendaciones

**Consolidacion:** El orquestador integro los 5 outputs en este documento final.

La mayor contribucion de cada perspectiva: Claude aporta **HECHOS**, Devil's Advocate aporta **PRUDENCIA**, Codex aporta **ESTRUCTURA**, Gemini aporta **TACTICAS**. El plan optimo necesita las cuatro dimensiones.
