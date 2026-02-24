# Knowledgebase — RAG Sources para doge-suite

> Documentacion procesada lista para RAG/consulta de agentes IA.
> Copia de outputs finales desde `AI-Studio/libs/knowledge-base-external/projects_datasets/`.

**Actualizado:** 2026-02-24 | **Archivos JSONL:** 15

---

## Stack Core (doge-suite)

| Archivo | Size | Records | Tecnologia |
|:--------|:-----|:--------|:-----------|
| `nextjs-kb_final.jsonl` | 1.4 MB | 226 | Next.js 16 |
| `react-kb_final.jsonl` | 2.1 MB | 425 | React 19 |
| `tailwind-kb_final.jsonl` | 786 KB | 211 | Tailwind v4 |
| `shadcn-kb_final.jsonl` | 52 KB | 97 | shadcn/ui + Radix |
| `elevenlabs_final.jsonl` | 2.8 MB | 735 | ElevenLabs (TTS, dubbing, voices) |

## Frontend Libraries

| Archivo | Size | Records | Tecnologia |
|:--------|:-----|:--------|:-----------|
| `zustand-kb_final.jsonl` | 16 KB | 12 | Zustand (state management) |
| `recharts-kb_final.jsonl` | 20 KB | 16 | Recharts (charts) |
| `tanstack-table-kb_final.jsonl` | 18 KB | 13 | TanStack Table |
| `dnd-kit-kb_final.jsonl` | 17 KB | 12 | dnd-kit (drag & drop) |
| `fullcalendar-kb_final.jsonl` | 13 KB | 11 | FullCalendar |

## Monorepo / Build

| Archivo | Size | Records | Tecnologia |
|:--------|:-----|:--------|:-----------|
| `nx-kb_final.jsonl` | 2.9 MB | 416 | Nx (monorepo build system) |
| `turborepo-kb_final.jsonl` | 568 KB | 95 | Turborepo |

## Backend / Testing

| Archivo | Size | Records | Tecnologia |
|:--------|:-----|:--------|:-----------|
| `fastapi-kb_final.jsonl` | 4.2 MB | 744 | FastAPI |
| `docker-kb_final.jsonl` | 1.9 MB | 202 | Docker |
| `playwright-kb_final.jsonl` | 18 KB | 12 | Playwright (E2E testing) |

---

## Contenido adicional (pre-existente)

| Directorio / Archivo | Contenido |
|:----------------------|:----------|
| `elevenlabs_api/` | 158 archivos .md — API reference completa ElevenLabs |
| `blacklists/` | Blacklists por idioma (global, ar, de) |
| `theories/` | Documentos de sintesis (audio pipeline, model comparison, translation) |
| `_metadata/` | Exit reports, status cards, llms.txt index |

---

## Como usar

Formato JSONL — una linea por documento: `{content, metadata: {source, title, ...}}`.

```python
import json

with open('docs/api-reference/knowledgebase/nextjs-kb_final.jsonl', 'r') as f:
    docs = [json.loads(line) for line in f]

print(f"Total docs: {len(docs)}")
print(docs[0]['metadata']['title'])
```

---

**Origen:** AI-Studio/libs/knowledge-base-external/projects_datasets/
**Ultima sync:** 2026-02-24
