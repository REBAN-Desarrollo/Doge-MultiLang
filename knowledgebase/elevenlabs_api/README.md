# ElevenLabs API Supplement (Feb 2026)

> Supplement to `elevenlabs_final.jsonl` (Jan 2026). Raw .mdx docs fetched directly from `elevenlabs.io/docs/llms.txt`.

## Origin

| Field | Value |
|:------|:------|
| Source | `elevenlabs.io/docs/llms.txt` (663 entries) |
| Method | Method 1: .mdx direct fetch ($0.00 cost) |
| Date | 2026-02-20 |
| Files | 129 base + 12 Tier 1 supplement = ~141 .md files |
| Size | ~1.7 MB (base) + ~100 KB (Tier 1) |
| Success Rate | 129/129 (100%) |

## What This Contains

Content NOT in the original Jan 2026 KB (or updated since):

### API Reference (92 files)
- Text-to-Speech (6 endpoints: convert, stream, timestamps, WebSocket)
- Speech-to-Text (4 endpoints: convert, get, delete, realtime)
- Dubbing (19 endpoints: create, get, list, delete, resources/*, transcripts)
- Forced Alignment (1 endpoint: create)
- Pronunciation Dictionaries (8 endpoints: CRUD + rules)
- Voices (20+ endpoints: CRUD, PVC, IVC, samples, settings, search)
- Studio (20 endpoints: projects, chapters, snapshots, podcasts)
- Audio Isolation (2 endpoints: convert, stream)
- Models (1 endpoint: list)

### Product Guides (10 files)
- Voiceover Studio (CSV format, track types, timing)
- Dubbing Studio (5-col CSV, 3 timecode formats, Fixed/Dynamic modes)
- Voice Library, Voice Cloning (instant + professional), Voice Design

### Cookbooks (20 files)
- TTS: streaming, request-stitching, pronunciation dictionaries, Twilio, Supabase caching
- STT: quickstart, batch (multichannel, webhooks, entity detection), realtime (client/server streaming)
- Voices: instant cloning, professional cloning, voice design, remix

### Overview (7 files)
- Models (v3 alpha, Flash v2.5, Multilingual v2 — language counts, credits)
- Capabilities: TTS best practices, STT, dubbing, voices, forced alignment

### Tier 1 Supplement (12 files, fetched separately)
- Dubbing cookbook (programmatic patterns)
- Error reference (rate limits, quota errors)
- Latency optimization (batch processing throughput)
- Breaking changes policy
- Troubleshooting guide
- Productions dubbing service
- Subtitles & Transcripts products
- Billing & Usage analytics
- Usage API & History API endpoints

## Gaps Resolved

| Gap | Status | File |
|:----|:-------|:-----|
| Manual Dub CSV Format | RESOLVED | `eleven-creative__products__dubbing__dubbing-studio.md` |
| Voiceover Studio CSV | RESOLVED | `eleven-creative__audio-tools__voiceover-studio.md` |
| Speaker Separation API | RESOLVED | `api-reference__voices__pvc__samples__separate-speakers.md` |
| Voice Segments v3 | CONFIRMED HALLUCINATION | No such API exists |

## Freshness Delta (Jan 2026 KB vs Feb 2026 .mdx)

| Item | In Jan KB? | In Feb .mdx? |
|:-----|:-----------|:-------------|
| Voiceover Studio CSV format | NO | YES (new) |
| `dubbing_studio` API param | NO | YES (new) |
| Fixed Duration generation mode | NO | YES (new) |
| Dubbing Studio 3 timecode formats | NO | YES (new) |
| Forced alignment API | Partial | Full (updated) |

## How to Use

```python
import os, pathlib

# Load all supplement docs
docs_dir = pathlib.Path("knowledgebase/elevenlabs_api/")
for md_file in docs_dir.glob("*.md"):
    if md_file.name == "README.md":
        continue
    content = md_file.read_text(encoding="utf-8")
    # Extract section from filename
    section = md_file.stem.split("__")[0]  # e.g., "api-reference"
    print(f"[{section}] {md_file.name}: {len(content)} chars")
```

## Naming Convention

Files use `__` as path separator:
- `api-reference__dubbing__create.md` → `elevenlabs.io/docs/api-reference/dubbing/create`
- `eleven-creative__products__dubbing__dubbing-studio.md` → `elevenlabs.io/docs/eleven-creative/products/dubbing/dubbing-studio`

## Source URLs

See `urls.txt` for the complete list of source URLs.
