# Latency Optimization

> Learn how to optimize text-to-speech latency.

This guide covers the core principles for improving text-to-speech latency.

While there are many individual techniques, we'll group them into **four principles**.

## Four Principles

1. [Use Flash models](#use-flash-models)
2. [Leverage streaming](#leverage-streaming)
3. [Consider geographic proximity](#consider-geographic-proximity)
4. [Choose appropriate voices](#choose-appropriate-voices)

Enterprise customers benefit from increased concurrency limits and priority access to our rendering queue. Contact sales to learn more about enterprise plans.

## Use Flash Models

Flash models deliver ~75ms inference speeds, ideal for real-time applications. The trade-off is a slight reduction in audio quality compared to Multilingual v2.

*Note: 75ms refers to model inference time only. Actual end-to-end latency varies with factors such as location and endpoint type used.*

## Leverage Streaming

Three text-to-speech endpoint types are available:

* **Regular endpoint:** Returns complete audio file in single response
* **Streaming endpoint:** Returns audio chunks progressively using Server-sent events
* **Websockets endpoint:** Enables bidirectional streaming for real-time audio generation

### Streaming

Streaming endpoints progressively return audio as generated, reducing time-to-first-byte. Recommended when input text is available upfront.

### Websockets

The websocket endpoint supports bidirectional streaming, perfect for applications with real-time text input (e.g., LLM outputs).

Setting `auto_mode` to true automatically handles generation triggers. If disabled, the model waits for text matching the chunk schedule before generating audio.

## Choose Appropriate Voices

Voice selection can impact latency. Order from fastest to slowest:

1. Default voices, Synthetic voices, Instant Voice Clones
2. Professional Voice Clones (PVC)

Higher audio quality formats increase latency. Balance requirements with fidelity needs.

## Consider Geographic Proximity

Models are served from multiple regions. Expected TTFB latencies with Flash models and Websockets:

| Region | TTFB |
|--------|------|
| North America | 100-150ms |
| Europe | 100-150ms |
| South East Asia | 100-150ms |
| South Asia | 150-200ms |
| North East Asia | 150-200ms |

Check the `x-region` header in API responses. Current regions: USA, Netherlands, Singapore.

To use USA servers exclusively, set base URL to `https://api.us.elevenlabs.io`

### Python Example

```python
import os
from elevenlabs.client import ElevenLabs

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
    base_url="https://api.us.elevenlabs.io"
)
```

### TypeScript Example

```typescript
import { ElevenLabs } from '@elevenlabs/elevenlabs-js';
import 'dotenv/config';

const elevenlabs = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY,
  baseUrl: 'https://api.us.elevenlabs.io',
});
```

### cURL Example

```bash
curl -X POST -v "https://api.us.elevenlabs.io/v1/text-to-speech/{voice_id}" \
  -H "Accept: audio/mpeg" \
  -H "Content-Type: application/json" \
  -H "xi-api-key: YOUR_API_KEY" \
  -d '{
    "text": "Hello World!",
    "model_id": "eleven_flash_v2_5"
  }'
```

The global servers default is now standard behavior. Update applications to use `api.elevenlabs.io` instead of the previously optional `api-global-preview.elevenlabs.io`.
