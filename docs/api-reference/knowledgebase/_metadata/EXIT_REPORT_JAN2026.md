# EXIT_REPORT - ElevenLabs

> Auditoria completada: 2026-01-07

## Metadata

| Campo | Valor |
|-------|-------|
| **Proyecto** | ElevenLabs Documentation |
| **Fecha** | 2026-01-07 |
| **Responsable** | DataOps |
| **Target** | https://elevenlabs.io/docs |
| **Tipo de sitio** | JS SPA (Fern/Mintlify) |

---

## Pipeline Stages

### Etapa 1: Discovery

| Metrica | Valor |
|---------|-------|
| Metodo usado | Sitemap (4 sitemaps encontrados) |
| Total suspects | 4,257 |
| Costo discovery | $1.12 |

**Sitemaps detectados:**
- https://elevenlabs.io/sitemap.xml
- https://help.elevenlabs.io/hc/sitemap.xml
- https://elevenlabs.io/docs/sitemap.xml
- https://showcase.elevenlabs.io/sitemap.xml

### Etapa 2: Filtrado

| Metrica | Valor |
|---------|-------|
| Suspects | 4,257 |
| Qualified (docs) | ~534 |
| Descartadas | 3,723 |
| Qualified ratio | 12.5% |

**Razones de descarte:**
| Categoria | Count | Ejemplo |
|-----------|-------|---------|
| sound-effects | 1,140 | `/sound-effects/*` |
| voice-library | 584 | `/voice-library/*` |
| blog | 545 | `/blog/*` |
| hc (help center) | 374 | `/hc/*` |
| music | 201 | `/music/*` |
| careers | 68 | `/careers/*` |
| changelog | 56 | `/changelog/*` |
| otros | 755 | showcase, members, projects, etc. |

### Etapa 3: Extraccion

| Seccion | Status | Paginas | Costo |
|---------|--------|---------|-------|
| overview | SUCCEEDED | 27 | $0.21 |
| developers | SUCCEEDED | 38 | $0.14 |
| creative_platform | SUCCEEDED | 36 | $0.18 |
| agents_platform | SUCCEEDED | 122 | $0.41 |
| api_reference_v2 | SUCCEEDED | 218 | $2.19 |
| **TOTAL** | **OK** | **441** | **$3.13** |

---

## Quality Gates

| Gate | Threshold | Resultado | Status |
|------|-----------|-----------|--------|
| success_rate | >= 90% Pass | 100% (441/441) | PASS |
| noise_est_pct | <= 4% Pass | ~0.2% | PASS |
| cost_vs_budget | <= 100% Pass | 71% ($4.25/$5.99) | PASS |
| rag_coverage | >= 80% Pass | 100% (6/6 terminos) | PASS |

**Status General:** PASS

---

## Cost Analysis

| Concepto | Valor |
|----------|-------|
| Paginas qualified | 441 |
| Tipo de sitio | JS SPA |
| Budget estimado (configs) | $5.99 |
| Costo extraccion | $3.13 |
| Costo discovery | $1.12 |
| **Costo total real** | **$4.25** |
| Cost vs budget | 71% |

---

## Retry Configuration (defaults usados)

| Parametro | Valor | Razon |
|-----------|-------|-------|
| max_retries | 2 | Default Apify WCC |
| backoff_ms | Exponencial | Default |
| retry_on | [429, 500, 502, 503, 504, timeout] | Standard |

### Failed URLs Analysis

| URL | Error | Retries | Accion |
|-----|-------|---------|--------|
| (ninguna) | - | - | Sin fallos |

---

## RAG Coverage

**Terminos esperados:**

| Termino | Archivos | Status |
|---------|----------|--------|
| voice cloning | 32 | FOUND |
| text-to-speech | 68 | FOUND |
| websocket | 38 | FOUND |
| dubbing | 50 | FOUND |
| speech-to-text | 35 | FOUND |
| conversational AI | 261 | FOUND |

**Coverage:** 6/6 = 100%

---

## Outputs Generados

- [x] `3_runs/discovery_result.json`
- [x] `3_runs/*_preview.json` (5 secciones)
- [x] `3_runs/*_log.json` (5 secciones)
- [x] `4_outputs/overview/` (27 markdown)
- [x] `4_outputs/developers/` (38 markdown)
- [x] `4_outputs/creative_platform/` (36 markdown)
- [x] `4_outputs/agents_platform/` (122 markdown)
- [x] `4_outputs/api_reference_v2/` (218 markdown)
- [x] `4_outputs/elevenlabs_rag.json` (consolidado)

---

## Observaciones

1. **Ruido minimo:** El selector CSS de removeElements funciono bien. Solo ruido menor en formato de tablas markdown (`| --- | --- |`).

2. **Cobertura completa de docs:** Se extrajeron las 5 secciones principales de documentacion.

3. **Help Center (hc) no extraido:** 374 URLs del help center no se incluyeron. Podria ser util para soporte/FAQ en el futuro.

4. **7 paginas thin:** 7 paginas con <500 chars (api_reference principalmente). Contenido minimo pero valido (endpoints simples).

---

## Lecciones Aprendidas

- El filtrado agresivo (12.5% qualified) fue correcto. sound-effects y voice-library son contenido de producto, no documentacion.
- Configs con `excludeGlobs` especificos ayudaron a evitar duplicados entre secciones.
- Costo real fue 29% menor al estimado - los estimados son conservadores.

---

## Proximos Pasos

- [ ] Evaluar si incluir Help Center (hc/) en segunda iteracion
- [ ] Crear `terms_elevenlabs.txt` formal para validaciones futuras
- [ ] Agregar token count al output consolidado
