# Modulo 2: Asset Factory

> Hoy se usa fal.ai para generacion cloud. En el futuro podria ser GPU local (ComfyUI), Replicate, Midjourney API, o modelos custom. Este modulo define la **BIFURCACION** (bulk vs hero vs manual), no el proveedor.

---

## User Stories

| ID | Story | Criterio de Aceptacion |
|----|-------|----------------------|
| A-01 | Como Alan, quiero ver un Kanban de todas las imagenes que faltan por episodio | Tarjetas auto-generadas desde `visual_objects` del guion, columnas: pending / queued / generating / done |
| A-02 | Como Alan, quiero generar fondos en batch (bulk) con un click | Seleccionar N fondos -> "Generate Bulk" -> cola async -> imagenes aparecen al completar |
| A-03 | Como Alan, quiero generar hero shots (close-ups de personajes) interactivamente | Abrir generador -> prompt auto-sugerido -> preview -> iterar -> aprobar |
| A-04 | Como Alan, quiero que el prompt se auto-construya desde el guion | Prompt = `[estilo_global] + [personaje] + [emocion_del_guion] + [escena]` |
| A-05 | Como Alan, quiero subir assets manuales (hechos en Photoshop) | Upload drag-and-drop -> se asocia al slot del Kanban |
| A-06 | Como Ramon, quiero ver el progreso de generacion en tiempo real | Barra de progreso via SSE mientras fal.ai renderiza |
| A-07 | Como futuro, quiero integrar perfiles de personajes de DOGE-Studio-Personajes | Catalogo de personajes con estilos predefinidos (Gemini API profiles) |
| A-08 | Como futuro, quiero generacion local con GPU (ComfyUI) como fallback | Provider adicional en backend, misma interfaz |

---

## Logica de Bifurcacion

```
Si asset_type IN (background, prop, crowd):
  -> generation_mode = 'bulk'
  -> Encolar a fal.ai batch (async, sin intervencion humana)

Si asset_type IN (character_closeup, expression, thumbnail):
  -> generation_mode = 'hero'
  -> Abrir generador interactivo (humano ajusta prompt y aprueba)

Si asset viene de Photoshop/externo:
  -> generation_mode = 'manual'
  -> Upload directo al storage
```

### Bulk (automatico)

Para backgrounds, props y crowd shots:
1. El sistema extrae `visual_objects` del guion locked
2. Auto-construye prompts: `[estilo] + [background] + [mood] + [props]`
3. Encola todos a fal.ai via ARQ worker
4. Las imagenes aparecen en el Kanban al completar
5. Alan revisa y aprueba/rechaza

### Hero (interactivo)

Para close-ups de personajes y expresiones:
1. Alan abre el generador desde la tarjeta del Kanban
2. El sistema sugiere un prompt base desde el guion
3. Alan ajusta el prompt, modelo, parametros
4. Preview en vivo -> iterar hasta satisfecho
5. Aprobar -> se guarda en storage y marca como done

### Manual (upload)

Para assets hechos en Photoshop o fuentes externas:
1. Alan arrastra el archivo al slot correspondiente del Kanban
2. Se sube a Supabase Storage
3. Se asocia al asset_id y se marca como done

---

## Kanban

Columnas del Kanban por episodio:

| Columna | Significado |
|---------|-------------|
| **Pending** | Asset requerido por el guion, no generado aun |
| **Queued** | Enviado a la cola de generacion |
| **Generating** | fal.ai esta procesando |
| **Done** | Imagen lista (generada o subida manual) |
| **Failed** | Error en generacion (retry disponible) |
| **Rejected** | Alan reviso y rechazo (regenerar) |

Las tarjetas se auto-generan desde `visual_objects` cuando el guion pasa a status `locked`.

---

## Prompt Auto-Construction

Template base:
```
{style_prefix}, {background_description}, {mood} atmosphere,
{characters} in frame, {props} visible,
high quality, consistent art style
```

Ejemplo:
```
QPH cartoon style, living room interior, tense atmosphere,
Luis and Beto in frame, sofa visible,
high quality, consistent art style
```

---

## API Endpoints

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/v1/assets/{project_id}` | Lista assets del proyecto (filtros status/type) |
| POST | `/api/v1/assets/generate` | Generar imagen (body: prompt, mode, model) |
| POST | `/api/v1/assets/generate-batch` | Generar N imagenes bulk (async -> job_id) |
| POST | `/api/v1/assets/{id}/upload` | Upload manual de asset |
| PATCH | `/api/v1/assets/{id}/status` | Aprobar/rechazar asset |
