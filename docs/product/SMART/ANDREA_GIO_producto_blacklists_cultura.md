# SMART: Andrea + Gio — Producto, Blacklists y Cultura

> Andrea lidera producto: blacklists, adaptacion cultural, compliance y contenido. Gio la apoya en QA y auditoria de calidad.

**Fecha:** 2026-02-21 | **Referencia:** Gold Standard Secciones 8, 9, 13 + REBAN Destilado (Secciones 1, 3, 4, 5)

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
- "Onomatopeyas mal traducidas" es error #4 en frecuencia reportada por Saul/Ivan (Q8)

### QA de contenido (Gio)

- Checklist de 13 pistas de audio definido en Gold Standard Apendice A
- Solo EN recibe QA formal; Andrea revisa 2-3 idiomas intuitivamente (EN, JA) de las 13 pistas
- Criterios de rechazo de audio existen (desincronizacion, ruido, distorsion, volumen, glitches) pero **no hay criterios para contenido linguistico/cultural**
- Proceso actual de blacklists: **resuelven caso por caso** cuando detectan un problema (Gap G18)

### Delta REBAN (nuevo baseline operativo)

- QA debe preservar ADN QPH en 27 idiomas: voz confesional, frases cortas y ritmo rapido
- 7 anti-patrones invalidan traduccion (literaturizacion, moralizacion, tecnicismos, etc.)
- Vocabulario prohibido global (ej: autoestima, trauma, disonancia) debe reemplazarse por lenguaje concreto
- Timing narrativo obligatorio: detonador cada 20-40 segundos
- Baseline audio para dubbing/TTS: noise <-40 dB, peaks -6/-3 dB, 48 kHz, 140-160 wpm, cero clipping
- Umbrales minimos por idioma: rubrica vocal 5D >= 4.0 y checklist narrativo >= 10/12
- Safety operativo: framework Morbo PG-13 + sistema Gate 0/1/2 pre-publicacion

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
| S1.1 | Definir taxonomia de categorias (A: prohibido siempre, B: prohibido en contexto, C: preferir alternativa) | Andrea | Semana 1 | Documento con definiciones + 3 ejemplos por categoria + seed list global REBAN |
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

### Objetivo S4 (Gio): QA de contenido + narrativa operativo
**S:** Implementar proceso de revision para Tier 1 integrando audio, narrativa y safety editorial por idioma
**M:** 1 episodio real evaluado en 5 idiomas con scorecard por idioma: audio tecnico REBAN, rubrica vocal 5D >= 4.0, checklist narrativo >= 10/12, y cero violaciones Cat A/Gate 1
**A:** Basado en checklist de 13 pistas (Gold Standard Apendice A) + baseline REBAN (ADN narrativo, audio specs, Morbo PG-13 y gates)
**R:** Hoy solo EN tiene QA formal (15/16 idiomas activos sin revision linguistica)
**T:** Semana 7

#### Entregables micro

| # | Entregable | Responsable | Deadline |
|:--|:-----------|:------------|:---------|
| S4.1 | Unificar checklist audio (13 pistas) + checklist narrativo (12 puntos) en scorecard ejecutable | Gio | Semana 2 |
| S4.2 | Definir PASS/FAIL por pista con umbrales REBAN (noise, peaks, wpm, rubrica 5D >= 4.0, narrativa >=10/12) | Gio + Andrea | Semana 3 |
| S4.3 | Agregar validaciones editoriales: 7 anti-patrones, vocabulario prohibido global y Morbo PG-13 | Andrea + Gio | Semana 3 |
| S4.4 | Ejecutar scorecard en 1 episodio real, idioma EN | Gio | Semana 4 |
| S4.5 | Expandir a Tier 1 completo (ES, EN, PT, DE, FR) en 1 episodio | Gio | Semana 5 |
| S4.6 | Piloto Gate 2: publicacion no listada 2-6h + triage de claims | Alan + Gio | Semana 6 |
| S4.7 | Reporte final de hallazgos + backlog de correcciones por idioma | Gio | Semana 7 |

---

## 3. DEPENDENCIAS

| Andrea/Gio necesitan de... | Que | Para cuando |
|:---------------------------|:----|:------------|
| **Daniel** | Drafts de blacklists via LLM, research de regulaciones, PCD drafts | Semanas 2-6 |
| **Alan** | Acceso a episodios reales publicados en 27 idiomas para validacion | Semana 3 |
| **Ramon** | Script de validacion automatica de blacklists contra contenido | Semana 8 |
| **Saul/Ivan** | Feedback sobre problemas culturales que ya han detectado | Semana 2 |

**Riesgo de proveedor:** ElevenLabs opera sin contrato ni SLA (suscripcion pagada). No existe Plan B. 27 idiomas dependen de un solo vendor. Monday.com no tiene tracking de dubbing (Area 09 aislada).

## 4. PREGUNTAS ABIERTAS

1. Quien valida las blacklists de idiomas donde nadie del equipo es hablante nativo (Tamil, Filipino, Malay)?
2. Que nivel de strictness quiere Andrea para Gate 1? (Decision D-006: Estricto/Moderado/Permisivo)
3. Existe presupuesto para contratar validadores nativos puntuales para Tier 2/3?
4. Como se manejan las onomatopeyas que ElevenLabs traduce incorrectamente? (bypass manual vs. PCD automatico)
5. Andrea ha recibido quejas de audiencia sobre contenido inapropiado en algun idioma especifico?
