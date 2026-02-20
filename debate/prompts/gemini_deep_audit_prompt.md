# DR-AUDIT: Como Mejorar el Pipeline Multi-Idioma QPH — Traduccion, Cultura, Automatizacion y Eficiencia (Exhaustive)

**Modelo objetivo:** Gemini 2.5 Pro (Deep Think / Deep Research)
**Proyecto:** Doge-MultiLang — Pipeline de doblaje automatizado para QuePerroHilo (QPH)
**Fecha:** 2026-02-20 (v1)
**Repo publico:** https://github.com/REBAN-Desarrollo/Doge-MultiLang

---

**Framework:** 6 pilares (4+2) | **Tecnicas PE:** Step-Back, S2A, CoVe-ligera, Self-Refine, Debate
**Esfuerzo:** VERY HIGH (5000-8000 palabras esperadas)
**Output:** Un solo documento Markdown estructurado (`Gemini_Deep_Audit_QPH.md`)

---

## RAZONAMIENTO

QuePerroHilo (QPH) es un canal de animacion infantil (8-15 anos) en espanol mexicano con 353M views anuales y $330K USD de revenue (2025). Actualmente dobla a 27 idiomas usando ElevenLabs, pero tiene problemas criticos:

- **Solo 1 de 27 idiomas** recibe revision humana (ingles). Los otros 26 se publican sin validacion.
- **Cero metricas de calidad** — no se mide WER, MOS, COMET, ni nada.
- **Solo 3 de 27 blacklists** existen (global: 6 palabras, AR: 5, DE: 2). 24 idiomas tienen cero filtro de contenido inapropiado para ninos.
- **CJK pierde -49% AVD** vs el original en espanol (de 4:41 a 2:24). Tamil pierde -58%.
- **Efecto telefono descompuesto**: La cadena ES → EN → 26 idiomas amplifica errores. "Que padre!" → "What a father!" → error en 26 idiomas.
- **Ingreso concentrado**: ES = 58%, EN = 24%, PT = 6%. Top 3 = 88%. Los otros 14 idiomas doblados = ~5%.
- **El multiplicador RPM de DE es x7.2 vs ES** — cada view en aleman vale 7.2x mas que una en espanol.

Un equipo de 4 modelos AI (Claude Opus, Claude Sonnet, Codex/GPT-5, Gemini Swarm) ya debatio estas problematicas y produjo 8 documentos de analisis que estan en el repo. Tu trabajo es auditarlos todos, encontrar lo que se les paso, y **proponer como mejorar cada una de estas areas**: mejor traduccion (AI + humano), blacklists robustas, adaptacion cultural, eficiencia del equipo con ElevenLabs API, custom scripts, y automatizaciones que eleven la calidad de los 27 idiomas.

---

## GOAL

Realizar una **auditoria critica exhaustiva** del repositorio Doge-MultiLang y su carpeta `debate/`, evaluando desde la perspectiva de un **consultor senior de localizacion multimedia + arquitecto de pipelines AI** que ademas conoce profundamente la API de ElevenLabs. El objetivo NO es reducir idiomas — es **mejorar la calidad, automatizacion y eficiencia de todos ellos**.

### Preguntas centrales (12):

1. **Cadena de traduccion — como mejorarla:** El pivot ES → EN → Target amplifica errores. Como se optimiza esta cadena? Para idiomas romanicos (PT, IT, FR) la ruta directa ES → Target seria mejor? Que combinacion de AI translation + revision humana selectiva maximiza calidad sin explotar costos? Que dice la investigacion academica?
2. **ElevenLabs API — exprimir al maximo:** Revisando la documentacion actual de ElevenLabs (febrero 2026), que APIs, features, o capacidades existen que el debate NO menciona y que podrian mejorar calidad o eficiencia? Dubbing Resource API, Forced Alignment, Scribe v2, Eleven v3, Pronunciation Dictionaries, Audio Isolation — como se integran para un pipeline optimo?
3. **Guion como SSOT — workflow de guionismo para doblaje:** El `.docx` se parsea a `dialogue_objects.json`. Es el mejor flujo? Como deberia Andrea escribir guiones para que el pipeline de doblaje funcione mejor? Que formato nativo (JSON/YAML/plantilla) desde guionismo alimenta mejor la automatizacion?
4. **Blacklists y cultura — construir proteccion real:** Solo existen 13 palabras en 3 archivos. Como se escalan blacklists robustas para 27 idiomas? Que herramientas, APIs de content safety, bases de datos culturales existen? Como se construye un "diccionario cultural positivo" que no solo prohiba sino que sugiera adaptaciones correctas?
5. **Calidad TTS por idioma — diagnosticar y mejorar:** CJK pierde -49% AVD, Tamil -58%. Como se diagnostica si es problema de TTS, traduccion, o cultural? Que metricas (MOS, UTMOS, emotion preservation) y que herramientas permiten medir y mejorar la calidad audio por idioma?
6. **QA automatizado — como hacer que funcione:** El sistema de 4 Gates propuesto es la mejor arquitectura? Como se implementa un QA que realmente atrape errores antes de publicar, sin crear un cuello de botella? Que hacen Netflix, Disney, Amazon a escala?
7. **Scripts y automatizacion — que falta construir:** El repo tiene scripts parciales (`prescanner.py`, `dubbing_pipeline.py`, `planchado.py`). Que scripts adicionales necesita el equipo para ser eficiente? Que automatizaciones con la API de ElevenLabs ahorrarian mas tiempo a Saul/Ivan?
8. **Eficiencia del equipo — como trabajan mejor:** Andrea (guiones), Ramon (audio), Saul/Ivan (doblaje), Fernando (post), Daniel (tech). Como se optimiza el flujo de trabajo de CADA persona? Que herramientas, templates, o scripts les harian la vida mas facil?
9. **Consistencia de voz cross-episode:** No existe tracking de voice fingerprints entre episodios. Como se garantiza que Gabriel suene igual en EP001 que en EP050 en cada idioma? Pronunciation Dictionaries de ElevenLabs ayudan? Que mas?
10. **El "Guion Zombie" — resolver la desincronizacion:** Fernando modifica el audio en post-produccion. El guion ya no coincide con el audio final. El Re-Alignment Engine (Whisper + fuzzy match) es la mejor solucion? Hay alternativas mas robustas usando features de ElevenLabs?
11. **Onomatopeyas, expresiones y tono infantil:** "Guau" vs "wan wan" vs "meong meong". Como se automatiza la adaptacion de onomatopeyas, modismos mexicanos, y registro de pronombres (tu vs usted, du vs Sie) para 27 idiomas en contenido de ninos?
12. **Mejora continua y Kaizen:** Como se construye un sistema que aprenda de cada error y mejore automaticamente? El Mem0 propuesto es suficiente? Que usan los pipelines enterprise de localizacion para reducir errores episodio a episodio?

### Deliverables concretos:

- [ ] Matriz de hallazgos: que encontraron bien los 4 modelos vs. que se les paso
- [ ] Propuestas de mejora: minimo 8 ideas concretas para mejorar calidad/eficiencia
- [ ] Reconceptualizacion de la cadena de traduccion: como mejorarla con AI + humano
- [ ] Guia de ElevenLabs API: endpoints, parametros, y features concretos para cada mejora
- [ ] Framework de blacklists y tropicalizacion para 27 idiomas (metodologia + herramientas + JSON ejemplo)
- [ ] Propuesta de workflow de guionismo optimizado para doblaje
- [ ] Scripts y automatizaciones sugeridos: que construir para el equipo
- [ ] Pipeline optimizado end-to-end (diagrama texto)
- [ ] Auto-evaluacion con puntuacion 0-5 por criterio

---

## CONTEXT

### Repositorio ###
```
Repo: https://github.com/REBAN-Desarrollo/Doge-MultiLang
Branch: main (unico)
Estructura:
├── analysis/          # PRD, Wave reports, auditorias
├── debate/            # 8 documentos de debate multi-AI (FOCO PRINCIPAL)
│   ├── Claude_Pipeline_Debate.md        (25KB) — Analisis tecnico primario
│   ├── Claude_Mega_Propuesta_Final.md   (32KB) — Sintesis de 4 opiniones AI
│   ├── Claude_Addendum_Deep_Research.md (43KB) — Gaps, data contracts, tropicalizacion
│   ├── Codex_2026-02-20_Gold_Standard_Unificado.md (latest) — Reglas SSOT + barrido multi-agente
│   ├── Gemini_Swarm_Multi_Opinion.md    (3KB) — SSML injection, PATCH granular
│   ├── Sonnet_Devil_Advocate_Critique.md(32KB) — Critica esceptica, supuestos no verificados
│   ├── Propuesta_Equipo_No_Tecnica.md   (60KB) — Plan para equipo no-tecnico
│   └── Gaps_Pendientes_Deep_Research.md (14KB) — Datos reales YouTube Analytics
├── docs/              # Levantamientos, guias, checklists
├── knowledgebase/     # Blacklists JSON, ElevenLabs API reference (159 archivos)
├── scripts/           # prescanner.py, generate_pptx_equipo.py, planchado.py
└── README.md
```

### Datos clave del negocio ###
```
Canal: QuePerroHilo (QPH) — animacion infantil 8-15 anos, origen Mexico
Views anuales: 353M across 22 audio tracks
Revenue anual: ~$330K USD
Idiomas activos: 27 (doblados via ElevenLabs)
Provider TTS/Dubbing: ElevenLabs (Pro plan)

Revenue por idioma (estimado):
  ES: 58% (~$191K) | EN: 24% (~$79K) | PT: 6% (~$20K)
  DE: 3.9% (~$13K, RPM x7.2) | IT: 3.1% (~$10K)
  FR: 2.2% (~$7K) | Otros 14: ~5% combinado
  Bottom 4 (TA, ZH, MS, FIL): 0.27% (~$890 TOTAL)

AVD (Average View Duration) por cluster:
  ES original: 4:41 (baseline)
  EN master:   3:04 (-35%)
  PT-BR:       3:49 (-19%) — mejor de todos los doblados
  EU (DE/FR):  3:37 (-22%)
  CJK (JA/KO/ZH): 2:24 (-49%) — critico
  Tamil:       1:58 (-58%) — peor de todos

Blacklists actuales:
  blacklist_global.json: 6 palabras (v1.0, dic 2024)
  blacklist_ar.json: 5 palabras
  blacklist_de.json: 2 palabras
  Total: 13 palabras para 27 idiomas. 24 idiomas con cero blacklist.

Bugs confirmados:
  P0: prescanner.py crash cuando prescan_script() retorna None
  P1: WERResult.language siempre defaultea a "ES"
  Structural: dubbing_pipeline.py desconectado de dubbing_service.py
```

### Lo que cada modelo AI aporto al debate ###
```
Claude Opus (Pipeline Debate v3):
  - Descubrio que Phase 1+2 ya existen en AI-Studio (~3,000 lineas)
  - Identifico bugs P0/P1 y la desconexion API/ERP
  - Confirmo que solo Phase 3 (QA Automation) falta

Claude Opus (Mega Propuesta):
  - Sintetizo 4 opiniones en un roadmap de 5 fases (175-224h)
  - Definio arquitectura de 4 Gates
  - Registro de 21 assumptions con niveles de confianza

Claude Opus (Addendum):
  - Diseno data contracts (4 JSONs SSOT)
  - Multi-LLM translation audit (3 jueces + COMET)
  - Tropicalizacion: diccionario cultural positivo
  - Pipeline de verificacion de audio
  - Modulo Kaizen (Mem0 + PDCA)

Codex/GPT-5 (Gold Standard):
  - 5 reglas GS inmutables (SSOT 4 capas, API-first)
  - Prohibicion de re-mapping manual
  - Trazabilidad obligatoria

Gemini Swarm:
  - SSML injection para silencios (<break time="X.Xs"/>)
  - PATCH granular por segmento (no regenerar todo)
  - Sugiere auto_assign_voices (NOTE: no existe en la API real)

Sonnet (Devil's Advocate):
  - PR #71 tiene 14 meses sin merge — premise "Phase 1+2 done" no verificada
  - Costo real ~$46-63/ep, no $1.20 como se estimo
  - 4 supuestos criticos no verificados
  - Levantamientos son interpretaciones de Daniel, no validados por las personas reales
```

### Stack tecnico ###
```
Backend: FastAPI + PostgreSQL (AI-Studio, repo separado)
Frontend: React + 14 componentes de dubbing (AI-Studio)
TTS/Dubbing: ElevenLabs API (Pro plan)
  - Modelos: Flash v2.5 (32 langs, 40K chars), Eleven v3 (70+ langs, 5K chars)
  - APIs usadas: POST /v1/dubbing, GET transcript
  - APIs NO usadas: Dubbing Resource API, Forced Alignment, Scribe v2, PVC
STT: Whisper large-v3 (propuesto, no implementado)
LLM: Gemini Flash (prescanner.py)
Repo Doge-MultiLang: documentacion, blacklists, scripts de analisis
Repo AI-Studio: codigo real del pipeline (separado, no publico)
```

---

## RETURN_FORMAT

Entrega UN SOLO documento Markdown con estas secciones exactas:

### 1. Executive Summary (300-500 palabras)
- Veredicto general del estado del proyecto
- Top 5 hallazgos criticos
- Top 5 recomendaciones de mayor impacto

### 2. Audit Matrix: Lo Que Se Encontro vs. Lo Que Se Les Paso (tabla)
| Area | Lo que los 4 modelos encontraron bien | Lo que se les paso | Impacto |
Minimo 15 filas cubriendo: traduccion, TTS, blacklists, cultura, scripts, API, guionismo, QA, ROI, arquitectura, onomatopeyas, voice consistency, timing, costs, Kaizen

### 3. Reconceptualizacion de la Cadena de Traduccion (800+ palabras)
- Analisis critico del pivot ES → EN → Target
- Evidencia academica sobre pivot translation vs. direct translation
- Propuesta de cadena optima por cluster linguistico
- Cuantificacion del impacto en AVD si se cambia la cadena

### 4. ElevenLabs API: Oportunidades No Exploradas (800+ palabras)
- Features de la API de febrero 2026 que el debate NO menciono
- Dubbing Resource API: que exactamente permite y como cambia el pipeline
- Forced Alignment: impacto real en deteccion de drift
- Scribe v2: entity detection para safety automatico
- Eleven v3 vs Flash v2.5: cuando usar cual
- Pronunciation Dictionaries: impacto en consistencia
- Audio Isolation: preprocesamiento del MP4 de Fernando
- Recomendaciones concretas con endpoints y parametros

### 5. Guion como SSOT: Reconceptualizacion (600+ palabras)
- Critica del flujo actual: .docx → parser → JSON
- Propuesta de workflow de guionismo nativo para doblaje
- Como Andrea deberia escribir guiones para optimizar el pipeline
- Formato ideal del guion (JSON/YAML desde el inicio vs. .docx parseado)

### 6. Framework de Blacklists y Tropicalizacion (800+ palabras)
- Metodologia para crear blacklists en 27 idiomas
- Herramientas y bases de datos existentes (CSAM filters, content safety APIs, cultural sensitivity databases)
- Diccionario cultural positivo: estructura y fuentes
- Onomatopeyas: tabla de adaptacion por idioma
- Registro de formalidad/pronombres por idioma para contenido infantil
- Regulaciones por mercado (COPPA, AVMSD, NRTA, KCSC)

### 7. Pipeline Optimizado (600+ palabras)
- Diagrama de pipeline propuesto (texto/ASCII)
- Diferencias vs. el pipeline de 4 Gates del debate
- Donde se insertan las mejoras nuevas
- Eficiencia de scripts: que sobra, que falta, que refactorizar

### 8. Eficiencia del Equipo: Scripts, Automatizaciones y Workflows (800+ palabras)
- Que scripts custom deberia tener el equipo (con descripcion de cada uno)
- Como Saul/Ivan pueden usar la API de ElevenLabs mas eficientemente
- Que workflow de guionismo optimiza el doblaje (Andrea)
- Que automatizaciones post-produccion ayudan a Fernando
- Templates, herramientas, o integraciones que faltan
- Como se mide y mejora la eficiencia operativa episodio a episodio

### 9. 8+ Mejoras Concretas para Calidad y Eficiencia (1000+ palabras)
- Cada mejora con: descripcion, justificacion, impacto estimado, esfuerzo
- Deben cubrir: traduccion AI + humano, blacklists, cultura, TTS, guionismo, API, scripts, equipo
- Priorizadas por impacto/esfuerzo (quick wins primero, luego mejoras estructurales)
- Se vale proponer combinaciones: ej. "usar Scribe v2 para safety + Pronunciation Dictionaries para consistencia + custom script que los conecte"

### 10. Verified Claims vs. Myths (tabla)
| Claim del debate | Verificacion | Fuente | Veredicto |
Verificar al menos 10 claims clave de los documentos contra la realidad actual.

### 11. Limitations & Low-Confidence Areas (300+ palabras)
- Que no pudo verificar Gemini
- Donde la confianza es baja
- Que requiere investigacion adicional

### 12. Auto-Evaluacion (tabla con puntuacion)
| Criterio | Peso | Score 0-5 | Justificacion |
(Ver seccion CRITERIA abajo)

---

## WARNINGS

- **NO** repitas lo que ya dicen los documentos de debate sin agregar valor nuevo. Tu rol es AUDITAR y MEJORAR, no resumir.
- **NO** inventes datos. Si no tienes un dato, di "no verificado" y marca confianza baja.
- **NO** enfoques en reducir idiomas — el objetivo es MEJORAR la calidad y eficiencia de todos. Si un idioma tiene problemas, la pregunta es "como lo mejoramos", no "lo eliminamos".
- **NO** ignores la realidad financiera: el canal NO esta en break-even. Las recomendaciones deben ser cost-effective.
- **NO** propongas herramientas sin verificar que existan y sean viables en febrero 2026.
- **NO** asumas que PR #71 de AI-Studio funciona — el Devil's Advocate ya lo cuestiono.
- **SI** cita fuentes especificas (papers, docs de API, casos reales de la industria).
- **SI** cruza los datos del repo (blacklists JSONs, KB de ElevenLabs API, levantamientos) con tu conocimiento externo.
- **SI** desafia los supuestos del debate — eres Gemini, una voz independiente, no un rubber stamp.
- **SI** revisa los 159 archivos de `knowledgebase/elevenlabs_api/` para encontrar APIs que el debate no considero.
- **SI** lee los levantamientos en `docs/levantamientos/` para entender los pain points reales del equipo.
- **SI** piensa en como cada miembro del equipo se beneficia de cada mejora propuesta.
- **SI** propone scripts concretos (nombre, funcion, inputs, outputs) que deberian existir.

---

## SCOPE

**Incluido:**
- Todo el contenido del repo https://github.com/REBAN-Desarrollo/Doge-MultiLang
- Los 8 documentos de `debate/` como foco principal de auditoria
- La carpeta `knowledgebase/elevenlabs_api/` como referencia de API
- Los levantamientos en `docs/levantamientos/` como contexto de usuario
- Investigacion web sobre: ElevenLabs API febrero 2026, mejores practicas de doblaje AI, QA multilenguaje enterprise, tropicalizacion de contenido infantil
- Comparacion con practicas de Netflix, Disney, Amazon, Crunchyroll, Funimation

**Excluido:**
- El codigo de AI-Studio (repo privado, no accesible). Solo puedes opinar sobre lo documentado.
- Implementacion de codigo. Solo analisis y recomendaciones.
- Estimacion de tiempos exactos. Usa rangos (ej: "2-4 semanas").

---

## CRITERIA

| Criterio | Peso | Descripcion |
|:---------|:-----|:------------|
| Evidencia nueva | 25% | Presenta datos, papers, o casos que el debate NO tenia |
| Reconceptualizacion | 20% | Propone cambios fundamentales bien argumentados al pipeline |
| Especificidad API | 15% | Menciona endpoints, parametros, y features concretos de ElevenLabs |
| Cultural depth | 15% | Profundidad en analisis de tropicalizacion y blacklists |
| Actionability | 10% | Las recomendaciones son ejecutables con el equipo actual |
| Data integrity | 10% | Cruza datos del repo y no inventa numeros |
| Critical thinking | 5% | Desafia supuestos en vez de confirmarlos |

**Regla:** Si algun criterio puntua < 3/5 en tu auto-evaluacion, refina esa seccion antes de entregar.

---

## TECNICAS AVANZADAS

### Step-Back (Zoom-Out)
Antes de entrar en detalle, responde estas 3 preguntas macro:
1. Si pudieras redisenar el pipeline de doblaje multilenguaje de QPH desde cero con la tecnologia de febrero 2026, como lo harias? (ignorando lo que ya existe)
2. Cual es el verdadero cuello de botella del proyecto: es tecnico, cultural, financiero, o de proceso humano?
3. En la industria de doblaje AI para contenido infantil, donde esta QPH relativo a Netflix, Disney, Amazon, y Crunchyroll?

**Output esperado:** Seccion "Step-Back Analysis" al inicio de tu respuesta.

### S2A (Self-Ask to Assess)
Desafia estos 4 supuestos del debate:
1. "ElevenLabs es el mejor provider para doblaje de 27 idiomas" — hay alternativas mejores en 2026?
2. "El pivot ES → EN es necesario porque ElevenLabs traduce mejor desde ingles" — es esto verificable?
3. "La arquitectura de 4 Gates es suficiente para QA enterprise" — le falta algo critico?
4. "El .docx como SSOT es la realidad que hay que aceptar" — o se puede cambiar el proceso de Andrea?

**Output esperado:** Seccion "Myth-Busting" dentro del documento.

### CoVe-ligera (Verificaciones)
Verifica estos 5 datos especificos contra fuentes externas:
1. El Manual Dub CSV de ElevenLabs esta realmente marcado como "experimental" en febrero 2026?
2. COMET/xCOMET-XL es reference-free o necesita referencia humana?
3. Whisper large-v3 tiene WER < 5% para japones, coreano, y arabe?
4. Que tan preciso es ElevenLabs en idiomas tonales (mandarin, tailandes, vietnamita)?
5. GEMBA-MQM realmente funciona sin traducciones de referencia humana?

**Output esperado:** Seccion "Verified Claims vs. Myths" (seccion 10 del RETURN_FORMAT).

### Self-Refine
Antes de entregar, hazte estas 3 preguntas:
1. Si yo fuera Daniel (el arquitecto del proyecto), encontraria esto util o solo confirmaria lo que ya se?
2. He propuesto al menos 5 ideas que NINGUN documento del debate menciona?
3. Mis recomendaciones de API son lo suficientemente especificas para que alguien las implemente?

**Output esperado:** Seccion "Limitations & Low-Confidence Areas" (seccion 11).

### Debate
Genera un mini-debate interno sobre EL tema mas polarizante del pipeline:

**Posicion A — "AI-first con revision humana selectiva":** La calidad se logra con multiples capas de AI (traduccion LLM + TTS ElevenLabs + QA multi-modelo) y solo intervencion humana en Tier 1. Los 27 idiomas se mejoran con automatizacion, no con mas personas.

**Posicion B — "Humano-first con AI como herramienta":** La AI no puede resolver adaptacion cultural, tono infantil, ni sensibilidad por mercado. Se necesitan revisores nativos al menos para los top 10 idiomas, y la AI es solo aceleradora del trabajo humano.

**Resolucion:** Tu propuesta de equilibrio optimo AI + humano, con evidencia de la industria.

**Output esperado:** Dentro de la seccion 9 (Mejoras Concretas), como contexto para las recomendaciones.

---

## TEORIAS Y FRAMEWORKS

- **MQM (Multidimensional Quality Metrics)** — ISO 21999: Framework estandar para evaluacion de calidad de traduccion
- **GEMBA-MQM** (Kocmi & Federmann, 2023): Evaluacion de traduccion con LLM sin referencia humana
- **xCOMET** (Guerreiro et al., 2024): COMET reference-free con explicaciones
- **UTMOS** (Saeki et al., 2022): Mean Opinion Score automatizado para TTS
- **ECAPA-TDNN** (Desplanques et al., 2020): Speaker verification/embedding extraction
- **Rubric-MQM v2.0** (Dec 2025): Adds auto-post-editing suggestions
- **Pivot Translation Literature** — (Utiyama & Isahara, 2007): pivot translation quality vs direct

## PRACTICAS DE INDUSTRIA

- **Netflix:** $100M/year dubbing budget, 5% human intervention rate even with automation
- **Disney:** Localization of animated content for 40+ markets, cultural adaptation guidelines
- **Amazon (MGM):** AI-assisted dubbing pilots with quality tiers
- **Crunchyroll/Funimation:** Anime dubbing pipelines with fan community QA feedback
- **ZOO Digital / Iyuno-SDI:** Enterprise LSPs with AI-augmented dubbing workflows

## CASOS DE ESTUDIO

1. Netflix "Squid Game" dubbing: how multi-language QA was handled at massive scale
2. Disney+ "Encanto" adaptation: cultural adaptation for Latin American content going global
3. YouTube "Cocomelon": children's content dubbing strategy (27+ languages)
4. ElevenLabs enterprise customers: documented case studies of API-driven dubbing
5. Any documented case of AI-only QA for children's content (regulatory challenges)

---

## AUTO-EVALUACION

Antes de entregar, verifica que tu output cumple con estos 12 criterios. Si alguno puntua < 3/5, mejora esa seccion:

- [ ] 1. Presente al menos 8 mejoras concretas para calidad y eficiencia
- [ ] 2. Mencione al menos 5 endpoints especificos de ElevenLabs API con parametros y como usarlos
- [ ] 3. Incluya evidencia academica (papers, estudios) con autores y anos
- [ ] 4. Proponga un framework concreto de blacklists con estructura JSON ejemplo
- [ ] 5. Analice la cadena de traduccion con datos y proponga como mejorarla (no solo criticarla)
- [ ] 6. Proponga al menos 3 scripts concretos (nombre, funcion, I/O) que el equipo necesita
- [ ] 7. Desafie al menos 3 supuestos que los otros modelos dieron por sentado
- [ ] 8. La tabla de Verified Claims tenga al menos 10 entries
- [ ] 9. Cada mejora diga QUIEN del equipo se beneficia y COMO cambia su trabajo
- [ ] 10. Las recomendaciones sean ejecutables por un equipo de 4-5 personas
- [ ] 11. Proponga workflow de guionismo optimizado para Andrea con ejemplo concreto
- [ ] 12. La auto-evaluacion tenga scores honestos (no todo 5/5)

---

## NOTAS FINALES

**Esfuerzo esperado:** VERY HIGH — Este prompt requiere lectura profunda de un repositorio completo (~215KB de documentos de debate + 159 archivos de API reference + levantamientos). No es un resumen rapido. Es una auditoria de consultor senior.

- **Lee el repo completo.** Usa el link de GitHub. Empieza por `debate/` pero no te detengas ahi. Los `docs/levantamientos/` tienen los pain points reales del equipo. Los `knowledgebase/elevenlabs_api/` tienen la referencia de API actual.
- **Tu voz es independiente.** No eres parte del equipo que produjo el debate. Eres un auditor externo. Tu valor es encontrar lo que 4 modelos AI se les paso.
- **Prioriza lo accionable.** QPH es un startup sin break-even. Cada recomendacion debe considerar costo vs. impacto.
- **Escribe para un equipo mixto.** La audiencia incluye tanto a Daniel (tecnico) como a Alan (negocio) y Andrea (guionismo). Usa lenguaje accesible pero preciso.
- **El objetivo es MEJORAR, no podar.** No te enfoques en eliminar idiomas. Enfocate en como hacer que cada idioma sea mejor: mejor traduccion, mejor TTS, mejor adaptacion cultural, mejor eficiencia del equipo.
- **Piensa en scripts y automatizaciones.** Daniel puede construir herramientas. Que deberia construir primero? Que script con la API de ElevenLabs ahorraria mas tiempo? Que automatizacion de blacklists protege mejor a los ninos?
- **No tengas miedo de contradecir.** Si crees que la arquitectura de 4 Gates es excesiva, o que ElevenLabs no es la mejor opcion, o que el flujo de guionismo esta mal — dilo con evidencia.

---

## INSTRUCCIONES DE EJECUCION

| Run | Modelo | Enfasis | Variacion |
|:-----|:--------|:---------|:-----------|
| Gemini 1 | Gemini 2.5 Pro Deep Think | Mejora integral: traduccion + cultura + API + scripts + equipo | Enfocarse en COMO MEJORAR cada area. ElevenLabs API features no explorados. Scripts que el equipo necesita. Workflow de guionismo. Blacklists robustas. Eficiencia operativa. |

### Contexto adicional para copy-paste (datos compactos)
```
QPH = canal animacion infantil mexicano, 353M views/yr, $330K rev, 27 langs via ElevenLabs
Chain: .docx → prescanner → ElevenLabs (ES→EN→26 langs) → [no QA] → publish
OBJETIVO: Mejorar calidad, automatizacion y eficiencia de los 27 idiomas
EN AVD: 3:04 (-35% vs ES 4:41) | CJK AVD: 2:24 (-49%) | Tamil: 1:58 (-58%)
Blacklists: 13 total words in 3 JSON files. 24 langs = 0 blacklist.
RPM: DE x7.2, EN x2.4, IT x2.9, FR x1.8 (all vs ES baseline)
Revenue: ES 58%, EN 24%, PT 6%, DE 4%, IT 3%, rest ~5%
Bugs: P0 prescanner crash, P1 WER language always ES, structural API/ERP disconnect
Phase 1+2: ~3000 lines in AI-Studio (unverified, PR #71 14mo old). Phase 3: 0%.
Team: Daniel (arch+tech), Andrea (guionismo), Alan (biz), Ramon (audio), Saul/Ivan (dubbing), Gio (QA), Fernando (post-prod)
PREGUNTA CLAVE: Como mejoramos traduccion (AI+humano), blacklists, cultura, TTS, guionismo, y eficiencia del equipo usando ElevenLabs API + custom scripts?
Repo: https://github.com/REBAN-Desarrollo/Doge-MultiLang
```
