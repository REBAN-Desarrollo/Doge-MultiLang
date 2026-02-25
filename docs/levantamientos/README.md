# Levantamientos QPH — Documentacion de Entrevistas y Especificaciones

> Recopilacion centralizada de 51 documentos de entrevistas, especificaciones tecnicas, cuestionarios y lecciones aprendidas del proyecto Doge-MultiLang.

**Ultima actualizacion:** 2026-02-20
**Mantainer:** Daniel Garza (Architect), Iris (PMO)

---

## Tabla de Contenidos

1. [Que es esto?](#que-es-esto)
2. [Estructura cronologica](#estructura-cronologica)
3. [Documentos por fase](#documentos-por-fase)
4. [Documentos por tema](#documentos-por-tema)
5. [Como navegar](#como-navegar)

---

## Que es esto?

Este directorio contiene **51 documentos** generados entre Enero y Febrero 2026 durante el proceso de analisis y especificacion del pipeline de doblaje multi-idioma de QuePerroHilo (QPH).

Los documentos son de 4 tipos:

| Tipo | Cantidad | Proposito | Ejemplo |
|:-----|:---------|:----------|:--------|
| **Levantamientos (Q#)** | 10 | Entrevista directa con persona clave del equipo | Q1_andrea_gm.md, Q8_saul_ivan_dubbing.md |
| **Especificaciones CORE** | 5 | Reglas core identificadas en entrevistas | 04_CORE_TIMING_RULES.md, 07_CORE_MULTI_LANGUAGE.md |
| **Specs de Diciembre** | 13 | Deep dives en temas especificos (fecha: 25_12_24) | 25_12_24_glossary_strategy_idiomas.md |
| **Specs de Enero/Febrero** | 21 | Refinamientos y nuevas investigaciones | 26_02_19_phase3_qa_implementation_plan.md |

**Alcance:** Cubre guionismo, TTS, doblaje, audio, sonorizacion, QA, timing, blacklists, personas de audiencia, y ciclos de produccion.

**Propiedad:** Datos confidenciales de QPH. Repo privado.

---

## Estructura cronologica

### Enero 2026 — Discovery & Initial Interviews

Fase 1 de levantamientos con el equipo. Responden preguntas abiertas sobre workflow actual.

```
docs/levantamientos/
├── Q1_andrea_gm.md                          # Andrea (guionista/GM)
├── Q2_alan_ramon_factory.md                 # Alan + Ramon (factory)
├── Q3_...md                                 # (si existe)
└── factory_alan_ramon.md                    # Variante de Q2
```

**Temas cubiertos:** Guion, voces, factory workflow, TTS, asignacion de speaker IDs.

### Diciembre 2025 — Deep Dives

Investigaciones profundas en temas especificos (archivo indicador: `25_12_24_*`).

```
25_12_24_master_plan_dubbing.md
25_12_24_technical_spec_elevenlabs.md
25_12_24_requirements_dubbing.md
25_12_24_benchmark_research_dubbing.md
25_12_24_glossary_strategy_idiomas.md
25_12_24_guide_es_latam.md
25_12_24_persona_kids_6_12.md
25_12_24_target_audience_gaps.md
25_12_24_cuestionario_detalle_multirol.md
25_12_24_validation_flow_tiering_qa.md
25_12_24_voice_tts_checklist.md
25_12_24_sonorizacion_checklist.md
25_12_24_tts_plan_mejoras_espanol.md
25_12_24_tts_elevenlabs_checklist.md
25_12_24_tts_legacy_plan.md
```

**Temas:** Maestros de plan, requerimientos, benchmarks, glosarios, gueias regionales, personas, checklists.

### Enero 2026 — Refinamientos

Entrevistas adicionales y refinamientos basados en deep dives de Diciembre.

```
26_01_15_entrevista_qph_andrea_iris_daniel.md
```

**Temas:** Alineacion de equipo, lecciones aprendidas de pruebas.

### Febrero 2026 — QA Phase & Production Planning

Especificaciones para Phase 3 (QA Automation) e implementacion de operaciones.

```
26_02_06_q8_draft_saul_ivan_dubbing.md
26_02_12_qa_tiering_por_stage.md
26_02_12_sonorizacion_workflow.md
26_02_18_checklist_audio_qa.md
26_02_19_phase3_qa_implementation_plan.md
```

**Temas:** QA por stage, workflows, checklists, plan de implementacion.

---

## Documentos por fase

### Phase 0: Initial Discovery (Enero)

| Documento | Contenido |
|:----------|:----------|
| `Q1_andrea_gm.md` | Guion, workflow Andrea, notas sobre edicion |
| `Q2_alan_ramon_factory.md` | Factory, TTS, voces, manifest |
| `factory_alan_ramon.md` | Variante de Q2 con detalles adicionales |
| `flujo_actual.md` | Workflow end-to-end actual |
| `analisis_lean.md` | Analisis lean de procesos |
| `README.md` | (obsoleto — el archivo que estás leyendo está siendo reemplazado) |

### Phase 1: TTS & Audio

| Documento | Contenido |
|:----------|:----------|
| `04_CORE_TIMING_RULES.md` | Regla core: timing y silencios |
| `06_CORE_AUDIO_TTS.md` | Regla core: TTS, perfiles de voz, speaker types |
| `08_AUDIO_TTS_WORKFLOW.md` | Workflow completo de TTS |
| `25_12_24_tts_plan_mejoras_espanol.md` | Plan de mejoras para TTS en español |
| `25_12_24_tts_elevenlabs_checklist.md` | Checklist ElevenLabs para TTS |
| `25_12_24_voice_tts_checklist.md` | Checklist de voz y TTS |
| `voice_tts_plan.md` | Plan de voz y TTS |

### Phase 2: Dubbing & Multi-Language

| Documento | Contenido |
|:----------|:----------|
| `07_CORE_MULTI_LANGUAGE.md` | Regla core: 17 idiomas, blacklists, WER targets |
| `08_DUBBING_WORKFLOW.md` | Workflow de doblaje |
| `09_DUBBING_WORKFLOW.md` | (variante) Workflow detallado de doblaje |
| `25_12_24_master_plan_dubbing.md` | Master plan para doblaje |
| `25_12_24_technical_spec_elevenlabs.md` | Spec tecnica de ElevenLabs |
| `25_12_24_requirements_dubbing.md` | Requerimientos de doblaje |
| `25_12_24_benchmark_research_dubbing.md` | Benchmark vs competidores |
| `26_02_06_q8_draft_saul_ivan_dubbing.md` | Q8 (Saul/Ivan) — speaker mapping, workflow |
| `dubbing_saul_ivan.md` | Workflow de doblaje (Saul/Ivan) |

### Phase 3: QA & Quality

| Documento | Contenido |
|:----------|:----------|
| `10_QA_TIERING.md` | (en video-qph) Regla core: QA 3-tier, KPIs, costos |
| `26_02_12_qa_tiering_por_stage.md` | QA tiering por stage de produccion |
| `26_02_18_checklist_audio_qa.md` | Checklist de audio QA (13 pistas) |
| `26_02_19_phase3_qa_implementation_plan.md` | Plan de implementacion de Phase 3 |
| `25_12_24_validation_flow_tiering_qa.md` | Flujo de validacion QA |

### Phase 4: Glossary & Blacklist

| Documento | Contenido |
|:----------|:----------|
| `09_GLOSSARY_STRATEGY.md` | (en video-qph) Estrategia de glosario, DNT terms |
| `25_12_24_glossary_strategy_idiomas.md` | Estrategia de glosario por idioma |

### Phase 5: Sonorizacion (SFX)

| Documento | Contenido |
|:----------|:----------|
| `sonorizacion_plan.md` | Plan de sonorizacion |
| `26_02_12_sonorizacion_workflow.md` | Workflow de sonorizacion |
| `25_12_24_sonorizacion_checklist.md` | Checklist de sonorizacion |

### Phase 6: Operaciones & Post-Produccion

| Documento | Contenido |
|:----------|:----------|
| `11_FERNANDO_DAILY_OPS.md` | Operaciones diarias de Fernando (post-prod) |
| `postprod_fernando.md` | Workflow de Fernando (post-produccion) |
| `11_ANDREA_GUION_CHECKLIST.md` | Checklist de guion de Andrea |

---

## Documentos por tema

### Guion & Narrativa

| Tema | Documentos |
|:-----|:-----------|
| Guion | Q1, 11_ANDREA_GUION_CHECKLIST.md |
| Narrative Bible | 02_CORE_NARRATIVE_BIBLE.md |

### Voces & Personas

| Tema | Documentos |
|:-----|:-----------|
| Personas de audiencia | 25_12_24_persona_kids_6_12.md, 25_12_24_target_audience_gaps.md |
| Guia regional | 25_12_24_guide_es_latam.md |
| Speaker mapping | Q8, 26_02_06_q8_draft_saul_ivan_dubbing.md |

### Audio & TTS

| Tema | Documentos |
|:-----|:-----------|
| TTS workflow | 06_CORE_AUDIO_TTS.md, 08_AUDIO_TTS_WORKFLOW.md, voice_tts_plan.md |
| Timing | 04_CORE_TIMING_RULES.md |
| Mejoras ESP | 25_12_24_tts_plan_mejoras_espanol.md |
| Checklists | 25_12_24_tts_elevenlabs_checklist.md, 25_12_24_voice_tts_checklist.md |

### Doblaje Multi-Idioma

| Tema | Documentos |
|:-----|:-----------|
| Multi-language | 07_CORE_MULTI_LANGUAGE.md |
| Dubbing plan | 25_12_24_master_plan_dubbing.md, 25_12_24_requirements_dubbing.md |
| Dubbing workflow | 08_DUBBING_WORKFLOW.md, 09_DUBBING_WORKFLOW.md, dubbing_saul_ivan.md |
| ElevenLabs tech | 25_12_24_technical_spec_elevenlabs.md |
| Benchmarks | 25_12_24_benchmark_research_dubbing.md |

### Calidad & Validacion

| Tema | Documentos |
|:-----|:-----------|
| QA tiering | 26_02_12_qa_tiering_por_stage.md, 26_02_19_phase3_qa_implementation_plan.md |
| QA checklists | 26_02_18_checklist_audio_qa.md |
| Validacion flow | 25_12_24_validation_flow_tiering_qa.md |

### Glossary & Blacklist

| Tema | Documentos |
|:-----|:-----------|
| Estrategia glosario | 25_12_24_glossary_strategy_idiomas.md |

### Sonorizacion (SFX)

| Tema | Documentos |
|:-----|:-----------|
| Sonorizacion | sonorizacion_plan.md, 26_02_12_sonorizacion_workflow.md, 25_12_24_sonorizacion_checklist.md |

### Operaciones & Post-Produccion

| Tema | Documentos |
|:-----|:-----------|
| Post-produccion | 11_FERNANDO_DAILY_OPS.md, postprod_fernando.md |
| Analisis lean | analisis_lean.md |
| Workflow actual | flujo_actual.md |

### Especificaciones CORE (video-qph)

| Tema | Documentos |
|:-----|:-----------|
| Todos los CORE | 02_CORE_NARRATIVE_BIBLE.md, 04_CORE_TIMING_RULES.md, 06_CORE_AUDIO_TTS.md, 07_CORE_MULTI_LANGUAGE.md |

---

## Como navegar

### Si eres architect/PM

1. Lee [`04_CORE_TIMING_RULES.md`](04_CORE_TIMING_RULES.md) — entender timing
2. Lee [`06_CORE_AUDIO_TTS.md`](06_CORE_AUDIO_TTS.md) — entender TTS + speaker types
3. Lee [`07_CORE_MULTI_LANGUAGE.md`](07_CORE_MULTI_LANGUAGE.md) — entender 17 idiomas + tiers
4. Lee [`26_02_19_phase3_qa_implementation_plan.md`](26_02_19_phase3_qa_implementation_plan.md) — plan de QA

### Si eres developer

1. Lee [`06_CORE_AUDIO_TTS.md`](06_CORE_AUDIO_TTS.md)
2. Lee [`07_CORE_MULTI_LANGUAGE.md`](07_CORE_MULTI_LANGUAGE.md)
3. Consulta checklists: [`26_02_18_checklist_audio_qa.md`](26_02_18_checklist_audio_qa.md)
4. Busca el topic especifico en seccion [Documentos por tema](#documentos-por-tema) arriba

### Si necesitas datos de un rol especifico

| Rol | Documentos esenciales |
|:----|:---------------------|
| **Andrea (guionista)** | Q1, 11_ANDREA_GUION_CHECKLIST.md, 02_CORE_NARRATIVE_BIBLE.md |
| **Ramon (TTS/Audio)** | Q2, 06_CORE_AUDIO_TTS.md, 25_12_24_tts_elevenlabs_checklist.md |
| **Saul/Ivan (dubbing)** | Q8, 26_02_06_q8_draft_saul_ivan_dubbing.md, 25_12_24_master_plan_dubbing.md |
| **Fernando (post-prod)** | Q7 (sin llenar), 11_FERNANDO_DAILY_OPS.md, postprod_fernando.md |
| **Gio (QA)** | 26_02_12_qa_tiering_por_stage.md, 26_02_18_checklist_audio_qa.md |
| **Helmut (animator)** | 04_CORE_TIMING_RULES.md (timing de referencias) |

---

## Notas Importantes

### ⚠️ Cuestionarios sin llenar

Estos documentos existen pero NO tienen respuestas (todavia estan templates):
- **Q7_FERNANDO_POSTPROD.md** — Entrevista con Fernando sobre workflow de post-produccion (silencios, timing, edicion)
- **Q8_SAUL_IVAN_DUBBING.md** — Entrevista con Saul/Ivan sobre speaker mapping y dubbing (tiene draft pero incompleto)

**Accion:** Prioridad P1 para desbloquear Phase 3.

### 📎 Archivos duplicados

Algunos pares de archivos son variantes del mismo tema (ejemplo: `dubbing_saul_ivan.md` vs `09_DUBBING_WORKFLOW.md`). No estan elimados porque ambas versiones pueden tener detalles adicionales.

### 🔄 Relacion con otros repos

- **video-qph:** Contiene las especificaciones CORE originales (sin el `XX_` prefix). Estos documentos incorporan esas specs.
- **AI-Studio:** Contiene la implementacion real (Phase 1 + Phase 2). Estos levantamientos alimentan esa implementacion.

---

**Owner:** REBAN-Desarrollo | **Repo privado** | **Actualizado:** 2026-02-20
