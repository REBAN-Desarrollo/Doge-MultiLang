# WAVE 3 -- T10: Architecture and Implementation Readiness Audit

**Auditor:** T10 -- Architecture and Implementation Specialist
**Date:** 2026-02-19
**Status:** COMPLETE
**Confidence:** 0.90

---

## 1. Script Dependency Chain Validation

### Validated Order (16 scripts total)

Verified against Wave 2 consolidated report, T6 data flow diagram, and T7 gap analysis. The dependency chain has been audited for circular dependencies (none found) and missing links.

```
WAVE A (Pre-requisites) -- NO external blockers:
  1. docx_parser.py          <- Foundation: parses Table 4 (13 rows x 8 cols) + Table 2 (19 rows x 5 cols)
  2. glossary_sanitizer.py   <- Input: raw text from docx_parser | M4 + M5 mitigation
  3. voice_mapper.py         <- Input: character list from docx_parser + EL voice pool

  VALIDATION: All 3 scripts have COMPLETE specs. No external data needed.
  GATE: docx_parser must pass (19 chars detected, 13 scenes, 0 missed dialogues)
        before scripts #2 and #3 can validate their output.
  PARALLELIZATION: #2 and #3 CAN run in parallel after #1 passes gate.

WAVE B (Core TTS) -- Requires Wave A:
  4. tts_batch.py            <- Input: voice_mapper manifest + sanitized text
  5. tts_post_silence.py     <- BLOCKED by Q7 (silence duration rule unknown)
  6. tts_multi_speaker_merge.py <- BLOCKED by Q8 + EL architecture decision

  VALIDATION: #4 is UNBLOCKED. #5 and #6 are hard-blocked.
  CORRECTION: #4 can start after Wave A completes. #5 and #6 do NOT block #4.

WAVE B+ (New Critical Script) -- Can run in parallel with Wave A:
  16. fernando_stt_reconciler.py <- Input: Fernando MP4 (ES) + dialogue_objects.json from #1
                                   Output: timing_objects.json (Layer 2 SSOT) + Guion Zombie gate

  VALIDATION: Fully specced in T8 output. Depends on docx_parser output (#1) + Fernando MP4 file.
  IMPORTANT: Can START coding the framework NOW; only TESTING requires Fernando MP4.

WAVE C (Quality Assurance) -- Requires Wave B output:
  7. qc_validation.py        <- Input: TTS audio from #4 | Tools: jiwer + sentence-transformers
  8. qc_human_reviewer.py    <- Input: qc_validation report from #7

  VALIDATION: #7 can be built PARTIALLY now (WER + COMET metrics).
  Silence accuracy metric deferred until Q7 resolves.
  #8 is a workflow tool (generates review assignments), not algorithmically complex.

WAVE D (Dubbing Orchestration) -- Requires Wave A + Wave B+ + Fernando MP4:
  9.  dubbing_orchestrator.py <- Orchestrates ES->EN->15 languages, tiered
  10. dubbing_batch.py        <- Per-language dubbing via EL API

  VALIDATION: Both require manifest.json (#3) + timing_objects.json (#16) + Fernando MP4.
  CRITICAL GATE: fernando_stt_reconciler (#16) MUST pass before dubbing starts.

WAVE E (Doge-Animator Integration) -- Requires Wave D output:
  11. doge_animator_bridge.py <- Input: timing.json (#16) + dubbed audio (#10) -> CSV for CEP panel
  12. lip_sync_rhubarb.py     <- Input: per-speaker audio -> Rhubarb phoneme data

  VALIDATION: #11 REQUIRES timing_objects.json from #16. Without it: no start_frame/end_frame.
  #12 requires per-speaker audio files, which come from #10.

WAVE F (Monitoring) -- Can build anytime:
  13. preflight_check.py      <- Validates all dependencies before pipeline run
  14. postflight_report.py    <- Aggregates metrics + archives
  15. monitoring_alerts.py    <- Prometheus/logging + threshold alerts

  VALIDATION: Pure validation/reporting logic. No external dependencies.
  Can be built in parallel with ANY wave.
```

### Dependency Graph (Verified, No Cycles)

```
docx_parser.py (#1)
  |-- glossary_sanitizer.py (#2) [parallel]
  |-- voice_mapper.py (#3)       [parallel]
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
  |-- fernando_stt_reconciler.py (#16) [parallel track]

preflight_check.py (#13)     [independent]
postflight_report.py (#14)   [independent]
monitoring_alerts.py (#15)   [independent]
```

### Critical Finding: Script #16 Placement

**CONFIRMED:** Script #16 (`fernando_stt_reconciler.py`) is the linchpin of the pipeline. It:
1. Provides Layer 2 SSOT (timing data) for ALL downstream scripts
2. Gates the Guion Zombie check (no dubbing without passing)
3. Provides frame-accurate data for Doge-Animator CSV generation

**REVISED WAVE ORDER (validated):**

| Wave | Scripts | Can Start | Depends On |
|:-----|:--------|:----------|:-----------|
| A | #1, #2, #3 | NOW | Nothing |
| B | #4 | After Wave A gate | Wave A output |
| B+ | #16 | After #1 (framework), Fernando MP4 (testing) | #1 output + external file |
| C | #7 (partial), #8 | After #4 | Wave B output |
| D | #9, #10 | After #3 + #16 gate + Fernando MP4 | Wave A + B+ |
| E | #11, #12 | After #10 + #16 timing | Wave D output |
| F | #13, #14, #15 | Anytime | None (pure logic) |
| BLOCKED | #5, #6 | After Q7/Q8 filled | Q7, Q8 |

---

## 2. Quick Wins Audit (Implementable in < 1 Day)

### Ranked by Value/Effort Ratio

| Rank | Script | Effort | Blockers | Impact | Dependencies | Verdict |
|:-----|:-------|:-------|:---------|:-------|:-------------|:--------|
| 1 | **glossary_sanitizer.py** (#2) | 2h | NONE | Fixes M4 (no. bug) + M5 (blacklist pre-scan). Every downstream script benefits from clean text. | Needs docx_parser output for testing, but logic is independent | BUILD NOW |
| 2 | **docx_parser.py** (#1) | 4h | NONE | Foundation for ALL 15 other scripts. Fully specced: Table 4 (8 cols), Table 2 (5 cols), UTF-8 fix, scene boundary carry-forward. | python-docx library | BUILD NOW |
| 3 | **blacklist_generator.py** (NEW) | 3h | NONE | Completes M5 for all 17 languages. Generates 14 missing blacklist files using LLM + CoVe prompt. | Claude/GPT API access | BUILD NOW (parallel with #1) |
| 4 | **ffmpeg_merger.py** (NEW) | 3h | NONE | Provides M3 fallback: split/merge audio by speaker using ffmpeg. Safety net if Voiceover Studio approach fails. | ffmpeg binary | BUILD NOW (parallel with #1) |
| 5 | **voice_mapper.py** (#3) | 3h | docx_parser (#1) | Produces manifest.json. Unblocks TTS (#4), dubbing (#9, #10). | ElevenLabs voice list API | BUILD AFTER #1 |
| 6 | **preflight_check.py** (#13) | 2h | NONE | Pure validation logic. Catches missing files/configs before pipeline run. | None | BUILD ANYTIME |
| 7 | **qc_validation.py** (#7 partial) | 4h | Tool selection (jiwer) | WER + COMET metrics. Gates dubbing quality. Silence metric deferred. | jiwer, sentence-transformers | BUILD AFTER tool install |
| 8 | **tts_batch.py** (#4) | 6h | voice_mapper (#3) | Core TTS generation. Calls ElevenLabs API per dialogue. Cache design included. | ElevenLabs API key + voice_mapper output | BUILD AFTER #3 |

### Effort Summary

| Category | Scripts | Total Hours |
|:---------|:--------|:------------|
| Quick wins (no blockers) | #1, #2, blacklist_gen, ffmpeg_merger, #13 | 14h |
| Quick wins (sequential) | #3, #7 partial, #4 | 13h |
| **Total quick wins** | **8 scripts** | **27h (~3.5 person-days)** |

**CORRECTION to Wave 2 prompt:** The prompt estimated "22 hours (2.5 person-days)." This was underestimated because it omitted the blacklist_generator and ffmpeg_merger scripts, and underestimated tts_batch.py complexity. Corrected estimate: 27 hours (3.5 person-days).

### Parallel Execution Plan

```
DAY 1 (8h):
  Worker 1: docx_parser.py (#1) [4h] -> voice_mapper.py (#3) [3h] -> buffer [1h]
  Worker 2: glossary_sanitizer.py (#2) [2h] -> blacklist_generator.py [3h] -> ffmpeg_merger.py [3h]

DAY 2 (8h):
  Worker 1: tts_batch.py (#4) [6h] -> preflight_check.py (#13) [2h]
  Worker 2: qc_validation.py (#7 partial) [4h] -> fernando_stt_reconciler.py (#16 framework) [4h]

DAY 3 (4h):
  Worker 1: Integration testing (all Wave A scripts end-to-end with pilot docx)
  Worker 2: Integration testing (QC pipeline with synthetic test data)

TOTAL: 2.5 days with 2 workers = 20h effective parallel time
```

---

## 3. API/Framework Selection Audit

### WER Calculation

| Option | Library | License | Size | Multilingual | Verdict |
|:-------|:--------|:--------|:-----|:-------------|:--------|
| A | **jiwer** | Apache 2.0 | 8KB | Yes (text-level, language-agnostic) | SELECTED |
| B | SacreBLEU | Apache 2.0 | 50KB | Yes | Not selected -- BLEU less relevant than WER for TTS validation |
| C | Custom implementation | N/A | N/A | N/A | Not selected -- reinventing the wheel |

**Rationale:** jiwer is the standard for WER in speech recognition evaluation. It computes WER, MER, WIL, and CER. Perfect for comparing STT output against reference text. Apache 2.0 license is compatible with any deployment.

### Semantic Similarity (BERTScore)

| Option | Library | License | Size | Multilingual | Verdict |
|:-------|:--------|:--------|:-----|:-------------|:--------|
| A | **sentence-transformers** | Apache 2.0 | ~500MB (with model) | Yes (paraphrase-multilingual-MiniLM-L12-v2) | SELECTED |
| B | COMET | Apache 2.0 | ~1.5GB | Yes (MT-specialized) | Deferred to Phase 2 |
| C | OpenAI embeddings | Proprietary | API call | Yes | Not selected -- unnecessary cost + vendor lock-in |

**Rationale:** sentence-transformers with `paraphrase-multilingual-MiniLM-L12-v2` model supports 50+ languages, produces embeddings that can compute cosine similarity (BERTScore proxy). The model is 420MB, acceptable for server deployment. COMET is more accurate for MT evaluation but heavier; defer to Phase 2 if sentence-transformers proves insufficient.

### STT for WER Validation

| Option | Tool | Cost | Multilingual | Verdict |
|:-------|:-----|:-----|:-------------|:--------|
| A | **Whisper (local)** | Free | Yes (99 languages) | SELECTED for Tier 2/3 |
| B | **ElevenLabs STT** | API cost (~$0.06/min) | Yes (32 languages) | SELECTED for Tier 1 (dual STT consensus) |
| C | Deepgram | API cost | Yes | Not selected -- adds vendor |

**Rationale:** Whisper local is free and handles all 17 target languages. For Tier 1, use dual-STT consensus (Whisper + ElevenLabs STT) as specified in `07_CORE_MULTI_LANGUAGE.md` S4.1. For Tier 2/3, Whisper alone is sufficient.

### Automatic Sampling (Tier 2)

| Option | Approach | Cost | Complexity | Verdict |
|:-------|:---------|:-----|:-----------|:--------|
| A | **Heuristic sampling** | Free | Low | SELECTED for MVP |
| B | LLM-based confidence scoring | ~$0.05/episode | Medium | Deferred to Phase 2 |
| C | Random sampling | Free | None | Not selected -- wastes human review budget |

**Heuristic formula:**
```
review_score = wer * 0.4 + (1 - bertscore) * 0.3 + speaker_weight * 0.2 + lang_difficulty * 0.1
sample_if: review_score > 0.3
force_review_if: wer > 0.15 OR category_a_count > 0
```

### Audio Processing

| Tool | Purpose | Already Available | Verdict |
|:-----|:--------|:-----------------|:--------|
| **ffmpeg** | Audio splitting, merging, silence injection, format conversion | Standard system tool | SELECTED |
| **pydub** | Python wrapper for ffmpeg, simpler API for silence detection/injection | pip install | SELECTED as convenience layer |
| **python-docx** | Parse .docx tables | pip install | SELECTED (mandatory for docx_parser) |
| **chardet** | Detect encoding for UTF-8 fix | pip install | SELECTED (fallback for encoding issues) |

---

## 4. Doge-Animator Integration Audit

### Current State (from Wave 1 T3 analysis)

| Capability | Status | Evidence |
|:-----------|:-------|:---------|
| CEP Panel (AE extension) | ACTIVE -- 55+ FPS, 7 animators daily | WAVE_1_DISCOVERY_REPORT.json T3 |
| Audio import in CEP | NOT AVAILABLE | T3: "No audio file input in CEP panel" |
| Audio sync | MANUAL ONLY | T3: "Manual timing only" |
| Rhubarb lip-sync | DOCS EXIST, NOT CONNECTED | T3: "Rhubarb docs exist, not connected to panel" |
| Speaker identification | NOT IMPLEMENTED | T3 |

### What Doge-Animator Needs from Doge-MultiLang

| Input | Format | Source Script | Status |
|:------|:-------|:-------------|:-------|
| CSV per language | `scene_id, speaker, start_frame, end_frame, audio_path, language` | `doge_animator_bridge.py` (#11) | NOT BUILT |
| Audio per speaker per language | MP3/WAV files | `dubbing_batch.py` (#10) | NOT BUILT |
| Phoneme data per dialogue | Rhubarb .json | `lip_sync_rhubarb.py` (#12) | NOT BUILT |

### Timing Transformation Chain (Validated)

```
Fernando MP4 (ES audio)
  |-- [Whisper STT via fernando_stt_reconciler.py (#16)]
  |     Output: "dialogue_text" at 12.4s to 14.1s (seconds)
  |
  |-- [doge_animator_bridge.py (#11)]
  |     Frame calc: 12.4s x 55fps = frame 682
  |                 14.1s x 55fps = frame 776
  |     CSV row: ep1_sc03, Taro, 682, 776, /audio/es/ep1_sc03_dia042_taro_es.mp3, es
  |
  |-- [Doge-Animator CEP Panel]
        Loads CSV + audio for animation sync at 55+ FPS
```

**AUDIT VERDICT:** The chain is logically sound but ENTIRELY dependent on `fernando_stt_reconciler.py` (#16). Without it, there is ZERO frame-accurate timing data.

### Gap Analysis for Integration

| Gap | Severity | Resolution | Effort |
|:----|:---------|:-----------|:-------|
| No audio file receiver in CEP panel | HIGH | Requires CEP panel modification (Doge-Animator scope, not Doge-MultiLang) | EXTERNAL |
| CSV format not formally defined | MEDIUM | Define in `doge_animator_bridge.py` spec, validate with Doge-Animator team | 1h |
| Rhubarb not connected to CEP panel | MEDIUM | Requires CEP panel modification (Phase 2 per Doge-Animator roadmap) | EXTERNAL |
| Audio naming convention not standardized | LOW | Define: `{episode_id}_{scene_id}_{dialogue_id}_{speaker}_{lang}.mp3` | 0.5h |
| Frame rate assumption (55 FPS) not validated | LOW | Confirm with animators; may be 24, 30, or 55 depending on composition | 0.5h |

**CRITICAL FINDING:** The spec assumes 55 FPS throughout, but After Effects compositions can run at various frame rates. `doge_animator_bridge.py` MUST read the target FPS from the AE project or accept it as a parameter, not hardcode 55.

---

## 5. Risk Assessment

### Risk Matrix (Ordered by Severity x Probability)

| # | Risk | Severity | Probability | Impact | Mitigation | Effort |
|:--|:-----|:---------|:------------|:-------|:-----------|:-------|
| 1 | **Q7/Q8 delays beyond 1 week** | CRITICAL | MEDIUM (human dependency) | Blocks Scripts #5, #6; delays full QA compliance; cannot scale to 16 languages | Start Waves A-D in parallel without Q7/Q8; only #5 and #6 are actually blocked | 0h (process) |
| 2 | **Voice Segments v3 does not exist** | HIGH | CONFIRMED (T9 audit) | M3 has no primary solution; multi-speaker merge requires alternative | Implement Voiceover Studio approach + ffmpeg fallback NOW | 3h (ffmpeg) |
| 3 | **Doge-Animator timing misalignment** | HIGH | MEDIUM | Animation out of sync with dubbed audio across 16 languages | Build fernando_stt_reconciler.py (#16) as mandatory gate; do NOT hardcode 55 FPS | 5h |
| 4 | **Docx format inconsistency** | MEDIUM | LOW (only 1 docx analyzed) | Parser fails on other episodes with different table structure | Add docx_parser validation + error reporting; test with 2nd docx if available | +1h |
| 5 | **ElevenLabs API rate limits** | MEDIUM | LOW (Pro plan) | Batch TTS or dubbing requests throttled during 16-language processing | Implement exponential backoff + batch queueing in tts_batch.py | +2h |
| 6 | **Guion Zombie undetected** | HIGH | MEDIUM (Fernando edits confirmed) | Dubbing based on stale text; entire 16-language batch is wrong | fernando_stt_reconciler.py (#16) with 5% WER threshold gate | 5h |
| 7 | **Tier 3 QA silent failures** | MEDIUM | MEDIUM | Bad translations published for 7 languages without human review | Add automated sanity checks (WER > 0.15 = alert) + monthly random audit | 2h |
| 8 | **Manual Dub CSV format unknown** | HIGH | CONFIRMED (not in KB) | Cannot implement M2 automated silence injection | Contact ElevenLabs; implement heuristic silence as fallback | 0h (async) + 2h (fallback) |
| 9 | **Blacklist incomplete for 14 languages** | MEDIUM | CONFIRMED | Category A terms may pass to published content | Generate via LLM + human review for Tier 1 | 4h |
| 10 | **UTF-8 encoding corruption in docx** | LOW | CONFIRMED (T1 found "e -> ?") | Character names may not match, breaking cross-reference | chardet detection + explicit UTF-8 handling in docx_parser | +0.5h |

### Risk Heat Map

```
                    LOW PROBABILITY    MEDIUM PROBABILITY    HIGH PROBABILITY

CRITICAL SEVERITY:  [Docx format]      [Q7/Q8 delays]
HIGH SEVERITY:                         [Timing misalign]     [Voice Seg v3 phantom]
                                       [Guion Zombie]        [CSV format unknown]
MEDIUM SEVERITY:    [EL rate limits]   [Tier 3 QA]           [Blacklist incomplete]
                    [UTF-8 encoding]
```

### Top 3 Mitigations (Highest ROI)

1. **Build fernando_stt_reconciler.py (#16)** -- Mitigates risks #3 and #6 simultaneously. 5h effort, eliminates 2 HIGH-severity risks.
2. **Build ffmpeg_merger.py (NEW)** -- Mitigates risk #2 (Voice Segments v3 phantom). 3h effort, provides safety net for M3.
3. **Generate 14 blacklists via LLM** -- Mitigates risk #9. 4h effort, completes M5 for all languages.

---

## 6. New Scripts Identified (Not in Original 15)

| # | Script Name | Purpose | Effort | Priority |
|:--|:-----------|:--------|:-------|:---------|
| 16 | `fernando_stt_reconciler.py` | Whisper STT on Fernando MP4 + fuzzy diff + timing extraction | 5h | P0 |
| 17 | `blacklist_generator.py` | Generate blacklists for 14 missing languages via LLM | 3h | P1 |
| 18 | `ffmpeg_merger.py` | M3 fallback: split/merge audio by speaker via ffmpeg | 3h | P1 |

**Total scripts in pipeline: 18** (original 15 + 3 new)

---

## 7. Implementation Readiness Scorecard

| Script | Spec Complete | Data Available | Tools Selected | Blocker | Ready |
|:-------|:-------------|:--------------|:---------------|:--------|:------|
| #1 docx_parser.py | YES | YES (docx in repo) | python-docx, chardet | NONE | YES |
| #2 glossary_sanitizer.py | YES | YES (blacklists in repo) | regex, json | NONE | YES |
| #3 voice_mapper.py | YES | PARTIAL (need EL voice list) | EL API | NONE (API available) | YES |
| #4 tts_batch.py | YES | After #3 | EL TTS API | #3 output | SEQUENTIAL |
| #5 tts_post_silence.py | NO (Q7 empty) | NO | Unknown (CSV format) | Q7 + CSV format | BLOCKED |
| #6 tts_multi_speaker_merge.py | NO (Q8 empty) | NO | Unknown (architecture) | Q8 + EL research | BLOCKED |
| #7 qc_validation.py (partial) | PARTIAL | After #4 | jiwer, sentence-transformers | Tool install | SEQUENTIAL |
| #8 qc_human_reviewer.py | YES | After #7 | Workflow logic | #7 output | SEQUENTIAL |
| #9 dubbing_orchestrator.py | YES | After #3 + #16 | EL Dubbing API | #16 gate | SEQUENTIAL |
| #10 dubbing_batch.py | YES | After #9 | EL Dubbing API | #9 output | SEQUENTIAL |
| #11 doge_animator_bridge.py | PARTIAL (FPS?) | After #10 + #16 | csv, math | #16 timing + #10 audio | SEQUENTIAL |
| #12 lip_sync_rhubarb.py | PARTIAL | After #11 | Rhubarb binary | #11 output | SEQUENTIAL |
| #13 preflight_check.py | YES | N/A | Pure logic | NONE | YES |
| #14 postflight_report.py | YES | N/A | Pure logic | NONE | YES |
| #15 monitoring_alerts.py | YES | N/A | logging, json | NONE | YES |
| #16 fernando_stt_reconciler.py | YES | PARTIAL (need MP4) | whisper, jiwer, difflib | Fernando MP4 for testing | YES (framework) |
| #17 blacklist_generator.py | YES | N/A | LLM API | NONE | YES |
| #18 ffmpeg_merger.py | YES | N/A | ffmpeg, pydub | NONE | YES |

**Ready NOW: 9 scripts** (#1, #2, #3, #13, #14, #15, #16 framework, #17, #18)
**Sequential (after dependencies): 7 scripts** (#4, #7, #8, #9, #10, #11, #12)
**BLOCKED: 2 scripts** (#5, #6)

---

## T10 Summary (JSON)

```json
{
  "auditor": "T10_Architecture_Audit",
  "date": "2026-02-19",
  "confidence": 0.90,
  "total_scripts": 18,
  "scripts_ready_now": 9,
  "scripts_sequential": 7,
  "scripts_blocked": 2,
  "dependency_chain_valid": true,
  "circular_dependencies": 0,
  "critical_finding": "Script #16 (fernando_stt_reconciler.py) is CONFIRMED as pipeline linchpin. Voice Segments v3 CONFIRMED as phantom feature (T9 cross-validated).",
  "new_scripts_added": [
    {"id": 16, "name": "fernando_stt_reconciler.py", "effort": "5h", "priority": "P0"},
    {"id": 17, "name": "blacklist_generator.py", "effort": "3h", "priority": "P1"},
    {"id": 18, "name": "ffmpeg_merger.py", "effort": "3h", "priority": "P1"}
  ],
  "quick_wins_ranked": [
    {"rank": 1, "script": "glossary_sanitizer.py", "effort": "2h", "impact": "M4+M5 mitigation", "blockers": "NONE"},
    {"rank": 2, "script": "docx_parser.py", "effort": "4h", "impact": "Foundation for 15 scripts", "blockers": "NONE"},
    {"rank": 3, "script": "blacklist_generator.py", "effort": "3h", "impact": "Complete M5 all languages", "blockers": "NONE"},
    {"rank": 4, "script": "ffmpeg_merger.py", "effort": "3h", "impact": "M3 fallback safety", "blockers": "NONE"},
    {"rank": 5, "script": "voice_mapper.py", "effort": "3h", "impact": "Unblocks TTS and dubbing", "blockers": "docx_parser"},
    {"rank": 6, "script": "preflight_check.py", "effort": "2h", "impact": "Pipeline validation", "blockers": "NONE"},
    {"rank": 7, "script": "qc_validation.py (partial)", "effort": "4h", "impact": "QA gate", "blockers": "tool install"},
    {"rank": 8, "script": "tts_batch.py", "effort": "6h", "impact": "Core TTS", "blockers": "voice_mapper"}
  ],
  "total_quick_wins_effort_hours": 27,
  "total_quick_wins_days_2_workers": 2.5,
  "tool_recommendations": {
    "wer": {"tool": "jiwer", "license": "Apache 2.0", "size": "8KB"},
    "semantic_similarity": {"tool": "sentence-transformers", "license": "Apache 2.0", "model": "paraphrase-multilingual-MiniLM-L12-v2"},
    "stt_local": {"tool": "whisper", "license": "MIT", "use": "Tier 2/3 WER validation"},
    "stt_api": {"tool": "ElevenLabs STT", "use": "Tier 1 dual-STT consensus"},
    "sampling": {"tool": "heuristic_first", "formula": "wer*0.4 + (1-bertscore)*0.3 + speaker_weight*0.2 + lang_diff*0.1"},
    "audio_processing": {"tool": "ffmpeg + pydub"},
    "docx_parsing": {"tool": "python-docx + chardet"}
  },
  "risk_top_3": [
    {"risk": "Q7/Q8 delays", "severity": "CRITICAL", "mitigation": "Start Waves A-D without them"},
    {"risk": "Voice Segments v3 phantom", "severity": "HIGH", "mitigation": "ffmpeg fallback + Voiceover Studio"},
    {"risk": "Guion Zombie undetected", "severity": "HIGH", "mitigation": "fernando_stt_reconciler.py gate"}
  ],
  "corrections_to_wave2_prompt": [
    "Quick wins effort underestimated: 22h -> 27h (3 new scripts added)",
    "Frame rate cannot be hardcoded to 55 FPS -- must be parameterized",
    "tts_batch.py effort underestimated: 4h -> 6h (cache design + error handling)",
    "Script #16 can START framework coding NOW without Fernando MP4 -- only testing blocked"
  ],
  "blocking_items": [
    "Q7 (Fernando silence rule) -- blocks Script #5 only",
    "Q8 (Saul/Ivan workflow) -- blocks Script #6 only",
    "Manual Dub CSV format -- blocks M2 automated implementation",
    "Fernando MP4 file -- blocks Script #16 TESTING (not coding)"
  ]
}
```

---

*T10 -- Architecture and Implementation Readiness Audit Complete | 2026-02-19*
