# GOLD STANDARD: Propuesta Tecnica Definitiva QPH Multi-Language Dubbing

| Campo | Valor |
|:------|:------|
| **Version** | v1.0 |
| **Fecha** | 2026-02-20 |
| **Secciones** | 1-4 de 12 |
| **Fuentes** | 10 documentos de debate (Claude Pipeline Debate, Mega Propuesta, Addendum, Sonnet Devil's Advocate, Codex Gold Standard, Gemini Multi-Opinion, Propuesta No Tecnica, Gaps Pendientes, Gemini Deep Thinking Audit, Gemini 3.1 PRO Audit) |
| **Datos** | YouTube Analytics Ene-Dic 2025 (DOGE-Andrea-Gamero) |

---

## 1. RESUMEN EJECUTIVO

QPH (QuePerroHilo) produce contenido animado infantil (8-15 anos) que se dobla a 27 idiomas mediante ElevenLabs; genera 353M de visualizaciones anuales y ~$330K USD de revenue, pero opera con cero metricas de calidad automatizadas, cero validacion humana en 26 de 27 idiomas, y blacklists que cubren apenas 13 palabras en 3 idiomas. AI-Studio ya tiene ~3,000 lineas de codigo funcional para Phase 1 (pre-produccion) y Phase 2 (produccion) del pipeline de dubbing, pero un PR de 14 meses sin merge (#71) y el uso persistente de la Web UI por parte del equipo operativo (Saul/Ivan) indican que este codigo nunca se ha usado en produccion. Phase 3 (QA Automation) — la pieza critica que cierra el ciclo de calidad — no existe.

### Top 5 Hallazgos Criticos (consolidados de 10 documentos)

1. **Telefono descompuesto ES->EN->26 idiomas:** La cadena de traduccion pivote destruye semantica infantil (diminutivos, formalidad tu/usted, modismos). Cada error en EN se multiplica x26 downstream. Los 10 documentos identifican este problema.
2. **Ceguera de calidad a escala:** WER no se mide, COMET no se mide, MOS no se mide. El equipo confirma "no, no la medimos" (Q8). Se publican 26 idiomas sin revision alguna.
3. **Revenue hiperconcentrado (HHI 4,002):** ES 58%, EN 24%, PT 6% — Top 3 = 88% del revenue. El Bottom 4 (TA, ZH, MS, FIL) genera 0.27%. Hay idiomas con ROI negativo.
4. **Caida catastrofica de AVD en mercados lejanos:** EN master pierde -35% vs ES (4:41 baseline). CJK pierde -49%. Tamil pierde -58%. Esto indica problemas combinados de TTS, traduccion y adaptacion cultural.
5. **Riesgo regulatorio critico:** 24 de 27 idiomas sin blacklist, contenido infantil, cero Content Safety automatizado. Exposicion directa a COPPA (US), AVMSD (Europa), KCSC (Corea).

### Top 5 Acciones Recomendadas

1. **Verificar estado real del codigo existente** — probar E2E con 1 episodio antes de escribir una linea nueva (3 dias).
2. **Integrar los sistemas desconectados** — conectar dubbing_pipeline.py (WER, prescanner) con dubbing_service.py (API layer) (8h).
3. **Implementar audit_service.py** — Dual STT (Whisper primario + Gemini por excepcion), WER automatizado, tiering por umbral (10h).
4. **Crear blacklists para los 24 idiomas faltantes** — draft via LLM + revision de nativos, priorizar Tier 1 (2-3 dias).
5. **Evaluar traduccion directa ES->Target** para lenguas romance (PT, FR, IT) — spike de 8h con benchmark COMET.

### Metricas de Referencia

- **Revenue:** ES 58%, EN 24%, PT 6%, DE 4%, IT 3%, FR 2%. Top 3 = 88%, Top 6 = 97%.
- **AVD baseline:** ES 4:41. EN -35%. Europeos -22%. CJK -49%. Tamil -58%.
- **RPM multiplicadores vs ES:** DE x7.2, IT x2.9, EN x2.4, FR x2.1.

---

## 2. ESTADO ACTUAL DEL SISTEMA

### 2.1 Codigo existente (AI-Studio, repositorio separado)

Inventario verificado por 6 agentes que leyeron el codigo fuente. Los paths del master plan (dic 2024) no coinciden con los paths reales, pero los archivos existen.

| Componente | Archivo real | Lineas | Status | Notas |
|:-----------|:-------------|:-------|:-------|:------|
| Script Parser | `services/process/docx_parser.py` | 435 | Phase 1 | 3 modos parsing, sanitizador "no."->"no", `to_elevenlabs_content_json()` |
| Modelos Pydantic | `models_dubbing.py` | 125 | Phase 1 | Schemas de datos para dubbing |
| Rutas API | `api/v1/creative/dubbing_routes.py` | 129 | Phase 2 | 11 endpoints REST funcionales |
| Servicio Dubbing | `dubbing_service.py` | 304 | Phase 2 | Logica de negocio, CRUD ElevenLabs |
| Cliente ElevenLabs | `services/model_gateway/providers/elevenlabs.py` | 880 | Phase 2 | Wrapper async: TTS + Dubbing + Studio + STT + Dialogue |
| Alignment Engine | `services/process/alignment_engine.py` | 120 | Phase 2 | Fuzzy match Whisper-to-Manifest. SI EXISTE (verificado) |
| Frontend Dubbing | `apps/studio/src/app/dubbing/` | 14 componentes | Phase 2 | React, 4 modos: Video/Script/Manual/Smart |
| Pipeline ERP | `services/creative/content_erp/dubbing_pipeline.py` | 284 | Phase 2.5 | WER real (Levenshtein), cost estimation, prescanner hook |
| Pre-scanner | `services/creative/content_erp/prescanner.py` | 378 | Phase 2.5 | Heuristicas locales + LLM scan (Gemini Flash), proteccion prompt injection |
| Schema SQL | `dubbing_jobs` + `dubbing_tracks` | -- | Phase 2.5 | Columnas wer_score, cost, status |
| Tests unitarios | `test_dubbing_pipeline.py` | ~30 tests | Phase 2.5 | Cobertura del pipeline ERP |

**Total codigo existente: ~2,675 lineas en 7 archivos backend + 14 componentes frontend + 30 tests.**

### 2.2 WARNING: "Implementado" != "Funcional en produccion"

Este es el hallazgo mas importante del analisis cruzado. Todos los documentos tecnicos (Claude, Codex, ambos Gemini) aceptaron inicialmente que Phase 1+2 estaban "listas". El Devil's Advocate de Sonnet fue el primero en cuestionar esta premisa, y los datos le dan la razon:

- **PR #71 lleva 14 meses sin merge** (abierto dic 2024, hoy feb 2026). No hay evidencia de que haya sido actualizado, revisado o ejecutado.
- **Saul e Ivan siguen usando la Web UI de ElevenLabs directamente** (confirmado en DUBBING_SAUL_IVAN.md, actualizado 2026-02-18: "ElevenLabs API: Objetivo - pendiente migracion").
- **Cero episodios reales procesados** por el pipeline de AI-Studio. Nunca se ejecuto un test end-to-end.
- **La API de ElevenLabs cambio significativamente** entre dic 2024 y feb 2026. Forced Alignment, Dubbing Resource API, Scribe v2 con entity detection — ninguno estaba disponible cuando se escribio el codigo.
- **El Addendum estima confianza en Phase 1+2: ~60-70%.** Solo 3 items del inventario estan verificados directamente en el repo Doge-MultiLang; todo lo de AI-Studio es "reportado por agentes que leyeron codigo" sin ejecucion.

**Conclusion operativa:** Tratar todo el codigo existente como HIPOTESIS CON EVIDENCIA PARCIAL hasta completar un test E2E con un episodio real.

### 2.3 Bugs confirmados

| Severidad | Archivo | Bug | Fix estimado |
|:----------|:--------|:----|:-------------|
| **P0** | `dubbing_pipeline.py` | `run_prescanner_for_job()` crashea si `prescan_script()` retorna None. Guard clause faltante. | 1h |
| **P1** | `dubbing_pipeline.py` | `WERResult.language` siempre default a ES aunque se pase otro idioma. Metricas por idioma inutilizables. | 30min |
| **Estructural** | Pipeline completo | `dubbing_pipeline.py` (ERP: WER, costos, prescanner) y `dubbing_service.py` (API: CRUD, ElevenLabs) estan DESCONECTADOS. Son dos sistemas paralelos que no se comunican. | 8h |
| **Info** | `elevenlabs.py` | No tiene Dubbing Resource API, Forced Alignment, ni Scribe v2. Basado en API de dic 2024. | 6h update |

### 2.4 Phase 3: NO EXISTE

Todo lo siguiente esta disenado en el Anexo A del master plan pero tiene cero lineas de codigo implementadas:

| Componente faltante | Funcion | Impacto de la ausencia |
|:---------------------|:--------|:-----------------------|
| `audit_service.py` | Orquestador QA central: Dual STT, WER automatizado, clasificacion por umbral | QA es 100% manual. Cero metricas. |
| `validate_speakers.py` | Comparar pistas detectadas vs personajes esperados, alertar mismatch | Mezcla de voces pasa inadvertida |
| Dashboard QA | Badges, reportes, filtros por idioma/episodio/severidad | No hay visibilidad del estado de calidad |
| Dual STT integration | Whisper + Gemini/Scribe como segunda opinion | Sin "segunda opinion" para audio generado |
| 24 de 27 blacklists | Diccionarios de terminos prohibidos por idioma | 24 idiomas sin filtro de contenido inapropiado |
| Pronunciation Dictionaries | Reglas IPA por personaje por idioma (.PLS) | Nombres de personajes pronunciados incorrectamente |
| Dubbing Resource API | Control granular de segments post-creacion | Re-render completo por un error de 1 segundo |
| Forced Alignment integration | Timestamps por palabra post-dubbing | Sin deteccion de drift temporal |
| Content Safety layer | Deteccion automatizada de contenido toxico/inapropiado | Riesgo regulatorio en contenido infantil |
| Tropicalizacion automatica | Mappings culturales: onomatopeyas, honorificos, comida, escuela | Contenido suena extranjero en mercados locales |

---

## 3. DATOS DEL NEGOCIO

### 3.1 Revenue por idioma (tabla relativa)

Datos de YouTube Analytics Ene-Dic 2025 (DOGE-Andrea-Gamero). Revenue estimado por agregacion de paises donde cada idioma es dominante. Views y Watch Time corresponden al canal VOD.

| # | Idioma | Rev % | Views % | RPM mult vs ES | AVD | AVD Delta vs ES | Cluster |
|:--|:-------|:------|:--------|:---------------|:----|:----------------|:--------|
| 1 | **es** | 58% | 40.0% | 1.0x (base) | 4:41 | baseline | Original |
| 2 | **en** | 24% | 10.7% | 2.4x | 3:04 | -35% | Doblado - Master |
| 3 | **pt** | 6% | 10.0% | 0.6x | 3:49 | -18% | Doblado - Tier 1 |
| 4 | **de** | 4% | 0.6% | 7.2x | 3:40 | -22% | Doblado - Tier 1 |
| 5 | **it** | 3% | 1.2% | 2.9x | 3:34 | -24% | Doblado - Tier 2 |
| 6 | **fr** | 2% | 1.4% | 2.1x | 3:38 | -22% | Doblado - Tier 1 |
| 7 | **ru** | ~1%* | 5.4% | 0.001x** | 3:43 | -21% | Doblado - Tier 2 |
| 8 | **tr** | ~0.8% | 1.5% | 0.5x | 3:33 | -24% | Doblado - Tier 2 |
| 9 | **ar** | ~0.3% | 0.8% | 0.4x | 3:23 | -28% | Doblado - Tier 2 |
| 10 | **ja** | ~0.4% | 0.2% | 2.1x | 2:22 | -49% | Doblado - CJK |
| 11 | **id** | ~0.2% | 1.0% | 0.2x | 3:06 | -34% | Doblado - Tier 3 |
| 12 | **ko** | ~0.2% | 0.2% | 1.1x | 2:27 | -48% | Doblado - CJK |
| 13 | **hi** | ~0.1% | 0.2% | 0.7x | 2:56 | -37% | Doblado - Tier 2 |
| 14 | **ms** | ~0.02% | 0.02% | 1.0x | 2:26 | -48% | Doblado - Tier 3 |
| 15 | **zh** | ~0.04% | 0.02% | 2.6x | 2:24 | -49% | Doblado - CJK |
| 16 | **fil** | ~0.02% | 0.01% | 1.3x | 2:24 | -49% | Doblado - Tier 3 |
| 17 | **ta** | <0.01% | <0.01% | 0.4x | 1:58 | -58% | Doblado - Tier 3 |

*RU tiene $6 de revenue directo pero 19M views; la teoria VPN sugiere que el revenue real se atribuye a US/DE.
**RPM de RU es anomalo por la distorsion VPN.

### 3.2 AVD por cluster

| Cluster | Idiomas | AVD promedio | Delta vs ES | Rev % combinado |
|:--------|:--------|:-------------|:------------|:----------------|
| **Original** | ES, ES-MX | 4:31 | baseline | 58% |
| **Master** | EN | 3:04 | -35% | 24% |
| **Romance** | PT, FR, IT | 3:40 | -22% | 11% |
| **Europeo otro** | DE, RU, TR | 3:39 | -22% | ~6% |
| **Arabe** | AR | 3:23 | -28% | ~0.3% |
| **Indico** | HI | 2:56 | -37% | ~0.1% |
| **CJK** | JA, KO, ZH | 2:24 | -49% | ~0.6% |
| **SEA** | ID, FIL, MS | 2:25 | -48% | ~0.2% |
| **Dravidico** | TA | 1:58 | -58% | <0.01% |

**Patron critico:** Existe una correlacion fuerte entre distancia linguistica del espanol y caida de AVD. Los idiomas romance pierden ~22%, los CJK pierden ~49%, Tamil pierde ~58%. Esto puede deberse a: (a) degradacion por cadena de traduccion, (b) calidad de TTS variable por idioma, (c) falta de adaptacion cultural, (d) competencia local mas fuerte.

### 3.3 Concentracion de ingresos

- **HHI (Herfindahl-Hirschman Index): 4,002** — altamente concentrado (umbral US DOJ: >2,500 = concentrado).
- **Top 3 idiomas (ES + EN + PT): 88% del revenue.**
- **Top 6 idiomas (+ DE + IT + FR): 97% del revenue.**
- **Bottom 4 (TA, ZH, MS, FIL): 0.27% combinado del revenue.** Costo de dubbing potencialmente mayor que el revenue generado.
- **Alemania es el mercado mas eficiente:** 0.6% de views genera 4% del revenue (RPM x7.2 vs ES). Cada 1% de mejora en AVD de DE tiene mayor impacto financiero que todo el revenue de los Bottom 10 combinados.
- **EN es el mercado mas critico y mas problematico:** Genera 24% del revenue pero su AVD ya pierde 35% vs ES. Como master de la cadena de traduccion, su calidad determina la calidad de los 26 idiomas downstream.

**Implicacion estrategica:** La inversion en QA debe ser asimetrica. Un dolar invertido en mejorar EN, DE o PT tiene 100x mas impacto que el mismo dolar invertido en TA o FIL.

---

## 4. CATALOGO DE PROBLEMAS

Problemas consolidados de los 10 documentos de debate. La columna "Docs" indica cuantos de los 10 documentos mencionan explicitamente el problema.

| ID | Problema | Severidad | Docs (de 10) | Impacto |
|:---|:---------|:----------|:-------------|:--------|
| **A-001** | **Telefono descompuesto:** Cadena ES->EN->26 idiomas amplifica errores. "Que padre!" se traduce como "What a father!" y se propaga. Cada error en EN se multiplica x26. | P0 | 10/10 | Causa raiz de degradacion semantica en todos los idiomas. AVD cae progresivamente con la distancia linguistica. |
| **A-002** | **EN master pierde -35% AVD:** El ingles, que sirve de fuente para 26 idiomas, ya tiene calidad deficiente (AVD 3:04 vs ES 4:41). Posibles causas: adaptacion cultural insuficiente, humor mexicano que no traduce, calidad TTS. | P0 | 7/10 | Si EN esta mal, TODO lo downstream esta peor. Afecta directamente 42% del revenue (EN + todos los idiomas derivados). |
| **B-001** | **Cero metricas de calidad:** WER no se mide, COMET no se mide, MOS no se mide, timing drift no se mide. Q8 confirma: "no, no la medimos". No existe benchmark de naturalidad por idioma. | P0 | 10/10 | Imposible detectar, cuantificar o resolver problemas de calidad. Mejora ciega. |
| **B-002** | **1 de 27 idiomas revisado:** Solo ingles recibe revision humana. 26 idiomas se publican sin ninguna validacion humana ni sintetica. "Pulverizar y rezar." | P0 | 9/10 | Errores en 26 idiomas llegan directamente a millones de ninos. |
| **B-003** | **No existe pipeline de QA automatizado:** audit_service.py, validate_speakers.py, Dashboard QA, Dual STT — todo esta disenado en papel pero tiene cero implementacion. | P1 | 8/10 | Phase 3 completa no existe. Sin ella, el pipeline no puede escalar con calidad. |
| **C-001** | **No hay adaptacion cultural:** Cero guias de localizacion por cluster. Sin tropicalizacion de humor, comida, escuela, honorificos. Onomatopeyas no adaptadas (JA tiene ~4,500 distintas). Sin diccionario cultural positivo implementado. | P1 | 7/10 | Contenido suena extranjero y robotico en mercados locales. Contribuye a caida de AVD en CJK (-49%) y SEA (-48%). |
| **C-002** | **String Length Expansion en CJK/Tamil:** El TTS acelera la voz para encajar textos mas largos (Tamil expande significativamente vs ES). Los modelos previos diagnosticaron mal este problema como "TTS robotico" cuando es parcialmente un problema de timing. | P1 | 2/10 | Diagnostico tecnico erroneo lleva a soluciones ineficaces. Requiere duration constraints y SSML breaks. |
| **D-001** | **3 de 27 blacklists existen (13 palabras total):** Solo global (6 palabras), AR y DE tienen blacklist. Blacklist global tiene 6 terminos. Para contenido infantil visto por millones de ninos, esto es negligencia. | P0 | 9/10 | Riesgo regulatorio critico: COPPA (US), AVMSD (Europa), KCSC (Corea). Posibles strikes, desmonetizacion, bloqueo de canal. |
| **D-002** | **Blacklists no integradas en pipeline:** Incluso las 3 blacklists existentes no estan conectadas al flujo de generacion. prescanner.py tiene heuristicas hardcodeadas pero no consume los JSON de blacklist. | P1 | 5/10 | Las blacklists son archivos muertos. No previenen nada en produccion. |
| **E-001** | **Dos sistemas desconectados (API vs ERP):** dubbing_routes.py + dubbing_service.py (API layer) y dubbing_pipeline.py + prescanner.py (ERP layer) son paralelos. WER computation y cost estimation existen pero no se ejecutan en el flujo principal. | P0 | 6/10 | Funcionalidad critica ya implementada (WER, prescanner) pero inaccesible desde el pipeline de produccion. |
| **E-002** | **PR #71 stale 14 meses:** Abierto dic 2024, sin evidencia de merge, actualizacion o uso. Saul/Ivan confirman que siguen en Web UI. La premisa "solo falta Phase 3" se derrumba si este PR esta roto. | P0 | 4/10 | Toda la estrategia de "extender, no crear" depende de que este codigo funcione. Sin verificacion E2E, es una apuesta. |
| **E-003** | **Manual Dub CSV marcado "experimental":** ElevenLabs marca el CSV manual como "experimental, production use strongly discouraged" (feb 2026). El master plan lo proponia como "Holy Grail". Ya no es viable como pilar del pipeline. | P1 | 4/10 | Requiere pivotar a Dubbing Resource API para control granular de segments. Cambio arquitectonico. |
| **E-004** | **Guion Zombie:** Fernando altera audio en Premiere/Audition (corta silencios, ajusta timing de forma creativa). El .docx de Andrea queda "muerto" — ya no refleja lo que realmente se dice en el video final. El pipeline de dubbing parte de un guion que no coincide con el audio real. | P0 | 8/10 | Desincronizacion fundamental entre texto fuente y audio real. Genera errores de timing, speaker mismatch y traducciones de texto que nunca se pronuncio. |
| **F-001** | **Sin ROI por idioma (parcialmente resuelto):** Hasta el documento Gaps Pendientes, no existia cruce revenue x idioma. Ahora hay datos que muestran que Bottom 4 genera 0.27% del revenue. Decision D-005 (pausar idiomas) sigue pendiente. | P1 | 6/10 | Sin datos de ROI, se mantienen idiomas con costo > revenue. Desperdicio de recursos que podrian ir a Tier 1. |
| **F-002** | **Onomatopeyas no adaptadas por idioma:** El japones tiene ~4,500 onomatopeyas distintas, el aleman usa onomatopeyas diferentes para animales, el arabe tiene expresiones emocionales propias. El contenido infantil depende fuertemente de estas y ninguna se adapta. | P1 | 3/10 | Reduce engagement en audiencias infantiles que esperan onomatopeyas nativas. Contribuye a la caida de AVD en CJK. |
| **F-003** | **Discrepancia numerica de idiomas:** Los documentos alternan entre 16, 17 y 27 idiomas sin definicion canonica. No se puede planear recursos ni tiering sin un numero definitivo. | P2 | 4/10 | Confusion operativa. Se priorizan 17 pero se operan 27. |
| **F-004** | **Levantamientos no validados:** DUBBING_SAUL_IVAN.md (70-80% confianza) y POSTPROD_FERNANDO.md (75-85% confianza) son interpretaciones de Daniel. Los actores reales no los han confirmado. | P2 | 3/10 | Prioridades pueden estar mal ordenadas si los pain points reales difieren de los documentados. |
| **F-005** | **API de ElevenLabs desactualizada en el codigo:** elevenlabs.py (880L) fue escrito para la API de dic 2024. No tiene Dubbing Resource API, Forced Alignment, Scribe v2, Pronunciation Dictionaries ni Audio Isolation. | P1 | 5/10 | Se usa la API mas costosa e ineficiente (endpoint monolitico /v1/dubbing). Re-render completo por errores de 1 segundo. |

### Mapa de severidad

```
P0 (CRITICO - bloquea calidad):
  A-001  Telefono descompuesto
  A-002  EN master -35% AVD
  B-001  Zero quality metrics
  B-002  1/27 idiomas revisado
  D-001  3/27 blacklists (13 palabras)
  E-001  Sistemas desconectados
  E-002  PR #71 stale
  E-004  Guion Zombie

P1 (ALTO - degrada operacion):
  B-003  No QA pipeline
  C-001  No adaptacion cultural
  C-002  String Length Expansion CJK/Tamil
  D-002  Blacklists no integradas
  E-003  Manual Dub CSV experimental
  F-001  Sin ROI por idioma
  F-002  Onomatopeyas no adaptadas
  F-005  API desactualizada en codigo

P2 (MEDIO - genera confusion):
  F-003  Discrepancia numerica idiomas
  F-004  Levantamientos no validados
```

**Distribucion:** 8 problemas P0, 8 problemas P1, 2 problemas P2. El sistema tiene mas problemas criticos que problemas menores, lo cual indica deuda tecnica y operativa acumulada durante los 14 meses de inaccion.

---

*Fin de Secciones 1-4. Secciones 5-12 en documento complementario.*
