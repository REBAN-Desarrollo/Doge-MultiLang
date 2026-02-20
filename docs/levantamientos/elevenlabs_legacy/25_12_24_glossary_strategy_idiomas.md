# 📖 Glossary & Consistency Strategy

> **Objetivo:** Garantizar que nombres propios, marcas y términos clave (Key Terms) NO se traduzcan erróneamente.
> **Impacto:** Calidad de Marca y Coherencia Multi-episodio.

---

## 🛑 El Problema (Inconsistency)

Sin un glosario centralizado ("Termbase"), la IA tiende a traducir o transliterar nombres propios de forma impredecible.

**Ejemplos Reales de Fallo:**
*   `Minecraft Master` → "Maestro de la Minería" (❌ Fatal para branding)
*   `Lesslie` → "Leslie" / "Lesli" (Inconsistencia visual/auditiva)
*   `Marketplace` → "Mercado" (Pierde el contexto de la plataforma específica)
*   `Que Perro Hilo` → "What a Dog Thread" (❌ Traducción literal sin sentido)

---

## 🛠️ Solución Técnica: Dictionary Injection

ElevenLabs y los LLMs de traducción soportan "Listas de No-Traducción" o "Diccionarios Forzados".

### 1. Estructura del Glosario Global (`glossary_global.json`)
```json
{
  "project_terms": [
    { "term": "Minecraft Master", "do_not_translate": true },
    { "term": "Que Perro Hilo", "do_not_translate": true },
    { "term": "Marketplace", "context": "Facebook Marketplace, proper noun" }
  ],
  "characters": [
    { "name": "Sam", "gender": "male", "pronunciation": "/sæm/" },
    { "name": "Elsa", "gender": "female" }
  ]
}
```

### 2. Glosarios Específicos por Idioma (Localization)
A veces *sí* queremos adaptar, pero de forma controlada.

*   **Inglés:** "Que Perro Hilo" → "That Sick Thread" (Adaptación cultural, no literal).
*   **Japonés:** "Sam" → "Samu-kun" (Adaptación fonética + honorífico).

---

## ⚙️ Implementación en Pipeline

1.  **Pre-Procesamiento (Regex Protect):**
    *   Antes de enviar a traducir, el Backend envuelve los términos clave en tokens no traducibles.
    *   `Minecraft Master` → `<dnt>Minecraft Master</dnt>`
2.  **Prompt Injection (LLM Translation):**
    *   Al usar LLMs para re-escritura o traducción:
    *   `"System: Keep the following terms in English: [Minecraft Master, Marketplace]"`
3.  **Pronunciation Dictionary (ElevenLabs):**
    *   Uso del endpoint `/v1/pronunciation-dictionaries` para asegurar que "Lesslie" suene igual en todos los idiomas.

---

## ✅ Checklist de Calidad

- [ ] **Extracción de Entidades:** Script para detectar nombres propios en nuevos guiones automáticamente.
- [ ] **Aprobación de Glosario:** Saúl/Andrea validan cómo se debe decir "X" en Inglés/Japonés una sola vez.
- [ ] **Inyección Automática:** El sistema aplica las reglas sin intervención manual.
