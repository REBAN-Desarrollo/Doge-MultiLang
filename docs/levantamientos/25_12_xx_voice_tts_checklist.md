# Voice TTS Module - Checklist

## 🎯 Objetivo
Implementar módulo `/voice` para generación de TTS con ElevenLabs desde guiones .docx

---

## Fase 1: MVP

### Backend - Services
- [ ] Crear `services/elevenlabs.py`
  - [ ] `get_voices()`
  - [ ] `text_to_speech(text, voice_id)`
  - [ ] `get_subscription()`
- [ ] Crear `services/docx_parser.py`
  - [ ] `parse_script(docx_path)`
  - [ ] `extract_characters(dialogos)`

### Backend - API
- [ ] Crear `api/voice.py`
  - [ ] GET `/status`
  - [ ] GET `/voices`
  - [ ] POST `/upload`
  - [ ] POST `/generate`
  - [ ] GET `/generate/{job_id}`
  - [ ] DELETE `/generate/{job_id}`
- [ ] Crear `api/models_voice.py`
- [ ] Crear `api/voice_websocket.py`

### Backend - Config
- [ ] Modificar `config.py` - agregar eleven_labs_api_key
- [ ] Modificar `main.py` - registrar router

### Frontend - Page
- [ ] Crear `app/voice/page.tsx`

### Frontend - Components
- [ ] Crear `components/voice/ScriptUploader.tsx`
- [ ] Crear `components/voice/VoiceMapper.tsx`
- [ ] Crear `components/voice/SceneQueue.tsx`
- [ ] Crear `components/voice/index.ts`

### Frontend - Navigation
- [ ] Modificar `Header.tsx` - agregar link /voice

### Tests
- [ ] `test_docx_parser.py`
- [ ] `test_elevenlabs_client.py`
- [ ] `test_voice_endpoints.py`

---

## Fase 2: Generación por Personaje

- [ ] Selector de modo (Por Escena | Por Personaje | Híbrido)
- [ ] Control Speed por personaje (slider)
- [ ] Control Pitch por personaje (-12 a +12 st)
- [ ] Merge automático a escenas
- [ ] UI de fine-tuning por personaje

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
