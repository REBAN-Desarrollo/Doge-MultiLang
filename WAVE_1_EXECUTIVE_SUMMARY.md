# WAVE 1: Exploration Complete — Discovery Matrix

**Date:** 2026-02-19
**Duration:** 15 minutes (4 parallel explorers)
**Status:** READY FOR PHASE 1 PLANNING

---

## What Exists

### Repos
- ✅ **Doge-MultiLang** — SSOT for pipeline spec + 735 ElevenLabs KB entries
- ✅ **Doge-Animator** — CEP panel for animation (7 primary animadores, 55+ FPS target)
- ✅ **video-qph** — 13 CORE specs + questionnaire templates

### Specifications
- ✅ **06_CORE_AUDIO_TTS.md** — Speaker types (4), TTS pipeline, character consistency rules
- ✅ **07_CORE_MULTI_LANGUAGE.md** — 17 idiomas, 3 tiers QA, 7 Mudas (problems + mitigations)
- ✅ **09_GLOSSARY_STRATEGY.md** — DNT mechanism, pronunciation dictionary, 3-layer protection
- ✅ **10_QA_TIERING.md** — Tier 1-3 validation, cost ~$1-2/video, zero-tolerance for Category A

### Knowledgebase
- ✅ **elevenlabs_final.jsonl** — 735 entries, 2.8 MB (RAG-ready)
- ✅ **Blacklist system** — 3 languages (global + AR + DE)
- ✅ **Rhubarb + FFmpeg KB** — Audio processing documented

### SSOT Document
- ✅ **Un guardaespaldas escolar.docx** — 8 tables, 19 characters, 13 scenes, 44 MB
  - Table 2: Character descriptions
  - Table 4: Script development (dialogues, timing)
  - Tables 6-7: Change request tracking

---

## What Doesn't Exist (Blocking)

### Critical Scripts (15 Planned, 0 Implemented)
- ❌ `scripts/docx_parser.py` ← **BLOCKER #1**
- ❌ `scripts/voice_mapper.py` ← Required after parser
- ❌ `scripts/tts_batch.py` ← Main automation
- ❌ `scripts/wer_pipeline.py` ← Validation
- ❌ (12 more planned scripts)

### Implementations
- ❌ **M2 Silences solution** — Only workaround documented ("cut at midpoint of silence")
- ❌ **M3 Mixed dialogues solution** — Labeled "Pending" in spec (waiting for ElevenLabs Voice Segments v3)
- ❌ **Manifest inheritance system** — Not coded (speaker mapping auto-inheritance)
- ❌ **Glossary enforcer** — Structure defined but not integrated

### Questionnaire Data (CRITICAL)
- ❌ **Q7_FERNANDO_POSTPROD.md** — Template only, **no actual silence handling process**
- ❌ **Q8_SAUL_IVAN_DUBBING.md** — Template only, **no actual speaker mapping steps**

---

## Blocking Dependencies

```
✗ Cannot start Phase 1 without:
├─ docx_parser.py (parse SSOT docx → JSON)
├─ voice_mapper.py (assign voices per character)
├─ tts_batch.py (call ElevenLabs TTS API)
├─ Q7 filled (Fernando's silence workflow)
├─ Q8 filled (Saul/Ivan's speaker mapping)
└─ Doge-Animator 55+ FPS validation
```

---

## Critical Path to Automation (10 Steps)

1. **Parse docx** → dialogues, speakers, timing
2. **Map speakers** → characters (fuzzy matching from table_2)
3. **Assign voices** → Call Ramon's manifest or create new
4. **TTS generate** → ElevenLabs batch (ES)
5. **Sync markers** → Export timing for Fernando (M2 workaround)
6. **Dubbing** → ElevenLabs 16 idiomas
7. **Inherit mapping** → Speaker consistency (M1 solution)
8. **QA validate** → WER + COMET + safety (Tier 1-3)
9. **Normalize** → Audio levels
10. **Deliver** → Final assets per language

---

## Risk Assessment

| Risk | Severity | Blocker | Mitigation |
|------|----------|---------|-----------|
| **M2 Silencios** (manual cutting) | 🔴 HIGH | YES | Fill Q7, document Fernando's exact workflow |
| **M3 Mezcla** (speaker separation) | 🔴 HIGH | YES | Waiting for ElevenLabs Voice Segments v3; no workaround yet |
| **Q7/Q8 empty** | 🔴 HIGH | YES | Fill questionnaires before Phase 1 |
| **Doge-Animator perf** | 🟡 MEDIUM | NO | Confirm 55+ FPS baseline before animador training |
| **Glossary not enforced** | 🟡 MEDIUM | NO | Can defer to Phase 2, but document DNT terms now |

---

## Immediate Actions (Next 2 Days)

### 1. **FILL QUESTIONNAIRES** (Iris/Daniel)
- Get Fernando's actual M2 silence handling process (Q7)
- Get Saul/Ivan's actual speaker mapping steps (Q8)
- **Why:** Without this, M2/M3 automation impossible

### 2. **VALIDATE DOGE-ANIMATOR** (Alex + Helmut)
- Run 4-hour session, confirm 55+ FPS, 0 crashes
- **Why:** Phase 1 blocker (7 animadores depend on this)

### 3. **START DOCX_PARSER** (Backend team)
- Priority: Extract dialogues, speakers, timing from table_4
- **Why:** Foundation for all downstream scripts

---

## For Phase 1 Planning

### Inputs
- ✅ This discovery report
- ✅ Filled Q7 + Q8 (when available)
- ✅ Doge-Animator baseline confirmed

### Outputs
- 📋 Detailed task breakdown (15 scripts)
- 🎯 Success criteria for each task (GATE)
- ⚡ Parallelization strategy (Wave 2-3)
- 🧪 Acceptance tests per script

### Timeline
- **Week 1:** Fill Q7/Q8 + Doge-Animator validation
- **Week 2:** Phase 1 planning + script decomposition
- **Week 3:** WAVE 2 execution (scripts #1-6)
- **Week 4:** WAVE 3+ execution (scripts #7-15) + integration

---

## Key Contacts

| Role | Name | Relevance |
|------|------|-----------|
| **Operations** | Iris | Fill Q7/Q8 timeline |
| **Animator (Primary)** | Helmut + 6 others | Doge-Animator perf validation |
| **Post-production** | Fernando | Q7 data (silence workflow) |
| **Dubbing** | Saul, Ivan | Q8 data (speaker mapping) |
| **Backend** | TBD | Script implementation |
| **Architect** | Alex | Doge-Animator + Doge-MultiLang integration |

---

## Appendix: File Locations

```
Doge-MultiLang/
├── WAVE_1_DISCOVERY_REPORT.json    ← Full technical data
├── WAVE_1_EXECUTIVE_SUMMARY.md     ← This file
├── README.md                        ← Pipeline overview
├── knowledgebase/                   ← 735 KB entries (RAG ready)
│   ├── elevenlabs_final.jsonl      (2.8 MB)
│   ├── elevenlabs_docs.json        (970 KB)
│   ├── elevenlabs_helper.json      (471 KB)
│   ├── blacklists/                 (global, AR, DE)
│   └── transform.py                (KB generator)
├── scripts/                         ← EMPTY (to be built in Phase 1)
└── docs/                            ← EMPTY (technical docs to be created)

Un guardaespaldas escolar.docx       ← SSOT guion (8 tables, 44 MB)

video-qph/00_CORE/
├── 06_CORE_AUDIO_TTS.md            ← Speaker types, TTS pipeline
├── 07_CORE_MULTI_LANGUAGE.md       ← Mudas, WER targets, blacklist
├── 09_GLOSSARY_STRATEGY.md         ← DNT mechanism, pronunciation dict
├── 10_QA_TIERING.md                ← Tier 1-3 validation
└── (9 more CORE specs)

video-qph/04_EVIDENCE/QUESTIONNAIRES/
├── Q7_FERNANDO_POSTPROD.md         ← TEMPLATE (to be filled)
├── Q8_SAUL_IVAN_DUBBING.md         ← TEMPLATE (to be filled)
└── (8 other questionnaires)
```

---

## Questions?

Contact Daniel Garza (architect) or Iris (PMO) to start Phase 1 planning.
