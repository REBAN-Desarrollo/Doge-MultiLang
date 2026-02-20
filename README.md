# Doge-MultiLang

> Sistema de calidad y automatizacion para el doblaje multi-idioma de QuePerroHilo — 27 idiomas, cero confianza ciega.

**Org:** REBAN-Desarrollo | **Status:** Pre-implementacion (specs completas, codigo pendiente) | **Actualizado:** 2026-02-20

> **Indice maestro:** [`MASTER_INDEX.md`](MASTER_INDEX.md) — catalogo completo de los 254 archivos del repo con links y metadata.

## Tabla de Contenidos

1. [El problema](#el-problema)
2. [La solucion](#la-solucion)
3. [Relacion con otros repos](#relacion-con-otros-repos)
4. [Arquitectura del pipeline](#arquitectura-del-pipeline)
5. [Estructura del repositorio](#estructura-del-repositorio)
6. [Documentos clave](#documentos-clave)
7. [Estado actual](#estado-actual)
8. [Archivos no incluidos (.gitignore)](#archivos-no-incluidos-gitignore)
9. [Como usar este repo](#como-usar-este-repo)
10. [Equipo](#equipo)
11. [Tecnologias](#tecnologias)

---

## El problema

QPH produce contenido animado infantil (6-12 anos) que se dobla a **27 idiomas** usando ElevenLabs. Hoy el proceso funciona asi:

```
Andrea escribe guion ES → Fernando arma audio/video → Saul/Ivan suben a ElevenLabs → 27 dubs salen → se publican
```

**Lo que falta:** De esos 27 idiomas, solo ingles se revisa manualmente. Los otros 26 se publican con cero metricas de calidad. No hay forma de saber si una traduccion al arabe tiene errores, si el coreano uso una palabra prohibida, o si el timing del japones esta desincronizado.

## La solucion

Este repositorio contiene las especificaciones, knowledgebase, y analisis necesarios para construir un pipeline automatizado de QA multi-idioma:

- **4 gates de revision automatica** en puntos criticos del pipeline
- **3 IAs como jueces** independientes para auditar traducciones (Claude + GPT-4 + Gemini)
- **Blacklists para 27 idiomas** (hoy solo existen 3)
- **Metricas medibles:** WER (tasa de error), calidad de traduccion, naturalidad de audio, timing
- **Sistema de tiers:** Tier 1 (5 idiomas, revision humana), Tier 2 (5 idiomas, muestreo 30%), Tier 3 (17 idiomas, solo automatico)

## Relacion con otros repos

```
AI-Studio                        Doge-MultiLang                   video-qph
─────────────────                ────────────────                 ──────────
Codigo del pipeline              Specs + KB + analisis            CORE specs originales
Phase 1 + 2 implementadas       Phase 3 (QA) en diseno          13 documentos CORE
~3,000 lineas funcionales        PRD + roadmap listo              Cuestionarios de equipo
```

**Doge-MultiLang NO es el repo de codigo.** Es el hub de conocimiento, especificaciones y planeacion que alimenta la implementacion en AI-Studio.

## Arquitectura del pipeline

```
                              ┌─────────────────────┐
                              │   Guion .docx (ES)   │  ← Andrea
                              │  SSOT del texto       │
                              └──────────┬────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
            ┌──────────────┐   ┌────────────────┐   ┌──────────────┐
            │ Glossary &   │   │ Docx Parser    │   │ Blacklist    │
            │ DNT Enforcer │   │ Table 4 → JSON │   │ Generator    │
            └──────┬───────┘   └───────┬────────┘   │ (27 idiomas) │
                   │                   │             └──────┬───────┘
                   └─────────┬─────────┘                    │
                             ▼                              │
                    ┌────────────────┐                      │
                    │ Voice Mapper   │                      │
                    │ → manifest.json│                      │
                    └───────┬────────┘                      │
                            ▼                               │
                    ┌────────────────┐                      │
                    │ TTS Batch (ES) │  ← ElevenLabs API    │
                    └───────┬────────┘                      │
                            ▼                               │
                    ┌────────────────┐                      │
                    │ Fernando       │  ← Post-produccion   │
                    │ mezcla manual  │    (ajustes timing)  │
                    └───────┬────────┘                      │
                            ▼                               │
              ┌─────────────────────────┐                   │
              │ Guion Zombie Gate (#16) │  ← LINCHPIN       │
              │ STT → diff vs docx     │    del pipeline    │
              │ WER > 5% = BLOQUEO     │                    │
              └────────────┬────────────┘                   │
                           ▼                                │
                    ┌────────────────┐                      │
                    │ ElevenLabs     │                      │
                    │ Dubbing API    │  ES → 27 idiomas     │
                    └───────┬────────┘                      │
                            ▼                               │
              ┌─────────────────────────────┐               │
              │       QA Pipeline           │◄──────────────┘
              │  ┌─────────┬─────────┐      │
              │  │ Tier 1  │ Tier 2  │Tier 3│
              │  │ 5 langs │ 5 langs │17 lng│
              │  │ Human+  │ Sample  │ Auto │
              │  │ Auto    │ 30%     │ only │
              │  └─────────┴─────────┘      │
              │  WER + BERTScore + Blacklist │
              └──────────────┬──────────────┘
                             ▼
                    ┌────────────────┐
                    │ Publicacion    │
                    │ 27 idiomas     │
                    └────────────────┘
```

## Estructura del repositorio

```
Doge-MultiLang/
│
├── 📊 analysis/                 # Deep research (4 waves de analisis)
│   ├── prd_final.md             # PRD sintetizado — roadmap de 18 scripts
│   ├── wave_1_*.md/json         # Discovery: mapeo del codebase completo
│   ├── wave_2_*.md              # Deep analysis: data structure, gaps, SSOT
│   └── wave_3_*.md              # Audit: traduccion, arquitectura, costos
│
├── 💬 debate/                   # Debate multi-AI y propuestas (10 documentos)
│   ├── Claude_Mega_Propuesta_Final.md   # Sintesis de 4 perspectivas AI
│   ├── Propuesta_Equipo_No_Tecnica.md   # Version accesible para todo el equipo
│   ├── Codex_2026-02-20_Gold_Standard_Unificado.md  # Canon Codex (latest)
│   ├── Gemini_Swarm_Multi_Opinion.md    # Tacticas: SSML, patches, voices
│   ├── Sonnet_Devil_Advocate_Critique.md # Prudencia: riesgos + mitigaciones
│   └── (5 mas — debate historico)
│
├── 📚 docs/
│   ├── gold_standard_workflow.md    # Workflow de referencia (endpoints correctos, estándares)
│   └── levantamientos/              # 51 documentos de entrevistas y especificaciones
│       ├── README.md                # Indice de levantamientos por fase/tema
│       ├── *_january_quest.md       # Levantamientos Enero (por area)
│       ├── 25_12_24_*.md            # Specs de Diciembre 2025
│       ├── 26_01_*.md               # Specs de Enero 2026
│       └── 26_02_*.md               # Specs de Febrero 2026 (QA, workflows)
│
├── 🧠 knowledgebase/                # Fuentes RAG para agentes IA + datos de produccion
│   ├── elevenlabs_final.jsonl       # 735 entries, 2.8 MB — RAG principal
│   ├── elevenlabs_helper.json       # 471 KB — endpoints frecuentes
│   ├── elevenlabs_docs.json         # 969 KB — referencia general API
│   ├── elevenlabs_api/              # 158 .md docs suplementarios (Feb 2026)
│   ├── blacklists/                  # Blacklists por idioma (global, AR, DE)
│   │   └── ⚠️ 24 idiomas aun no tienen blacklist
│   ├── theories/                    # Sintesis: audio pipeline, benchmarks, translation workflows
│   ├── _metadata/                   # Trazabilidad: reportes, indices, KB status
│   └── transform.py                 # Script que genera elevenlabs_final.jsonl
│
├── 🔧 scripts/
│   ├── planchado.py                 # API de sesiones de planchado QPH
│   ├── generate_pptx_equipo.py      # Generador de presentacion para equipo
│   └── (18 scripts planeados — en AI-Studio)
│
├── 💡 prompts/                      # Prompts para auditorias multi-AI
│   └── gemini_deep_audit_prompt.md  # Prompt de auditoria profunda
│
├── 🗂️ misc/
│   ├── analysis_calc.py             # Calculos de analisis
│   └── QPH_Problematicas_Equipo_v6.pptx  # Presentacion de equipo
│
└── 📖 README.md                     # Este archivo
```

**Nota:** Los archivos `.jsonl`, `.json` grandes del knowledgebase estan en `.gitignore` (ver seccion [Archivos no incluidos](#archivos-no-incluidos-gitignore)). Si necesitas acceso, consulta con el equipo de arquitectura.

## Documentos clave

**Arquitecto / Backend:**
- [`analysis/prd_final.md`](analysis/prd_final.md) — PRD completo: 18 scripts, roadmap, decisiones, costos ($60-90/ep)
- [`docs/gold_standard_workflow.md`](docs/gold_standard_workflow.md) — Workflow de referencia con endpoints correctos de ElevenLabs

**Equipo (Todo el mundo):**
- [`debate/Propuesta_Equipo_No_Tecnica.md`](debate/Propuesta_Equipo_No_Tecnica.md) — Problematica y solucion en lenguaje accesible, con ejemplos

**PMO / Decisiones:**
- [`debate/Claude_Mega_Propuesta_Final.md`](debate/Claude_Mega_Propuesta_Final.md) — Sintesis de 4 perspectivas AI, consenso en 6 puntos, plan optimo

**Agentes IA / Backend (para RAG):**
- [`knowledgebase/README.md`](knowledgebase/README.md) — Guia de uso del KB para agentes IA
- [`knowledgebase/elevenlabs_api/README.md`](knowledgebase/elevenlabs_api/README.md) — Indice de 158 docs suplementarios (Feb 2026)

## Estado actual

### ✅ Lo que ya existe

| Componente | Cantidad | Status |
|:-----------|:---------|:-------|
| Especificaciones CORE (video-qph) | 13 documentos | Completo |
| Levantamientos de equipo | 51 documentos (46 .md, 4 .txt, 1 .docx) | Completo |
| ElevenLabs KB | 735 entries + 158 docs suplementarios | Completo |
| PRD final + Roadmap | 18 scripts, grafo de dependencias | Completo |
| Debate multi-AI | 4 perspectivas, 6 puntos consenso | Sintetizado |
| Pipeline (AI-Studio) | Phase 1 + Phase 2 | ~3,000 lineas implementadas |
| Blacklists | 3 idiomas (Global, AR, DE) | Funcional (24 faltantes) |

### ⚠️ Lo que falta

| Item | Importancia | Blocker | Esfuerzo |
|:-----|:------------|:--------|:---------|
| Phase 3: QA Automation | **P0** | NO (Phase 1+2 funcionales) | ~60-70h |
| Blacklists para 24 idiomas | P1 | SI (M5 es blocker) | ~3h (script generador) |
| Cuestionario Q7 (Fernando) | P1 | SI (M2 silences) | 1h entrevista |
| Cuestionario Q8 (Saul/Ivan) | P1 | SI (M3 speaker merge) | 1h entrevista |
| Piloto end-to-end (1 episodio) | P0 | NO (validacion) | ~3-5 dias |

### 🔄 Decisiones pendientes (antes de Wave C)

| Decision | Opciones | Impacto | Deadline |
|:---------|:---------|:--------|:---------|
| API Tier ElevenLabs | Voiceover Studio / Manual Dub CSV / Human dubbers | Scripts #4, #6, #9, #10 | Dia 3 |
| Presupuesto QA | $60-80/ep / $30-45/ep / $80-100/ep | Umbrales scripts #7, #8 | Dia 3 |
| FPS Doge-Animator | Configurable (recomendado) / Fijo 55 | Script #11 | Dia 4 |

## Equipo

| Rol | Persona | Area |
|:----|:--------|:-----|
| Architect | Daniel Garza | Diseno de sistema, integracion |
| PMO | Iris | Operaciones, coordinacion |
| Guionismo | Andrea | Guiones, SSOT del texto |
| Post-produccion | Fernando | Mezcla final, timing creativo |
| Dubbing | Saul, Ivan | ElevenLabs, speaker mapping |
| Factory | Alan, Ramon | Audio, TTS, voces |
| QA | Gio | Auditoria de calidad |

## Tecnologias

| Herramienta | Uso |
|:------------|:----|
| **ElevenLabs** | TTS (Flash v2.5 / v3), Dubbing API, STT (Scribe v2), Forced Alignment |
| **Whisper** | STT local para Tier 2/3 y Guion Zombie gate |
| **jiwer** | Calculo de WER (Word Error Rate) |
| **sentence-transformers** | BERTScore / similitud semantica multilingue |
| **python-docx** | Parsing del guion .docx |
| **ffmpeg** | Fallback para split/merge de audio multi-speaker |
| **Rhubarb** | Datos de fonemas para lip-sync |

## Archivos no incluidos (.gitignore)

**3 archivos clave del knowledgebase estan excluidos del repo:**

```
knowledgebase/elevenlabs_final.jsonl     (2.8 MB — RAG principal)
knowledgebase/elevenlabs_helper.json     (471 KB)
knowledgebase/elevenlabs_docs.json       (969 KB)
```

**Por que?** Archivos muy grandes para git. Se regeneran con:
```bash
cd knowledgebase
python transform.py
```

**Acceso:** Si necesitas estos archivos:
1. Clona el repo
2. Genera localmente con `transform.py`
3. O consulta con el equipo de arquitectura (Daniel Garza)

---

## Como usar este repo

### Soy developer nuevo — ¿por donde empiezo?

1. **Entender el problema:** Lee [`debate/Propuesta_Equipo_No_Tecnica.md`](debate/Propuesta_Equipo_No_Tecnica.md) (~5 min)
2. **Ver el plan:** Lee [`analysis/prd_final.md`](analysis/prd_final.md) seccion "Executive Summary" (~10 min)
3. **Conocer endpoints:** Consulta [`docs/gold_standard_workflow.md`](docs/gold_standard_workflow.md) para ver flujo completo
4. **Entender estructura:** Inspecciona el tree arriba — cada directorio tiene README interno

### Soy arquitecto — necesito el diagrama completo

1. **PRD:** [`analysis/prd_final.md`](analysis/prd_final.md) — roadmap, riesgos, costos
2. **Arquitectura:** Seccion "Arquitectura del pipeline" arriba (diagrama ASCII)
3. **Workflows:** [`docs/gold_standard_workflow.md`](docs/gold_standard_workflow.md) — endpoints, contratos
4. **Deep dives:** Cada wave en `analysis/` tiene hallazgos detallados

### Soy agente IA — voy a desarrollar en este repo

1. **Usa el KB:** [`knowledgebase/elevenlabs_final.jsonl`](knowledgebase/elevenlabs_final.jsonl) para RAG sobre ElevenLabs API
2. **Reference:** [`knowledgebase/elevenlabs_api/README.md`](knowledgebase/elevenlabs_api/README.md) para indice de 158 docs suplementarios
3. **Blacklists:** [`knowledgebase/blacklists/`](knowledgebase/blacklists/) — datos de produccion
4. **Gold standard:** [`docs/gold_standard_workflow.md`](docs/gold_standard_workflow.md) — asegurate de seguir estándares

### Necesito datos de un dominio especifico

| Dominio | Documentos | Ubicacion |
|:--------|:-----------|:----------|
| TTS + Voice consistency | Q1, Q2, Q4, 06_CORE_AUDIO | `docs/levantamientos/` |
| Multi-language + Blacklist | Q3, 07_CORE_MULTI_LANG | `docs/levantamientos/` |
| QA + Metrics | Q5+, 10_QA_TIERING | `docs/levantamientos/` |
| ElevenLabs API | KB completo | `knowledgebase/elevenlabs_*` |
| Timing + Fernando workflow | 04_CORE_TIMING, Q7 | `docs/levantamientos/` |
| Debate + alternativas | debate/* | `debate/` |

---

## Equipo

| Rol | Persona | Area |
|:----|:--------|:-----|
| **Architect** | Daniel Garza | Diseno del sistema, integracion, decisiones |
| **PMO** | Iris | Operaciones, timeline, coordinacion |
| **Guionismo** | Andrea | Guiones, SSOT del texto, planchado |
| **Post-produccion** | Fernando | Mezcla final, timing creativo, audio refs |
| **Dubbing** | Saul, Ivan | ElevenLabs API, speaker mapping, QC |
| **Factory** | Alan, Ramon | Audio, TTS, voices, manifest |
| **QA** | Gio | Auditoria de calidad, WER, metricas |

---

## Tecnologias

| Herramienta | Uso | Linea de codigo |
|:------------|:----|:----------------|
| **ElevenLabs** | TTS (Flash v2.5 / v3), Dubbing API, STT (Scribe v2), Forced Alignment | Via API |
| **Whisper** | STT local para Tier 2/3 y Guion Zombie gate | `fernando_stt_reconciler.py` |
| **jiwer** | Calculo de WER (Word Error Rate) | `qc_validation.py` |
| **sentence-transformers** | BERTScore / similitud semantica multilingue | `qc_validation.py` |
| **python-docx** | Parsing del guion .docx (Table 2+4) | `docx_parser.py` |
| **ffmpeg** | Fallback para split/merge de audio multi-speaker | `ffmpeg_merger.py` |
| **Rhubarb** | Datos de fonemas para lip-sync | `lip_sync_rhubarb.py` |
| **Claude/GPT-4/Gemini** | Auditoria de traducciones, QA inteligente | Agentes externos |

---

**Org:** REBAN-Desarrollo | **Repo privado** | **Actualizado:** 2026-02-20

**Contacto:** Daniel Garza (architect), Iris (PMO)
