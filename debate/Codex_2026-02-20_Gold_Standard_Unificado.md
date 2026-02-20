# Codex 2026-02-20 - Gold Standard Unificado (Latest)

| Campo | Valor |
|:--|:--|
| Fecha | 2026-02-20 |
| Autor | Codex (GPT-5) |
| Estado | CANONICO (latest) |
| Unifica | Gold Standard v2 (absorvido) + `debate/MEGA_BARRIDO_MULTIAGENTE_10_AGENTES.md` |
| Reemplaza | Documento Codex previo (absorvido) |

---

## TL;DR

1. `Doge-MultiLang` es hub de specs y configuracion; la ejecucion real del pipeline vive en AI-Studio.
2. La direccion tecnica sigue siendo: SSOT en 4 capas + API-first + GUI-fallback.
3. El riesgo principal no es teorico: son contradicciones de endpoints y supuestos no validados (plan/cuenta/API real).
4. Antes de construir mas codigo: cerrar contrato de endpoints + smoke tests + E2E real.

---

## 1) Base Tecnica Conservada (Gold Standard)

### GS-01: SSOT en 4 capas
1. `dialogue_objects.json` (texto/estructura)
2. `voice_manifest.json` (casting por personaje)
3. `timing_objects.json` (timing real reconciliado)
4. `qa_report.json` (WER, drift, safety flags, decision)

### GS-02: Nada downstream lee docx crudo
Todo proceso consume JSON canonico.

### GS-03: API-first, GUI-fallback
La UI de ElevenLabs es para excepciones, no flujo principal.

### GS-04: Re-mapping manual prohibido
Sin manifest valido, se bloquea pipeline.

### GS-05: Trazabilidad obligatoria
Toda correccion queda en log: `heuristic | reconciled | manual_override`, con actor y razon.

---

## 2) Realidad del Repo (Barrido Multi-Agente)

1. `Doge-MultiLang` no es repo de runtime de doblaje; es repo de conocimiento y planeacion (`README.md:55`).
2. Hay cobertura documental amplia, pero poca implementacion ejecutable de llamadas ElevenLabs en este repo.
3. Blacklists actuales: 3 de 27 (`README.md:200`), faltan 24.
4. El snapshot de API en `knowledgebase/elevenlabs_api` esta fechado 2026-02-20 (`knowledgebase/elevenlabs_api/README.md:5`).
5. Cualquier decision de endpoint debe pasar por test real con cuenta/plan vigente (no solo por docs internas).

---

## 3) Matriz Canonica de Endpoint/Funcion

| Capacidad | Endpoint canonico (actual) | Estado en este repo | Riesgo |
|:--|:--|:--|:--|
| Resource read | `GET /v1/dubbing/resource/{dubbing_id}` | Documentado, no ejecutado aqui | Medio |
| Segment migration | `POST /v1/dubbing/resource/{dubbing_id}/migrate-segments` | Documentado, no ejecutado aqui | Medio |
| Segment update | `PATCH /v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language}` | KB lo soporta; docs internas tienen variantes | Alto |
| Add language | `POST /v1/dubbing/resource/{dubbing_id}/add-language` | Documentado, no ejecutado aqui | Medio |
| Forced alignment | `POST /v1/forced-alignment` | Documentado, no ejecutado aqui | Medio |
| STT QA | `POST /v1/speech-to-text` (`scribe_v2`) | Documentado, no ejecutado aqui | Bajo/Medio |
| Pronunciation dict (file) | `POST /v1/pronunciation-dictionaries/add-from-file` | Documentado, no ejecutado aqui | Bajo |
| Pronunciation dict (rules) | `POST /v1/pronunciation-dictionaries/add-from-rules` | Documentado, no ejecutado aqui | Bajo |
| Audio isolation | KB: `/v1/audio-isolation`; docs internas: `/v1/audio-isolation/convert` | Conflicto abierto | Alto |
| Voice control param | `disable_voice_cloning` | Documentado | Bajo |
| Param alucinado | `auto_assign_voices` | Marcado falso | Alto |
| Feature condicionada por plan | `from_content_json` | Reportado como bloqueado en Pro en varios debates | Alto |

---

## 4) Contradicciones Cerradas y Abiertas

### Cerradas
1. `auto_assign_voices` no es parametro valido para este flujo; no usar.
2. Manual Dub CSV no debe ser pilar permanente.

### Abiertas (requieren smoke test)
1. `resource` vs `resources`.
2. `segment/{segment_id}` vs `segment/{segment_id}/{language}`.
3. `audio-isolation` vs `audio-isolation/convert`.
4. Disponibilidad real de `from_content_json` segun plan/cuenta.

---

## 5) Plan 1-2-3 (Ejecutable)

### 1. Congelar contrato API (hoy)
1. Publicar tabla unica de endpoints validos.
2. Marcar docs legacy como `vigente/parcial/deprecado`.
3. Bloquear nuevos desarrollos que usen endpoints no canonicos.

### 2. Validar endpoints criticos (48h)
1. `GET /v1/voices`
2. `POST /v1/speech-to-text` (`scribe_v2`)
3. `GET /v1/dubbing/resource/{id}`
4. `POST /v1/dubbing/resource/{id}/migrate-segments`
5. `PATCH /v1/dubbing/resource/{id}/segment/{segment_id}/{language}`
6. `POST /v1/forced-alignment`
7. `POST /v1/audio-isolation` (y variante `/convert`)

### 3. Ejecutar vertical slice en AI-Studio (despues de 1+2)
1. 1 episodio E2E.
2. QA minimo (WER + timing + safety) por tier.
3. Log de overrides y reporte final en `qa_report.json`.

---

## 6) No-Go (Bloqueos duros)

1. No codificar contra endpoints conflictivos sin smoke test previo.
2. No asumir que “implementado” en documentos = funcional en produccion.
3. No lanzar 27 idiomas con blacklists 3/27.
4. No usar parametros no verificados por test real de cuenta.
5. No mover trabajo de runtime a este repo si depende de AI-Studio.

---

## 7) Criterios de Exito (Pilot)

1. Episodio corre E2E con endpoints validados.
2. Un solo contrato de endpoint vigente y sin contradicciones.
3. Mismo personaje conserva identidad de voz.
4. Timing drift detectado antes de publicar.
5. Capa QA deja evidencia real, no solo declarativa.

---

## 8) Linaje Documental

- Documento Codex previo: absorvido en este documento.
- Barrido de evidencia: `debate/MEGA_BARRIDO_MULTIAGENTE_10_AGENTES.md`.
- Documento canonico vigente: `debate/Codex_2026-02-20_Gold_Standard_Unificado.md`.
