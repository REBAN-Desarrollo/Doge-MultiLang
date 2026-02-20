# Post-produccion Dashboard - Fernando

> **Tu comando central: Audio, Musicalizacion y Ensamble Final**

---

## Rol

| Aspecto | Detalle |
|:--------|:--------|
| **Titulo** | Post-produccion Audio |
| **Celulas** | C4 (Musicalizacion), C5 (Ensamble) |
| **Reporta a** | Alan / Ramon (Factory Managers) |
| **Coordinan con** | Ramon (input: TTS + esqueleto AE), Saul/Ivan (output: audio ES para dubbing), Gio (QA del MP4 final) |

---

## Responsabilidad Critica

Fernando es el **Dueno del Pipeline de Audio End-to-End**. Recibe el proyecto After Effects ensamblado por Alan/Ramon y las escenas renderizadas por los animadores, agrega SFX, musicalizacion y mezcla final, y entrega el MP4 completo que es la fuente de verdad para QA, para el equipo de doblaje y para publicacion.

**Regla SSOT critica:** El MP4 final que exporta Fernando es la UNICA fuente de verdad del audio. El guion .docx original puede estar desactualizado si Fernando modifico o recorto dialogos durante la mezcla. Saul/Ivan y Ramon deben usar el MP4, no el .docx, como referencia para dubbing.

**Evidencia:** "Fernando ensambla el proyecto, hace sonorizacion, le entrega doblaje... regresaban con Fernando y ya Fernando se encargaba de volvernos a exportar ya con los SFX integrados" (Alan, transcript Dic 31). "Daniel cubriendo rol de Fernando, ~75-85% confianza" (Q7 DRAFT 2026-02-13).

---

## El Pain Point Critico: "Guion Zombie"

> Este es el riesgo sistemico mas importante en la interfaz Fernando <-> Ramon/Dubbing.

**Situacion:** Fernando puede recortar, ajustar o modificar dialogos durante la mezcla de audio para resolver problemas de timing o sincronizacion. Estos cambios quedan registrados en el MP4 final pero NO necesariamente en el guion .docx.

**Consecuencia:** Si Ramon genera nuevo TTS o Saul/Ivan trabajan el dubbing usando el .docx como referencia, estan trabajando con un "Guion Zombie" — un guion que ya no refleja la realidad del audio. El resultado es timestamps rotos entre el audio TTS, el video animado y las pistas dobladas.

**Regla de mitigacion:** El MP4 final de Fernando es el SSOT. Cualquier cambio de dialogo post-mezcla debe:
1. Notificarse a Alan/Ramon de inmediato.
2. Actualizarse en el guion master antes de que Ramon regenere TTS o Saul inicie dubbing.
3. No iniciar dubbing hasta confirmar que el guion y el MP4 estan sincronizados.

---

## Flujo de Trabajo

```
Alan/Ramon ensamblan el proyecto AE (esqueleto sin audio)
  |
  v
Fernando recibe:
  Proyecto AE ensamblado + escenas individuales (llegan de forma espaciada)
  Audio TTS de Ramon (Workflow 08) - voces por personaje
  |
  v
[1] Revision de escenas disponibles
  |  - Identificar que escenas llegaron vs cuales faltan
  |  - Problema: escenas llegan fuera de secuencia (1,2,3 -> 7,8,9 -> 5,6)
  |  - Decision: si faltan >50% de escenas, esperar bloque antes de musicalizacion
  |
  v
[2] Ensamble progresivo en After Effects
  |  - Insertar escenas disponibles en el timeline del proyecto AE
  |  - Ajustar timing si es necesario (raramente <10% de escenas)
  |  - Regla: si dialogo > escena animada -> escalar al animador (Fernando NO recorta)
  |
  v
[3] SFX y Foleys por escena
  |  - Banco propio QPH (fuente primaria)
  |  - ElevenLabs Sound Effects API (cuando el banco no tiene el efecto)
  |  - Sincronizar con frame exacto de la accion visual
  |
  v
[4] Musicalizacion (BGM por segmento narrativo)
  |  - Fuentes: banco propio QPH + ElevenLabs Music API
  |  - Criterio: por tono de escena (intuicion + indicaciones de guionistas/Andrea)
  |  - Regla: BGM SIEMPRE cede al dialogo (bajar >6 dB cuando hay voz activa)
  |
  v
[5] Mix en Adobe Audition
  |  - Combinar: voz TTS (Ramon) + BGM + SFX
  |  - Jerarquia: Voz > SFX (-6 a -12 dB) > BGM (-12 a -18 dB)
  |  - Normalizacion objetivo: -14 LUFS (estandar YouTube)
  |
  v
[6] Revision de calidad interna (5 criterios - ver KPIs)
  |
  v
[7] Export dual
  |  - 16:9 (YouTube horizontal)
  |  - 9:16 (Shorts/Reels vertical)
  |  - Audio ES separado para Saul/Ivan (voz limpia sin BGM/SFX solapados)
  |
  v
[8] Entrega para QA y Doblaje
     - Avisar a Alan/Ramon que el episodio esta listo
     - Entregar audio ES a Saul/Ivan para inicio de dubbing (Workflow 09)
     - Fernando pierde visibilidad de lo que ocurre aguas abajo (gap documentado)
```

---

## KPIs

| Metrica | Objetivo | Frecuencia | Estado |
|:--------|:---------|:-----------|:-------|
| Tiempo de procesamiento de audio por episodio | Por medir (estimado: 5-11 hrs sin herramientas, 3-6 hrs con ERP) | Por episodio | Sin baseline |
| FTR (First Time Right) de audio | 0 defectos reportados por Gio en primera entrega | Por episodio | Sin baseline formal |
| OTD (On-Time Delivery) | Entregar antes del inicio de dubbing (no ser cuello de botella) | Por episodio | Sin baseline |
| % escenas recibidas en secuencia | > 80% (problema documentado: hoy es bajo) | Por episodio | Sin baseline |
| Defectos de audio reportados por QA | 0 (meta cero defectos: musica fuerte, SFX desincronizado, volumen) | Por episodio | Sin baseline |
| Tiempo busqueda musica/SFX | Reducir (es el mayor NVA del proceso hoy) | Por episodio | Sin baseline |
| Tiempo audio-a-publicacion | Por medir (Fernando pierde visibilidad post-entrega) | Por episodio | Sin baseline |
| Doble formato correcto | 100% (ambas versiones 16:9 + 9:16 entregadas y verificadas) | Por episodio | Sin baseline formal |

**Checklist de "listo" (criterios actuales de Fernando):**

| # | Criterio |
|:--|:---------|
| 1 | Niveles normalizados a -14 LUFS y sin distorsion (picos < 0 dBFS) |
| 2 | Musica no compite con dialogos (BGM < voz por > 6 dB) |
| 3 | SFX sincronizados con la accion visual (no desviado mas de 2 frames) |
| 4 | Sin silencios incomodos ni cortes abruptos |
| 5 | Coherencia narrativa sonora (mood de musica coincide con la escena) |

---

## Las 5 Mudas de Fernando (Pain Points Documentados)

| # | Muda | Tipo Lean | Descripcion | Impacto | Mitigacion ERP |
|:--|:-----|:----------|:------------|:--------|:---------------|
| **1** | Escenas no secuenciales | Espera | Llegan 1,2,3 luego 7,8,9 luego 5,6. No puede musicalizacion coherente de un segmento. | Alto - paraliza trabajo creativo | Tracking por escena; notificacion cuando bloque secuencial este completo |
| **2** | Busqueda de musica/SFX | Motion (NVA) | Encontrar el "feeling" correcto sin catalogo organizado. Mayor malgasto de tiempo. | Alto - mayor tiempo no-valor del proceso | Biblioteca organizada por emocion/BPM/intensidad con busqueda semantica |
| **3** | Cambios post-mezcla | Retrabajo (Defects) | Modificaciones al guion o animacion despues de que ya mezclo obligan a re-mixear. | Alto - puede requerir episodio completo | Script Lock + Audio Lock formal; excepciones requieren aprobacion de Alan/Ramon |
| **4** | Sin feedback de QA | Defects (info) | No recibe reporte formal de los errores de audio que detecta Gio. Los mismos errores se repiten. | Medio - ciclo de aprendizaje roto | Ticket de defecto de audio en ERP que Fernando cierra al corregir |
| **5** | Sin visibilidad aguas abajo | Espera (info) | Una vez entregado, no sabe si hay bloqueos en QA o dubbing. Imposible priorizar. | Medio - no puede reaccionar | Dashboard de estado: "En QA / En doblaje / Listo para publicar / Publicado" con timestamps |

**Ranking de frustraciones (Q7 DRAFT, escala 1=mas frustrante):**

```
1. Recibir escenas fuera de secuencia (1,2,3 -> 7,8,9 -> 5,6)
2. Buscar musica/SFX y agarrar el "feeling" correcto
3. Cambios despues de que ya mezclo el audio
4. Desincronizacion de timing entre audio y animacion
5. No tener feedback sobre la calidad de audio del producto final
```

---

## Herramientas

| Herramienta | Uso | Tipo |
|:------------|:----|:-----|
| **Adobe After Effects** | Ensamble del proyecto de video + sincronizacion general | Principal |
| **Adobe Audition** | Edicion de audio, mezcla, normalizacion, EQ, noise reduction | Principal |
| **Adobe Premiere Pro** | Edicion de video complementaria (uso menor) | Secundario |
| **Banco de SFX/Foleys QPH** | Fuente primaria de efectos de sonido (carpeta compartida) | Activo |
| **ElevenLabs Sound Effects API** | Generacion de SFX cuando el banco QPH no tiene el efecto | Activo |
| **ElevenLabs Music API** | Generacion de BGM cuando el banco QPH no tiene el mood | Activo |

**Presets:** Fernando tiene algunos presets de audio pero son pocos. Oportunidad de estandarizar EQ, compresion y templates de proyecto para acelerar el proceso.

---

## Entregables por Episodio

| Archivo | Formato | Destino |
|:--------|:--------|:--------|
| `[ep_id]_horizontal.mp4` | MP4 16:9, H.264, AAC, -14 LUFS | QA (Gio) -> YouTube |
| `[ep_id]_vertical.mp4` | MP4 9:16, H.264, AAC | QA (Gio) -> Shorts/Reels |
| `[ep_id]_audio_ES.wav` / MP4 | Audio/Video con voz ES limpia (sin BGM/SFX en pista de voz) | Saul/Ivan (Workflow 09 Dubbing) |

> **Nota de complejidad:** El doble formato (16:9 + 9:16) genera trabajo adicional para los animadores, que producen 2 versiones del mismo video. El ERP debe trackear ambas como entregables separados.

---

## Workflows Relacionados

| Workflow | Relacion |
|:---------|:---------|
| [08 Audio TTS](../02_OPERATIONS/PROCESSES/08_audio_tts_workflow.md) | Ramon genera voces TTS en espanol que Fernando usa en la mezcla |
| [07 QA Publicacion](../02_OPERATIONS/PROCESSES/07_qa_publicacion_workflow.md) | Gio recibe el MP4 final y reporta defectos de audio |
| [09 Dubbing](../02_OPERATIONS/PROCESSES/09_dubbing_workflow.md) | Saul/Ivan reciben el audio ES de Fernando como input critico |
| [10 Sonorizacion](../02_OPERATIONS/PROCESSES/10_sonorizacion_workflow.md) | Workflow complementario de musicalizacion |
| [11 Fernando Daily Ops](../02_OPERATIONS/PROCESSES/11_fernando_daily_ops.md) | Rutina diaria detallada, pasos, quality gates y KPIs pendientes de baseline |

---

## Documentos CORE Relevantes

| Documento | Relacion |
|:----------|:---------|
| [06 CORE Audio TTS](../00_CORE/06_CORE_AUDIO_TTS.md) | Especificaciones del audio TTS que Fernando recibe de Ramon; regla SSOT del MP4 final |
| [07 CORE Multi-Idioma](../00_CORE/07_CORE_MULTI_LANGUAGE.md) | El MP4 ES de Fernando es el input del pipeline de dubbing de Saul/Ivan |
| [04 CORE Timing Rules](../00_CORE/04_CORE_TIMING_RULES.md) | Reglas de timing entre audio y animacion que Fernando debe respetar |
| [08 CORE Lean Framework](../00_CORE/08_CORE_LEAN_FRAMEWORK.md) | Las 5 Mudas de Fernando en contexto del framework Lean del proyecto |

---

## Puntos de Atencion

- **Guion Zombie:** Si Fernando modifica dialogos durante la mezcla, notificar a Alan/Ramon de inmediato antes de que Ramon regenere TTS o Saul inicie dubbing. El MP4 manda, no el .docx.
- **Audio ES limpio para dubbing:** El archivo entregado a Saul/Ivan debe tener la voz ES sin BGM ni SFX solapados en la misma pista. Si llega sucio, ElevenLabs no detecta bien los segmentos de dialogo.
- **Escenas no secuenciales:** Si llegan escenas muy desordenadas, posponer musicalizacion de fondo hasta tener un bloque narrativo consecutivo. Trabajar SFX puntuales primero.
- **Audio Lock:** Ninguna escena animada debe cambiar despues de que Fernando inicia el mix. Excepciones requieren evaluacion de impacto con Alan/Ramon.
- **13 pistas de audio en publicacion:** Al publicar, el equipo debe verificar las pistas de audio de los idiomas principales. Hoy solo se verifican 2-3 de forma intuitiva (ingles, japones). Pendiente: checklist formal.

---

**Ultima actualizacion:** 2026-02-18
**Fuentes:** Q7 FERNANDO POSTPROD DRAFT (2026-02-13), Q7 FERNANDO POSTPROD (cuestionario base), 11_fernando_daily_ops.md (Workflow 11), Transcript QPH Post-Produccion Dic 31 2025
**Status del DRAFT:** ~75-85% confianza (Daniel cubriendo rol de Fernando). Pendiente validacion de Fernando para cerrar brechas de medicion.
