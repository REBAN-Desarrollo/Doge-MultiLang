# Modulo 1: Guion Pipeline

> Hoy el guion viene en .docx o Google Docs. En el futuro podria venir de Notion, Monday, o un editor integrado en la suite. Este modulo define el **CONTRATO de salida** (JSON), no la herramienta de entrada.

---

## User Stories

| ID | Story | Criterio de Aceptacion |
|----|-------|----------------------|
| G-01 | Como Andrea, quiero pegar el texto de un guion y ver los dialogos parseados por escena | Texto pegado -> JSON con `[{character, text, emotion, scene}]` visible en tabla |
| G-02 | Como Andrea, quiero que el sistema detecte automaticamente que personajes hablan | Parser identifica personajes por formato (NOMBRE:) o catalogo |
| G-03 | Como Andrea, quiero ver alertas si hay palabras prohibidas en el guion | Blacklist check marca las palabras con categoria A/B/C |
| G-04 | Como Andrea, quiero marcar un guion como "Locked" para que el equipo empiece a trabajar | Status cambia draft -> locked, dispara notificacion |
| G-05 | Como Andrea, quiero subir un .docx y que se parsee automaticamente | Upload de archivo .docx, parser extrae dialogos y visuales |
| G-06 | Como futuro, quiero recibir guiones via webhook desde Notion/Monday | Endpoint `POST /api/v1/guion/ingest` acepta JSON directo |

---

## Contrato de Salida del Parser

El parser siempre produce dos arrays JSON:

### dialogue_objects

```json
[
  {"scene": 1, "character": "Luis", "text": "Oye Beto...", "emotion": "angry", "index": 0},
  {"scene": 1, "character": "Beto", "text": "Que paso?", "emotion": "confused", "index": 1}
]
```

Campos:
- `scene` (int): Numero de escena
- `character` (string): Nombre del personaje que habla
- `text` (string): Dialogo textual
- `emotion` (string): Emocion detectada o anotada (angry, happy, sad, confused, neutral)
- `index` (int): Posicion secuencial del dialogo en todo el guion

### visual_objects

```json
[
  {"scene": 1, "background": "living_room", "characters": ["Luis", "Beto"], "props": ["sofa"], "mood": "tense"}
]
```

Campos:
- `scene` (int): Numero de escena
- `background` (string): Descripcion del fondo/locacion
- `characters` (string[]): Personajes presentes en la escena
- `props` (string[]): Objetos/props relevantes
- `mood` (string): Atmosfera visual de la escena

---

## Status Workflow

```
draft  -->  locked  -->  parsed  -->  validated
  |                                      |
  +---------- (editar) <-----------------+
```

- **draft**: Guion recien pegado/subido, editable
- **locked**: Andrea lo marca como final, el equipo puede empezar a trabajar
- **parsed**: El parser extrajo dialogue_json y visual_json exitosamente
- **validated**: Paso blacklist check sin alertas criticas (categoria A)

---

## Blacklist Check

El sistema revisa cada dialogo contra la tabla `blacklist_terms`:

| Categoria | Significado | Accion |
|-----------|-------------|--------|
| **A** | Prohibido (violencia, odio) | Bloquea validacion, requiere correccion |
| **B** | Advertencia (lenguaje fuerte) | Muestra alerta amarilla, Andrea decide |
| **C** | Informativo (referencia cultural) | Nota al margen, no bloquea |

---

## API Endpoints

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/v1/guion/ingest` | Recibe texto (paste, docx, webhook), parsea a JSON |
| GET | `/api/v1/guion/{project_id}` | Retorna guion con dialogos y visuales |
| PATCH | `/api/v1/guion/{project_id}/status` | Cambiar status (draft -> locked -> parsed -> validated) |
| GET | `/api/v1/guion/{project_id}/validate` | Ejecutar blacklist check, retorna alertas |
