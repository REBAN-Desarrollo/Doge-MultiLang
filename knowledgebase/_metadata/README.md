# KB Metadata & Provenance

> Trazabilidad del origen, calidad y evoluccion del knowledgebase de ElevenLabs.

**Total archivos:** 6 (5 .md + 1 .txt) | **Actualizado:** 2026-02-20

---

## Archivos

| Archivo | Tipo | Proposito |
|:--------|:-----|:----------|
| `EXIT_REPORT_JAN2026.md` | Reporte | Reporte completo del crawl original Apify (costos $4.25, quality gates, outputs) |
| `KB_STATUS_JAN2026.md` | Score card | Score card del KB original: **87/100**, 441 records, metodo Apify playwright:adaptive |
| `KB_STATUS_FEB2026.md` | Score card | Score card del supplement: **96/100**, 158 files, metodo llms.txt direct, $0.00 |
| `POST_PROCESADO.md` | Documentacion | Documentacion del script `transform.py` que genera `elevenlabs_final.jsonl` |
| `llms_txt_full_index.txt` | Indice | Indice maestro: 663 URLs de `elevenlabs.io/docs/llms.txt` (todas las docs disponibles) |
| `README.md` | Indice | Este archivo |

## Cronologia

| Fecha | Evento | Metodo | Costo | Records | Score |
|:------|:-------|:-------|------:|--------:|:------|
| Jan 2026 | Crawl original (AI-Studio) | Apify playwright:adaptive | $4.25 | 441 | 87/100 |
| Feb 2026 | Supplement .mdx direct | llms.txt fetch | $0.00 | 158 | 96/100 |
| **Total** | | | **$4.25** | **599** | |

## Origen

| Fuente | Ubicacion original |
|:-------|:-------------------|
| KB original | `C:\AI\AI-Studio\libs\knowledge-base-external\projects_datasets\elevenlabs\4_outputs` |
| Supplement | Via `elevenlabs.io/docs/llms.txt` → direct .mdx fetch |
| Indice maestro | `elevenlabs.io/docs/llms.txt` (663 URLs; se fetchearon 158 relevantes para Doge-MultiLang) |

## Como usar esta metadata

- **Para verificar calidad del KB:** Lee `KB_STATUS_JAN2026.md` y `KB_STATUS_FEB2026.md`
- **Para entender el proceso de crawl:** Lee `EXIT_REPORT_JAN2026.md`
- **Para ver que URLs existen en ElevenLabs:** Consulta `llms_txt_full_index.txt`
- **Para entender como se genero el JSONL:** Lee `POST_PROCESADO.md`
