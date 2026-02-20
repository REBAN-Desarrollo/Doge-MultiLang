## 13. REGISTRO DE RIESGOS

### 13.1 Supuestos NO Verificados

Cada supuesto listado a continuacion fue asumido en documentos previos (master plan dic 2024, PRD swarm, claude_debate v2) sin confirmacion empirica. Esta tabla consolida el estado real tras la critica del Abogado del Diablo y las correcciones del Addendum.

| # | Supuesto | Status | Confianza | Accion Requerida |
|:--|:---------|:-------|:----------|:-----------------|
| S-01 | Phase 1+2 implementadas en AI-Studio (PR #71) | **NO VERIFICADO** -- PR abierto en dic 2024, 14 meses stale, sin evidencia de merge ni uso en produccion. Saul/Ivan confirman que NO usan AI-Studio. | 30% | Verificar Dia 1: abrir AI-Studio, localizar PR #71, ejecutar `python main.py`, probar flujo E2E con 1 episodio. Sin esto, el plan entero carece de fundamento. |
| S-02 | Costo de QA es ~$1.20/proyecto | **CORREGIDO** -- El calculo original solo contaba STT + semantics basico. Con los 4 Gates completos (safety, traduccion, multi-idioma, audio) + revision humana Tier 1, el costo real es $46-63/episodio. | 15% (original) / 80% (corregido) | Aprobar presupuesto de $8-16/ep incremental para QA automatizado. Presentar a Management con comparativa: $48-66/ep propuesto vs $5,400-8,100/ep revision humana completa. |
| S-03 | Saul/Ivan aceptaran migrar de Web UI a AI-Studio | **NO PREGUNTADO** -- Ninguna entrevista ha explorado disposicion a migrar. Tienen workflow consolidado en Web UI con atajos y familiaridad. DUBBING_SAUL_IVAN.md dice "pendiente migracion" como decision de management, no preferencia del operador. | 50% | Entrevista Dia 3: demo de 30 min de AI-Studio a Saul/Ivan, capturar feedback real, identificar features indispensables de Web UI que deben existir en AI-Studio antes de migrar. |
| S-04 | Fernando puede exportar stems (audio separado por personaje) | **NO CONFIRMADO** -- POSTPROD_FERNANDO.md describe exportacion de audio ES como UN archivo limpio, no pistas separadas por personaje. Exportar stems requiere disciplina de proyecto no forzada actualmente. Draft escrito por Daniel cubriendo rol de Fernando (75-85% confianza). | 20% | Entrevista Dia 3 con Fernando: preguntar directamente si puede y quiere exportar por personaje. Si no, descartar Opcion A y adoptar Render API tracks_zip como solucion de separacion de audio. |
| S-05 | Whisper tiene WER < 5% para todos los idiomas incluyendo CJK | **DUDOSO** -- Whisper tiene sesgo anglocentrico documentado. Para Tamil (TA), Malay (MS), Filipino (FIL), la precision es significativamente menor. Un WER alto en auditoria puede ser error de Whisper, no del dubbing. El sistema generaria falsos positivos masivos en Tier 3. | 40% | Benchmark obligatorio: transcribir 5 min de audio TA/MS/FIL con Whisper y medir WER real. Si >15%, considerar SenseVoice para CJK o Deepgram como segunda opinion (consenso dual STT). Plazo: DR03 (Semana 3). |
| S-06 | ElevenLabs TTS calidad consistente en 27 idiomas | **NO VERIFICADO** -- La KB de ElevenLabs fue crawleada en dic 2024 (14 meses desactualizada). No hay benchmark de calidad TTS por idioma. Los idiomas Tier 3 (Tamil, Malay, Filipino) pueden tener voces de calidad inferior o limitada disponibilidad de voces infantiles adecuadas para QPH. | 50% | DR03: generar 2 minutos de audio de prueba en cada idioma Tier 2+3 con las voces asignadas. Evaluar MOS (Mean Opinion Score) y naturalidad. Plazo: Semana 3. |
| S-07 | Levantamientos reflejan la realidad de stakeholders | **PARCIAL** -- DUBBING_SAUL_IVAN.md dice explicitamente "~70-80% confianza, pendiente validacion con Saul e Ivan." POSTPROD_FERNANDO.md: "~75-85% confianza, pendiente validacion de Fernando." Las 7 Mudas de Saul/Ivan y 5 Mudas de Fernando pueden estar incompletas o mal priorizadas. | 70-80% | Validar con sesion de 30 min por stakeholder (Dia 3). Especificamente confirmar: prioridad de las Mudas, restricciones tecnicas no documentadas, pain points que Daniel no menciono. Ajustar plan si hay discrepancias mayores. |
| S-08 | `auto_assign_voices` existe como funcion de la Dubbing API | **DESMENTIDO** -- La funcion existe en la Studio API (edicion de proyectos), NO en la Dubbing API directamente. El PRD del swarm la listaba como componente a integrar. La solucion correcta es usar Dubbing Resource API con endpoint `/v1/dubbing/{id}/resources` para editar segmentos post-creacion. | Resuelto | Eliminado del plan. Reemplazado por workflow: crear proyecto via Dubbing API, luego editar asignaciones via Resource API. Validar que Resource API funciona con plan Pro en spike tecnico Dia 2. |
| S-09 | Manual Dub CSV acepta timestamps en formato esperado | **NO VERIFICADO** -- El "Holy Grail Workflow" depende de que ElevenLabs acepte un CSV con timestamps por segmento. PRD_FINAL.md marca esto como "1 unknown API format." Si el formato cambio o no existe, el workflow principal no funciona. | 35% | Spike Dia 2: hacer POST real a endpoint de Manual Dub con CSV de prueba. Documentar formato aceptado. Si no funciona, pivot a Dubbing Resource API como alternativa. |
| S-10 | alignment_engine.py esta entregado y funcional | **CONTRADICTORIO** -- Master plan marca M5 como "alignment_engine.py Entregado (Phase 3)" pero Phase 3 esta marcada como "PENDIENTE." Addendum reporta 120 lineas de codigo "reportado por agentes" con confianza 60-70%. Probablemente un stub o esqueleto. | 25% | Verificar Dia 1: buscar archivo en AI-Studio, contar lineas, ejecutar. Si es stub, Phase 3 del Re-Alignment requiere construccion desde cero. Impacto: +2-3 semanas al timeline. |

### 13.2 Riesgos Ordenados por Impacto

| # | Riesgo | Prob. | Impacto | Mitigacion |
|:--|:-------|:------|:--------|:-----------|
| R-01 | **PR #71 stale/roto -- toda la premisa del plan depende de el** | ALTA | CRITICO | Verificar Dia 1 antes de CUALQUIER linea de codigo nueva. Abrir AI-Studio, ejecutar modulo de dubbing, probar flujo con 1 episodio real. Si esta roto: decision D-001 (extender o partial rebuild). Tiempo de verificacion: 15 min para abrir + 2h para test E2E. |
| R-02 | **Saul/Ivan rechazan migracion a AI-Studio** | MEDIA | ALTO | Entrevista Dia 3 con demo en vivo de 30 min. Identificar features indispensables de Web UI. Plan B: mantener Web UI como interfaz principal y conectar AI-Studio como backend silencioso (API-only, sin cambio de UX para operadores). Si rechazan por completo: documentar procedimiento de emergencia Web UI. |
| R-03 | **Fernando no puede exportar stems por personaje** | ALTA | ALTO | Entrevista Dia 3. Solucion alternativa ya identificada: usar ElevenLabs Render API con parametro `tracks_zip=true` que devuelve audio separado por speaker. Esto elimina la dependencia de Fernando para separacion de audio. Requiere que el proyecto se haya creado via API (no Web UI). |
| R-04 | **ElevenLabs API cambio en 14 meses -- Manual Dub CSV, Text-to-Dialogue, Forced Alignment pueden no funcionar** | ALTA | ALTO | Spike tecnico Dia 2: probar CADA endpoint critico contra documentacion actual de ElevenLabs (no la KB de dic 2024). Endpoints a verificar: (1) POST /v1/dubbing con CSV, (2) Text-to-Dialogue/equivalente actual, (3) POST /v1/forced-alignment, (4) GET /v1/dubbing/{id}/resources. Documentar que funciona y que cambio. |
| R-05 | **CJK Audio Voice Detection (AVD) problemas no solucionables tecnicamente -- raiz cultural, no tecnica** | MEDIA | ALTO | DR02 + DR03 diagnostican si el problema es de Whisper (anglocentric bias), de ElevenLabs (calidad TTS en CJK), o cultural (conceptos sin equivalente). Para cada causa, hay mitigacion diferente: Whisper -> SenseVoice; TTS -> ElevenLabs Pronunciation Dictionaries + ajuste de voz; cultural -> tropicalizacion con cultural_matrix.json. |
| R-06 | **9 de 13 pistas del checklist de audio NO son automatizables en scope de dubbing** | ALTA | MEDIO | Ser explicito: `audit_service.py` cubre Pistas 10-12 (TTS, sync, WER). Pistas 1-9 son trabajo de Fernando en post-produccion (BGM, SFX, LUFS, lip sync) y requieren analisis de video, no solo audio. Pista 13 es 100% humana. No generar expectativa de automatizar las 13. Separar scope de Fernando del scope de QA automatizado. |
| R-07 | **Costo estimado incorrecto -- aprobacion de presupuesto requerida** | CONFIRMADO | ALTO | El costo real es $46-63/episodio (vs $1.20 original). Desglose: $8-16 QA automatizado + $40-50 revision humana Tier 1. Presentar a Management ANTES de Fase 1 con ROI: $48-66/ep vs $5,400-8,100/ep alternativa humana (ahorro del 99%). Decision D-005 pendiente. |
| R-08 | **Fuzzy match falla en lineas ad-lib de Fernando (dialogos no presentes en manifest.json de Ramon)** | MEDIA | MEDIO | POSTPROD_FERNANDO.md confirma que Fernando puede "recortar, ajustar o modificar dialogos durante la mezcla." Re-Alignment Engine debe manejar caso "linea sin match": flag para revision humana + asignar voice_id "desconocido." Alternativa superior: usar ElevenLabs Forced Alignment API en lugar de motor custom de fuzzy match. |
| R-09 | **Sin plan de rollback si AI-Studio falla durante produccion** | MEDIA | MEDIO | Documentar procedimiento de emergencia: (1) Identificar episodio afectado, (2) Recrear proyecto en Web UI de ElevenLabs manualmente, (3) Cargar audio/guion original, (4) Saul/Ivan completan via Web UI. Tiempo estimado de rollback: 1-2 horas adicionales. Documentar ANTES de iniciar migracion. Incluir contacto de soporte ElevenLabs. |
| R-10 | **27 idiomas sin datos de ROI -- puede ser pasivo, no activo** | MEDIA | MEDIO | Extraer analytics de YouTube por idioma (Dia 4). Calcular views, retencion, revenue estimado por idioma ultimos 3 meses. Si 15+ idiomas generan <5% de views combinados, la decision correcta puede ser reducir scope del MVP a Tier 1 (5 idiomas), no automatizar 27 desde el inicio. |
| R-11 | **Whisper falsos positivos en Tier 3 invalidan sistema de auditoria** | MEDIA | MEDIO | Benchmark Whisper en Tamil, Malay, Filipino con 5 min audio. Si WER de Whisper >15% en estos idiomas, usar configuracion tiered: Whisper + Deepgram dual para Tier 1, Scribe v2 + Whisper para Tier 2, solo metricas automaticas (chrF++, COMET sin referencia) para Tier 3. No usar WER como metrica primaria donde Whisper no es confiable. |
| R-12 | **No hay ambiente de staging -- pruebas sobre cuenta de produccion pueden corromper proyectos activos** | MEDIA | MEDIO | Crear proyecto de prueba dedicado en ElevenLabs ANTES de cualquier verificacion de API. Usar episodio de prueba (no contenido real en produccion). Si ElevenLabs plan Pro no permite multiples proyectos simultaneos, coordinar ventana de prueba con Saul/Ivan cuando no esten procesando episodios. |

---

## 14. DECISIONES PENDIENTES

Estas decisiones deben tomarse con datos reales de los primeros 5 dias de verificacion. Ninguna debe tomarse basandose unicamente en documentos de planificacion.

| # | Decision | Opciones | Responsable | Deadline | Recomendacion |
|:--|:---------|:---------|:------------|:---------|:--------------|
| D-001 | **Extender AI-Studio existente o partial rebuild?** | A) Mergear PR #71 y construir sobre lo existente. B) Fork del modulo de dubbing y refactorizar. C) Reconstruir desde cero solo Phase 3 (si Phase 1+2 funcionan). D) Abandono completo de AI-Studio, construir en Doge-MultiLang. | Daniel | Dia 5 (despues de verificacion PR #71 y spike de API) | Depende 100% del resultado de la verificacion Dia 1. Si PR #71 compila y Phase 1+2 pasan test basico: Opcion C. Si PR esta roto pero la arquitectura es salvable: Opcion B. Si todo es un esqueleto: Opcion D con costos y timeline revisados. |
| D-002 | **Cuantos idiomas en el MVP piloto?** | A) 5 idiomas (Tier 1: ES, EN, PT-BR, FR, DE). B) 10 idiomas (Tier 1+2). C) 27 idiomas desde el inicio. | Daniel + Management | Despues de obtener datos de ROI por idioma (Dia 4) | **Recomendar Opcion A: Tier 1 (5 idiomas).** Razon: permite validar todo el pipeline E2E con idiomas donde hay capacidad de revision humana real. Escalar a Tier 2 solo cuando FTR > 50% en Tier 1. Escalar a 27 solo con Dashboard QA funcionando. Reducir riesgo reputacional en idiomas sin validacion. |
| D-003 | **Manual Dub CSV vs Dubbing Resource API?** | A) Manual Dub CSV: subir CSV con timestamps predefinidos (Holy Grail del master plan, formato no verificado). B) Dubbing Resource API: crear proyecto standard, luego editar segmentos via /v1/dubbing/{id}/resources (endpoint verificable). C) Hibrido: intentar CSV, fallback a Resource API. | Daniel | Despues del spike de API (Dia 2) | **Recomendar Opcion B: Resource API.** Razon: el formato CSV es un "1 unknown API format" segun el PRD. La Resource API es un endpoint REST estandar, mas facil de testear y mantener. Si el spike confirma que CSV funciona: Opcion C (CSV como primary, Resource como fallback). |
| D-004 | **Enfoque de separacion de audio para QA?** | A) Fernando exporta stems por personaje desde After Effects. B) Re-Alignment Engine con Whisper fuzzy match sobre MP4 mezclado. C) ElevenLabs Render API con tracks_zip (audio separado por speaker directo de la API). D) Combinacion B+C para mayor confianza. | Daniel + Fernando | Despues de entrevista con Fernando (Dia 3) | **Recomendar Opcion C: Render API tracks_zip.** Razon: elimina dependencia de Fernando, elimina necesidad de fuzzy match custom, y el audio separado viene directamente de ElevenLabs con speaker IDs correctos. Requiere que el proyecto se cree via API. Si Fernando PUEDE exportar stems: Opcion D (tracks_zip + stems como validacion cruzada). |
| D-005 | **Presupuesto para QA automatizado ($8-16/ep incremental)?** | A) Aprobar $8-16/ep para 4 Gates completos. B) Aprobar version reducida ($3-6/ep, solo Tier 1+2). C) Rechazar -- solo metricas gratuitas (COMET + chrF++). | Management | Antes de iniciar Fase 1 (Semana 2) | **Requerido: Opcion A para Tier 1, Opcion B para Tier 2+3.** Sin presupuesto no hay auditoria multi-LLM ni consenso dual STT. Opcion C es insuficiente para contenido infantil donde errores de safety tienen consecuencias reputacionales graves. Presentar con comparativa: $8-16/ep vs $5,400-8,100/ep revision humana completa. |
| D-006 | **Nivel de strictness del sistema de safety (Gate 1)?** | A) Estricto: bloquear automaticamente TODO contenido Cat. A sin override posible. B) Moderado: bloquear Cat. A con override por Gio (con justificacion documentada). C) Permisivo: solo flag, decision humana siempre. | Gio + Andrea | 3 de marzo (antes de Fase 2) | **Recomendar Opcion B.** Razon: balancea proteccion de audiencia infantil con realidad operativa. Cat. A requiere bloqueo por defecto (groserias, violencia, self-harm), pero Gio como responsable editorial puede override con justificacion (ej: contexto educativo donde la palabra tiene uso valido). Cat. B y C son solo flags. |
| D-007 | **Upgrade de plan ElevenLabs (Pro a Enterprise)?** | A) Mantener Pro actual. B) Upgrade a Scale. C) Upgrade a Enterprise. | Management | Despues del spike de API (Dia 2) | Depende de limitaciones encontradas en spike. Si Pro tiene rate limits que impiden procesamiento de 27 idiomas en batch, o si Resource API requiere plan Enterprise: upgrade necesario. Si Pro es suficiente para MVP de 5 idiomas: mantener Pro y evaluar upgrade en Fase 3. Obtener cotizacion de Enterprise como parte del spike. |
| D-008 | **Timeline de migracion del workflow de guionismo?** | A) Migrar en paralelo con Fase 2 (Semana 4-6). B) Migrar despues de Fase 3 cuando el pipeline este estable. C) No migrar -- Andrea sigue con proceso actual y docx_parser se adapta al formato existente. | Andrea + Daniel | Despues de Fase 2 (Semana 6) | **Recomendar Opcion B.** Razon: migrar guionismo durante implementacion de QA introduce demasiada variabilidad. Estabilizar el pipeline con el formato actual de Andrea primero, medir baseline, y luego optimizar el input en un segundo ciclo. Migrar antes arriesga el "Guion Zombie" que el sistema intenta resolver. |

---

## 15. OBJETIVOS SMART (O1-O7)

### 15.1 Baseline a Hoy y Metas a 30/60/90 Dias

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

> **Principio rector:** Los primeros 30 dias son para MEDIR, no para mejorar. No se puede optimizar lo que no se mide. Los "Desconocido" de hoy se convierten en numeros reales que permiten fijar metas realistas y detectar donde estan los problemas verdaderos.

### 15.2 Los 7 Objetivos SMART

**O1 -- Medir calidad de los 27 idiomas (Semana 3)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Instalar pipeline de medicion WER (Whisper + scoring) y ejecutarlo sobre 1 episodio piloto completo en los 27 idiomas activos, generando un reporte de calidad por idioma. |
| **Medible** | 27 scores WER generados (uno por idioma), almacenados en formato JSON, con timestamp y episodio de referencia. Entregable: archivo `qa_reports/baseline_ep_XXX.json`. |
| **Alcanzable** | Las herramientas son gratuitas (Whisper open source) o de bajo costo ($1.5-3 por episodio). Solo requiere 1 episodio de prueba y tiempo de Daniel para configuracion. |
| **Relevante** | Sin medicion no existe base para ninguna decision informada sobre calidad, presupuesto, o priorizacion de idiomas. Es prerequisito de todos los demas objetivos. |
| **Tiempo** | Semana 3 (deadline firm). Incluye: Dia 1-2 configuracion de Whisper, Dia 3-5 ejecucion y generacion de reporte. |

**O2 -- Zero contenido Categoria A en Tier 1 (Semana 6)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Que ningun contenido critico (groserias, ofensas culturales, violencia, self-harm) pase a publicacion en los 5 idiomas de Tier 1 (ES, EN, PT-BR, FR, DE). Gate 1 bloquea automaticamente. |
| **Medible** | 0 flags de Categoria A post-publicacion en Tier 1, medido semanalmente. Cada flag Cat. A es un incidente documentado con root cause analysis. |
| **Alcanzable** | Gate 1 (blacklists + LLM safety judge + ElevenLabs Scribe v2 entity detection) detecta contenido Cat. A pre-publicacion. Blacklists de 5 idiomas Tier 1 deben estar completas para Semana 5. |
| **Relevante** | Audiencia infantil (8-15 anos). Un solo episodio con contenido inapropiado dania la marca. Es la linea roja no negociable del sistema. |
| **Tiempo** | Semana 6. Gate 1 operativo para Semana 4, blacklists Tier 1 completas Semana 5, primera semana de medicion cero-incidentes Semana 6. |

**O3 -- 27 blacklists completas (Semana 6)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Crear listas de palabras/frases prohibidas para cada uno de los 27 idiomas, almacenadas como archivos JSON en `knowledgebase/blacklists/by_language/`. Cada blacklist contiene como minimo: groserias, insultos culturales, terminos violentos, contenido sexual, y terminos sensibles para audiencia infantil. |
| **Medible** | 27 archivos JSON validados (1 por idioma). Metricas: minimo 20 entradas por idioma para Tier 1, minimo 10 para Tier 2/3. Cada entrada con campo `category` (A/B/C) y `severity`. |
| **Alcanzable** | LLM genera borrador inicial por idioma (~2 horas total para 27 idiomas). Validacion por hablantes nativos para Tier 1 (5 idiomas x 1 hora). Tier 2+3 inician con borrador LLM y se refinan via Kaizen. Tiempo total estimado: 2-3 dias. |
| **Relevante** | Actualmente solo existen 3 blacklists (global, AR, DE). Faltan 24 idiomas, incluyendo ZH (mercado chino con filtros de contenido estrictos), KO, JA, HI. Directorio `by_language/` referenciado en `blacklist_global.json` no existe. |
| **Tiempo** | Semana 6. Borrador LLM Semana 4, validacion nativa Tier 1 Semana 5, publicacion completa Semana 6. |

**O4 -- Reducir correcciones manuales en 40% (Semana 10)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | El sistema aprende de correcciones pasadas (via Mem0) y las aplica automaticamente en episodios futuros, reduciendo el numero de intervenciones manuales de Saul/Ivan por episodio. |
| **Medible** | Porcentaje de reduccion vs baseline medido en Fase 1. Formula: (correcciones_baseline - correcciones_actual) / correcciones_baseline x 100. Target: >= 40%. |
| **Alcanzable** | Empresas como Netflix logran >95% de automatizacion con IA. QPH tiene correcciones repetitivas documentadas (patrones de puntuacion, speaker detection recurrentes). Mem0 almacena cada correccion y la aplica antes de enviar a ElevenLabs. Target de 40% es conservador. |
| **Relevante** | Saul/Ivan dedican horas a correcciones repetitivas que el sistema puede aprender. Cada correccion manual evitada libera tiempo para revision de calidad real (contenido, tono, cultural) en lugar de tareas mecanicas. |
| **Tiempo** | Semana 10. Baseline medido Semana 3, Mem0 operativo Semana 7, primera medicion de mejora Semana 8, target alcanzado Semana 10. |

**O5 -- Dashboard QA visible para todo el equipo (Semana 10)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Tablero Metabase (open source) con semaforo por idioma, tasa de error, tendencias semanales, y reporte por episodio. Accesible via URL interna a todo el equipo (Daniel, Saul/Ivan, Andrea, Ramon, Alan, Gio). |
| **Medible** | Dashboard desplegado y con datos reales de al menos 4 semanas de produccion. Metricas visibles: WER por idioma, FTR semanal, Cat. A incidents, tendencia mensual. Al menos 3 miembros del equipo acceden semanalmente (medido por logs). |
| **Alcanzable** | Metabase es gratuito, no-code, conecta a PostgreSQL/Supabase. Los datos ya se generan en qa_reports/. Solo requiere configurar visualizaciones y acceso. Tiempo de setup: 1-2 dias. |
| **Relevante** | Actualmente solo Daniel tiene visibilidad de la calidad tecnica. Todo el equipo necesita ver los resultados para tomar decisiones informadas. La reunion OVEJA necesita datos, no opiniones. |
| **Tiempo** | Semana 10. Infraestructura Semana 7-8, primeras visualizaciones Semana 9, dashboard completo con 4 semanas de datos Semana 10. |

**O6 -- ROI por idioma calculado (Semana 12)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | Cruzar YouTube Analytics (vistas, retencion, revenue estimado) con costo de produccion por idioma (ElevenLabs + tiempo humano + QA) para obtener ROI = (ingresos estimados - costo) / costo por cada uno de los 27 idiomas. |
| **Medible** | 27 valores de ROI calculados (1 por idioma). Entregable: tabla con columnas idioma, vistas mensuales, revenue estimado, costo produccion, costo QA, ROI, recomendacion (mantener/pausar/agregar). |
| **Alcanzable** | YouTube Analytics API disponible gratuitamente. Datos de costo interno ya conocidos. Requiere: API key de YouTube, script de extraccion (~1 dia), cruce con datos de costos (~1 dia). |
| **Relevante** | Para decidir que idiomas mantener, pausar, o agregar con datos en lugar de intuicion. Si 15 idiomas generan <5% de views combinados, la decision correcta puede ser concentrar recursos en los 12 rentables. Nadie ha hecho este calculo. |
| **Tiempo** | Semana 12. Extraccion de datos YouTube Semana 10, cruce con costos Semana 11, reporte final con recomendaciones Semana 12. |

**O7 -- 60% FTR (First Time Right) en episodios (Semana 12)**

| Dimension | Descripcion |
|:----------|:------------|
| **Especifico** | 60% de los episodios pasan los 4 Quality Gates sin necesidad de correcciones manuales de Saul/Ivan. Un episodio "FTR" significa que los 4 Gates devuelven PASS sin intervenciones humanas excepto la revision final confirmativa de Tier 1. |
| **Medible** | FTR = episodios aprobados sin correccion / total episodios procesados x 100, medido semanalmente. Target: >= 60% en promedio movil de 4 semanas para Semana 12. |
| **Alcanzable** | Combinacion de: blacklists previenen errores Cat. A, Mem0 aplica correcciones aprendidas, prescanner detecta problemas pre-ElevenLabs, multi-LLM audit detecta errores de traduccion. Cada componente reduce una categoria de error. 60% es alcanzable con Tier 1 estabilizado. |
| **Relevante** | Menos retrabajo = mas eficiencia operativa. Un FTR de 60% vs ~0% actual (estimado, dado que no se mide) significa que Saul/Ivan solo intervienen en 2 de 5 episodios en lugar de en todos. Libera capacidad para escalar a mas idiomas o mas episodios. |
| **Tiempo** | Semana 12. Primeras mediciones FTR Semana 3, mejora progresiva con cada componente activado (Fase 2 Semana 6, Fase 3 Semana 10), target alcanzado Semana 12. |

### 15.3 Matriz RACI

R = Responsable (ejecuta), A = Aprueba (da visto bueno), C = Consultado (opina antes), I = Informado (recibe resultado despues).

| Fase | Daniel | Saul/Ivan | Andrea | Ramon | Alan | Gio |
|:-----|:-------|:----------|:-------|:------|:-----|:----|
| **Fase 0:** Preparacion (Semana 1) -- Verificar PR #71, spike API, organizar repo | **R** | C | I | C | **A** | I |
| **Fase 1:** Medir calidad (Semanas 2-3) -- WER baseline, 3 jueces IA, primeros reportes | **R** | **R** | I | I | **A** | C |
| **Fase 2:** Proteger contenido (Semanas 4-6) -- Blacklists 27 idiomas, Gate 1, speaker detection | **R** | C | C | C | **A** | C |
| **Fase 3:** Automatizar (Semanas 7-10) -- Mem0, multi-LLM audit, Render API, pre-correccion | **R** | **R** | I | I | **A** | C |
| **Fase 4:** Optimizar y Kaizen (Semana 11+) -- Dashboard, ROI, PDCA, mejora continua | **R** | C | I | I | **A** | **R** |

**Decisiones clave: quien aprueba que**

| Decision | Quien Aprueba | Consultados |
|:---------|:-------------|:------------|
| Agregar o quitar un idioma activo | Alan + Management | Daniel, Saul/Ivan, Gio |
| Modificar una blacklist | Gio | Andrea, Daniel |
| Cambiar flujo de trabajo de dubbing | Alan | Saul/Ivan, Daniel |
| Aprobar episodio para publicacion | Gio | Saul/Ivan |
| Pausar idioma por baja calidad persistente | Alan | Daniel, Gio |
| Presupuesto de herramientas QA | Management | Alan, Daniel |
| Override de alerta del sistema (publicar pese a flag) | Gio (con justificacion documentada) | Saul/Ivan |

---

## 16. SISTEMA KAIZEN (MEJORA CONTINUA)

### 16.1 Los 5 Componentes

El Sistema Kaizen transforma el pipeline de dubbing de un proceso estatico (mismo resultado independientemente de cuantos episodios se procesen) a un sistema que aprende y mejora con cada episodio. Cada componente alimenta a los demas en un ciclo virtuoso.

**Componente 1: Taxonomia de Errores (MQM Adaptado)**

Cada error detectado en cualquier Gate se clasifica usando el framework MQM (Multidimensional Quality Metrics) adaptado a las necesidades de QPH. La taxonomia tiene 3 ejes: tipo, severidad, idioma.

| Categoria MQM | Subcategoria QPH | Severidad | Ejemplo Concreto |
|:--------------|:-----------------|:----------|:-----------------|
| Accuracy | Speaker detection | Major/Critical | Personaje 2 habla con voz de Personaje 1 |
| Accuracy | Traduccion erronea | Major | "Que padre" traducido como "What a father" |
| Accuracy | Omision | Minor/Major | Linea de dialogo faltante en el dub |
| Fluency | Timing drift | Minor/Major | Audio desfasado >200ms respecto al video |
| Fluency | Pronunciacion | Minor | Nombre propio mal pronunciado por TTS |
| Fluency | Naturalidad (MOS) | Minor | Audio suena robotico o artificial |
| Terminology | Onomatopeya mal adaptada | Minor | "Guau" traducido literal en japones |
| Terminology | Pronombre incorrecto | Minor/Major | Genero equivocado en idioma con marcacion fuerte |
| Style | Tono/emocion incorrecta | Major | Escena triste con entonacion alegre |
| Style | Formalidad inadecuada | Minor | Registro formal (Sie) en dialogo entre ninos en DE |
| Locale | Sensibilidad cultural | Major/Critical | Referencia a cerdo en contenido para mercado arabe |
| Locale | Blacklist violation | Critical | Palabra de Categoria A detectada post-publicacion |
| Safety | Contenido inapropiado | Critical | Groseria, violencia, self-harm en audio infantil |

Sistema de puntuacion: Minor = 1 punto, Major = 5 puntos, Critical = 25 puntos. Score por idioma = suma de puntos por episodio. Umbral de aprobacion por tier: Tier 1 <= 5 puntos, Tier 2 <= 15 puntos, Tier 3 <= 30 puntos. Cualquier Critical = bloqueo automatico independientemente del tier.

La taxonomia NO es decorativa. Cada error clasificado alimenta Mem0 (Componente 2), el Dashboard (O5), y las metricas de recurrencia (Componente 5). Sin clasificacion consistente, el sistema no puede aprender.

**Componente 2: Memoria de Correcciones (Mem0)**

Mem0 (open source, Apache 2.0, github.com/mem0ai/mem0) es un layer de memoria persistente para agentes de IA. Almacena cada correccion realizada por Saul/Ivan y la aplica automaticamente en episodios futuros cuando detecta el mismo patron.

Flujo operativo:

```
Episodio N: Saul corrige "no." -> "no," en linea 42
  -> Mem0 almacena: {pattern: "no.", replacement: "no,", context: "antes de mayuscula", language: "ES", confidence: 1.0}

Episodio N+1: prescanner detecta "no." en linea 17
  -> Mem0 consulta: "he visto este patron antes?"
  -> Mem0 responde: "Si, correccion automatica: 'no.' -> 'no,'" (confidence: 1.0)
  -> Se aplica ANTES de enviar a ElevenLabs

Resultado: Error que antes requeria intervencion manual ahora es automatico.
```

Tipos de memorias almacenadas para QPH:
1. **Correcciones de blacklist expandidas** -- palabras descubiertas en produccion que no estaban en la blacklist original.
2. **Mapeos speaker-voice corregidos** -- cuando Saul/Ivan reasignan una voz, Mem0 aprende la preferencia.
3. **Ajustes de timing por idioma** -- idiomas que sistematicamente necesitan +/-X% de velocidad.
4. **Overrides de traduccion** -- modismos que el LLM traduce mal recurrentemente.
5. **Reglas de onomatopeyas descubiertas** -- adaptaciones culturales aprendidas en produccion.

Metrica clave: Error Recurrence Rate = errores repetidos / total errores. Target: <20%. Si un error se repite mas de 2 veces con Mem0 activo, hay un problema en la captura de la correccion.

**Componente 3: Feedback Loop de Audiencia**

Las senales de calidad no vienen solo del sistema interno. La audiencia es el juez final.

Pipeline de captura:
1. **YouTube Analytics API** extrae: curvas de retencion por idioma, comentarios, likes/dislikes por segmento temporal.
2. **Sentiment Analysis multilingue** (tabularisai/multilingual-sentiment-analysis, soporta 27 idiomas) procesa comentarios y genera score de sentimiento por idioma por episodio.
3. **Correlacion automatica**: si retencion cae >20% en un segmento Y hay comentarios negativos en ese idioma, el sistema genera alerta con timestamp exacto.
4. **Dashboard semanal**: las senales de audiencia se presentan en la reunion OVEJA junto con metricas internas.

Ejemplo de deteccion real: Episodio EP042 en arabe muestra caida de retencion del 40% en minuto 3:20. Comentarios AR incluyen quejas de audio. Correlacion: segmento 3:20 tiene WER 18% y error de speaker detection. Accion: re-auditar segmento, corregir, actualizar Mem0 con el patron para futuros episodios.

**Componente 4: Captura de Conocimiento Tribal**

Saul/Ivan tienen anos de experiencia operativa que no esta documentada en ningun sistema. Cada vez que corrigen algo estan aplicando reglas implicitas. El sistema debe capturar esas reglas.

Proceso de captura:
1. Tomar transcripcion Q8 de Saul/Ivan (ya existe en el repo).
2. Pasar por LLM con prompt: "Extraer todas las reglas 'si X entonces haz Y' de esta transcripcion."
3. Almacenar como JSON estructurado en `knowledgebase/tribal_rules/`.
4. Cargar en Mem0 como memorias iniciales (bootstrap).
5. Cada nueva correccion de Saul/Ivan enriquece la base.

Formato de regla extraida:
```json
{
  "rule_id": "TK-001",
  "source": "Q8_SAUL_IVAN",
  "pattern": "ElevenLabs detecta speaker 2 como speaker 1",
  "action": "Verificar manualmente mapeo de voces contra manifest.json",
  "frequency": "frecuente",
  "languages_affected": "todos"
}
```

El conocimiento tribal que hoy solo existe en la cabeza de Saul/Ivan se convierte en reglas ejecutables por el sistema. Si Saul/Ivan dejaran el equipo manana, el conocimiento no se pierde.

**Componente 5: Metricas de Mejora Continua**

| Metrica | Formula | Target | Frecuencia |
|:--------|:--------|:-------|:-----------|
| **FTR (First Time Right)** | Episodios aprobados sin correccion / Total | > 60% Fase 1, > 80% Fase 3 | Semanal |
| **Error Recurrence Rate** | Errores repetidos / Total errores | < 20% (Mem0 debe reducir) | Mensual |
| **CAPA Effectiveness** | CAPAs efectivas / CAPAs implementadas x 100 | > 70% | Trimestral |
| **Mean Corrections/Episode** | Correcciones manuales / Episodio | Decreciente (-10%/mes) | Semanal |
| **WER Trend por idioma** | WER promedio mensual por idioma | Decreciente | Mensual |
| **Audience Sentiment Score** | Promedio sentimiento de comentarios por idioma | > 0.6 (positivo) | Semanal |

Si alguna metrica se estanca por 4 semanas consecutivas, se escala automaticamente en la reunion OVEJA para revisar el enfoque.

### 16.2 Ciclo PDCA (Plan-Do-Check-Act)

El ciclo PDCA se ejecuta semanalmente, alineado con la reunion OVEJA. Cada iteracion produce mejoras incrementales medibles.

**PLAN -- Identificar patrones de error (Lunes)**

Accion: Analizar qa_reports/ de la semana anterior. Identificar los top 3 patrones de error por frecuencia y severidad. Clasificar cada uno segun taxonomia MQM. Ejemplo: "Patron #1: speaker detection falla en personajes secundarios en AR y HI (7 ocurrencias, Major)."

Entregable: Lista priorizada de 3 patrones con root cause hipotetico y accion propuesta.

**DO -- Implementar correcciones (Martes-Jueves)**

Accion: Para cada patron identificado, aplicar la correccion correspondiente:
- Si es blacklist: agregar terminos a `knowledgebase/blacklists/by_language/{idioma}.json`.
- Si es cultural: actualizar `cultural_matrix.json` con la regla nueva.
- Si es pronunciacion: agregar entrada a ElevenLabs Pronunciation Dictionary del idioma afectado.
- Si es speaker detection: agregar regla a Mem0 con el mapeo correcto.
- Si es timing: ajustar parametro de velocidad por idioma en configuracion.

Entregable: PRs o commits con las correcciones aplicadas, documentando que patron resuelven.

**CHECK -- Medir mejora (Viernes siguiente)**

Accion: Comparar metricas de la semana post-correccion contra la semana anterior. Especificamente: el patron corregido sigue apareciendo? Con que frecuencia? FTR mejoro?

Criterio de exito: Si el patron corregido aparece <50% de las veces que aparecia antes, la correccion es efectiva. Si FTR mejoro >5% respecto a la semana anterior, el ciclo fue exitoso.

**ACT -- Promover o iterar (Reunion OVEJA)**

Accion: Si la correccion fue efectiva (FTR mejoro >5%), promover a permanente: merge de PR, actualizacion de documentacion, notificacion al equipo. Si no fue efectiva, investigar root cause mas profundo: era un problema diferente al diagnosticado? La correccion fue insuficiente? Requiere cambio de arquitectura?

Resultado: Cada semana el sistema es mediblemente mejor que la anterior. Las correcciones efectivas se acumulan. Las inefectivas se descartan con datos, no con opiniones.

### 16.3 Indicadores Semanales de la Reunion OVEJA

La reunion OVEJA (semanal, todo el equipo) revisa exactamente 3 indicadores simples. No hay reportes extensos ni dashboards complejos. Tres numeros, una decision.

**Indicador 1: Semaforo por Idioma**

Cada idioma tiene un color basado en su score MQM semanal:
- **Verde**: score <= umbral del tier, sin errores Critical. El idioma esta sano.
- **Amarillo**: score entre 1x y 2x el umbral, o errores Major recurrentes. Requiere atencion.
- **Rojo**: score > 2x umbral, o al menos 1 error Critical. Requiere accion inmediata.

Formato de revision: "Esta semana: 18 verdes, 6 amarillos, 3 rojos. Los rojos son AR, TA, FIL."

Si un idioma lleva 4 semanas consecutivas en rojo, se escala decision D-002 (pausar idioma) a Management.

**Indicador 2: FTR de la Semana**

Un solo numero: que porcentaje de episodios paso los 4 Gates sin correcciones manuales.

Formato de revision: "FTR esta semana: 45%. La semana pasada fue 40%. Vamos en la direccion correcta."

Si FTR cae >10% respecto a la semana anterior, se investiga causa raiz en la misma reunion.

**Indicador 3: Tendencia (Direccion del Progreso)**

Basado en el promedio movil de 4 semanas de FTR y semaforos:
- **Mejorando**: FTR subiendo, mas idiomas en verde, menos en rojo.
- **Estancado**: sin cambio significativo en 4 semanas. Trigger: revisar si las correcciones PDCA estan siendo efectivas.
- **Empeorando**: FTR bajando, idiomas pasando de verde a amarillo/rojo. Trigger: reunion extraordinaria para diagnosticar causa raiz (cambio en ElevenLabs? Nuevo tipo de contenido? Degradacion de voces?).

Formato de revision: "Tendencia: mejorando. Cuarta semana consecutiva de mejora. FTR promedio 4 semanas: 52%, meta 60% para Semana 12."

Regla de escalamiento: si la tendencia es "estancado" o "empeorando" durante 4 semanas consecutivas, se revisa el enfoque completo de la fase actual y se convoca decision de Daniel + Alan + Gio para ajustar el plan.
