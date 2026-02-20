# WAVE 2 — T7: Gap Analysis Matrix Analyst

**Analyst:** T7 — Gap Specialist
**Date:** 2026-02-19
**Status:** COMPLETE
**Confidence:** 0.88

---

## 1. Master Gap Matrix (20 Gaps Total)

| # | Component | Specification Source | Current Status | Gap Type | Blocks Script(s) | Workaround Exists | Effort | Evidence | Confidence |
|:--|:----------|:--------------------|:--------------|:---------|:----------------|:-----------------|:-------|:---------|:----------|
| 1 | `docx_parser.py` | `06_CORE_AUDIO_TTS.md §3.1`, `08_audio_tts_workflow.md Step 1` | EMPTY — 0 lines of code | MISSING_CODE | YES — ALL 15+ scripts | Manual extraction (1h/episode) | HIGH | README backlog #1, Wave 1 T1 | HIGH |
| 2 | `voice_mapper.py` | `06_CORE_AUDIO_TTS.md §2`, `08_audio_tts_workflow.md Step 2` | EMPTY — 0 lines of code | MISSING_CODE | YES — #4,5,6,7,9,10,11 | Manual by Ramon | MEDIUM | `08_audio_tts_workflow.md Paso 2` | HIGH |
| 3 | M1 Voice Persistence | `07_CORE_MULTI_LANGUAGE.md §5`, `DUBBING_SAUL_IVAN.md` | Schema designed in specs; no code | DESIGN_ONLY | YES — manifest.json not generated | Saul memorizes "de memoria" (~5-10min × 16 langs) | MEDIUM | `DUBBING_SAUL_IVAN.md §Muda M1` | HIGH |
| 4 | **M2 Silence Handling** | `07_CORE_MULTI_LANGUAGE.md §6 M2`, `09_dubbing_workflow.md Muda 2` | Workaround documented; NO algorithm; NO code | UNKNOWN + MISSING_CODE | YES — blocks #5, #7 silence metric | Visual waveform cutting by Alan/Saul | HIGH | `Q7_FERNANDO_POSTPROD.md` EMPTY | **LOW — Q7 missing** |
| 5 | **M3 Mezcla de dialogos** | `07_CORE_MULTI_LANGUAGE.md §6 M3`, `09_dubbing_workflow.md Muda 3` | Voice Segments v3 listed as solution; EL API status unknown; NO code | UNKNOWN API + MISSING_CODE | YES — blocks #6 | Manual separation by Alan/Saul | HIGH | `Q8_SAUL_IVAN_DUBBING.md` EMPTY, EL roadmap | **LOW — Q8 missing** |
| 6 | M4 No. Bug Sanitizer | `07_CORE_MULTI_LANGUAGE.md §3.4`, `06_CORE_AUDIO_TTS.md §3.3` | Regex rule defined; NO code implementation | DESIGN_ONLY | NO | Manual text edit in EL Studio | LOW | `09_dubbing_workflow.md Muda 4` | HIGH |
| 7 | M5 Glossary Protection | `09_GLOSSARY_STRATEGY.md`, `07_CORE_MULTI_LANGUAGE.md §3.1` | 3-layer mechanism designed; no code | DESIGN_ONLY | NO | Manual pre-scan | MEDIUM | `09_GLOSSARY_STRATEGY.md §mechanisms` | HIGH |
| 8 | M6 Clipping Mitigation | `07_CORE_MULTI_LANGUAGE.md §6 M6`, `09_dubbing_workflow.md Muda 6` | Strategy defined (Fixed Duration + buffer); no code | DESIGN_ONLY | NO | Manual recorte by Alan/Saul | LOW | `09_dubbing_workflow.md Muda 6` | HIGH |
| 9 | QA Tier 1 WER tooling | `10_QA_TIERING.md`, `07_CORE_MULTI_LANGUAGE.md §4` | WER targets defined; NO tool selected or implemented | MISSING_CODE | YES — blocks `qc_validation.py` | None automated | MEDIUM | `10_QA_TIERING.md §6` | HIGH |
| 10 | COMET/BERTScore metrics | `07_CORE_MULTI_LANGUAGE.md §4.1`, `09_dubbing_workflow.md A2` | Defined in specs; NO implementation | MISSING_CODE | YES — for Tier 2/3 validation | Manual human check only | MEDIUM | `07_CORE_MULTI_LANGUAGE.md §4.1` | HIGH |
| 11 | **Fernando's silence workflow** | `POSTPROD_FERNANDO.md`, `11_fernando_daily_ops.md` | Described qualitatively; exact rule NOT quantified | UNKNOWN — Q7 EMPTY | YES — M2 algorithm depends on this | Manual by Alan | HIGH | `Q7_FERNANDO_POSTPROD.md` TEMPLATE ONLY | **LOW** |
| 12 | **Saul/Ivan speaker mapping steps** | `DUBBING_SAUL_IVAN.md`, `09_dubbing_workflow.md` | Qualitative description only; re-mapping exceptions not captured | UNKNOWN — Q8 EMPTY | YES — M3 and M1 validation | Manual by Alan | HIGH | `Q8_SAUL_IVAN_DUBBING.md` TEMPLATE ONLY | **LOW** |
| 13 | Doge-Animator bridge | `WAVE_1_DISCOVERY_REPORT.json T3` | No integration API; CSV format not defined | MISSING_CODE + MISSING_SPEC | YES — blocks #11, #12 | Manual file export | HIGH | `WAVE_1_DISCOVERY_REPORT.json T3.dependencies_with_doge_multilang` | MEDIUM |
| 14 | Timing data from Fernando MP4 | `06_CORE_AUDIO_TTS.md §6.3`, `POSTPROD_FERNANDO.md` | Fernando MP4 is creative SSOT but timing not extractable without STT | MISSING_INTEGRATION | YES — all frame-accurate timing depends on this | Whisper STT on MP4 (not implemented) | HIGH | `POSTPROD_FERNANDO.md §SSOT` | HIGH |
| 15 | Manuel Dub CSV format spec | `09_dubbing_workflow.md Muda 2 mitigación` | Mentioned as M2 mitigation; NOT documented in KB (735 entries) | MISSING_SPEC + KB_GAP | YES — `tts_post_silence.py` needs this | None — format unknown | HIGH | KB search: 0 results for "Manual Dub CSV" | HIGH |
| 16 | Voice Segments v3 availability | `07_CORE_MULTI_LANGUAGE.md §6.1`, KB | Listed as "Pending" from EL roadmap; actual API availability unconfirmed | UNKNOWN API | YES — M3 primary solution | ffmpeg forced-alignment (complex) | HIGH | `07_CORE_MULTI_LANGUAGE.md §6.1 M3` | UNKNOWN |
| 17 | Docx encoding issue | `WAVE_1_DISCOVERY_REPORT.json T1` | "é -> ?" encoding bug detected in Table 4 | KNOWN_BUG | Partial — affects character detection | Manual UTF-8 correction | LOW | `WAVE_1_DISCOVERY_REPORT.json T1.metadata_extracted` | HIGH |
| 18 | Doge-Animator audio import | `WAVE_1_DISCOVERY_REPORT.json T3` | No audio file receiver in CEP panel | MISSING_CODE | YES — animation sync impossible without it | Manual import via AE audio layer | HIGH | `WAVE_1_DISCOVERY_REPORT.json T3.capability_matrix_today` | HIGH |
| 19 | Rhubarb lip-sync integration | `WAVE_1_DISCOVERY_REPORT.json T3` | Docs exist in Doge-Animator KB; not connected to CEP panel | PARTIAL_SPEC | NO — defers to Fase 2 | Manual Rhubarb run outside panel | MEDIUM | `WAVE_1_DISCOVERY_REPORT.json T3.kb_structure.rhubarb_lipsync` | HIGH |
| 20 | Audio format compatibility | `WAVE_1_DISCOVERY_REPORT.json T3` | Rhubarb KB specifies MP3; TTS outputs MP3; format confirmed compatible | NOT_A_GAP | N/A | None needed | NONE | KB cross-check | HIGH |

---

## 2. Critical Questions Status

| Question | Specification | Status | Evidence | Impact If Stays Empty |
|:---------|:-------------|:-------|:---------|:---------------------|
| Q1: Speaker types (4) | 4 types defined | DEFINED | `06_CORE_AUDIO_TTS.md §2` | None — can proceed immediately |
| Q2: Dialogue boundaries | Table 4 structure analyzed (8-col) | PARTIALLY_DEFINED | T1 wave analysis; 13 scenes, 8 cols confirmed | Parser designable; timing still unknown |
| Q3: Docx table format | 8 tables confirmed, Table 4 is script | DEFINED | `WAVE_1_DISCOVERY_REPORT.json T1.docx_format_analysis` | Can build parser now |
| Q4: ElevenLabs API endpoints | TTS, Dubbing, STT, Forced Alignment documented | DEFINED | KB 735 entries | All core endpoints available |
| Q5: QA tiers and WER targets | 3 tiers, WER targets defined | DEFINED | `10_QA_TIERING.md`, `07_CORE_MULTI_LANGUAGE.md §4` | Can implement qc_validation.py |
| Q6: Blacklist content | Global + AR + DE files exist | PARTIALLY_DEFINED | `knowledgebase/blacklists/` — 3 of 16 languages covered | Missing 13 language blacklists |
| **Q7: Fernando's silence handling** | "Cortar a la mitad del silencio" | **NOT_FILLED** | `Q7_FERNANDO_POSTPROD.md` — template only, 0 answers | BLOCKING: Cannot define silence duration rule; cannot spec `tts_post_silence.py` |
| **Q8: Saul/Ivan speaker mapping** | "Memorizar de orden" described | **NOT_FILLED** | `Q8_SAUL_IVAN_DUBBING.md` — template only, 0 answers | BLOCKING: Cannot validate M1 implementation; cannot spec M3 workaround; Voice Segments v3 status unknown |

**IMPLICATION:** Q1 through Q6 can all proceed to code immediately. Only Q7 and Q8 are hard blockers, and they block only scripts #5 and #6 specifically. Scripts #1, #2, #3, #4, #7 (partial), #13, #14, #15, #16 can all begin in parallel.

---

## 3. Conflict Matrix

| # | Conflict | Spec A | Spec B | Resolution |
|:--|:---------|:-------|:-------|:-----------|
| 1 | WER target Tier 1 | `06_CORE_AUDIO_TTS.md §4.2`: "WER < 10% promedio" | `07_CORE_MULTI_LANGUAGE.md §4`: "Tier 1 WER < 5%" | Use 5% for Tier 1 per 07_CORE (more specific doc). 10% is episode average across all tiers combined. |
| 2 | WER target Tier 2 | `06_CORE_AUDIO_TTS.md §4.1`: "Tier 2 = WER 5-15%" | `07_CORE_MULTI_LANGUAGE.md §4`: "Tier 2 WER < 10%" | Use 10% per 07_CORE. 06_CORE Tier 2 range was a draft bound. |
| 3 | Silence duration rule | `07_CORE_MULTI_LANGUAGE.md §6 M2`: implies fixed value | Fernando's actual process: "visual, a la mitad" — NOT a fixed value | UNRESOLVABLE without Q7. Do NOT hardcode 800ms until Fernando validates. |
| 4 | Docx as SSOT | `06_CORE_AUDIO_TTS.md §6.3`: "MP4 final de Fernando = ÚNICA fuente de verdad" | Need for text SSOT for pipeline | NOT a conflict — both true for different data types. Docx = text SSOT; MP4 = timing SSOT. (See T8.) |
| 5 | Voice Segments v3 for M3 | `07_CORE_MULTI_LANGUAGE.md §6.1`: "Pendiente" | KB: "Pending from ElevenLabs" | Same status from two sources. Genuine unknown, not a conflict. |
| 6 | Translation chain | `07_CORE_MULTI_LANGUAGE.md §2.2`: "ES → EN → all others" | `09_dubbing_workflow.md Paso 2`: ES audio into EL → produces EN | Not a conflict. 07_CORE specifies architecture; 09 specifies UI step. ES audio enters EL Dubbing → EN output; EN feeds others. |
| 7 | Dubbing scope (songs) | Earlier spec implied all audio dubbed | `09_dubbing_workflow.md DEC-QPH-006`: "songs are instrumental — NO lyrics to dub" | RESOLVED by formal decision DEC-QPH-006 (2026-02-17). Songs pass unchanged. |
| 8 | Voice re-mapping allowed | `07_CORE_MULTI_LANGUAGE.md §5.1`: "Re-mapping PROHIBIDO" | `DUBBING_SAUL_IVAN.md`: "Saul asigna de memoria y re-mapea a veces" | Spec is clear: re-mapping is prohibited. Saul's current practice is the problem. manifest.json is the technical enforcement. |

---

## 4. Dependencies Between Gaps — Blocking Chain Analysis

```
BLOCKING CHAIN 1 — Silence Algorithm (M2):

Q7_FERNANDO_EMPTY (Gap #11)
  └─→ BLOCKS: Silence duration rule definition (Gap #4)
        └─→ BLOCKS: tts_post_silence.py (Script #5)
              └─→ BLOCKS: qc_validation.py silence accuracy metric
                    └─→ BLOCKS: Piloto episode full QA compliance

BLOCKING CHAIN 2 — Multi-Speaker Merge (M3):

Q8_SAUL_IVAN_EMPTY (Gap #12)
  └─→ BLOCKS: Voice Segments v3 status clarification (Gap #16)
        └─→ BLOCKS: tts_multi_speaker_merge.py (Script #6)
              └─→ BLOCKS: dubbing_orchestrator.py multi-track input
                    └─→ BLOCKS: Speaker consistency metric in qc_validation.py
                          └─→ BLOCKS: Tier 1 QA speaker consistency KPI

BLOCKING CHAIN 3 — Timing Data (Fernando MP4 → Animation):

Fernando MP4 timing (Gap #14) [no technical control today]
  └─→ BLOCKS: frame-accurate silence objects
        └─→ BLOCKS: doge_animator_bridge.py (no start/end frame data)
              └─→ BLOCKS: Doge-Animator CSV sync for all 16 languages
                    └─→ BLOCKS: Animation lip-sync integration

BLOCKING CHAIN 4 — Manual Dub CSV Format:

CSV format not in KB (Gap #15)
  └─→ BLOCKS: tts_post_silence.py full implementation
        └─→ BLOCKS: EL Dubbing API silence injection via CSV
              └─→ BLOCKS: Automated M2 fix in production

[COMBINED CRITICAL BLOCKER]
Q7 + Q8 together → Scripts #5, #6, and #7 (partially) cannot complete
Scripts #5+#6+#7 incomplete → Piloto episode cannot achieve full QA compliance
Full QA compliance required → Cannot scale to 16 languages in production
```

**Scripts NOT blocked by Q7/Q8 — can build immediately:**

| Script | Reason Unblocked |
|:-------|:----------------|
| `docx_parser.py` (#1) | Fully specced from T1 analysis; Table 4 structure confirmed |
| `glossary_sanitizer.py` (#2) | M4 regex in spec; M5 DNT in spec; blacklists exist |
| `voice_mapper.py` (#3) | Persistence rules documented; EL API voice endpoints available |
| `tts_batch.py` (#4) | EL TTS API fully documented in 735 KB entries |
| `qc_validation.py` (#7) partial | WER (jiwer) and COMET implementable; silence metric deferred |
| `fernando_stt_reconciler.py` (#16) | Whisper + fuzzy diff + timing extraction fully specced |
| `preflight_check.py` (#13) | Pure validation logic |
| `postflight_report.py` (#14) | Aggregation logic |
| `monitoring_alerts.py` (#15) | Logging + threshold logic |

---

## 5. Gap Severity Summary

| Severity | Count | Gaps |
|:---------|:------|:-----|
| CRITICAL BLOCKER — Information missing | 2 | Q7 empty (#11), Q8 empty (#12) |
| CRITICAL BLOCKER — Spec missing | 2 | Voice Segments v3 unknown (#16), Manual Dub CSV (#15) |
| HIGH — Missing Code (core pipeline) | 5 | docx_parser (#1), tts_batch (#4), dubbing_orchestrator (#9), dubbing_batch (#10), doge_animator_bridge (#13) |
| HIGH — Missing Integration | 2 | Fernando timing (#14), Doge-Animator audio import (#18) |
| MEDIUM — Design Only (implementable now) | 4 | M1 persistence (#3), M5 glossary (#7), QA WER tooling (#9), COMET metrics (#10) |
| LOW — Trivial | 3 | M4 regex (#6), M6 clipping (#8), encoding bug (#17) |
| NOT A GAP | 1 | Audio format compatibility (#20) |

---

## 6. Immediate Action Matrix

| Priority | Action | Owner | Unblocks |
|:---------|:-------|:------|:---------|
| **P0** | Fill Q7 — Fernando's exact silence handling process (duration rule) | Iris/Daniel ops | Scripts #5, #7 silence metric |
| **P0** | Fill Q8 — Saul/Ivan workflow steps; Voice Segments v3 status from EL | Iris/Daniel ops | Scripts #6, M1 validation |
| **P0** | Verify Voice Segments v3 directly with ElevenLabs support | Backend | Script #6 architecture decision |
| **P0** | Obtain Manual Dub CSV format spec from EL docs or trial | Backend | Script #5 implementation |
| **P1** | Build `docx_parser.py` | Backend | ALL scripts |
| **P1** | Build `glossary_sanitizer.py` | Backend | Scripts #4, #9 |
| **P1** | Build `voice_mapper.py` | Backend | Scripts #4, #9, #10 |
| **P1** | Build `fernando_stt_reconciler.py` (#16 NEW) | Backend | Scripts #11, #5 timing, #9 pre-flight |
| **P2** | Build `tts_batch.py` | Backend | All TTS output |
| **P2** | Build `qc_validation.py` (partial — WER + COMET, defer silence metric) | Backend | Dubbing gate |

---

*T7 — Gap Analysis Matrix Complete | 2026-02-19*
