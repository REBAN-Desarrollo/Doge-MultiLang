# 🤖 Gemini Multi-Opinion: Mega Swarm Analysis & Theories

Este documento es el centro de debate para la evolución de **Doge-MultiLang**, integrando los levantamientos fundacionales de Enero y los **16 archivos recuperados** de la era ElevenLabs Legacy, además de la **Arquitectura API 2025**.

---

## 🎭 La Mesa de Debate (The Swarm Perspectives)

### 🧩 1. El Estructurador (Enfoque SSOT y Planchado)
**Misión:** Garantizar que el guion (`.docx`) sea la Única Fuente de Verdad.
- **Estrategia API 2025:** Usar `POST /v1/studio/projects` con el flag `auto_assign_voices: "alpha"` para automatizar la primera pasada de voces basada en el `planchado.py`.
- **Novedad Legacy:** Alinear límites de caracteres (40,000 para Flash v2.5) según `ElevenLabs Docs.json`.
- **Solución:** Validar cada bloque contra el `26_02_18_checklist_audio_qa.md`.

### 🎨 2. El Director Creativo (Enfoque Biblia Narrativa)
**Misión:** Mantener la personalidad del Doge en todos los idiomas (Saúl's Goal).
- **Estrategia API 2025:** Inyectar tags de pronunciación y `SSML phoneme tags` directamente vía API para corregir errores recurrentes detectados por Saúl.
- **Novedad Legacy:** Incorporar la guía `25_12_24_persona_kids_6_12.md`. Claude actúa como "Filtro Kids".
- **Solución:** Auditoría cultural específica por idioma usando el contexto de `02_CORE_NARRATIVE_BIBLE.md`.

### ⏱️ 3. El Productor Eficiente (Enfoque Fernando Delta)
**Misión:** Automatizar el timing y los silencios (Fernando's Flow).
- **Estrategia API 2025:** 
    - Usar `PATCH /v1/studio/projects/{id}/chapters/{id}` para actualizar el contenido dinámicamente si el Auditor detecta un error de timing.
    - Inyectar `<break time="X.Xs" />` (SSML) o `[pause]` (V3) calculados automáticamente para rellenar los "Deltas de Fernando".
- **Novedad Legacy:** Resolver el "desfase de boca" (Alan/Ramón) sincronizando los `word_timestamps` estructurados que ahora devuelve la API de Studio.

---

## 🛠️ Roadmap Técnico de Implementación (API-First)

1.  **Fase 1: Batch Creation:** Subir capítulos completos usando el modelo `Eleven Flash v2.5` para latencia mínima.
2.  **Fase 2: Smart Polishing:** En lugar de re-generar todo el audio, usar el endpoint de **Update Chapter Content** para corregir párrafos específicos marcados por el "Duelo de Agentes".
3.  **Fase 3: Silence Injection:** Calcular la duración del video original vs audio traducido y parchear el script con tags `<break>` antes de la conversión final.

---

## 📊 Auditoría Cruzada: Comparativa de Levantamientos (Actualizada)

| Componente | Insight Clave | Herramienta API |
| :--- | :--- | :--- |
| **Checklist Audio QA** | 15 puntos de control. | `auto_convert: true` + Validación de Timestamps. |
| **Dolor de Fernando** | Silencios manuales en Premiere. | Inyección de `<break time="3.0s" />`. |
| **Fábrica Alan/Ramón** | Sincronía boca-audio. | Metadata de `word_timestamps`. |
| **Visión Andrea** | Guion como SSOT. | `apply_text_normalization: "auto"`. |

---
*Este documento integra la capacidad técnica real de la API de ElevenLabs (Feb 2025) con los requerimientos estratégicos del proyecto.*
