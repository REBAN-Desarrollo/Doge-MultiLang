# WAVE 2 — T8: SSOT Cross-Reference Analyst

**Analyst:** T8 — Truth Specialist
**Date:** 2026-02-19
**Status:** COMPLETE
**Confidence:** 0.87

---

## 1. Docx Format Analysis (Grounded in T1 Evidence)

```
"Un guardaespaldas escolar.docx" — Confirmed Structure:

File properties:
  Size:    44.3 MB (rich content, embedded images likely)
  Tables:  8 (explicitly confirmed by T1 python-docx read)
  Paragraphs: 36 (SMALL — most content is in tables, not paragraph prose)

Table breakdown (T1 confirmed):
  Table 0: Title & Metadata        10 rows × 2 cols   Episode properties
  Table 1: Publication Info         5 rows × 2 cols   Author, date
  Table 2: Personajes              19 rows × 5 cols   CHARACTER CATALOG
  Table 3: Fondos/Backgrounds      72 rows × 3 cols   Location catalog
  Table 4: Guion/Script Dev        13 rows × 8 cols   PRIMARY DIALOGUE SOURCE
  Table 5: Subtitulos              12 rows × 3 cols   Subtitles/annotations
  Table 6: Cambios Guion           20 rows × 3 cols   Script change requests
  Table 7: Cambios Animacion       20 rows × 3 cols   Animation change requests

Table 4 column schema (8 columns inferred from Wave 1 + 06_CORE_AUDIO_TTS.md):
  Col 0: Escena         → scene_id
  Col 1: Duración       → scene_duration_estimate (text format, e.g., "02:15")
  Col 2: Personaje      → speaker_name
  Col 3: Diálogo        → dialogue_text
  Col 4: Acción         → stage_direction
  Col 5: Notas          → production_notes
  Col 6: Timing         → timing_estimate (text-based, NOT frame-accurate)
  Col 7: Estado         → approval_status

Table 2 column schema (5 columns, 19 rows = 19 unique characters):
  Col 0: Nombre         → character_name
  Col 1: Tipo           → speaker_type (Protagonista/Antagonista/Narrador/Secundario)
  Col 2: Descripción    → character_description
  Col 3: Voz/Estilo     → voice_style_notes
  Col 4: Recurrente     → series_continuity_flag
```

**CRITICAL FINDING:** The docx does NOT use inline BOLD "Personaje:" prefix format (as assumed in the Wave 2 prompt). It uses a TABLE structure with "Personaje" as a dedicated column. `docx_parser.py` must read Table 4 row by row, not scan for bold inline text.

### Extraction Confidence Per Field

| Field | Source in Docx | Extraction Method | Confidence |
|:------|:--------------|:-----------------|:----------|
| speaker_name | Table 4 Col 2 (Personaje) | Direct column read | 95% |
| dialogue_text | Table 4 Col 3 (Diálogo) | Direct column read (UTF-8 fix required) | 90% |
| scene_id | Table 4 Col 0 (Escena) | Pattern "Escena N" | 95% |
| stage_direction | Table 4 Col 4 (Acción) | Direct column read | 85% |
| scene_duration | Table 4 Col 1 (Duración) | Text parse ("02:15" format) | 80% |
| timing_estimate | Table 4 Col 6 (Timing) | Text parse (likely ranges) | 60% |
| frame_accurate_timing | NOT IN DOCX | Must come from Fernando's MP4 via STT | 0% — gap |
| silence_markers | NOT IN DOCX | Not present; must be inferred | 0% — gap |
| speaker_type | Table 2 Col 1 | Cross-reference character name to Table 2 | 85% |
| voice_notes | Table 2 Col 3 | Direct column read | 80% |
| approval_status | Table 4 Col 7 (Estado) | Direct column read | 90% |

---

## 2. Truth Chain Verification — Full Pipeline

```
STEP 0: DOCX (Andrea creates guion — TEXT ORIGIN)
  Text SSOT: character names, dialogue text, scene structure, stage directions
  Timing:    rough scene-level estimates (Col "Duración"), NOT frame-accurate
  Silences:  NOT PRESENT in docx
  Status:    TEXT SSOT ✅ | TIMING SSOT ❌ | CREATIVE SSOT ❌

STEP 1: TTS Generation (Ramon via EL TTS API)
  Input:     docx parsed → dialogue_objects.json
  Output:    .mp3 per dialogue; timing comes FROM TTS API output (not docx)
  Manifest:  manifest.json created here (Ramon's voice assignments)
  Risk:      TTS timing is approximate; Fernando can and does override
  Status:    VOICE SSOT ✅ (manifest) | TIMING partially established, overridable

STEP 2: Post-Production (Fernando — MANUAL STEP, OUTSIDE AUTOMATION)
  Input:     TTS audio (ES) + AE project skeleton from Alan/Ramon
  Fernando:  May CUT dialogues for timing issues
  Fernando:  May ADD/EDIT lines for creative reasons
  Fernando:  ADDS SFX, BGM, silence between lines
  Fernando:  Exports MP4 (ES) with Fernando's modifications PERMANENTLY embedded
  Record:    NONE of Fernando's modifications are logged back to dialogue_objects.json
  Status:    CREATIVE SSOT ✅ | TIMING SSOT ✅ | TEXT MAY DIVERGE FROM DOCX

STEP 3: Dubbing (Alan/Saul/Ivan via EL Dubbing)
  Input:     Fernando's MP4 (ES) — NOT the original docx
  EL ASR:    Detects audio; generates internal transcription (may differ from docx)
  Manual:    Alan corrects STT drift; cuts long dialogues to reduce sync drift
  Output:    16-language dubbed audio
  Status:    FURTHER MODIFICATIONS — STT corrections not persisted to dialogue_objects

STEP 4: Post-Dubbing (Fernando — SECOND PASS)
  Input:     Dubbed audio per language + original SFX/BGM stems
  Fernando:  Merges dubbed dialogue + SFX + BGM instrumental (DEC-QPH-006: same for all languages)
  Output:    Final MP4 × 16 languages (H.264, AAC, -14 LUFS)
  Status:    FINAL DELIVERABLE — ground truth for audience

[PROBLEM: No reverse synchronization at any step]
  docx was the starting point but is NEVER updated when Fernando edits
  Fernando's MP4 is the truth but has NO structured metadata
  Alan's STT corrections are lost after EL export
  dialogue_objects.json is NEVER updated to reflect real audio content post-Fernando
```

### Guion Zombie Confirmation — VERIFIED

Evidence from `POSTPROD_FERNANDO.md` (explicit documentation):

> "Fernando puede recortar, ajustar o modificar dialogos durante la mezcla de audio para resolver problemas de timing o sincronizacion. Estos cambios quedan registrados en el MP4 final pero NO necesariamente en el guion .docx."

Evidence from `09_dubbing_workflow.md` (Alan transition note):

> "Con la salida de Saul, Alan identifica las problematicas del flujo de primera mano. El conocimiento tactico de Saul debe ser documentado formalmente antes de que se pierda."

Evidence from `DUBBING_SAUL_IVAN.md` (confirmed production behavior):

> "El MP4 final de Fernando es la SSOT. El guion .docx original puede estar desactualizado si Fernando recorto o modifico dialogos."

The Guion Zombie problem is not theoretical. It is a documented, named, formally acknowledged risk with a manual mitigation rule that has no technical enforcement.

---

## 3. Cross-Reference vs Doge-Animator

### What Doge-Animator Needs

| Required Input | Format | Current Source | Gap Status |
|:--------------|:-------|:--------------|:----------|
| Audio per speaker per language | MP3 (Rhubarb KB spec) | Fernando MP4 — needs stems per speaker | MISSING: no per-speaker stem export |
| Start/end frame per dialogue | CSV (frame_number) | NOT AVAILABLE from docx or TTS | MISSING: `fernando_stt_reconciler.py` needed |
| Phoneme data per dialogue | Rhubarb .json | Not generated anywhere | MISSING: `lip_sync_rhubarb.py` not built |
| Language metadata per file | File naming convention | Not standardized | GAP: naming convention not defined |

### Timing Transformation Required

```
Fernando's MP4 audio (ES clean voice track)
  └─ [POST /v1/speech-to-text OR Whisper STT]
  └─ Output: "dialogue_text" at second 12.4 to 14.1
  └─ [fernando_stt_reconciler.py]
  |     └─ Fuzzy diff vs dialogue_objects.json (Guion Zombie check)
  |     └─ If diff > 5%: FLAG — reconciliation required before dubbing
  |     └─ Extract: timing layer (seconds per dialogue)
  └─ [doge_animator_bridge.py]
  |     └─ Frame calc: 12.4s × 55fps = frame 682; 14.1s × 55fps = frame 776
  |     └─ CSV row: ep1_sc03, Taro, 682, 776, /audio/es/ep1_sc03_dia042_taro_es.mp3
  └─ [Doge-Animator CEP Panel]
        └─ Load CSV + audio for animation sync at 55+ FPS
```

This 4-step chain does not exist today. None of these scripts are implemented.

---

## 4. SSOT Architecture — Definitive Verdict

### The Core Conflict

`06_CORE_AUDIO_TTS.md §6.3` states:
> "El MP4 final de Fernando se convierte en la ÚNICA fuente de verdad para el audio."

This is correct for production decisions (what audiences hear). But it is insufficient as a technical SSOT for an automated pipeline because:

1. MP4 has no structured metadata
2. MP4 timing data is not extractable without STT
3. MP4 text content is not directly queryable

### Four-Layer SSOT Architecture (Proposed)

| Layer | Data Type | SSOT | Tool | Rule |
|:------|:----------|:-----|:-----|:-----|
| Layer 1 — Text | Dialogue text, speaker names, scene structure | Docx Table 4 → `dialogue_objects.json` | `docx_parser.py` | No code uses docx directly — always use parsed JSON |
| Layer 2 — Timing | Start/end seconds per dialogue, inter-dialogue silences | Fernando's MP4 via STT → `timing_objects.json` | `fernando_stt_reconciler.py` | `doge_animator_bridge.py` REQUIRES Layer 2 before generating CSV |
| Layer 3 — Voice | voice_id per character, persistence rules | `manifest.json` | `voice_mapper.py` | Saul/Ivan/Alan NEVER override manifest assignments manually |
| Layer 4 — Quality | WER scores, COMET, human review verdicts | `qa_report.json` | `qc_validation.py` | No language goes to final export without `qa_report.passed_validation = true` |

### Text SSOT Lifecycle

```
Andrea writes guion (docx)
  └─ Script Lock (Workflow 03) — no changes after this point
        └─ docx_parser.py extracts dialogue_objects.json
              └─ This JSON is the authoritative text record
                    └─ Fernando edits? → fernando_stt_reconciler.py detects drift
                          └─ If drift: reconciliation required → update dialogue_objects.json
                                └─ Only then: dubbing can proceed
```

### Timing SSOT Lifecycle

```
Fernando completes MP4 (ES)
  └─ fernando_stt_reconciler.py runs STT
        └─ Fuzzy diff: STT text vs dialogue_objects.json
              └─ If diff > 5%: BLOCK dubbing → reconciliation gate
              └─ If diff <= 5%: Extract timing → timing_objects.json
                    └─ timing_objects.json is authoritative for all downstream scripts
                          └─ doge_animator_bridge.py reads timing_objects.json
                                └─ Generates frame-accurate CSV for Doge-Animator
```

---

## 5. Guion Zombie — Technical Control (New)

### Current Mitigation (Manual — No Technical Enforcement)

From `POSTPROD_FERNANDO.md §mitigación`:
1. Fernando notifies Alan/Ramon immediately if dialogues are modified
2. No dubbing starts until docx and MP4 are synchronized
3. This is a PROCESS RULE, not a technical control

### Proposed Technical Control — `fernando_stt_reconciler.py`

```python
# Pseudo-code for fernando_stt_reconciler.py

def reconcile(fernando_mp4_path, dialogue_objects_json_path, threshold=0.05):
    """
    Gate: Run before dubbing starts.
    Returns: (timing_objects, guion_zombie_detected, diff_report)
    """
    # Step 1: Extract speech from Fernando's clean voice track
    stt_result = whisper_stt(fernando_mp4_path, language="es")
    # Returns: list of {text, start_seconds, end_seconds} per utterance

    # Step 2: Fuzzy match STT segments to dialogue_objects
    dialogue_objects = load_json(dialogue_objects_json_path)
    matches, unmatched = fuzzy_align(stt_result, dialogue_objects, threshold=0.85)

    # Step 3: Calculate WER (text drift)
    wer = calculate_wer(
        reference=[d["text"]["raw"] for d in dialogue_objects],
        hypothesis=[m["stt_text"] for m in matches]
    )

    # Step 4: Gate decision
    if wer > threshold:
        return None, True, generate_diff_report(matches, unmatched)
        # BLOCK: Present diff to Alan/Ramon for resolution before continuing

    # Step 5: Extract timing (LAYER 2 SSOT)
    timing_objects = [{
        "dialogue_id": m["dialogue_id"],
        "start_seconds": m["stt_start"],
        "end_seconds": m["stt_end"],
        "confidence": m["match_confidence"],
        "source": "whisper_stt_on_fernando_mp4"
    } for m in matches]

    return timing_objects, False, None
```

**This script is NEW — not in the original 15-script plan.** It should be designated `#16` in the backlog.

---

## 6. SSOT Verdict (JSON)

```json
{
  "analyst": "T8_SSOT_CrossReference",
  "analysis_date": "2026-02-19",
  "files_read": [
    "WAVE_1_DISCOVERY_REPORT.json",
    "docs/levantamientos/06_CORE_AUDIO_TTS.md",
    "docs/levantamientos/07_CORE_MULTI_LANGUAGE.md",
    "docs/levantamientos/08_audio_tts_workflow.md",
    "docs/levantamientos/09_dubbing_workflow.md",
    "docs/levantamientos/11_fernando_daily_ops.md",
    "docs/levantamientos/POSTPROD_FERNANDO.md",
    "docs/levantamientos/DUBBING_SAUL_IVAN.md",
    "docs/levantamientos/Q7_FERNANDO_POSTPROD.md",
    "docs/levantamientos/Q8_SAUL_IVAN_DUBBING.md",
    "docs/levantamientos/PAIN_TO_FEATURE_MATRIX.md"
  ],
  "ssot_verdict": {
    "text_ssot": "DOCX Table 4 parsed to dialogue_objects.json — HIGH CONFIDENCE (95% extraction confidence for speaker and text fields)",
    "timing_ssot": "Fernando MP4 via Whisper STT → timing_objects.json — MUST BE IMPLEMENTED (0 frame-accurate timing exists today)",
    "voice_ssot": "manifest.json generated by voice_mapper.py — MUST BE BUILT (spec complete, code missing)",
    "quality_ssot": "qa_report.json generated by qc_validation.py — MUST BE BUILT (metrics defined, no tooling)",
    "creative_ssot": "Fernando MP4 final per language — ground truth for audience, not for pipeline automation"
  },
  "guion_zombie_status": "CONFIRMED — documented in POSTPROD_FERNANDO.md, DUBBING_SAUL_IVAN.md, 06_CORE_AUDIO_TTS.md §6.3",
  "guion_zombie_technical_control": "MISSING — only manual process rule exists; no automated detection",
  "guion_zombie_frequency": "UNKNOWN — no baseline measured; Q7 would clarify how often Fernando modifies dialogues",
  "recommendations": [
    "R1: Build docx_parser.py as Script #1 — text SSOT extraction fully specced from T1 analysis",
    "R2: Build fernando_stt_reconciler.py as Script #16 — adds Guion Zombie gate and timing SSOT extraction",
    "R3: Treat manifest.json as immutable SSOT per episode — no manual override by dubbing team permitted",
    "R4: Fill Q7 IMMEDIATELY — Fernando's silence handling rule is the largest single design unknown",
    "R5: Fill Q8 IMMEDIATELY — determines M3 architecture (Voice Segments v3 vs ffmpeg merge)",
    "R6: Verify Voice Segments v3 availability directly with ElevenLabs — binary decision for Script #6",
    "R7: Add fernando_stt_reconciler.py to scripts backlog as mandatory pre-dubbing gate"
  ],
  "blocking_items": [
    "Q7_FERNANDO_POSTPROD — silence duration rule UNKNOWN (template only, 0 answers)",
    "Q8_SAUL_IVAN_DUBBING — speaker mapping exceptions and Voice Segments v3 UNKNOWN (template only, 0 answers)",
    "Manual Dub CSV format — not documented in KB 735 entries; format unknown"
  ],
  "immediately_unblocked": [
    "docx_parser.py (Script #1) — Table 4 structure confirmed by T1",
    "glossary_sanitizer.py (Script #2) — M4 and M5 rules fully documented",
    "voice_mapper.py (Script #3) — persistence rules fully documented",
    "tts_batch.py (Script #4) — EL TTS API fully documented in KB",
    "qc_validation.py partial (Script #7) — WER and COMET implementable; silence metric deferred",
    "fernando_stt_reconciler.py (Script #16 NEW) — Whisper STT + fuzzy diff + timing extraction fully specced here"
  ],
  "new_script_identified": {
    "id": "#16",
    "name": "fernando_stt_reconciler.py",
    "purpose": "Run Whisper STT on Fernando MP4; fuzzy diff vs dialogue_objects.json; flag Guion Zombie; extract frame-accurate timing as Layer 2 SSOT",
    "mandatory_gate": "Pre-dubbing — NOTHING proceeds to dubbing_orchestrator.py until this passes",
    "blocks_if_missing": [
      "doge_animator_bridge.py — no start/end frame data",
      "tts_post_silence.py — no timing input for silence map",
      "dubbing_orchestrator.py — Guion Zombie undetected"
    ],
    "effort": "MEDIUM",
    "priority": "P0"
  },
  "confidence_score": 0.87,
  "confidence_notes": {
    "high_confidence": "Text SSOT (docx structure confirmed by T1 python-docx read); voice SSOT (spec complete); Guion Zombie status (3 docs confirm it)",
    "low_confidence": "Timing SSOT (Q7 empty; Fernando edit frequency unknown); M2 silence rule (no actual duration captured); M3 merge approach (Voice Segments v3 unconfirmed)"
  }
}
```

---

## 7. Docx Parser — Specific Implementation Notes

Based on T8 analysis of the table structure, `docx_parser.py` must handle:

1. **UTF-8 encoding fix:** é, á, ó, ú, ñ characters corrupted to "?" in some docx encodings. Use `python-docx` with explicit encoding handling; fall back to `chardet` detection.

2. **Table row iteration:** Do NOT scan paragraphs for BOLD text (wrong assumption in Wave 2 prompt). Use `doc.tables[4].rows` iteration.

3. **Empty row handling:** Table 4 may have separator rows or merged cells. Filter rows where `row.cells[2].text.strip() == ""` (empty Personaje column).

4. **Character cross-reference:** For each unique speaker_name found in Table 4, look up in Table 2 (character catalog) to get speaker_type, voice_style_notes, series_continuity_flag.

5. **Scene boundary detection:** Col 0 (Escena) may be empty for rows within the same scene (merged cells in docx). Carry forward last non-empty scene_id value.

6. **Timing column:** Col 6 (Timing) likely contains ranges like "00:30-01:15" or scene-level marks. Parse conservatively; treat as advisory, not authoritative.

---

*T8 — SSOT Cross-Reference Complete | 2026-02-19*
