# Knowledgebase — ElevenLabs RAG Sources

> Fuentes de conocimiento para agentes IA que desarrollen scripts en este repo.

## Archivos

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `elevenlabs_final.jsonl` | 2.8 MB | **Principal** — Docs completas procesadas para embeddings. Usar para RAG cuando se desarrollen scripts de API. |
| `elevenlabs_helper.json` | 471 KB | Helper específico — endpoints y parámetros de uso frecuente |
| `elevenlabs_docs.json` | 969 KB | Docs base — referencia general de la API |
| `KB_POST_PROCESADO.md` | 2.1 KB | Notas del proceso de generación del JSONL |
| `transform.py` | 7.9 KB | Script que generó `elevenlabs_final.jsonl` desde docs raw |
| `elevenlabs_api/` | 1.8 MB | **Supplement Feb 2026** — 157 raw .mdx API docs (endpoints, cookbooks, guides). Cubre gaps del JSONL original. |
| `_metadata/` | ~50 KB | Trazabilidad: EXIT_REPORT, KB_STATUS (Jan+Feb), llms.txt master index (663 URLs) |

## API Supplement (Feb 2026)

Extraccion directa via `elevenlabs.io/docs/llms.txt` → .mdx fetch. Costo: $0.00.

| Categoria | Archivos | Contenido clave |
|:----------|:---------|:----------------|
| API Reference | 92 | Endpoints completos: TTS, STT, Dubbing, Voices, Studio, Forced Alignment |
| Product Guides | 10 | Voiceover Studio CSV, Dubbing Studio, Voice Cloning |
| Cookbooks | 20 | Streaming, pronunciation, batch STT, voice cloning recipes |
| Overview | 7 | Models v3/Flash, TTS best practices, capabilities |
| Tier 1 Supplement | 12 | Dubbing cookbook, errors, billing, latency optimization |
| Tier 2 Supplement | 16 | Security, zero-retention (kids privacy), Python SDK, websockets, forced-alignment cookbook, auth, legacy dubbing |

Ver `elevenlabs_api/README.md` para inventario completo y gaps resueltos.

## Metadata & Trazabilidad

| Archivo | Qué es |
|:--------|:-------|
| `_metadata/EXIT_REPORT_JAN2026.md` | Reporte del crawl original Apify (costos, quality gates) |
| `_metadata/KB_STATUS_JAN2026.md` | Score card KB original: 87/100, 441 records |
| `_metadata/KB_STATUS_FEB2026.md` | Score card supplement: 96/100, 157 files, $0.00 |
| `_metadata/POST_PROCESADO.md` | Docs del script `transform.py` |
| `_metadata/llms_txt_full_index.txt` | Índice maestro: 663 URLs de `elevenlabs.io/docs/llms.txt` |

Ver `_metadata/README.md` para cronología completa.

## Blacklists (datos de producción)

| Archivo | Idioma | Uso |
|---------|--------|-----|
| `blacklists/blacklist_global.json` | Todos | Categorías A/B/C globales |
| `blacklists/blacklist_ar.json` | Árabe | Términos culturales/religiosos AR |
| `blacklists/blacklist_de.json` | Alemán | Términos históricos + formalidad DE |

Fuente original: `wt-video-qph/00_CORE/07_CORE_MULTI_LANGUAGE.md §3 Blacklist`

## Cómo usar el JSONL para RAG

```python
import json

# Cargar knowledgebase
with open('knowledgebase/elevenlabs_final.jsonl', 'r') as f:
    docs = [json.loads(line) for line in f]

# Cada entrada tiene: {content, metadata: {source, title, ...}}
print(f"Total chunks: {len(docs)}")
```

## Origen

| Fuente | Repo | Path |
|:-------|:-----|:-----|
| KB original (Jan 2026) | AI-Studio | `libs/knowledge-base-external/projects_datasets/elevenlabs/4_outputs` |
| Supplement (Feb 2026) | Doge-MultiLang | `knowledgebase/elevenlabs_api/` (157 .mdx files) |
| llms.txt master index | elevenlabs.io | `elevenlabs.io/docs/llms.txt` (663 entries) |

JSONL generado con `transform.py`. Ver `_metadata/POST_PROCESADO.md` para detalles del proceso.
