# Claude Debate v3 FINAL: Doge-MultiLang Pipeline

**Fecha:** 2026-02-19 (v3 final)
**Autor:** Claude Opus 4.6 (opinion propia, no output de swarm)
**Contexto:** v1 (lectura directa), v2 (16 archivos legacy), v3 (6 agentes verificadores: 2 Opus + 2 Sonnet exploradores, 2 Opus + 1 Sonnet analistas)
**Archivos verificados:** AI-Studio codebase completo, ElevenLabs API feb 2026, repo Doge-MultiLang (75 archivos), dubbing_pipeline.py ERP

---

## CAMBIO FUNDAMENTAL: NO ES GREENFIELD

> **Este es el hallazgo mas critico de todo el analisis. Invalida tanto la propuesta del swarm como mi opinion v1.**

El `master_plan_dubbing.md` (37KB, Dic 2024) revela que **AI-Studio ya tiene codigo implementado** para Phase 1 y Phase 2:

| Componente | Archivo | Estado | Funcion |
|:-----------|:--------|:-------|:--------|
| Backend Dubbing | `backend/api/dubbing.py` | IMPLEMENTADO | CRUD, Cache (TTL 60s), Upload Video/Script |
| ElevenLabs Client | `services/elevenlabs.py` | IMPLEMENTADO | Wrapper Async para API v1 (Dubbing + Studio) |
| Voice Mapping | `/api/dubbing/import-mappings` | IMPLEMENTADO | Reutiliza mapeo Personaje -> VoiceID de TTS |
| Script Parser | `services/docx_parser.py` | IMPLEMENTADO | Lee .docx, extrae personajes, sanitiza "no."->"no" |
| Frontend UI | `app/dubbing/page.tsx` | IMPLEMENTADO | Tabs (Video/Script), Selector Idiomas, Status Badge |
| PR | #71 (staging/dubbing-workflow) | ABIERTO | Flujo completo de dubbing |

**Lo que NO esta implementado (Phase 3 - QA Automation):**

| Componente Faltante | Archivo Propuesto | Impacto |
|:---------------------|:------------------|:--------|
| Sistema de Auditoria | `audit_service.py` | QA sigue siendo 100% manual |
| Dual STT | Whisper + Gemini API | No hay "segunda opinion" para audio generado |
| Blacklist Preventiva | `prompt_scanner.py` | Palabras prohibidas rompen generacion |
| Sync After Effects | `import_csv_timings` | Saul debe cortar silencios a mano |
| Detection de Mezcla | `validate_speakers` | Posible mezcla de voces en una pista |

### Implicacion directa

Mi opinion v1 decia "escribir 3 scripts desde cero en 9 horas". **Eso esta MAL.** La recomendacion correcta es:

1. **NO crear scripts sueltos en Doge-MultiLang.** Extender el backend EXISTENTE de AI-Studio con Phase 3.
2. El `docx_parser.py` que el swarm queria crear **YA EXISTE** en `services/docx_parser.py`.
3. El `voice_manifest_manager.py` que yo propuse **YA EXISTE** como `/api/dubbing/import-mappings`.
4. El `elevenlabs_api_client.py` que yo propuse **YA EXISTE** como `services/elevenlabs.py`.

**Lo que REALMENTE falta es Phase 3: QA Automation.** Y el diseno ya esta completo en el Anexo A del master plan.

---

## Lo que el Swarm se equivoco (mantenido de v1 + nuevos)

| Error del Swarm | Realidad (evidencia directa) |
|:----------------|:-----------------------------|
| "Q7 esta VACIO - BLOCKER" | POSTPROD_FERNANDO.md tiene workflow de 8 pasos, 5 Mudas, KPIs. DRAFT al 75-85%. |
| "Q8 esta VACIO - BLOCKER" | DUBBING_SAUL_IVAN.md tiene workflow de 6 pasos, 7 Mudas. Q8 DRAFT real agregado (26_02_06). DRAFT al 70-80%. |
| "docx usa Table 4, 8 columnas" | Nadie verifico el docx real. Dato fabricado. |
| "19 personajes, 13 escenas" | Dato fabricado. Nadie leyo el docx. |
| "0 scripts implementados (greenfield)" | **Phase 1 + Phase 2 ESTAN IMPLEMENTADOS en AI-Studio** (PR #71). Solo falta Phase 3. |
| "QA costaria $40-50/episodio" | El master plan calcula **~$1.20/proyecto** (Whisper $1.02 + Gemini $0.18). El swarm inflo el costo 40x. |
| "17 idiomas" | Son **27 idiomas activos** segun Q8 DRAFT. Se priorizan 17, pero operan 27. |
| "Voice Segments v3 es phantom" | No esta en KB dic 2024. El master plan ya documenta `Text-to-Dialogue v3` como idea futura. Verificar API actual. |

### Nuevo error de MI opinion v1

| Error Mio (v1) | Correccion (v2) |
|:----------------|:----------------|
| "Escribir glossary_sanitizer.py desde cero (2h)" | `docx_parser.py` YA tiene sanitizador de "no."->"no" en AI-Studio |
| "Escribir elevenlabs_api_client.py desde cero (6h)" | `services/elevenlabs.py` YA es un wrapper async de la API |
| "Escribir voice_manifest_manager.py desde cero (3h)" | `/api/dubbing/import-mappings` YA importa Voice IDs |
| "Asumir greenfield - 8 scripts, 32h" | Solo Phase 3 falta. El trabajo es EXTENDER, no CREAR desde cero. |

---

## Mi Opinion v2: Las 3 Preguntas Criticas (Actualizadas)

### Q1: Speaker Identification - Quien habla cuando se equivoca?

**Lo que realmente pasa hoy** (sin cambios de v1):

ElevenLabs STT + diarization es inconsistente. Subir el mismo MP4 dos veces puede dar resultados diferentes.

**Lo que ya existe y no sabiamos:**

El master plan ya documenta DOS soluciones evaluadas:

- **Opcion A (Ideal): Multi-Track Stems.** Fernando exporta audio separado por personaje. ElevenLabs recibe pistas limpias. Cero errores de mezcla.
- **Opcion B (Robusta): Re-Alignment AI.** Whisper STT sobre MP4 + fuzzy match con guion para generar nuevos timestamps reales.

Y el **"Holy Grail Workflow"** ya esta definido con formato CSV:

```csv
speaker,start_time,end_time,transcription
"GABRIEL","0.500","3.200","Mis padres me ofrecieron en Marketplace"
"ELSA","4.100","5.800","Lesslie Gabriel Fernandez!"
```

**Mi propuesta actualizada:**

1. **NO inventar un formato nuevo.** Usar el CSV Holy Grail que ya esta definido en el master plan.
2. **Priorizar Opcion B (Re-Alignment)** porque NO requiere cambiar el flujo de Fernando.
3. **Opcion A (Stems) como upgrade futuro** - requiere que Fernando cambie su proceso de export.
4. El endpoint `POST /api/dubbing/create` ya existe. Solo falta alimentarlo con el CSV generado por el Re-Alignment.

---

### Q2: Cuando termina el dialogo de uno?

**Lo que ya existe y no sabiamos:**

La "Transcription-First Architecture" ya esta disenada en el master plan:

```
1. MP4 final de Fernando = UNICA Fuente de Verdad
2. Whisper STT sobre MP4 -> texto REAL con timestamps
3. Fuzzy match con manifest.json de Ramon -> identificar quien dijo que
4. Resultado: proyecto de Dubbing con texto realmente usado + voces correctas
```

Esto es EXACTAMENTE lo que yo propuse en v1 como flujo correcto. La buena noticia: **ya esta disenado, solo falta implementar el Re-Alignment engine.**

El master plan marca esto como `alignment_engine.py` con status "Entregado (Phase 3)" pero el mismo documento dice Phase 3 NO esta implementada. Hay contradiccion interna - **verificar con el equipo si alignment_engine.py realmente existe.**

---

### Q3: Silencios - Basado en el proceso de Fernando

**Sin cambios mayores de v1.** La fuente primaria confirma:

Del transcript Dic 31 (Alan):
> "ajustamos que los waveforms del ingles empataran totalmente con los waveforms del espanol"

Del transcript Dic 31 (Daniel sobre Fernando):
> "desde que no hay decibeles y dura mas de medio segundo ya lo tengo que cortar... lo hago de manera intuitiva"

Fernando: criterio subjetivo/creativo. Saul/Ivan: criterio visual, empatar waveforms.

**Nuevo hallazgo:** El master plan ya propone la solucion correcta:
- **Manual Dub CSV** con timestamps inyecta las coordenadas temporales exactas
- **Duration Constraints**: usar duracion del TTS original como "soft limit"
- Esto elimina la Muda #2 (Cosecha de Silencios) de raiz

---

## La Gran Pregunta (Revisada): Que se mejora primero?

### El mapa ha cambiado completamente

**Antes (swarm + mi v1):** "Construir 18 scripts (75h)" o "Construir 3 scripts (9h)"

**Ahora (v2):** "Completar Phase 3 de un sistema que ya tiene Phase 1+2"

### Prioridades actualizadas

**PRIORIDAD 1: Verificar estado real del codigo existente (2-3h investigacion)**

Antes de escribir UNA linea de codigo:

```
1. Verificar que PR #71 existe y funciona en AI-Studio
2. Probar el flujo completo: docx -> dubbing -> ElevenLabs
3. Identificar que funciona y que NO funciona del codigo actual
4. Verificar si alignment_engine.py realmente existe
5. Verificar la API actual de ElevenLabs (feb 2026 vs dic 2024)
```

**PRIORIDAD 2: Implementar Phase 3 QA dentro de AI-Studio (no scripts sueltos)**

El Anexo A del master plan ya tiene todo el diseno:

```
Componente 1: audit_service.py
  - Dual STT (Whisper + Gemini)
  - WER Score automatico
  - Consensus check
  - Costo: ~$1.20/proyecto (NO $40-50 como dijo el swarm)

Componente 2: prompt_scanner.py (blacklist preventiva)
  - Pre-scan ANTES de enviar a ElevenLabs
  - Diccionario por idioma de terminos bloqueados
  - Sinonimos sugeridos

Componente 3: validate_speakers.py
  - Comparar pistas detectadas vs personajes esperados
  - Alertar si hay mismatch
```

Endpoints ya disenados:
- `POST /api/dubbing/audit/{project_id}`
- `GET /api/dubbing/audit/{project_id}/status`
- `GET /api/dubbing/audit/{project_id}/report`
- `GET /api/dubbing/audit/{project_id}/issues`
- `POST /api/dubbing/audit/{segment_id}/resolve`

**PRIORIDAD 3: Implementar Re-Alignment Engine**

```
1. Whisper STT sobre MP4 de Fernando -> timestamps reales
2. Fuzzy match con guion original -> speaker identification
3. Generar Holy Grail CSV -> input para ElevenLabs
4. Elimina el problema de "Guion Zombie"
```

**PRIORIDAD 4: Integrar con Doge-MultiLang y Doge-Animator**

```
1. Doge-MultiLang se convierte en el REPO de configuracion (blacklists, manifest, glossaries)
2. AI-Studio ejecuta el pipeline
3. Doge-Animator consume los outputs para animacion
```

---

## Sobre mejorar el proyecto Web UI via API

**Respuesta actualizada:** No es "mejorar via API". **El codigo para hacerlo via API YA EXISTE.**

`services/elevenlabs.py` ya es un wrapper async de la API. `backend/api/dubbing.py` ya tiene endpoints CRUD. El PR #71 ya tiene el flujo completo.

Lo que falta es:
1. **Que Saul/Ivan USEN el modulo de AI-Studio** en vez de ir directamente a la Web UI de ElevenLabs
2. **Completar Phase 3 (QA)** para que el modulo sea superior a la Web UI
3. **El Holy Grail CSV** para eliminar la "adivinanza" de ElevenLabs

El master plan dice:
> "La Web UI se convierte en fallback para revision manual cuando algo falla."

---

## Sobre poner 2 AI a auditar traducciones

**Respuesta actualizada:** El Anexo A del master plan **ya disena esto exactamente:**

```
AI AUDITOR 1: Whisper STT (baseline confiable, $0.006/min)
AI AUDITOR 2: Gemini Flash (analisis semantico, $0.001/min)

Pipeline:
  Audio generado -> Transcripcion dual (paralela)
  -> WER Score (vs guion)
  -> Semantic Similarity (embeddings)
  -> Consenso STT (Whisper == Gemini?)
  -> Reporte con alertas priorizadas
```

Umbrales ya definidos:
- WER < 5% + Similarity > 0.95 + Consenso = **AUTO-APROBAR**
- WER 5-15% o Similarity 0.85-0.95 = **REVISION RAPIDA**
- WER > 15% o Similarity < 0.85 = **REVISION OBLIGATORIA**

Costo: ~$1.20/proyecto (16 idiomas x 10 min). ROI: si revision manual toma 4 hrs ($60-80), ahorro de ~$50/proyecto.

**Ya no hay que disenar la arquitectura. Solo implementarla.**

---

## Sobre la KB de ElevenLabs en 4_outputs

Existe en `C:\AI\AI-Studio\libs\knowledge-base-external\projects_datasets\elevenlabs\4_outputs`:
- `ElevenLabs Docs.json` - Documentacion oficial procesada
- `ElevenLabs Helper.json` - Articulos de soporte
- `elevenlabs_final.jsonl` - KB consolidada (735 entries, 2.8MB)
- `POST_PROCESADO.md` - Documentacion del pipeline de transformacion
- `transform.py` - Script de procesamiento

Esta KB se crawleo en dic 2024. Puede estar desactualizada para features de feb 2026. Pero es la referencia disponible para entender que API endpoints existen.

---

## Checklist de Audio QA (Nuevo recurso: 26_02_18)

El archivo `checklist_audio_qa.md` define 13 pistas de calidad con criterios PASS/FAIL:

| # | Pista | Criterio Clave |
|:--|:------|:---------------|
| 1 | Claridad de voz | -14 LUFS |
| 2 | SFX sync | <=2 frames |
| 3 | BGM levels | >=6dB below voice |
| 4 | Lip sync | Visual match |
| 5 | Clipping | 0 dBFS ceiling |
| 6 | TTS quality | Natural, no robotic |
| 7 | Dubbing sync | Timing match with ES |
| 8 | WER verification | vs texto esperado |
| 9-13 | ... | Otros criterios tecnicos |

**Esto deberia ser la base del audit_service.py.** Automatizar lo que se pueda de estas 13 pistas.

---

## Veredicto Final v2

### Lo que funciona:
- El flujo creativo (Andrea -> Animadores -> Fernando) es solido
- **AI-Studio ya tiene Phase 1+2 implementadas** (docx parser, dubbing API, voice mapping, frontend)
- El diseno de Phase 3 (QA) es excelente y completo (Anexo A)
- La cadena ES -> EN -> resto esta correcta
- Los levantamientos estan MUY bien documentados

### Lo que esta roto:
- **Phase 3 (QA Automation) no esta implementada** - es la pieza faltante critica
- **Saul/Ivan siguen usando Web UI manual** en vez del modulo de AI-Studio
- **Cero metricas** de calidad (WER, COMET no se miden)
- **Cero blacklist formal** (resuelven caso por caso)
- **27 idiomas sin validacion** para la mayoria
- **Guion Zombie** (Fernando altera audio, docx queda muerto) sin resolucion operativa

### Lo que recomiendo hacer PRIMERO:
1. **Verificar estado real de AI-Studio PR #71** - funciona? que tan completo esta?
2. **Implementar audit_service.py** dentro de AI-Studio (Phase 3, Componente 1)
3. **Implementar prompt_scanner.py** (blacklist preventiva) dentro de AI-Studio
4. **Implementar Re-Alignment engine** (Whisper STT + fuzzy match)
5. **Onboard a Saul/Ivan en el modulo de AI-Studio** en vez de Web UI

### Lo que recomiendo NO hacer:
- NO crear scripts sueltos en Doge-MultiLang. Todo debe ir en AI-Studio.
- NO reinventar el parser, el API client, ni el manifest manager. YA EXISTEN.
- NO disenar la arquitectura de QA desde cero. El Anexo A ya la tiene.
- NO estimar costos sin datos. El master plan ya tiene costos reales ($1.20/proyecto).
- NO asumir greenfield. Es un proyecto con 2 de 3 fases completas.

### Preguntas abiertas para Daniel:
1. El PR #71 de AI-Studio funciona? Que tan completo esta? Se uso en produccion?
2. alignment_engine.py realmente existe? El master plan tiene contradiccion interna.
3. Fernando puede exportar stems por personaje? (Opcion A del master plan)
4. La KB de ElevenLabs de dic 2024 es la ultima version? Hay features nuevos?
5. El 4_outputs tiene data de la API y GUI - hay outputs reales de dubbing para analizar?

---

## Doge-MultiLang: Que rol juega este repo?

Si AI-Studio ya tiene el pipeline, Doge-MultiLang deberia ser:

```
Doge-MultiLang/
  knowledgebase/         # KB de ElevenLabs (referencia)
    blacklists/          # Blacklists por idioma (config)
    theories/            # Investigacion y benchmarks
  docs/                  # Levantamientos, specs, planes
  debate/                # Analisis y opiniones
  scripts/               # SOLO scripts auxiliares que NO van en AI-Studio
                         # (ej: benchmarks, analisis one-off, migrations)
```

NO deberia contener el pipeline principal. Ese vive en AI-Studio.

---

---

# v3 FINAL: Hallazgos de 6 Agentes Verificadores

> **Esta seccion incorpora los hallazgos de:** 1 Opus que verifico codigo en AI-Studio, 1 Opus que investigo la API de ElevenLabs feb 2026, 1 Opus que barrio el repo completo, 1 Sonnet que analizo el ERP dubbing_pipeline, 1 Sonnet que diseno Phase 3, 1 Sonnet que hizo de abogado del diablo.

---

## HALLAZGO #1: El codigo de AI-Studio es REAL y FUNCIONAL

Los nombres del master plan NO coinciden con los paths reales, pero el codigo existe:

| Master Plan dice | Path REAL en AI-Studio | Lineas | Estado |
|:-----------------|:-----------------------|:-------|:-------|
| `backend/api/dubbing.py` | `apps/backend/api/v1/creative/dubbing_routes.py` | 129 | 11 endpoints funcionales |
| `services/elevenlabs.py` | `apps/backend/services/model_gateway/providers/elevenlabs.py` | 880 | Cliente async completo con TTS+Dubbing+Studio+STT+Dialogue |
| `services/docx_parser.py` | `apps/backend/services/process/docx_parser.py` | 435 | 3 modos de parsing + sanitizador + `to_elevenlabs_content_json()` |
| `app/dubbing/page.tsx` | `apps/studio/src/app/dubbing/page.tsx` | +13 componentes | 4 modos: Video/Script/Manual/Smart |
| `alignment_engine.py` | `apps/backend/services/process/alignment_engine.py` | 120 | Fuzzy match Whisper-to-Manifest, SI EXISTE |

**Resolucion de la contradiccion alignment_engine:**
- La tabla de Mudas decia "Entregado (Phase 3)" y el resumen decia "PENDIENTE"
- Realidad: `alignment_engine.py` SI existe y funciona. Pero es 1 de ~5 componentes de Phase 3. El resto (audit_service, prompt_scanner, validate_speakers) NO existe.

### Descubrimiento CRITICO: dubbing_pipeline.py en ERP

Existe un archivo que **nadie menciono** hasta ahora:

`apps/backend/services/creative/content_erp/dubbing_pipeline.py` (284 lineas)

Contiene:
- **WER computation REAL** (dynamic programming, Levenshtein sobre palabras, no placeholder)
- **Cost estimation** ($0.30/min para EN/PT, ES gratis)
- **Pre-scanner hook** con heuristicas + LLM (Gemini Flash via OpenRouter)
- **Quality threshold**: 15% WER default
- **Schema SQL**: tablas `dubbing_jobs` + `dubbing_tracks` con WER scores
- **30 test cases** en `test_dubbing_pipeline.py`

**GAP critico:** `dubbing_pipeline.py` (ERP) y `dubbing_service.py` (API layer) estan DESCONECTADOS. Son dos sistemas paralelos que deben integrarse.

**Bugs conocidos:**
- P0: `run_prescanner_for_job()` crashea si `prescan_script()` retorna None
- P1: `WERResult.language` siempre default a ES aunque se pase otro idioma

### prescanner.py ya existe (378 lineas)

`apps/backend/services/creative/content_erp/prescanner.py`:
- Heuristicas locales (modismos: "a huevo", "orale", "guey"; refs culturales: "OXXO", "IMSS")
- LLM scan via Gemini Flash para idioms, wordplay, acronyms
- Proteccion contra prompt injection (wrappea script en `<SCRIPT>` tags)
- Cuenta `high_risk_count` por severity

**Esto significa:** El `prompt_scanner.py` que propuse en v1 y v2 como "nuevo" ya tiene su equivalente parcial en `prescanner.py`.

---

## HALLAZGO #2: La API de ElevenLabs cambio significativamente (dic 2024 vs feb 2026)

| Feature | Dic 2024 (KB) | Feb 2026 (verificado) | Impacto |
|:--------|:-------------|:----------------------|:--------|
| **Forced Alignment** | No existia | ACTIVO, 150+ idiomas, timestamps por palabra | **El hallazgo mas util** - drift detection directo |
| **Dubbing Resource API** | Basica | Suite CRUD completa de segments | **Reemplaza CSV manual** en produccion |
| **Manual Dub CSV** | Existia basico | Funciona pero "experimental, production use strongly discouraged" | **NO es el Holy Grail** - usar Dubbing Resource API |
| **from_content_json** | No existia | Existe pero requiere contactar ventas (NO disponible en Pro) | **BLOQUEADO** en plan actual |
| **Text-to-Dialogue v3** | No existia | REAL pero Alpha, restriccion comercial | No usar en produccion aun |
| **STT (Scribe v1)** | 29 idiomas | 90+ idiomas, entity detection, keyterm prompting | Mucho mas potente |
| **Dubbing idiomas** | ~29 | 32 confirmados | Cubre necesidades |

### Cambio de arquitectura recomendado

El master plan proponia el "Holy Grail Workflow" con CSV manual. **Eso ya no es la mejor opcion.**

**Arquitectura correcta (feb 2026):**
```
1. Crear dubbing con dubbing_studio=true
2. Usar Dubbing Resource API para:
   - Crear segments con start/end time exacto
   - Asignar speakers por segment
   - Re-generar dub por segment/idioma especifico
   - Agregar idiomas sin regenerar todo
3. Usar Forced Alignment para validar timestamps post-dubbing
4. Descargar transcripts en SRT/WebVTT/JSON
```

**Implicacion:** El `elevenlabs.py` de AI-Studio (880 lineas) ya tiene `create_dubbing()` con soporte CSV. Necesita agregar los endpoints de Dubbing Resource API para control granular post-creacion.

---

## HALLAZGO #3: Estado real del repo Doge-MultiLang

**75 archivos, solo 10 trackeados en git. 0 scripts implementados.**

| Categoria | Archivos | Tamano | Accion |
|:----------|:---------|:-------|:-------|
| Core trackeado | 10 | ~62 KB | Mantener |
| Documentacion valiosa | ~25 | ~300 KB | Trackear |
| WAVE reports redundantes | 6 | ~128 KB | Mover a docs/waves/ |
| Transcripciones raw | 4 | ~700 KB | Archivar |
| Duplicados blacklists | 3 | ~6 KB | Eliminar |
| El docx (43 MB) | 1 | 43 MB | .gitignore o LFS |
| Codigo ajeno (planchado.py) | 1 | 10 KB | Mover a AI-Studio |

**Assets faltantes criticos:**
- CLAUDE.md (instrucciones del proyecto)
- requirements.txt / pyproject.toml
- Ejemplos JSON (manifest, dialogue_objects, qa_report)
- Audio de prueba
- Blacklists para 24 de 27 idiomas
- ISSUE_TEMPLATES vacios

---

## HALLAZGO #4: Riesgos que NADIE ha abordado

Del agente "abogado del diablo":

1. **PR #71 puede llevar 14 meses sin merge.** Si Saul/Ivan siguen en Web UI, significa que el codigo de AI-Studio NO se ha usado en produccion. El plan v2 asume que funciona sin verificar.

2. **27 idiomas sin datos de ROI.** No existe calculo de views/revenue por idioma. Si 15 idiomas generan <5% de views combinados, mantenerlos es un pasivo.

3. **Levantamientos no validados.** POSTPROD_FERNANDO (75-85% confianza) y DUBBING_SAUL_IVAN (70-80%) son interpretaciones de Daniel. Los actores reales no los han confirmado.

4. **Blacklists cubren 3 de 27 idiomas.** Global + AR + DE. Faltan 24 idiomas. Particularmente riesgoso para contenido infantil (8-15 anos).

5. **Dos planes incompatibles coexisten.** PRD_FINAL.md (swarm: 18 scripts greenfield) vs claude_debate.md (Phase 3 en AI-Studio). No hay documento de decision que cierre uno.

6. **Fernando podria NO poder exportar stems.** Si no puede, Opcion A (Multi-Track) muere y dependemos 100% de Opcion B (Re-Alignment).

---

## OPINION FINAL v3

### Lo que realmente existe (verificado con codigo):

```
AI-STUDIO (funcional):
  Phase 1 (Pre-produccion):
    - docx_parser.py (435 lineas, 3 modos parsing, sanitizador)
    - models_dubbing.py (125 lineas, Pydantic models)

  Phase 2 (Produccion):
    - dubbing_routes.py (129 lineas, 11 endpoints)
    - dubbing_service.py (304 lineas, logica completa)
    - elevenlabs.py (880 lineas, TTS+Dubbing+Studio+STT+Dialogue)
    - alignment_engine.py (120 lineas, fuzzy match)
    - Frontend dubbing (14 componentes, 4 modos)

  Phase 2.5 (ERP - parcial):
    - dubbing_pipeline.py (284 lineas, WER, costos, prescanner)
    - prescanner.py (378 lineas, heuristicas + LLM)
    - SQL schema (dubbing_jobs + dubbing_tracks)
    - 30 tests unitarios

  Phase 3 (QA Automation):
    - audit_service.py = NO EXISTE
    - validate_speakers.py = NO EXISTE
    - Dashboard QA = NO EXISTE
    - Dual STT integration = NO EXISTE

DOGE-MULTILANG (repo actual):
  - 0 scripts implementados
  - Documentacion excelente (~25 archivos de specs/levantamientos)
  - KB de 735 entries ElevenLabs (dic 2024, desactualizada)
  - Blacklists para 3 idiomas
  - 4 debates multi-AI
  - 1 docx de ejemplo (43 MB)
```

### Las 5 acciones correctas (en orden):

**1. VERIFICAR (2h, antes de todo):**
- Probar el pipeline de AI-Studio end-to-end con un episodio real
- Confirmar que PR #71 no esta stale/roto
- Confirmar que la API key de ElevenLabs funciona con los endpoints actuales

**2. INTEGRAR el ERP con el API layer (8h):**
- Conectar `dubbing_pipeline.py` con `dubbing_service.py`
- El WER computation, cost estimation, y prescanner ya existen pero estan desconectados
- Fix P0 bug en prescanner (crash cuando retorna None)

**3. AGREGAR Dubbing Resource API a elevenlabs.py (6h):**
- Endpoints de segment CRUD (crear, editar, eliminar segments)
- Reemplaza el CSV manual por control programatico
- Agregar Forced Alignment (nuevo, abril 2025)

**4. IMPLEMENTAR audit_service.py (10h):**
- Whisper STT siempre + Gemini solo en segmentos con WER > 15%
- Integrar con checklist de 13 pistas (automatizar las 15-18 automatizables)
- Guardar resultados en dubbing_tracks (wer_score ya tiene columna)

**5. LIMPIAR Doge-MultiLang (2h):**
- Crear CLAUDE.md
- .gitignore el docx de 43MB
- Eliminar duplicados y WAVE detallados
- Cerrar formalmente el PRD_FINAL como superseded
- Crear requirements.txt minimo

**Total: ~28h para un pipeline funcional con QA automatizado.**

### Lo que NO recomiendo (definitivo):

- NO crear scripts sueltos en Doge-MultiLang. El pipeline vive en AI-Studio.
- NO usar Manual Dub CSV como pilar del pipeline. Es "experimental". Usar Dubbing Resource API.
- NO asumir que from_content_json funciona en plan Pro. Requiere contactar ventas.
- NO correr Dual STT (Whisper + Gemini) en todos los segmentos. Es desperdicio. Gemini solo en flagged.
- NO mantener 27 idiomas sin datos de ROI. Evaluar cuales valen la pena.
- NO invertir 75h en 18 scripts. Invertir 28h en integrar lo que ya existe.

### Preguntas que quedan abiertas:

1. El pipeline de AI-Studio se ha usado alguna vez en produccion real?
2. Fernando puede exportar stems por personaje?
3. El plan Pro de ElevenLabs se puede upgradear para acceder a from_content_json?
4. Cuantos views/revenue genera cada idioma? (ROI por idioma)
5. Saul/Ivan quieren migrar a AI-Studio o prefieren la Web UI?

---

*Claude Opus 4.6 - Opinion final v3, verificada con 6 agentes contra codigo real y API actual*
