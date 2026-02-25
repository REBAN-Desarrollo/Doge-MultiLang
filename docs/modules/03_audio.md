# Modulo 3: Audio Hub

> Hoy se usa ElevenLabs. En el futuro podria ser Fish Audio, Bark, XTTS, o TTS local. Este modulo define el **FLUJO** (TTS -> QA -> Storage -> Reproduce), no la API.

---

## User Stories

| ID | Story | Criterio de Aceptacion |
|----|-------|----------------------|
| AU-01 | Como Fernando, quiero generar el audio TTS de todo un episodio con un click | "Generate TTS" -> cola async -> WAVs por dialogo en storage |
| AU-02 | Como Fernando, quiero escuchar el audio por escena en un reproductor | Reproductor con timeline, dialogos alineados, play/pause por segmento |
| AU-03 | Como Fernando, quiero ver indicadores de calidad (QA) por cada audio | Indicador verde (WER < 10%), amarillo (10-15%), rojo (> 15%) |
| AU-04 | Como Fernando, quiero regenerar un segmento de audio sin re-hacer todo el episodio | Boton "Regenerar" por segmento -> solo ese WAV se regenera |
| AU-05 | Como Saul, quiero gestionar el diccionario de pronunciacion (.pls) | CRUD de palabras/fonemas, inyeccion automatica en TTS |
| AU-06 | Como Saul, quiero elegir la voz por personaje | Selector de voice_id de ElevenLabs por personaje, persistido en DB |
| AU-07 | Como futuro, quiero Auto-QA: el sistema detecta errores roboticos automaticamente | Scribe v2 STT -> WER check -> flag automatico si falla |

---

## Flujo TTS

```
dialogue_json (del guion locked)
  |
  v
Por cada dialogo:
  1. Inyectar pronunciation_dict (tabla de fonemas IPA)
  2. Llamar ElevenLabs TTS API con voice_id del personaje
  3. Guardar WAV en Supabase Storage (bucket "audio")
  4. Auto-QA: Scribe v2 STT -> calcular WER -> marcar status
  5. Si WER > 15%: status = qa_fail (alerta roja en UI)
  |
  v
Notificar a Fernando via Supabase Realtime
```

---

## Auto-QA (Word Error Rate)

El sistema automaticamente evalua cada audio generado:

1. **Genera** el audio TTS con ElevenLabs
2. **Transcribe** el audio con ElevenLabs Scribe v2 (STT)
3. **Compara** la transcripcion con el texto original
4. **Calcula** WER (Word Error Rate)

| WER | Indicador | Significado |
|-----|-----------|-------------|
| < 10% | Verde | Audio fiel al texto, listo |
| 10-15% | Amarillo | Pequenas diferencias, revisar |
| > 15% | Rojo | Errores significativos, regenerar |

---

## Reproductor de Audio

El reproductor muestra:

```
+--------------------------------------------------+
| Escena 1                                          |
|                                                   |
| [Luis] "Oye Beto..."      [>] 0:00-0:02  [QA: G] |
| [Beto] "Que paso?"        [>] 0:02-0:03  [QA: G] |
| [Luis] "Ya viste lo que.." [>] 0:03-0:06  [QA: R] |
|                            [Regen]                |
|                                                   |
| Escena 2                                          |
| [Narrador] "Mientras..."  [>] 0:06-0:10  [QA: G] |
+--------------------------------------------------+
| [<<] [>] [>>]              Total: 0:45            |
+--------------------------------------------------+
```

Funciones:
- Play/pause por segmento individual
- Play continuo de toda la escena
- Indicador QA (verde/amarillo/rojo) por segmento
- Boton "Regenerar" por segmento (solo regenera ese WAV)

---

## Diccionario de Pronunciacion

Tabla `pronunciation_dict` con pares palabra -> fonema IPA:

| Palabra | Fonema (IPA) | Idioma | Notas |
|---------|-------------|--------|-------|
| QPH | /ke pe.ro i.lo/ | es | Nombre del show |
| Beto | /be.to/ | es | No "bito" |
| DOGE | /doʊdʒ/ | en | Como la crypto |

Se inyectan automaticamente en el texto antes de enviar a TTS.

---

## Voces por Personaje

Tabla `character_voices`:

| Personaje | Idioma | Voice ID | Nombre de Voz |
|-----------|--------|----------|---------------|
| Luis | es | `abc123...` | "Spanish Male Young" |
| Beto | es | `def456...` | "Spanish Male Teen" |
| Narrador | es | `ghi789...` | "Spanish Male Narrator" |

Cada personaje tiene una voz asignada por idioma. Saul configura esto una vez y se usa automaticamente en cada episodio.

---

## API Endpoints

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/v1/audio/generate-tts` | TTS batch para proyecto (async -> job_id) |
| POST | `/api/v1/audio/regenerate-segment` | Regenerar 1 segmento especifico |
| GET | `/api/v1/audio/{project_id}` | Lista audio tracks por proyecto/idioma |
| GET | `/api/v1/audio/{project_id}/player` | Datos para reproductor (tracks + timestamps) |
