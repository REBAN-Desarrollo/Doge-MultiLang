# Workflow 09: Doblaje Multi-Idioma (Celula 7)

**Tiempo:** 2-4 horas (automatizado) / 4.5+ horas (manual) | **Responsable:** Saul/Ivan (C7 Traduccion)
**Output:** Audio doblado por idioma (16 idiomas)

---

## Nota: DEC-QPH-006 (CLOSED - N/A)

> **Decision 2026-02-17 (Daniel Garza, Sponsor):** Las canciones de QPH son **instrumentales** (sin letra). No hay contenido textual que traducir o adaptar para multi-idioma. El pipeline de dubbing aplica **solo al dialogo hablado**. La musica instrumental pasa sin modificacion a todos los idiomas. Ver [DECISION_LOG.md DEC-QPH-006](../../03_DECISIONS/DECISION_LOG.md).

---

## Objetivo

Producir versiones dobladas del episodio en 16 idiomas a partir del audio master en espanol, usando ElevenLabs Dubbing API con validacion por tiers. **Scope: Solo dialogo hablado. Musica instrumental excluida.**

---

## Trigger

**Episode Audio Master Aprobado (ES)**: El MP4 con voz limpia en espanol ha sido ensamblado y aprobado por Fernando (post-produccion, Workflow 06).

---

## Flujo del Proceso

```
  MP4 APROBADO (ES) + manifest.json
       |
  [1] Preparar Proyecto ────── Importar manifest, pre-configurar voces
       |
  [2] Transformacion 1 ─────── ES -> EN (Ingles como MASTER)
       |                         Revision humana obligatoria
       |
  [3] Validar EN ────────────── QA 100% linea por linea
       |
  [4] Cola por Tier ─────────── Priorizar: Tier 1, luego 2, luego 3
       |
  [5] Transformacion 2 ─────── EN -> Otros idiomas (ElevenLabs Dubbing)
       |
  [6] Validacion por Tier ───── Tier 1: humana | Tier 2: sampling | Tier 3: auto
       |
  [7] Export ────────────────── Audio doblado por idioma
```

---

## Pasos Detallados

### Paso 1: Preparar Proyecto de Dubbing

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | MP4 (voz limpia ES) + `manifest.json` del Workflow 08 |
| **Herramienta** | ElevenLabs Dubbing Studio / API `POST /v1/dubbing` |
| **Acciones** | Subir MP4, importar mapping de voces desde manifest, pre-configurar personajes |
| **Regla** | NUNCA re-mapear voces manualmente si el manifest esta disponible |
| **Responsable** | Saul/Ivan |

### Paso 2: Transformacion ES -> EN

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Texto ES detectado por ElevenLabs (ASR interno) |
| **Validacion previa** | Contrastar texto detectado vs guion original. Si hay discrepancias > umbral -> correccion manual |
| **Herramienta** | ElevenLabs Dubbing (traduccion interna) |
| **Output** | Audio EN generado |
| **Regla** | EN es MASTER -> requiere aprobacion humana 100% |

### Paso 3: Validar Ingles (Master)

| Aspecto | Detalle |
|:--------|:--------|
| **Metodo** | Revision linea por linea (100% humana) |
| **Checks** | Fidelidad semantica, tono apropiado 8-15 anos, timing vs escenas, keyword check (groserías) |
| **Herramientas** | LLM Judge + COMET Score + escucha humana |
| **Gate** | EN debe estar aprobado ANTES de generar otros idiomas |
| **Responsable** | Saul/Ivan |

### Paso 4: Cola por Tier de Idioma

| Tier | Idiomas | Orden de Procesamiento |
|:-----|:--------|:-----------------------|
| **Tier 1** | PT-BR, FR, DE | Primero (requieren revision humana) |
| **Tier 2** | AR, KO, JA, HI, ZH | Segundo (muestreo inteligente) |
| **Tier 3** | FIL, ID, IT, RU, TR, TA, MS | Ultimo (automatico) |

### Paso 5: Transformacion EN -> Otros Idiomas

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | EN master aprobado |
| **Herramienta** | ElevenLabs Dubbing API |
| **Acciones por idioma** | Character re-mapping (heredado), generacion, silence harvest, blacklist pre-scan |
| **Paralelismo** | Hasta 4 idiomas simultaneos |

### Paso 6: Validacion por Tier

#### Tier 1 (PT-BR, FR, DE): Validacion Maxima

| Checkpoint | Metodo | Responsable |
|:-----------|:-------|:------------|
| Traduccion EN->{idioma} | Muestreo 30% + metricas COMET | Automatico + Humano |
| Preview audio | Escucha de segmentos criticos (intro, climax, final) | Revisor bilingue |
| ASR Post-dubbing | WER < 5% | Automatico |
| Blacklist check | Zero Category A | Automatico |

#### Tier 2 (AR, KO, JA, HI, ZH): Muestreo Inteligente

| Checkpoint | Metodo | Responsable |
|:-----------|:-------|:------------|
| Traduccion EN->{idioma} | Solo metricas automaticas (COMET, BERTScore) | Automatico |
| Preview audio | Solo segmentos flaggeados | Automatico + Humano si flagged |
| ASR Post-dubbing | WER < 10% | Automatico |

#### Tier 3 (FIL, ID, IT, RU, TR, TA, MS): Solo Automatico

| Checkpoint | Metodo | Responsable |
|:-----------|:-------|:------------|
| Traduccion EN->{idioma} | Metricas automaticas | Automatico |
| ASR Post-dubbing | WER < 15% | Automatico |
| Flag para revision | Solo si metrics < umbral | Escalado a humano |

### Paso 7: Export

| Aspecto | Detalle |
|:--------|:--------|
| **Estructura** | `output/{serie}/{episodio}/dubbing/{idioma}/` |
| **Formato** | MP4 por idioma o audio tracks separados |
| **Reporte** | Reporte de QA con WER scores, flags, issues pendientes |

---

## Las 7 Mudas: Problemas Recurrentes y Mitigaciones

Problemas identificados en entrevistas con Saul y Alan (Dic 2024). Cada muda tiene impacto real en el flujo de trabajo.

### Muda 1: Re-Mapping de Personajes (Talent Waste)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | Saul asigna voces "de memoria" porque conoce el proyecto. Debe re-mapear los mismos personajes en cada idioma. |
| **Impacto** | ~5-10 min por proyecto x N idiomas. Riesgo de asignacion incorrecta. |
| **Workaround actual** | Saul memoriza: "le pongo siempre el primero protagonista... para sacarlo mas rapido" |
| **Mitigacion** | Persistencia de Voice IDs via `manifest.json`. El mapeo de Ramon en TTS se hereda automaticamente al dubbing. |

### Muda 2: Cosecha Manual de Silencios (Extra Processing)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | ElevenLabs no respeta los silencios del audio original; los comprime o estira. |
| **Impacto** | Saul debe cortar manualmente cada silencio para evitar "timing drift". |
| **Workaround actual** | Observar waveform: "Nomas es visual... a la mitad del silencio" |
| **Mitigacion** | Manual Dub CSV: inyectar timestamps exactos de After Effects. Elimina adivinanza de silencios. |

### Muda 3: Mezcla de Dialogos en Pista Unica (Defects)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | ElevenLabs a veces detecta multiples personajes como uno solo. |
| **Impacto** | Separacion manual y reasignacion a pistas correctas. |
| **Workaround actual** | Revision auditiva: "Aqui me mezclo 2 personajes en un mismo dialogo" |
| **Mitigacion** | Voice Segments v3: enviar dialogos etiquetados por orador (multi-track). |

### Muda 4: Bug `no.` -> `number` (Defects)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | El punto despues de "no" se interpreta como abreviatura de "number". |
| **Impacto** | Audio incorrecto que requiere edicion manual del texto. |
| **Workaround actual** | Editar texto en ElevenLabs manualmente |
| **Mitigacion** | Sanitizador regex pre-envio: `no.` -> `no`. Automatizado en backend. |

### Muda 5: Filtros de Seguridad por Idioma (Waiting)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | Palabras como "muerte", "sexy" son bloqueadas en ciertos idiomas. |
| **Impacto** | Saul debe cambiar manualmente el texto en espanol para que traduzca. |
| **Workaround actual** | Trial and error: "La palabra sexy, no me la quiere poner, hay que traducir" |
| **Mitigacion** | Pre-scanner LLM + diccionario de blacklist por idioma con sinonimos sugeridos. Escaneo ANTES de enviar. |

### Muda 6: Audio "Comido" / Clipping (Defects)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | ElevenLabs recorta audio mas de lo debido, perdiendo silabas. |
| **Impacto** | Deteccion auditiva manual. "S arrastrada" al final de frases. |
| **Workaround actual** | "Se habia pasado. Nomas lo recorri para ajustarlo" |
| **Mitigacion** | Fixed Duration + buffer de respiro. Forzar duracion exacta con margen en API. |

### Muda 7: Falta de Auto-Scroll en Editor (UX Friction)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | El editor de ElevenLabs no sigue la linea de tiempo automaticamente. |
| **Impacto** | Scroll manual constante durante revision de audio. |
| **Workaround actual** | Scroll manual |
| **Mitigacion** | Limitacion de la UX de ElevenLabs. Sin solucion desde backend. Feature request enviado. |

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md` (Seccion: Problemas Identificados)

---

## Roles

| Rol | Persona | Responsabilidad |
|:----|:--------|:----------------|
| **Dubbing Lead (C7)** | Saul/Ivan | Subir MP4, corregir texto, revisar traducciones Tier 1 |
| **Factory Manager** | Alan/Ramon | Coordinacion, resolucion de bloqueos |
| **Sistema** | AI-Studio | Sanitizacion, blacklist pre-scan, WER checks, export |

---

## Herramientas

| Herramienta | Proposito | Ubicacion |
|:------------|:----------|:----------|
| ElevenLabs Dubbing | Doblaje multi-idioma | API externa / Studio web |
| ElevenLabs STT | Transcripcion para validacion | API externa |
| Whisper API | Transcripcion dual (validacion cruzada) | OpenAI API |
| Gemini Flash | STT + analisis semantico | Google API |
| Blacklist JSONs | Filtros de contenido por idioma | Sistema (config) |
| `manifest.json` | Casting heredado de TTS | Output del Workflow 08 |

---

## Output

- Audio doblado por idioma (MP4 o tracks)
- Reporte de QA con WER scores y flags
- Issues pendientes para revision humana (si aplica)

---

## Quality Gates (Resumen)

| Gate | Criterio | Accion si Falla |
|:-----|:---------|:----------------|
| **EN Master aprobado** | Revision humana 100% + COMET > 0.85 | NO generar otros idiomas hasta aprobar EN |
| **WER por tier** | Tier 1 < 5%, Tier 2 < 10%, Tier 3 < 15% | Escalado a revision humana |
| **Safety filter** | Zero Category A en todos los idiomas | Bloquear publicacion, revisar blacklist |
| **Timing sync** | Traduccion no excede 20% de duracion ES | Dividir dialogos largos o ajustar velocidad |

---

## Dependencias

| Depende De | Workflow |
|:-----------|:---------|
| Audio Master ES aprobado | Workflow 06 (Produccion) + Workflow 08 (TTS) |
| manifest.json | Workflow 08 (Audio TTS) |

| Es Dependencia De | Workflow |
|:-------------------|:---------|
| QA y Publicacion | Workflow 07 (QA Publicacion) |

---

## Estimacion de Tiempos

| Escenario | Tiempo Manual | Tiempo Automatizado | Ahorro |
|:----------|:-------------|:--------------------|:-------|
| ES -> EN (1 idioma) | ~40 min | ~5 min | 87% |
| 16 idiomas completo | ~4.5 hrs | ~40 min | 85% |
| Costo validacion (16 idiomas, 10 min video) | N/A | ~$1.20 | N/A |

---

**Fuentes:**
- `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md`
- `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/01_Analysis/FLUJO_ACTUAL.md`
- `_recovery/NEW_FEATURES/ElevenLabs/Quality/VALIDATION_FLOW_TIERING.md`

---

## Paso 8: Retorno a Fernando (Post-Dubbing)

Una vez exportados los audios doblados por idioma, el flujo no termina en Saul/Ivan:

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Audio doblado por idioma (pistas limpias de dialogo) |
| **Accion** | Fernando recibe las pistas y las mete a Premiere (o herramienta de ensamble) junto con SFX y musica instrumental |
| **Output** | MP4 final por idioma con dialogo + SFX + musica |
| **Regla** | Fernando NO manipula ni transforma el dialogo doblado. Solo mezcla pistas. La manipulacion es rara y debe documentarse como excepcion. |
| **Siguiente paso** | MP4 por idioma se sube a YouTube con pistas de audio asignadas una por una |

> Fuente: Transcript QPH Post-Produccion 31 Dic 2025 (Alan, min 23:46 - 24:24): "Lo descargabamos y ya regresaban con Fernando y Fernando se encargaba de volverlos a meter a Premier y exporta uno por idioma ya con los SFX y la musica."

---

## Nota de Equipo: Transicion de Responsabilidad (2026)

Con la salida de Saul, Alan asumio la operacion del pipeline de dubbing. Esto implica:

- Alan identifica las problematicas del flujo de primera mano
- El conocimiento tactico de Saul (Muda 6) debe ser documentado formalmente antes de que se pierda
- Los checklists de errores comunes (bug "no.", palabras censuradas por idioma, timings) son responsabilidad de Alan de mantener actualizados

> Fuente: Transcript QPH Post-Produccion 31 Dic 2025 (Alan, min 58:55): "Con la salida de Saul pues voy a dar la oportunidad de adentrarme a lo que es el doblaje e identificar las problematicas y encontrar la logica o la manera correcta de plasmarlo en palabras para que sea mas facil al momento de desarrollarlo."

---

## Analisis Lean: Riesgos Arquitectonicos

Brechas identificadas en el analisis de arquitectura del pipeline (Dic 2025), adicionales a las 7 Mudas operativas documentadas arriba.

### Riesgo 1: Perdida de Metadata Semantica (Data Loss)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | El guion tiene metadata rica de intencion por escena: "susurro", "ebrio", "grito", nivel de emocion. Esta data vive en el guion/Excel. Al exportar a MP4 (audio plano), esa metadata se pierde. |
| **Consecuencia** | ElevenLabs infiere la emocion solo por el audio. Si el TTS espanol no fue suficientemente expresivo, la traduccion pierde el tono. |
| **Solucion propuesta** | Pasar metadata de emocion como prompt o guia al motor de traduccion (si la API lo permite) o al revisor humano. |

### Riesgo 2: Efecto "Telefono Descompuesto" (Cascading Error)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | La arquitectura en cascada (ES -> EN -> Resto) amplifica errores. Un matiz perdido en ES->EN se convierte en la "verdad absoluta" para los otros 15 idiomas. |
| **Ejemplo** | Si "Que padre!" se traduce como "What a father!" (error de slang), el aleman traducira "Was fur ein Vater!" perdiendo totalmente el sentido de "Cool". |
| **Mitigacion** | Validacion humana critica en el paso EN Master. Ya implementado como gate obligatorio (ver Paso 3). |

### Riesgo 3: Fragilidad del ID por Nombre Clave

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | Depender de "1-2 palabras clave" para vincular assets y guiones es fragil. Riesgo de colisiones de nombres, typos, archivos perdidos. |
| **Mejora propuesta** | Implementar Project ID (UUID) unico generado desde la creacion del guion que acompane todos los archivos: `P-2025-001_NombreClave_v1.mp4`. |

---

## Puntos de Control (QC) del Pipeline

Estado de los puntos de control formales identificados en el analisis Lean:

| ID | Punto de Control | Estado Actual | Propuesta |
|:---|:----------------|:-------------|:----------|
| **QC1** | Guion ES = Texto detectado por ASR | Parcial (manual) | Automatizar diff guion vs. deteccion antes de traducir |
| **QC2** | Traduccion ES->EN validada | Implementado (Paso 3) | Formalizar con checklist estandar |
| **QC3** | Traduccion EN->X validada por tier | Implementado (Paso 6) | Expandir muestreo en Tier 2/3 |
| **QC4** | Timing por escena dentro de tolerancia | No definido formalmente | Definir tolerancia ±% por idioma + flag automatico |

---

## Oportunidades de Automatizacion (Backlog)

Identificadas en el analisis Lean de Dic 2025. Ordenadas por prioridad:

| ID | Oportunidad | Complejidad | Impacto | Prioridad |
|:---|:------------|:------------|:--------|:----------|
| **A1** | Contrastar guion original vs texto detectado por ASR (diff automatico) | Baja | Alto | P1 |
| **A2** | Metricas automaticas COMET/BERTScore para evaluar traducciones | Media | Alto | P1 |
| **A3** | Particionar traduccion por escenas con timestamps (no MP4 completo) | Alta | Alto | P2 |
| **A4** | Banco de "slang seguro" por idioma (sinonimos para palabras censuradas) | Baja | Medio | P2 |
| **A5** | Pipeline de QC con muestreo automatico para Tier 2/3 | Media | Alto | P2 |

### Detalle: A1 — Validar Guion vs Texto Detectado

```
ENTRADA: Guion original (texto) + MP4
PROCESO:
  1. ElevenLabs detecta texto del audio (ASR interno)
  2. Comparar con guion original (diff)
  3. Flaggear discrepancias
SALIDA: Reporte de discrepancias + texto corregido para revision humana
```

### Detalle: A2 — Metricas Automaticas de Traduccion

```
ENTRADA: Texto ES original + Traduccion EN
PROCESO:
  1. COMET score (fidelidad semantica)
  2. BERTScore (similitud contextual)
  3. Validacion de safety (LLM judge)
SALIDA: Score consolidado + flags de riesgo por segmento
```

### Detalle: A3 — Traduccion Particionada por Escenas

```
HIPOTESIS: Si partimos el MP4 por escenas antes de traducir,
           podemos controlar mejor el timing por dialogo.

INVESTIGAR:
  - Si ElevenLabs Dubbing API soporta segmentos discretos
  - Si se pueden enviar timestamps de corte por escena
  - Si se puede enviar el texto de referencia por segmento
```

---

## Matriz de Riesgo por Idioma

| Idioma | Volumen | Revisor Humano | Nivel de Riesgo | Mitigacion |
|:-------|:--------|:---------------|:----------------|:-----------|
| **Ingles** | Alto | Alan/Ivan | Bajo | Mantener validacion humana 100% |
| **Portugues (PT-BR)** | Alto | Sin asignar | Medio | Agregar muestreo + revisor |
| **Aleman** | Medio | Sin asignar | Medio | Muestreo + revisor bilingue |
| **Arabe** | Medio | Sin asignar | Alto | Metricas + revisor externo |
| **Ruso** | Bajo | Sin asignar | Alto | Metricas + revisor externo |
| **Otros (Tier 3)** | Bajo | Sin asignar | Medio | Metricas automaticas |

---

## Proximos Pasos (Roadmap Dubbing)

### Corto Plazo (Quick Wins)
- [ ] Documentar checklist de errores comunes conocidos por Alan (reemplaza conocimiento tacito de Saul)
- [ ] Implementar contraste guion vs texto detectado (A1)
- [ ] Definir tolerancia de timing aceptable por idioma (QC4)

### Mediano Plazo
- [ ] Implementar metricas automaticas COMET/BERTScore (A2)
- [ ] Crear banco de slang seguro Tier 1: PT-BR, FR, DE (A4)
- [ ] Definir estrategia de muestreo formal por tier (A5)

### Investigacion Requerida
- [ ] Capacidades de ElevenLabs Dubbing API para segmentacion y texto de referencia (A3)
- [ ] Costo de LLM-as-judge para validacion de 16 idiomas activos
- [ ] Opciones de revisores externos para idiomas Tier 2/3
