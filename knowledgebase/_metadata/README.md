# KB Metadata & Provenance

> Trazabilidad del origen y calidad del knowledgebase de ElevenLabs.

## Archivos

| Archivo | Qué es |
|:--------|:-------|
| `EXIT_REPORT_JAN2026.md` | Reporte completo del crawl original (Apify, Jan 2026): costos ($4.25), secciones, quality gates, outputs |
| `KB_STATUS_JAN2026.md` | Score card del KB original: 87/100, 441 records, método Apify playwright:adaptive |
| `POST_PROCESADO.md` | Documentación del script `transform.py` que generó `elevenlabs_final.jsonl` |
| `llms_txt_full_index.txt` | Índice maestro: 663 URLs de `elevenlabs.io/docs/llms.txt` (todas las docs disponibles) |
| `KB_STATUS_FEB2026.md` | Score card del supplement Feb 2026: 157 .mdx files, Method 1, $0.00 |

## Cronología

| Fecha | Evento | Método | Costo | Records |
|:------|:-------|:-------|------:|--------:|
| Jan 2026 | Crawl original (AI-Studio) | Apify playwright:adaptive | $4.25 | 441 |
| Feb 2026 | Supplement .mdx direct | Method 1: llms.txt → .mdx fetch | $0.00 | 157 |
| **Total** | | | **$4.25** | **598** |

## Origen

- KB original generado en `C:\AI\AI-Studio\libs\knowledge-base-external\projects_datasets\elevenlabs\4_outputs`
- Supplement generado via `elevenlabs.io/docs/llms.txt` → direct .mdx fetch
- Índice maestro tiene 663 URLs; se fetchearon 157 relevantes para Doge-MultiLang (el resto son Agents/phone bots)
