# Provider: fal.ai

Modelos, pricing y logica de bifurcacion para generacion de imagenes.

---

## Endpoints Usados

### Generate (single)

```python
async def generate(self, prompt: str, model: str = "fal-ai/flux/dev", **kwargs) -> str:
    """Genera 1 imagen. Retorna URL."""
    handler = await fal_client.submit_async(model, arguments={"prompt": prompt, **kwargs})
    result = await handler.get()
    return result["images"][0]["url"]
```

### Generate Batch (concurrent)

```python
async def generate_batch(self, prompts: list[str], **kwargs) -> list[str]:
    """Genera N imagenes concurrentes."""
    import asyncio
    tasks = [self.generate(p, **kwargs) for p in prompts]
    return await asyncio.gather(*tasks)
```

---

## Modelos Disponibles

| Modelo | ID fal.ai | Uso | Velocidad | Calidad |
|--------|-----------|-----|-----------|---------|
| Flux Dev | `fal-ai/flux/dev` | Default para bulk | Rapido | Buena |
| Flux Pro | `fal-ai/flux-pro` | Hero shots | Medio | Alta |
| Flux Schnell | `fal-ai/flux/schnell` | Preview rapido | Muy rapido | Media |

**Nota**: Los modelos disponibles cambian frecuentemente. Verificar en [fal.ai/models](https://fal.ai/models).

---

## Bifurcacion por Tipo de Asset

| Tipo | Modo | Modelo Default | Interaccion |
|------|------|---------------|-------------|
| background | bulk | flux/dev | Automatico (sin humano) |
| prop | bulk | flux/dev | Automatico |
| crowd | bulk | flux/dev | Automatico |
| character_closeup | hero | flux-pro | Interactivo (humano aprueba) |
| expression | hero | flux-pro | Interactivo |
| thumbnail | hero | flux-pro | Interactivo |

---

## Patron SSOT (Provider Client)

```python
import fal_client
from app.config import get_settings

class FalAIClient:
    def __init__(self):
        s = get_settings()
        self.api_key = s.fal_ai_api_key

    @property
    def configured(self) -> bool:
        return bool(self.api_key)
```

---

## Costos Estimados

| Modelo | Costo/Imagen | Volumen/Episodio |
|--------|-------------|------------------|
| Flux Dev | ~$0.02-0.04 | 20-40 backgrounds |
| Flux Pro | ~$0.05-0.10 | 10-20 hero shots |
| Flux Schnell | ~$0.01 | Previews (no se guardan) |

**Total estimado por episodio**: ~$2-5 (dependiendo de cuantas imagenes se generan vs suben manuales).

---

## Parametros Comunes

```python
{
    "prompt": "QPH cartoon style, ...",
    "image_size": "landscape_16_9",  # o "square_hd", "portrait_4_3"
    "num_inference_steps": 28,       # mas steps = mas calidad, mas lento
    "guidance_scale": 3.5,           # adherencia al prompt
    "seed": None,                    # para reproducibilidad
}
```

---

## Consideraciones

- **Timeout**: Generacion puede tardar 5-15s por imagen. Configurar timeout adecuado.
- **Concurrencia**: fal.ai soporta requests concurrentes. El batch usa `asyncio.gather`.
- **Storage**: Las URLs de fal.ai son temporales. Descargar y guardar en Supabase Storage inmediatamente.
- **Fallback futuro**: Si fal.ai tiene downtime, Replicate tiene modelos Flux compatibles con la misma interfaz de prompt.
