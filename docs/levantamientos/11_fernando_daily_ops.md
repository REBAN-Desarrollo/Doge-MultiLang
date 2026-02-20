# Workflow 11: Operaciones Diarias de Post-produccion (Fernando)

**Rol:** Fernando | **Celulas:** C4 (Musicalizacion) + C5 (Ensamble)
**Tiempo por episodio:** Por medir (KPI pendiente - ver Seccion 8)
**Output:** MP4 final con audio completo (voz + BGM + SFX) listo para QA y doblaje

---

## Objetivo

Documentar las operaciones diarias de Fernando como responsable de post-produccion de audio para QPH. Cubre el flujo completo desde la recepcion de escenas animadas hasta la entrega al equipo de doblaje (Saul/Ivan), incluyendo ensamble de proyecto, musicalizacion, SFX, mezcla y export.

> **Nota de confianza:** Este workflow se basa en el DRAFT Q7 (Daniel cubriendo rol de Fernando, ~75-85% confianza) y en el GOLD Audit 2026-02-17. Pendiente validacion de Fernando para cerrar brechas de medicion.

---

## Trigger

**Proyecto AE ensamblado por Alan/Ramon:** Ramon o Alan arman el esqueleto del proyecto de After Effects con las escenas animadas. Fernando recibe este proyecto (video sin audio) y lo trabaja progresivamente a medida que llegan escenas de los animadores.

> **Problema documentado:** Las escenas llegan en orden no secuencial (ej. 1, 2, 3, luego 7, 8, 9, luego 6, 5). Esto es el principal dolor de Fernando (frustracion #1). El ERP deberia notificar cuando un bloque secuencial esta completo.

---

## Flujo del Proceso

```
  PROYECTO AE (ensamblado por Alan/Ramon) + AUDIO TTS (de Ramon/Workflow 08)
       |
  [1] Revision de escenas recibidas ── Verificar cuales escenas llegaron, identificar brechas
       |
  [2] Ensamble progresivo ──────────── Insertar escenas en el proyecto AE, actualizar timeline
       |
  [3] SFX / Foleys por escena ─────── Banco propio QPH + ElevenLabs Sound Effects
       |                                Sincronizar con accion visual
       |
  [4] Musicalizacion ──────────────── Seleccionar BGM segun mood de escena
       |                                Fuentes: banco propio QPH + ElevenLabs
       |                                Decision: guion / intuicion / Andrea indica
       |
  [5] Mix de Audio ────────────────── Adobe Audition: mezclar voz TTS + BGM + SFX
       |                                Regla: dialogos SIEMPRE sobre BGM
       |
  [6] Revision de calidad interna ─── Checklist de 5 criterios (ver Seccion 6)
       |
  [7] Export dual (16:9 + 9:16) ───── YouTube horizontal + Shorts/Reels vertical
       |
  [8] Entrega para QA y doblaje ───── Avisar que esta listo; audio ES para Saul/Ivan
```

---

## Pasos Detallados

### Paso 1: Revision de Escenas Recibidas

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Proyecto After Effects ensamblado por Alan/Ramon |
| **Acciones** | Verificar que escenas estan disponibles en la carpeta compartida; identificar cuales faltan; registrar estado de avance |
| **Problema comun** | Escenas llegan fuera de secuencia (1,2,3 luego 7,8,9 luego 5,6). Fernando trabaja lo que llega y espera bloques faltantes. |
| **Decision point** | Si faltan mas del 50% de escenas -> esperar bloque mayor antes de musicalizacion de fondo (para mantener coherencia narrativa) |
| **Output** | Lista de escenas recibidas vs pendientes |
| **Responsable** | Fernando |

**Accion tipica de manana:**
```
- Abrir carpeta compartida / proyecto AE
- Comparar escenas disponibles vs total del episodio
- Si hay escenas nuevas -> proceder al Paso 2
- Si no hay nada nuevo -> verificar con Alan/Ramon ETA de proximas escenas
```

### Paso 2: Ensamble Progresivo en After Effects

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Escenas individuales renderizadas (o grupos de escenas) |
| **Herramienta** | Adobe After Effects (principal) |
| **Acciones** | Insertar escenas disponibles en el timeline del proyecto AE; ajustar duracion del composition si hay cambios de timing |
| **Fuente del timing** | Los animadores entregan con timing aproximado. Sincronizacion raramente falla (<10% de escenas). Cuando falla -> el animador re-anima (no Fernando). |
| **Output** | Proyecto AE actualizado con escenas disponibles |
| **Responsable** | Fernando |

> **Regla de escalacion de timing:** Si el dialogo es mas largo que la escena animada -> elevar al animador para que re-anime. Fernando NO recorta el dialogo. Si el guionista debe ajustar -> coordinacion via Alan/Ramon.

### Paso 3: Creacion de SFX / Foleys por Escena

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Guion (acotaciones de audio) + escenas visuales para referencia de accion |
| **Herramientas** | Banco propio QPH (foleys) + ElevenLabs Sound Effects API |
| **Acciones** | Identificar momentos de accion que requieren SFX; seleccionar/generar efecto adecuado; sincronizar con frame exacto |
| **Output** | Pistas SFX por escena, sincronizadas con animacion |
| **Responsable** | Fernando |
| **Tiempo** | No medido actualmente (KPI pendiente) |

Tipos de SFX en episodios QPH:

| Tipo | Ejemplos QPH | Fuente |
|:-----|:-------------|:-------|
| **Ambiente** | Escuela, calle, cocina | Banco QPH |
| **Accion** | Golpe, caida, puerta | Banco QPH o ElevenLabs |
| **Emocional** | Risa, llanto, suspiro | ElevenLabs SFX API |
| **Transicion** | Whoosh, sting musical | Banco QPH o generado |

**Dolor documentado:** Buscar el "feeling" correcto de un SFX toma tiempo innecesario. La falta de un catalogo organizado por tipo de emocion es el bloqueador #2 de productividad.

### Paso 4: Musicalizacion por Escena

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Guion con acotaciones de mood + escenas ensambladas |
| **Herramientas** | Banco propio QPH + ElevenLabs Music (generacion cuando es necesario) |
| **Acciones** | Definir mood emocional por escena; seleccionar BGM apropiado; ajustar puntos de entrada/salida con fades |
| **Criterio de seleccion** | Principalmente por criterio propio de Fernando segun tono de escena. A veces: guionista o Andrea indica el tipo de musica. |
| **Output** | Pistas BGM por segmento narrativo |
| **Responsable** | Fernando |

Mapa de moods tipico QPH:

```
Escena introduccion:  Alegre, POP juvenil, BPM 120
Escena de conflicto:  Tension, dramatico, BPM 80-90
Escena de resolucion: Calido, esperanzador, BPM 100
Escena final/credits: Suave, pop ligero, BPM 100
```

**Recomendacion documentada (I3 del Q7):** Fernando necesita capacitacion en storytelling sonoro y coherencia narrativa. Entender como la musica y SFX afectan la narrativa ayudaria a acelerar la seleccion y mejorar la calidad.

**Regla critica:** La musica SIEMPRE cede ante el dialogo. El BGM baja al menos 6 dB en segmentos con voz activa.

### Paso 5: Mix de Audio en Adobe Audition

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Pistas de voz TTS (de Ramon, Workflow 08) + BGM seleccionado + SFX creados |
| **Herramienta** | Adobe Audition (principal para audio), After Effects (ensamble final) |
| **Acciones** | Importar todas las pistas; ajustar volumenes relativos; aplicar EQ y compresion basica; sincronizar todo con el timeline de video |
| **Presets** | Fernando tiene algunos presets pero son pocos. Oportunidad de estandarizar. |
| **Output** | Mix combinado por escena / episodio completo |
| **Responsable** | Fernando |

Jerarquia de mezcla:

```
PRIORIDAD 1: Voz (dialogo TTS)     -> Nivel de referencia (0 dB relativo)
PRIORIDAD 2: SFX sincrono          -> -6 a -12 dB relativo a voz
PRIORIDAD 3: BGM (musica de fondo) -> -12 a -18 dB relativo a voz
```

Normalizacion objetivo: **-14 LUFS** (estandar YouTube)

### Paso 6: Revision de Calidad Interna

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Mix completo del episodio |
| **Metodo** | Escucha completa del episodio con monitor de niveles |
| **Output** | Episodio aprobado o lista de correcciones |
| **Responsable** | Fernando |

Criterios de "listo" (checklist actual de Fernando):

| # | Criterio | Metodo de verificacion |
|:--|:---------|:-----------------------|
| 1 | Niveles normalizados (-14 LUFS) y sin distorsion | Monitor de nivel en Audition |
| 2 | Musica NO compite con dialogos (BGM < voz por >6 dB) | Escucha auditiva + medidor |
| 3 | SFX sincronizados con accion visual | Revision visual + auditiva frame a frame |
| 4 | Sin silencios incomodos ni cortes abruptos | Escucha corrida |
| 5 | Coherencia narrativa sonora (el mood de la musica coincide con la escena) | Criterio editorial |

**Errores historicos reportados por QA:** Musica muy fuerte, SFX fuera de sincronizacion, problemas de volumen. Estos defectos alimentan el Paso 6 como lista de verificacion preventiva.

### Paso 7: Export Dual (16:9 + 9:16)

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Proyecto AE con mezcla aprobada |
| **Herramienta** | Adobe After Effects / Adobe Media Encoder |
| **Acciones** | Exportar version 16:9 (YouTube horizontal) y 9:16 (Shorts/Reels vertical) |
| **Formatos** | MP4 H.264, audio AAC |
| **Normalizacion** | -14 LUFS para YouTube, revisar specs para Shorts |
| **Output** | 2 archivos MP4 por episodio + audio ES separado para dubbing |
| **Responsable** | Fernando |

Entregables por episodio:

| Archivo | Formato | Destino |
|:--------|:--------|:--------|
| `[ep_id]_horizontal.mp4` | MP4 16:9, H.264, AAC | QA -> YouTube |
| `[ep_id]_vertical.mp4` | MP4 9:16, H.264, AAC | QA -> Shorts/Reels |
| `[ep_id]_audio_ES.wav` o MP4 | Audio/Video con voz ES limpia | Saul/Ivan (doblaje) |

> **Nota de complejidad:** El doble formato (16:9 + 9:16) genera trabajo adicional para los animadores que deben producir 2 versiones del mismo video. El ERP debe trackear ambas versiones como entregables separados.

### Paso 8: Entrega a QA y Equipo de Doblaje

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Archivos exportados (MP4 dual + audio ES) |
| **Acciones** | Subir a carpeta compartida; avisar a Alan/Ramon que el episodio esta listo; enviar audio ES a Saul/Ivan para doblaje |
| **Metodo actual** | Fernando avisa que "ya esta para revision de calidad" (canal informal) |
| **Visibilidad post-entrega** | Fernando pierde visibilidad despues de entregar. No sabe cuanto tiempo pasa hasta publicacion. |
| **Output** | Episodio disponible para QA (Workflow 07) y para doblaje (Workflow 09) |
| **Responsable** | Fernando |

**Impacto ERP:** El handoff actual es informal (aviso manual). El ERP debe generar una notificacion automatica a QA y Saul/Ivan cuando Fernando marque el episodio como "Listo para QA". Esto da trazabilidad y mide el tiempo entre "audio completo" y "publicacion".

---

## Rutina Diaria Recomendada

### Manana (inicio de jornada)

| Actividad | Tiempo estimado | Proposito |
|:----------|:----------------|:----------|
| Revisar carpeta compartida: nuevas escenas disponibles | 10 min | Saber en que episodios puede avanzar |
| Verificar estado de episodios en progreso | 5 min | Priorizar trabajo del dia |
| Si hay escenas nuevas -> ensamble en AE | Variable | Mantener proyectos actualizados |
| Si faltan escenas criticas -> notificar a Alan/Ramon | 5 min | Desbloquear flujo antes de perder tiempo |

### Bloque de produccion (trabajo principal)

| Actividad | Secuencia | Notas |
|:----------|:----------|:------|
| SFX y foleys del bloque de escenas disponibles | Primero | Requiere mayor precision de sincronizacion |
| Musicalizacion de segmentos completos | Segundo | Mejor cuando hay suficiente contexto narrativo |
| Mix y ajuste de niveles | Tercero | Despues de tener todas las capas |
| Revision de calidad del bloque | Al final | Antes de considerar "el dia listo" |

### Final de jornada

| Actividad | Tiempo estimado | Proposito |
|:----------|:----------------|:----------|
| Guardar y hacer backup del proyecto AE | 5 min | Prevenir perdida de trabajo |
| Actualizar estado en canal de coordinacion (Alan/Ramon) | 5 min | Visibilidad del equipo |
| Registrar que escenas quedan pendientes de recibir | 5 min | Facilita la manana siguiente |
| Si episodio esta completo -> exportar y notificar | 30-60 min | Completar el ciclo del episodio |

---

## Roles y Responsabilidades

| Rol | Persona | Responsabilidad en este Workflow |
|:----|:--------|:--------------------------------|
| **Post-produccion Audio (C4+C5)** | Fernando | Dueno completo del pipeline de audio: SFX, BGM, mezcla, export, entrega |
| **Factory Manager** | Alan / Ramon | Arman el esqueleto del proyecto AE; coordinan timing con animadores; reciben aviso de "listo" |
| **Audio TTS (C3)** | Ramon | Genera y entrega los archivos de voz TTS que Fernando usa en la mezcla (Workflow 08) |
| **Animadores (C3 Video)** | Alondra / Alex | Entregan escenas renderizadas al proyecto AE. Responsables de re-animacion si hay problemas de timing |
| **Equipo Doblaje (C7)** | Saul / Ivan | Reciben el audio ES de Fernando para iniciar proceso de dubbing (Workflow 09) |
| **QA** | Gio | Revisa el MP4 final y reporta defectos de audio de regreso a Fernando |

---

## Herramientas

| Herramienta | Proposito | Tipo |
|:------------|:----------|:-----|
| **Adobe After Effects** | Ensamble del proyecto de video + sincronizacion general | Software local (principal) |
| **Adobe Audition** | Edicion de audio, mezcla, normalizacion, EQ | Software local |
| **Adobe Premiere Pro** | Edicion de video complementaria (uso menor) | Software local |
| **Banco de SFX/Foleys QPH** | Fuente primaria de efectos de sonido | Carpeta compartida |
| **ElevenLabs Sound Effects API** | Generacion de SFX cuando el banco propio no tiene el efecto | API externa |
| **ElevenLabs Music API** | Generacion de BGM cuando el banco propio no tiene el mood | API externa |

---

## Quality Gates (Gates de Calidad)

| Gate | Criterio | Accion si Falla |
|:-----|:---------|:----------------|
| **Niveles de audio** | Mix normalizado a -14 LUFS, sin clipping (picos < 0 dBFS) | Re-master con limiter; ajustar gain stages |
| **Legibilidad del dialogo** | Voz TTS audible y clara sobre BGM (>6 dB diferencia) | Bajar volumen BGM en segmentos con voz |
| **Sincronizacion SFX** | SFX no desviado mas de 2 frames del momento de accion | Ajustar posicion en timeline |
| **Coherencia de mood** | La musica refleja el tono emocional de la escena | Reemplazar pista BGM por una de mood correcto |
| **Sin artefactos** | Sin glitches, clicks, audio cortado ni ruido de fondo | Limpiar con Adobe Audition noise reduction |
| **Doble formato correcto** | Ambas versiones (16:9 y 9:16) exportadas y verificadas | Re-exportar la version con error |
| **Audio ES para dubbing** | Audio en espanol separado entregado a Saul/Ivan antes del doblaje | Exportar stems adicionales antes de handoff |

---

## KPIs a Medir (Pendientes de Baseline)

> **Estado actual:** Ninguno de estos KPIs tiene baseline medido. El ERP debe capturarlos desde el primer episodio trackeado.

| KPI | Definicion | Meta objetivo | Unidad |
|:----|:-----------|:--------------|:-------|
| **Tiempo de audio por episodio** | Horas totales desde recibir escenas hasta export final | Por medir (baseline primero) | Horas |
| **Tiempo busqueda musica/SFX** | Horas dedicadas a seleccionar BGM y SFX por episodio | Reducir con biblioteca organizada | Horas |
| **Tasa de sincronizacion fallida** | % de escenas con problemas de timing audio-video | <10% (actualmente: raramente, <10%) | % |
| **Episodios en paralelo (WIP)** | Episodios activos simultaneamente en post-produccion | Establecer WIP limit | Count |
| **Tiempo audio-a-publicacion** | Dias entre "listo para QA" y publicacion en YouTube | Por medir (Fernando no tiene visibilidad) | Dias |
| **Defectos de audio reportados por QA** | Errores de audio detectados por Gio por episodio | 0 defectos (meta cero defectos) | Count |
| **Escenas recibidas en secuencia** | % de bloques de escenas entregados en orden secuencial | >80% (hoy es bajo, problema documentado) | % |

---

## Problemas Comunes y Mitigaciones

### Problema 1: Escenas llegan fuera de secuencia (Frustracion #1)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | Animadores entregan escenas en orden no secuencial: 1,2,3 -> 7,8,9 -> 5,6. Ocurre "por temas de tiempo" (cada animador entrega lo que termina). |
| **Impacto** | Fernando no puede musicalizacion completa de un segmento narrativo. Trabaja en parches. Pierde contexto del arco emocional. |
| **Workaround actual** | Trabajar SFX de las escenas disponibles; posponer musicalizacion del segmento hasta tener escenas consecutivas. |
| **Mitigacion ERP** | Sistema de tracking por escena. Notificacion cuando un bloque secuencial (ej. escenas 1-5) esta completo. Pull system: Fernando "jala" bloques, no recibe escenas sueltas. |

### Problema 2: Busqueda de musica/SFX consume demasiado tiempo (Frustracion #2)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | Encontrar el "feeling" correcto de musica o SFX es intuitivo y sin guia. No hay catalogo organizado por emocion. |
| **Impacto** | El mayor malgasto de tiempo no-valor en el proceso de Fernando. |
| **Workaround actual** | Busqueda manual en banco QPH + ElevenLabs. Trial and error. |
| **Mitigacion ERP** | Biblioteca de musica/SFX organizada por emocion (alegre, tenso, dramatico, calido). Tags: genero, BPM, intensidad. Busqueda semantica. |

### Problema 3: Cambios despues de la mezcla (Frustracion #3)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | Modificaciones al guion o a la animacion despues de que Fernando ya mezclo el audio obligan a rehacer trabajo. |
| **Impacto** | Retrabajo de horas; el episodio completo puede necesitar re-mixeo. |
| **Workaround actual** | Absorber el retrabajo. No hay freeze point formal. |
| **Mitigacion ERP** | Script Lock (Workflow 03) debe incluir un "Audio Lock" complementario: ninguna escena animada cambia despues de que Fernando inicia el mix. Excepciones requieren aprobacion de Alan/Ramon con evaluacion de impacto. |

### Problema 4: Sin feedback de QA sobre calidad de audio

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | Fernando no recibe reporte formal de los errores de audio que detecta Gio en QA. El ciclo de aprendizaje esta roto. |
| **Impacto** | Los mismos errores se repiten episodio a episodio (musica muy fuerte, SFX desincronizados). |
| **Workaround actual** | Ninguno sistematico. |
| **Mitigacion ERP** | Modulo de QA debe generar un ticket de defecto de audio con categoria (nivel, sync, artefacto) que se cierra cuando Fernando confirma la correccion. Loop de retroalimentacion cerrado. |

### Problema 5: Sin visibilidad post-entrega (Frustracion #5)

| Aspecto | Detalle |
|:--------|:--------|
| **Descripcion** | Una vez que Fernando entrega el episodio, pierde visibilidad sobre cuanto tiempo pasa hasta la publicacion. No sabe si hay bloqueos en QA o doblaje. |
| **Impacto** | Imposible priorizar o reaccionar si hay un cuello de botella aguas abajo. |
| **Workaround actual** | Ninguno. |
| **Mitigacion ERP** | Dashboard de Fernando que muestra estado de sus episodios entregados: "En QA", "En doblaje", "Listo para publicar", "Publicado". Con timestamps de cada transicion. |

---

## Las 5 Mudas de Fernando (Lean)

Problemas identificados segun metodologia Lean (CORE/08_LEAN_FRAMEWORK):

| Muda | Tipo de desperdicio | Descripcion | Impacto estimado |
|:-----|:--------------------|:------------|:-----------------|
| **Muda 1** | Espera | Escenas no secuenciales: Fernando espera bloques antes de musicalizar | Alto (paraliza trabajo creativo) |
| **Muda 2** | Busqueda (Motion) | Buscar musica/SFX sin catalogo organizado | Alto (mayor NVA del proceso) |
| **Muda 3** | Retrabajo (Defects) | Re-mixeo cuando hay cambios post-mezcla | Alto (riesgo de episodio completo) |
| **Muda 4** | Informacion (Defects) | Sin feedback de QA sobre errores de audio | Medio (errores se repiten) |
| **Muda 5** | Espera (Waiting) | Sin visibilidad aguas abajo post-entrega | Medio (imposible priorizar) |

---

## Handoff con Equipo de Doblaje (Saul/Ivan)

Fernando es el **proveedor critico** del Workflow 09 (Doblaje). El audio en espanol que entrega es la fuente de verdad para el proceso de dubbing.

| Aspecto | Detalle |
|:--------|:--------|
| **Que entrega** | MP4 con voz limpia en espanol (audio ES) |
| **Cuando entrega** | Al completar y aprobar la mezcla del episodio |
| **Metodo de entrega** | Carpeta compartida + aviso manual a Saul/Ivan |
| **Regla SSOT** | El MP4 final de Fernando es la UNICA fuente de verdad para el audio (ver CORE/06_AUDIO_TTS.md Seccion 6.3). El guion .docx original puede estar desactualizado si Fernando recorto o modifico dialogos. |
| **Impacto en doblaje** | El audio ES debe ser limpio (sin SFX/BGM solapados en la pista de voz) para que ElevenLabs Dubbing detecte correctamente los segmentos de dialogo |

**Sobre los 13 tracks de calidad al publicar:**
Al momento de publicacion, el equipo (Saul/Ivan + Andrea) debe verificar las pistas de audio en los idiomas principales. Actualmente solo se verifican 2-3 idiomas de forma intuitiva (ingles, japones). El ERP debe incluir un checklist formal de validacion de pistas de audio antes de publicacion.

---

## Dependencias

| Depende De | Workflow | Detalle |
|:-----------|:---------|:--------|
| Proyecto AE ensamblado | Workflow 06 (Produccion - Animacion) | Alan/Ramon ensamblan el esqueleto antes de que Fernando trabaje |
| Audio TTS por escena | Workflow 08 (Audio TTS - Ramon) | Las voces de los personajes generadas por ElevenLabs |
| Guion locked (acotaciones de SFX) | Workflow 03 (Planchado Historia) | Acotaciones de audio en el guion como referencia |

| Es Dependencia De | Workflow | Detalle |
|:------------------|:---------|:--------|
| QA y Publicacion | Workflow 07 (QA Publicacion) | El MP4 final va a QA antes de publicar |
| Doblaje multi-idioma | Workflow 09 (Dubbing - Saul/Ivan) | El audio ES es el input del proceso de doblaje |

---

## Estimacion de Tiempos

> **Estado actual:** Sin datos medidos. Estos son estimados basados en el contexto general del pipeline QPH. El ERP debe capturar tiempos reales desde el primer uso.

| Actividad | Estimado (sin herramientas) | Estimado (con ERP + biblioteca) |
|:----------|:---------------------------|:--------------------------------|
| Revision de escenas disponibles | 10-20 min/dia | 5 min/dia (notificacion automatica) |
| Ensamble en AE por bloque de escenas | 30-60 min | 20-40 min (proyecto pre-estructurado) |
| SFX y foleys por episodio | 1-3 horas | 30-90 min (catalogo organizado) |
| Musicalizacion por episodio | 2-4 horas | 1-2 horas (biblioteca por emocion) |
| Mix y normalizacion | 1-2 horas | 45-90 min (presets estandarizados) |
| Export dual | 30-60 min | 20-30 min (preset de export) |
| **Total estimado por episodio** | **5-11 horas** | **3-6 horas** |

---

**Fuentes:**
- `04_EVIDENCE/QUESTIONNAIRES/Q7_FERNANDO_POSTPROD_DRAFT.md` (DRAFT: Daniel cubriendo rol, ~80% confianza)
- `wave1_extractions/W7_Q7_FERNANDO_POSTPROD.md` (28 pain points, 10 KPIs, 14 features)
- `00_CORE/06_CORE_AUDIO_TTS.md` (especificaciones de audio TTS)
- `00_CORE/08_CORE_LEAN_FRAMEWORK.md` (7 herramientas Lean aplicadas a QPH)
- `GOLD_AUDIT_REPORT_2026-02-17.md` (P1-02: este workflow era un entregable faltante; P1-03: 13 tracks sin checklist)
- `02_OPERATIONS/PROCESSES/10_sonorizacion_workflow.md` (Workflow relacionado de musicalizacion)
- `02_OPERATIONS/PROCESSES/09_dubbing_workflow.md` (Workflow receptor del output de Fernando)
