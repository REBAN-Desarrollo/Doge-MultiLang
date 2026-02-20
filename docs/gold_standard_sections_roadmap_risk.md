## 10. ROADMAP DE IMPLEMENTACION (CONSENSO)

Este roadmap integra las perspectivas de las 4 auditorias AI (Claude Opus, Sonnet Devil's Advocate, Codex GPT-5, Gemini Multi), los hallazgos del Mega Barrido de 10 agentes, el Addendum de Deep Research, y los datos reales de YouTube Analytics. El principio rector es: **Verificar ANTES de construir. Cada hora de verificacion ahorra 5-10h de retrabajo.**

---

### 10.1 Semana 0: Verificacion (CERO codigo nuevo)

La premisa fundamental es que no se escribe codigo nuevo hasta validar que los cimientos existen. El PR #71 tiene 14 meses de inactividad. Asumir que funciona sin verificarlo seria construir sobre arena.

| Dia | Accion | Riesgo que resuelve | Responsable | Entregable |
|:----|:-------|:--------------------|:------------|:-----------|
| **1** | Verificar PR #71 en AI-Studio: abrir repo, localizar rama, ejecutar `python main.py`, probar flujo E2E con 1 episodio real (ES, EN, DE). Fix bugs P0 (prescanner crash en None) y P1 (WERResult.language hardcodeado a ES) con tests unitarios. | R-01 (PR stale, toda la premisa depende de el), R-03 (bug P0), R-07 (bug P1) | Daniel | PR #71 verificado con screenshots/logs. Bugs P0/P1 corregidos con tests pasando. Documento de estado real: funciona / parcial / roto. |
| **2** | Spike tecnico API ElevenLabs (feb 2026 vs KB dic 2024): probar 7 endpoints criticos con API key real. (1) GET /v1/voices, (2) POST /v1/speech-to-text (scribe_v2), (3) GET /v1/dubbing/resource/{id}, (4) POST /v1/dubbing/resource/{id}/migrate-segments, (5) PATCH /v1/dubbing/resource/{id}/segment/{segment_id}/{language}, (6) POST /v1/forced-alignment, (7) POST /v1/audio-isolation. Documentar que funciona, que cambio, que requiere Enterprise. | R-04 (API cambio en 14 meses), contradicciones de endpoints (resource vs resources, segment path variants, audio-isolation vs audio-isolation/convert) | Daniel | Semaforo por endpoint: Verde (funciona), Amarillo (sin smoke test), Rojo (conflictivo). Documento con payloads y respuestas reales. |
| **3** | Entrevistas de validacion: 30 min con Saul/Ivan (confirmar pain points, demo AI-Studio, medir apertura a migracion, identificar features indispensables de Web UI) + 30 min con Fernando (confirmar si puede exportar stems por personaje, validar Guion Zombie como problema real, demo Forced Alignment). | R-02 (Saul/Ivan rechazan migracion), R-03 (Fernando no puede exportar stems), R-08 (levantamientos no validados, Mudas pueden estar mal priorizadas) | Daniel | Transcripcion de respuestas. Confirmacion o negacion de supuestos S-03, S-04, S-07. Feedback de Saul/Ivan sobre AI-Studio. |
| **4** | Datos de YouTube Analytics por idioma: extraer views, watch hours, AVD (Average View Duration), revenue estimado por idioma para los ultimos 12 meses. Cruzar con costos de dubbing para estimar ROI por idioma. Identificar candidatos a pausar (ROI negativo: Tamil, Filipino, Mandarin) y candidatos a invertir mas (PT-BR, DE, IT). | R-10 (27 idiomas sin datos de ROI, puede ser pasivo no activo), datos para Decision D-002 (idiomas en MVP) y D-005 (pausar idiomas) | Daniel | Tabla de ROI por idioma con columnas: idioma, views, revenue, costo, ROI, recomendacion. Input directo para decisiones D-002 y D-005. |
| **5** | Tomar decisiones D-001 a D-004 con datos reales de dias 1-4. Limpiar repo Doge-MultiLang: crear .gitignore (excluir docx 43MB), crear CLAUDE.md, commitear archivos untracked, eliminar blacklists duplicadas en docs/levantamientos/. Escribir ADR que cierre formalmente PRD_FINAL.md como SUPERSEDED. | G-006 (docx 43MB sin .gitignore), G-010 (faltan CLAUDE.md y configs), G-003 (PRD y claude_debate coexisten como planes contradictorios) | Daniel | Decisiones D-001 a D-004 documentadas con justificacion basada en datos. Repo limpio: .gitignore, CLAUDE.md, archivos commiteados. ADR firmado. |

---

### 10.2 Phase 0: Quick Wins (Semanas 1-2)

Objetivo: conectar los dos sistemas paralelos desconectados (dubbing_pipeline.py y dubbing_service.py), crear los cimientos del pipeline integrado, y tener un episodio E2E funcional.

| # | Entregable | Esfuerzo | Metrica de exito |
|:--|:-----------|:---------|:-----------------|
| 0.1 | **Integrar dubbing_pipeline.py <-> dubbing_service.py:** Crear adaptador en dubbing_service.py con funciones `pre_scan_before_create()`, `compute_wer_after_generation()`, `estimate_cost()`. Agregar hooks en dubbing_routes.py. Unificar schema SQL. | 8h | WER se computa y guarda automaticamente al finalizar cada job de dubbing. Pipeline y service comparten datos via adaptador sin duplicacion. |
| 0.2 | **Agregar Dubbing Resource API a elevenlabs.py:** Implementar endpoints de segment CRUD (GET resource, PATCH segment, migrate-segments, add-language, get-similar-voices). Reemplaza dependencia en Manual Dub CSV. | 6h | Parcheo granular de segmentos funcional: editar texto de 1 segmento sin re-renderizar episodio completo. Tiempo de correccion pasa de ~5 min a ~4 seg. |
| 0.3 | **Crear CLAUDE.md, .gitignore, commitear archivos, limpiar repo:** .gitignore excluye docx 43MB. CLAUDE.md documenta contexto del proyecto. Commitear 70+ archivos untracked. Eliminar 3 blacklists duplicadas. Mover planchado.py a scripts/. | 2h | `git status` limpio. Ningun archivo de 43MB en el repo. CLAUDE.md disponible para cualquier agente AI que trabaje en el proyecto. |

**Total Phase 0:** 16h (sin contar Semana 0 de verificacion)

**Criterios de salida Phase 0:** (1) Bug P0 fix con test unitario pasando. (2) Bug P1 fix con test. (3) pipeline.py y service.py conectados con test de integracion. (4) UN episodio real procesado E2E sin intervencion. (5) .gitignore y CLAUDE.md creados. (6) Spike de API documentado con endpoints confirmados.

---

### 10.3 Phase 1: QA Pipeline (Semanas 3-5)

Objetivo: construir el sistema de auditoria de calidad automatizado (audit_service.py como orquestador central) y medir WER en los 27 idiomas por primera vez.

| # | Entregable | Esfuerzo | Dependencia |
|:--|:-----------|:---------|:------------|
| 1.1 | **audit_service.py** -- Orquestador QA central. Coordina los 4 Quality Gates. Implementa tiering (Tier 1: WER < 5% + revision humana; Tier 2: WER < 10% + muestreo; Tier 3: WER < 15% + solo automatico). Clasifica errores por taxonomia MQM adaptada. Genera qa_report.json por idioma. | 10-14h | Phase 0 completada |
| 1.2 | **prompt_scanner.py** -- Extension de prescanner.py existente (378L). Integra blacklists de 27 idiomas. Agrega validacion de diccionario cultural positivo, check de pronombres/formalidad por idioma, estimacion de timing para frases largas. Conecta con ElevenLabs Scribe v2 entity detection (offensive_language category) como primera linea de safety. | 5h | Blacklists existentes (3/27 minimo) |
| 1.3 | **whisper_client.py** -- Wrapper para OpenAI Whisper API. Chunking inteligente para audio largo, retry con backoff exponencial, cache de resultados, soporte para 27 idiomas. Complementado con Deepgram Nova-3 para consenso dual STT en Tier 1. | 4h | API key de OpenAI |
| 1.4 | **wer_calculator.py** -- Calculo WER formal usando jiwer. Normalizacion por idioma (CJK sin espacios, arabe con diacriticos opcionales). Scoring por segmento y por episodio. Output compatible con qa_report.json. | 2-3h | whisper_client.py |
| 1.5 | **timing_checker.py** -- Calcula delta porcentual de duracion entre audio original y doblado. Umbral: +20% es flag amarillo, +30% es flag rojo. Usa DTW (Dynamic Time Warping) via librosa para alineacion temporal. Flag si drift > 200ms o > 20%. | 2h | librosa |
| 1.6 | **Forced Alignment integration** -- Agregar POST /v1/forced-alignment a elevenlabs.py. Validar timestamps post-dubbing con precision de submilisegundos. Soporta 29 idiomas (multilingual v2). Complementa timing_checker.py con datos de alineacion a nivel de caracter. | 3-4h | Spike de API (Dia 2) confirmado |
| 1.7 | **Endpoints de auditoria** -- 4 nuevos endpoints REST en dubbing_routes.py: POST /audit (lanzar auditoria), GET /audit/{id} (resultado), GET /audit/summary (semaforo por idioma), POST /audit/batch (auditoria masiva). Documentados con OpenAPI. | 5h | audit_service.py |
| 1.8 | **Modelo SQL** -- Tablas audit_jobs y audit_results en schema existente. Columnas: episode_id, language, tier, wer_score, comet_score, mos_score, timing_drift, category_a_flags, verdict, reviewed_by, timestamp. Trazabilidad obligatoria (GS-05 de Codex). | 3h | Schema SQL existente |

**Total Phase 1:** 34-46h

**Criterios de salida Phase 1:** (1) audit_service.py operativo y orquestando los 4 Gates. (2) WER medido en al menos 5 idiomas Tier 1 con datos reales. (3) Forced Alignment integrado en elevenlabs.py. (4) Endpoints de auditoria expuestos y documentados. (5) COMET score > 0.85 en Tier 1 en episodio de prueba. (6) Zero Category A flags en episodio de prueba Tier 1.

---

### 10.4 Phase 2: Speaker Detection + Blacklists (Semanas 6-8)

Objetivo: resolver los dos gaps mas criticos de safety (blacklists 3/27) y calidad (speaker detection inexistente).

| # | Entregable | Esfuerzo | Dependencia |
|:--|:-----------|:---------|:------------|
| 2.1 | **validate_speakers.py** -- Fuzzy match de speakers detectados vs voice_manifest.json. Usa ECAPA-TDNN para speaker embeddings y cosine similarity (umbral > 0.75). Maneja explicitamente caso "linea sin match" (ad-libs de Fernando): flag para revision humana + voice_id "desconocido". Tracking cross-episodio para detectar drift de voz. | 10-12h | voice_manifest.json, SpeechBrain |
| 2.2 | **24 blacklists faltantes** -- LLM genera borrador inicial por idioma (~2h total para 24 idiomas). Validacion por hablantes nativos para Tier 1 (5 idiomas x 1h). Tier 2+3 inician con borrador LLM y se refinan via Kaizen. Cada blacklist JSON: minimo 20 entradas Tier 1, 10 entradas Tier 2/3. Campos: term, category (A/B/C), severity. Incluye idiomas criticos: ZH (filtros de contenido chinos estrictos), KO, JA, HI. Directorio `by_language/` referenciado en blacklist_global.json creado. | 16-20h | Hablantes nativos Tier 1 |
| 2.3 | **Pronunciation Dictionaries** -- Reglas IPA por personaje (Gabriel, Valentina, etc.) por idioma, versionadas, workspace-shared via ElevenLabs API. POST /v1/pronunciation-dictionaries/add-from-rules. Aseguran nombres de personajes correctos cross-episodio y cross-idioma. | 3-4h | Spike API confirmado |
| 2.4 | **Blacklists Tier 1 completas** -- Las 5 blacklists de Tier 1 (ES, EN, PT-BR, FR, DE) validadas por hablantes nativos y listas para produccion. Gate 1 operativo: bloqueo automatico de contenido Cat. A en Tier 1. | 2 dias | Borrador LLM de 2.2 |

**Total Phase 2:** 31-38h + 2 dias de validacion nativa

**Criterios de salida Phase 2:** (1) 27 blacklists JSON completas (LLM draft + revision nativa para Tier 1). (2) validate_speakers.py con fuzzy match funcionando en episodio real, accuracy > 90%. (3) Dubbing Resource API integrada: parcheo granular de segmentos funcional. (4) Pronunciation Dictionaries cargados para los 5 personajes principales en 5 idiomas Tier 1.

---

### 10.5 Phase 3: Automatizacion Completa (Semanas 9-12)

Objetivo: eliminar la dependencia de la Web UI de ElevenLabs y automatizar el flujo completo.

| # | Entregable | Esfuerzo | Dependencia |
|:--|:-----------|:---------|:------------|
| 3.1 | **Flujo E2E via API** -- Procesamiento completo de 1 episodio x 27 idiomas sin necesidad de abrir la Web UI de ElevenLabs. Incluye: ingestion (docx/manifest/MP4), pre-scan (Gate 1), generacion (API dubbing), auditoria (Gates 2-4), reporte (qa_report.json). Plan de rollback documentado: si AI-Studio falla, procedimiento de emergencia para completar via Web UI en 1-2h. | 14-18h | Phase 1 + Phase 2 |
| 3.2 | **Batch processing** -- Cola de procesamiento con rate limits, prioridad por tier (Tier 1 primero), manejo de errores con retry, paralelismo controlado para 27 idiomas. Webhook architecture para procesamiento asincrono. | 8-10h | Flujo E2E funcional |
| 3.3 | **Dashboard QA** -- Tablero Metabase (open source) con: semaforo por idioma (verde/amarillo/rojo basado en score MQM), tasa FTR semanal, tendencias de WER por idioma, Cat. A incidents, reporte por episodio. Accesible via URL interna a todo el equipo. Al menos 3 miembros acceden semanalmente. | 10-14h | Datos de audit_service.py |
| 3.4 | **Onboarding Saul/Ivan** -- Guia escrita paso a paso. Demo de 1h con episodio real. Periodo de transicion: 1 episodio en paralelo (Web UI + AI-Studio) para comparar. Solo migrar cuando AI-Studio demuestre paridad. Documentar procedimiento de rollback a Web UI. | 4h | Dashboard funcional, feedback de entrevista Dia 3 |

**Total Phase 3:** 36-46h

**Criterios de salida Phase 3:** (1) Flujo E2E completo sin necesidad de Web UI de ElevenLabs. (2) Batch processing funcional con cola, rate limits y prioridad por tier. (3) Dashboard QA minimo con semaforos por idioma y datos reales de al menos 4 semanas. (4) Guia de onboarding escrita y demo realizada con Saul/Ivan con feedback positivo.

---

### 10.6 Phase 4: Avanzado (Semanas 13+)

Objetivo: optimizar el sistema con datos reales, implementar mejora continua (Kaizen), y generar inteligencia de negocio.

| # | Entregable | Esfuerzo | Dependencia |
|:--|:-----------|:---------|:------------|
| 4.1 | **ROI Dashboard por idioma** -- Cruzar YouTube Analytics (views, retencion, revenue por idioma) con costos de produccion (ElevenLabs + tiempo humano + QA). 27 valores de ROI calculados. Recomendacion por idioma: mantener/pausar/agregar. Conectado a YouTube Analytics API. | 16-20h | Datos YouTube (Dia 4) |
| 4.2 | **Tropicalizacion automatica** -- cultural_matrix_global.json inyectado en prompts de traduccion. Diccionario cultural positivo (modismos, onomatopeyas, equivalentes culturales). Mappings de pronombres/formalidad por idioma. Guias de localizacion por cluster (CJK, Arabe, Indico, Europeo). | 12-16h | Diccionario cultural construido |
| 4.3 | **Analisis de audio avanzado** -- UTMOS para naturalidad (MOS score por idioma), emotion2vec+ para tono/emocion (comparar vs guion), ECAPA-TDNN para consistencia cross-episodio, LUFS/clipping/SNR checks con librosa. Benchmark MOS vs AVD para correlacionar calidad TTS con retencion de audiencia. | 8-10h | Modelos open source instalados |
| 4.4 | **Kaizen loop activo** -- Mem0 almacenando correcciones de Saul/Ivan y aplicandolas automaticamente. Ciclo PDCA semanal alineado con reunion OVEJA. Taxonomia MQM clasificando cada error. YouTube Analytics como feedback loop de audiencia. Captura de conocimiento tribal de Saul/Ivan. Metricas de mejora continua (FTR, Error Recurrence Rate, CAPA Effectiveness). | 14-18h | Dashboard QA, Mem0 configurado |

**Total Phase 4:** 50-64h

**Criterios de salida Phase 4:** (1) ROI por idioma calculado para ultimos 3 meses. (2) Tropicalizacion activa para Tier 1. (3) Kaizen loop produciendo mejoras medibles (FTR mejora >10% en 4 semanas). (4) Decision D-005 (pausar idiomas) tomada con datos reales.

---

### 10.7 Resumen por Fases

| Fase | Semanas | Horas | Entregable Principal |
|:-----|:--------|:------|:---------------------|
| **Semana 0: Verificacion** | 0 | 5 dias dedicados | Datos reales: PR #71 verificado, API validada, entrevistas completadas, ROI por idioma, decisiones D-001 a D-004 tomadas |
| **Phase 0: Quick Wins** | 1-2 | 16h | Bugs corregidos, sistemas conectados, Dubbing Resource API integrada, repo limpio, 1 episodio E2E probado |
| **Phase 1: QA Pipeline** | 3-5 | 34-46h | audit_service.py + prompt_scanner + whisper_client + WER medido en 27 idiomas + Forced Alignment |
| **Phase 2: Speakers + Blacklists** | 6-8 | 31-38h + 2d | validate_speakers.py + 27 blacklists completas + Pronunciation Dictionaries + Gate 1 operativo |
| **Phase 3: Automatizacion** | 9-12 | 36-46h | Flujo E2E sin Web UI + batch processing + Dashboard QA + onboarding Saul/Ivan |
| **Phase 4: Avanzado** | 13+ | 50-64h | ROI por idioma + tropicalizacion + analisis audio + Kaizen continuo |
| **TOTAL** | | **~175-224h** | De 0% a ~100% cobertura QA automatizado |

**Costo por episodio (corregido):** ~$46-63/episodio con revision humana Tier 1 incluida. QA automatizado solamente: ~$6-13/episodio. Ahorro del ~97% vs revision humana completa ($5,400-8,100/episodio).

---

### 10.8 Lo que se Descarta Definitivamente

Estos elementos fueron evaluados por las 4 auditorias AI y descartados por consenso:

1. **PRD_FINAL.md (18 scripts greenfield)** -- SUPERSEDED. El trabajo real es integracion de codigo existente en AI-Studio, no construir desde cero en Doge-MultiLang.
2. **Crear `docx_parser.py` desde cero** -- Ya existe en AI-Studio (435 lineas, 3 modos, sanitizador). No reconstruir.
3. **Crear `elevenlabs_api_client.py` desde cero** -- Ya existe en AI-Studio (880 lineas, wrapper async completo). No reconstruir.
4. **Estimar 75h de trabajo greenfield** -- El trabajo real es ~175-224h de integracion, QA y automatizacion. La estimacion de 75h del swarm original estaba incompleta.
5. **Manual Dub CSV como solucion permanente** -- Consenso de 3 de 4 opiniones: CSV marcado como "experimental, production use strongly discouraged" por ElevenLabs. Reemplazado por Dubbing Resource API.
6. **Asumir "IMPLEMENTADO" = funcional en produccion** -- Verificar primero (Semana 0, Dia 1). Lo que dice un documento de planificacion y lo que funciona en codigo son cosas diferentes.

---

### 10.9 No-Go (Bloqueos Duros)

Reglas inviolables extraidas del consenso entre Codex Gold Standard y Mega Barrido Multi-Agente:

1. **No codificar contra endpoints conflictivos sin smoke test previo.** Las contradicciones detectadas (resource vs resources, segment path variants, audio-isolation vs audio-isolation/convert) deben resolverse con pruebas reales antes de escribir codigo.
2. **No asumir que "implementado" en documentos = funcional en produccion.** Phase 1+2 en AI-Studio son "reportadas por agentes" con confianza ~60-70%. Hasta un test E2E, son hipotesis.
3. **No lanzar 27 idiomas con blacklists 3/27.** Contenido infantil (8-15 anos) sin filtros de safety en 24 idiomas es un riesgo reputacional inaceptable. Minimo: blacklists Tier 1 completas antes de produccion.
4. **No usar parametros no verificados por test real de cuenta.** `auto_assign_voices` es alucinado (no existe en API). `from_content_json` esta bloqueado en plan Pro. Solo usar endpoints validados por smoke test.
5. **No mover trabajo de runtime a Doge-MultiLang si depende de AI-Studio.** Este repo es hub de specs, config y documentacion. El pipeline ejecutable vive en AI-Studio.

---

## 11. REGISTRO DE RIESGOS Y SUPUESTOS

### 11.1 Supuestos NO Verificados

Cada supuesto fue asumido en documentos previos (master plan dic 2024, PRD swarm, claude_debate v2) sin confirmacion empirica. Esta tabla consolida el estado real tras la critica del Abogado del Diablo, las correcciones del Addendum, y el cruce con datos de YouTube Analytics.

| # | Supuesto | Status | Confianza | Accion Requerida |
|:--|:---------|:-------|:----------|:-----------------|
| S-01 | Phase 1+2 implementadas en AI-Studio (PR #71) | **NO VERIFICADO** -- PR abierto en dic 2024, 14 meses stale, sin evidencia de merge ni uso en produccion. Saul/Ivan confirman que NO usan AI-Studio. | 30% | Verificar Dia 1: abrir AI-Studio, localizar PR #71, ejecutar `python main.py`, probar flujo E2E con 1 episodio. Sin esto, el plan entero carece de fundamento. |
| S-02 | Costo de QA es ~$1.20/proyecto | **CORREGIDO** -- El calculo original solo contaba STT + semantics basico. Con los 4 Gates completos (safety, traduccion, multi-idioma, audio) + revision humana Tier 1, el costo real es $46-63/episodio. | 15% (original) / 80% (corregido) | Aprobar presupuesto de $8-16/ep incremental para QA automatizado. Presentar a Management con comparativa: $48-66/ep propuesto vs $5,400-8,100/ep revision humana completa. |
| S-03 | Saul/Ivan aceptaran migrar de Web UI a AI-Studio | **NO PREGUNTADO** -- Ninguna entrevista ha explorado disposicion a migrar. Tienen workflow consolidado en Web UI con atajos y familiaridad. | 50% | Entrevista Dia 3: demo de 30 min de AI-Studio, capturar feedback real, identificar features indispensables de Web UI que deben existir en AI-Studio antes de migrar. |
| S-04 | Fernando puede exportar stems (audio separado por personaje) | **NO CONFIRMADO** -- POSTPROD_FERNANDO.md describe exportacion de audio ES como UN archivo limpio, no pistas separadas. Draft escrito por Daniel (75-85% confianza). | 20% | Entrevista Dia 3 con Fernando: preguntar directamente. Si no puede, descartar Opcion A y adoptar Render API tracks_zip como solucion. |
| S-05 | Whisper tiene WER < 5% para todos los idiomas incluyendo CJK | **DUDOSO** -- Whisper tiene sesgo anglocentrico documentado. Para Tamil (TA), Malay (MS), Filipino (FIL), la precision es significativamente menor. Falsos positivos masivos en Tier 3. | 40% | Benchmark obligatorio: transcribir 5 min de audio TA/MS/FIL con Whisper y medir WER real. Si >15%, usar SenseVoice para CJK o Deepgram como segunda opinion. Plazo: Semana 3. |
| S-06 | ElevenLabs TTS calidad consistente en 27 idiomas | **NO VERIFICADO** -- AVD de YouTube muestra caida de 49% en CJK (JA 2:22, KO 2:27, ZH 2:24) vs ES (4:41). Puede ser TTS, traduccion, o factores culturales. No hay benchmark MOS por idioma. | 50% | Generar 2 min de audio de prueba en cada idioma Tier 2+3 con UTMOS. Correlacionar MOS vs AVD. Plazo: Semana 3. |
| S-07 | Levantamientos reflejan la realidad de stakeholders | **PARCIAL** -- DUBBING_SAUL_IVAN.md dice "~70-80% confianza." POSTPROD_FERNANDO.md: "~75-85% confianza." Las 7 Mudas de Saul/Ivan y 5 Mudas de Fernando pueden estar incompletas o mal priorizadas. | 70-80% | Validar con sesion de 30 min por stakeholder (Dia 3). Confirmar prioridad de Mudas, restricciones tecnicas no documentadas, pain points que Daniel no menciono. |
| S-08 | `auto_assign_voices` existe como funcion de la Dubbing API | **DESMENTIDO** -- No existe en ningun endpoint documentado (129 docs verificados). La funcion existe en Studio API (edicion de proyectos), NO en Dubbing API. | Resuelto | Eliminado del plan. Reemplazado por workflow: crear proyecto via Dubbing API, editar asignaciones via Resource API. |
| S-09 | Manual Dub CSV acepta timestamps en formato esperado | **NO VERIFICADO** -- El Holy Grail Workflow depende de formato CSV no documentado. PRD_FINAL.md marca como "1 unknown API format." ElevenLabs marca CSV como "experimental." | 35% | Spike Dia 2: POST real a endpoint Manual Dub con CSV de prueba. Si no funciona, pivot a Dubbing Resource API. |
| S-10 | alignment_engine.py esta entregado y funcional | **CONTRADICTORIO** -- Master plan marca M5 como "Entregado (Phase 3)" pero Phase 3 esta marcada como "PENDIENTE." Addendum reporta 120 lineas "reportado por agentes" con confianza 60-70%. Probablemente un stub o esqueleto. | 25% | Verificar Dia 1: buscar archivo en AI-Studio, contar lineas, ejecutar. Si es stub, Phase 3 del Re-Alignment requiere construccion desde cero. Impacto: +2-3 semanas al timeline. |

---

### 11.2 Riesgos Ordenados por Impacto

| # | Riesgo | Prob. | Impacto | Mitigacion |
|:--|:-------|:------|:--------|:-----------|
| R-01 | **PR #71 stale/roto -- toda la premisa del plan depende de el.** Si Phase 1+2 no funcionan, el plan entero requiere reconstruccion. | ALTA | CRITICO | Verificar Dia 1 antes de CUALQUIER linea de codigo nueva. Abrir AI-Studio, ejecutar modulo de dubbing, probar flujo con 1 episodio real. Si esta roto: Decision D-001 (extender o partial rebuild). Tiempo de verificacion: 15 min para abrir + 2h para test E2E. |
| R-02 | **Saul/Ivan rechazan migracion a AI-Studio.** Tienen workflow consolidado en Web UI. Si AI-Studio tiene bugs durante transicion, genera resistencia organizacional. Phase 1+2 quedan inutilizadas. | MEDIA | ALTO | Entrevista Dia 3 con demo en vivo. Plan B: mantener Web UI como interfaz principal y conectar AI-Studio como backend silencioso (API-only, sin cambio de UX). Si rechazan por completo: documentar procedimiento de emergencia Web UI. |
| R-03 | **Fernando no puede exportar stems por personaje.** Opcion A (Multi-Track Stems) muere completamente. | ALTA | ALTO | Entrevista Dia 3. Solucion alternativa identificada: usar ElevenLabs Render API con parametro `tracks_zip=true` (audio separado por speaker directo de la API). Elimina dependencia de Fernando. Requiere proyecto creado via API. |
| R-04 | **ElevenLabs API cambio en 14 meses.** Manual Dub CSV, Text-to-Dialogue, Forced Alignment pueden no funcionar como se documenta en KB dic 2024. Endpoints pueden haber cambiado path, schema o disponibilidad por plan. | ALTA | ALTO | Spike tecnico Dia 2: probar CADA endpoint critico contra API real (no KB de dic 2024). Documentar que funciona y que cambio. 7 smoke tests obligatorios. |
| R-05 | **CJK Audio Voice Detection problemas no solucionables tecnicamente.** AVD de YouTube muestra caida de 49% en CJK. Puede ser raiz cultural, no solo tecnica. | MEDIA | ALTO | Diagnosticar con benchmarks: si problema es Whisper (anglocentric bias) -> SenseVoice; si TTS (calidad) -> Pronunciation Dictionaries + ajuste de voz; si cultural -> tropicalizacion con cultural_matrix.json. |
| R-06 | **9 de 13 pistas del checklist de audio NO son automatizables en scope de dubbing.** Pistas 1-9 son trabajo de Fernando (BGM, SFX, LUFS, lip sync). Solo Pistas 10-12 son automatizables. Pista 13 es 100% humana. | ALTA | MEDIO | Ser explicito: audit_service.py cubre Pistas 10-12 (TTS, sync, WER). No generar expectativa de automatizar las 13. Separar scope de Fernando del scope de QA automatizado. |
| R-07 | **Costo estimado incorrecto -- aprobacion de presupuesto requerida.** Costo real $46-63/ep vs $1.20 original (40-50x subestimado). | CONFIRMADO | ALTO | Presentar a Management ANTES de Fase 1 con ROI: $48-66/ep propuesto vs $5,400-8,100/ep alternativa humana (ahorro del 97%). Decision D-005 pendiente. |
| R-08 | **Fuzzy match falla en lineas ad-lib de Fernando.** Dialogos no presentes en manifest.json generan speaker detection incorrecto (personaje A con voz de B). | MEDIA | MEDIO | Re-Alignment Engine debe manejar caso "linea sin match": flag para revision humana + voice_id "desconocido." Alternativa: usar ElevenLabs Forced Alignment API en lugar de motor custom de fuzzy match. |
| R-09 | **Sin plan de rollback si AI-Studio falla durante produccion.** Episodio queda bloqueado hasta resolver bug. Proyectos API vs Web UI son instancias separadas. | MEDIA | MEDIO | Documentar procedimiento de emergencia ANTES de migracion: (1) identificar episodio, (2) recrear proyecto en Web UI manualmente, (3) Saul/Ivan completan via Web UI. Tiempo de rollback: 1-2h. Incluir contacto soporte ElevenLabs. |
| R-10 | **27 idiomas sin datos de ROI -- puede ser pasivo, no activo.** Tamil (30K views, ~$10 revenue), Filipino (46K views, ~$50 revenue), Mandarin (65K views, ~$140 revenue) tienen ROI potencialmente negativo. | MEDIA | MEDIO | Extraer analytics YouTube por idioma (Dia 4). Si 15+ idiomas generan <5% de views combinados, reducir scope MVP a Tier 1 (5 idiomas). No automatizar 27 desde el inicio sin justificacion financiera. |
| R-11 | **Whisper falsos positivos en Tier 3 invalidan sistema de auditoria.** WER alto en auditoria puede ser error de Whisper, no del dubbing. Tamil, Malay, Filipino particularmente afectados. | MEDIA | MEDIO | Benchmark Whisper en TA/MS/FIL con 5 min audio. Si WER de Whisper >15%: Whisper + Deepgram dual para Tier 1, Scribe v2 + Whisper para Tier 2, solo metricas automaticas (chrF++, COMET sin referencia) para Tier 3. No usar WER como metrica primaria donde Whisper no es confiable. |
| R-12 | **No hay ambiente de staging -- pruebas sobre cuenta de produccion pueden corromper proyectos activos.** | MEDIA | MEDIO | Crear proyecto de prueba dedicado en ElevenLabs ANTES de verificacion de API. Usar episodio de prueba, no contenido real. Coordinar ventana de prueba con Saul/Ivan cuando no esten procesando episodios. |

---

### 11.3 Incertidumbres que Este Repo NO Puede Cerrar

Las siguientes incertidumbres requieren acciones fuera del ambito de Doge-MultiLang y no pueden resolverse con mas documentacion o analisis:

1. **Estado real ejecutable de AI-Studio / PR #71 en produccion.** Solo verificable abriendo el repo de AI-Studio y ejecutando codigo real. Ningun documento puede reemplazar un test E2E.
2. **Disponibilidad real por plan/cuenta de endpoints sensibles.** `from_content_json` reportado como bloqueado en plan Pro. Limites de Dubbing Resource API desconocidos. Solo verificable con API key real y smoke tests contra la cuenta de produccion.
3. **Credenciales, rate limits y cuotas vigentes.** El plan Pro de ElevenLabs puede tener limites de concurrencia que impidan procesamiento de 27 idiomas en batch. Solo verificable con la cuenta activa.
4. **ROI real por idioma con data viva de negocio.** Los datos de YouTube Analytics presentados en Gaps_Pendientes son estimaciones por atribucion geografica. Revenue exacto por idioma requiere acceso directo a YouTube Analytics API con la cuenta del canal.
5. **Calidad final por idioma sin pruebas sobre episodios reales.** Ningun benchmark sintetico reemplaza procesar un episodio real completo en los 27 idiomas y evaluar el output. Solo un vertical slice E2E cierra esta incertidumbre.

**Checklist minimo para cerrar estas incertidumbres:**

| # | Accion | Cierra incertidumbre | Esfuerzo |
|:--|:-------|:---------------------|:---------|
| 1 | Acceso AI-Studio + prueba E2E | Estado real del codigo (#1) | 2-4h |
| 2 | API key real + smoke test de 7 endpoints | Disponibilidad de endpoints (#2, #3) | 1 dia |
| 3 | Confirmacion de plan comercial ElevenLabs y limites | Rate limits y cuotas (#3) | 1h (email a soporte) |
| 4 | YouTube Analytics API con cuenta del canal | ROI real por idioma (#4) | 4h |
| 5 | Vertical slice: 1 episodio E2E en 5 idiomas Tier 1 | Calidad final (#5) | 1 dia |

---

## 12. DECISIONES PENDIENTES

Estas decisiones deben tomarse con datos reales de los primeros 5 dias de verificacion (Semana 0). Ninguna debe tomarse basandose unicamente en documentos de planificacion.

| # | Decision | Opciones | Responsable | Deadline | Recomendacion |
|:--|:---------|:---------|:------------|:---------|:--------------|
| D-001 | **Extender AI-Studio existente o partial rebuild?** | A) Mergear PR #71 y construir sobre lo existente. B) Fork del modulo de dubbing y refactorizar. C) Reconstruir desde cero solo Phase 3 (si Phase 1+2 funcionan). D) Abandono completo de AI-Studio, construir en Doge-MultiLang. | Daniel | Dia 5 (despues de verificacion PR #71 y spike API) | Depende 100% del resultado de la verificacion Dia 1. Si PR #71 compila y Phase 1+2 pasan test basico: **Opcion C**. Si PR roto pero arquitectura salvable: **Opcion B**. Si todo es esqueleto: **Opcion D** con costos y timeline revisados. |
| D-002 | **Cuantos idiomas en el MVP piloto?** | A) 5 idiomas (Tier 1: ES, EN, PT-BR, FR, DE). B) 10 idiomas (Tier 1+2). C) 27 idiomas desde el inicio. | Daniel + Management | Despues de datos ROI por idioma (Dia 4) | **Recomendar Opcion A: Tier 1 (5 idiomas).** Permite validar pipeline E2E con idiomas donde hay revision humana real. Escalar a Tier 2 solo cuando FTR > 50% en Tier 1. Escalar a 27 solo con Dashboard QA funcionando. Datos de YouTube Analytics muestran que Tier 1 cubre >80% del revenue. |
| D-003 | **Manual Dub CSV vs Dubbing Resource API?** | A) Manual Dub CSV (Holy Grail del master plan, formato no verificado, marcado "experimental"). B) Dubbing Resource API (endpoint REST estandar, soportado, testeable). C) Hibrido: CSV como primary, Resource API como fallback. | Daniel | Despues del spike API (Dia 2) | **Recomendar Opcion B: Resource API.** CSV es "1 unknown API format" segun PRD. Resource API es REST estandar, mas facil de testear y mantener. Si spike confirma que CSV funciona: Opcion C. |
| D-004 | **Enfoque de separacion de audio para QA?** | A) Fernando exporta stems por personaje desde After Effects. B) Re-Alignment Engine con Whisper fuzzy match sobre MP4 mezclado. C) ElevenLabs Render API con tracks_zip (audio separado por speaker directo de la API). D) Combinacion B+C para mayor confianza. | Daniel + Fernando | Despues de entrevista con Fernando (Dia 3) | **Recomendar Opcion C: Render API tracks_zip.** Elimina dependencia de Fernando, elimina necesidad de fuzzy match custom. Audio separado viene con speaker IDs correctos. Requiere proyecto creado via API. Si Fernando PUEDE exportar stems: Opcion D (tracks_zip + stems como validacion cruzada). |
| D-005 | **Pausar idiomas de bajo ROI?** | A) Mantener 27 idiomas sin cambio. B) Pausar idiomas con ROI negativo (Tamil, Filipino, Mandarin). C) Degradar a solo automatico sin revision. | Management | Despues de datos ROI (Dia 4) | **Requiere datos.** Candidatos a pausar segun YouTube Analytics: Tamil (30K views, ~$10 revenue, AVD 1:58), Filipino (46K views, ~$50, AVD 2:24), Mandarin (65K views, ~$140, AVD 2:24). Candidatos a invertir mas: PT-BR (35.5M views, ~$19K), DE (2.1M views, ~$14K), IT (4.4M views, ~$11K). |
| D-006 | **Nivel de strictness del sistema de safety (Gate 1)?** | A) Estricto: bloquear todo Cat. A sin override. B) Moderado: bloquear Cat. A con override por Gio (con justificacion). C) Permisivo: solo flag, decision humana siempre. | Gio + Andrea | 3 de marzo (antes de Fase 2) | **Recomendar Opcion B.** Balancea proteccion de audiencia infantil con realidad operativa. Cat. A bloqueo por defecto, Gio puede override con justificacion documentada (ej: contexto educativo). Cat. B y C son solo flags. |
| D-007 | **Upgrade de plan ElevenLabs (Pro a Enterprise)?** | A) Mantener Pro actual. B) Upgrade a Scale. C) Upgrade a Enterprise. | Management | Despues del spike API (Dia 2) | Depende de limitaciones del spike. Si Pro tiene rate limits que impiden batch de 27 idiomas, o Resource API requiere Enterprise: upgrade necesario. Si Pro es suficiente para MVP de 5 idiomas: mantener Pro y evaluar upgrade en Fase 3. Obtener cotizacion Enterprise como parte del spike. |
| D-008 | **Timeline de migracion del workflow de guionismo (Andrea)?** | A) Migrar en paralelo con Fase 2 (Semana 4-6). B) Migrar despues de Fase 3 cuando pipeline este estable. C) No migrar -- Andrea sigue con proceso actual y docx_parser se adapta al formato existente. | Andrea + Daniel | Despues de Fase 2 (Semana 6) | **Recomendar Opcion B.** Migrar guionismo durante implementacion de QA introduce demasiada variabilidad. Estabilizar pipeline con formato actual de Andrea primero, medir baseline, luego optimizar input en segundo ciclo. |

---

## 13. OBJETIVOS SMART Y METRICAS

### 13.1 Baseline y Metas 30/60/90 Dias

Principio rector: Los primeros 30 dias son para MEDIR, no para mejorar. No se puede optimizar lo que no se mide. Los "Desconocido" de hoy se convierten en numeros reales que permiten fijar metas realistas.

| Metrica | Hoy (Baseline) | Meta 30 Dias | Meta 60 Dias | Meta 90 Dias |
|:--------|:---------------|:-------------|:-------------|:-------------|
| Idiomas con revision de calidad | 1 de 27 (solo EN, parcial) | 5 de 27 (Tier 1 medido) | 10 de 27 (Tier 1+2 medidos) | **27 de 27** |
| WER Tier 1 (ES, EN, PT-BR, FR, DE) | Desconocido | Medido (1er baseline real) | < 8% | **< 5%** |
| WER Tier 2 (AR, KO, JA, HI, ZH) | Desconocido | Desconocido | Medido (1er baseline real) | **< 10%** |
| WER Tier 3 (FIL, ID, IT, RU, TR, TA, MS) | Desconocido | Desconocido | Desconocido | **Medido (1er baseline)** |
| Blacklists activas | 3 de 27 (global, AR, DE) | 3 de 27 (sin cambio) | 10 de 27 (Tier 1+2) | **27 de 27** |
| FTR (First Time Right) | Desconocido | Medido (1er baseline) | > 40% | **> 60%** |
| Correcciones manuales por episodio | Desconocido | Medido (1er baseline) | -20% vs baseline | **-40% vs baseline** |
| Contenido Cat. A publicado (Tier 1) | Desconocido (riesgo latente) | 0 en Tier 1 | 0 en Tier 1+2 | **0 en todos los tiers** |
| Tiempo de doblaje por episodio | ~4.5 hrs (estimado, no medido) | Medido exacto | -15% vs baseline | **-30% vs baseline** |
| ROI por idioma calculado | 0 idiomas | 0 idiomas | 5 idiomas (Tier 1) | **27 idiomas** |

---

### 13.2 Los 7 Objetivos SMART

**O1 -- Medir calidad de los 27 idiomas (Semana 3)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Instalar pipeline de medicion WER (Whisper + scoring) y ejecutarlo sobre 1 episodio piloto completo en los 27 idiomas activos, generando un reporte de calidad por idioma. |
| **Medible** | 27 scores WER generados (uno por idioma), almacenados en formato JSON, con timestamp y episodio de referencia. Entregable: archivo `qa_reports/baseline_ep_XXX.json`. |
| **Alcanzable** | Herramientas gratuitas (Whisper open source) o bajo costo ($1.5-3 por episodio). Solo requiere 1 episodio de prueba y tiempo de Daniel para configuracion. |
| **Relevante** | Sin medicion no existe base para ninguna decision informada sobre calidad, presupuesto, o priorizacion de idiomas. Prerequisito de todos los demas objetivos. |
| **Tiempo** | Semana 3 (deadline firm). Dia 1-2 configuracion de Whisper, Dia 3-5 ejecucion y generacion de reporte. |

**O2 -- Zero contenido Categoria A en Tier 1 (Semana 6)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Que ningun contenido critico (groserias, ofensas culturales, violencia, self-harm) pase a publicacion en los 5 idiomas de Tier 1 (ES, EN, PT-BR, FR, DE). Gate 1 bloquea automaticamente. |
| **Medible** | 0 flags de Categoria A post-publicacion en Tier 1, medido semanalmente. Cada flag Cat. A es un incidente documentado con root cause analysis. |
| **Alcanzable** | Gate 1 (blacklists + LLM safety judge + ElevenLabs Scribe v2 entity detection) detecta contenido Cat. A pre-publicacion. Blacklists de 5 idiomas Tier 1 completas para Semana 5. |
| **Relevante** | Audiencia infantil (8-15 anos). Un solo episodio con contenido inapropiado dana la marca. Linea roja no negociable del sistema. |
| **Tiempo** | Semana 6. Gate 1 operativo Semana 4, blacklists Tier 1 completas Semana 5, primera semana de medicion cero-incidentes Semana 6. |

**O3 -- 27 blacklists completas (Semana 6)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Crear listas de palabras/frases prohibidas para cada uno de los 27 idiomas. Almacenadas como JSON en `knowledgebase/blacklists/by_language/`. Cada blacklist contiene: groserias, insultos culturales, terminos violentos, contenido sexual, terminos sensibles para audiencia infantil. |
| **Medible** | 27 archivos JSON validados (1 por idioma). Minimo 20 entradas por idioma Tier 1, minimo 10 Tier 2/3. Cada entrada con campo `category` (A/B/C) y `severity`. |
| **Alcanzable** | LLM genera borrador por idioma (~2h total). Validacion nativa Tier 1 (5 idiomas x 1h). Tier 2+3 inician con borrador LLM y se refinan via Kaizen. Tiempo total: 2-3 dias. |
| **Relevante** | Actualmente solo existen 3 blacklists (global, AR, DE). Faltan 24 idiomas, incluyendo ZH (filtros chinos estrictos), KO, JA, HI. Directorio `by_language/` referenciado en blacklist_global.json no existe. |
| **Tiempo** | Semana 6. Borrador LLM Semana 4, validacion nativa Tier 1 Semana 5, publicacion completa Semana 6. |

**O4 -- Dashboard QA funcional (Semana 10)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Tablero Metabase (open source) con semaforo por idioma, tasa de error, tendencias semanales, y reporte por episodio. Accesible via URL interna a todo el equipo (Daniel, Saul/Ivan, Andrea, Ramon, Alan, Gio). |
| **Medible** | Dashboard desplegado y con datos reales de al menos 4 semanas de produccion. Metricas visibles: WER por idioma, FTR semanal, Cat. A incidents, tendencia mensual. Al menos 3 miembros del equipo acceden semanalmente. |
| **Alcanzable** | Metabase es gratuito, no-code, conecta a PostgreSQL/Supabase. Los datos ya se generan en qa_reports/. Solo requiere configurar visualizaciones y acceso. Setup: 1-2 dias. |
| **Relevante** | Actualmente solo Daniel tiene visibilidad de la calidad tecnica. Todo el equipo necesita ver resultados para tomar decisiones informadas. La reunion OVEJA necesita datos, no opiniones. |
| **Tiempo** | Semana 10. Infraestructura Semana 7-8, primeras visualizaciones Semana 9, dashboard completo con 4 semanas de datos Semana 10. |

**O5 -- FTR > 60% en episodios (Semana 12)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | 60% de los episodios pasan los 4 Quality Gates sin necesidad de correcciones manuales de Saul/Ivan. Un episodio "FTR" pasa los 4 Gates con PASS sin intervenciones humanas excepto la revision final confirmativa de Tier 1. |
| **Medible** | FTR = episodios aprobados sin correccion / total episodios procesados x 100. Target: >= 60% en promedio movil de 4 semanas para Semana 12. |
| **Alcanzable** | Combinacion de: blacklists previenen errores Cat. A, Mem0 aplica correcciones aprendidas, prescanner detecta problemas pre-ElevenLabs, multi-LLM audit detecta errores de traduccion. Cada componente reduce una categoria de error. 60% alcanzable con Tier 1 estabilizado. |
| **Relevante** | Menos retrabajo = mas eficiencia operativa. FTR 60% vs ~0% actual significa que Saul/Ivan solo intervienen en 2 de 5 episodios en lugar de en todos. Libera capacidad para escalar. |
| **Tiempo** | Semana 12. Primeras mediciones Semana 3, mejora progresiva con cada componente, target alcanzado Semana 12. |

**O6 -- ROI por idioma calculado (Semana 12)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Cruzar YouTube Analytics (vistas, retencion, revenue estimado) con costo de produccion por idioma (ElevenLabs + tiempo humano + QA) para obtener ROI = (ingresos - costo) / costo por cada uno de los 27 idiomas. |
| **Medible** | 27 valores de ROI calculados. Tabla con columnas: idioma, vistas mensuales, revenue estimado, costo produccion, costo QA, ROI, recomendacion (mantener/pausar/agregar). |
| **Alcanzable** | YouTube Analytics API disponible gratuitamente. Datos de costo interno ya conocidos. Requiere: API key YouTube, script de extraccion (~1 dia), cruce con datos de costos (~1 dia). Datos preliminares ya disponibles en Gaps_Pendientes_Deep_Research. |
| **Relevante** | Para decidir que idiomas mantener, pausar o agregar con datos en lugar de intuicion. Si 15 idiomas generan <5% de views combinados, concentrar recursos en los rentables. Nadie ha hecho este calculo formalmente. |
| **Tiempo** | Semana 12. Extraccion de datos YouTube Semana 10, cruce con costos Semana 11, reporte final con recomendaciones Semana 12. |

**O7 -- Kaizen loop activo (Semana 16)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Sistema de mejora continua operativo: Mem0 almacenando correcciones y aplicandolas automaticamente, ciclo PDCA semanal en reunion OVEJA, taxonomia MQM clasificando errores, YouTube Analytics como feedback loop de audiencia, captura de conocimiento tribal de Saul/Ivan. |
| **Medible** | (1) Mem0 con al menos 50 memorias activas. (2) FTR mejorando >10% en 4 semanas consecutivas. (3) Error Recurrence Rate < 20%. (4) Al menos 3 ciclos PDCA completados con mejoras documentadas. |
| **Alcanzable** | Mem0 es open source (Apache 2.0). PDCA se alinea con reunion OVEJA existente. Taxonomia MQM ya definida. Solo requiere configurar y alimentar con datos reales. |
| **Relevante** | Transforma el pipeline de proceso estatico a sistema que aprende. Cada episodio procesado mejora al sistema para el siguiente. El conocimiento de Saul/Ivan se captura y no se pierde si dejan el equipo. |
| **Tiempo** | Semana 16. Mem0 configurado Semana 13, primeros ciclos PDCA Semana 14, sistema estable con 3+ ciclos Semana 16. |

---

### 13.3 KPIs de Mejora Continua (Kaizen)

Estas metricas alimentan el ciclo PDCA semanal y se presentan en la reunion OVEJA. Si alguna se estanca por 4 semanas consecutivas, se escala automaticamente para revisar el enfoque.

| Metrica | Formula | Target | Frecuencia | Notas |
|:--------|:--------|:-------|:-----------|:------|
| **FTR (First Time Right)** | Episodios aprobados sin correccion / Total episodios | > 60% Phase 1, > 80% Phase 3 | Semanal | Metrica primaria de eficiencia. Si cae >10% vs semana anterior, investigar causa raiz en la misma reunion. |
| **Error Recurrence Rate** | Errores repetidos / Total errores | < 20% | Mensual | Mide efectividad de Mem0. Si un error se repite mas de 2 veces con Mem0 activo, hay problema en captura de correccion. |
| **CAPA Effectiveness** | CAPAs efectivas / CAPAs implementadas x 100 | > 70% | Trimestral | Mide si las acciones correctivas realmente resuelven los problemas raiz. CAPAs inefectivas se descartan con datos, no opiniones. |
| **Mean Corrections/Episode** | Correcciones manuales / Episodio | Decreciente (-10%/mes) | Semanal | Proxy directo de automatizacion. Debe bajar con cada componente activado. Si sube, algo se rompio. |
| **WER Trend por idioma** | WER promedio mensual por idioma | Decreciente | Mensual | Tendencia de calidad de transcripcion. Si WER sube en un idioma, puede ser cambio en ElevenLabs o degradacion de voz. |
| **Audience Sentiment Score** | Promedio sentiment de comentarios por idioma (via tabularisai/multilingual-sentiment-analysis) | > 0.6 (positivo) | Semanal | Senal de calidad percibida por la audiencia. Si sentiment cae en un idioma, investigar: es TTS? traduccion? contenido? |
| **AVD Delta por idioma** | (AVD idioma - AVD ES) / AVD ES x 100 | Tendencia hacia 0% (acercarse a ES) | Mensual | Datos de YouTube Analytics. Si AVD delta se reduce, la calidad del dubbing esta mejorando la retencion en ese idioma. |
| **Cat. A Escape Rate** | Incidentes Cat. A post-publicacion / Total episodios publicados | 0% (tolerancia cero) | Semanal | Metrica de safety. Cualquier escape es incidente critico con root cause analysis obligatorio. |

**Indicadores de la Reunion OVEJA (3 numeros, 1 decision):**

1. **Semaforo por idioma:** Cada idioma tiene color basado en score MQM semanal. Verde (<= umbral tier, sin Critical), Amarillo (1x-2x umbral o Major recurrentes), Rojo (>2x umbral o Critical). Si un idioma lleva 4 semanas en rojo, se escala D-002 (pausar idioma) a Management.

2. **FTR de la semana:** Un solo numero. "FTR esta semana: 45%. La semana pasada fue 40%. Vamos en la direccion correcta."

3. **Tendencia:** Basado en promedio movil 4 semanas. Mejorando (FTR subiendo, mas verdes), Estancado (sin cambio 4 semanas -- trigger: revisar PDCA), Empeorando (FTR bajando, idiomas de verde a rojo -- trigger: reunion extraordinaria).
