# Workflow 10: Sonorizacion y Musicalizacion (Celula 4)

**Tiempo:** 1-2 dias | **Responsable:** Fernando (C4 Musicalizacion)
**Output:** Mix de audio final por episodio (BGM + SFX)

---

## Objetivo

Generar y ensamblar la capa de audio musical (musica de fondo + efectos de sonido) para cada episodio QPH, alineada con el mood narrativo de cada escena.

---

## Trigger

**Animacion Rough Cut Lista**: El video animado tiene una version preliminar con timing definido (aunque no sea el render final). Se necesita el rough cut para alinear musica con escenas.

> La sonorizacion puede iniciar en paralelo con la animacion final (Celula 5), pero requiere al menos el rough cut con timing por escena.

---

## Flujo del Proceso

```
  ROUGH CUT + GUION
       |
  [1] Analizar Script/Mood ─── Definir mood por escena (feliz, suspenso, drama)
       |
  [2] Definir Pistas ────────── Especificaciones: duracion, genero, BPM, intensidad
       |
  [3] Generar Musica ────────── API de generacion musical (Suno, Mubert, AIVA)
       |                         3 variaciones por pista
       |
  [4] Crear Capa SFX ───────── Efectos de sonido por escena
       |                         ElevenLabs Sound Effects / banco de SFX
       |
  [5] Mix de Audio ──────────── Combinar BGM + SFX + sincronizar con video
       |
  [6] Master ────────────────── Normalizacion, ecualizacion final
       |
  [7] Export ────────────────── Mix final por episodio
```

---

## Pasos Detallados

### Paso 1: Analizar Script y Mood por Escena

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Guion locked + rough cut de animacion |
| **Acciones** | Definir mood emocional por escena: feliz, suspenso, drama, accion, calma |
| **Output** | Mapa de moods por escena con timestamps |
| **Responsable** | Fernando |

Ejemplo de mapa de moods:

```
Escena 1 (00:00 - 02:15): Feliz, POP, BPM 120
Escena 2 (02:15 - 04:30): Suspenso, Cinematico, BPM 80
Escena 3 (04:30 - 06:00): Drama, Orquestal, BPM 90
Escena 4 (06:00 - 08:30): Resolucion, Pop suave, BPM 100
```

### Paso 2: Definir Pistas Musicales

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Mapa de moods |
| **Especificaciones por pista** | Duracion, feeling, genero musical, BPM, intensidad, notas creativas |
| **Output** | Lista de pistas con specs |
| **Responsable** | Fernando |

Especificacion de pista:

```json
{
  "id": "pista_001",
  "inicio": "00:00",
  "fin": "02:15",
  "escena": "Introduccion",
  "feeling": "feliz",
  "genero": "pop 80s",
  "bpm": 120,
  "intensidad": "media",
  "notas": "Musica alegre de inicio, ritmo juvenil"
}
```

### Paso 3: Generar Musica via API

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Especificaciones de pista |
| **Herramienta** | API de generacion musical (ver evaluacion abajo) |
| **Output** | 3 variaciones por pista |
| **Seleccion** | Fernando escucha variaciones y selecciona la final |
| **Responsable** | Fernando + Sistema |

#### Evaluacion de Proveedores de Generacion Musical

| Proveedor | API | Fortalezas | Debilidades | Uso Recomendado |
|:----------|:----|:-----------|:------------|:----------------|
| **Suno** | `api.suno.ai` | Alta calidad, generacion por prompt natural, voces | Costo mas alto, menos parametros de control | Pista principal, intro/outro con letra |
| **Mubert** | `api.mubert.com` | Musica generativa parametrica (BPM, mood), bajo costo | Menos "musical", mas ambiental | Background suave, transiciones |
| **AIVA** | AIVA API | Excelente para orquestal/cinematografico | Mas lento, requiere mas configuracion | Escenas dramaticas, climax emocional |
| **ElevenLabs Music** | Music API | Integracion con ecosistema TTS existente | API mas nueva, menos opciones | SFX y efectos cortos |

**Recomendacion:** Usar Suno como proveedor primario para pistas principales, Mubert para fondos ambientales, AIVA para escenas cinematograficas.

### Paso 4: Crear Capa de Efectos de Sonido (SFX)

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Acotaciones del guion ("sonido de puerta", "explosion", "risa") |
| **Fuentes** | Banco de SFX existente + ElevenLabs Sound Effects API |
| **Output** | Archivos SFX por escena, con timestamps |
| **Responsable** | Fernando |

Tipos de SFX:

| Tipo | Ejemplos | Fuente |
|:-----|:---------|:-------|
| **Ambiente** | Calle, escuela, lluvia | Banco de SFX |
| **Accion** | Puerta, golpe, caida | Banco de SFX o generado |
| **Emocional** | Risa, llanto, suspiro | ElevenLabs SFX API |
| **Transicion** | Whoosh, sting, reveal | Generado o banco |

### Paso 5: Mix de Audio

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Pistas musicales seleccionadas + SFX + audio TTS |
| **Herramienta** | DAW (Digital Audio Workstation) o herramienta de mixing |
| **Acciones** | Combinar capas, ajustar volumenes, sincronizar con video |
| **Regla** | Dialogos SIEMPRE tienen prioridad sobre BGM. La musica baja cuando hay voz. |
| **Output** | Mix combinado |
| **Responsable** | Fernando |

### Paso 6: Master

| Aspecto | Detalle |
|:--------|:--------|
| **Input** | Mix combinado |
| **Acciones** | Normalizacion de volumen (-14 LUFS para YouTube), ecualizacion, limiter |
| **Output** | Audio master final |
| **Responsable** | Fernando |

### Paso 7: Export

| Aspecto | Detalle |
|:--------|:--------|
| **Estructura** | `output/{serie}/{episodio}/audio/mix_final.wav` + pistas separadas |
| **Formatos** | WAV (master), MP3 (preview) |
| **Output** | Mix final listo para render del video |

---

## Roles

| Rol | Persona | Responsabilidad |
|:----|:--------|:----------------|
| **Musicalizador (C4)** | Fernando | Definir moods, seleccionar pistas, crear SFX, mix y master |
| **Factory Manager** | Alan/Ramon | Coordinacion de timing con otras celulas |

---

## Herramientas

| Herramienta | Proposito | Tipo |
|:------------|:----------|:-----|
| Suno | Generacion musical primaria | API externa |
| Mubert | Musica ambiental generativa | API externa |
| AIVA | Musica orquestal/cinematografica | API externa |
| ElevenLabs Music/SFX | Efectos de sonido + musica | API externa |
| DAW (After Effects / DaVinci) | Mix y master | Software local |

---

## Output

- Mix de audio final por episodio (WAV + MP3)
- Pistas separadas (BGM, SFX) para flexibilidad en post
- Metadata de pistas (mood, genero, BPM por escena)

---

## Quality Gates

| Gate | Criterio | Accion si Falla |
|:-----|:---------|:----------------|
| **Normalizacion de volumen** | -14 LUFS (estandar YouTube) | Re-master con limiter correcto |
| **Mood alignment** | Musica coincide con mood de cada escena | Re-generar pista con specs ajustados |
| **Timing sync** | Transiciones musicales alineadas con cambios de escena | Ajustar puntos de corte/fade |
| **Dialogo audible** | Voz siempre por encima de BGM (>6dB diferencia) | Bajar volumen de BGM en segmentos con voz |
| **No clipping** | Picos no superan 0 dBFS | Aplicar limiter |

---

## Dependencias

| Depende De | Workflow |
|:-----------|:---------|
| Guion locked (para acotaciones de audio) | Workflow 03 (Planchado Historia) |
| Rough cut de animacion (para timing) | Workflow 06 (Produccion - Celula 5) |

| Es Dependencia De | Workflow |
|:-------------------|:---------|
| Render final del video | Workflow 06 (Produccion - Ensamble final) |
| QA y Publicacion | Workflow 07 (QA Publicacion) |

---

**Fuentes:**
- `_recovery/NEW_FEATURES/Sonorizacion/SONORIZACION_PLAN.md`
- `_recovery/NEW_FEATURES/ElevenLabs/SFX/PLAN.md`

---

## Modelo de Datos del Sistema

Las entidades que maneja el modulo de sonorizacion en AI-Studio:

### Proyecto de Sonorizacion

```json
{
  "nombre": "Un Guardaespaldas Escolar",
  "duracion_total": "08:30",
  "pistas": []
}
```

### Pista Musical

```json
{
  "id": "pista_001",
  "inicio": "00:00",
  "fin": "02:15",
  "escena": "Introduccion",
  "especificacion": {
    "feeling": "feliz",
    "genero": "pop 80s",
    "bpm": 120,
    "intensidad": "media",
    "notas": "Musica alegre de inicio, ritmo juvenil"
  },
  "variaciones": [],
  "seleccionada": null
}
```

### Variacion

```json
{
  "id": "var_001",
  "url": "https://...",
  "duracion": "02:15",
  "generador": "suno",
  "prompt_usado": "...",
  "rating": null
}
```

---

## API Endpoints (Propuesta)

Endpoints del modulo de sonorizacion en AI-Studio backend:

| Metodo | Endpoint | Descripcion |
|:-------|:---------|:------------|
| POST | `/api/sonorizacion/proyecto` | Crear proyecto desde guion |
| GET | `/api/sonorizacion/proyecto/{id}` | Obtener proyecto |
| POST | `/api/sonorizacion/pista` | Definir nueva pista |
| PUT | `/api/sonorizacion/pista/{id}` | Editar especificacion de pista |
| POST | `/api/sonorizacion/pista/{id}/generar` | Generar variaciones via API musical |
| GET | `/api/sonorizacion/pista/{id}/variaciones` | Listar variaciones generadas |
| POST | `/api/sonorizacion/pista/{id}/seleccionar` | Seleccionar variacion final |
| GET | `/api/sonorizacion/proyecto/{id}/exportar` | Exportar todas las pistas seleccionadas |

---

## Flujo Manual vs Automatizado

Comparacion del proceso antes y despues de AI-Studio:

### Flujo Manual (Actual)

```
Guionista entrega guion
       |
Fernando ve escenas terminadas
       |
Fernando define pistas por escena manualmente
  (Minuto 0-2: Feliz POP / Minuto 2-4: Suspenso / etc.)
       |
Fernando busca en biblioteca musical por genero/BPM/feeling
       |
Fernando previsualiza y selecciona
       |
Fernando aplica pistas finales al video
```

### Flujo Automatizado (Propuesto)

```
Guion/Video con mood map
       |
Sistema genera especificaciones por pista
  (duracion, feeling, genero, BPM, intensidad)
       |
API musical genera 3 variaciones por pista
       |
Fernando previsualiza y selecciona variacion
       |
Sistema exporta pistas seleccionadas
```

---

## Estado de Desarrollo (Legacy Checklist)

Estado documentado del modulo al momento del analisis legacy (Dic 2025):

### Fase 1: Core Backend
- [ ] Crear modelos Pydantic: `Proyecto`, `Pista`, `Variacion`
- [ ] Endpoint: `POST /api/sonorizacion/proyecto`
- [ ] Endpoint: `GET /api/sonorizacion/proyecto/{id}`
- [ ] Endpoint: `POST /api/sonorizacion/pista`
- [ ] Endpoint: `PUT /api/sonorizacion/pista/{id}`
- [ ] Servicio: Integracion con Suno API
- [ ] Endpoint: `POST /api/sonorizacion/pista/{id}/generar`
- [ ] Almacenamiento de variaciones generadas

### Fase 2: Frontend UI
- [ ] Pagina: `/sonorizacion` — Lista de proyectos
- [ ] Pagina: `/sonorizacion/{id}` — Vista de proyecto con timeline
- [ ] Componente: Timeline visual de pistas
- [ ] Componente: Editor de especificacion de pista (feeling, genero, BPM, intensidad)
- [ ] Componente: Player de variaciones con rating por estrellas
- [ ] Componente: Selector de variacion final

### Fase 3: Integracion
- [ ] Sincronizacion con timeline de TTS (timing de dialogos como referencia)
- [ ] Exportacion: Descargar todas las pistas seleccionadas
- [ ] Multi-proveedor: ElevenLabs Music y Mubert como alternativas a Suno

### Investigacion Pendiente
- [ ] Documentar API de Suno (endpoints, auth, limites de rate)
- [ ] Evaluar calidad comparativa de alternativas (Mubert, AIVA)
- [ ] Definir formato de exportacion (MP3, WAV, stems separados)

---

## Concept UI (Referencia de Diseno)

Vista conceptual del editor de pistas para Fernando:

```
+---------------------------------------------------------------+
|  Proyecto: Un Guardaespaldas Escolar                          |
+---------------------------------------------------------------+
|  Timeline (08:30)                                             |
|  00:00 ─────────────────────────────── 08:30                 |
|  [Pista 1: Feliz]  [Pista 2: Suspenso]  [Pista 3: Drama]    |
+---------------------------------------------------------------+
|  Pista Seleccionada: #1 "Introduccion"                        |
|    Feeling: [Feliz]    Genero: [Pop 80s]                      |
|    BPM: [120]          Intensidad: [Media]                    |
|    Duracion: 00:00 -> 02:15                                   |
|    [Generar Variaciones]                                      |
+---------------------------------------------------------------+
|  Variaciones:                                                 |
|    [Var 1 >]   [Var 2 >]   [Var 3 >]                         |
|    [★★★]       [★★★★★]     [★★]                              |
|    [Usar]      [Usar (v)]  [Usar]                             |
+---------------------------------------------------------------+
```

Fernando escucha las tres variaciones, asigna rating y selecciona la final. La variacion seleccionada se exporta junto con el resto del proyecto.
