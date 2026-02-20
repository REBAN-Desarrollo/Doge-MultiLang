# PRD FINAL: Doge-MultiLang Audio Pipeline

**Project:** Doge-MultiLang -- Automated Multi-Language Audio Pipeline for QPH
**Version:** 1.0 (Post Wave 1-4 Synthesis)
**Date:** 2026-02-19
**Author:** Orchestrator (Wave 4 Coordinator)
**Status:** READY FOR PHASE 1 IMPLEMENTATION
**Audience:** Daniel Garza (Architect), Iris (PMO), Backend Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Three Critical Questions -- Answered](#2-three-critical-questions----answered)
3. [Architecture Decisions](#3-architecture-decisions)
4. [18-Script Implementation Roadmap](#4-18-script-implementation-roadmap)
5. [User Decisions Required](#5-user-decisions-required)
6. [Quick Wins (Start Today)](#6-quick-wins-start-today)
7. [Risk Matrix](#7-risk-matrix)
8. [Budget and Timeline](#8-budget-and-timeline)
9. [Success Criteria for Pilot Episode](#9-success-criteria-for-pilot-episode)
10. [Appendix: Wave Audit Trail](#10-appendix-wave-audit-trail)

---

## 1. Executive Summary

### What This Document Is

This PRD is the synthesis of 4 analysis waves executed on 2026-02-19 against the full Doge-MultiLang codebase, all levantamiento documentation, the ElevenLabs knowledgebase (735 entries), and the pilot episode docx ("Un guardaespaldas escolar.docx"). It answers the 3 critical questions blocking implementation, provides a buildable 18-script roadmap, and identifies exactly 2 human actions and 1 research task that gate the remaining work.

### Current State

- **Specifications:** 13 CORE docs, 4 levantamiento questionnaires (2 filled, 2 empty), 735 ElevenLabs KB entries
- **Code:** 0 scripts implemented (scripts/ directory is empty)
- **SSOT Document:** 1 pilot episode docx (8 tables, 19 characters, 13 scenes, 44 MB)
- **Blockers:** 2 unfilled questionnaires (Q7, Q8), 1 phantom feature ("Voice Segments v3"), 1 unknown API format (Manual Dub CSV)

### Key Findings Across All Waves

| Finding | Source | Impact |
|:--------|:-------|:-------|
| "Voice Segments v3" does not exist as an ElevenLabs product | T9 (Wave 3) -- 0 results in 735 KB entries | M3 solution must use Voiceover Studio + ffmpeg fallback |
| QA Tier 1 costs ~$40-50/episode, not $2 | T9 (Wave 3) cost audit | Budget planning revised |
| 18 scripts needed, not 15 | T10 (Wave 3) -- added #16, #17, #18 | Backlog expanded |
| Script #16 (fernando_stt_reconciler.py) is the pipeline linchpin | T8 (Wave 2) + T10 (Wave 3) unanimous | Provides timing SSOT + Guion Zombie gate |
| Docx uses TABLE structure, not inline bold | T8 (Wave 2) -- python-docx confirmed | docx_parser.py must read doc.tables[4], not paragraphs |
| 9 of 18 scripts can start NOW with zero blockers | T10 (Wave 3) readiness scorecard | Phase 1 coding can begin immediately |
| Only 2 scripts (#5, #6) are hard-blocked | T7 (Wave 2) blocking chain analysis | Q7 and Q8 are the only human-action blockers |

### Bottom Line

Phase 1 implementation can start today. 9 scripts have complete specs, available data, and selected tools. The 2 blocked scripts (#5 tts_post_silence.py, #6 tts_multi_speaker_merge.py) are blocked exclusively by unfilled questionnaires Q7 and Q8, which require human interviews. Everything else is parallelizable.

---

## 2. Three Critical Questions -- Answered

### Q1: Speaker Identification -- Who speaks when?

**Answer:** 4-tier speaker system with persistent voice IDs, enforced by manifest.json.

**How it works:**

The pilot episode docx contains Table 2 (19 rows x 5 cols) as the character catalog and Table 4 (13 rows x 8 cols) as the dialogue source. Each row in Table 4 has a "Personaje" column (Col 2) that names the speaker for that dialogue line. Cross-referencing against Table 2 yields the speaker_type.

**Speaker Tier System (from 06_CORE_AUDIO_TTS.md S2):**

| Tier | Type | Persistence Rule | Example |
|:-----|:-----|:-----------------|:--------|
| 1 | Protagonista | Same voice_id across ALL 16 languages AND all episodes | Taro |
| 2 | Antagonista | Same voice_id per character, contrasting with Tier 1 | Episode villain |
| 3 | Narrador | FIXED voice_id for entire series -- never changes | Narrator |
| 4 | Secundario | Pool of 3-5 generic voice_ids, no cross-episode persistence | Extras, crowd |

**Technical Implementation:**

1. `docx_parser.py` (#1) reads Table 4 Col 2 ("Personaje") to extract speaker_name per dialogue line
2. `docx_parser.py` cross-references speaker_name against Table 2 to get speaker_type
3. `voice_mapper.py` (#3) takes the character list + ElevenLabs voice pool and produces `manifest.json`
4. `manifest.json` contains: voice_id per character, persistence rules, fallback logic
5. `qc_validation.py` (#7) includes a speaker_consistency metric: same voice_id must appear for same character across all language outputs

**manifest.json enforcement rule (from 07_CORE_MULTI_LANGUAGE.md S5.1):**
Re-mapping is PROHIBITED. Saul's current practice of assigning voices "de memoria" is exactly the problem manifest.json solves. Once generated, manifest.json is the immutable voice SSOT for that episode.

**Confidence:** 95% -- Spec is complete, Table 2 structure confirmed by python-docx read, ElevenLabs API supports voice assignment per speaker.

**Remaining unknown:** Exact ElevenLabs voice_ids to assign (requires Ramon's voice pool access or EL API listing). This does NOT block coding voice_mapper.py.

---

### Q2: Dialogue Boundaries -- Where does one dialogue end and another begin?

**Answer:** Table-based row parsing. Each row in Table 4 is one dialogue unit.

**How it works:**

The docx is NOT prose with inline speaker markers. It is a structured TABLE. Table 4 has 13 rows x 8 columns:

| Column | Name | Content | Extraction |
|:-------|:-----|:--------|:-----------|
| Col 0 | Escena | Scene identifier ("Escena 1", "Escena 2", ...) | Pattern match "Escena N" -- carry forward for merged cells |
| Col 1 | Duracion | Scene duration estimate ("02:15") | Text parse -- advisory only, not frame-accurate |
| Col 2 | Personaje | Speaker name ("TARO", "EMI", "NARRATOR") | Direct read -- cross-reference to Table 2 |
| Col 3 | Dialogo | Dialogue text | Direct read -- UTF-8 fix required (chardet fallback) |
| Col 4 | Accion | Stage direction | Direct read |
| Col 5 | Notas | Production notes | Direct read |
| Col 6 | Timing | Timing estimate | Text parse -- NOT frame-accurate |
| Col 7 | Estado | Approval status | Direct read |

**Boundary detection algorithm:**

```
FOR each row in doc.tables[4].rows (skip header row):
  IF row.cells[2].text.strip() == "":
    SKIP (separator row or merged cell)
  ELSE:
    dialogue_object = extract(row)

    BOUNDARY TYPE 1 -- Scene change:
      IF row.cells[0] contains new "Escena N":
        Mark: scene_boundary = True

    BOUNDARY TYPE 2 -- Speaker change:
      IF previous_row.speaker != current_row.speaker:
        Mark: speaker_change = True

    BOUNDARY TYPE 3 -- Continuation:
      IF same speaker, same scene:
        Mark: continuation = True
```

**What Table 4 DOES NOT contain:**
- Frame-accurate start/end timestamps (0% confidence -- must come from Fernando MP4 via STT)
- Explicit silence markers (not present in docx at all)
- Audio-level timing data

**Where frame-accurate timing comes from:**
Fernando's MP4 (ES) is the only source of real timing data. `fernando_stt_reconciler.py` (#16) runs Whisper STT on Fernando's exported audio to extract per-dialogue start_seconds and end_seconds. This becomes Layer 2 SSOT (timing_objects.json).

**Confidence:** 95% for dialogue text extraction from Table 4. 0% for frame-accurate timing from docx (it does not exist there). 85% for timing recovery via STT on Fernando's MP4 (dependent on Whisper accuracy).

---

### Q3: Silence Handling -- How to manage pauses between dialogues?

**Answer:** 3-layer approach. Layer 1 is a heuristic default. Layer 2 is Fernando's creative edit recovered via STT. Layer 3 is future automation.

**The core problem:**
The docx contains NO silence data. Fernando handles silences manually by visually cutting waveforms ("a la mitad del silencio, visualmente" -- from POSTPROD_FERNANDO.md). The exact duration rule is UNKNOWN because Q7 (Fernando's questionnaire) is unfilled.

**Layer 1: Docx Heuristic (Default -- available now)**

Based on dialogue boundary type from Table 4 parsing:

| Boundary Type | Heuristic Silence | Basis |
|:--------------|:------------------|:------|
| Between different speakers (speaker change) | 800ms | M2 spec estimate -- Fernando "cuts at midpoint" |
| Within same speaker (continuation) | 400ms | Half of speaker-change silence |
| Scene change | 1200ms | Longer pause for narrative transition |
| After stage direction | 200-600ms (variable) | Depends on direction content |

**WARNING:** These heuristics are estimates only (confidence 50%). Do NOT treat them as final. They are placeholders until Layer 2 data is available.

**Layer 2: Fernando's Creative Edit (Ground truth -- requires Fernando MP4)**

After TTS generation, Fernando watches the assembled episode and adjusts timing in his audio editor. His edits are the creative truth for silence durations. Recovery process:

1. Fernando exports MP4 (ES) with his timing adjustments embedded
2. `fernando_stt_reconciler.py` (#16) runs Whisper STT on Fernando's audio
3. STT produces per-utterance timestamps (start_seconds, end_seconds)
4. Gap between utterance N end and utterance N+1 start = actual silence duration
5. These actual durations replace Layer 1 heuristics
6. All 16 language dubs use Fernando's actual silence durations as their template

**Layer 3: Automated Learning (Future -- Phase 2+)**

After processing 10+ episodes with Fernando's edits:
- Build a regression model: scene_type + speaker_change + dialogue_length -> silence_duration
- Train on Fernando's actual decisions from Layer 2 data
- Eventually reduce Fernando's manual work to exception-only review

**What is BLOCKED:**
- `tts_post_silence.py` (#5) cannot be fully implemented until Q7 is filled (Fernando's exact silence rule)
- The Manual Dub CSV format (for injecting silence timestamps into ElevenLabs) is not documented in the KB
- Both blockers are resolvable with human action (interview Fernando, contact ElevenLabs)

**What is NOT blocked:**
- Layer 1 heuristic can be implemented in `docx_parser.py` today
- `fernando_stt_reconciler.py` framework can be built today (testing requires Fernando's MP4)
- All other scripts proceed without silence data (they consume it but don't produce it)

**Confidence:** 50% for Layer 1 heuristic (unvalidated estimate). 85% for Layer 2 recovery (depends on Whisper STT accuracy on Fernando's audio). 0% for Layer 3 (requires training data that does not exist yet).

---

## 3. Architecture Decisions

### 3.1 Four-Layer SSOT Architecture

**Problem:** The specs say Fernando's MP4 is the "UNICA fuente de verdad." This is true for what audiences hear. But an automated pipeline needs structured, queryable data.

**Solution:** Four complementary SSOT layers, each authoritative for its data type:

| Layer | Data Type | Source | Output File | Authoritative For |
|:------|:----------|:-------|:------------|:-----------------|
| 1 -- Text | Dialogue text, speaker names, scene structure | Docx Table 4 | `dialogue_objects.json` | What characters say |
| 2 -- Timing | Start/end seconds per dialogue, silence durations | Fernando MP4 via STT | `timing_objects.json` | When characters speak |
| 3 -- Voice | voice_id per character, persistence rules | ElevenLabs voice pool + rules | `manifest.json` | How characters sound |
| 4 -- Quality | WER scores, semantic similarity, human verdicts | QA pipeline | `qa_report.json` | Whether output is acceptable |

**Rule:** No downstream script reads the docx directly. All scripts consume parsed JSON from these 4 layers.

### 3.2 Guion Zombie Technical Control

**Problem:** Fernando can and does modify dialogues during post-production. These changes are not reflected back in the docx. If dubbing proceeds using stale dialogue_objects.json, all 16 language dubs are based on wrong text.

**Evidence:** Confirmed in 3 independent documents (POSTPROD_FERNANDO.md, DUBBING_SAUL_IVAN.md, 06_CORE_AUDIO_TTS.md S6.3).

**Solution:** `fernando_stt_reconciler.py` (#16) is a mandatory pre-dubbing gate:

```
fernando_stt_reconciler.py:
  INPUT:  Fernando MP4 (ES audio) + dialogue_objects.json
  STEP 1: Whisper STT on Fernando's audio -> extracted text per utterance
  STEP 2: Fuzzy diff: STT text vs dialogue_objects.json text
  STEP 3: Calculate WER between reference (docx) and hypothesis (STT)
  STEP 4: GATE DECISION:
    IF WER > 5%: BLOCK dubbing. Present diff to Alan/Ramon for resolution.
    IF WER <= 5%: PASS. Extract timing -> timing_objects.json (Layer 2 SSOT).
  OUTPUT: timing_objects.json + pass/fail gate + diff report
```

**This script is the pipeline linchpin** (confirmed unanimously by T8 Wave 2 and T10 Wave 3). Without it:
- Guion Zombie goes undetected
- No frame-accurate timing exists for Doge-Animator CSV
- Dubbing may proceed on stale text

### 3.3 ElevenLabs API Strategy

**Problem:** The specs reference "Voice Segments v3" as the M3 solution. This feature does not exist (confirmed by T9: 0 results in 735 KB entries).

**What actually exists in ElevenLabs:**

| Feature | Purpose | Reliability | KB Evidence |
|:--------|:--------|:------------|:------------|
| Dubbing Studio speaker separation | Automatic multi-speaker detection | UNRELIABLE (Saul: "different detection each time") | KB line 342 |
| Voiceover Studio | Manual multi-track, multi-speaker control | RELIABLE (but requires manual setup) | KB line 140 |
| Track clone / Clip clone | Voice consistency within tracks | RELIABLE | KB line 169 |
| Pronunciation dictionaries | Glossary/DNT protection | AVAILABLE | API endpoint confirmed |
| Forced alignment | Timing verification | AVAILABLE | API endpoint confirmed |
| Manual Dub CSV | Silence injection via timestamps | UNKNOWN FORMAT | 0 results in KB |

**Tiered API strategy:**

| Tier | Approach | When to Use | Cost |
|:-----|:---------|:------------|:-----|
| Primary | Voiceover Studio API + manifest.json voice assignments | Default for all episodes | Included in EL plan |
| Fallback | ffmpeg split/merge by speaker boundaries | If Voiceover Studio unavailable or unreliable | 0 (local processing) |
| Last resort | Single-language TTS + human dubbers | If EL API fails completely | 5-10x cost increase |

**Decision required:** Test Voiceover Studio with 1 pilot scene before committing to architecture. See Section 5.

### 3.4 QA Tiering and Cost Model

**Problem:** 100% human review of 16 languages is prohibitive.

**Solution (validated by T9):**

| Tier | Languages | Review Type | WER Target | Cost/Episode |
|:-----|:----------|:------------|:-----------|:-------------|
| 1 | ES, EN, PT-BR, FR, DE | 100% human review + automated metrics | < 5% | ~$40-50 |
| 2 | AR, KO, JA, HI, ZH | Automated metrics + 10% intelligent sampling | < 10% | ~$15-20 |
| 3 | IT, PL, RU, TR, FIL, ID, remaining | Automated only + monthly random audit | < 15% | ~$5-10 |

**QA Tools (selected and validated by T10):**

| Tool | Purpose | License | Status |
|:-----|:--------|:--------|:-------|
| jiwer | WER calculation | Apache 2.0 | SELECTED -- install now |
| sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2) | Semantic similarity / BERTScore | Apache 2.0 | SELECTED |
| Whisper (local) | STT for Tier 2/3 WER validation | MIT | SELECTED |
| ElevenLabs STT | STT for Tier 1 dual-consensus | API | SELECTED |
| COMET | MT quality evaluation | Apache 2.0 | DEFERRED to Phase 2 |

**Tier 2 sampling formula:**
```
review_score = wer * 0.4 + (1 - bertscore) * 0.3 + speaker_importance * 0.2 + language_difficulty * 0.1
SAMPLE for human review IF: review_score > 0.3
FORCE human review IF: wer > 0.15 OR category_a_flag > 0
BLOCK publication IF: category_a_flag > 0
```

---

## 4. 18-Script Implementation Roadmap

### 4.1 Complete Script Inventory

| # | Script | Purpose | Effort | Status | Blocked By |
|:--|:-------|:--------|:-------|:-------|:-----------|
| 1 | `docx_parser.py` | Parse docx Table 4 + Table 2 -> dialogue_objects.json | 4h | READY | Nothing |
| 2 | `glossary_sanitizer.py` | M4 regex fix + M5 DNT tags + blacklist pre-scan | 2h | READY | Nothing |
| 3 | `voice_mapper.py` | Speaker -> voice_id mapping -> manifest.json | 3h | READY | #1 output |
| 4 | `tts_batch.py` | ElevenLabs TTS API batch processing + caching | 6h | READY | #3 output |
| 5 | `tts_post_silence.py` | Enforce silence durations between dialogues | 4h | BLOCKED | Q7 + CSV format |
| 6 | `tts_multi_speaker_merge.py` | Multi-speaker audio merge (M3 mitigation) | 5h | BLOCKED | Q8 + architecture decision |
| 7 | `qc_validation.py` | WER + BERTScore + speaker consistency metrics | 4h | READY (partial) | Tool install |
| 8 | `qc_human_reviewer.py` | Tier 1 human review workflow/assignment tool | 3h | SEQUENTIAL | #7 output |
| 9 | `dubbing_orchestrator.py` | Orchestrate ES->EN->15 languages, tiered | 6h | SEQUENTIAL | #3 + #16 gate |
| 10 | `dubbing_batch.py` | Per-language dubbing via EL API | 6h | SEQUENTIAL | #9 output |
| 11 | `doge_animator_bridge.py` | CSV + audio export for Doge-Animator CEP panel | 4h | SEQUENTIAL | #16 timing + #10 audio |
| 12 | `lip_sync_rhubarb.py` | Rhubarb phoneme data generation for lip-sync | 3h | SEQUENTIAL | #11 output |
| 13 | `preflight_check.py` | Validate all dependencies before pipeline run | 2h | READY | Nothing |
| 14 | `postflight_report.py` | Aggregate metrics + archive results | 2h | READY | Nothing |
| 15 | `monitoring_alerts.py` | Logging + threshold alerts | 2h | READY | Nothing |
| 16 | `fernando_stt_reconciler.py` | Whisper STT on Fernando MP4 + Guion Zombie gate + timing extraction | 5h | READY (framework) | Fernando MP4 for testing |
| 17 | `blacklist_generator.py` | Generate blacklists for 14 missing languages via LLM | 3h | READY | Nothing |
| 18 | `ffmpeg_merger.py` | M3 fallback: split/merge audio by speaker via ffmpeg | 3h | READY | Nothing |

**Summary:** 9 READY now, 7 SEQUENTIAL (after dependencies), 2 BLOCKED (Q7/Q8).

### 4.2 Dependency Graph

```
docx_parser.py (#1) -------- FOUNDATION
  |-- glossary_sanitizer.py (#2) [can run parallel with #3]
  |-- voice_mapper.py (#3) [can run parallel with #2]
  |     |-- tts_batch.py (#4)
  |     |     |-- tts_post_silence.py (#5) [BLOCKED: Q7]
  |     |     |-- tts_multi_speaker_merge.py (#6) [BLOCKED: Q8]
  |     |     |-- qc_validation.py (#7)
  |     |           |-- qc_human_reviewer.py (#8)
  |     |
  |     |-- dubbing_orchestrator.py (#9) [requires #16 gate]
  |           |-- dubbing_batch.py (#10)
  |                 |-- doge_animator_bridge.py (#11) [requires #16 timing]
  |                       |-- lip_sync_rhubarb.py (#12)
  |
  |-- fernando_stt_reconciler.py (#16) [parallel track, needs Fernando MP4 for test]

preflight_check.py (#13)     [independent -- build anytime]
postflight_report.py (#14)   [independent -- build anytime]
monitoring_alerts.py (#15)   [independent -- build anytime]
blacklist_generator.py (#17) [independent -- build anytime]
ffmpeg_merger.py (#18)       [independent -- build anytime]
```

### 4.3 Wave Execution Plan

**WAVE A: Foundation (Day 1-2, no blockers)**

| Worker 1 | Worker 2 |
|:---------|:---------|
| docx_parser.py (#1) -- 4h | glossary_sanitizer.py (#2) -- 2h |
| voice_mapper.py (#3) -- 3h | blacklist_generator.py (#17) -- 3h |
| Buffer/testing -- 1h | ffmpeg_merger.py (#18) -- 3h |

Gate: docx_parser must detect 19 characters, parse 13 scenes, miss 0 dialogues.

**WAVE B: Core TTS + QA Tooling (Day 2-3, requires Wave A)**

| Worker 1 | Worker 2 |
|:---------|:---------|
| tts_batch.py (#4) -- 6h | qc_validation.py (#7 partial) -- 4h |
| preflight_check.py (#13) -- 2h | fernando_stt_reconciler.py (#16 framework) -- 4h |

Gate: tts_batch must produce audio for 1 pilot scene with WER < 10%.

**WAVE C: Dubbing + Integration (Day 4-7, requires Wave A + Wave B + Fernando MP4)**

| Script | Effort | Depends On |
|:-------|:-------|:-----------|
| qc_human_reviewer.py (#8) | 3h | #7 output |
| dubbing_orchestrator.py (#9) | 6h | #3 + #16 gate + Fernando MP4 |
| dubbing_batch.py (#10) | 6h | #9 output |
| doge_animator_bridge.py (#11) | 4h | #16 timing + #10 audio |
| lip_sync_rhubarb.py (#12) | 3h | #11 output |

Gate: EN dubbing must pass Tier 1 human review before other languages proceed.

**WAVE D: Monitoring + Polish (Day 7-10, parallel with Wave C)**

| Script | Effort |
|:-------|:-------|
| postflight_report.py (#14) | 2h |
| monitoring_alerts.py (#15) | 2h |
| Integration testing (end-to-end pilot) | 8h |

**BLOCKED (unblocked when Q7/Q8 filled):**

| Script | Blocked By | Unblocked When |
|:-------|:-----------|:---------------|
| tts_post_silence.py (#5) | Q7 empty + Manual Dub CSV format unknown | Q7 filled AND CSV format obtained from ElevenLabs |
| tts_multi_speaker_merge.py (#6) | Q8 empty + architecture decision | Q8 filled AND Voiceover Studio tested |

---

## 5. User Decisions Required

### DECISION 1: ElevenLabs API Tier (Must decide after research item completes)

**Context:** The specs reference "Voice Segments v3" which does not exist. The real options are:

| Option | Description | Pros | Cons |
|:-------|:-----------|:-----|:-----|
| A (Recommended) | Voiceover Studio API + ffmpeg fallback | Reliable multi-track control; ffmpeg as safety net | Requires per-dialogue project setup |
| B (Cautious) | Manual Dub CSV + engineering time | Direct timestamp control | CSV format is unknown; may require EL support |
| C (Risky) | Single-language TTS + human dubbers for 16 languages | No API dependency | 5-10x cost, +4 weeks timeline |

**Action needed:** Test Voiceover Studio with 1 pilot scene (1-2 hours). Contact ElevenLabs for CSV format spec (async). Then decide.

**Impact:** Affects scripts #4, #6, #9, #10 implementation.

### DECISION 2: QA Budget Allocation

**Context:** Full QA for all tiers costs ~$60-80/episode. Current process only reviews EN.

| Option | Tier 1 (5 langs) | Tier 2 (5 langs) | Tier 3 (7 langs) | Total/Episode |
|:-------|:-----------------|:-----------------|:-----------------|:-------------|
| A (Recommended) | 100% human ($40-50) | 10% sampling ($15-20) | Automated only ($5-10) | ~$60-80 |
| B (Budget) | EN only 100%, others spot-check ($20-25) | Automated only ($5-10) | Automated only ($5-10) | ~$30-45 |
| C (Premium) | 100% human all ($40-50) | 30% sampling ($25-30) | 10% sampling ($15-20) | ~$80-100 |

**Action needed:** Choose option before Wave C starts (QA scripts need to know tier thresholds).

### DECISION 3: Doge-Animator FPS Parameter

**Context:** The specs assume 55 FPS throughout. But After Effects compositions can run at 24, 30, or 55 FPS. Hardcoding 55 will break timing for non-standard compositions.

| Option | Description |
|:-------|:-----------|
| A (Recommended) | `doge_animator_bridge.py` accepts FPS as a parameter. Default 55, but configurable per project. |
| B (Fixed) | Hardcode 55 FPS. Requires all AE compositions to match. |

**Action needed:** Confirm with Helmut/animators what FPS their compositions actually use. This is a low-effort decision but must be made before script #11.

---

## 6. Quick Wins (Start Today)

These scripts have zero blockers. All specs are complete. All tools are selected.

### Priority Order (by value/effort ratio):

| Rank | Script | Effort | Impact | Unblocks |
|:-----|:-------|:-------|:-------|:---------|
| 1 | `docx_parser.py` (#1) | 4h | Foundation for ALL 17 other scripts | Everything |
| 2 | `glossary_sanitizer.py` (#2) | 2h | Fixes M4 (no. bug) + M5 (DNT protection) | Clean text for TTS |
| 3 | `voice_mapper.py` (#3) | 3h | Produces manifest.json -- unblocks TTS and dubbing | #4, #9, #10 |
| 4 | `blacklist_generator.py` (#17) | 3h | Completes M5 for all 16 languages (14 missing) | Production-ready blacklists |
| 5 | `ffmpeg_merger.py` (#18) | 3h | M3 fallback safety net (eliminates Voice Segments v3 risk) | Risk reduction |
| 6 | `preflight_check.py` (#13) | 2h | Pipeline validation before each run | Operational safety |
| 7 | `qc_validation.py` (#7 partial) | 4h | WER + BERTScore metrics (silence metric deferred) | QA gate |
| 8 | `tts_batch.py` (#4) | 6h | Core TTS generation via ElevenLabs API | All audio output |

**Total quick wins:** 27 hours / 3.5 person-days with 1 developer, or 2.5 days with 2 developers in parallel.

### Recommended Day 1 Assignment:

**Developer 1:**
- 08:00 - 12:00: docx_parser.py (#1) -- 4h
- 13:00 - 16:00: voice_mapper.py (#3) -- 3h
- 16:00 - 17:00: Buffer/testing -- 1h

**Developer 2:**
- 08:00 - 10:00: glossary_sanitizer.py (#2) -- 2h
- 10:00 - 13:00: blacklist_generator.py (#17) -- 3h
- 14:00 - 17:00: ffmpeg_merger.py (#18) -- 3h

---

## 7. Risk Matrix

### Ranked by (Severity x Probability)

| # | Risk | Severity | Probability | Mitigation | Effort |
|:--|:-----|:---------|:------------|:-----------|:-------|
| 1 | Q7/Q8 interviews delayed beyond 1 week | CRITICAL | MEDIUM | Start Waves A-D without them; only scripts #5 and #6 are actually blocked | 0h (process) |
| 2 | "Voice Segments v3" phantom feature | HIGH | CONFIRMED | Already mitigated: renamed to Voiceover Studio + ffmpeg fallback (#18) | 3h (code exists) |
| 3 | Manual Dub CSV format unknown | HIGH | CONFIRMED | Contact ElevenLabs support (async); implement heuristic silence as fallback | 0h (async) + 2h (fallback) |
| 4 | Guion Zombie undetected | HIGH | MEDIUM | fernando_stt_reconciler.py (#16) with 5% WER threshold gate | 5h |
| 5 | Doge-Animator FPS mismatch | HIGH | MEDIUM | Parameterize FPS in doge_animator_bridge.py; confirm with animators | 0.5h |
| 6 | Docx format inconsistency across episodes | MEDIUM | LOW | Add validation + error reporting in docx_parser.py; test with 2nd docx when available | +1h |
| 7 | ElevenLabs API rate limits during 16-language batch | MEDIUM | LOW | Implement exponential backoff + batch queueing in tts_batch.py | +2h |
| 8 | Tier 3 QA silent failures (7 languages, no human review) | MEDIUM | MEDIUM | Automated sanity checks (WER > 0.15 = alert) + monthly random audit | 2h |
| 9 | Blacklist incomplete for 14 languages | MEDIUM | CONFIRMED | blacklist_generator.py (#17) with LLM + human review for Tier 1 | 3h (quick win) |
| 10 | UTF-8 encoding corruption in docx | LOW | CONFIRMED | chardet detection + explicit UTF-8 handling in docx_parser.py | +0.5h |

### Top 3 Highest-ROI Mitigations

1. **Build fernando_stt_reconciler.py (#16)** -- Mitigates risks #4 and #5 simultaneously. 5h effort, eliminates 2 HIGH-severity risks.
2. **Build ffmpeg_merger.py (#18)** -- Mitigates risk #2 (phantom feature). 3h effort, provides production-ready safety net for M3.
3. **Build blacklist_generator.py (#17)** -- Mitigates risk #9. 3h effort, completes M5 for all 16 languages.

---

## 8. Budget and Timeline

### Development Effort

| Category | Scripts | Hours | Person-Days |
|:---------|:--------|:------|:------------|
| Wave A (Foundation) | #1, #2, #3, #17, #18 | 15h | 2 |
| Wave B (Core TTS + QA) | #4, #7, #13, #16 | 17h | 2 |
| Wave C (Dubbing + Integration) | #8, #9, #10, #11, #12 | 22h | 3 |
| Wave D (Monitoring) | #14, #15 | 4h | 0.5 |
| Blocked (#5, #6) | After Q7/Q8 | 9h | 1 |
| Integration testing | End-to-end | 8h | 1 |
| **Total** | **18 scripts** | **75h** | **9.5** |

### Per-Episode Recurring Cost (After Pipeline Built)

| Item | Cost |
|:-----|:-----|
| ElevenLabs TTS (16 languages) | ~$5-10 |
| QA Tier 1 (5 languages, 100% human) | ~$40-50 |
| QA Tier 2 (5 languages, 10% sampling) | ~$15-20 |
| QA Tier 3 (7 languages, automated) | ~$5-10 |
| **Total per episode** | **~$65-90** |

### Timeline (Pilot Episode)

| Day | Activity | Deliverable |
|:----|:---------|:-----------|
| 1-2 | Wave A: Foundation scripts (2 developers) | dialogue_objects.json + manifest.json + blacklists |
| 2-3 | Wave B: TTS + QA scripts (2 developers) | Spanish TTS audio + WER baseline |
| 1-3 | PARALLEL: Fill Q7/Q8 + EL research (human actions) | Silence rule + CSV format + Voiceover Studio test |
| 3-4 | Decision point: EL API tier + QA budget | Architecture locked |
| 4-7 | Wave C: Dubbing + integration | 16-language dubbed audio + Doge-Animator CSV |
| 7-10 | Wave D: Monitoring + integration testing | End-to-end pilot validated |
| 10-15 | Buffer: Bug fixes, edge cases, documentation | Pilot episode complete |

**Total: 15 calendar days for pilot episode delivery** (assumes 2 developers + human interview completion by Day 3).

---

## 9. Success Criteria for Pilot Episode

The pilot episode is complete when ALL of the following are true:

| # | Criterion | Measurement | Threshold |
|:--|:----------|:------------|:----------|
| 1 | Docx parsed correctly | 19 characters detected, 13 scenes parsed, 0 missed dialogues | 100% |
| 2 | Spanish TTS generated | All dialogue lines have audio files in output/ | 100% |
| 3 | Silences applied | Fernando validates silence durations match his creative intent | Fernando sign-off |
| 4 | Guion Zombie check passes | fernando_stt_reconciler.py WER between docx and Fernando MP4 | <= 5% |
| 5 | EN dubbing quality | WER for English dub | < 5% |
| 6 | Tier 1 languages quality | WER for PT-BR, FR, DE | < 5% |
| 7 | Tier 2 languages quality | WER for AR, KO, JA, HI, ZH | < 10% |
| 8 | Tier 3 languages quality | WER for remaining languages | < 15% |
| 9 | Zero Category A violations | No blocked terms in any language output | 0 flags |
| 10 | Doge-Animator CSV loads | CSV + audio splits load in CEP panel without errors | 0 errors |
| 11 | Voice consistency | Same character has same voice across all 16 languages | manifest.json enforced |
| 12 | Speaker consistency metric | qc_validation speaker_consistency score | > 95% |

---

## 10. Appendix: Wave Audit Trail

### Wave 1: Discovery (2026-02-19)

- **Scope:** 4 parallel explorers mapped entire codebase
- **Output:** `WAVE_1_DISCOVERY_REPORT.json` (34 KB), `WAVE_1_EXECUTIVE_SUMMARY.md`
- **Key finding:** 0 scripts implemented, 8 tables in docx, 735 KB entries, Q7/Q8 empty

### Wave 2: Deep Analysis (2026-02-19)

- **Scope:** 3 parallel analysts (T6 Data Structure, T7 Gap Analysis, T8 SSOT)
- **Output:** `WAVE_2_T6_DATA_STRUCTURE_MAPPING.md`, `WAVE_2_T7_GAP_ANALYSIS_MATRIX.md`, `WAVE_2_T8_SSOT_CROSSREFERENCE.md`, `WAVE_2_CONSOLIDATED_REPORT.md`
- **Key findings:** Table 4 structure confirmed (8 cols not inline bold), Script #16 identified (new), 4-layer SSOT architecture proposed, Guion Zombie confirmed

### Wave 3: Audit (2026-02-19)

- **Scope:** 2 Opus auditors (T9 Translation/Speaker, T10 Architecture)
- **Output:** `WAVE_3_T9_TRANSLATION_AUDIT.md`, `WAVE_3_T10_ARCHITECTURE_AUDIT.md`, `WAVE_3_CONSOLIDATED_AUDIT.md`
- **Key findings:** Voice Segments v3 phantom confirmed, QA cost corrected ($40-50 not $2), 18 scripts total (3 new), tool selection finalized, 27h quick wins estimated

### Wave 4: Final Synthesis (2026-02-19)

- **Scope:** 1 Opus coordinator synthesized all prior waves
- **Output:** This document (`PRD_FINAL.md`)
- **Key deliverable:** 3 critical questions answered with implementation detail, actionable 18-script roadmap, user decisions identified, quick wins prioritized

### Corrections Applied Across Waves

| Wave | Original Assumption | Corrected To | Correction Source |
|:-----|:--------------------|:-------------|:------------------|
| W1 | 15 scripts in pipeline | 18 scripts | T10 (Wave 3) |
| W1 | Docx uses inline bold markers | Docx uses TABLE structure | T8 (Wave 2) |
| W2 | Quick wins = 22h | Quick wins = 27h | T10 (Wave 3) |
| W2 | Voice Segments v3 is pending from EL | Voice Segments v3 does not exist | T9 (Wave 3) |
| W2 | QA Tier 1 ~$2/episode | QA Tier 1 ~$40-50/episode | T9 (Wave 3) |
| W2 | tts_batch.py = 4h | tts_batch.py = 6h (cache + error handling) | T10 (Wave 3) |
| W3 | 55 FPS hardcoded | FPS must be parameterized | T10 (Wave 3) |

---

## Immediate Action Items (Next 48 Hours)

### P0 -- Start Today

| # | Action | Owner | Effort | Unblocks |
|:--|:-------|:------|:-------|:---------|
| 1 | Begin coding docx_parser.py (#1) | Backend Developer 1 | 4h | ALL scripts |
| 2 | Begin coding glossary_sanitizer.py (#2) | Backend Developer 2 | 2h | M4 + M5 mitigation |
| 3 | Schedule Q7 interview with Fernando | Iris/Daniel (ops) | 1h interview | Script #5, silence algorithm |
| 4 | Schedule Q8 interview with Saul/Ivan | Iris/Daniel (ops) | 1h interview | Script #6, M3 architecture |
| 5 | Install QA tooling: `pip install jiwer sentence-transformers python-docx chardet pydub` | Backend | 30min | QA pipeline |

### P1 -- This Week

| # | Action | Owner | Effort | Unblocks |
|:--|:-------|:------|:-------|:---------|
| 6 | Contact ElevenLabs: Manual Dub CSV format + Voiceover Studio API status | Backend/Ops | Async | M2 implementation |
| 7 | Test ElevenLabs Dubbing API with 1 pilot scene | Backend | 2h | Speaker separation validation |
| 8 | Test Voiceover Studio for multi-speaker control | Backend | 1h | M3 architecture decision |
| 9 | Build voice_mapper.py (#3) | Backend Developer 1 | 3h | TTS + dubbing |
| 10 | Build blacklist_generator.py (#17) + ffmpeg_merger.py (#18) | Backend Developer 2 | 6h | M5 + M3 fallback |
| 11 | Confirm Doge-Animator FPS with animators | Helmut/Alex | 30min | Script #11 parameter |

### Decisions Needed Before Wave C

| Decision | Options | Impact | Deadline |
|:---------|:--------|:-------|:---------|
| EL API Tier | A (Voiceover Studio) / B (CSV) / C (Human dubbers) | Scripts #4, #6, #9, #10 | Day 3 |
| QA Budget | A ($60-80/ep) / B ($30-45/ep) / C ($80-100/ep) | Scripts #7, #8 thresholds | Day 3 |
| FPS Parameter | A (Configurable, default 55) / B (Fixed 55) | Script #11 | Day 4 |

---

**End of PRD. Ready for Daniel's review and approval.**

*Generated by Wave 4 Coordinator | 2026-02-19 | Synthesis of Waves 1-4 (8 analyst reports)*
