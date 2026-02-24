# Knowledgebase — ElevenLabs RAG Sources

> Fuentes de conocimiento para agentes IA que desarrollen scripts en este repo.

**Actualizado:** 2026-02-20 | **Total archivos:** 176 | **Costo total del KB:** $4.25

---

## Tabla de Contenidos

1. [Archivos principales](#archivos-principales)
2. [API Supplement (Feb 2026)](#api-supplement-feb-2026)
3. [Blacklists](#blacklists)
4. [Theories](#theories)
5. [Metadata y trazabilidad](#metadata-y-trazabilidad)
6. [Como usar](#como-usar)
7. [Archivos en .gitignore](#archivos-en-gitignore)

---

## Archivos principales

| Archivo | Tamano | Uso | En .gitignore? |
|:--------|:-------|:----|:---------------|
| `elevenlabs_final.jsonl` | 2.8 MB | **Principal** — 735 entries procesadas para embeddings/RAG | **SI** |
| `elevenlabs_helper.json` | 471 KB | Helper — endpoints y parametros frecuentes | **SI** |
| `elevenlabs_docs.json` | 969 KB | Docs base — referencia general de la API | **SI** |
| `kb_post_procesado.md` | 2.1 KB | Notas del proceso de generacion del JSONL | No |
| `transform.py` | 7.9 KB | Script que genera `elevenlabs_final.jsonl` desde docs raw | No |

## API Supplement (Feb 2026)

Directorio `elevenlabs_api/` — **158 archivos .md** extraidos directamente de `elevenlabs.io/docs/llms.txt`. Costo: $0.00.

| Categoria | Archivos | Contenido clave |
|:----------|:---------|:----------------|
| API Reference | 92 | Endpoints completos: TTS, STT, Dubbing, Voices, Studio, Forced Alignment |
| Product Guides | 10 | Voiceover Studio CSV, Dubbing Studio, Voice Cloning |
| Cookbooks | 20 | Streaming, pronunciation, batch STT, voice cloning recipes |
| Overview | 7 | Models v3/Flash, TTS best practices, capabilities |
| Tier 1 Supplement | 12 | Dubbing cookbook, errors, billing, latency optimization |
| Tier 2 Supplement | 16 | Security, zero-retention (kids privacy), Python SDK, websockets |

Ver [`elevenlabs_api/README.md`](elevenlabs_api/README.md) para inventario completo, gaps resueltos, y naming convention.

### Gaps resueltos por el supplement

| Gap | Status | Archivo |
|:----|:-------|:--------|
| Manual Dub CSV Format | RESUELTO | `eleven-creative__products__dubbing__dubbing-studio.md` |
| Voiceover Studio CSV | RESUELTO | `eleven-creative__audio-tools__voiceover-studio.md` |
| Speaker Separation API | RESUELTO | `api-reference__voices__pvc__samples__separate-speakers.md` |
| Voice Segments v3 | **CONFIRMADO: NO EXISTE** | Phantom feature — hallucination |

## Blacklists

Datos de produccion. Fuente original: `wt-video-qph/00_CORE/07_CORE_MULTI_LANGUAGE.md S3`.

| Archivo | Idioma | Contenido |
|:--------|:-------|:----------|
| `blacklists/blacklist_global.json` | Todos | Categorias A/B/C globales |
| `blacklists/blacklist_ar.json` | Arabe | Terminos culturales/religiosos |
| `blacklists/blacklist_de.json` | Aleman | Terminos historicos + formalidad |

**24 idiomas faltantes.** El script #17 (`blacklist_generator.py`) esta planeado para generarlos via LLM + revision humana para Tier 1.

## Theories

Documentos de sintesis producidos durante analisis. No son specs oficiales — son hipotesis de trabajo.

| Archivo | Titulo | Tema |
|:--------|:-------|:-----|
| [`theories/audio_pipeline_synthesis.md`](theories/audio_pipeline_synthesis.md) | Sintesis del Pipeline de Audio | Workflow Saul + Fernando |
| [`theories/model_comparison_benchmark.md`](theories/model_comparison_benchmark.md) | Benchmarking de Modelos | GPT-4o vs Claude 3.5 Sonnet |
| [`theories/translation_workflow_v1.md`](theories/translation_workflow_v1.md) | Translation Theories v1 | Optimizacion pipeline traduccion |

## Metadata y trazabilidad

| Archivo | Proposito |
|:--------|:----------|
| [`_metadata/README.md`](_metadata/README.md) | Indice de metadata |
| `_metadata/EXIT_REPORT_JAN2026.md` | Reporte crawl Apify (costos, quality gates) |
| `_metadata/KB_STATUS_JAN2026.md` | Score card: 87/100, 441 records |
| `_metadata/KB_STATUS_FEB2026.md` | Score card: 96/100, 157 files, $0.00 |
| `_metadata/POST_PROCESADO.md` | Docs del script transform.py |
| `_metadata/llms_txt_full_index.txt` | Indice maestro: 663 URLs de elevenlabs.io |

### Cronologia

| Fecha | Evento | Metodo | Costo | Records |
|:------|:-------|:-------|------:|--------:|
| Jan 2026 | Crawl original (AI-Studio) | Apify playwright:adaptive | $4.25 | 441 |
| Feb 2026 | Supplement .mdx direct | llms.txt fetch | $0.00 | 158 |
| **Total** | | | **$4.25** | **599** |

## Como usar

### Para RAG (agentes IA)

```python
import json

# Opcion 1: JSONL principal (requiere regenerar si no existe)
with open('knowledgebase/elevenlabs_final.jsonl', 'r') as f:
    docs = [json.loads(line) for line in f]
# Cada entrada: {content, metadata: {source, title, ...}}
print(f"Total chunks: {len(docs)}")

# Opcion 2: .md files directos (siempre disponibles en el repo)
import pathlib
docs_dir = pathlib.Path("knowledgebase/elevenlabs_api/")
for md_file in docs_dir.glob("*.md"):
    if md_file.name == "README.md":
        continue
    content = md_file.read_text(encoding="utf-8")
    section = md_file.stem.split("__")[0]
    print(f"[{section}] {md_file.name}: {len(content)} chars")
```

### Para desarrollo de scripts

1. Consulta endpoints en `elevenlabs_api/api-reference__*.md`
2. Revisa cookbooks en `elevenlabs_api/eleven-api__guides__cookbooks__*.md`
3. Blacklists en `blacklists/*.json`

## Archivos en .gitignore

Los 3 archivos JSON/JSONL principales estan excluidos del repo por tamano (total: ~4.2 MB).

**Como regenerar:**
```bash
cd knowledgebase
python transform.py
```

**Alternativa:** Usa directamente los 158 archivos `.md` en `elevenlabs_api/` — cubren el mismo contenido y siempre estan disponibles en el repo.

---

## Origen

| Fuente | Repo | Path |
|:-------|:-----|:-----|
| KB original (Jan 2026) | AI-Studio | `libs/knowledge-base-external/projects_datasets/elevenlabs/4_outputs` |
| Supplement (Feb 2026) | Doge-MultiLang | `knowledgebase/elevenlabs_api/` (158 .md files) |
| llms.txt master index | elevenlabs.io | `elevenlabs.io/docs/llms.txt` (663 entries) |
