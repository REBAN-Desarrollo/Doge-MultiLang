# 🎙️ Síntesis del Pipeline de Audio: Doge-MultiLang & Fernando Workflow

Este documento define el proceso técnico y creativo para la sincronización de audio multi-idioma, basado en los levantamientos de **Saúl (Dubbing)** y **Fernando (Post-prod)**.

---

## 1. El Ciclo de Vida del Audio (The Loop)

Para evitar la degradación de la calidad y los errores de sincronía, el proceso debe seguir este orden:

1.  **Extracción SSOT (Docx):** Se extrae el texto puro del `.docx`. Este es el ÚNICO origen para la traducción.
2.  **TTS Original (English Reference):** Se genera el audio en inglés.
3.  **STT de Referencia (Timing Extraction):** Aplicamos Speech-to-Text (Whisper/ElevenLabs) al audio inglés NO para obtener el texto, sino para extraer los **timestamps exactos** de cada frase.
4.  **Traducción Auditada (GPT-4o + Claude):** Se traduce el texto del Docx usando los timestamps como restricción de longitud (ej. "Esta frase debe durar máximo 3.2s").
5.  **Generación de Doblaje (Target Language):** ElevenLabs genera el audio en el idioma destino.
6.  **Validación de Delta (Fernando's Process):** Se compara la duración del audio destino vs el original.

---

## 2. ¿Docx o STT? (Definición del Proceso)

**Decisión Técnica:** 
> "Traducimos el **Docx**, pero sincronizamos con el **STT**."

- **Por qué el Docx:** El STT puede cometer errores (alucinaciones) en nombres propios o términos técnicos. El Docx es la intención original del autor.
- **Por qué el STT:** El Docx no nos dice cuánto tiempo tarda el actor/voz en decir una frase. El STT nos da el mapa de bits de tiempo para que Fernando sepa dónde insertar los silencios.

---

## 3. La Intervención de Fernando (Silencios y Mezcla)

Fernando requiere que el audio llegue "planchado" o con metadatos claros:

- **Silence Padding:** Si el español es 0.5s más corto, el script debe generar un archivo con 0.5s de silencio al final (o según la regla de Fernando de "aire para transición").
- **Compresión de Tiempo:** Si el español es más largo, el sistema debe alertar antes de la mezcla final para que la IA (Claude) ajuste la traducción (Teoría del Espejo Crítico).

---

## 4. Roles de Multi-Idioma (Saúl & Team)

El equipo de multi-idioma actúa como el **QA de Intención**:
- Verifican que el "tono" de la voz en el idioma destino mantenga la personalidad del Doge definida por Saúl.
- Utilizan el **Audit Report** (GPT/Claude) para validar que no se usaron términos prohibidos (Blacklist).

---

## 5. Propuesta de Automatización (API First)

En lugar de que Fernando ajuste silencios manualmente en Premiere/Audition:
- El script de Python (`transform.py` evolucionado) usará `pydub` para leer los timestamps del STT inglés y el audio ES, inyectando silencios automáticamente para que el archivo final de audio ES coincida exactamente en duración con el bloque de video.

---
*Documento para rebote técnico con Codex y Claude.*
