## 10. Workflow de Guionismo Optimizado

### 10.1 Problema Actual: .docx como SSOT

El flujo actual de guionismo es la causa raiz de multiples fallas en cascada:

1. **Input no estructurado:** Andrea escribe en Microsoft Word con formato libre. El archivo `.docx` es una capa de presentacion visual que contiene caracteres de control invisibles, comillas tipograficas inteligentes, saltos de carro y estilos de formato que envenenan cualquier parser.
2. **`docx_parser.py` (435 lineas en AI-Studio)** intenta extraer dialogos a JSON usando expresiones regulares sobre lenguaje natural no estructurado. Esto es una garantia matematica de fallos -- es la causa fundamental del Bug P0 (prescanner crash en `None`).
3. **Flujo unidireccional:** El pipeline opera `Word -> JSON` pero nunca `JSON -> Word`. Cuando Fernando modifica tiempos en post-produccion, el `.docx` de Andrea queda permanentemente obsoleto. Este es el problema del **"Guion Zombie"**: un documento que sigue existiendo pero ya no refleja la realidad del audio publicado.
4. **Validacion imposible en origen:** Andrea no tiene forma de saber si un dialogo excede el `max_duration_ms` de la escena visual hasta que el audio ya fue generado y alguien detecta la aceleracion. El error se descubre tarde, quemando creditos de API y tiempo del equipo.

**Consenso de 4 auditorias independientes:** Tanto Claude Opus, Gemini Deep Thinking, Gemini 3.1 Pro como Sonnet coinciden en que el `.docx` debe eliminarse como SSOT. La discrepancia esta en la velocidad de la transicion.

### 10.2 Propuesta: Evolucion Gradual (No Revolucion)

Andrea es una guionista creativa, no una ingeniera de datos. Su flujo de trabajo no puede cambiar de un dia para otro sin generar resistencia operativa y afectar la produccion. La transicion se divide en 3 fases con incremento gradual de estructura.

#### Fase A: Mejora Inmediata del Parser (0 cambio para Andrea)

**Duracion:** Semana 1-2 | **Esfuerzo:** 6-8h | **Impacto en Andrea:** Ninguno

Andrea sigue escribiendo en Word exactamente como hoy. Los cambios son internos al pipeline:

- **Fix Bug P0:** Guard clause en `prescanner.py` para que nunca crashee en `None`. Test unitario obligatorio.
- **Fix Bug P1:** Propagacion correcta de `language` en `WERResult` (actualmente hardcodeado a `ES`).
- **Capa de validacion post-parse:** Nuevo modulo `parse_validator.py` que analiza el output del parser y asigna un `confidence_score` (0.0-1.0) a cada campo extraido.
  - `confidence >= 0.85` -> campo aceptado automaticamente
  - `confidence 0.5-0.85` -> flag amarillo, requiere confirmacion humana
  - `confidence < 0.5` -> flag rojo, campo rechazado, requiere intervencion manual
- **Output mejorado:** `dialogue_objects.json` ahora incluye `_parse_confidence` por campo y `_ambiguous_lines[]` con las lineas que el parser no pudo resolver con certeza.

```json
{
  "segment_id": "EP052_SC04_L01",
  "character": "Michi",
  "character_confidence": 0.92,
  "text_es": "No manches! El perro Doge se llevo mi pelota.",
  "text_confidence": 0.97,
  "emotion": "angry",
  "emotion_confidence": 0.61,
  "_ambiguous_lines": ["Linea 47: no se pudo determinar si 'Michi' es personaje o acotacion"]
}
```

#### Fase B: Plantilla Word Estructurada (Cambio Minimo para Andrea)

**Duracion:** Semana 3-5 | **Esfuerzo:** 4-6h template + 3h parser update | **Impacto en Andrea:** Bajo

Andrea usa una plantilla `.docx` con campos obligatorios claramente delimitados. El parser se simplifica drasticamente porque el input es semi-estructurado.

**Campos de la plantilla:**

| Campo | Tipo | Ejemplo | Obligatorio |
|:------|:-----|:--------|:------------|
| `[ESCENA]` | ID | EP052_SC04 | Si |
| `[PERSONAJE]` | Nombre exacto | Michi | Si |
| `[EMOCION]` | Tag | angry_crying | Si |
| `[LINEA]` | Texto del dialogo | No manches! El perro... | Si |
| `[NOTAS_VISUALES]` | Contexto de la escena | Michi senala a lo lejos, frustrado | Recomendado |
| `[ONOMATOPEYA]` | Si/No | No | Si |

**Mejoras tecnicas en esta fase:**
- Parser mas robusto: reconoce delimitadores `[CAMPO]` en lugar de inferir estructura de lenguaje natural.
- `max_duration_ms` se calcula automaticamente desde el timing de animacion y se inyecta en el JSON sin que Andrea tenga que escribirlo.
- Tasa de error del parser baja de ~15-20% (estimado con formato libre) a ~2-5% (formato semi-estructurado).

#### Fase C: CMS/Airtable/Notion (Cambio Significativo, Maximo Beneficio)

**Duracion:** Semana 8-12 | **Esfuerzo:** 16-20h setup + migracion | **Impacto en Andrea:** Medio-Alto

Andrea escribe directamente en campos tipados con dropdowns. El `.docx` y el parser desaparecen por completo.

**Implementacion con Notion (opcion preferida por el equipo):**

| Campo | Tipo en Notion | Beneficio |
|:------|:---------------|:----------|
| `segment_id` | Formula auto-generada | Elimina errores de nomenclatura |
| `character_id` | Select dropdown (cerrado) | Imposible escribir "Michi_cat" vs "michi" vs "Michi" |
| `text_es` | Rich text | Andrea escribe libremente |
| `emotion_tag` | Select dropdown | Se mapea directo a `audio_tags` de Eleven v3 |
| `is_onomatopoeia` | Checkbox | Activa bypass de lookup table automatico |
| `visual_context` | Long text | Mina de oro para RAG en traduccion (elimina ambiguedad en 27 idiomas) |
| `max_duration_ms` | Number (auto-calculado) | Viene del timing de animacion |
| `syllable_count` | Formula | Calculo automatico para linter |

**Beneficios cuantificables:**
- **Cero crashes P0:** `prescanner.py` se vuelve obsoleto. Un script `fetch_script_db.py` descarga JSON inmaculado via API de Notion.
- **Linter en tiempo real:** Si Andrea escribe 20 silabas pero la escena dura 3.2 segundos, el sistema rechaza el campo y exige acortar el dialogo. El error se corrige en la mente de la creadora, no quemando creditos de API.
- **Inyeccion RAG de contexto visual:** El campo `visual_context` se pasa como system instructions al LLM traductor. La IA ya no tiene que adivinar si "pelota" es un balon de futbol o una canica; el contexto visual elimina la ambiguedad.
- **Export directo a JSON:** 0% error de parsing, 100% de campos tipados y validados.

### 10.3 El "Guion Zombie" -- Solucion Definitiva

**El problema:** Fernando modifica tiempos de audio en post-produccion (recorta silencios, ajusta pacing para lip-sync). Despues de sus ediciones, el `dialogue_objects.json` original tiene timestamps que ya no coinciden con el audio real publicado. Los SRTs generados a partir de ese JSON estaran desfasados. El guion esta "muerto pero sigue caminando" -- un zombie.

**La solucion: `zombie_slayer_sync.py`**

Este script usa la Forced Alignment API de ElevenLabs para reconciliar automaticamente los tiempos reales del audio final con la base de datos.

```
FLUJO:
  Fernando termina post-produccion
       |
  Ejecuta: python zombie_slayer_sync.py --audio final_mix.wav --json dialogue_objects.json
       |
  El script envia: POST /v1/forced-alignment
    Body: { audio: final_mix.wav, text: texto_esperado_concatenado }
       |
  La API devuelve: timestamps reales por palabra con precision de submilisegundos
       |
  El script actualiza: dialogue_objects.json con start_ms/end_ms corregidos
       |
  Bonus: genera SRT automatico matematicamente perfecto para YouTube
       |
  Opcional: git commit automatico del JSON actualizado (auditoria de cambios)
```

**Precision:** La Forced Alignment API de ElevenLabs opera a nivel de caracter con precision de submilisegundos, muy superior a cualquier solucion local basada en `difflib` o NLP heuristico.

**Resultado:** El SSOT ya no muere cuando Fernando toca el audio. Se auto-sana.

---

## 11. Scripts y Automatizaciones para el Equipo

### 11.1 Scripts Prioritarios

Consolidacion de todas las herramientas identificadas en las 4 auditorias, priorizadas por impacto operativo:

| # | Script | Para Quien | Funcion | API / Dependencia | Esfuerzo | Prioridad |
|:--|:-------|:-----------|:--------|:------------------|:---------|:----------|
| 1 | **`qph_segment_patcher.py`** | Saul/Ivan | Parchear segmentos individuales de audio sin re-renderizar el episodio completo. CLI que envuelve la Dubbing Resource API: `PATCH /v1/dubbing/resource/{id}/segments/{segment_id}` para actualizar texto + `POST .../dub-segment` para regenerar solo ese segmento. | ElevenLabs Dubbing Resource API | 6h | **P1** |
| 2 | **`zombie_slayer_sync.py`** | Fernando | Resolver el Guion Zombie. Envia audio final + texto esperado a Forced Alignment API, recupera timestamps reales, actualiza `dialogue_objects.json`, genera SRTs automaticos. | ElevenLabs Forced Alignment API | 3h | **P1** |
| 3 | **`blacklist_scanner.py`** | QA/Gio | Escanear texto pre-TTS contra los 27 archivos de blacklist JSON + activar `use_profanity_filter` en la llamada a ElevenLabs. Reporta matches con severidad y bloquea sintesis si score > 0. Complementado con Azure Content Safety API para idiomas sin blacklist local. | Blacklist JSONs + Azure Content Safety | 4h | **P1** |
| 4 | **`qa_gate_runner.py`** | Daniel/QA | Ejecutar los 4 Gates de QA automatizado en secuencia. Gate 1: safety + blacklist. Gate 2: calidad traduccion EN (COMET + LLM judges). Gate 3: calidad multi-idioma (GEMBA-MQM). Gate 4: verificacion audio (STT + WER + timing + speaker). Output: `qa_report.json` con semaforos por idioma. | Whisper, COMET, LLM APIs, jiwer | 14h | **P1** |
| 5 | **`audio_purifier.py`** | Ramon | Limpiar audio antes de dubbing. Recibe el MP4/WAV de Fernando con musica de fondo y respiraciones, envia a `POST /v1/audio-isolation`, devuelve pista de voz pura. Mejora la clonacion en los 27 idiomas. | ElevenLabs Audio Isolation API | 2h | **P2** |
| 6 | **`authoring_linter.py`** | Andrea | Validar en tiempo de escritura que el texto del dialogo cabe en la duracion visual de la escena. Calcula silabas estimadas, las compara contra `max_duration_ms`, y rechaza dialogos que causarian aceleracion en la voz TTS. Funciona como plugin de Notion o como validacion post-export. | Calculo local (syllable count) | 3h | **P2** |
| 7 | **`render_exporter.py`** | Fernando | Exportar stems por idioma y por personaje via la API de render. `POST /v1/dubbing/resource/{id}/render/{lang}` con opciones de tracks separados. Fernando recibe pistas individuales listas para mezclar en Premiere en lugar de un solo archivo monolitico. | ElevenLabs Dubbing Resource API | 3h | **P2** |
| 8 | **`cost_monitor.py`** | Alan/Daniel | Monitorear costos de API en tiempo real. `GET /v1/usage` para obtener consumo de creditos, desglosado por episodio, idioma y tipo de operacion. Alerta si un episodio supera el presupuesto estimado. Genera CSV semanal para management. | ElevenLabs Usage API | 2h | **P3** |

**Esfuerzo total:** ~37h para los 8 scripts. Los 4 scripts P1 suman ~27h y cubren el 80% del impacto.

### 11.2 Workflow por Persona: Como Cambia el Dia a Dia

**Andrea (Guionista):**
Escribe en la plantilla estructurada (Fase B) o en Notion (Fase C). El `authoring_linter.py` valida en tiempo real que sus dialogos caben en la duracion visual de cada escena. Ya no necesita preocuparse por el formato del parser ni por errores de extraccion. Su output es un JSON limpio y validado que alimenta directamente al pipeline de traduccion. El campo `visual_context` que ella redacta se convierte en la pieza clave que desambigua la traduccion a 27 idiomas.

**Ramon (Ingeniero de Audio):**
Sus stems de voz en espanol pasan automaticamente por `audio_purifier.py` antes de entrar al pipeline de dubbing. La voz que ElevenLabs clona ya no tiene respiraciones fuertes, eco ni musica de fondo, lo que eleva el piso de calidad en todos los idiomas. Ademas, el sistema trackea consistencia de voz cross-episodio usando ECAPA-TDNN para detectar si un personaje suena diferente entre EP051 y EP052.

**Saul/Ivan (Dubbing y QA):**
En lugar de regenerar minutos enteros de audio por una sola palabra robotica, usan `qph_segment_patcher.py` via CLI. Identifican el segmento problematico, escriben la correccion, y en ~4 segundos tienen el WAV corregido descargado en su carpeta local. Lo que antes tardaba 5 minutos de re-render ahora tarda 4 segundos. Para los idiomas Tier 1 (ES, EN, PT, DE, IT), revisan el 100% de los segmentos. Para Tier 2-3, solo revisan los que el QA automatico flaggeo.

**Fernando (Post-Produccion):**
Recibe stems individuales por personaje y por idioma via `render_exporter.py`, eliminando el trabajo manual de separar pistas en Premiere. Cuando termina de editar, ejecuta `zombie_slayer_sync.py` que sincroniza automaticamente los timestamps del JSON con su audio final. Los SRTs se generan matematicamente perfectos. El Guion Zombie muere definitivamente.

**Daniel (Ingenieria/Arquitectura):**
Opera el `qa_gate_runner.py` que ejecuta los 4 Gates automatizados. Monitorea el dashboard de semaforos por idioma (verde = auto-aprobado, amarillo = muestreo humano, rojo = revision obligatoria). Cada correccion que Saul/Ivan o Fernando realizan se registra en la memoria Kaizen (Mem0), alimentando el sistema con patrones de error que se previenen en episodios futuros. Usa `cost_monitor.py` para reportar costos reales a management.

**Gio (QA Final):**
Revisa el dashboard de QA con semaforos por idioma. Verde significa que el episodio paso todas las verificaciones automaticas. Amarillo requiere muestreo aleatorio. Rojo requiere revision completa antes de publicacion. Gio ya no necesita escuchar 27 idiomas manualmente; solo atiende las excepciones que el sistema identifica.

---

## 12. Roadmap de Implementacion (5 Fases)

### 12.1 Resumen de Fases

| Fase | Semanas | Esfuerzo | Entregable Principal |
|:-----|:--------|:---------|:---------------------|
| **Phase 0: Quick Wins** | 1 | 12-15h | Bugs corregidos, sistemas conectados, 1 episodio E2E probado |
| **Phase 1: QA Pipeline** | 2-3 | 34-46h | `audit_service` + `prompt_scanner` + WER medido en 27 idiomas |
| **Phase 2: Speakers + Blacklists** | 4-6 | 39-49h | `validate_speakers` + 27 blacklists completas + Dubbing Resource API |
| **Phase 3: Automatizacion Completa** | 7-10 | 40-50h | Flujo E2E sin Web UI + batch processing + dashboard QA |
| **Phase 4: Avanzado** | 11+ | 50-64h | ROI dashboard por idioma + tropicalizacion + Kaizen continuo |
| **TOTAL** | | **175-224h** | De 0% a ~100% cobertura QA automatizado |

### 12.2 Phase 0: Quick Wins -- VERIFICAR ANTES DE CONSTRUIR

La premisa fundamental de Phase 0 es que **no se escribe codigo nuevo hasta validar que los cimientos existen**. El PR #71 tiene 14 meses de inactividad. Asumir que funciona sin verificarlo seria construir sobre arena.

**Dia 1: Verificacion y Bugs Criticos (5-6h)**

```
# 1. Verificar estado del PR #71
git fetch origin
git checkout feature/dubbing-pipeline
git log --oneline -10
python -m pytest tests/ -v  # Ejecutar tests existentes

# 2. Fix P0: prescanner crash en None (1h)
# Guard clause + test unitario
# Verificar: prescanner nunca crashea con input vacio o malformado

# 3. Fix P1: WERResult.language hardcodeado a ES (30min)
# Propagar parametro language correctamente
# Verificar: WERResult refleja idioma real del segmento

# 4. Ejecutar pipeline E2E con 1 episodio real
python dubbing_pipeline.py --episode EP042 --languages es,en,de
# Criterio de exito: el episodio pasa sin intervencion manual
```

**Dia 2: Spike Tecnico API + Limpieza Repo (4-5h)**

```
# 1. Verificar estado actual de la API ElevenLabs
# - Dubbing Resource API: existe y funciona con plan Pro?
# - Forced Alignment: disponible?
# - Scribe v2 con entity detection: funcional?
# - Pronunciation Dictionaries: creacion y asignacion via API?
curl -H "xi-api-key: $KEY" https://api.elevenlabs.io/v1/dubbing/resource
# Documentar: que endpoints funcionan, cuales no, cuales requieren Enterprise

# 2. Limpieza del repositorio Doge-MultiLang
# - Agregar .gitignore (el docx de 43MB no debe estar en git)
# - Crear CLAUDE.md con contexto del proyecto
# - Commitear los 70 archivos untracked antes de que se pierdan
# - Eliminar 3 blacklists duplicadas en docs/levantamientos/
```

**Dia 3: Entrevistas y Decisiones Clave (3-4h)**

| Entrevista | Duracion | Objetivo | Riesgos que Resuelve |
|:-----------|:---------|:---------|:---------------------|
| Saul + Ivan | 30 min | Confirmar pain points de dubbing, validar prioridad de `qph_segment_patcher.py`, medir apertura a AI-Studio | R-004, R-010 |
| Fernando | 30 min | Confirmar si puede exportar stems por personaje, validar el Guion Zombie como problema real, demo de Forced Alignment | R-004, R-011 |

**Decisiones a tomar al cierre del Dia 3:**

| Decision | Opciones | Informacion Necesaria |
|:---------|:---------|:----------------------|
| D-001: Extension AI-Studio vs Greenfield parcial | A) Extender (~28h) B) Reconstruir (~60h) | Resultado del E2E del Dia 1 |
| D-003: CSV Manual vs Dubbing Resource API | A) CSV experimental B) Resource API soportada | Resultado del spike del Dia 2 |
| D-004: Stems (Opcion A) vs Re-Alignment (B) vs PVC API (C) | A, B, C o combinacion | Entrevista con Fernando |

### 12.3 Criterios de Salida por Fase

| Fase | Criterios de Salida |
|:-----|:-------------------|
| **Phase 0** | (1) PR #71 verificado y E2E ejecutado con 1 episodio real sin crashes. (2) Bugs P0 y P1 corregidos con tests unitarios. (3) Spike de API documentado con endpoints confirmados. (4) Repo limpio: .gitignore, CLAUDE.md, 70 archivos commiteados. |
| **Phase 1** | (1) `audit_service.py` operativo y orquestando los 4 Gates. (2) WER medido en al menos 5 idiomas Tier 1 con datos reales. (3) Forced Alignment integrado en `elevenlabs.py`. (4) Endpoints de auditoria expuestos y documentados. |
| **Phase 2** | (1) 27 blacklists JSON completas (LLM draft + revision nativa para Tier 1). (2) `validate_speakers.py` con fuzzy match funcionando en episodio real. (3) Dubbing Resource API integrada: parcheo granular de segmentos funcional. (4) Pronunciation Dictionaries cargados para los 5 personajes principales. |
| **Phase 3** | (1) Flujo E2E completo sin necesidad de Web UI de ElevenLabs. (2) Batch processing funcional con cola, rate limits y prioridad por tier. (3) Dashboard QA minimo con semaforos por idioma. (4) Guia de onboarding escrita y demo realizada con Saul/Ivan. |
| **Phase 4** | (1) ROI dashboard por idioma conectado a YouTube Analytics + costos API. (2) Tropicalizacion automatica con `cultural_matrix_global.json` inyectado en prompts. (3) Metricas historicas: tendencia de WER, FTR y CAPA por idioma por episodio. (4) Sistema Kaizen: Mem0 almacena correcciones, el pipeline las incorpora automaticamente. |

### 12.4 Costo por Episodio (Corregido y Verificado)

La estimacion original de ~$1.20/proyecto del Mega Doc era una hipotesis con confianza del 35% (A-005). Tras deep research con precios reales de APIs y modelos open-source, el costo real es significativamente mayor -- pero sigue representando un ahorro masivo.

| Componente | Costo/Episodio | Notas |
|:-----------|:---------------|:------|
| ElevenLabs (generacion TTS) | Incluido en plan Pro | Ya lo paga QPH, no es costo incremental |
| COMET/xCOMET | ~$0.00 | Open source, self-hosted, Apache 2.0 |
| GEMBA-MQM (3 jueces LLM) | ~$2-5 | Claude Sonnet + GPT-4o + Gemini Flash por episodio |
| STT dual (Whisper + Deepgram) | ~$3-6 | 27 idiomas x ~10 min de audio cada uno |
| Audio checks (librosa/pyloudnorm) | ~$0.00 | CPU-only, ejecucion en milisegundos |
| UTMOS (naturalidad MOS) | ~$0.00 | Open source, self-hosted |
| emotion2vec+ (tono emocional) | ~$0.00 | Open source, self-hosted |
| Speaker verification (ECAPA-TDNN) | ~$0.00 | Open source, self-hosted |
| GPU compute (modelos self-hosted) | ~$1-2 | ~$0.30/hr en A10G spot instance |
| **Subtotal QA automatizado** | **~$6-13** | **Sin intervencion humana** |
| Revision humana Tier 1 (5 idiomas) | ~$40-50 | Tiempo interno de Saul/Ivan, no freelancers |
| **TOTAL POR EPISODIO** | **~$46-63** | **Con revision humana Tier 1 incluida** |

**Comparacion con alternativas:**

| Escenario | Costo/Episodio | Cobertura | Notas |
|:----------|:---------------|:----------|:------|
| Solo QA automatizado (sin humano) | ~$6-13 | 27 idiomas, metricas objetivas | Suficiente para Tier 3 |
| QA automatizado + humano Tier 1 | ~$46-63 | 27 idiomas auto + 5 idiomas con revision humana | **Recomendado para produccion** |
| Revision humana completa (27 idiomas) | ~$5,400-8,100 | 27 idiomas x revisor nativo por idioma | Inviable economicamente |
| Estimacion original (Mega Doc) | ~$1.20 | Subestimada 40-50x | **CORRECCION: esta cifra era incorrecta** |

**Ahorro neto:** El modelo recomendado ($46-63/episodio) representa un **ahorro del ~97%** respecto a revision humana completa ($5,400-8,100). Aunque es 40-50x mas caro que la estimacion original de $1.20, el ROI sigue siendo extraordinario: por cada dolar invertido en QA automatizado, QPH ahorra entre $85 y $130 en costos de revision humana.

**Costo anual estimado (52 episodios/ano):**
- QA automatizado solamente: ~$312-676/ano
- Con revision humana Tier 1: ~$2,392-3,276/ano
- vs revision humana completa: ~$280,800-421,200/ano
