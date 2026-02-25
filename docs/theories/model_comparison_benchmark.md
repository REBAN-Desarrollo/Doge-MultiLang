# 📊 Estrategia de Comparativa: Benchmarking de Modelos (GPT-4o vs Claude 3.5 Sonnet)

Este documento define la metodología para evaluar y comparar el desempeño de diferentes LLMs en las tareas críticas del pipeline de Doge-MultiLang.

---

## 1. Matriz de Especialización (The Roles)

| Tarea | Modelo A (GPT-4o) | Modelo B (Claude 3.5 Sonnet) | Métrica de Éxito |
| :--- | :--- | :--- | :--- |
| **Extracción de Guion** | El "Estructurador". Fuerte en Regex y JSON. | El "Lector de Contexto". Detecta matices de diálogo. | % de hablantes correctamente identificados. |
| **Traducción (Localization)** | El "Diccionario Vivo". Precisión técnica. | El "Director de Doblaje". Ritmo y "acting". | Evaluación de naturalidad (Score 1-5). |
| **Cumplimiento de Blacklist** | Muy estricto con instrucciones negativas. | Más creativo, puede "alucinar" sinónimos. | 0 errores en palabras prohibidas. |
| **Estimación de Timing** | Cálculos matemáticos precisos de sílabas. | Intuición de pausas dramáticas. | Margen de error vs Audio real (ElevenLabs). |

---

## 2. El Proceso de "Duelo de Agentes" (Peer Review)

Para cada bloque de diálogo, implementamos un flujo de auditoría cruzada:

1.  **Generación Paralela:** Ambos modelos reciben el mismo prompt de traducción + contexto.
2.  **Cruce de Críticas (Cross-Examination):**
    - GPT-4o revisa a Claude: "Identifica si Claude usó alguna palabra de la Blacklist".
    - Claude revisa a GPT-4o: "Identifica si la traducción de GPT suena robótica o no cabe en 4 segundos".
3.  **Voto de Calidad (The Tie-Breaker):**
    - Un tercer modelo (o el mismo Gemini CLI) actúa como juez analizando los reportes de error de ambos.
    - Se elige la versión que minimice el riesgo técnico (Blacklist) sin sacrificar el arte (Acting).

---

## 3. Scorecard de Eficiencia (KPIs para el Rebote)

Para determinar qué modelo "gana" en el largo plazo para el proyecto, mediremos:

- **Pass Rate de Blacklist:** ¿Cuántas veces ignoró una instrucción de `blacklist_global.json`?
- **Character Count Accuracy:** Si pedimos una traducción de máx 100 caracteres para que quepa en el video, ¿quién se pasó menos veces?
- **Speaker Consistency:** En un script de 50 páginas, ¿quién mantuvo la voz del personaje "Doge" sin confundirla con "Fernando"?

---

## 4. Implementación del Agente Auditor (Prompt de Referencia)

Para probar esto, usaremos este prompt base:

> "Eres un Auditor de Doblaje. Analiza las siguientes dos propuestas de traducción para el personaje [X]. Compara la duración estimada vs el original (English: 3.5s). Verifica contra la Blacklist [JSON]. Reporta: 1) Ganador por ritmo, 2) Ganador por técnica, 3) Versión final optimizada mezclando ambas."

---

## 5. El Factor ElevenLabs (API Polish)

La comparativa final se hará tras la generación del audio:
- **Modelo Ganador:** El que genere un audio cuya duración se acerque más al target de animación sin necesidad de post-procesado manual agresivo.

---
*Propuesta de Benchmark para iterar con Codex y Claude.*
