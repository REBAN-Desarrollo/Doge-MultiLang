# Modulos Futuros (No en MVP)

Estos modulos **NO se construyen ahora**, pero la arquitectura debe permitir agregarlos sin refactoreo mayor.

---

## Video Compositor

**Descripcion**: Combinar assets + audio en timeline, exportar MP4.
**Trigger para construir**: Cuando Fernando quiera preview sin Premiere.
**Dependencias**: Assets (modulo 2) + Audio (modulo 3) completos.
**Complejidad estimada**: Alta (FFmpeg, canvas rendering, timeline UI).

---

## Subtitle Burner

**Descripcion**: Generar y quemar subtitulos desde traducciones.
**Trigger para construir**: Cuando publiquen en mas plataformas que requieran subtitulos hardcoded.
**Dependencias**: Traducciones (modulo 4) + timestamps sincronizados.
**Complejidad estimada**: Media (FFmpeg + ASS/SRT generation).

---

## Thumbnail Generator

**Descripcion**: Generar thumbnails desde escenas clave + texto overlay.
**Trigger para construir**: Cuando optimicen CTR por idioma.
**Dependencias**: Assets (modulo 2) + traducciones de titulos.
**Complejidad estimada**: Baja-Media (fal.ai + text overlay).

---

## Analytics Dashboard

**Descripcion**: WER scores, COMET scores, AVD por idioma, costos por episodio.
**Trigger para construir**: Cuando escalen a mas episodios y necesiten visibilidad de costos/calidad.
**Dependencias**: Datos de jobs, audio_tracks, translations acumulados.
**Complejidad estimada**: Media (agregacion + charts con Recharts/Tremor).

---

## Catalogo de Personajes

**Descripcion**: Integrar DOGE-Studio-Personajes como modulo nativo de la suite.
**Trigger para construir**: Cuando estabilicen el estilo visual y quieran consistencia cross-episodio.
**Dependencias**: Perfiles de personajes de DOGE-Studio-Personajes (Gemini API).
**Complejidad estimada**: Media (CRUD + integracion con Asset Factory prompts).

---

## Content Calendar

**Descripcion**: Planificar episodios, asignar tareas, deadlines, tracking.
**Trigger para construir**: Cuando el volumen de episodios lo justifique (5+ por mes).
**Dependencias**: Proyectos + usuarios.
**Complejidad estimada**: Media-Alta (Gantt/calendar UI, notificaciones).
