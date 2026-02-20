# Plan de Mejoras para TTS (Enfoque en Español)

## Objetivo
Mejorar el módulo de Texto a Voz (TTS) para soportar mejor los flujos de trabajo en español, aprovechando las características de ElevenLabs.

---

## ✅ Implementado

### 1. Selección de Modelo
- **Flash v2.5** (Ahora es el default, rápido y económico).
- **Turbo v2.5** (Balance calidad/velocidad).
- **Multilingual v2** (Mejor normalización de números/fechas).
- **v3 Alpha** (Nuevo - Mayor rango emocional).
- **UI**: Nuevo layout 2x2 en "Configuración" (Velocidad+Pausa / Modelo+Auto-combinar).

### 2. Filtrado de Voces por Idioma/Acento
- Filtro para encontrar voces en español (Mexican, Spanish, International).

---

## ⚠️ Funcionalidades Necesarias (Críticas para Mejora Continua)

### 1. Importar Guion de Google Docs
Permitir importar guiones directamente desde Google Docs (shared directory).
- **Razón**: Facilita colaboración en tiempo real y edición simultánea.
- **API**: Google Docs API o Google Drive API.
- **Impacto**: Workflow más ágil para equipos grandes.

### 2. Efectos de Sonido (SFX)
Generar efectos de sonido desde descripciones de texto.
- **Ejemplo**: "lluvia cayendo suavemente", "puerta de automóvil cerrándose".
- **API**: `/v1/sound-generation` endpoint de ElevenLabs.
- **Impacto**: Producción completa de audio sin herramientas externas.

### 3. Forced Alignment (Alineación Forzada)
Obtener timestamps precisos (word-level) de audios existentes.
- **Uso**: Karaoke, subtítulos frame-perfect, verificación de sincronía.
- **API**: `/v1/forced-alignment` endpoint.
- **Impacto**: Calidad profesional en post-producción.

---

## 🚧 Propuesto (Para Discutir)

### 3. Diccionarios de Pronunciación
Crear una interfaz para añadir reglas como:
- `"AI-Studio"` → `"Estudio de Inteligencia Artificial"`
- **Complejidad**: Media. Backend ya preparado.

### 4. Generación de Subtítulos (.SRT / Timestamps)
Generar archivos de subtítulos automáticamente al producir audio.
- **Uso**: Sincronización de audio con video.
- **API**: `with_timestamps=True`.

### 5. Efectos de Sonido
Generar efectos de sonido (SFX) de texto a audio.
- **Ejemplo**: "sonido de la lluvia cayendo", "puerta de carro cerrándose".
- **API**: `/sound-generation` endpoint.

### 6. Clonación de Voz Instantánea (IVC)
Permitir subir una muestra de audio (~1-2 min) para clonar una voz.
- **Uso**: Voces personalizadas para proyectos específicos.
- **API**: `voices.ivc.create()`.

### 7. Forced Alignment (Alineación Forzada)
Obtener marcas de tiempo precisas (word-level) de un audio existente.
- **Uso**: Karaoke, subtítulos precisos, verificación de sincronía.
- **API**: `/forced-alignment` endpoint.

### 8. Speech-to-Speech (Voice Changer)
Cambiar la voz de un audio existente a otra voz de ElevenLabs.
- **Uso**: Revoicing, correcciones rápidas.
- **API**: `speech_to_speech.convert()`.

### 9. Doblaje (Dubbing)
Doblar automáticamente un video/audio a otro idioma.
- **Uso**: Contenido multilingüe.
- **API**: `/dubbing` endpoint.

### 10. Diseño de Voz (Voice Design)
Crear una voz completamente nueva a través de parámetros (edad, género, acento).
- **Uso**: Personajes únicos sin necesidad de audio de muestra.
- **API**: `voice_generation.generate()`.

---

## 🎯 Estratégico a Corto Plazo (Fácil de implementar)

### 11. Indicador de Costo Estimado
Mostrar el costo aproximado en caracteres/créditos ANTES de generar.
- **Implementación**: Ya tienen `character_count` y `character_limit` del status. Solo falta mostrarlo dinámicamente según las escenas seleccionadas.
- **Impacto**: Evita sorpresas de facturación y permite planificar mejor.

### 12. Persistencia de Configuración
Guardar en `localStorage` el último modelo, idioma, velocidad, etc.
- **Implementación**: Al cerrar, guardar estado. Al abrir, restaurar.
- **Impacto**: Mejor UX, menos clics repetitivos.

### 13. Preview Rápido de Línea
Un botón pequeño junto a cada diálogo en el SceneQueue para generar SOLO esa línea como prueba.
- **Uso**: Testing rápido de voces/acentos sin gastar en todo el guion.
- **Impacto**: Ahorro de créditos, iteración rápida.

---

## 🚀 Estratégico a Mediano Plazo (Alto valor)

### 14. Historial de Generaciones
ElevenLabs ya guarda un historial. Mostrar las últimas 10-20 generaciones para re-descargar sin regenerar.
- **API**: `GET /v1/history`.
- **Impacto**: Ahorro de créditos si alguien borra un archivo accidentalmente.

### 15. Timestamps/SRT Automático (Prioridad Alta)
Ya está en la lista, pero es MUY estratégico para video.
- **API**: `with_timestamps=True` en la generación.
- **Impacto**: Diferenciador clave vs. competencia.

### 16. Batch Processing Multi-Guion
Subir varios guiones y procesarlos en cola overnight.
- **Uso**: Producción masiva de contenido para equipos grandes.
- **Impacto**: Escalabilidad para clientes enterprise.

---

## Resumen Técnico
- **Backend Actualizado**: `services/elevenlabs.py`, `api/voice.py` (soportan model_id, dictionaries).
- **Frontend Actualizado**: `VoiceMapper` (filtros), `page.tsx` (modelo selector, guía de configuración).
- **Nuevo**: Filtrado dinámico de idiomas según modelo (v2 vs v2.5/v3).
