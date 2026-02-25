# Post-Procesado de Knowledgebase RAW

Documentación del script `transform.py` que procesa el JSON crudo de Apify.

---

## Uso

```bash
python transform.py
```

**Input:** `ElevenLabs Knowledgebase_RAW.json`  
**Output:** `ElevenLabs Docs.json` + `ElevenLabs Helper.json`

---

## Pipeline de Transformación

### 1. Limpieza de Markdown
Elimina ruido de UI:
- Tips de navegación ("Press ⌘+K")
- Encuestas ("Was this helpful?")
- Artículos relacionados genéricos
- Saltos de línea excesivos

### 2. Enriquecimiento de Metadata

| Campo | Origen | Uso |
|:---|:---|:---|
| `description` | `metadata.description` | Resumen para contexto |
| `crawledAt` | Raíz del registro | Frescura de datos |
| `category` | Derivado de URL | Filtrado de búsqueda |

### 3. Auditoría de Calidad (50 caracteres)
Filtra registros con menos de **50 caracteres** después de limpiar.

**¿Por qué 50?** Es el umbral validado empíricamente:
- < 50 chars = Solo título sin contenido real (ej: `# Introduction`)
- ≥ 50 chars = Tiene al menos una oración de información

### 4. Partición (Split)

| URL contiene | Destino |
|:---|:---|
| `elevenlabs.io/docs` | `Docs.json` |
| `help.elevenlabs.io` | `Helper.json` |

### 5. Inyección (Inject)
Artículos del Helper que son técnicos **se copian también a Docs**.

**Criterios de inyección:**
- Título contiene keywords: `api`, `sdk`, `python`, `websocket`, `endpoint`, etc.
- Contenido tiene bloques de código (` ``` `)

**Marcador:** Los inyectados tienen `"category": "Technical Support"`.

---

## Estructura de Output

```json
{
  "url": "https://...",
  "title": "How to use API Keys",
  "description": "Learn how to generate and revoke API keys.",
  "crawledAt": "2024-12-27T10:00:00.000Z",
  "category": "Technical Support",
  "markdown": "# Content here..."
}
```

---

## Configuración

Ajustable en `transform.py`:

| Variable | Default | Descripción |
|:---|:---|:---|
| `MIN_CONTENT_LENGTH` | 50 | Umbral mínimo de caracteres |
| `TECH_KEYWORDS` | [...] | Keywords para detección técnica |
