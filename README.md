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
├── 💬 debate/                   # Debate multi-AI y documentos canonicos
│   ├── Claude_Gold_Standard_Consenso_Final.md  # ⭐ DOCUMENTO CANONICO — Gold Standard v1.0
│   ├── Codex_2026-02-20_Gold_Standard_Unificado.md  # Canon Codex (latest)
│   ├── Sonnet_Devil_Advocate_Critique.md # Devil's Advocate + resultados Phase 0
│   ├── Gemini_3.1_PRO_Deep_Audit_QPH.md # Auditoria profunda Gemini Pro
│   ├── Gemini_Deep_Thinking_Deep_Audit_QPH.md # Auditoria Gemini Deep Thinking
│   ├── Propuesta_Equipo_No_Tecnica.md   # Version accesible para todo el equipo
│   └── prompts/                         # Prompts usados para auditorias
│
├── 📚 docs/
│   ├── gold_standard_workflow.md    # Workflow de referencia (endpoints correctos)
│   ├── gold_standard_sections_*.md  # 8 archivos de trabajo (secciones del Gold Standard)
│   ├── Gaps_Pendientes_Deep_Research.md  # YouTube Analytics: AVD, revenue, ROI por idioma
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
├── 📊 analysis_calc.py              # Calculos de revenue QPH por idioma
├── 📊 QPH_Problematicas_Equipo_v6.pptx  # Presentacion de equipo
│
└── 📖 README.md                     # Este archivo
```

**Nota:** Los archivos `.jsonl`, `.json` grandes del knowledgebase estan en `.gitignore` (ver seccion [Archivos no incluidos](#archivos-no-incluidos-gitignore)). Si necesitas acceso, consulta con el equipo de arquitectura.

## Documentos clave

**Documento canonico (SSOT tecnico):**
- [`debate/Claude_Gold_Standard_Consenso_Final.md`](debate/Claude_Gold_Standard_Consenso_Final.md) — **Gold Standard v1.0** — Consolidacion de 10+ documentos multi-AI. Contiene: arquitectura, 4 SSOT JSONs, 4 Gates QA, tiering, roadmap 5 fases, costos, apendices A-E

**Arquitecto / Backend:**
- [`analysis/prd_final.md`](analysis/prd_final.md) — PRD completo: 18 scripts, roadmap, costos ($46-63/ep QA)
- [`docs/gold_standard_workflow.md`](docs/gold_standard_workflow.md) — Workflow de referencia con endpoints correctos de ElevenLabs
- [`debate/Sonnet_Devil_Advocate_Critique.md`](debate/Sonnet_Devil_Advocate_Critique.md) — Critica independiente + resultados de verificacion Phase 0

**Equipo (Todo el mundo):**
- [`debate/Propuesta_Equipo_No_Tecnica.md`](debate/Propuesta_Equipo_No_Tecnica.md) — Problematica y solucion en lenguaje accesible, con ejemplos

**Datos de negocio:**
- [`docs/Gaps_Pendientes_Deep_Research.md`](docs/Gaps_Pendientes_Deep_Research.md) — YouTube Analytics: AVD, revenue por pais, ROI por idioma

**Agentes IA / Backend (para RAG):**
- [`knowledgebase/README.md`](knowledgebase/README.md) — Guia de uso del KB para agentes IA
- [`knowledgebase/elevenlabs_api/README.md`](knowledgebase/elevenlabs_api/README.md) — Indice de 158 docs suplementarios (Feb 2026)

## Estado actual

### ✅ Lo que ya existe

| Componente | Cantidad | Status |
|:-----------|:---------|:-------|
| **Gold Standard v1.0** | 1 documento canonico (~1,400 lineas) | **Consolidado** |
| Especificaciones CORE (video-qph) | 13 documentos | Completo |
| Levantamientos de equipo | 51 documentos (46 .md, 4 .txt, 1 .docx) | Completo |
| ElevenLabs KB | 735 entries + 158 docs suplementarios | Completo |
| PRD final + Roadmap | 18 scripts, grafo de dependencias | Completo |
| Debate multi-AI consolidado | 10+ perspectivas → Gold Standard | Consolidado |
| Devil's Advocate + Phase 0 | Verificacion independiente del codebase | Actualizado |
| Pipeline (AI-Studio) | Phase 1 + Phase 2 | ~3,000 lineas, 130+ tests |
| Blacklists | 3 idiomas (Global, AR, DE) | Funcional (24 faltantes) |

### ⚠️ Resultados Phase 0 (verificacion del codebase AI-Studio)

| Hallazgo | Status | Detalle |
|:---------|:-------|:-------|
| E2E pipeline | **NO FACTIBLE hoy** | ~11h de fixes minimos necesarios |
| Bug P0 (crash en pipeline) | Refutado | No existe en el codebase actual |
| Bug P1 (WER default ES) | **Confirmado** | STT usa ES por defecto en vez del idioma target |
| Service-pipeline disconnect | **Confirmado** | Servicios existen pero no estan conectados al pipeline |
| Tests existentes | 130+ tests | No 30 como se reporto originalmente |
| Frontend AI-Studio | Solo modo Video funciona | Audio/Text modes no implementados |
| ElevenLabs API coverage | 1/16 endpoints | Solo 1 endpoint fully implementado de 16 necesarios |

### ⚠️ Lo que falta

| Item | Importancia | Blocker | Esfuerzo |
|:-----|:------------|:--------|:---------|
| Fixes minimos para E2E | **P0** | SI | ~11h |
| Phase 3: QA Automation | **P0** | NO (Phase 1+2 funcionales) | ~60-70h |
| Blacklists para 24 idiomas | P1 | SI (M5 es blocker) | ~3h (script generador) |
| Cuestionario Q7 (Fernando) | P1 | SI (M2 silences) | 1h entrevista |
| Cuestionario Q8 (Saul/Ivan) | P1 | SI (M3 speaker merge) | 1h entrevista |
| Piloto end-to-end (1 episodio) | P0 | NO (validacion) | ~3-5 dias |

### 🔄 Decisiones pendientes

| Decision | Opciones | Referencia |
|:---------|:---------|:-----------|
| Dubbing Resource API vs CSV | API reemplaza CSV — migrar | Gold Standard §4.3 |
| Dynamic Translation Routing | ES→Target directo vs ES→EN→Target | Gold Standard §5.2 |
| Presupuesto QA | $46-63/ep (no $1.20 como se estimo) | Gold Standard §11 |
| ElevenLabs API tier | Voiceover Studio / Dubbing API | Gold Standard §4.1 |

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
2. **Ver el Gold Standard:** Lee [`debate/Claude_Gold_Standard_Consenso_Final.md`](debate/Claude_Gold_Standard_Consenso_Final.md) secciones 1-3 (~15 min)
3. **Conocer endpoints:** Consulta [`docs/gold_standard_workflow.md`](docs/gold_standard_workflow.md) para ver flujo completo
4. **Entender estructura:** Inspecciona el tree arriba — cada directorio tiene README interno

### Soy arquitecto — necesito el diagrama completo

1. **Gold Standard:** [`debate/Claude_Gold_Standard_Consenso_Final.md`](debate/Claude_Gold_Standard_Consenso_Final.md) — arquitectura, contratos JSON, gates, roadmap, costos
2. **Devil's Advocate:** [`debate/Sonnet_Devil_Advocate_Critique.md`](debate/Sonnet_Devil_Advocate_Critique.md) — riesgos verificados + Phase 0 results
3. **PRD:** [`analysis/prd_final.md`](analysis/prd_final.md) — 18 scripts, grafo de dependencias
4. **Workflows:** [`docs/gold_standard_workflow.md`](docs/gold_standard_workflow.md) — endpoints ElevenLabs

### Soy agente IA — voy a desarrollar en este repo

1. **Gold Standard:** [`debate/Claude_Gold_Standard_Consenso_Final.md`](debate/Claude_Gold_Standard_Consenso_Final.md) — SSOT tecnico, contratos, gates, apendices
2. **Usa el KB:** [`knowledgebase/elevenlabs_final.jsonl`](knowledgebase/elevenlabs_final.jsonl) para RAG sobre ElevenLabs API
3. **Reference:** [`knowledgebase/elevenlabs_api/README.md`](knowledgebase/elevenlabs_api/README.md) para indice de 158 docs suplementarios
4. **Blacklists:** [`knowledgebase/blacklists/`](knowledgebase/blacklists/) — datos de produccion

### Necesito datos de un dominio especifico

| Dominio | Documentos | Ubicacion |
|:--------|:-----------|:----------|
| TTS + Voice consistency | Q1, Q2, Q4, 06_CORE_AUDIO | `docs/levantamientos/` |
| Multi-language + Blacklist | Q3, 07_CORE_MULTI_LANG | `docs/levantamientos/` |
| QA + Metrics | Q5+, 10_QA_TIERING | `docs/levantamientos/` |
| ElevenLabs API | KB completo | `knowledgebase/elevenlabs_*` |
| Timing + Fernando workflow | 04_CORE_TIMING, Q7 | `docs/levantamientos/` |
| Gold Standard (SSOT) | Gold Standard v1.0 | `debate/Claude_Gold_Standard_Consenso_Final.md` |
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
