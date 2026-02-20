# SMART: Andrea + Gio — Producto, Blacklists y Cultura

> Andrea lidera producto: blacklists, adaptacion cultural, compliance y contenido. Gio la apoya en QA y auditoria de calidad.

**Fecha:** 2026-02-20 | **Referencia:** Gold Standard Secciones 8, 9, 13

---

## 1. CONTEXTO: DONDE ESTAMOS HOY

### Blacklists

| Metrica | Valor actual |
|:--------|:-------------|
| Blacklists existentes | **3 de 27** (global: 6 palabras, AR: 5, DE: 2) |
| Total palabras en blacklists | **13 palabras** para 27 idiomas |
| Idiomas sin blacklist | **24** (ES, EN, PT, FR, IT, KO, JA, HI, ZH, y 15 mas) |
| Riesgo regulatorio | **CRITICO** — contenido infantil sin filtro en 24 idiomas |

### Regulaciones que aplican (contenido infantil 8-15 anos)

| Region | Regulacion | Riesgo si no se cumple |
|:-------|:-----------|:-----------------------|
| EEUU | COPPA | Multas FTC, demonetizacion YouTube |
| UE | AVMSD Art. 28b | Bloqueo en mercados EU |
| China | NRTA + CAC | Zero tolerance politica/religion |
| Corea | KCSC | Retiro de contenido |
| Japon | BPO | 4,500 onomatopeyas criticas |
| Medio Oriente | Estandares islamicos | Cero contenido con cerdo, romance |
| India | CBFC | Multi-religioso, vaca sagrada |

### Adaptacion cultural

- Existe guia ES-LATAM (`25_12_24_guide_es_latam.md`) pero **cero guias** para otros clusters
- Concepto de PCD (Positive Cultural Dictionary) definido en Gold Standard pero **no implementado**
- Tabla de onomatopeyas y pronombres definida pero **no en formato JSON operativo**
- Cero benchmarking contra canales kids exitosos (CoComelon, Like Nastya)

### QA de contenido (Gio)

- Checklist de 13 pistas de audio definido en Gold Standard Apendice A
- Cero ejecucion de QA en idiomas que no sean EN
- Sin criterios formales de aceptacion/rechazo por idioma

---

## 2. OBJETIVOS SMART

### MACRO: Andrea es duena de que 27 idiomas tengan contenido seguro y culturalmente apropiado para ninos

---

### Objetivo S1: Blacklists completas para 27 idiomas
**S:** Crear blacklists JSON para los 24 idiomas faltantes + expandir las 3 existentes
**M:** 27 archivos `blacklist_XX.json` en `knowledgebase/blacklists/`, cada uno con minimo 20 terminos clasificados (Cat A/B/C)
**A:** LLM genera draft, Andrea/Gio validan con hablantes nativos (Tier 1) o investigacion (Tier 2/3)
**R:** Sin blacklists = riesgo COPPA/AVMSD en contenido infantil
**T:** Semana 8 (Phase 2 del roadmap)

#### Entregables micro (de macro a micro)

| # | Entregable | Responsable | Deadline | Criterio de aceptacion |
|:--|:-----------|:------------|:---------|:-----------------------|
| S1.1 | Definir taxonomia de categorias (A: prohibido siempre, B: prohibido en contexto, C: preferir alternativa) | Andrea | Semana 1 | Documento con definiciones + 3 ejemplos por categoria |
| S1.2 | Draft de blacklists Tier 1 (ES, EN, PT-BR, DE, FR) via LLM | Daniel (research) | Semana 2 | 5 JSONs con minimo 30 terminos cada uno, clasificados A/B/C |
| S1.3 | Validacion de blacklists Tier 1 con hablantes nativos | Andrea + Gio | Semana 4 | Revision por al menos 1 hablante nativo por idioma. Falsos positivos < 10% |
| S1.4 | Draft de blacklists Tier 2 (AR, KO, JA, HI, ZH, IT, RU, TR) | Daniel (research) | Semana 4 | 8 JSONs con minimo 20 terminos cada uno |
| S1.5 | Validacion de blacklists Tier 2 | Andrea + Gio | Semana 6 | Revision por research + cross-check contra regulaciones locales |
| S1.6 | Blacklists Tier 3 (17 idiomas restantes) | Daniel (research) | Semana 6 | 14 JSONs con minimo 15 terminos cada uno |
| S1.7 | Validacion final + merge a `knowledgebase/blacklists/` | Gio | Semana 8 | 27 archivos, formato JSON consistente, cero Cat A omitidos en Tier 1 |

#### Formato JSON esperado por blacklist

```json
{
  "language": "de",
  "version": "1.0",
  "last_updated": "2026-03-XX",
  "validated_by": "nombre_validador",
  "categories": {
    "A": {
      "description": "Prohibido siempre en contenido infantil",
      "terms": ["term1", "term2"]
    },
    "B": {
      "description": "Prohibido en contexto (depende de escena)",
      "terms": ["term3", "term4"]
    },
    "C": {
      "description": "Preferir alternativa (no prohibido, pero suboptimo)",
      "terms": ["term5"],
      "alternatives": {"term5": "alternativa_sugerida"}
    }
  }
}
```

---

### Objetivo S2: Diccionario Cultural Positivo (PCD) operativo
**S:** Crear `cultural_matrix_global.json` con mapeos culturales para 7 categorias en los idiomas Tier 1+2
**M:** JSON con entradas para comida, animales, modismos, exclamaciones, onomatopeyas, neutralizacion religiosa, humor — minimo 10 idiomas
**A:** Andrea conoce el contenido QPH; LLM genera draft por idioma; validacion con research
**R:** Sin PCD, las traducciones preservan mexicanismos que no funcionan en otros mercados
**T:** Semana 10 (Phase 3)

#### Entregables micro

| # | Entregable | Responsable | Deadline | Criterio |
|:--|:-----------|:------------|:---------|:---------|
| S2.1 | Lista de las 20 expresiones/modismos mas usados en guiones QPH recientes | Andrea | Semana 1 | Lista con contexto de uso (escena tipo, personaje, frecuencia) |
| S2.2 | Tabla de onomatopeyas QPH para 10 idiomas (basada en Gold Standard 9.4) | Andrea + Daniel | Semana 3 | Tabla completa: perro, gato, risa, explosion, llanto, asco + 4 mas especificos de QPH |
| S2.3 | Guia de pronombres/formalidad por idioma (basada en Gold Standard 9.3) | Andrea | Semana 3 | Regla clara por personaje x idioma (ej: "Gabriel usa du en DE, tu en FR") |
| S2.4 | Draft PCD JSON para Tier 1 (ES, EN, PT, DE, FR) | Daniel (research) | Semana 5 | JSON con 7 categorias, minimo 10 mapeos por idioma |
| S2.5 | Validacion PCD Tier 1 | Andrea + Gio | Semana 7 | Revision contra 3 episodios reales: cero mapeo incorrecto |
| S2.6 | Expansion PCD a Tier 2 (AR, KO, JA, HI, ZH) | Daniel (research) | Semana 8 | JSON expandido con los 5 idiomas adicionales |
| S2.7 | PCD integrado en `knowledgebase/cultural_mappings/` | Gio | Semana 10 | Archivo mergeado, formato consistente, documentado en MASTER_INDEX |

---

### Objetivo S3: Compliance regulatorio documentado
**S:** Crear documento de compliance por region que mapee regulacion a acciones concretas en el pipeline
**M:** Matriz regulacion x accion x idioma, con status de cumplimiento (cumple/no cumple/parcial)
**A:** Research de regulaciones existentes; Andrea decide nivel de strictness (Gold Standard D-006)
**R:** QPH publica contenido infantil en 27 idiomas — regulaciones son obligatorias, no opcionales
**T:** Semana 6

#### Entregables micro

| # | Entregable | Responsable | Deadline |
|:--|:-----------|:------------|:---------|
| S3.1 | Investigacion COPPA: que aplica especificamente a QPH (canal YouTube, contenido animado) | Daniel (research) | Semana 2 |
| S3.2 | Investigacion AVMSD: idiomas EU afectados y requerimientos | Daniel (research) | Semana 2 |
| S3.3 | Investigacion CJK: NRTA (China), KCSC (Corea), BPO (Japon) | Daniel (research) | Semana 3 |
| S3.4 | Matriz consolidada: regulacion x idioma x estado de cumplimiento | Andrea | Semana 4 |
| S3.5 | Decision D-006 (nivel de strictness): Estricto / Moderado / Permisivo | Andrea | Semana 5 |
| S3.6 | Documento final de compliance integrado al Gold Standard | Gio | Semana 6 |

---

### Objetivo S4 (Gio): QA de contenido operativo
**S:** Implementar proceso de revision de calidad para al menos Tier 1
**M:** Checklist ejecutado en 1 episodio real para 5 idiomas, con reporte de hallazgos
**A:** Basado en checklist de 13 pistas (Gold Standard Apendice A), usando herramientas existentes
**R:** Hoy cero QA en 26/27 idiomas
**T:** Semana 6

#### Entregables micro

| # | Entregable | Responsable | Deadline |
|:--|:-----------|:------------|:---------|
| S4.1 | Adaptar checklist 13 pistas a formato ejecutable (Google Sheet o similar) | Gio | Semana 2 |
| S4.2 | Definir criterios de PASS/FAIL por pista y por tier | Gio + Andrea | Semana 3 |
| S4.3 | Ejecutar checklist en 1 episodio real, idioma EN | Gio | Semana 4 |
| S4.4 | Expandir a Tier 1 completo (ES, EN, PT, DE, FR) en 1 episodio | Gio | Semana 5 |
| S4.5 | Reporte de hallazgos + recomendaciones | Gio | Semana 6 |

---

## 3. DEPENDENCIAS

| Andrea/Gio necesitan de... | Que | Para cuando |
|:---------------------------|:----|:------------|
| **Daniel** | Drafts de blacklists via LLM, research de regulaciones, PCD drafts | Semanas 2-6 |
| **Alan** | Acceso a episodios reales publicados en 27 idiomas para validacion | Semana 3 |
| **Ramon** | Script de validacion automatica de blacklists contra contenido | Semana 8 |
| **Saul/Ivan** | Feedback sobre problemas culturales que ya han detectado | Semana 2 |

## 4. PREGUNTAS ABIERTAS

1. Quien valida las blacklists de idiomas donde nadie del equipo es hablante nativo (Tamil, Filipino, Malay)?
2. Que nivel de strictness quiere Andrea para Gate 1? (Decision D-006: Estricto/Moderado/Permisivo)
3. Existe presupuesto para contratar validadores nativos puntuales para Tier 2/3?
4. Como se manejan las onomatopeyas que ElevenLabs traduce incorrectamente? (bypass manual vs. PCD automatico)
5. Andrea ha recibido quejas de audiencia sobre contenido inapropiado en algun idioma especifico?
