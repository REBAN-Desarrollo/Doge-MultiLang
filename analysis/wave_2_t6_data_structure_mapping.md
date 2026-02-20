# WAVE 2 — T6: Data Structure Mapping Analyst

**Analyst:** T6 — Data Structure Specialist
**Date:** 2026-02-19
**Status:** COMPLETE
**Confidence:** 0.87

---

## 1. Data Flow Diagram (Full Pipeline)

```
SSOT: Un guardaespaldas escolar.docx (8 tables, 19 chars, 13 scenes, 44 MB)
  |   Table 4 (Desarrollo Guion): 13 rows x 8 cols — PRIMARY DIALOGUE SOURCE
  |   Table 2 (Personajes): 19 rows x 5 cols — CHARACTER CATALOG
  |   Columns Table 4: Escena | Duración | Personaje | Diálogo | Acción | Notas | Timing | Estado
  |
  v [docx_parser.py — MISSING BLOCKER #1]
  |   Parse Table 4: extract one dialogue_object per row
  |   Parse Table 2: build character catalog (19 chars, 5 columns)
  |   Detect: speaker (col "Personaje"), text (col "Diálogo"), stage dir (col "Acción")
  |   Timing: col "Timing" exists but is text-based estimates, NOT frame-accurate
  |   Silence detection: NOT IN DOCX — must be inferred from timing or Fernando MP4
  |   UTF-8 fix required: "é -> ?" encoding bug detected in T1 analysis
  |
  v JSON Dialogue Objects
  |   dialogue_id, scene_id, episode, table_row_index, speaker{}, text{}, timing{},
  |   stage_direction, notes, emotional_intent, volume_hint, context{}, qa_tier, metadata{}
  |
  v [glossary_sanitizer.py — MISSING, BLOCKER #3 sub-component]
  |   M4: regex fixes ("no." -> "no", "Sr." -> "Señor", "etc." -> "etcétera")
  |   M5: DNT tokens ("<dnt>Que Perro Hilo</dnt>")
  |   Blacklist pre-scan per target language
  |   Output: text.sanitized + text.glossary_protected fields populated
  |
  v [voice_mapper.py — MISSING BLOCKER #2]
  |   Input: character list + Ramon's voice pool from ElevenLabs
  |   Rule: If prior manifest.json exists -> inherit voice_id for recurring characters
  |   Rule: Narrator voice_id FIXED for entire series
  |   Rule: Protagonist voice_id reused if character is recurrent
  |   Rule: Secondary pool = generic, no cross-episode persistence required
  |   Output: manifest.json with voice_id per character
  |
  v manifest.json (Voice Manifest Object)
  |   serie, episode, version, generated_date, characters{}, languages[], model_selection,
  |   voice_remapping_rules{M1_persistence, fallback, validation_gate}
  |
  v [tts_batch.py — MISSING BLOCKER #3]
  |   For each dialogue_object:
  |     POST /v1/text-to-speech/{voice_id}
  |     with_timestamps=True (for SRT / forced-alignment)
  |     Cache key: {character_name, scene_id, dialogue_order, hash(text.sanitized)}
  |   Output: audio/*.mp3 per dialogue + timing/*.json (word-level timestamps)
  |
  v Raw TTS Audio + Metadata (Spanish master)
  |   audio/{scene_id}/{dialogue_id}.mp3
  |   timing/{dialogue_id}_timestamps.json
  |   manifest_enriched.json (voice_id + timing added)
  |
  v [tts_post_silence.py — MISSING, M2 mitigation — BLOCKED ON Q7]
  |   Problem: docx has NO explicit silence data
  |   Current workaround: Fernando cuts waveforms visually "a la mitad del silencio"
  |   Automated: detect inter-dialogue gaps from timing; generate silence_objects
  |   BLOCKED: silence duration rule UNKNOWN until Q7 filled by Fernando
  |
  v Silence Objects per gap
  |   silence_id, dialogue_id_before, dialogue_id_after, type, duration_ms (UNKNOWN),
  |   source, confidence (0.50 — heuristic only)
  |
  v [tts_multi_speaker_merge.py — MISSING, M3 mitigation — BLOCKED ON Q8 + EL API]
  |   Problem: ElevenLabs detects multiple characters as single speaker
  |   If Voice Segments v3 available: use speaker tags
  |   If NOT available (UNKNOWN — Q8 empty): ffmpeg forced-alignment merge
  |
  v Fernando Post-Production (MANUAL — outside automation scope)
  |   Input: TTS audio ES + assembled AE project
  |   Fernando adds: SFX, BGM, timing corrections, pacing adjustments
  |   Fernando exports: MP4 (ES) with clean voice track for dubbing
  |   CRITICAL: Fernando edits are NOT reflected back in dialogue_objects
  |   -> "Guion Zombie" problem (confirmed — see T8)
  |
  v [fernando_stt_reconciler.py — MISSING, NEW SCRIPT #16]
  |   Run Whisper STT on Fernando MP4 (ES clean voice)
  |   Fuzzy diff: STT text vs dialogue_objects.json text
  |   If diff > 5%: FLAG as "Guion Zombie Suspected" -> manual reconciliation gate
  |   Extract frame-accurate timing as LAYER 2 SSOT for all downstream scripts
  |
  v [dubbing_orchestrator.py — MISSING]
  |   Input: Fernando MP4 (ES) + manifest.json
  |   Step 1: ES -> EN (mandatory 100% human QA gate before other languages)
  |   Step 2: EN -> 15 languages (tiered)
  |   Parallel: up to 4 languages simultaneously
  |
  v [dubbing_batch.py — MISSING]
  |   For each language (16 total):
  |     POST /v1/dubbing with source MP4
  |     Inherit voice_ids from manifest.json (M1 solution)
  |     Apply blacklist pre-scan (M5)
  |     Apply silence CSV timestamps (M2 — PENDING spec)
  |   QA validation per tier (WER + COMET + human)
  |
  v 16-Language Audio Output
  |   output/{episodio}/dubbing/{lang_code}/audio.mp4
  |   output/{episodio}/dubbing/{lang_code}/qa_report.json
  |   output/{episodio}/dubbing/manifest_final.json
  |
  v Fernando post-dubbing assembly (MANUAL)
  |   Merges dubbed dialogue + SFX + BGM instrumental (all languages same BGM per DEC-QPH-006)
  |   Exports: final MP4 x 16 languages (H.264, AAC, -14 LUFS)
  |
  v [doge_animator_bridge.py — MISSING]
  |   Input: timing.json (from fernando_stt_reconciler.py) + manifest.json + audio files
  |   Output: CSV (scene_id, speaker, start_frame, end_frame, audio_path) per language
  |   Output: Rhubarb phoneme .json per dialogue per language
  |   Frame calculation: timestamp_seconds × 55fps = frame_number
  |
  v [lip_sync_rhubarb.py — MISSING]
  |   Input: audio/*.mp3 per speaker per language
  |   Output: .json phoneme data (Rhubarb format)
  |
  v [CEP Panel — Doge-Animator (EXISTING, 55+ FPS)]
      Consume CSV + audio for animation sync
      Lip-sync via Rhubarb phoneme data (docs exist, not yet connected)
```

---

## 2. JSON Schema Definitions

### SCHEMA: Dialogue Object (output of docx_parser.py)

```json
{
  "dialogue_id": "ep1_sc03_dia042",
  "scene_id": "ep1_sc03",
  "episode": "Un guardaespaldas escolar",
  "table_source": "table_4_guion",
  "table_row_index": 42,
  "speaker": {
    "character_name": "Taro",
    "speaker_type": "Protagonista",
    "voice_id": null,
    "voice_pool": null,
    "acento": "mexican"
  },
  "text": {
    "raw": "¿Qué pasó aquí?",
    "sanitized": "Qué pasó aquí",
    "glossary_protected": "Qué pasó aquí",
    "character_count": 16
  },
  "timing": {
    "scene_id_docx": "Escena 3",
    "duration_from_docx": "02:15",
    "dialogue_start_seconds": null,
    "dialogue_end_seconds": null,
    "estimated_duration_s": null,
    "timing_source": "UNKNOWN — requires fernando_stt_reconciler.py"
  },
  "stage_direction": {
    "raw": "Taro entra corriendo, visiblemente asustado",
    "source_column": "Accion"
  },
  "notes": {
    "raw": "Tono urgente",
    "source_column": "Notas"
  },
  "estado_docx": "Aprobado",
  "emotional_intent": "surprise + concern",
  "volume_hint": "normal",
  "context": {
    "previous_dialogue_id": "ep1_sc03_dia041",
    "next_dialogue_id": "ep1_sc03_dia043",
    "scene_background": "Escuela - pasillo"
  },
  "qa_tier": 1,
  "metadata": {
    "source_docx": "Un guardaespaldas escolar.docx",
    "extracted_date": "2026-02-19",
    "confidence": 0.85,
    "silence_after_ms": null
  }
}
```

### SCHEMA: Manifest Object (output of voice_mapper.py)

```json
{
  "serie": "QuePerroHilo",
  "episode": "Un guardaespaldas escolar",
  "version": "1.0",
  "generated_date": "2026-02-19",
  "generated_by": "voice_mapper.py",
  "model_selection": "flash-v2-5",
  "characters": {
    "Taro": {
      "speaker_type": "Protagonista",
      "voice_id": "VOICE_ID_TO_ASSIGN",
      "voice_provider": "ElevenLabs",
      "acento": "mexican",
      "stability": 0.75,
      "similarity_boost": 0.85,
      "speed": 1.0,
      "pitch_semitones": 0,
      "persistence_rules": {
        "same_across_languages": true,
        "episode_continuity": true,
        "series_continuity": false
      }
    },
    "Narrador": {
      "speaker_type": "Narrador",
      "voice_id": "NARRATOR_FIXED_ID",
      "stability": 0.90,
      "persistence_rules": {
        "same_across_languages": true,
        "episode_continuity": true,
        "series_continuity": true,
        "note": "NEVER change this voice_id — fixed for all QPH episodes"
      }
    }
  },
  "total_characters": 19,
  "languages_target": [
    "en-US","pt-BR","fr-FR","de-DE","ar-SA","ko-KR","ja-JP",
    "hi-IN","zh-CN","zh-TW","it-IT","pl-PL","ru-RU","tr-TR","fil-PH"
  ],
  "translation_chain": "ES -> EN (master) -> all others",
  "voice_remapping_rules": {
    "M1_persistence": "voice_id MUST be same per character across all languages",
    "fallback": "If voice_id unavailable in target language, use nearest match from EL voice library",
    "validation_gate": "QA Tier 1 confirms voice recognizable per language"
  }
}
```

### SCHEMA: Silence Object (M2 — PARTIALLY SPECULATIVE, awaiting Q7)

```json
{
  "silence_id": "ep1_sc03_sil_042_043",
  "dialogue_id_before": "ep1_sc03_dia042",
  "dialogue_id_after": "ep1_sc03_dia043",
  "speaker_before": "Taro",
  "speaker_after": "Emi",
  "type": "dialogue_boundary",
  "duration_ms": "UNKNOWN — Q7 EMPTY",
  "duration_ms_heuristic": 800,
  "heuristic_basis": "Fernando stated 'a la mitad del silencio' — 800ms is estimate only",
  "source": "timing_inference_from_tts",
  "confidence": 0.50,
  "timestamp_start_s": null,
  "timestamp_end_s": null,
  "requires_fernando_validation": true,
  "blocking_q7": true
}
```

### SCHEMA: QA Report Object

```json
{
  "episode": "Un guardaespaldas escolar",
  "language": "pt-BR",
  "qa_tier": 1,
  "generated_date": "2026-02-19",
  "metrics": {
    "wer": null,
    "wer_target": 0.05,
    "comet": null,
    "comet_target": 0.85,
    "bertscore": null,
    "bertscore_target": 0.85,
    "speaker_consistency": null,
    "speaker_consistency_target": 0.95,
    "safety_category_a_flags": 0,
    "timing_delta_pct": null,
    "timing_delta_target_pct": 20
  },
  "passed_validation": null,
  "blockers": [],
  "warnings": [],
  "human_review_required": true,
  "reviewed_by": null,
  "review_date": null,
  "notes": "Baseline not yet established — first episode pilot run needed"
}
```

---

## 3. ElevenLabs API Mapping

| Schema Object | ElevenLabs Endpoint | Key Parameters | Status |
|:---|:---|:---|:---|
| Dialogue + voice_id → TTS | `POST /v1/text-to-speech/{voice_id}` | `text`, `model_id`, `voice_settings`, `with_timestamps=true` | AVAILABLE |
| Manifest → dubbing | `POST /v1/dubbing` | `source_url` or upload, `target_lang`, voice IDs | AVAILABLE |
| Silence timestamps → CSV | Manual Dub CSV (Dubbing Studio) | `timestamp_ms, speaker_id, text, voice_id` | NOT IN KB — UNKNOWN FORMAT |
| Multi-speaker separation | Voice Segments v3 / Text to Dialogue | Speaker tags per segment | PENDING — EL roadmap |
| WER validation | `POST /v1/speech-to-text` | `audio`, `model_id` | AVAILABLE |
| Timing verification | `POST /v1/forced-alignment` | `audio`, `text` | AVAILABLE |
| Glossary protection | `POST /v1/pronunciation-dictionaries` | `name`, `rules[]` | AVAILABLE |

---

## 4. Gaps Between Schemas and ElevenLabs API

| # | Gap | Schema Field | ElevenLabs Reality | Workaround | Effort |
|:--|:----|:------------|:-------------------|:-----------|:-------|
| 1 | Exact silence enforcement | `silence_obj.duration_ms` | No endpoint to enforce fixed inter-dialogue silence | Post-process MP3: inject silence frames via ffmpeg after TTS | HIGH |
| 2 | Multi-speaker separation | `speakers_track.json` | Dubbing API processes full audio stream, not per-speaker | Wait for Voice Segments v3 OR forced-alignment + ffmpeg split+merge | HIGH |
| 3 | Emotional intensity mapping | `emotional_intent` | No dedicated parameter; EL infers from voice settings + text | Inject emotion instructions in text prompt; use voice v3 alpha | MEDIUM |
| 4 | Glossary DNT enforcement | `text.glossary_protected` | Pronunciation dicts exist but do not guarantee translation protection | Regex pre-process + post-validate with LLM diff check | MEDIUM |
| 5 | Fernando timing data | `timing.dialogue_start_seconds` | Docx has no frame-accurate timing; EL dubbing gives no per-dialogue timestamps | Whisper STT or EL forced-alignment on Fernando MP4 | HIGH |
| 6 | Manual Dub CSV format | Silence + timing injection | NOT documented in KB (735 entries searched, not found) | Trial-and-error via EL Studio UI + reverse-engineer CSV format | HIGH |
| 7 | Per-dialogue QA scoring | `qa_tier` | API returns QC URL but not WER per dialogue | Parse CSV export from EL Studio + process locally with jiwer | LOW |

---

## 5. Missing Scripts Dependency Order

### Wave A — Pre-requisites (fully specced, can build NOW)

| # | Script | Blocks | Effort | Gate |
|:--|:-------|:-------|:-------|:-----|
| 1 | `docx_parser.py` | ALL | HIGH | All 19 characters detected, all 13 scenes, 0 missed dialogues |
| 2 | `glossary_sanitizer.py` | #4, #9 | LOW | M4 regex applied, M5 DNT tokens applied, 0 Category A in output |
| 3 | `voice_mapper.py` | #4, #9, #10 | MEDIUM | All 19 characters mapped, Narrator fixed, no manual re-mapping needed |

### Wave B — Core TTS (requires Wave A)

| # | Script | Blocks | Effort | Gate |
|:--|:-------|:-------|:-------|:-----|
| 4 | `tts_batch.py` | All audio output | HIGH | WER < 10%, cache functional, no clipping |
| 5 | `tts_post_silence.py` | #7 silence metric | MEDIUM | **BLOCKED: Q7 EMPTY** |
| 6 | `tts_multi_speaker_merge.py` | #9, speaker consistency | HIGH | **BLOCKED: Q8 EMPTY + EL API unknown** |

### Wave B+ — New Script (identified by T8)

| # | Script | Blocks | Effort | Gate |
|:--|:-------|:-------|:-------|:-----|
| 16 | `fernando_stt_reconciler.py` | #5 timing, #11 CSV, #9 pre-flight | MEDIUM | Fuzzy diff < 5% OR reconciliation confirmed by Ramon/Alan |

### Wave C — Quality Assurance (requires Wave B)

| # | Script | Blocks | Effort | Gate |
|:--|:-------|:-------|:-------|:-----|
| 7 | `qc_validation.py` | Dubbing start | MEDIUM | WER targets met by tier, COMET > 0.85, 0 Category A |
| 8 | `qc_human_reviewer.py` | Tier 1 gate | LOW | 100% Tier 1 reviewed before dubbing proceeds |

### Wave D — Dubbing Orchestration (requires Wave B + C + Fernando MP4)

| # | Script | Blocks | Effort | Gate |
|:--|:-------|:-------|:-------|:-----|
| 9 | `dubbing_orchestrator.py` | All dubbing | HIGH | EN master approved before other languages |
| 10 | `dubbing_batch.py` | Final delivery | HIGH | WER per tier, timing sync, safety check all passed |

### Wave E — Doge-Animator Integration (requires Wave D)

| # | Script | Blocks | Effort | Gate |
|:--|:-------|:-------|:-------|:-----|
| 11 | `doge_animator_bridge.py` | Animation sync | HIGH | Doge-Animator CEP panel loads CSV and syncs audio correctly |
| 12 | `lip_sync_rhubarb.py` | Lip-sync | MEDIUM | Phoneme data loads and applies to character rig |

### Wave F — Monitoring (can build anytime)

| # | Script | Effort | Gate |
|:--|:-------|:-------|:-----|
| 13 | `preflight_check.py` | LOW | 0 blockers before tts_batch.py |
| 14 | `postflight_report.py` | LOW | All metrics above threshold or escalated |
| 15 | `monitoring_alerts.py` | LOW | Zero silent failures in production run |

---

## Dependency Graph — Critical Path

```
docx_parser.py (1)
  ├── glossary_sanitizer.py (2)
  |     └── voice_mapper.py (3)
  |           └── tts_batch.py (4)
  |                 ├── tts_post_silence.py (5) [BLOCKED: Q7]
  |                 ├── tts_multi_speaker_merge.py (6) [BLOCKED: Q8 + EL API]
  |                 └── qc_validation.py (7)
  |                       └── qc_human_reviewer.py (8)
  |
  v [Fernando MP4 — external manual gate]
  |
  fernando_stt_reconciler.py (16)
    └── dubbing_orchestrator.py (9)
          └── dubbing_batch.py (10)
                ├── doge_animator_bridge.py (11)
                |     └── lip_sync_rhubarb.py (12)
                └── [preflight / postflight / monitoring] (13,14,15)
```

---

**Message to T7:** Scripts #5, #6, #7 (silence metric only) cannot be fully specced without Q7 and Q8. Silence Object schema has `duration_ms: UNKNOWN`. Multi-speaker merge architecture is undecided. Flag both as CRITICAL BLOCKER in gap matrix.

**Message to T8:** fernando_stt_reconciler.py (#16) is the technical control for Guion Zombie. It also provides LAYER 2 SSOT (timing data). Without it, doge_animator_bridge.py has no input for start/end frames.

---

*T6 — Data Structure Mapping Complete | 2026-02-19*
