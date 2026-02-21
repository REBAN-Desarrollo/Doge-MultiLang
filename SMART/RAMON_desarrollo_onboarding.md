# SMART: Ramon — Desarrollo (Onboarding + API)

> Ramon apoyara en desarrollo bajo liderazgo de Daniel. Paso 1: entender el repo y la arquitectura. Paso 2: planear desarrollo con la API de ElevenLabs y ajustes UI/API para mejorar translation.

**Fecha:** 2026-02-21 | **Referencia:** Gold Standard Secciones 3-5, 7, 10; Phase 0 Results; REBAN Destilado

---

## 1. CONTEXTO: DONDE ESTAMOS HOY

### Estado del codebase (AI-Studio — verificado Phase 0)

| Componente | Status | Detalle |
|:-----------|:-------|:-------|
| Pipeline E2E | **NO FACTIBLE hoy** | ~11h de fixes minimos necesarios |
| ElevenLabs API coverage | **1 de 16 endpoints** | Solo `POST /v1/dubbing` implementado |
| Bug P1 confirmado | WER default ES | `WERResult.language` siempre defaultea a "ES" en vez del idioma target |
| Service-pipeline disconnect | **Confirmado** | `dubbing_pipeline.py` desconectado de `dubbing_service.py` |
| Frontend | Solo modo Video | Audio/Text modes no implementados |
| Tests | 130+ existentes | Cobertura del pipeline ERP, no integracion con API |
| Input real dubbing | Solo video completo | Saul/Ivan no reciben stems ni guion texto — solo el video (Q8) |
| ElevenLabs UI issue | Voice model no persiste | Al cambiar tab de idioma, se pierde seleccion de voz — retrabajo manual |

### Errores frecuentes reportados por Saul/Ivan (Q8) — taxonomia de defectos

1. **Speaker detection incorrecta** (error #1 — correcciones masivas)
2. Texto de traduccion incorrecto
3. Nombres propios mal traducidos
4. Onomatopeyas mal traducidas
5. Numeros leidos incorrectamente
6. Pronombres incorrectos
7. Tono/emocion no coincide
8. Timing desincronizado

### Delta REBAN para desarrollo (nuevo baseline QA)

- Gate 1 debe detectar anti-patrones narrativos y vocabulario prohibido global
- Gate 3 debe soportar score narrativo (checklist 12 puntos) con umbral >=10/12
- Gate 4 debe validar umbrales tecnicos: noise <= -40 dB, peaks -6/-3 dB, 48 kHz, 140-160 wpm, cero clipping
- Score vocal ponderado (rubrica 5D) debe quedar >=4.0 para aprobar Tier 1

### Arquitectura actual (Gold Standard Seccion 4)

```
Repos:
  AI-Studio (codigo)          Doge-MultiLang (specs)
  ─────────────────           ──────────────────────
  FastAPI + PostgreSQL        Gold Standard (SSOT tecnico)
  React (14 componentes)      Blacklists JSON
  elevenlabs.py (880L)        Knowledgebase ElevenLabs
  dubbing_pipeline.py         Levantamientos
  dubbing_service.py          Prompts, scripts
```

### 4 SSOT JSONs que el pipeline necesita producir/consumir

| JSON | Proposito | Status |
|:-----|:----------|:-------|
| `dialogue_objects.json` | Segmentos de dialogo parseados del .docx | Existe (via docx_parser.py) |
| `voice_manifest.json` | Mapeo personaje → voice_id por idioma | Concepto, no implementado |
| `timing_objects.json` | Timing real post-Fernando (STT timestamps) | No implementado |
| `qa_report.json` | Resultados de auditoria por idioma | No implementado |

### 16 endpoints de ElevenLabs necesarios (solo 1 implementado)

| # | Endpoint | Status | Prioridad |
|:--|:---------|:-------|:----------|
| 1 | `POST /v1/dubbing` | Implementado | — |
| 2 | `GET /v1/dubbing/{id}` | No implementado | P0 |
| 3 | `GET /v1/dubbing/{id}/transcript/{lang}` | No implementado | P0 |
| 4 | `DELETE /v1/dubbing/{id}` | No implementado | P1 |
| 5 | `GET /v1/dubbing/{id}/audio/{lang}` | No implementado | P0 |
| 6 | Dubbing Resource API (CRUD segments) | No implementado | P0 |
| 7 | `POST /v1/text-to-speech` | No implementado | P1 |
| 8 | `POST /v1/speech-to-text` (Scribe v2) | No implementado | P0 |
| 9 | Forced Alignment API | No implementado | P1 |
| 10 | Pronunciation Dictionaries CRUD | No implementado | P2 |
| 11 | Audio Isolation | No implementado | P2 |
| 12-16 | Voices, Projects, History, Models, Usage | No implementado | P2-P3 |

---

## 2. OBJETIVOS SMART

### MACRO: Ramon entiende el repo, la arquitectura, y ejecuta los primeros fixes y desarrollos bajo direccion de Daniel

---

### Objetivo R1: Onboarding completo del repo y arquitectura
**S:** Leer y comprender los documentos clave del repo Doge-MultiLang, el Gold Standard, y la estructura de AI-Studio
**M:** Ramon puede explicar: (1) el flujo del pipeline, (2) los 4 SSOT JSONs, (3) el sistema de 4 Gates, (4) el tiering de idiomas, (5) los resultados de Phase 0
**A:** ~8h de lectura guiada
**R:** Sin entender la arquitectura, cualquier codigo que escriba sera incorrecto
**T:** Semana 1

#### Plan de lectura (orden recomendado)

| Dia | Documento | Tiempo | Que aprender |
|:----|:----------|:-------|:-------------|
| 1 (AM) | [`debate/Propuesta_Equipo_No_Tecnica.md`](../debate/Propuesta_Equipo_No_Tecnica.md) Secciones 1-4 | 1h | El problema, el proceso actual, por que importa |
| 1 (PM) | [`debate/Claude_Gold_Standard_Consenso_Final.md`](../debate/Claude_Gold_Standard_Consenso_Final.md) Secciones 1-3 | 2h | Hallazgos verificados, estado real del sistema, codigo existente |
| 2 (AM) | Gold Standard Secciones 4-5 | 1.5h | Arquitectura target, 4 SSOT JSONs, estrategia ElevenLabs API |
| 2 (PM) | Gold Standard Secciones 6-7 | 1h | Cadena de traduccion (DTR), sistema QA 4 Gates |
| 3 (AM) | Gold Standard Seccion 10 | 1h | Roadmap de implementacion, exit criteria por fase |
| 3 (PM) | [`debate/Sonnet_Devil_Advocate_Critique.md`](../debate/Sonnet_Devil_Advocate_Critique.md) Seccion 0 | 30min | Resultados Phase 0, que funciona y que no |
| 3 (PM) | [`docs/gold_standard_workflow.md`](../docs/gold_standard_workflow.md) | 30min | Endpoints correctos de ElevenLabs |

#### Checklist de comprension

- [ ] Puedo dibujar el pipeline de guion a 27 idiomas publicados
- [ ] Entiendo que son los 4 SSOT JSONs y quien los produce/consume
- [ ] Conozco los 4 Gates de QA y que valida cada uno
- [ ] Se que endpoints de ElevenLabs estan implementados vs pendientes
- [ ] Entiendo los bugs confirmados (P1 WER, service-pipeline disconnect)
- [ ] Conozco el tiering de idiomas (T1/T2/T3) y por que existe
- [ ] Entiendo por que E2E no es factible hoy y que falta (~11h)

---

### Objetivo R2: Fix de bugs confirmados (Phase 0)
**S:** Corregir Bug P1 (WER language default) y conectar dubbing_pipeline.py con dubbing_service.py
**M:** Tests pasando para ambos fixes, PR mergeado en AI-Studio
**A:** Bugs identificados con ubicacion exacta en Phase 0
**R:** Sin estos fixes, el pipeline E2E es imposible
**T:** Semana 2-3

#### Entregables micro

| # | Entregable | Esfuerzo | Criterio |
|:--|:-----------|:---------|:---------|
| R2.1 | Fix Bug P1: `WERResult.language` debe usar el idioma target, no defaultear a "ES" (cierra Gap G9: no hay WER tracking por idioma) | 2h | Test unitario: WER calculado para EN retorna language="en" |
| R2.2 | Integrar `dubbing_pipeline.py` ↔ `dubbing_service.py` (adaptador) | 8h | Test de integracion: servicio invoca pipeline y retorna resultado |
| R2.3 | Verificar que 130+ tests existentes siguen pasando post-fix | 1h | CI green |

---

### Objetivo R3: Implementar endpoints ElevenLabs faltantes (P0)
**S:** Agregar los 5 endpoints P0 de ElevenLabs a `elevenlabs.py`
**M:** 5 endpoints funcionales con tests, documentados
**A:** Wrapper async ya existe (880L), patron de implementacion claro
**R:** Sin estos endpoints, no se puede ni consultar status de dubbing ni descargar audio
**T:** Semana 4-5

#### Entregables micro

| # | Endpoint | Esfuerzo | Test minimo |
|:--|:---------|:---------|:------------|
| R3.1 | `GET /v1/dubbing/{id}` (status/metadata) | 2h | Consultar un dubbing existente, verificar status |
| R3.2 | `GET /v1/dubbing/{id}/transcript/{lang}` | 2h | Obtener transcript EN de un dubbing |
| R3.3 | `GET /v1/dubbing/{id}/audio/{lang}` | 2h | Descargar audio de 1 idioma |
| R3.4 | `POST /v1/speech-to-text` (Scribe v2) | 3h | STT de 30s audio ES, verificar transcript |
| R3.5 | Dubbing Resource API (GET/PATCH segments) | 4h | Listar segmentos de un dubbing, modificar 1 |

---

### Objetivo R4: Spike de Dynamic Translation Routing
**S:** Probar si ElevenLabs soporta traduccion directa ES→PT-BR (sin pasar por EN) y comparar calidad
**M:** COMET scores de ES→PT-BR directo vs ES→EN→PT-BR en 1 episodio, documentados
**A:** Requiere R3 (endpoints implementados) + 1 episodio de prueba
**R:** Si funciona, mejora calidad para idiomas romance y reduce efecto telefono descompuesto
**T:** Semana 6

#### Entregables micro

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| R4.1 | Test: `POST /v1/dubbing` con `source_lang=es`, `target_lang=pt` | 1h |
| R4.2 | Test: mismo episodio con cadena actual (ES→EN→PT-BR) | 1h |
| R4.3 | Comparar COMET/WER de ambos outputs | 2h |
| R4.4 | Repetir para FR e IT si PT-BR funciona | 4h |
| R4.5 | Documento de resultados + recomendacion | 1h |

---

### Objetivo R5: Instrumentar umbrales REBAN en el pipeline QA
**S:** Implementar validadores de narrativa y audio para que los Gates usen criterios REBAN como PASS/FAIL
**M:** Validaciones automatizadas en pipeline con tests (unit + integracion) para 1 episodio real Tier 1
**A:** Se apalanca en Phase 1 (`audit_service.py`, `timing_checker.py`, `wer_calculator.py`) y utilidades ya previstas
**R:** Sin estos validadores, los nuevos criterios de calidad quedan solo en documentos y no en ejecucion real
**T:** Semana 7

#### Entregables micro

| # | Entregable | Esfuerzo |
|:--|:-----------|:---------|
| R5.1 | Validador de audio tecnico REBAN (noise, peaks, sample rate, wpm, clipping) | 4h |
| R5.2 | Validador narrativo (anti-patrones + checklist 12 puntos con score) | 5h |
| R5.3 | Integracion en Gate 1/3/4 + tests de regresion | 4h |

---

## 3. DEPENDENCIAS

| Ramon necesita de... | Que | Para cuando |
|:---------------------|:----|:------------|
| **Daniel** | Acceso a AI-Studio repo, API key ElevenLabs, contexto tecnico | Dia 1 |
| **Daniel** | Code review de fixes y nuevos endpoints | Semanas 2-5 |
| **Alan** | 1 episodio real (MP4 + guion .docx) para pruebas | Semana 3 |
| **Saul/Ivan** | Confirmacion del flujo actual en ElevenLabs Studio para no romperlo | Semana 2 |

## 4. RECURSOS DE REFERENCIA

### En este repo

| Recurso | Path | Para que |
|:--------|:-----|:---------|
| Gold Standard | `debate/Claude_Gold_Standard_Consenso_Final.md` | SSOT tecnico completo |
| ElevenLabs KB | `knowledgebase/elevenlabs_api/` (158 docs) | Referencia de API |
| ElevenLabs KB (RAG) | `knowledgebase/elevenlabs_final.jsonl` | 735 entries para busqueda |
| Blacklists | `knowledgebase/blacklists/` | Formato JSON de blacklists |
| Workflow | `docs/gold_standard_workflow.md` | Endpoints correctos |
| Audit prompt | `debate/prompts/gemini_deep_audit_prompt.md` | Contexto completo del proyecto |
| Destilado 04_EVIDENCE | `docs/levantamientos/04_EVIDENCE_destilado_multiidioma.md` | Datos operativos de dubbing (pipeline, gaps, errores) |

### En AI-Studio (repo separado)

| Archivo | Lineas | Para que |
|:--------|:-------|:---------|
| `elevenlabs.py` | 880 | Wrapper async — AQUI se agregan endpoints |
| `dubbing_pipeline.py` | 284 | Pipeline ERP — AQUI esta Bug P1 |
| `dubbing_service.py` | 304 | Servicio — DESCONECTADO del pipeline |
| `docx_parser.py` | 558 | Parser del guion — funcional |
| `dubbing_routes.py` | 129 | Rutas API REST — 11 endpoints |
