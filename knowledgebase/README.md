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

Generado en `C:\AI\AI-Studio\libs\knowledge-base-external\projects_datasets\elevenlabs\4_outputs`
usando `transform.py`. Ver `KB_POST_PROCESADO.md` para detalles del proceso.
