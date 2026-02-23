# Provider: ElevenLabs

Endpoints, limites y costos para la integracion con ElevenLabs en DOGE Creative Suite.

---

## Endpoints Usados

### 1. Text-to-Speech (TTS)

**Endpoint**: `POST /v1/text-to-speech/{voice_id}`
**Uso**: Generar audio WAV desde dialogo del guion.

```python
async def tts(self, voice_id: str, text: str, model: str = "eleven_multilingual_v2") -> bytes:
    r = await self._client.post(
        f"/text-to-speech/{voice_id}",
        json={"text": text, "model_id": model}
    )
    r.raise_for_status()
    return r.content
```

**Modelos disponibles**:
| Modelo | Uso | Latencia | Calidad |
|--------|-----|----------|---------|
| `eleven_multilingual_v2` | Default para todos los idiomas | Media | Alta |
| `eleven_turbo_v2_5` | Preview rapido | Baja | Media |

**Limites**:
- Timeout: 120s (configurar httpx)
- Max chars por request: ~5000
- Rate limit: depende del plan

### 2. Scribe v2 (Speech-to-Text)

**Endpoint**: `POST /v1/speech-to-text`
**Uso**: Auto-QA — transcribir audio generado para calcular WER.

```python
async def scribe(self, audio_bytes: bytes, language: str = "es") -> dict:
    """Scribe v2 STT para Auto-QA."""
    ...
```

**Output**: JSON con transcripcion + timestamps por palabra.

### 3. Dubbing API

**Endpoint**: `POST /v1/dubbing`
**Uso**: Generar audio doblado completo por idioma.

**Input**: Audio original (ES) + texto traducido.
**Output**: Audio doblado en idioma target.

### 4. Dubbing Resource API (Patching)

**Endpoint**: `PATCH /v1/dubbing/{dubbing_id}/segments/{segment_id}`
**Uso**: Parchar un segmento individual sin re-generar todo el dub.

```python
async def dubbing_patch(self, dubbing_id: str, segment_id: str, new_text: str) -> bytes:
    """Parchar 1 segmento via Dubbing Resource API."""
    ...
```

### 5. Forced Alignment

**Endpoint**: `POST /v1/forced-alignment`
**Uso**: Resincronizar timestamps despues de que Fernando edita el video.

```python
async def forced_alignment(self, audio_bytes: bytes, text: str) -> dict:
    """Recalibrar timestamps post-edicion."""
    ...
```

**Output**: JSON con timestamps recalibrados por palabra/segmento.

---

## Patron SSOT (Provider Client)

```python
import httpx
from app.config import get_settings

class ElevenLabsClient:
    BASE = "https://api.elevenlabs.io/v1"

    def __init__(self):
        s = get_settings()
        self.api_key = s.elevenlabs_api_key
        self._client = httpx.AsyncClient(
            base_url=self.BASE,
            headers={"xi-api-key": self.api_key},
            timeout=120.0,
        )

    @property
    def configured(self) -> bool:
        return bool(self.api_key)
```

---

## Costos Estimados

| Operacion | Costo Aprox | Volumen/Episodio |
|-----------|-------------|------------------|
| TTS (1 dialogo) | ~$0.01-0.03 | ~50-100 dialogos |
| TTS batch (27 idiomas) | ~$15-40 | 1x por episodio |
| Scribe STT (QA) | ~$0.005/min | ~50-100 segmentos |
| Dubbing (1 idioma) | Variable | 26 idiomas |
| Forced Alignment | Incluido en plan | 1x post-edicion |

**Nota**: Costos varian segun plan de ElevenLabs y longitud del contenido.
