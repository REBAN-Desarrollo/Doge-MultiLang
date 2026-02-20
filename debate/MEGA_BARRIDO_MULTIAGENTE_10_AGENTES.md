# Mega Barrido Multi-Agente (10 Agentes)

| Campo | Valor |
|:--|:--|
| Fecha | 2026-02-20 |
| Repo | `Doge-MultiLang` |
| Objetivo | Consolidar 1) inventario real, 2) matriz endpoint/funcion (soportado/implementado/probado/riesgo), 3) propuesta priorizada |
| Metodo | 10 agentes exploradores (2 tandas por limite tecnico de 6 simultaneos) + barrido de evidencias en repo |

---

## 0. Veredicto Ejecutivo

1. Si, el barrido multi-agente mejora la calidad de propuesta, **pero solo** cuando se amarra a una matriz de evidencia y smoke tests.
2. En este repo, la realidad es: **documentacion fuerte, runtime casi nulo** para ElevenLabs.
3. La mejora principal no esta en escribir mas teoria, sino en cerrar contradicciones de endpoints y validar 5-7 endpoints criticos con pruebas controladas.
4. La decision tecnica correcta hoy es: `API-first + evidencia-first`, con `Doge-MultiLang` como hub de especificaciones y `AI-Studio` como lugar de ejecucion.

---

## 1. Inventario Real del Repo

### 1.1 Estado estructural

- `Doge-MultiLang` se declara como hub de conocimiento/planeacion, no repo de codigo de pipeline (`README.md:55`).
- Flujo objetivo: 27 idiomas (`README.md:27`).
- Blacklists actuales: solo 3 (global, AR, DE), faltan 24 (`README.md:200`, `README.md:41`).

### 1.2 Conteo por categoria (resultado barrido)

| Categoria | Conteo aproximado | Nota |
|:--|:--|:--|
| Documentacion (analysis/debate/docs + raiz) | 70+ | Muy alta densidad de planes y debates |
| Scripts/utilidades locales | 4 | No representan pipeline E2E de doblaje |
| Knowledgebase ElevenLabs (md/json/jsonl) | 150+ | Snapshot actualizado a 2026-02-20 |
| Config dedicadas | Minima | Sin carpeta de config operativa completa |

### 1.3 Archivos nucleares

| Tipo | Archivo | Por que importa |
|:--|:--|:--|
| PRD de trabajo | `analysis/prd_final.md` | Backlog de 18 scripts, costos y fases; status `READY FOR PHASE 1 IMPLEMENTATION` (`analysis/prd_final.md:7`, `analysis/prd_final.md:46`) |
| Estandar tecnico | `docs/gold_standard_workflow.md` | Tabla de endpoints, changelog y correcciones de API |
| KB API | `knowledgebase/elevenlabs_api/README.md` | Fuente y fecha del snapshot (`knowledgebase/elevenlabs_api/README.md:5`, `knowledgebase/elevenlabs_api/README.md:13`) |
| Plan QA phase 3 | `docs/levantamientos/26_02_19_phase3_qa_implementation_plan.md` | Componentes faltantes y dependencia real de AI-Studio |
| Debate consolidado | `debate/Claude_Mega_Propuesta_Final.md` | Registro de riesgos/asunciones/decisiones |

### 1.4 Realidad de implementacion en este repo

- Barrido de codigo local no muestra clientes HTTP a ElevenLabs en scripts principales.
- Evidencia: `scripts/planchado.py` trabaja DB/local; `analysis_calc.py` calcula metricas; `knowledgebase/transform.py` transforma archivos locales.
- Busqueda transversal de llamadas API no encontro `requests/httpx/axios` contra endpoints ElevenLabs en runtime local (`knowledgebase/transform.py` solo procesa URLs como texto).

---

## 2. Matriz Endpoint/Funcion (Soporte vs Implementacion vs Prueba vs Riesgo)

Convenciones:
- **Soporte**: si hay evidencia en KB/docs del repo.
- **Implementado aqui**: codigo ejecutable en `Doge-MultiLang`.
- **Probado aqui**: evidencia de ejecucion real en este repo.

| Capacidad | Endpoint / Funcion | Soporte en repo | Implementado aqui | Probado aqui | Riesgo actual | Decision recomendada |
|:--|:--|:--|:--|:--|:--|:--|
| Dubbing resource base | `GET /v1/dubbing/resource/{dubbing_id}` | Si (`docs/gold_standard_workflow.md:53`, `knowledgebase/elevenlabs_api/api-reference__dubbing__resources__get-resource.md:3`) | No | No | Medio (depende plan/cuenta) | Mantener como canon |
| Migrate segments | `POST /v1/dubbing/resource/{dubbing_id}/migrate-segments` | Si (`docs/gold_standard_workflow.md:54`, `knowledgebase/elevenlabs_api/api-reference__dubbing__resources__migrate-segments.md:3`) | No | No | Medio | Priorizar en smoke tests |
| Update segment | `PATCH /v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language}` | Si en KB (`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__update-segment.md:3`) | No | No | **Alto**: docs internas usan variantes sin `{language}` | Alinear contrato unico antes de codificar |
| Add language | `POST /v1/dubbing/resource/{dubbing_id}/add-language` | Si (`docs/gold_standard_workflow.md:61`) | No | No | Medio | Validar payload minimo con test |
| Forced alignment | `POST /v1/forced-alignment` | Si (`docs/gold_standard_workflow.md:63`, `knowledgebase/elevenlabs_api/api-reference__forced-alignment__create.md:3`) | No | No | Medio (cobertura idiomatica limitada) | Usar con matriz de idiomas soportados |
| STT Scribe | `POST /v1/speech-to-text` (`scribe_v2`) | Si (`docs/gold_standard_workflow.md:45`, `knowledgebase/elevenlabs_api/api-reference__speech-to-text__convert.md:3`, `:236`) | No | No | Bajo/Medio | Endpoint base para QA automatizado |
| STT params utiles | `tag_audio_events`, `timestamps_granularity`, `entity_detection` | Si (`knowledgebase/elevenlabs_api/api-reference__speech-to-text__convert.md:644`) | No | No | Medio (falsos positivos por idioma) | Activar por tier, no universal |
| Pronunciation dictionaries (file) | `POST /v1/pronunciation-dictionaries/add-from-file` | Si (`knowledgebase/elevenlabs_api/api-reference__pronunciation-dictionaries__create-from-file.md:3`) | No | No | Bajo | Incluir en baseline Tier 1 |
| Pronunciation dictionaries (rules) | `POST /v1/pronunciation-dictionaries/add-from-rules` | Si (`knowledgebase/elevenlabs_api/api-reference__pronunciation-dictionaries__create-from-rules.md:3`) | No | No | Bajo | Permitido, pero normalizar nombre/flujo |
| Audio isolation | KB: `POST /v1/audio-isolation`; doc interno: `POST /v1/audio-isolation/convert` | **Conflicto** (`knowledgebase/elevenlabs_api/api-reference__audio-isolation__convert.md:3` vs `docs/gold_standard_workflow.md:64`) | No | No | **Alto**: posible 404 por ruta incorrecta | Resolver por smoke test antes de usar |
| `dubbing_studio` flag | Parametro habilitador en `POST /v1/dubbing` | Si (`docs/gold_standard_workflow.md:51`, `:67`; `knowledgebase/elevenlabs_api/README.md:86`) | No | No | Medio | Verificar obligatoriedad real en cuenta |
| `auto_assign_voices` | Parametro propuesto en docs legacy/swarm | Marcado como falso (`docs/gold_standard_workflow.md:85`, `:91`; `debate/Claude_Mega_Propuesta_Final.md:506`) | N/A | N/A | **Alto** (alucinacion) | No usar |
| `disable_voice_cloning` | Parametro recomendado de control | Si (`docs/gold_standard_workflow.md:68`, `:85`) | No | No | Bajo | Usar como control canonico |
| `from_content_json` | Flujo en Studio projects | Soporte documental mixto (`docs/levantamientos/25_12_24_master_plan_dubbing.md:290`, `:348`) + estado bloqueado en debate (`debate/Claude_Mega_Propuesta_Final.md:165`, `:297`) | No | No | **Alto** (disponibilidad por plan) | Tratar como experimental/bloqueado hasta prueba |
| Manual Dub CSV | Estrategia legacy | Referenciado como experimental/fragil (`docs/levantamientos/25_12_24_master_plan_dubbing.md:86`, `:310`; `debate/Claude_Mega_Propuesta_Final.md:605`) | No | No | Medio/Alto | No usar como pilar |

### 2.1 Contradicciones criticas detectadas

1. `resource` vs `resources` en rutas de Dubbing API.
2. `segment/{segment_id}` vs `segment/{segment_id}/{language}`.
3. `audio-isolation/convert` vs `audio-isolation`.
4. Presencia de parametros alucinados (`auto_assign_voices`).
5. `from_content_json` aparece como opcion, pero reportado como bloqueado en plan Pro.

---

## 3. Matriz de Claims Transversales (Arquitectura + Negocio)

| Claim | Evidencia repo | Confianza | Impacto de error |
|:--|:--|:--|:--|
| QA realista por episodio no es $1-2 | `analysis/prd_final.md:419`, `analysis/prd_final.md:629`; ajuste en debate (`debate/Claude_Addendum_Deep_Research.md:771`) | Alta | Alto (presupuesto y alcance) |
| 27 idiomas activos como alcance operativo | `README.md:27` | Alta | Medio/Alto |
| Blacklists completas no existen (3/27) | `README.md:200` | Alta | Alto (safety/compliance) |
| PR #71/AI-Studio necesita validacion E2E | `debate/Claude_Mega_Propuesta_Final.md:442`, `:580`; `debate/Sonnet_Devil_Advocate_Critique.md:46` | Media/Alta | **Critico** |
| Doge-MultiLang no es runtime principal | `README.md:55` | Alta | Alto (evita implementar en repo equivocado) |

---

## 4. Propuesta Priorizada (1-2-3)

## 4.1 (1) Inventario operativo congelado (hoy)

Entregable: “estado base” firmado para evitar drift documental.

1. Congelar endpoint canon por capability (tabla seccion 2).
2. Marcar en cada doc legacy si esta `vigente`, `parcial`, o `deprecado`.
3. Publicar un unico archivo de verdad de API usada por el equipo.

## 4.2 (2) Matriz de verificacion endpoint/funcion

Entregable: semaforo por endpoint:

- `Verde`: soportado en KB + validado por smoke test.
- `Amarillo`: soportado en docs, sin smoke test.
- `Rojo`: conflictivo o contradicho por docs internas.

Endpoints para validar primero (desbloquean casi todo):
1. `/v1/dubbing/resource/{dubbing_id}`  
2. `/v1/dubbing/resource/{dubbing_id}/migrate-segments`  
3. `/v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language}`  
4. `/v1/forced-alignment`  
5. `/v1/speech-to-text` (`scribe_v2`)  
6. `/v1/pronunciation-dictionaries/add-from-file` y `/add-from-rules`  
7. `/v1/audio-isolation` (vs `/convert`)  

## 4.3 (3) Plan de ejecucion priorizado (quick wins + no-go)

### Quick wins 48-72h en este repo

1. Crear `scripts/blacklist_status.py` + `docs/blacklist_coverage.md` para visibilidad real 3/27 -> 27/27.
2. Crear `docs/gate_quick_reference.md` con checks por tier (WER/COMET/timing/safety).
3. Crear `docs/phase3_delivery_notes.md` con estado de scripts planeados vs dependencias externas.

### No-go inmediato

1. No implementar clientes API en base a rutas conflictivas sin smoke test previo.
2. No usar `auto_assign_voices`.
3. No asumir `from_content_json` disponible en plan Pro.
4. No tomar “IMPLEMENTADO” en AI-Studio como “funcional en produccion” sin E2E real.
5. No usar Manual Dub CSV como pilar permanente.

---

## 5. Smoke Tests (Sin Ejecutar) para Convertir Incertidumbre en Hechos

Objetivo: confirmar soporte real de endpoints criticos antes de desarrollar.

| Orden | Endpoint | Payload minimo | Evidencia a capturar | Go / No-Go |
|:--|:--|:--|:--|:--|
| 1 | `GET /v1/voices` | `xi-api-key` | JSON con voces + headers (`request-id`, rate limits) | Go si 200 y `voices[]` no vacio |
| 2 | `POST /v1/text-to-speech/{voice_id}` | texto corto + `model_id` | archivo audio reproducible + metadatos | Go si 200 y audio valido |
| 3 | `POST /v1/speech-to-text` | `model_id=scribe_v2` + audio corto | texto transcrito + `language_probability` | Go si 200 y texto coherente |
| 4 | `POST /v1/dubbing/resource/{id}/migrate-segments` | `segment_ids[]` + `speaker_id` | respuesta y estado de segmentos | Go si mutacion confirmada |
| 5 | `PATCH /v1/dubbing/resource/{id}/segment/{segment_id}/{language}` | texto/timing minimo | diff de segmento antes/despues | Go si patch aplica sin rerender total |
| 6 | `POST /v1/forced-alignment` | audio + transcript | timestamps retornados | Go si retorna alineacion valida |
| 7 | `POST /v1/audio-isolation` (y variante `/convert`) | audio corto | respuesta + archivo | Go a la ruta que responda 200 consistente |

---

## 6. Incertidumbres que este repo NO puede cerrar

1. Estado real ejecutable de AI-Studio / PR #71 en produccion.
2. Disponibilidad real por plan/cuenta de endpoints sensibles (`from_content_json`, limites de resource API).
3. Credenciales, rate limits y cuotas vigentes.
4. ROI real por idioma con data viva de negocio.
5. Calidad final por idioma sin pruebas sobre episodios reales.

Checklist minimo para cerrar:
1. Acceso AI-Studio + prueba E2E.
2. API key real + smoke test de 7 endpoints.
3. Confirmacion de plan comercial ElevenLabs y limites.
4. Dashboard de costos/errores por tier.
5. Decision formal de alcance MVP (idiomas/tier) basada en datos.

---

## 7. Conclusiones

1. Si: el barrido multi-agente produce propuestas mejores, especialmente para ElevenLabs API, cuando se fuerza evidencia y matriz de contradicciones.
2. El mayor valor no fue “nueva teoria”, fue detectar conflictos de rutas/parametros que podrian romper implementaciones.
3. La ruta segura es: primero validar endpoints con smoke tests, luego implementar en AI-Studio, y usar este repo como control documental y de configuracion.

