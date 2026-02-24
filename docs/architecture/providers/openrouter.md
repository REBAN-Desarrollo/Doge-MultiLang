# Provider: OpenRouter

Modelos por caso de uso y patron de integracion para LLMs.

---

## Por que OpenRouter

- **Un solo API key** para acceder a Claude, Gemini, GPT, y otros
- **Routing inteligente**: Cambiar de modelo sin cambiar codigo
- **Fallbacks automaticos**: Si un modelo esta caido, redirige a otro
- **Compatible con OpenAI SDK**: `base_url="https://openrouter.ai/api/v1"`

---

## Modelos por Caso de Uso

### Traduccion

| Familia Linguistica | Modelo | Razon |
|---------------------|--------|-------|
| Romance (FR, IT, PT) | `anthropic/claude-sonnet-4` | Alta calidad ES->Romance directo |
| CJK (JA, KO, ZH) | `google/gemini-2.0-flash` | Fuerte en CJK, costo moderado |
| Otros (via EN pivot) | `anthropic/claude-sonnet-4` | Buena calidad general |
| Fallback | `openai/gpt-4o-mini` | Economico, aceptable calidad |

### Parsing de Guion

| Tarea | Modelo | Razon |
|-------|--------|-------|
| Parseo de dialogos | `anthropic/claude-sonnet-4` | Excelente en structured output |
| Deteccion de emociones | `anthropic/claude-haiku-4-5` | Rapido, suficiente calidad |

### Blacklist Check

| Tarea | Modelo | Razon |
|-------|--------|-------|
| Clasificacion de terminos | `anthropic/claude-haiku-4-5` | Rapido, economico |

---

## Patron SSOT (Provider Client)

```python
from openai import AsyncOpenAI
from app.config import get_settings

class OpenRouterClient:
    def __init__(self):
        s = get_settings()
        self.client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=s.openrouter_api_key
        )

    async def chat(self, messages: list[dict], model: str = "anthropic/claude-sonnet-4") -> str:
        r = await self.client.chat.completions.create(
            model=model,
            messages=messages
        )
        return r.choices[0].message.content

    async def translate(self, text: str, target_lang: str, source_lang: str = "es") -> str:
        """Traduccion via LLM con contexto cultural."""
        return await self.chat([
            {
                "role": "system",
                "content": f"Translate from {source_lang} to {target_lang}. "
                           f"Preserve tone, humor, and cultural nuance. "
                           f"This is for a kids animation (ages 6-12)."
            },
            {"role": "user", "content": text}
        ])
```

---

## Costos Estimados

| Modelo | Input/1M tokens | Output/1M tokens | Uso Principal |
|--------|----------------|-------------------|---------------|
| claude-sonnet-4 | $3 | $15 | Traduccion, parsing |
| claude-haiku-4-5 | $0.80 | $4 | Blacklists, tareas rapidas |
| gemini-2.0-flash | $0.10 | $0.40 | CJK translation |
| gpt-4o-mini | $0.15 | $0.60 | Fallback economico |

**Estimado por episodio** (27 idiomas, ~100 dialogos):
- Traduccion: ~$1-3
- Parsing + blacklists: ~$0.10-0.30
- **Total**: ~$1-4 por episodio

---

## Consideraciones

- **Headers extra**: OpenRouter recomienda enviar `HTTP-Referer` y `X-Title` para tracking
- **Rate limits**: Dependen del modelo subyacente, no de OpenRouter
- **Streaming**: Soportado, pero para traducciones batch no es necesario (ya es async via ARQ)
- **Modelos cambian**: Verificar disponibilidad y precios periodicamente en [openrouter.ai/models](https://openrouter.ai/models)
