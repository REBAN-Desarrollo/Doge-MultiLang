# 🏆 Gold Standard: Doge-MultiLang Workflow (v1.0)

Este documento establece el estándar de excelencia para la traducción, doblaje y animación de los proyectos de Que Perro Hilo, unificando los levantamientos históricos de Enero con la tecnología de ElevenLabs Studio 2025.

---

## 💎 1. El Guion: "Absolute SSOT" (Andrea's Standard)
**Regla de Oro:** Ningún audio se genera sin un guion "planchado" y bloqueado.
- **Formato:** `.docx` con estilos de párrafo definidos (Hablante: Diálogo).
- **Validación:** El script debe pasar el `11_ANDREA_GUION_CHECKLIST.md` (0 errores de ortografía, nombres consistentes, tono Doge).
- **Extracción:** Uso estricto de `planchado.py` para separar diálogos de metadatos de escena.

---

## 🎭 2. La Voz: "Kid-Friendly Doge" (Saúl's Standard)
**Regla de Oro:** El tono debe resonar con niños de 6 a 12 años (según `25_12_24_persona_kids_6_12.md`).
- **Localización:** No es traducción literal; es adaptación cultural (ES-LATAM) usando la guía `25_12_24_guide_es_latam.md`.
- **Auditoría de Blacklist:** Cumplimiento del 100% de las `blacklist_*.json` (Global, AR, DE). Cualquier palabra prohibida detiene el pipeline.
- **Consistencia:** Las voces deben mantenerse idénticas a través de los episodios (Voice ID Whitelist).

---

## ⏱️ 3. El Timing: "The Fernando Delta" (Fernando's Standard)
**Regla de Oro:** El audio debe encajar en el video original sin intervención manual.
- **Sincronización:** Extracción de `word_timestamps` estructurados de la API de ElevenLabs.
- **Silencios Automáticos:** Inyección de tags SSML `<break time="X.Xs" />` basados en la duración del video de referencia (Jan 2026 Timing Rules).
- **Compresión Creativa:** Si el audio traducido excede el tiempo disponible en el video, el Auditor AI (Claude) debe re-escribir el diálogo para acortarlo sin perder el sentido.

---

## 🤖 4. Auditoría Multi-Agente: "The Mirror Gate"
**Regla de Oro:** Todo bloque de diálogo debe ser auditado por dos modelos de IA antes de ser "planchado" final.
- **Agente A (Estructurador):** Valida precisión técnica y cumplimiento de Blacklist.
- **Agente B (Crítico Creativo):** Valida naturalidad, tono para niños y ritmo de actuación.
- **Gatekeeper (Gemini):** Compara ambas opiniones y genera el reporte final de aprobación (`26_02_18_checklist_audio_qa.md`).

---

## 🛠️ 5. Ejecución Técnica (API Studio 2025)
- **Motor:** `Eleven Flash v2.5` para latencia mínima y costo eficiente.
- **Gestión:** Uso de `v1/studio/projects` y `PATCH /v1/studio/projects/{id}/chapters/{id}` para iteración rápida.
- **Automatización:** Los `voice_ids` se asignan dinámicamente mediante `auto_assign_voices: "alpha"`.

---
*Este es el Estándar de Oro. Cualquier desviación de este proceso se considera un riesgo técnico para el proyecto.*
