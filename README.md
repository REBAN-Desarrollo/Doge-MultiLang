# Doge-MultiLang

> Pipeline de automatización multiidioma para QPH — TTS batch, lip sync y QA con ElevenLabs API

**Org:** REBAN-Desarrollo | **Status:** En desarrollo | **Actualizado:** 2026-02-18

---

## ¿Qué es esto?

Scripts de automatización para el pipeline de doblaje multi-idioma de QuePerroHilo (QPH). Implementa las specs definidas en `wt-video-qph/00_CORE/06_CORE_AUDIO_TTS.md` y `07_CORE_MULTI_LANGUAGE.md`.

```
video-qph (specs/docs)   →   Doge-MultiLang (scripts ejecutables)
─────────────────────────    ──────────────────────────────────────
06_CORE_AUDIO_TTS.md     →   scripts/tts_batch.py
07_CORE_MULTI_LANGUAGE   →   scripts/run_wer.py + check_blacklist.py
10_QA_TIERING.md         →   scripts/preflight_validator.py
09_GLOSSARY_STRATEGY.md  →   scripts/glossary_manager.py
```

## Flujo del Pipeline

```
Guion .docx
    ↓
[#15] Content Moderation Scanner  ← pre-TTS, YouTube policy
    ↓
[#11] Glossary Enforcer           ← protect brand terms (DNT)
    ↓
[#12] Pre-flight Validator        ← format, silence, voice IDs
    ↓
[#6]  TTS Batch (ES → audio ES)
    ↓
[#5]  Voice Manifest Generator
    ↓
[#9]  Voice Casting Manager       ← VoiceID consistency
    ↓
ElevenLabs Dubbing API (ES → 16 idiomas)
    ↓
[#8]  Guion Zombie Recovery       ← post-Fernando edit sync
    ↓
[#13] Audio Normalization         ← fix M6 clipping
    ↓
[#3]  Blacklist Checker           ← post-dubbing flag
    ↓
[#1]  STT Drift Detector
[#2]  ES→EN Validator
[#4]  WER Pipeline
[#14] COMETKiwi QE               ← Tier 2/3
    ↓
[#10] QA Dashboard                ← visibility WER by lang/ep
    ↓
[#7]  SFX Processor
    ↓
Fernando (mezcla final)
```

## Estructura

```
Doge-MultiLang/
├── scripts/          # Scripts ejecutables (un archivo por issue)
├── knowledgebase/    # Fuentes RAG para agentes IA
│   ├── elevenlabs_final.jsonl    (2.8MB — RAG principal)
│   ├── elevenlabs_helper.json    (471KB)
│   ├── elevenlabs_docs.json      (969KB)
│   └── blacklists/               (global, AR, DE)
├── docs/             # Documentación técnica de los scripts
└── .github/
    └── ISSUE_TEMPLATE/
```

## Issues Backlog

| # | Script | Prioridad | Estado |
|---|--------|-----------|--------|
| #1 | STT Drift Detector | P1 | Open |
| #2 | ES→EN Validator | P1 | Open |
| #3 | Blacklist Checker | P1 | Open |
| #4 | WER Pipeline | P0 | Open |
| #5 | Voice Manifest Generator | P1 | Open |
| #6 | TTS Automation | P1 | Open |
| #7 | SFX Processor | P2 | Open |
| #8 | Guion Zombie Recovery | P0 | Open |
| #9 | Voice Casting Manager | P1 | Open |
| #10 | QA Dashboard | P1 | Open |
| #11 | Glossary Builder & Enforcer | P1 | Open |
| #12 | Pre-flight Validator | P0 | Open |
| #13 | Audio Normalization | P2 | Open |
| #14 | COMETKiwi Integration | P1 | Open |
| #15 | Content Moderation Scanner | P1 | Open |

## Specs de referencia

Todas las specs viven en `wt-video-qph/docs/product/projects/video-qph/00_CORE/`:
- `06_CORE_AUDIO_TTS.md` — pipeline TTS, perfiles de voz, tiempos/costos
- `07_CORE_MULTI_LANGUAGE.md` — 17 idiomas, 7 Mudas, blacklists, WER targets
- `09_GLOSSARY_STRATEGY.md` — estrategia de glosario, DNT terms
- `10_QA_TIERING.md` — sistema QA 3-tier, KPIs, costo $1-2/video

## Knowledgebase

Los archivos en `knowledgebase/` son fuentes RAG para agentes IA que trabajen en este repo:
- `elevenlabs_final.jsonl` — documentación completa procesada para embeddings
- `elevenlabs_helper.json` — helper específico de API
- `blacklists/` — datos de blacklist por idioma (fuente de verdad para `check_blacklist.py`)

---

**Owner:** REBAN-Desarrollo | **Repo privado**
