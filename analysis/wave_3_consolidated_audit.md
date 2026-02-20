# WAVE 3: Consolidated Audit Report

**Date:** 2026-02-19
**Auditors:** T9 (Translation/Speaker Quality), T10 (Architecture/Implementation)
**Status:** COMPLETE
**Input:** Wave 1 Discovery + Wave 2 Consolidated + All levantamiento docs + ElevenLabs KB (735 entries)

---

## Executive Summary

Two Opus auditors ran in parallel against the full codebase, all Wave 1/2 outputs, and the ElevenLabs knowledge base. This report synthesizes their unanimous findings and highlights critical corrections to prior assumptions.

**Bottom line:** 9 of 18 scripts can start NOW. The 2 blocked scripts (#5, #6) are blocked by human actions only (fill Q7 and Q8). One phantom feature was identified ("Voice Segments v3" does not exist in ElevenLabs). The revised pipeline has 18 scripts total (3 new added). Total quick-win effort is 27 hours (3.5 person-days with 1 worker, or 2.5 days with 2 workers in parallel).

---

## Critical Corrections (Wave 2 -> Wave 3)

| # | Previous Assumption | Correction | Impact |
|:--|:--------------------|:-----------|:-------|
| 1 | "Voice Segments v3" is an ElevenLabs feature | **DOES NOT EXIST.** Not found in 735 KB entries. The closest real feature is Voiceover Studio (multi-track, multi-speaker). | Rename in all specs. M3 solution must use Voiceover Studio + ffmpeg fallback. |
| 2 | QA Tier 1 cost ~$2/episode | **Underestimated.** Actual cost with 100% human review for 4 Tier 1 languages: ~$40-50/episode. | Budget planning must be revised. |
| 3 | Quick wins = 22h | **Underestimated.** With 3 new scripts + revised tts_batch effort: 27h (3.5 person-days). | Timeline needs 1 extra day. |
| 4 | Doge-Animator runs at 55 FPS | **Must be parameterized.** AE compositions can run at 24, 30, or 55 FPS. Hardcoding 55 will break timing for non-standard compositions. | `doge_animator_bridge.py` must accept FPS as parameter. |
| 5 | 15 scripts in pipeline | **Now 18.** Added: #16 fernando_stt_reconciler, #17 blacklist_generator, #18 ffmpeg_merger. | Backlog and tracking must be updated. |
| 6 | Manual Dub CSV exists in EL docs | **NOT IN KB.** Zero results in 735 entries. Format must be obtained from EL support or reverse-engineered. | M2 implementation has an additional blocker beyond Q7. |

---

## Unanimous Findings (T9 + T10 Agree)

### 1. Script #16 is the Pipeline Linchpin

Both auditors independently confirmed that `fernando_stt_reconciler.py` (#16) is the single most critical script to build. It:
- Provides Layer 2 SSOT (timing data) for ALL downstream scripts
- Gates the Guion Zombie check (no dubbing without passing)
- Provides frame-accurate data for Doge-Animator CSV generation
- CAN be built NOW (framework), only TESTING requires Fernando MP4

### 2. Voice Segments v3 is a Phantom Feature

T9 searched 735 ElevenLabs KB entries. No product called "Voice Segments v3" exists. The specs appear to have invented this name. The real ElevenLabs features that address M3 are:
- **Dubbing Studio** -- automatic speaker separation (unreliable per Saul)
- **Voiceover Studio** -- manual multi-track, multi-speaker control (reliable)
- **Track clone / Clip clone** -- voice consistency within tracks

### 3. Two Parallel Tracks Should Run Simultaneously

**Track A (Code):** Build 9 unblocked scripts in Waves A through C.
**Track B (Human):** Fill Q7, fill Q8, contact ElevenLabs for CSV format, test Dubbing API with pilot.

These tracks have ZERO dependencies on each other. Waiting for Q7/Q8 to start coding is unnecessary and wastes 2+ days.

### 4. Tool Selection is Finalized

| Purpose | Tool | Status |
|:--------|:-----|:-------|
| WER calculation | jiwer | SELECTED -- install immediately |
| Semantic similarity | sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2) | SELECTED |
| Local STT | Whisper | SELECTED for Tier 2/3 |
| API STT | ElevenLabs STT | SELECTED for Tier 1 consensus |
| Sampling | Heuristic formula (WER-weighted) | SELECTED for MVP |
| Audio processing | ffmpeg + pydub | SELECTED |
| Docx parsing | python-docx + chardet | SELECTED |

---

## Muda Mitigation Scorecard (Cross-Validated by T9 + T10)

| Muda | T9 Verdict | T10 Verdict | Ready for Code | Blocked By |
|:-----|:-----------|:------------|:---------------|:-----------|
| M1 (Voice Re-mapping) | VIABLE | VIABLE | YES | Nothing |
| M2 (Silence Compression) | PARTIALLY VIABLE | BLOCKED (#5) | NO | Q7 + CSV format |
| M3 (Multi-Speaker Merge) | PARTIALLY VIABLE | BLOCKED (#6) | NO | Q8 + architecture decision |
| M4 (no. Bug) | FULLY VIABLE | VIABLE | YES | Nothing |
| M5 (Language Filters) | PARTIALLY VIABLE | VIABLE (with new #17) | YES (partial) | 14 missing blacklists |
| M6 (Clipping) | VIABLE | VIABLE | YES (in #4) | Nothing |
| M7 (Auto-Scroll) | NOT IN SCOPE | NOT IN SCOPE | N/A | N/A |

---

## Revised Build Order (18 Scripts)

### Phase 1: Quick Wins (27h, 2.5 days with 2 workers)

```
DAY 1 (8h):
  Worker 1: docx_parser.py (#1) [4h]
            voice_mapper.py (#3) [3h]
            Buffer/testing [1h]

  Worker 2: glossary_sanitizer.py (#2) [2h]
            blacklist_generator.py (#17 NEW) [3h]
            ffmpeg_merger.py (#18 NEW) [3h]

DAY 2 (8h):
  Worker 1: tts_batch.py (#4) [6h]
            preflight_check.py (#13) [2h]

  Worker 2: qc_validation.py (#7 partial) [4h]
            fernando_stt_reconciler.py (#16 framework) [4h]

DAY 3 (4h):
  Both:     Integration testing with pilot docx
            End-to-end Wave A validation
```

### Phase 2: Sequential (after Phase 1 + dependencies)

| Script | Depends On | Effort |
|:-------|:-----------|:-------|
| qc_human_reviewer.py (#8) | #7 output | 3h |
| dubbing_orchestrator.py (#9) | #3 + #16 gate + Fernando MP4 | 6h |
| dubbing_batch.py (#10) | #9 output | 6h |
| doge_animator_bridge.py (#11) | #16 timing + #10 audio | 4h |
| lip_sync_rhubarb.py (#12) | #11 output | 3h |
| postflight_report.py (#14) | All pipeline outputs | 2h |
| monitoring_alerts.py (#15) | All pipeline outputs | 2h |

### BLOCKED (awaiting human action)

| Script | Blocked By | Unblocked When |
|:-------|:-----------|:---------------|
| tts_post_silence.py (#5) | Q7 empty + CSV format unknown | Q7 filled AND CSV format obtained |
| tts_multi_speaker_merge.py (#6) | Q8 empty + architecture decision | Q8 filled AND Voiceover Studio tested |

---

## Immediate Action Items (Priority Ordered)

### P0 -- Do Today

| # | Action | Owner | Unblocks | Effort |
|:--|:-------|:------|:---------|:-------|
| 1 | Start coding `docx_parser.py` (#1) | Backend | ALL scripts | 4h |
| 2 | Start coding `glossary_sanitizer.py` (#2) in parallel | Backend | M4 + M5 | 2h |
| 3 | Fill Q7 (Fernando's silence handling) | Ops (Daniel/Iris) | Script #5 | Human action |
| 4 | Fill Q8 (Saul/Ivan workflow) | Ops (Daniel/Iris) | Script #6 | Human action |
| 5 | Rename "Voice Segments v3" to real feature names in all specs | Documentation | Prevents confusion | 30min |

### P1 -- Do This Week

| # | Action | Owner | Unblocks | Effort |
|:--|:-------|:------|:---------|:-------|
| 6 | Contact ElevenLabs for Manual Dub CSV format | Backend/Ops | M2 implementation | Async |
| 7 | Test ElevenLabs Dubbing API with 1 pilot scene | Backend | Validates speaker separation | 2h |
| 8 | Test Voiceover Studio for multi-speaker control | Backend | M3 architecture decision | 1h |
| 9 | Build `blacklist_generator.py` (#17) | Backend | M5 all languages | 3h |
| 10 | Build `ffmpeg_merger.py` (#18) | Backend | M3 fallback | 3h |
| 11 | Install jiwer + sentence-transformers | Backend | QA tooling | 30min |
| 12 | Build `voice_mapper.py` (#3) | Backend | TTS + dubbing | 3h |
| 13 | Build `fernando_stt_reconciler.py` (#16 framework) | Backend | Timing SSOT | 5h |

### P2 -- Next Week

| # | Action | Owner | Unblocks |
|:--|:-------|:------|:---------|
| 14 | Build `tts_batch.py` (#4) | Backend | All TTS output |
| 15 | Build `qc_validation.py` (#7 partial) | Backend | QA gate |
| 16 | Run pilot episode end-to-end through Spanish TTS | Backend + QA | Pipeline validation |
| 17 | Generate 14 missing blacklists with human review for Tier 1 | Backend + Native reviewers | M5 production-ready |

---

## Output Files From This Wave

| File | Auditor | Content |
|:-----|:--------|:--------|
| `WAVE_3_T9_TRANSLATION_AUDIT.md` | T9 | Muda M1-M7 audit, QA tiering audit, ElevenLabs API capability audit |
| `WAVE_3_T10_ARCHITECTURE_AUDIT.md` | T10 | Script dependency validation, quick wins, tool selection, risk assessment |
| `WAVE_3_CONSOLIDATED_AUDIT.md` | This file | Cross-auditor synthesis |

---

## Ready for Wave 4

**Wave 4 can start when:**
- `docx_parser.py` (#1) passes gate: 19 characters detected, 13 scenes parsed, 0 missed dialogues
- `glossary_sanitizer.py` (#2) passes gate: M4 regex applied, M5 DNT tokens applied, 0 Category A in output
- At least 1 pilot scene successfully parsed and sanitized

**Wave 4 scope:**
- Build remaining quick-win scripts (#3, #4, #7, #13, #16, #17, #18)
- Run pilot episode: "Un guardaespaldas escolar.docx" through Waves A+B
- Validate manifest.json against 19 characters from Table 2
- Establish WER baseline with jiwer on pilot TTS output

---

*WAVE 3 Complete | 2026-02-19 | T9 + T10*
