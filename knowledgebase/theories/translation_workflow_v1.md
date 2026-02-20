# 🧠 Doge-MultiLang: Workflow Optimization & Translation Theories (v1)

Este documento centraliza las estrategias para mejorar la eficiencia del pipeline de traducción y animación, sirviendo como base de rebote entre **Gemini**, **Codex** y **Claude**.

---

## 1. El Dilema del Hablante: ¿Quién habla realmente?
**Problema:** Errores de asignación de voz cuando el guion (SSOT) tiene inconsistencias.

### Teoría de la "Identidad Blindada" (Whitelist + Context Agent)
- **Extracción Rigurosa:** Usar `python-docx` no solo para leer texto, sino para identificar estilos de párrafo. Los nombres de los personajes suelen estar en Negrita o Mayúsculas.
- **Detección por Whitelist:** Comparar cada fragmento extraído con una `whitelist` de personajes del proyecto.
- **Agente de Rescate (Zombie Recovery):** Si el parser falla (ej. "Doge dice: ..."), un agente de IA analiza las 3 líneas anteriores para determinar quién es el hablante más probable por contexto de diálogo.

---

## 2. El Arte del Silencio: Proceso "Fernando"
**Problema:** Los tiempos de habla en español (u otros idiomas) suelen ser más largos o cortos que el inglés original, rompiendo la sincronía.

### Teoría del "Buffer de Fernando" (Delta Timing)
- **Cálculo de Delta:** `Delta = (Tiempo_Video_Original) - (Duración_Audio_Generado)`.
- **Inyección Automática:** 
    - Si el audio es más corto: El sistema inyecta `Delta/2` de silencio al inicio y al final (centrado), o sigue el patrón de "Fernando" de dejar aire al final para la transición.
    - Si el audio es más largo: El sistema marca una **Alerta de Compresión** para que el Agente Traductor (Claude) recorte caracteres sin perder el sentido.
- **API vs UI:** Usar la API de ElevenLabs para consultar `timestamps` por palabra y ajustar el `stability` para acelerar/ralentizar la voz automáticamente.

---

## 3. Auditoría Dual: GPT-4o + Claude 3.5 Sonnet
**Problema:** Las traducciones automáticas pierden el "alma" o el ritmo necesario para la animación.

### Teoría del "Espejo Crítico"
- **Paso 1 (GPT-4o - El Traductor Técnico):** Traduce basándose estrictamente en las `blacklists` y el glosario. Prioriza precisión gramatical.
- **Paso 2 (Claude 3.5 - El Director de Doblaje):** Recibe la traducción y el contexto de la escena. Su tarea es "actuar" el texto:
    - ¿Suena natural para un doblaje?
    - ¿El ritmo coincide con la emoción?
    - ¿Cabe en el tiempo asignado?
- **Paso 3 (Consenso):** Si Claude sugiere cambios mayores al 20%, se pide una tercera opinión o se marca para revisión humana.

---

## 4. Eficiencia vía API: Saltando la Web UI
**Problema:** Editar en la Web UI de ElevenLabs es lento para proyectos masivos.

### Teoría del "Proyecto Espejo"
- **Sincronización:** Crear el proyecto mediante la API de ElevenLabs (`/projects`).
- **Batch Polishing:** En lugar de corregir uno por uno en la web, el script detecta errores de pronunciación comunes y lanza un `patch` masivo a todos los párrafos afectados usando el endpoint de edición de párrafos.
- **Preview de Audio:** Generar previews de baja calidad (o texto-a-voz rápido) antes de gastar caracteres en la voz final para validar el timing.

---

## 5. Cierre de Diálogo y Transiciones
**Problema:** El audio se corta abruptamente o "sangra" hacia el siguiente clip.

### Teoría de la "Cola de Audio"
- **Puntos de Corte:** Usar la puntuación final del script (..., !, ?) para definir el `decay` del audio.
- **Metadata de Cierre:** El JSONL final debe incluir un tag `end_of_dialogue: true` para que el `Doge-Animator` sepa exactamente cuándo cerrar la boca del personaje, independientemente de la duración del archivo de audio.

---

*Documento creado para rebote y discusión.*
