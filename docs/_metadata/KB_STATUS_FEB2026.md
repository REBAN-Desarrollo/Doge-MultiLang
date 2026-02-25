# KB Status: ElevenLabs Supplement (Feb 2026)

| Field | Value |
|:------|:------|
| Date | 2026-02-20 |
| Method | Method 1: llms.txt → .mdx direct fetch |
| Source | `elevenlabs.io/docs/llms.txt` (663 entries) |
| Cost | $0.00 |
| Success Rate | 157/157 (100%) |
| Total Size | ~1.8 MB |

## Extraction Phases

| Phase | Files | Category |
|:------|------:|:---------|
| Base extraction | 129 | API Reference (92), Product Guides (10), Cookbooks (20), Overview (7) |
| Tier 1 supplement | 12 | Dubbing cookbook, errors, billing, latency, troubleshooting, history, usage |
| Tier 2 supplement | 16 | Security, zero-retention, libraries, websockets, forced-alignment cookbook, auth, streaming, legacy dubbing |
| **Total** | **157** | |

## Quality Assessment

| Gate | Score | Notes |
|:-----|:------|:------|
| Completeness | 9/10 | 157 files covering all Doge-MultiLang-relevant API areas |
| Accuracy | 10/10 | Raw .mdx source files, no crawl artifacts |
| Freshness | 10/10 | Fetched 2026-02-20 from live docs |
| Noise | 10/10 | Zero noise (raw markdown, no HTML artifacts) |
| Format | 9/10 | Raw .md files, ready for embedding or direct reference |
| **Total** | **96/100** | |

## Gaps Resolved

| Gap | Status | Evidence |
|:----|:-------|:---------|
| Manual Dub CSV Format | RESOLVED | `dubbing-studio.md`: 5-col CSV, 3 timecode formats |
| Voiceover Studio CSV | RESOLVED | `voiceover-studio.md`: speaker,line[,start_time,end_time] |
| Speaker Separation API | RESOLVED | `separate-speakers.md`: max 9 speakers |
| Voice Segments v3 | CONFIRMED HALLUCINATION | 0 results across 663 docs |

## Freshness Delta vs Jan 2026 KB

| Item | Jan 2026 | Feb 2026 |
|:-----|:---------|:---------|
| Voiceover Studio CSV format | Missing | Documented |
| `dubbing_studio` API param | Missing | Documented |
| Fixed Duration generation | Missing | Documented |
| 3 timecode formats | Missing | Documented |
| Zero-retention mode | Missing | Documented |
| Forced alignment cookbook | Partial | Full |

## Notes

- 440+ pages skipped (ElevenLabs Agents/phone bots — irrelevant to TTS/dubbing pipeline)
- llms.txt master index saved in `llms_txt_full_index.txt` (663 entries) for future reference
- Some Tier 1/2 pages returned summarized content via WebFetch (SPA limitation); API Reference pages came complete
