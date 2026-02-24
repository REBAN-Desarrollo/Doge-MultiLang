# ElevenLabs API Supplement (Feb 2026)

> 158 archivos .md extraidos directamente de `elevenlabs.io/docs/llms.txt`. Complementa el JSONL original de Enero 2026.

**Fecha:** 2026-02-20 | **Archivos:** 158 | **Costo:** $0.00

---

## Origen

| Campo | Valor |
|:------|:------|
| Source | `elevenlabs.io/docs/llms.txt` (663 entries) |
| Metodo | Direct .mdx fetch ($0.00 cost) |
| Fecha | 2026-02-20 |
| Archivos | 158 .md files |
| Tamano total | ~1.8 MB |
| Success Rate | 100% |

## Contenido por categoria

### API Reference (92 archivos)

| Area | Endpoints |
|:-----|:----------|
| Text-to-Speech | 6 endpoints: convert, stream, timestamps, WebSocket |
| Speech-to-Text | 4 endpoints: convert, get, delete, realtime |
| Dubbing | 19 endpoints: create, get, list, delete, resources/*, transcripts |
| Forced Alignment | 1 endpoint: create |
| Pronunciation Dictionaries | 8 endpoints: CRUD + rules |
| Voices | 20+ endpoints: CRUD, PVC, IVC, samples, settings, search |
| Studio | 20 endpoints: projects, chapters, snapshots, podcasts |
| Audio Isolation | 2 endpoints: convert, stream |
| Models | 1 endpoint: list |

### Product Guides (10 archivos)

- Voiceover Studio (CSV format, track types, timing)
- Dubbing Studio (5-col CSV, 3 timecode formats, Fixed/Dynamic modes)
- Voice Library, Voice Cloning (instant + professional), Voice Design

### Cookbooks (20 archivos)

- **TTS:** streaming, request-stitching, pronunciation dictionaries, Twilio, Supabase caching
- **STT:** quickstart, batch (multichannel, webhooks, entity detection), realtime (client/server streaming)
- **Voices:** instant cloning, professional cloning, voice design, remix

### Overview (7 archivos)

- Models (v3 alpha, Flash v2.5, Multilingual v2 — language counts, credits)
- Capabilities: TTS best practices, STT, dubbing, voices, forced alignment

### Tier 1 Supplement (12 archivos)

- Dubbing cookbook (programmatic patterns)
- Error reference (rate limits, quota errors)
- Latency optimization (batch processing throughput)
- Breaking changes policy
- Troubleshooting guide
- Productions dubbing service
- Subtitles & Transcripts products
- Billing & Usage analytics
- Usage API & History API endpoints

### Tier 2 Supplement (16 archivos)

- Security, zero-retention (kids privacy)
- Python SDK, websockets
- Forced-alignment cookbook
- Auth, legacy dubbing

## Gaps resueltos

| Gap | Status | Archivo clave |
|:----|:-------|:-------------|
| Manual Dub CSV Format | **RESUELTO** | `eleven-creative__products__dubbing__dubbing-studio.md` |
| Voiceover Studio CSV | **RESUELTO** | `eleven-creative__audio-tools__voiceover-studio.md` |
| Speaker Separation API | **RESUELTO** | `api-reference__voices__pvc__samples__separate-speakers.md` |
| Voice Segments v3 | **HALLUCINATION CONFIRMADA** | No existe en ninguna de las 663 URLs |

## Freshness Delta (Jan KB vs Feb .mdx)

| Feature | En Jan KB? | En Feb .mdx? |
|:--------|:-----------|:-------------|
| Voiceover Studio CSV format | NO | SI (nuevo) |
| `dubbing_studio` API param | NO | SI (nuevo) |
| Fixed Duration generation mode | NO | SI (nuevo) |
| Dubbing Studio 3 timecode formats | NO | SI (nuevo) |
| Forced alignment API | Parcial | Completo (actualizado) |

## Naming convention

Archivos usan `__` como separador de path:

```
api-reference__dubbing__create.md
  → elevenlabs.io/docs/api-reference/dubbing/create

eleven-creative__products__dubbing__dubbing-studio.md
  → elevenlabs.io/docs/eleven-creative/products/dubbing/dubbing-studio
```

## Como usar

```python
import pathlib

docs_dir = pathlib.Path("knowledgebase/elevenlabs_api/")
for md_file in docs_dir.glob("*.md"):
    if md_file.name == "README.md":
        continue
    content = md_file.read_text(encoding="utf-8")
    # Categoria desde filename
    section = md_file.stem.split("__")[0]  # "api-reference", "eleven-creative", etc.
    print(f"[{section}] {md_file.name}: {len(content)} chars")
```

## Source URLs

Ver `_metadata/llms_txt_full_index.txt` para el indice completo de 663 URLs.
