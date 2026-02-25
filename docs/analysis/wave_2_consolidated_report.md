# WAVE 2: Consolidated Analyst Report

**Date:** 2026-02-19
**Analysts:** T6 (Data Structure), T7 (Gap Analysis), T8 (SSOT Cross-Reference)
**Status:** COMPLETE
**Input:** WAVE_1_DISCOVERY_REPORT.json + all levantamiento docs

---

## Executive Summary

Three parallel analysts read the full codebase, all levantamiento documentation, Wave 1 reports, and ElevenLabs KB. This document consolidates their unanimous findings.

**Bottom line:** 5 scripts can be built immediately. 2 scripts are hard-blocked on unfilled questionnaires (Q7, Q8). 1 new script was identified that was missing from the original 15-script plan. The Guion Zombie problem is confirmed and requires a technical control, not just a manual process rule.

---

## Unanimous Findings (T6 + T7 + T8 Agree)

### 1. Docx Structure Is Confirmed and Parseable

The docx uses TABLE structure, NOT inline bold text. Table 4 (13 rows × 8 cols) is the primary dialogue source. `docx_parser.py` must read rows from `doc.tables[4]`, not scan paragraphs.

Key columns in Table 4:
- Col 0: Escena (scene_id)
- Col 2: Personaje (speaker_name) — cross-reference to Table 2 for speaker_type
- Col 3: Diálogo (dialogue_text) — UTF-8 fix required
- Col 4: Acción (stage_direction)
- Col 6: Timing (text-based estimate, NOT frame-accurate)
- Col 7: Estado (approval_status)

Table 2 (19 rows × 5 cols) is the character catalog: name, speaker_type, description, voice_notes, series_continuity.

**`docx_parser.py` is fully specced. Build it now.**

### 2. Q7 and Q8 Are Hard Blockers for Scripts #5 and #6

Q7 (Fernando's silence handling process) is an unfilled questionnaire template. The actual silence duration rule is UNKNOWN. The qualitative description ("a la mitad del silencio, visualmente") is insufficient to implement `tts_post_silence.py`.

Q8 (Saul/Ivan dubbing workflow) is also unfilled. Voice Segments v3 availability from ElevenLabs is unconfirmed. Whether re-mapping exceptions are allowed is unclear.

**Neither of these blocks scripts #1, #2, #3, #4, #7 (partial), #13, #14, #15, or the new #16.**

### 3. Script #16 Is New and Required

`fernando_stt_reconciler.py` was not in the original 15-script plan but is mandatory for:
- Detecting the Guion Zombie automatically (not relying on Fernando's manual notification)
- Extracting frame-accurate dialogue timing from Fernando's MP4 (the only source of this data)
- Gating the dubbing pipeline: dubbing cannot start until STT diff passes

Without Script #16, `doge_animator_bridge.py` (#11) has no timing input for frame-accurate CSV generation.

### 4. The Guion Zombie Is Confirmed

Three separate documents confirm it: `POSTPROD_FERNANDO.md`, `DUBBING_SAUL_IVAN.md`, `06_CORE_AUDIO_TTS.md §6.3`. Fernando can and does modify dialogues during mixing. These changes are not reflected back in the docx or in `dialogue_objects.json`. The current mitigation (notify Alan/Ramon manually) has no technical enforcement.

### 5. Two SSOT Types, Not One

The existing spec says "Fernando's MP4 is the ÚNICA fuente de verdad." This is correct for audio production decisions. But the automated pipeline needs four layers:

- Layer 1 (Text): docx Table 4 → `dialogue_objects.json`
- Layer 2 (Timing): Fernando's MP4 → STT → `timing_objects.json`
- Layer 3 (Voice): `manifest.json` from `voice_mapper.py`
- Layer 4 (Quality): `qa_report.json` from `qc_validation.py`

---

## Conflict Resolutions

| Conflict | Resolution |
|:---------|:-----------|
| WER Tier 1: 10% (06_CORE) vs 5% (07_CORE) | Use 5% — 07_CORE is the more specific spec; 10% is the episode-level average across all tiers |
| Silence duration: "fixed 800ms" vs "visual/contextual" | Cannot resolve without Q7. Do NOT hardcode 800ms. |
| Docx as SSOT vs MP4 as SSOT | Both correct for different data types. See 4-layer SSOT above. |
| Voice re-mapping: prohibited (spec) vs practiced (Saul "de memoria") | Spec is clear. manifest.json is the technical enforcement. Saul's current practice is the problem the system solves. |
| Songs dubbed vs not dubbed | Resolved by DEC-QPH-006: songs are instrumental, no lyrics to dub, pass through unchanged. |

---

## Scripts Build Order

### Can Build Now (No blockers)

| # | Script | Why Now | Priority |
|:--|:-------|:--------|:---------|
| 1 | `docx_parser.py` | Table structure confirmed; all fields specced | P0 |
| 2 | `glossary_sanitizer.py` | M4 regex + M5 DNT rules fully documented | P0 |
| 3 | `voice_mapper.py` | Persistence rules documented; EL API available | P0 |
| 16 | `fernando_stt_reconciler.py` (NEW) | Whisper STT + fuzzy diff + timing extraction fully specced | P0 |
| 4 | `tts_batch.py` | EL TTS API in KB; cache design clear | P1 |
| 7 | `qc_validation.py` (partial) | WER (jiwer) + COMET implementable; silence metric deferred | P1 |
| 13 | `preflight_check.py` | Pure validation logic | P2 |
| 14 | `postflight_report.py` | Aggregation logic | P2 |
| 15 | `monitoring_alerts.py` | Logging + threshold logic | P2 |

### Blocked Until Q7 Filled

| # | Script | Blocked By | What Q7 Must Answer |
|:--|:-------|:-----------|:--------------------|
| 5 | `tts_post_silence.py` | Q7 empty | Exact silence duration rule per dialogue boundary type |

### Blocked Until Q8 Filled + EL Verified

| # | Script | Blocked By | What Q8 + EL Must Answer |
|:--|:-------|:-----------|:------------------------|
| 6 | `tts_multi_speaker_merge.py` | Q8 empty + Voice Segments v3 unknown | Re-mapping exceptions allowed? Voice Segments v3 available? |

### Blocked Until Wave A + Fernando MP4 Available

| # | Script | Blocked By |
|:--|:-------|:-----------|
| 8 | `qc_human_reviewer.py` | Requires #7 complete |
| 9 | `dubbing_orchestrator.py` | Requires Wave A (#1,2,3) + Fernando MP4 + #16 |
| 10 | `dubbing_batch.py` | Requires #9 |
| 11 | `doge_animator_bridge.py` | Requires #16 (timing) + #10 (audio) |
| 12 | `lip_sync_rhubarb.py` | Requires #11 |

---

## Critical Action Items (Ordered)

| Priority | Action | Owner | Unblocks |
|:---------|:-------|:------|:---------|
| P0 — IMMEDIATE | Fill Q7: Fernando's exact silence handling process | Iris / Daniel (ops) | Scripts #5, #7 silence metric |
| P0 — IMMEDIATE | Fill Q8: Saul/Ivan workflow; Voice Segments v3 status | Iris / Daniel (ops) | Scripts #6, M1 validation |
| P0 — IMMEDIATE | Verify Voice Segments v3 status with ElevenLabs support directly | Backend | Script #6 architecture decision |
| P0 — IMMEDIATE | Obtain Manual Dub CSV format spec (EL Studio trial or EL support) | Backend | Script #5 implementation |
| P1 — THIS WEEK | Build `docx_parser.py` | Backend | ALL scripts |
| P1 — THIS WEEK | Build `glossary_sanitizer.py` | Backend | Scripts #4, #9 |
| P1 — THIS WEEK | Build `voice_mapper.py` | Backend | Scripts #4, #9, #10 |
| P1 — THIS WEEK | Build `fernando_stt_reconciler.py` (#16 NEW) | Backend | Scripts #11, #5 timing, pre-flight |
| P2 — NEXT WEEK | Build `tts_batch.py` | Backend | All TTS output |
| P2 — NEXT WEEK | Build `qc_validation.py` (partial — WER + COMET; silence deferred) | Backend | Dubbing gate |

---

## Gap Count Summary

| Type | Count |
|:-----|:------|
| CRITICAL BLOCKER (Q7/Q8 empty) | 2 |
| CRITICAL BLOCKER (spec/API missing) | 2 |
| HIGH — Missing code | 5 |
| HIGH — Missing integration | 2 |
| MEDIUM — Design only, implementable | 4 |
| LOW — Trivial | 3 |
| NOT A GAP | 1 |
| **Total gaps** | **19** |

---

## Output Files From This Wave

| File | Analyst | Content |
|:-----|:--------|:--------|
| `WAVE_2_T6_DATA_STRUCTURE_MAPPING.md` | T6 | Full data flow diagram, 4 JSON schemas, API mapping, 16-script dependency order |
| `WAVE_2_T7_GAP_ANALYSIS_MATRIX.md` | T7 | 20-gap master matrix, conflict matrix, blocking chain analysis, action items |
| `WAVE_2_T8_SSOT_CROSSREFERENCE.md` | T8 | SSOT verdict, Guion Zombie analysis, docx parser implementation notes, 4-layer SSOT architecture |
| `WAVE_2_CONSOLIDATED_REPORT.md` | This file | Cross-analyst synthesis |

---

## Ready for Wave 3

**Wave 3 can start when:**
- Q7 and Q8 are filled (human action required — 2-day target)
- `docx_parser.py` is built and passing gate (all 19 characters, all 13 scenes, 0 missed dialogues)
- Voice Segments v3 status confirmed

**Wave 3 scope:**
- Build and test `glossary_sanitizer.py`, `voice_mapper.py`, `tts_batch.py`
- Build `fernando_stt_reconciler.py` (#16)
- Run pilot episode: "Un guardaespaldas escolar.docx" end-to-end through Spanish TTS
- Verify manifest.json output against known character list (19 characters from Table 2)

---

*WAVE 2 Complete | 2026-02-19 | T6 + T7 + T8*
