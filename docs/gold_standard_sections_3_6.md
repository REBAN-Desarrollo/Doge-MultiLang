# GOLD STANDARD: Secciones 3-6

| Campo | Valor |
|:------|:------|
| **Version** | v1.0 |
| **Fecha** | 2026-02-20 |
| **Secciones** | 3, 4, 5, 6 |
| **Autor** | Architecture Synthesizer Agent (Claude Opus 4.6) |
| **Fuentes** | Claude Pipeline Debate, Mega Propuesta Final, Codex Gold Standard Unificado, Gemini Deep Thinking Audit, Gemini 3.1 PRO Audit, MEGA BARRIDO 10 Agentes, Gaps Pendientes, gold_standard_workflow, gold_standard_sections_1_4, gold_standard_sections_5_7, gold_standard_sections_8_9 |

---

## SECCION 3: ESTADO REAL DEL SISTEMA

### 3.1 Codigo Existente en AI-Studio (verificado)

Inventario completo verificado por 6 agentes que leyeron el codigo fuente de AI-Studio. Los paths del master plan (dic 2024) no coinciden con los paths reales, pero los archivos existen. Los nombres en la tabla reflejan la ubicacion real en el repositorio AI-Studio.

| Componente | Archivo real | Lineas | Status | Notas |
|:-----------|:-------------|:-------|:-------|:------|
| Script Parser (docx) | `services/process/docx_parser.py` | 435 | Phase 1 - IMPLEMENTADO | 3 modos de parsing (estricto, flexible, raw). Sanitizador integrado ("no."->"no"). Metodo `to_elevenlabs_content_json()`. El swarm proponia crear uno nuevo desde cero -- innecesario. |
| Modelos Pydantic | `models_dubbing.py` | 125 | Phase 1 - IMPLEMENTADO | Schemas de datos para dubbing (jobs, tracks, segments). Base de validacion para pipeline. |
| Rutas API REST | `api/v1/creative/dubbing_routes.py` | 129 | Phase 2 - IMPLEMENTADO | 11 endpoints REST funcionales: CRUD proyectos, upload video/script, consultar estado, importar mappings de voz. |
| Servicio Dubbing | `dubbing_service.py` | 304 | Phase 2 - IMPLEMENTADO | Logica de negocio completa: crear proyecto, gestionar idiomas, manejar callbacks de ElevenLabs, CRUD de dubbing jobs. |
| Cliente ElevenLabs | `services/model_gateway/providers/elevenlabs.py` | 880 | Phase 2 - IMPLEMENTADO | Wrapper async completo: TTS, Dubbing, Studio, STT, Dialogue. Basado en API de dic 2024 -- NO tiene Dubbing Resource API, Forced Alignment ni Scribe v2. |
| Alignment Engine | `services/process/alignment_engine.py` | 120 | Phase 2 - IMPLEMENTADO | Fuzzy match Whisper-to-Manifest. SI EXISTE (verificado, resolviendo contradiccion del master plan que decia "Entregado Phase 3" pero Phase 3 = PENDIENTE). Es 1 de ~5 componentes necesarios para Phase 3 completa. |
| Frontend Dubbing | `apps/studio/src/app/dubbing/` | 14 componentes React | Phase 2 - IMPLEMENTADO | 4 modos: Video, Script, Manual, Smart. Selector de idiomas. Status badges. Tabs completas. |
| Pipeline ERP | `services/creative/content_erp/dubbing_pipeline.py` | 284 | Phase 2.5 - PARCIAL, DESCONECTADO | WER real (dynamic programming, Levenshtein sobre palabras, no placeholder). Cost estimation ($0.30/min EN/PT, ES gratis). Pre-scanner hook. Quality threshold: 15% WER default. |
| Pre-scanner | `services/creative/content_erp/prescanner.py` | 378 | Phase 2.5 - PARCIAL, DESCONECTADO | Heuristicas locales (modismos: "a huevo", "orale", "guey"; refs culturales: "OXXO", "IMSS"). LLM scan via Gemini Flash (OpenRouter). Proteccion anti-prompt-injection (`<SCRIPT>` tags). Cuenta `high_risk_count` por severity. |
| Schema SQL | tablas `dubbing_jobs` + `dubbing_tracks` | -- | Phase 2.5 - PARCIAL | Columnas: wer_score, cost, status, language. Base para metricas pero sin datos reales almacenados. |
| Tests unitarios | `test_dubbing_pipeline.py` | ~30 tests | Phase 2.5 - PARCIAL | Cobertura del pipeline ERP (dubbing_pipeline.py). No cubre integracion con API layer. |
| Voice Mapping | `/api/dubbing/import-mappings` | -- | Phase 2 - IMPLEMENTADO | Reutiliza mapeo Personaje -> VoiceID del modulo TTS existente. |

**Total codigo existente: ~2,675 lineas en 7 archivos backend + 14 componentes frontend + 30 tests unitarios.**

---

### 3.2 WARNING: "Implementado" != Funcional

Este es el hallazgo mas critico de todo el analisis cruzado. Las 10 fuentes analizadas convergen en un punto: la existencia de codigo verificado NO equivale a un sistema funcional en produccion.

#### Evidencia A FAVOR de funcionalidad

Hallazgos de Claude Pipeline Debate v3 (6 agentes verificadores):

- Los archivos existen y tienen las lineas reportadas. Los paths reales difieren de los del master plan, pero el codigo es real.
- `docx_parser.py` tiene 3 modos de parsing funcionales y un sanitizador integrado.
- `elevenlabs.py` es un wrapper async completo de 880 lineas con soporte para TTS, Dubbing, Studio, STT y Dialogue.
- `alignment_engine.py` SI EXISTE (120 lineas, fuzzy match), resolviendo la contradiccion interna del master plan.
- `dubbing_pipeline.py` tiene WER computation REAL (dynamic programming, Levenshtein sobre palabras, no placeholder) y 30 tests unitarios.
- `prescanner.py` tiene heuristicas locales funcionales y scan LLM con proteccion anti-prompt-injection.
- El esquema SQL ya tiene columnas para `wer_score`, indicando que la intencion de medir calidad existia desde dic 2024.

#### Evidencia EN CONTRA de funcionalidad

Hallazgos del Sonnet Devil's Advocate, Codex Gold Standard, Gemini Deep Thinking, Gemini 3.1 PRO y MEGA BARRIDO:

1. **PR #71 lleva 14 meses sin merge.** Abierto en dic 2024, hoy feb 2026. No hay evidencia de que haya sido actualizado, revisado, o ejecutado en produccion. Si fuera funcional, estaria mergeado.
2. **Saul e Ivan siguen usando la Web UI de ElevenLabs directamente.** Confirmado en DUBBING_SAUL_IVAN.md (actualizado 2026-02-18): "ElevenLabs API: Objetivo - pendiente migracion." Si el modulo de AI-Studio fuera usable, no estarian en la Web UI.
3. **Cero episodios reales procesados** por el pipeline de AI-Studio. Nunca se ejecuto un test end-to-end con un episodio de produccion.
4. **La API de ElevenLabs cambio significativamente** entre dic 2024 y feb 2026. Forced Alignment, Dubbing Resource API (CRUD de segmentos), Scribe v2 con entity detection, Pronunciation Dictionaries, Audio Isolation, PVC Speaker Separation -- NINGUNO estaba disponible cuando se escribio `elevenlabs.py`. El wrapper de 880 lineas opera contra una API que ya no es la version mas eficiente.
5. **Confianza en Phase 1+2 estimada en 60-70%** por los agentes verificadores. Los items fueron verificados por lectura de codigo, no por ejecucion.

#### Bugs P0 y P1 documentados

| Severidad | Archivo | Bug | Detalle | Fix estimado |
|:----------|:--------|:----|:--------|:-------------|
| **P0** | `dubbing_pipeline.py` | `run_prescanner_for_job()` crashea si `prescan_script()` retorna None | Guard clause faltante. Si el prescanner no encuentra texto analizable (archivo vacio, formato inesperado), el pipeline entero se cae sin mensaje de error util. | 1h |
| **P1** | `dubbing_pipeline.py` | `WERResult.language` siempre default a ES | Aunque se pase otro idioma como parametro, el resultado WER se almacena con language="ES". Esto hace que las metricas por idioma sean inservibles y el tiering (que depende de umbrales por idioma) este roto. | 30min |
| **Info** | `elevenlabs.py` | No tiene Dubbing Resource API, Forced Alignment, Scribe v2 ni Pronunciation Dictionaries | El wrapper fue escrito para la API de dic 2024. Faltan ~15 endpoints criticos identificados en las secciones 8.1 y 8.2 del gold standard. | 6h update |

#### Gap estructural: Pipeline desconectado de Service

Este es el hallazgo de integracion mas grave, identificado por Claude Pipeline Debate v3 y confirmado por el MEGA BARRIDO:

```
  API Layer (Phase 2)                    ERP Layer (Phase 2.5)
  =====================                  =======================
  dubbing_routes.py (129L)               dubbing_pipeline.py (284L)
  dubbing_service.py (304L)              prescanner.py (378L)
  elevenlabs.py (880L)                   test_dubbing_pipeline.py
       |                                      |
  Endpoints REST                         WER computation
  CRUD ElevenLabs                        Cost estimation
  Upload Video/Script                    Pre-scan heuristics
       |                                      |
       +------------- GAP CRITICO ------------+
                 NO SE CONECTAN
```

**Consecuencia:** Las funcionalidades mas valiosas del sistema (WER computation, cost estimation, pre-scanning con LLM) YA EXISTEN pero son INACCESIBLES desde el flujo principal de produccion. Un usuario que use la API REST de dubbing nunca dispara el prescanner ni obtiene un score WER. Son dos sistemas paralelos que operan en universos separados.

#### Desconexion entre ERP layer y API layer

La desconexion tiene 3 manifestaciones concretas:

1. **No hay adaptador:** `dubbing_service.py` no importa ni referencia `dubbing_pipeline.py`. No existe funcion puente como `pre_scan_before_create()` o `compute_wer_after_generation()`.
2. **Schemas SQL separados:** El API layer usa su propio esquema de datos. El ERP layer define `dubbing_jobs` + `dubbing_tracks` con columnas WER. No esta claro si comparten la misma base de datos.
3. **Flujo incompleto:** Cuando un usuario crea un proyecto via API, el resultado va a ElevenLabs y regresa. Pero el prescanner nunca escanea el texto, el WER nunca se computa, y el costo nunca se estima.

**Accion correctiva:** Crear adaptador en `dubbing_service.py` con 3 funciones: `pre_scan_before_create()`, `compute_wer_after_generation()`, `estimate_cost()`. Agregar hooks en `dubbing_routes.py` para invocar el adaptador. Unificar schema SQL si estan separados. Esfuerzo estimado: 8-8.5h.

**Conclusion operativa consolidada (todos los documentos):** Tratar todo el codigo existente como **HIPOTESIS CON EVIDENCIA PARCIAL** hasta completar un test E2E con un episodio real. La verificacion del PR #71 es la accion Dia 1, prioridad absoluta, antes de escribir una sola linea de codigo nuevo.

---

### 3.3 Phase 3: Lo que NO EXISTE

Todo lo siguiente esta disenado en el Anexo A del master plan pero tiene cero lineas de codigo implementadas. Esta tabla consolida lo que debe construirse desde cero.

| Componente faltante | Funcion | Impacto de la ausencia | Esfuerzo estimado |
|:---------------------|:--------|:-----------------------|:------------------|
| `audit_service.py` | Orquestador QA central: Dual STT (Whisper primario + Gemini/Scribe por excepcion), WER automatizado, clasificacion por umbral (AUTO-APROBAR / MUESTREO / REVISION OBLIGATORIA), tiering por idioma | QA es 100% manual. Cero metricas de calidad. Imposible detectar degradacion. | 10-14h |
| `validate_speakers.py` | Comparar pistas de audio detectadas vs personajes esperados en `voice_manifest.json`, alertar si hay mismatch de voz (Personaje A habla con voz de B) | Mezcla de voces pasa inadvertida. No existe gate para identidad de speaker. | 10-12h |
| Dashboard QA | Tablero Metabase con semaforo por idioma, tasa de error, FTR semanal, tendencias mensuales. Accesible a todo el equipo. | No hay visibilidad del estado de calidad. Solo Daniel tiene contexto tecnico. | 10-14h |
| Dual STT integration | Whisper large-v3 como primario + Deepgram Nova-3 o SenseVoice como segunda opinion (consenso). Scribe v2 para safety screening. | Sin "segunda opinion" para audio generado. Falsos positivos sin contencion. | 4-6h |
| 24 de 27 blacklists | Diccionarios de terminos prohibidos por idioma. Solo existen global (6 palabras), AR (5 palabras), DE (2 palabras). Total actual: 13 entradas. | 24 idiomas sin filtro de contenido inapropiado para audiencia infantil (8-15 anos). Riesgo COPPA/AVMSD/KCSC. | 2-3 dias |
| Pronunciation Dictionaries | Reglas IPA por personaje por idioma, archivos .PLS, versionados, workspace-shared via API de ElevenLabs | Nombres de personajes pronunciados incorrectamente. "Doge" se pronuncia diferente en cada idioma. Inconsistencia cross-episodio. | 3-4h |
| Dubbing Resource API (en elevenlabs.py) | Suite CRUD completa de segments: crear, editar, eliminar, transcribir, traducir, re-dubbing, render, migrate-segments, similar-voices | Re-render completo ($3+, minutos de espera) por un error de 1 segundo. Imposible hacer parcheo atomico. | 8-10h |
| Forced Alignment integration | Timestamps por palabra post-dubbing via `POST /v1/forced-alignment`. 29 idiomas (multilingual v2). | Sin deteccion de drift temporal. El "Guion Zombie" de Fernando no tiene resolucion automatica. | 3-4h |
| Content Safety layer | Capa 1: `use_profanity_filter` (nativo, $0). Capa 2: Scribe v2 `entity_detection: "offensive_language"`. Capa 3: LLM Safety Judge para casos ambiguos. | Riesgo regulatorio critico. Alucinaciones del TTS pueden generar contenido inapropiado sin deteccion. | 4-6h |
| Tropicalizacion automatica | `cultural_matrix_global.json` con mappings: onomatopeyas por idioma, registro de formalidad (du/Sie, tu/vous, banmal/jondaenmal), slang, sensibilidades culturales | Contenido suena extranjero/robotico en mercados locales. Contribuye a caida de AVD en CJK (-49%) y SEA (-48%). | 16-20h |
| Batch processing | Cola de procesamiento con rate limits, prioridad por tier, reintentos automaticos | Procesamiento de 27 idiomas es secuencial y manual. No hay paralelismo ni gestion de cola. | 8-10h |
| Metricas de naturalidad (MOS) | UTMOS/UTMOSv2 para predecir MOS score por segmento por idioma | No se sabe si el TTS suena robotico en algun idioma. La caida de AVD en CJK puede deberse a calidad acustica sin diagnosticar. | 4h |

**Total Phase 3 estimado: 100-130h de desarrollo.**

---

### 3.4 Estado de Doge-MultiLang (este repo)

Este repositorio NO contiene el pipeline principal de dubbing. El pipeline vive en AI-Studio. Doge-MultiLang es un repositorio de soporte con la siguiente composicion real:

| Categoria | Cantidad | Tamano | Descripcion |
|:----------|:---------|:-------|:------------|
| Documentacion (analysis/debate/docs) | 70+ archivos | ~300KB | Levantamientos, planes, specs, debates multi-AI, cuestionarios, workflows. Muy alta densidad documental. |
| Knowledgebase ElevenLabs | 150+ archivos (md/json/jsonl) | ~2.8MB | Snapshot de la API crawleado, actualizado a 2026-02-20. 735 entries. Referencia historica y tecnica. |
| Blacklists | 3 archivos JSON | ~6.5KB | `blacklist_global.json` (6 palabras), `blacklist_ar.json` (5 palabras), `blacklist_de.json` (2 palabras). Total: 13 entradas. |
| Scripts/utilidades locales | 4 archivos | ~10KB | `planchado.py` (separador de dialogos), `analysis_calc.py` (metricas), `transform.py` (procesamiento KB). Ninguno es un pipeline E2E de doblaje. |
| Config | Minima | ~510B | Sin carpeta de config operativa completa. Falta CLAUDE.md, requirements.txt, pyproject.toml, .github/ISSUE_TEMPLATE. |
| El docx de Andrea | 1 archivo | 43MB | Ejemplo real de guion. Deberia estar en .gitignore o LFS. |

**Hallazgo del MEGA BARRIDO:** Busqueda transversal de llamadas API no encontro `requests/httpx/axios` contra endpoints ElevenLabs en runtime local. `knowledgebase/transform.py` solo procesa URLs como texto. No hay clientes HTTP a ElevenLabs en ningun script de este repo.

**Rol definido de Doge-MultiLang (consenso de todas las fuentes):**

1. **Configuracion:** Blacklists por idioma, mappings culturales, glossarios, pronunciation dictionaries (archivos .PLS)
2. **Documentacion:** Levantamientos, specs, debates, planes, gold standard
3. **Scripts auxiliares:** Benchmarks, validaciones, analisis one-off (NO pipeline principal)
4. **Knowledgebase:** KB de ElevenLabs (referencia tecnica de la API)

**Lo que NO debe contener:** El pipeline de dubbing, el audit_service, el validate_speakers, ni ningun componente de runtime. Esos viven en AI-Studio.

**Estado de tracking en git:** 70 de 79 archivos estan UNTRACKED. Un `git clean` perderia casi toda la documentacion. Urgente: commit de archivos y configuracion de `.gitignore` para el docx de 43MB.

---

## SECCION 4: ARQUITECTURA TARGET (CONSENSO FINAL)

### 4.1 Principios Arquitectonicos Adoptados

Principios consolidados de las 10 fuentes analizadas. Cada principio tiene consenso de al menos 3 fuentes independientes.

#### GS-01: SSOT en 4 capas (Codex)

Toda la informacion del pipeline vive en 4 JSONs canonicos: `dialogue_objects.json` (texto/estructura), `voice_manifest.json` (casting por personaje), `timing_objects.json` (timing real reconciliado), `qa_report.json` (WER, drift, safety flags, decision). No hay fuente de verdad alternativa. Si un componente necesita datos, los lee del JSON correspondiente. Nunca del .docx, nunca de memoria, nunca de la GUI.

#### GS-02: Nada downstream lee docx directo (Codex)

El `.docx` de Andrea se procesa UNA vez por `docx_parser.py` y produce `dialogue_objects.json`. A partir de ahi, todo el pipeline consume JSON. El .docx es un artefacto de entrada. Despues del parseo, es "read-only historico". Cualquier correccion se hace en el JSON, no en el Word.

#### GS-03: API-first, GUI-fallback (Codex + Claude + Gemini)

La UI de ElevenLabs (Dubbing Studio) sirve para excepciones y control manual. El pipeline primario es programatico via API. El flujo normal es: script --> API --> resultado. La GUI es el plan B cuando algo falla y requiere intervencion visual humana. Consenso unanime de las 10 fuentes.

#### GS-04: Re-mapping manual prohibido (Codex)

Si no existe un `voice_manifest.json` valido que mapee cada personaje a su `voice_id` por idioma, el pipeline SE BLOQUEA. No se permite asignar voces "de memoria" o ad-hoc. Previene el error critico donde Personaje A habla con voz de Personaje B.

#### GS-05: Trazabilidad obligatoria (Codex)

Toda correccion de silencios, speaker boundary, o timing drift debe dejar registro de: fuente (`heuristic` | `reconciled` | `manual_override`), quien la hizo, cuando, y por que. Esto cumple el requisito de auditabilidad. Si un segmento tiene timing ajustado, el `qa_report.json` debe contener la traza completa.

#### MP4 de Fernando = SSOT de audio (Claude Mega Propuesta + Pipeline Debate)

Concepto "Guion Zombie": el `.docx` de Andrea esta "muerto" despues de la edicion de Fernando. Fernando recorta, ajusta tiempos, y modifica dialogos durante la mezcla. El MP4 final de Fernando es la UNICA fuente de verdad sobre lo que realmente se dice y cuando. El pipeline debe partir del audio real, no del guion original.

Implicacion: La "Transcription-First Architecture" disenada en el master plan es correcta: MP4 final de Fernando --> Whisper STT o Forced Alignment --> timestamps REALES con texto REAL --> fuzzy match con manifest de Ramon --> speaker identification --> proyecto de Dubbing con datos verificados.

#### ES->EN->Resto: Cadena en cascada con modificaciones DTR (Claude + Gemini)

La regla operativa actual es "NUNCA se traduce directamente de ES a otros idiomas; todo pasa por EN primero." Sin embargo, las 2 auditorias Gemini (Deep Thinking y 3.1 PRO) y el documento Gaps Pendientes demuestran que esta regla debe evolucionar con Dynamic Translation Routing:

- **Cluster A (Romance):** ES --> Target directo (PT, FR, IT, RO). Sin pasar por ingles.
- **Cluster B (Germanico):** ES --> Target directo + revision humana (DE, NL, SV).
- **Cluster C (Distante):** ES --> EN (con JSON enriquecido de metadatos) --> Target (EN, JA, KO, ZH, AR, HI, TR, etc.).

Detalle completo en Seccion 6 (Cadena de Traduccion Optimizada).

#### Validacion por Tiers (Claude + Codex + Gemini)

La inversion en QA debe ser asimetrica. Un dolar invertido en mejorar EN, DE o PT tiene 100x mas impacto que el mismo dolar invertido en TA o FIL.

| Tier | Idiomas | Revenue share | WER umbral | Revision humana | Modelo TTS |
|:-----|:--------|:--------------|:-----------|:----------------|:-----------|
| **Tier 1** | ES, EN, PT-BR, DE, IT, FR | ~94% | < 5% | SI, 100% | Eleven v3 |
| **Tier 2** | AR, KO, JA, HI, ZH, RU, TR | ~4% | < 10% | Muestreo 30% | Eleven v3 (CJK) / Flash v2.5 |
| **Tier 3** | ID, TH, VI, PL, UK, EL, TA, MS, FIL, SV, NL, RO + resto | ~2% | < 15% | Solo automatico | Flash v2.5 |

#### Dubbing Resource API reemplaza CSV (Claude + Codex + Gemini)

ElevenLabs marca el Manual Dub CSV como "experimental, production use strongly discouraged" (feb 2026). El master plan lo proponia como "Holy Grail Workflow." Consenso de 3 de 4 opiniones AI: CSV NO es pilar del pipeline. La Dubbing Resource API permite control granular post-creacion: crear, editar, eliminar, transcribir, traducir, re-dubbing por segmento. Costo de correccion pasa de ~$3.00 (re-render completo) a ~$0.01 (patch atomico de 3 segundos).

#### Trazabilidad obligatoria / Kaizen (Codex + Claude)

No solo GS-05 (registro de correcciones), sino un sistema completo de mejora continua: taxonomia MQM de errores, Mem0 para memoria de correcciones, feedback loop de audiencia (YouTube Analytics), captura de conocimiento tribal de Saul/Ivan, y ciclo PDCA semanal en la reunion OVEJA.

---

### 4.2 Diagrama de Flujo Completo (Pipeline E2E)

Este diagrama sintetiza y unifica:
- Claude Mega Propuesta: flujo de 4 fases (Ingestion, Pre-Scan, Generacion, Validacion)
- Gemini Deep Thinking: "Agile Dubbing Loop v2.0" (6 pasos, event-driven, cierre de ciclo con Forced Alignment)
- Codex Gold Standard: 4 capas SSOT + contratos de datos entre componentes
- Gold Standard Sections 5-7: 4 Gates mejorados (Pre-Flight, EN Master, Multi-Language, Audio Output)

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
                   Holy Grail Data:
                   speaker + start_ms + end_ms + transcript_real
                            |
=== PRE-SCAN (Gate 1: Pre-Flight) ===================================
                            |
                   prescanner.py (378L, existe) +
                   blacklist JSONs (27 idiomas, Doge-MultiLang) +
                   cultural_matrix_global.json (PCD) +
                   ElevenLabs use_profanity_filter (nativo, $0) +
                   Scribe v2 entity_detection ("offensive_language")
                            |
                   Checks: blacklist, modismos, onomatopeyas,
                   timing estimation, string length expansion,
                   formalidad, safety pre-screening
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
         /IT/RO         /SV + revision  JSON) -> JA/KO/ZH
         directo        humana (DE)     /AR/HI/TR/etc.
              |              |              |
              +--------------+--------------+
                             |
                   [Gate 2: EN Master Audit]
                   COMET > 0.85 + 3 LLM Judges +
                   GEMBA-MQM + Saul/Ivan revision 100%
                   SI EN FALLA: toda la cadena se detiene
                             |
                   [Gate 3: Multi-Language Audit]
                   Tier 1: COMET + 3 Judges + humano 100%
                   Tier 2: COMET + GEMBA-MQM + muestreo 30%
                   Tier 3: chrF++ + blacklist + safety (auto)
                             |
=== TTS GENERATION (Dubbing Resource API, ElevenLabs) ===============
                             |
              Audio Isolation limpia pistas maestras
              Pronunciation Dictionaries (.PLS) inyectados
              Model Tiering: Eleven v3 (Tier 1+2) / Flash v2.5 (Tier 3)
                             |
              POST /v1/dubbing (dubbing_studio=true)
              Dubbing Resource API (segment CRUD, NUEVO)
              Agregar idiomas sin regenerar todo
                             |
                   Audio generado x N idiomas
                             |
=== QA VALIDATION (Gate 4: Audio Output Verification) ===============
                             |
              +--------------+--------------+
              |              |              |
         Dual STT       Forced         Scribe v2
         Whisper+       Alignment      entity
         Deepgram       API (drift)    detection
              |              |              |
              v              v              v
              +------- audit_service.py (NUEVO) -------+
              |  wer_calculator  |  timing_checker     |
              |  mos_predictor   |  emotion_matcher     |
              |  speaker_verify  |  classifier          |
              +------------------------------------------------+
                             |
              +--------------+--------------+
              |              |              |
         HIGH CONF.     MEDIUM         LOW CONF.
         WER < 5%       WER 5-15%      WER > 15%
         MOS > 3.5      MOS 3.0-3.5   MOS < 3.0
              |              |              |
         AUTO-APROBAR   MUESTREO       REVISION
                        RAPIDO          OBLIGATORIA
              |              |              |
              +--------------+--------------+
                             |
=== POST-PRODUCCION & SSOT RE-ALIGNMENT =============================
                             |
              Fernando importa audio (tracks_zip/clips_zip/aaf)
              Mezcla final en DaVinci/ProTools/Premiere
              Exporta MP4 final
                             |
              [Forced Alignment API]
              MP4 final + texto --> timestamps reales
              Sobreescribe start_ms/end_ms en timing_objects.json
              Genera SRTs exactos para YouTube
              --> timing_objects.json (SSOT #3) actualizado
                             |
=== PUBLICACION ==================================================
                             |
              qa_report.json (SSOT #4) generado
              Registro completo: gates, metricas, errores,
              verdict, reviewed_by, tts_model_used
                             |
              OUTPUT FINAL:
              audio.mp4 + qa_report.json + subtitulos.srt
              por idioma por episodio
```

**Diferencias clave vs modelos anteriores:**

1. **Gates 1-2 son BLOCKING (critical path):** Sin Gate 1 aprobado, no se genera nada. Sin Gate 2 aprobado (EN master), no se procesan otros idiomas. Secuenciales y obligatorios.
2. **Gates 3-4 son ASYNC por idioma y por tier:** Cada idioma se procesa independientemente. Tier 3 puede publicar mientras Tier 1 espera revision humana. Un idioma BLOCKED no detiene a los demas. Arquitectura basada en eventos.
3. **Cierre del bucle (Post-Produccion -> SSOT):** En el modelo viejo, la base de datos moria cuando Fernando tocaba el audio. Ahora, Forced Alignment retroalimenta al sistema y sana el SSOT.
4. **DTR integrado:** La traduccion no es un pipeline lineal unico; es un router que selecciona la via optima por cluster linguistico.

---

### 4.3 Los 4 JSONs Canonicos (Codex SSOT)

Los 4 contratos de datos SSOT que conectan todos los componentes del pipeline. Cada JSON es propiedad de un proceso especifico y consumido por los demas como lectura. Los schemas exactos provienen de gold_standard_sections_5_7.md (Seccion 7.2).

---

#### 1. `dialogue_objects.json` -- Text SSOT

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

**Campos clave:** `line_id` (identificador unico global: `{episode}_{scene}_{line}`), `emotion` (se mapea a `audio_tags` de Eleven v3), `visual_context` (contexto inyectable como System Instructions al LLM traductor para Cluster C), `max_duration_ms` (permite calculo de string length expansion pre-TTS).

---

#### 2. `voice_manifest.json` -- Voice SSOT

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

**Campos clave:** `pronunciation_dictionary_id` (referencia al diccionario IPA de ElevenLabs que fija la pronunciacion de nombres propios globalmente), `voice_ids_by_lang` (mapeo explicito personaje->voz por idioma; GS-04 exige que exista y sea valido), `formality` (informa al LLM traductor el registro apropiado para este personaje).

---

#### 3. `timing_objects.json` -- Timing SSOT

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

**Campos clave:** `alignment_source` (trazabilidad GS-05: indica si el timing viene de heuristica, forced alignment API, o manual override), `drift_ms`/`drift_pct` (desviacion absoluta y relativa; Gate 4 flaggea si >200ms o >20%), `drift_source` (enum de `heuristic` | `reconciled` | `manual_override`; si es `manual_override`, debe existir campo adicional `override_by` y `override_reason`).

---

#### 4. `qa_report.json` -- QA SSOT

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
    "gate_2": {
      "status": "PASS",
      "comet_score": 0.91,
      "llm_judges": "3/3 PASS",
      "human_reviewer": "saul"
    },
    "gate_3": {
      "status": "PASS",
      "comet_score": 0.89,
      "gemba_mqm_errors": 1,
      "gemba_mqm_severity": "minor"
    },
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

**Campos clave:** `gates` (registro explicito del resultado de cada gate para este idioma), `mqm_total_points` (score acumulado del framework MQM adaptado: Minor=1pt, Major=5pt, Critical=25pt; umbral de aprobacion por tier), `tts_model_used` (trazabilidad del modelo TTS: Eleven v3 vs Flash v2.5), `reviewed_by` (`system` para automatico, nombre de persona para revision humana; GS-05 exige esta trazabilidad).

---

## SECCION 5: ESTRATEGIA ELEVENLABS API (Febrero 2026)

### 5.1 APIs a USAR

Tabla completa consolidada de gold_standard_sections_8_9.md, gold_standard_workflow.md, Mega Propuesta Final y MEGA BARRIDO. Incluye los 16 endpoints principales mas herramientas complementarias.

| # | API | Endpoint REAL | Metodo | Funcion | Status Actual | Esfuerzo |
|:--|:----|:-------------|:-------|:--------|:-------------|:---------|
| 1 | Dubbing Create | `/v1/dubbing` | POST multipart/form-data | Crear proyecto de doblaje completo a partir de video/audio + idioma target. `dubbing_studio: true` obligatorio para habilitar Resource API. | YA IMPLEMENTADO en `elevenlabs.py` (880L) | 0h |
| 2 | Get Dubbing Resource | `/v1/dubbing/resource/{dubbing_id}` | GET | Obtener estado completo del proyecto: segmentos, speakers, renders, idiomas | NO implementado | 2h |
| 3 | Create Segment | `/v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/segment` | POST application/json | Crear segmento nuevo con start/end time para un speaker. NO genera audio automaticamente | NO implementado | 1h |
| 4 | Update Segment | `/v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language}` | PATCH application/json | Modificar texto y/o tiempos de UN segmento en UN idioma especifico. NO regenera el dub | NO implementado | 1h |
| 5 | Delete Segment | `/v1/dubbing/resource/{dubbing_id}/segment/{segment_id}` | DELETE | Eliminar segmento completo de todas las lenguas | NO implementado | 0.5h |
| 6 | Transcribe Segments | `/v1/dubbing/resource/{dubbing_id}/transcribe` | POST application/json | Regenerar transcripciones para segmentos especificos. NO regenera traducciones ni dubs | NO implementado | 1h |
| 7 | Translate Segments | `/v1/dubbing/resource/{dubbing_id}/translate` | POST application/json | Regenerar traducciones para segmentos/idiomas especificos. Auto-transcribe faltantes. NO regenera dubs | NO implementado | 1h |
| 8 | Dub Segments | `/v1/dubbing/resource/{dubbing_id}/dub` | POST application/json | Regenerar audio doblado para segmentos/idiomas especificos. Auto-transcribe y traduce faltantes | NO implementado | 1h |
| 9 | Render Project | `/v1/dubbing/resource/{dubbing_id}/render/{language}` | POST application/json | Renderizar output final: mp4, aac, mp3, wav, aaf, tracks_zip, clips_zip con normalize_volume | NO implementado | 2h |
| 10 | Migrate Segments | `/v1/dubbing/resource/{dubbing_id}/migrate-segments` | POST application/json | Reasignar uno o mas segmentos a un speaker diferente en bulk | NO implementado | 1h |
| 11 | Get Similar Voices | `/v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/similar-voices` | GET | Top 10 voces similares a un speaker, con voice_id, nombre, descripcion y preview audio | NO implementado | 0.5h |
| 12 | Forced Alignment | `/v1/forced-alignment` | POST multipart/form-data | Alinear audio con texto: timing por caracter y por palabra con score de confianza (loss). 29 idiomas (multilingual v2) | NO implementado | 3h |
| 13 | Speech-to-Text (Scribe v2) | `/v1/speech-to-text` | POST multipart/form-data | Transcripcion con diarizacion, entity_detection (offensive_language), keyterm prompting, export a SRT/VTT, tag_audio_events. 90+ idiomas | PARCIAL (solo v1 en elevenlabs.py) | 2h |
| 14 | Pronunciation Dictionaries | `/v1/pronunciation-dictionaries/add-from-file` | POST multipart/form-data | Crear diccionario desde archivo .PLS con reglas IPA, versionado, workspace_access compartido | NO implementado | 3h |
| 15 | Audio Isolation | `/v1/audio-isolation` | POST multipart/form-data | Remover ruido de fondo del audio de Fernando. Retorna audio limpio como binary stream | NO implementado | 2h |
| 16 | PVC Speaker Separation | `/v1/voices/pvc/{voice_id}/samples/{sample_id}/separate-speakers` | POST | Separar speakers de audio multi-speaker (hasta 9 speakers por muestra). Opcion C del D-004 | NO implementado | 4h |

**Total esfuerzo de integracion API: ~25h** (distribuidas en Phases 1-3 del roadmap)

---

### 5.2 APIs Descubiertas (no mencionadas en debate previo)

Estas 8 capacidades NO fueron identificadas en ninguno de los documentos de debate previos (Claude Pipeline Debate, Codex Gold Standard, Sonnet Devil's Advocate, Gemini Multi-Opinion) ni en la Mega Propuesta original. Provienen del analisis directo de la referencia API de febrero 2026 en gold_standard_sections_8_9.md.

| # | API / Capacidad | Endpoint / Parametro | Impacto para QPH |
|:--|:---------------|:---------------------|:-----------------|
| 1 | **Render con tracks_zip / clips_zip / aaf** | `POST /v1/dubbing/resource/{dubbing_id}/render/{language}` con `render_type` = `tracks_zip`, `clips_zip`, o `aaf` | **ALTO.** Fernando obtiene stems por speaker + archivo AAF para importar directo a DaVinci Resolve o ProTools. Elimina la mezcla manual y permite correccion quirurgica por pista. Resuelve parcialmente D-004 sin depender de que Fernando exporte stems. |
| 2 | **use_profanity_filter [BETA]** | Parametro `use_profanity_filter: true` en `POST /v1/dubbing` | **ALTO.** Filtro nativo de profanidad que censura con `[censored]` en la transcripcion. Capa de safety GRATUITA ($0) para contenido infantil sin necesidad de herramientas externas. Activar inmediatamente (P0). |
| 3 | **STT Keyterm Prompting** | Parametro `keyterms: string[]` en `POST /v1/speech-to-text` (maximo 100 terminos, cada uno < 50 caracteres, <= 5 palabras) | **ALTO.** Forzar reconocimiento correcto de nombres de personajes QPH (Gabriel, Valentina, Doge, Michi) y terminos del universo narrativo. Elimina errores recurrentes de STT en nombres propios. |
| 4 | **STT export a SRT/VTT** | Parametro `additional_formats: [{format: "srt"}]` o `[{format: "vtt"}]` en `POST /v1/speech-to-text` | **MEDIO.** Generacion automatica de subtitulos por idioma como subproducto del pipeline de QA, sin trabajo adicional. Tambien soporta docx, html, pdf, segmented_json, txt. Beneficia SEO en YouTube. |
| 5 | **PVC Speaker Separation** | `POST /v1/voices/pvc/{voice_id}/samples/{sample_id}/separate-speakers` | **ALTO.** Separar el audio multi-speaker de Fernando programaticamente (hasta 9 speakers). Resuelve Opcion C del D-004 sin depender de que Fernando exporte stems manualmente. |
| 6 | **GET /v1/usage** | `GET /v1/usage` (inferido de arquitectura API) | **MEDIO.** Monitoreo de costos en tiempo real por workspace. Permite implementar alertas de presupuesto y calcular ROI por idioma automaticamente. |
| 7 | **target_accent [Experimental]** | Parametro `target_accent: string` en `POST /v1/dubbing` | **MEDIO.** Control de acento por idioma target. Ejemplo: `pt-br` vs `pt-pt`, `es-mx` vs `es-es`. Informa seleccion de voces y dialecto de traduccion preferido. |
| 8 | **Request Stitching** (patron cookbook) | Patron documentado para TTS: enviar `previous_text` y `next_text` como contexto entre chunks | **MEDIO.** Mantiene consistencia de prosodia y voz cuando se regeneran segmentos individuales post-correccion. Evita el efecto "audio parchado" entre segmentos editados y no editados. |

---

### 5.3 APIs a NO USAR

| API | Endpoint / Mecanismo | Razon de exclusion |
|:----|:---------------------|:-------------------|
| **Manual Dub CSV** | `POST /v1/dubbing` con `mode: "manual"` y `csv_file` | Marcado textualmente como "experimental and production use is strongly discouraged" en la documentacion oficial (feb 2026). El master plan lo proponia como "Holy Grail" pero la API evoluciono. Consenso de 3 de 4 opiniones AI: CSV NO es pilar del pipeline. Reemplazado por Dubbing Resource API. |
| **from_content_json** | Parametro en dubbing create | Bloqueado en plan Pro. Requiere contactar ventas de ElevenLabs para habilitar. Incompatible con el tier actual de QPH hasta que se negocie upgrade. Tratar como experimental/bloqueado hasta prueba real con cuenta. |
| **Text-to-Dialogue v3** | API separada (eleven_v3 dialogue) | En fase Alpha con restricciones comerciales. Ademas, Request Stitching NO esta disponible para este modelo. No usar en produccion hasta que salga de Alpha. |
| **auto_assign_voices** | Parametro fantasma | **NO EXISTE** como parametro en ningun endpoint documentado de la Dubbing API. El modelo Gemini Swarm lo alucino. Existe como feature en Studio API (audiobooks), NO en dubbing. La solucion correcta es usar `voice_manifest.json` (GS-04) + `disable_voice_cloning` para control de voz. Asuncion A-021 = FALSA (129 docs verificados). |

---

### 5.4 Contradicciones de Endpoints (del MEGA BARRIDO)

El MEGA BARRIDO de 10 agentes detecto 5 contradicciones criticas entre la documentacion interna del repo (docs legacy, master plan, debate) y la KB actual de la API de ElevenLabs. Cada contradiccion debe resolverse por smoke test ANTES de codificar.

#### 1. `resource` vs `resources`

- **Docs internas:** Algunos documentos usan `/v1/dubbing/resources/{id}` (plural).
- **KB API real:** La ruta correcta es `/v1/dubbing/resource/{dubbing_id}` (singular).
- **Resolucion:** Usar singular (`/resource/`). Confirmado en gold_standard_sections_8_9.md (Seccion 8.4.2): "Es singular: `/resource/` (no `/resources/`), `/segment/` (no `/segments/`)."
- **Status:** CERRADA por documentacion. Validar con smoke test #1.

#### 2. `segment/{segment_id}` vs `segment/{segment_id}/{language}`

- **Docs internas:** Algunas fuentes usan `PATCH /v1/dubbing/resource/{id}/segment/{segment_id}` (sin idioma).
- **KB API real:** El path requiere los 3 parametros: `dubbing_id` + `segment_id` + `language`.
- **Resolucion:** Usar la ruta completa con `{language}` en el path: `/v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language}`. La actualizacion es per-language: se modifica texto/timing de UN segmento en UN idioma especifico.
- **Status:** CERRADA por documentacion. Validar con smoke test #5.

#### 3. `audio-isolation` vs `audio-isolation/convert`

- **KB API:** `POST /v1/audio-isolation` (sin sufijo).
- **Docs internas (gold_standard_workflow.md):** `POST /v1/audio-isolation/convert` (con sufijo `/convert`).
- **Resolucion:** Conflicto abierto. Riesgo ALTO de 404 por ruta incorrecta. DEBE resolverse por smoke test antes de implementar.
- **Status:** ABIERTA. Smoke test #7 probara ambas variantes.

#### 4. `auto_assign_voices` (fantasma)

- **Origen:** Alucinado por el modelo Gemini Swarm. Mencionado como parametro de la Dubbing API.
- **Realidad:** NO existe en ningun endpoint documentado de la Dubbing API (129 docs verificados). Existe como feature de la Studio API (audiobooks), un producto diferente.
- **Resolucion:** CERRADA definitivamente. Marcado como FALSO en gold_standard_workflow.md y debate/Claude_Mega_Propuesta_Final.md (A-021).
- **Status:** CERRADA. No usar.

#### 5. `from_content_json` disponibilidad

- **Master plan (dic 2024):** Listado como opcion viable para crear proyectos con JSON estructurado.
- **Debate (feb 2026):** Reportado como bloqueado en plan Pro. Requiere contactar ventas.
- **Resolucion:** Tratar como experimental/bloqueado hasta que un smoke test real con la cuenta de QPH confirme disponibilidad. No planificar arquitectura que dependa de este parametro.
- **Status:** ABIERTA. Requiere validacion con cuenta/plan real.

---

### 5.5 Smoke Tests Prioritarios

Los 7 endpoints que deben validarse ANTES de escribir codigo de integracion. Tabla consolidada de Codex Gold Standard (Seccion 5.2) y MEGA BARRIDO (Seccion 5).

| Orden | Endpoint | Payload minimo | Evidencia a capturar | Criterio Go / No-Go |
|:------|:---------|:---------------|:---------------------|:---------------------|
| 1 | `GET /v1/voices` | Header `xi-api-key` | JSON con voces disponibles + headers (`request-id`, rate limits, plan info) | Go si HTTP 200 y `voices[]` no vacio. Capturar rate limits para planificacion de batch. |
| 2 | `POST /v1/speech-to-text` | `model_id=scribe_v2` + audio corto (30s, ES) + `entity_detection="offensive_language"` + `keyterms=["Doge","Michi"]` | Texto transcrito + `language_probability` + entities detectadas + keyterms reconocidos | Go si HTTP 200, texto coherente, y entity_detection retorna categorias. Verificar que keyterms mejoran precision de nombres propios. |
| 3 | `GET /v1/dubbing/resource/{dubbing_id}` | Usar `dubbing_id` de un proyecto existente creado via Web UI | JSON con speakers, segments, languages, renders | Go si HTTP 200 y estructura contiene `segments[]` con `segment_id`. CRITICO: confirma que la ruta es `/resource/` (singular). |
| 4 | `POST /v1/dubbing/resource/{dubbing_id}/migrate-segments` | `segment_ids: ["{id}"]` + `speaker_id: "{id}"` | Respuesta de mutacion + verificar que segmento cambio de speaker | Go si mutacion confirmada y estado de segmentos actualizado. |
| 5 | `PATCH /v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language}` | `text: "Texto corregido de prueba"` + `start_time: 1.0` | Respuesta con `version: integer` + verificar diff de segmento antes/despues | Go si patch aplica sin re-render total y `version` se incrementa. CRITICO: confirma ruta con 3 path params y que NO regenera dub automaticamente. |
| 6 | `POST /v1/forced-alignment` | Audio corto (30s) + transcript del mismo audio | Response con `characters[]`, `words[]` (con `start`, `end`, `loss` por palabra) | Go si retorna alineacion valida con `loss` < 1.0 para segmentos claros. Verificar que `loss` alto corresponde a segmentos con ruido/overlap. |
| 7 | `POST /v1/audio-isolation` (Y variante `/convert`) | Audio corto con musica de fondo + voz | Response con archivo de audio limpio (solo voz) | Go a la ruta que responda HTTP 200 consistentemente. Probar AMBAS variantes (`/audio-isolation` y `/audio-isolation/convert`) para resolver contradiccion #3. |

**Protocolo de ejecucion:** Usar API key real de QPH. Crear proyecto de prueba dedicado (no usar contenido de produccion). Documentar CADA respuesta (headers completos, body, status code, latencia). Si algun endpoint retorna 403/404/429, documentar y ajustar plan antes de continuar. Tiempo estimado: 4-6 horas en un solo dia.

---

## SECCION 6: CADENA DE TRADUCCION OPTIMIZADA (Dynamic Translation Routing)

### 6.1 Problema: Efecto Telefono Descompuesto

La cadena actual opera como un juego de telefono descompuesto a escala industrial:

```
ES (original) --> EN (pivot) --> 26 idiomas downstream
```

Cada error introducido en la traduccion ES->EN se multiplica x26. No hay mecanismo de contencion: si el EN master tiene un defecto semantico, TODOS los idiomas hijos lo heredan sin posibilidad de correccion retroactiva.

**Tabla de evidencia consolidada de las 10 fuentes:**

| Tipo de perdida | Ejemplo real QPH | Consecuencia downstream | Fuente |
|:----------------|:-----------------|:------------------------|:-------|
| **Erradicacion de genero/numero** | "Las perritas estan asustadas" --> EN: "The little dogs are scared" --> FR: "Les petits chiens" (masculino generico) | Fidelidad del guion destruida en lenguas romances. Personajes femeninos se masculinizan. | Gemini Deep Thinking, gold_standard_sections_5_7 |
| **Destruccion de formalidad (T/V)** | "Oye tu, ven aqui!" --> EN: "Hey you, come here!" --> DE: "Kommen Sie hier!" (formal) / JA: desu/masu (Keigo) | Ninos de 8-15 anos escuchan a un perro animado hablar como banquero. Registro completamente inadecuado para audiencia infantil. | Gemini Deep Thinking, Gemini 3.1 PRO |
| **Neutralizacion del afecto** | "Que padre, guey!" --> EN: "How cool, dude!" --> JA: traduccion literal sin alma | El chiste/expresion muere antes de llegar a Asia. La energia emocional se aplana. | Gemini Deep Thinking, Propuesta No Tecnica |
| **Perdida de diminutivos** | "Michito" --> EN: "Little cat" --> 26 traducciones planas sin carga afectiva | Intimidad emocional infantil eliminada. Los diminutivos son centrales en la relacion nino-personaje animado. | gold_standard_sections_5_7 |
| **Efecto cascada en EN master** | EN master ya pierde -35% AVD vs ES (3:04 vs 4:41) | Si EN esta mal, TODO lo downstream esta peor. Afecta directamente 42% del revenue (EN + 26 idiomas derivados). | Gaps Pendientes (datos YouTube Analytics) |
| **Amplificacion multiplicativa** | Un error en "What a father!" (traduccion incorrecta de "Que padre!") | Se propaga identicamente a PT, FR, DE, JA, KO, ZH, AR, HI, TR, ID, etc. = error x26. | 10/10 documentos mencionan este problema |

**Datos de AVD que respaldan la tesis (YouTube Analytics Ene-Dic 2025):**

| Cluster | Idiomas | AVD promedio | Delta vs ES (4:41) | Revenue % | Correlacion |
|:--------|:--------|:-------------|:-------------------|:----------|:------------|
| Original | ES, ES-MX | 4:31 | baseline | 58% | -- |
| Master | EN | 3:04 | **-35%** | 24% | EN ya tiene problemas antes de propagar |
| Romance | PT, FR, IT | 3:40 | -22% | 11% | PT (-18%) es el mejor; idioma hermano de ES |
| Europeo | DE, RU, TR | 3:39 | -22% | ~6% | Similar a Romance a pesar de mayor distancia |
| Arabe | AR | 3:23 | -28% | ~0.3% | Genero gramatical destruido por EN |
| Indico | HI | 2:56 | -37% | ~0.1% | Formalidad T/V destruida |
| CJK | JA, KO, ZH | 2:24 | **-49%** | ~0.6% | Triple penalizacion: pivot + expansion + TTS |
| SEA | ID, FIL, MS | 2:25 | -48% | ~0.2% | Similar a CJK |
| Dravidico | TA | 1:58 | **-58%** | <0.01% | Peor caso: aglutinante + bajo recurso + pivot |

**Patron critico:** Existe correlacion fuerte entre distancia linguistica del espanol y caida de AVD. PT-BR (89% cognados con ES) pierde solo 18%. CJK pierde 49%. Tamil pierde 58%. Esto apunta directamente al pivot como factor causal, aunque factores de TTS y cultura contribuyen.

---

### 6.2 Dynamic Translation Routing (DTR)

Sintesis de Mega Propuesta (Claude) + Deep Thinking (Gemini) + 3.1 PRO (Gemini) + Gaps Pendientes. En vez de un pivot estatico y universal, el backend implementa un enrutador dinamico que selecciona la via de traduccion segun la distancia filogenetica del idioma objetivo.

#### Cluster A -- Romance: ES --> Target directo

**Idiomas:** PT-BR, IT, FR, RO

**Justificacion linguistica:**
- Alta afinidad morfologica con el espanol. PT-BR comparte ~89% de vocabulario cognado.
- FR/IT/RO comparten genero gramatical, diminutivos productivos y estructura T/V (tu/vous, tu/Lei, tu/dumneavoastra).
- La traduccion directa preserva el timing original y el tono sin necesidad de un intermediario esterilizador.
- Los LLMs de 2026 poseen corpus paralelos masivos entre el espanol y las lenguas europeas (Guerreiro et al., 2024).

**Implementacion:**
- LLM (Gemini 2.5 Pro o Claude Sonnet) recibe texto ES + System Prompt con reglas de formalidad + PCD (Diccionario Cultural Positivo por locale).
- Sin paso por ingles. ES -> Target directo.
- System Prompt incluye reglas del `cultural_matrix_global.json` para el locale especifico.

**Metricas de control:** xCOMET > 0.85
**Revision humana:** No obligatoria (solo para Tier 1 por revenue, no por calidad linguistica)
**Impacto esperado:** +15 a +20 puntos porcentuales en xCOMET. Recuperacion directa del AVD en Europa y Latinoamerica.
**Revenue en juego:** ~11% combinado (PT ~7%, FR ~2%, IT ~1.5%, RO <0.5%).

---

#### Cluster B -- Germanico: ES --> Target directo + revision

**Idiomas:** DE, NL, SV

**Justificacion financiera y linguistica:**
- DE tiene RPM x7.2 -- cada vista alemana vale 7.2x una vista en ES. Es el mercado mas eficiente. Justifica inversion en revision humana.
- La traduccion directa ES->DE con System Prompt estricto suele ser superior al salto por ingles si se incluye el contexto del personaje ("nino de 10 anos").
- NL/SV: Corpus paralelo ES->NL/SV menor que ES->DE. Evaluar por episodio si LLM produce calidad suficiente para ruta directa.

**Implementacion:**
- Traduccion directa ES->DE con System Prompt estricto:
  `"MANDATORY RULE: Always use the informal child-friendly register ('du', 'ihr'). The use of formal 'Sie' is strictly prohibited."`
- Revision humana post-traduccion obligatoria para DE.
- NL/SV: fallback a pivot enriquecido si xCOMET < 0.80.

**Metricas de control:** xCOMET > 0.85 + GEMBA-MQM
**Revision humana:** SI obligatoria para DE. Evaluacion por episodio para NL/SV.

---

#### Cluster C -- Distante: ES --> EN (enriched JSON) --> Target

**Idiomas:** EN, JA, KO, ZH, AR, HI, TR, ID, TH, VI, TA, MS, FIL, RU, PL, UK, EL

**Justificacion:**
- Para idiomas filogeneticamente distantes o de bajo recurso, la traduccion directa desde ES aun puede inducir alucinaciones.
- El ingles se mantiene como puente, pero NUNCA como simple string de texto.
- El "EN Master" se genera como objeto JSON enriquecido con metadatos pragmaticos extraidos por el LLM en el primer paso.

**Schema del JSON enriquecido (Enriched Pivot):**

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

**Por que funciona:**
- El LLM traductor al japones recibe contexto sociolinguistico completo.
- El campo `intent` previene la perdida semantica que causa el pivot simple. El LLM no traduce las palabras sino la intencion.
- `target_formality` fuerza el registro correcto: evita Keigo (lenguaje honorifico) en JA, fuerza `du` en DE, fuerza `banmal` en KO.
- `max_target_syllables` controla la expansion de texto (ver Seccion 6.3).
- `visual_context` elimina ambiguedad: la IA no tiene que adivinar si "pelota" es futbol o canica.

**Metricas de control:**
- Tier 1-2: xCOMET + 3 LLM Judges (Claude Sonnet + GPT-4o + Gemini Flash)
- Tier 3: chrF++ (metrica de n-gramas de caracteres, sin referencia humana)

**Revision humana:** Por tiering (100% Tier 1, muestreo 30% Tier 2, solo automatico Tier 3)

#### Tabla resumen DTR

| Cluster | Idiomas | Ruta | Metricas de control | Revision humana |
|:--------|:--------|:-----|:--------------------|:----------------|
| **A (Romance)** | PT-BR, FR, IT, RO | ES --> Target directo | xCOMET > 0.85 | No (solo Tier 1 por revenue) |
| **B (Germanico)** | DE, NL, SV | ES --> Target directo | xCOMET > 0.85 + GEMBA-MQM | SI obligatoria (DE). Evaluacion NL/SV |
| **C (Distante)** | EN, JA, KO, ZH, AR, HI, TR, ID, TH, VI, TA, MS, FIL, RU, PL, UK, EL | ES --> EN(enriched JSON) --> Target | xCOMET + 3 LLM Judges (Tier 1-2) / chrF++ (Tier 3) | Por tiering |

---

### 6.3 String Length Expansion Control

Hallazgo critico de Gemini Deep Thinking que los modelos anteriores del debate no abordaron:

**El problema:** Lenguas aglutinantes (Tamil, turco, finlandes) y CJK requieren 30-50% mas tiempo vocal para expresar el mismo contenido que el espanol. Cuando ElevenLabs recibe un texto que excede la duracion del segmento de animacion, el motor TTS acelera la voz antinaturalmente -- el "efecto ardilla." Este efecto es un contribuyente directo al colapso de -58% AVD en Tamil.

**Factores de expansion por familia linguistica:**

| Familia | Idiomas | Factor tipico vs ES | Accion requerida |
|:--------|:--------|:--------------------|:-----------------|
| Romance | PT, FR, IT, RO | 1.0-1.15x | Sin ajuste. Expansion minima, compatible con timing original. |
| Germanico | DE, NL, SV | 1.1-1.25x | Monitorear. Aleman tiende a compuestos largos (Handschuh, Kuhlschrank). Alertar si ratio > 1.2x. |
| CJK (caracteres) | JA, KO, ZH | 0.8-1.0x en caracteres | Engano optico: menos caracteres, pero mas silabas orales (1.2-1.4x). `max_target_syllables` obligatorio. |
| CJK (silabas orales) | JA, KO, ZH | 1.2-1.4x | `max_target_syllables` activo. LLM debe transcreation si excede limite. |
| Dravidico | TA | 1.3-1.5x | **Transcreacion obligatoria.** Tamil es aglutinante y expande agresivamente. LLM debe resumir preservando intencion/emocion. |
| Aglutinante | TR, FI, HU | 1.2-1.4x | `max_target_syllables` activo. |
| Arabe | AR | 1.0-1.2x | Monitorear genero gramatical (puede expandir por marcacion de genero en verbos/adjetivos). |

**La solucion -- campo `max_target_syllables`:**

1. **Pre-TTS text-length check:** Antes de enviar a ElevenLabs, calcular: `ratio = len(texto_target) / len(texto_es)`. Si `ratio > 1.3`, el sistema obliga al LLM a realizar transcreacion/resumen.
2. **El campo fuerza al LLM** a producir una version que quepa en la ventana temporal: no traduce literal, sino que transcrea preservando intencion y emocion dentro de las silabas permitidas.
3. **Validacion post-TTS:** Si el audio generado excede `max_duration_ms` del segmento en >20%, Gate 4 lo flaggea automaticamente para revision.

**Ejemplo concreto:**
- Linea ES: "No manches! El perro Doge se llevo mi pelota." (12 silabas, 3.2 segundos)
- `max_target_syllables: 14` (margen de +16%)
- Traduccion TA literal: 20+ silabas --> ratio 1.67x --> **BLOCK: transcreacion forzada**
- Transcreacion TA: condensacion a 14 silabas preservando intencion "angry disbelief"

---

### 6.4 Hipotesis a Validar con Piloto

Lista consolidada de Gaps_Pendientes_Deep_Research.md y gold_standard_sections_5_7.md. Cada hipotesis requiere validacion empirica antes de comprometer la arquitectura completa.

| ID | Hipotesis | Metrica de validacion | Criterio de exito | Esfuerzo |
|:---|:----------|:---------------------|:------------------|:---------|
| H1 | **La ruta directa ES->PT produce mayor calidad que ES->EN->PT.** PT-BR muestra el mejor AVD relativo (-18%) y comparte ~89% de cognados con ES. La cadena via EN introduce traduccion intermedia innecesaria. | xCOMET score sobre 50 segmentos paralelos: mismos segmentos traducidos via ruta directa vs via pivot. | xCOMET directo > xCOMET pivot por >= 5 puntos | 4-8h (benchmark) |
| H2 | **La caida de AVD en CJK (-49%) tiene 3 causas cuantificables: (a) calidad TTS, (b) string expansion, (c) perdida cultural.** Los modelos previos diagnosticaron "TTS robotico" como causa unica; es un diagnostico parcial. | AVD delta post-correccion. A/B test con 1 episodio: version actual vs version con DTR + expansion control + cultural matrix. Medir contribucion de cada factor. | AVD mejora >= 10% con DTR + expansion control en al menos 1 idioma CJK | 16h (A/B test completo) |
| H3 | **El EN master actual (AVD -35%) puede mejorarse con contexto enriquecido de traduccion.** El enriched pivot JSON preserva intent/emotion/formality que el pivot simple destruye. | AVD EN y COMET score EN comparando: version actual (pivot simple) vs version con enriched pivot JSON. | AVD EN mejora >= 5% Y COMET EN mejora >= 3 puntos con enriched pivot | 4h (benchmark) |
| H4 | **La transcreacion forzada por `max_target_syllables` no degrada la fidelidad semantica.** Obligar al LLM a resumir podria perder informacion critica. | COMET score + juicio humano sobre 20 segmentos en TA (peor caso de expansion). Comparar: traduccion libre vs transcreacion con limite de silabas. | COMET >= 0.80 Y aprobacion humana >= 90% (18/20 segmentos aprobados) | 4h (evaluacion) |
| H5 | **La calidad del TTS de ElevenLabs varia significativamente por idioma.** Los idiomas CJK pierden ~50% de AVD vs el original. Esto PUEDE ser por TTS robotico, pero tambien por traduccion/cultura. Necesitamos aislar el factor TTS. | MOS score (UTMOS, open source) por idioma. Generar 2 min de audio de prueba en cada idioma con voces asignadas. | Si MOS de JA/KO/ZH es significativamente menor que MOS de DE/FR/PT (>0.5 puntos diferencia), TTS es factor causal. Si MOS es similar, causa es cultural. | 8h (benchmark) |
| H6 | **ElevenLabs soporta dubbing ES->PT-BR directo sin pasar por EN.** La API acepta `source_lang=es` y `target_lang=pt`, pero no se ha probado. | Test con API: `source_lang=es`, `target_lang=pt`. Comparar output con version via EN. | API procesa sin error Y output tiene calidad comparable o superior a via EN | 1h (smoke test) |
| H7 | **Flash v2.5 vs Eleven v3: hay diferencia significativa de calidad en CJK.** Si v3 mejora MOS en idiomas CJK, justifica el costo adicional para esos idiomas. | MOS score comparativo: mismo texto, misma voz, ambos modelos, en JA/KO/ZH. | Si MOS v3 > MOS Flash por >= 0.3 puntos en CJK, usar v3 para CJK (justifica costo premium). | 4h (test) |

**Propuesta de piloto:** Agregar al roadmap Phase 1 un **spike de translation chain** (8h) que valide H1 (ES->PT directo) y H6 (soporte de API para ES->PT). Si se confirma la mejora, extender a H3 (enriched pivot para EN) en Phase 2. Los benchmarks de TTS (H5, H7) se ejecutan en paralelo con Phase 1 como DR03 (deliverable de research).

---

*Fin de Secciones 3-6. Estas secciones conectan con Secciones 1-2 (gold_standard_sections_1_4.md), Secciones 5-7 originales (gold_standard_sections_5_7.md), y Secciones 8-9 (gold_standard_sections_8_9.md).*
