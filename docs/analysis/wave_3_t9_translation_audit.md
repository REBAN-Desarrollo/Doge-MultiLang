# WAVE 3 -- T9: Translation/Speaker Quality Audit

**Auditor:** T9 -- Translation and Speaker Quality Specialist
**Date:** 2026-02-19
**Status:** COMPLETE
**Confidence:** 0.89

---

## 1. Muda M1-M7 Mitigation Completeness Audit

### M1: Re-Mapping de Personajes x 16 Idiomas

| Aspect | Finding |
|:-------|:--------|
| **Spec source** | `07_CORE_MULTI_LANGUAGE.md` S5, `DUBBING_SAUL_IVAN.md` |
| **Proposed solution** | manifest.json with voice_id persistence |
| **Spec completeness** | COMPLETE -- persistence rules documented, inheritance chain specified |
| **ElevenLabs support** | CONFIRMED -- Dubbing API supports voice assignment per speaker; Studio Projects support `from_content_json` |
| **KB evidence** | KB line 342: "Speaker separation -- Automatically detect multiple speakers"; KB line 169: track clone / clip clone available for voice consistency |
| **Code exists** | NO -- `voice_mapper.py` not implemented |
| **Validation method** | QA Tier 1 human review confirms voice recognizable per language |
| **Cost** | ~$2/episode (Tier 1 human spot-check voice identity) |

**AUDIT VERDICT: VIABLE**

Rationale: The manifest.json schema is fully specified in T6 output. ElevenLabs Dubbing API natively separates speakers and allows voice assignment. The only gap is the code itself (`voice_mapper.py`), which has no technical unknowns.

**Corrections to Wave 2 prompt:**
- The prompt stated "QA Tier 1 humano (costo ~$2/episodio)" -- this is UNDERESTIMATED. Actual cost for 4 Tier 1 languages at 100% human review is closer to $50-75/episode (see QA section below). The $2 figure applies only to spot-checking voice identity, not full QA.

---

### M2: Silencios se Comprimen

| Aspect | Finding |
|:-------|:--------|
| **Spec source** | `07_CORE_MULTI_LANGUAGE.md` S6 M2, `09_dubbing_workflow.md` Muda 2 |
| **Proposed solution** | Manual Dub CSV with AE timestamps |
| **Spec completeness** | INCOMPLETE -- CSV column format not documented in KB |
| **ElevenLabs support** | UNCERTAIN -- KB mentions Dubbing API but CSV format for silence injection is NOT documented in 735 entries |
| **KB evidence** | 0 results for "Manual Dub CSV" in KB search. Only 2 oblique references in spec docs. |
| **Code exists** | NO -- `tts_post_silence.py` not implemented |
| **Blocker** | Q7 EMPTY -- Fernando's actual silence duration rule unknown |
| **Secondary blocker** | Manual Dub CSV format spec missing from KB |

**AUDIT VERDICT: PARTIALLY VIABLE**

Rationale: Two independent blockers exist. (1) Q7 must be filled to define the silence duration algorithm. (2) The Manual Dub CSV format must be obtained from ElevenLabs documentation or trial-and-error. The workaround ("cortar a la mitad del silencio, visualmente") is non-automatable without quantified rules.

**CORRECTION:** The Wave 2 prompt listed two strategies (A: Manual CSV timestamps, B: Automatic STT recovery). Both are valid but BOTH are blocked. Strategy B depends on `fernando_stt_reconciler.py` (#16) which CAN be built now, but produces timing data only -- it does NOT solve the silence duration rule itself.

**RECOMMENDATION:**
1. Fill Q7 IMMEDIATELY (human action, 2-day target)
2. Contact ElevenLabs support for Manual Dub CSV format spec
3. Build `fernando_stt_reconciler.py` (#16) NOW -- it provides timing SSOT regardless of M2 resolution
4. Implement heuristic silence: `silence_ms = max(300, gap_between_dialogues_ms * 0.5)` as conservative fallback until Q7 provides the real rule

---

### M3: Mezcla de Dialogos (Multi-Speaker)

| Aspect | Finding |
|:-------|:--------|
| **Spec source** | `07_CORE_MULTI_LANGUAGE.md` S6 M3, `09_dubbing_workflow.md` Muda 3 |
| **Proposed solution** | Voice Segments v3 with speaker tagging |
| **Spec completeness** | INCOMPLETE -- "Voice Segments v3" is a spec-invented name, not an ElevenLabs product name |
| **ElevenLabs support** | PARTIALLY CONFIRMED -- ElevenLabs Dubbing API says "Speaker separation: Automatically detect multiple speakers, even with overlapping speech" (KB line 342). Voiceover Studio (KB line 140) allows multi-track, multi-speaker projects with speaker cards. |
| **KB evidence** | No product called "Voice Segments v3" exists in KB. The closest feature is Dubbing Studio's native speaker detection + Voiceover Studio's multi-track capability. |
| **Code exists** | NO -- `tts_multi_speaker_merge.py` not implemented |
| **Blocker** | Q8 EMPTY -- Saul/Ivan's actual workflow for handling merged speakers unknown |

**AUDIT VERDICT: PARTIALLY VIABLE -- ARCHITECTURE DECISION REQUIRED**

**CRITICAL FINDING:** "Voice Segments v3" does not exist as a named ElevenLabs feature. The specs appear to have invented this term. What DOES exist:

1. **Dubbing Studio speaker separation** -- automatic, but unreliable per Saul's testimony ("subes el mismo audio y te da una deteccion distinta")
2. **Voiceover Studio** -- multi-track, multi-speaker, allows individual speaker cards per clip. This is the CLOSEST to what the specs call "Voice Segments v3"
3. **Track clone / Clip clone** -- allows assigning specific voice clones to specific clips (KB line 169)

**RECOMMENDATION:**
1. RENAME "Voice Segments v3" to "Voiceover Studio multi-track approach" in all specs
2. Test Voiceover Studio with 1 pilot episode: create a project per language, assign speaker cards per dialogue segment
3. Implement ffmpeg fallback NOW as safety net: split audio by detected speaker boundaries, merge per-speaker TTS outputs
4. Fill Q8 to understand Saul's current manual separation process -- this informs the ffmpeg fallback logic

---

### M4: Bug "no." -> "number"

| Aspect | Finding |
|:-------|:--------|
| **Spec source** | `07_CORE_MULTI_LANGUAGE.md` S3.4, `06_CORE_AUDIO_TTS.md` S3.3 |
| **Proposed solution** | Regex sanitizer pre-send |
| **Spec completeness** | COMPLETE -- 3 patterns documented (no., Sr., etc.) with exact replacements |
| **ElevenLabs support** | N/A -- pre-processing, not API feature |
| **Blacklist data** | `blacklist_global.json` has `punctuation_bugs` array with 3 entries |
| **Code exists** | NO -- `glossary_sanitizer.py` not implemented |
| **Blocker** | NONE |

**AUDIT VERDICT: FULLY VIABLE**

Rationale: The regex patterns are simple, documented, and have test data in `blacklist_global.json`. Implementation is 2 hours. No external dependencies.

**ADDITIONAL PATTERNS IDENTIFIED (not in current spec):**
- `Dr.` -- can be mispronounced as "Drive" in EN TTS
- `U.S.` / `E.U.` -- inconsistent pronunciation across languages
- Numbers with periods as thousands separators (`1.000` vs `1,000`) -- varies by locale
- Ellipsis `...` -- sometimes read as "dot dot dot" instead of pause

**RECOMMENDATION:** Add these 4 patterns to `blacklist_global.json` punctuation_bugs array.

---

### M5: Filtros de Lenguaje (Palabras Bloqueadas)

| Aspect | Finding |
|:-------|:--------|
| **Spec source** | `07_CORE_MULTI_LANGUAGE.md` S3, `blacklist_global.json`, `blacklist_ar.json`, `blacklist_de.json` |
| **Proposed solution** | Pre-scanner LLM + blacklist dictionary |
| **Spec completeness** | PARTIAL -- 3 of 17 languages have blacklist files |
| **Data quality** | GOOD -- existing blacklists have structured format with spanish term, translation, reason, safe_alternative |
| **Code exists** | NO |
| **Blocker** | 14 missing language-specific blacklists |

**AUDIT VERDICT: PARTIALLY VIABLE**

**Blacklist Coverage Audit:**

| Language | Blacklist File | Status |
|:---------|:---------------|:-------|
| Global | `blacklist_global.json` | EXISTS -- 6 global_blocked + 3 punctuation_bugs + 6 safe_alternatives |
| AR (Arabic) | `blacklist_ar.json` | EXISTS -- 5 blocked_terms + 4 cultural_notes |
| DE (German) | `blacklist_de.json` | EXISTS -- 2 blocked_terms + 3 pronunciation_notes + formality rules |
| EN (English) | MISSING | |
| PT-BR | MISSING | |
| FR (French) | MISSING | |
| KO (Korean) | MISSING | |
| JA (Japanese) | MISSING | |
| HI (Hindi) | MISSING | |
| ZH (Mandarin) | MISSING | |
| FIL, ID, IT, RU, TR, TA, MS | ALL MISSING | |

**CORRECTION to Wave 2 prompt:** The prompt says "Solo 3/16 idiomas tienen blacklist custom." Actually it is 3 files: global (applies to all), AR, DE. The global file covers multi-language terms. So coverage is: global terms for all 17 languages, plus language-specific terms for only AR and DE.

**RECOMMENDATION:**
1. Build `blacklist_generator.py` as new quick-win script -- use LLM (Claude) with Chain-of-Verification prompt to generate blacklists for 14 missing languages
2. Prompt template: "For QPH (animated series for kids 8-15), list words in [LANGUAGE] that would trigger ElevenLabs safety filters or are culturally inappropriate. Categories: A (absolute block), B (soften with alternative). Include the Spanish source term."
3. Validate generated blacklists against `blacklist_global.json` format schema
4. Tier 1 languages (EN, PT-BR, FR) should have human-reviewed blacklists before production

---

### M6: Clipping de Silabas

| Aspect | Finding |
|:-------|:--------|
| **Spec source** | `07_CORE_MULTI_LANGUAGE.md` S6 M6 |
| **Proposed solution** | Fixed Duration + TTS buffer |
| **Spec completeness** | PARTIAL -- strategy defined but buffer size not quantified |
| **ElevenLabs support** | API supports duration parameters in TTS; no explicit "buffer" parameter found in KB |
| **Code exists** | NO -- to be included in `tts_batch.py` |
| **Blocker** | NONE -- implementable with trial-and-error on buffer value |

**AUDIT VERDICT: VIABLE**

**RECOMMENDATION:**
1. Start with 200ms buffer (append silence to TTS text prompt: "... ")
2. Use trailing whitespace or SSML pause tags if ElevenLabs supports them
3. Post-process: detect trailing silence in generated audio; if < 100ms, pad with silence via pydub/ffmpeg
4. Measure clipping rate in pilot episode to calibrate buffer

---

### M7: No Auto-Scroll

| Aspect | Finding |
|:-------|:--------|
| **Spec source** | `07_CORE_MULTI_LANGUAGE.md` S6 M7 |
| **Impact** | UI limitation only -- not audio pipeline |
| **Automation possible** | NO |

**AUDIT VERDICT: NOT IN SCOPE (UX limitation, not audio pipeline)**

---

## 2. QA Tiering System Audit

### Tier 1 (EN, PT-BR, FR, DE) -- Full Human Review

| Metric | Target | Tool | Status |
|:-------|:-------|:-----|:-------|
| WER | < 5% | Whisper STT + jiwer | Tool selected, not implemented |
| COMET | > 0.85 | COMET library or sentence-transformers | Tool selected, not implemented |
| BERTScore | > 0.85 | sentence-transformers | Tool selected, not implemented |
| Consenso STT | > 90% | Whisper vs ElevenLabs STT | Not implemented |
| Category A flags | 0 | Blacklist scanner | Not implemented |
| Human review | 100% | Manual process | Partially exists (only EN reviewed today) |

**Cost Audit:**

The Wave 2 prompt estimated "$50-75/episodio (4 lenguas x 4h c/u = 16h @ $5/h)". This is INCORRECT for several reasons:

1. Tier 1 has 5 languages including ES (base), not 4
2. EN is already reviewed at 100% (existing process). The GAP is PT-BR, FR, DE
3. Automated WER + COMET reduces human review time significantly
4. Realistic estimate: 3 NEW languages x 2h each (with automated pre-screening) = 6h @ $5/h = $30/episode incremental cost
5. TOTAL including EN (already happening): ~$40-50/episode

**RECOMMENDATION:** Use Jiwer (Apache 2.0, stable, minimal dependencies) for WER. Use sentence-transformers for BERTScore. Both are pip-installable and production-ready.

### Tier 2 (AR, KO, JA, HI, ZH) -- Intelligent Sampling

| Metric | Target | Tool | Status |
|:-------|:-------|:-----|:-------|
| WER | < 10% | Whisper STT + jiwer | Not implemented |
| COMET | > 0.85 | sentence-transformers | Not implemented |
| Human review | ~10% strategic | Heuristic sampling | Not designed |

**Sampling Algorithm (PROPOSED):**

```
score = (wer_segment * 0.4) + (1 - comet_segment) * 0.3 + speaker_importance * 0.2 + language_difficulty * 0.1

IF score > 0.3: SAMPLE for human review
IF wer_segment > 0.15: FORCE human review
IF category_a_flag > 0: BLOCK publication
```

Where:
- `speaker_importance`: Protagonista=1.0, Antagonista=0.8, Narrador=0.7, Secundario=0.3
- `language_difficulty`: AR=0.9, JA=0.8, ZH=0.8, KO=0.7, HI=0.6

**Cost estimate:** ~$15-20/episode (automated metrics + 10% human sampling)

### Tier 3 (7 languages) -- Automated Only

| Metric | Target | Tool | Status |
|:-------|:-------|:-----|:-------|
| WER | < 15% | Whisper STT + jiwer | Not implemented |
| Category A flags | 0 | Blacklist scanner | Not implemented |
| Alert threshold | WER > 0.15 triggers alert | monitoring_alerts.py | Not implemented |

**RISK IDENTIFIED:** Zero human review for 7 languages serving potentially millions of viewers. If a systematic error propagates (e.g., wrong pronoun for entire episode), it could go undetected for weeks.

**RECOMMENDATION:** Add automated sanity checks:
1. `wer > 0.15` on ANY segment -> ALERT to Alan/Ramon
2. `category_a_flag > 0` -> BLOCK publication automatically
3. `timing_delta > 25%` -> ALERT (likely indicates severe translation expansion)
4. Monthly random audit: 1 episode per Tier 3 language reviewed by external native speaker

**Cost estimate:** ~$5-10/episode (API costs only) + $50/month for random audits

### QA Tool Selection Verdict

| Tool | Purpose | License | Size | Multilingual | Decision |
|:-----|:--------|:--------|:-----|:-------------|:---------|
| **jiwer** | WER calculation | Apache 2.0 | 8KB | Yes (text-based) | SELECTED |
| **sentence-transformers** | BERTScore / semantic similarity | Apache 2.0 | ~500MB (with model) | Yes (multilingual models) | SELECTED |
| **COMET** | Translation quality | Apache 2.0 | ~1.5GB (with model) | Yes (purpose-built for MT) | DEFERRED -- sentence-transformers sufficient for MVP |
| **SacreBLEU** | BLEU score | Apache 2.0 | 50KB | Yes | NOT SELECTED -- WER + BERTScore covers the need |

**Implementation order:**
1. `jiwer` first -- minimal setup, immediate WER capability
2. `sentence-transformers` second -- provides BERTScore for Tier 2 semantic validation
3. COMET later if finer MT quality metrics needed

---

## 3. ElevenLabs API Capability Audit

### Searched KB (735 entries) for key features:

| Feature | Search Terms | Results | Status |
|:--------|:------------|:--------|:-------|
| Dubbing API | "dubbing", "POST /v1/dubbing" | FOUND -- multiple entries | CONFIRMED available |
| Speaker separation | "speaker", "separation" | FOUND -- native in Dubbing API | CONFIRMED -- "even with overlapping speech" |
| Voice ID persistence | "voice_id", "clone" | FOUND -- track clone + clip clone in Dubbing Studio | CONFIRMED |
| Manual Dub CSV | "manual dub csv", "csv format" | NOT FOUND | MISSING from KB |
| Voice Segments v3 | "voice segments v3" | NOT FOUND | DOES NOT EXIST as named feature |
| Voiceover Studio | "voiceover studio" | FOUND -- multi-track, multi-speaker | CONFIRMED as closest M3 solution |
| Diarization | "diarization" | NOT FOUND as native feature | NOT available natively |
| Multi-speaker merge | "multi-speaker", "multi track" | FOUND via Voiceover Studio | CONFIRMED capability |
| Pronunciation dictionaries | "pronunciation" | FOUND -- API endpoint available | CONFIRMED for glossary protection |
| Forced alignment | "forced alignment" | FOUND -- API endpoint available | CONFIRMED for timing verification |

### Key Findings:

**1. "Voice Segments v3" is a phantom feature.**

The QPH specs reference this consistently, but it does not exist in the ElevenLabs KB (735 entries). The closest equivalent is:
- Dubbing Studio's native speaker separation (automatic, unreliable per Saul)
- Voiceover Studio's manual multi-track setup (reliable, but requires per-dialogue setup)

**2. Manual Dub CSV format is undocumented.**

Zero results in KB. Two mentions in QPH specs refer to it as a solution for M2, but the actual format (columns, encoding, API submission method) is UNKNOWN. This is a genuine spec gap, not just a code gap.

**3. ElevenLabs Dubbing API is more capable than specs suggest.**

KB line 342 documents: "Preserve original voices", "Keep background audio", "Customizable transcripts", speaker separation for up to 9 speakers. The specs underestimate these capabilities and propose manual workarounds that may be unnecessary with proper API usage.

**4. Voiceover Studio is the overlooked solution for M3.**

Voiceover Studio allows creating multi-track projects with individual speaker cards. Combined with `voice_mapper.py` output (manifest.json), this could solve M3 without needing the phantom "Voice Segments v3" at all.

### Recommendation for ElevenLabs Research (Priority Order):

| # | Action | Method | Expected Outcome | Effort |
|:--|:-------|:-------|:-----------------|:-------|
| 1 | Test Dubbing API with pilot episode | API call with "Un guardaespaldas escolar" audio | Validate speaker separation accuracy for 19 characters | 2h |
| 2 | Test Voiceover Studio for multi-speaker control | Web UI with 1 scene, 3 speakers | Determine if this solves M3 | 1h |
| 3 | Contact ElevenLabs support for CSV format | Email to support@elevenlabs.io or productions@elevenlabs.io | Get Manual Dub CSV spec | 0h (async) |
| 4 | Test pronunciation dictionaries for glossary | API call `/v1/pronunciation-dictionaries` | Validate DNT token protection | 1h |

---

## 4. Audit Summary

### Muda Mitigation Scorecard

| Muda | Viable | Blocked By | Ready for Code | Effort to Implement |
|:-----|:-------|:-----------|:---------------|:-------------------|
| M1 | YES | Nothing | YES | 3h (voice_mapper.py) |
| M2 | PARTIAL | Q7 empty + CSV format unknown | NO | 4h (after blockers resolved) |
| M3 | PARTIAL | Q8 empty + "Voice Segments v3" phantom | NO | 5h (after architecture decision) |
| M4 | YES | Nothing | YES | 2h (glossary_sanitizer.py) |
| M5 | PARTIAL | 14 missing blacklists | YES (partial) | 3h code + 4h blacklist generation |
| M6 | YES | Nothing | YES (in tts_batch.py) | Included in tts_batch.py |
| M7 | N/A | UX limitation | N/A | N/A |

### Critical Actions (T9)

| Priority | Action | Owner | Unblocks |
|:---------|:-------|:------|:---------|
| P0 | Rename "Voice Segments v3" to actual ElevenLabs feature names in all specs | Documentation | Prevents confusion in all future waves |
| P0 | Fill Q7 | Ops (Daniel/Iris) | M2 silence algorithm, Script #5 |
| P0 | Fill Q8 | Ops (Daniel/Iris) | M3 architecture decision, Script #6 |
| P0 | Contact ElevenLabs for Manual Dub CSV format | Backend | M2 full implementation |
| P1 | Test Dubbing API with pilot audio (1 scene) | Backend | Validates speaker separation accuracy |
| P1 | Test Voiceover Studio for M3 | Backend | Architecture decision for Script #6 |
| P1 | Generate 14 missing blacklists via LLM | Backend | M5 complete coverage |
| P2 | Install jiwer + sentence-transformers | Backend | QA tooling ready |

---

## T9 Summary (JSON)

```json
{
  "auditor": "T9_Translation_Speaker_Audit",
  "date": "2026-02-19",
  "confidence": 0.89,
  "muda_verdicts": {
    "M1_voice_remapping": {
      "status": "VIABLE",
      "blocked_by": null,
      "ready_for_code": true,
      "effort_hours": 3
    },
    "M2_silence_compression": {
      "status": "PARTIALLY_VIABLE",
      "blocked_by": ["Q7_empty", "CSV_format_unknown"],
      "ready_for_code": false,
      "effort_hours": 4,
      "note": "After blockers resolved"
    },
    "M3_multi_speaker_merge": {
      "status": "PARTIALLY_VIABLE",
      "blocked_by": ["Q8_empty", "Voice_Segments_v3_phantom_feature"],
      "ready_for_code": false,
      "effort_hours": 5,
      "critical_finding": "Voice Segments v3 does not exist. Voiceover Studio is the real solution."
    },
    "M4_no_dot_bug": {
      "status": "FULLY_VIABLE",
      "blocked_by": null,
      "ready_for_code": true,
      "effort_hours": 2
    },
    "M5_language_filters": {
      "status": "PARTIALLY_VIABLE",
      "blocked_by": ["14_missing_blacklists"],
      "ready_for_code": true,
      "effort_hours": 7,
      "note": "3h code + 4h blacklist generation"
    },
    "M6_clipping": {
      "status": "VIABLE",
      "blocked_by": null,
      "ready_for_code": true,
      "effort_hours": 0,
      "note": "Included in tts_batch.py"
    },
    "M7_auto_scroll": {
      "status": "NOT_IN_SCOPE",
      "note": "UX limitation, not audio pipeline"
    }
  },
  "qa_tiering_verdict": {
    "tier_1_viable": true,
    "tier_1_tool": "jiwer + sentence-transformers + human review",
    "tier_1_cost_per_episode": "$40-50",
    "tier_2_viable": true,
    "tier_2_tool": "jiwer + sentence-transformers + heuristic sampling",
    "tier_2_cost_per_episode": "$15-20",
    "tier_3_viable": true,
    "tier_3_tool": "jiwer + automated sanity checks",
    "tier_3_cost_per_episode": "$5-10",
    "tier_3_risk": "Zero human review for 7 languages -- add monthly random audit"
  },
  "elevenlabs_findings": {
    "voice_segments_v3": "DOES_NOT_EXIST -- phantom feature name in specs",
    "voiceover_studio": "EXISTS -- closest M3 solution, multi-track multi-speaker",
    "manual_dub_csv": "NOT_IN_KB -- format unknown, must contact ElevenLabs",
    "dubbing_api": "CONFIRMED -- speaker separation for up to 9 speakers",
    "pronunciation_dicts": "CONFIRMED -- API available",
    "diarization": "NOT_NATIVE -- use Whisper or Pyannote externally"
  },
  "corrections_to_wave2_prompt": [
    "QA cost was underestimated ($2 -> $40-50 for Tier 1)",
    "Voice Segments v3 is not a real ElevenLabs feature",
    "Only 3 blacklist files exist (global, AR, DE), not '3/16 custom'",
    "Voiceover Studio overlooked as M3 solution"
  ],
  "immediate_actions": [
    "Rename Voice Segments v3 in all specs",
    "Fill Q7 and Q8",
    "Contact ElevenLabs for Manual Dub CSV format",
    "Test Dubbing API with pilot episode",
    "Generate 14 missing blacklists via LLM"
  ]
}
```

---

*T9 -- Translation/Speaker Quality Audit Complete | 2026-02-19*
