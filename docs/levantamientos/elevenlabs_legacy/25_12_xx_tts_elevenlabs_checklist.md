# Voice TTS Module - Checklist

## 🎯 Objetivo
Implementar módulo `/voice` para generación de TTS con ElevenLabs desde guiones .docx

---

## Fase 1: MVP

### Backend - Services
- [x] Crear `services/elevenlabs.py`
  - [x] `get_voices()`
  - [x] `text_to_speech(text, voice_id)`
  - [x] `get_subscription()`
- [x] Crear `services/docx_parser.py`
  - [x] `parse_script(docx_path)`
  - [x] `extract_characters(dialogos)`

### Backend - API
- [x] Crear `api/voice.py`
  - [x] GET `/status`
  - [x] GET `/voices`
  - [x] POST `/upload`
  - [x] POST `/generate`
  - [x] GET `/generate/{job_id}`
  - [x] DELETE `/generate/{job_id}`
- [x] Crear `api/models_voice.py`
- [x] Crear `api/voice_websocket.py`

### Backend - Config
- [x] Modificar `config.py` - agregar eleven_labs_api_key
- [x] Modificar `main.py` - registrar router

### Frontend - Page
- [x] Crear `app/voice/page.tsx`

### Frontend - Components
- [x] Crear `components/voice/ScriptUploader.tsx`
- [x] Crear `components/voice/VoiceMapper.tsx`
- [x] Crear `components/voice/SceneQueue.tsx`
- [x] Crear `components/voice/index.ts`

### Frontend - Navigation
- [x] Modificar `Header.tsx` - agregar link /voice

### Tests
- [ ] `test_docx_parser.py`
- [ ] `test_elevenlabs_client.py`
- [ ] `test_voice_endpoints.py`

---

## Fase 2: Flujo Optimizado por Diálogo

### Generación por Diálogo
- [ ] Modificar `voice.py` para generar audio por diálogo individual
- [ ] Almacenar audios con metadata: `{personaje, escena, orden, path}`
- [ ] Cache de audios (evitar re-generar si ya existe)

### Audio Processing (Speed + Pitch)
- [ ] Crear `services/audio_processor.py`
  - [ ] `apply_speed(audio_path, factor)` - ej: 1.12x
  - [ ] `apply_pitch(audio_path, semitones)` - ej: -3 st
  - [ ] `process_batch(audios, personaje_settings)`
- [ ] Instalar `pydub` en requirements.txt

### Audio Merge
- [ ] Crear `services/audio_merger.py`
  - [ ] `merge_by_scene(audios_metadata)` → escena_N.mp3
  - [ ] Mantener orden de diálogos
  - [ ] Agregar pausas configurables entre diálogos

### UI - Controles por Personaje
- [ ] Agregar slider Speed en `VoiceMapper.tsx` (0.5x - 2.0x)
- [ ] Agregar slider Pitch en `VoiceMapper.tsx` (-12 a +12 st)
- [ ] Preview de voz con settings aplicados

---

## Fase 3: Preview + Costo

- [ ] Vista previa de texto antes de generar
- [ ] Contador de caracteres
- [ ] Estimación de costo según plan ElevenLabs
- [ ] Preview de muestra de voz

---

## Verificación Final

- [ ] Test con guion real (`Un guardaespaldas escolar.docx`)
- [ ] Validar extracción de diálogos
- [ ] Validar mapeo de voces
- [ ] Validar generación completa
- [ ] Validar descarga de audios
