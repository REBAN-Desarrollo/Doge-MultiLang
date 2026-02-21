# SMART: Daniel — Deep Research para Todos los Stakeholders

> Daniel provee investigacion profunda (deep research) para desbloquear a Andrea, Alan, Ramon y el proyecto en general. Tambien lidera arquitectura y toma decisiones tecnicas.

**Fecha:** 2026-02-21 | **Referencia:** Gold Standard Secciones 11-12; Gaps Pendientes; Audit Prompt v2; REBAN Destilado

---

## 1. CONTEXTO: QUE NECESITA CADA STAKEHOLDER DE DANIEL

| Stakeholder | Necesidad de research | Urgencia | Ref SMART |
|:------------|:---------------------|:---------|:----------|
| **Andrea + Gio** | Drafts de blacklists (LLM), research regulaciones (COPPA/AVMSD/KCSC), PCD drafts, scorecards QA REBAN | Semanas 2-7 | S1, S2, S3, S4 |
| **Alan** | Contexto tecnico del pipeline para que entienda handoffs | Semana 1 | A1 |
| **Ramon** | Acceso a AI-Studio, API key, code review, guia tecnica | Semanas 1-5 | R1-R4 |
| **Proyecto** | Benchmarks (MOS, COMET, Whisper), spikes tecnicos, decisiones pendientes | Semanas 2-8 | D-001 a D-008 |

---

## 2. OBJETIVOS SMART

### MACRO: Daniel desbloquea a todos los stakeholders con investigacion oportuna y toma las 8 decisiones pendientes del Gold Standard con datos

---

### Objetivo D1: Blacklists — Drafts LLM para 27 idiomas
**S:** Generar drafts de blacklists para 24 idiomas faltantes usando LLMs, clasificados por categoria A/B/C, con fuentes
**M:** 24 archivos JSON draft en formato estandar, listos para validacion por Andrea/Gio
**A:** LLMs pueden generar listas de terminos inapropiados por cultura/idioma con buena precision (~80%)
**R:** Andrea necesita estos drafts para poder validar — no puede crearlos desde cero
**T:** Semana 4 (Tier 1 en Semana 2, Tier 2 en Semana 4, Tier 3 en Semana 6)

#### Entregables

| # | Entregable | Deadline |
|:--|:-----------|:---------|
| D1.1 | Drafts Tier 1: ES, EN, PT-BR, DE, FR (30+ terminos c/u) | Semana 2 |
| D1.2 | Drafts Tier 2: AR, KO, JA, HI, ZH, IT, RU, TR (20+ terminos c/u) | Semana 4 |
| D1.3 | Drafts Tier 3: 14 idiomas restantes (15+ terminos c/u) | Semana 6 |

**Metodo:** Por cada idioma, prompt LLM con:
- Contexto: contenido infantil animado 8-15 anos
- Regulaciones locales relevantes
- Categorias A (prohibido), B (contextual), C (alternativa)
- Seed obligatorio: vocabulario prohibido REBAN + equivalentes locales por idioma
- Mapear 7 anti-patrones narrativos a reglas detectables para QA
- Cross-check con 2+ fuentes cuando sea posible
- Nota: "Onomatopeyas mal traducidas" es error #4 en frecuencia (Q8) — considerar categoria dedicada ademas de A/B/C

---

### Objetivo D2: Research regulatorio (COPPA, AVMSD, CJK)
**S:** Investigar que regulaciones aplican especificamente a QPH y que acciones concretas requieren
**M:** Documento de compliance con regulacion x idioma x accion, mapeado a Gate 0/1/2 y Morbo PG-13, con fuentes verificadas
**A:** Regulaciones son publicas; el reto es interpretarlas para contenido animado doblado con AI
**R:** Andrea necesita esto para decidir nivel de strictness (D-006) y priorizar blacklists. Nota: canciones QPH son instrumentales (confirmado SESIONES) — no requiere research de licencias de letras
**T:** Semana 3

#### Entregables

| # | Entregable | Deadline |
|:--|:-----------|:---------|
| D2.1 | COPPA: que aplica a canal YouTube con contenido animado AI-dubbed | Semana 2 |
| D2.2 | AVMSD Art. 28b: requerimientos para contenido infantil en EU | Semana 2 |
| D2.3 | CJK: NRTA (China), KCSC (Corea), BPO (Japon) — requerimientos especificos | Semana 3 |
| D2.4 | Medio Oriente: sensibilidades islamicas para contenido infantil | Semana 3 |
| D2.5 | Documento consolidado de compliance + mapeo operativo a Gate 0/1/2 | Semana 3 |

---

### Objetivo D3: PCD (Positive Cultural Dictionary) — Drafts
**S:** Generar drafts de mapeos culturales para 7 categorias x 10 idiomas (Tier 1+2)
**M:** JSON con entradas para comida, animales, modismos, exclamaciones, onomatopeyas, religion, humor
**A:** Basado en tabla de onomatopeyas existente (Gold Standard 9.4) + research adicional
**R:** Andrea necesita esto para definir reglas de adaptacion cultural del pipeline
**T:** Semana 5 (Tier 1), Semana 8 (Tier 2)

#### Entregables

| # | Entregable | Deadline |
|:--|:-----------|:---------|
| D3.1 | Expansion tabla onomatopeyas: 15 conceptos x 10 idiomas (nota: BPO Japon tiene 4,500 onomatopeyas criticas — 15 es MVP minimo) | Semana 3 |
| D3.2 | Draft PCD Tier 1 JSON (7 categorias x 5 idiomas) | Semana 5 |
| D3.3 | Draft PCD Tier 2 JSON (7 categorias x 5 idiomas mas) | Semana 8 |

---

### Objetivo D4: Benchmarks tecnicos
**S:** Ejecutar benchmarks de calidad TTS, STT y traduccion para fundamentar decisiones con datos y contrastar contra baseline REBAN
**M:** Resultados cuantitativos: MOS por idioma, WER por STT engine, COMET por cadena de traduccion, y scorecard tecnico REBAN (noise, peaks, sample rate, wpm, clipping, rubrica 5D)
**A:** Herramientas open source disponibles (UTMOS, jiwer, COMET); requiere 1 episodio de prueba
**R:** Sin benchmarks, decisiones D-005 (pausar idiomas) y D-007 (upgrade plan) no tienen fundamento
**T:** Semana 6

#### Entregables

| # | Benchmark | Herramienta | Deadline | Dato que produce |
|:--|:----------|:------------|:---------|:-----------------|
| D4.1 | MOS por idioma (naturalidad TTS) | UTMOS | Semana 4 | Score 1-5 por idioma, correlacion con AVD |
| D4.2 | WER por STT engine x idioma | jiwer + Whisper + Scribe v2 | Semana 4 | Tabla WER por idioma x engine |
| D4.3 | Flash v2.5 vs v3 en CJK | ElevenLabs API | Semana 5 | Cual modelo suena mejor en idiomas problematicos |
| D4.4 | COMET: ES→PT directo vs ES→EN→PT | COMET/xCOMET | Semana 6 | Score de calidad de traduccion por ruta |
| D4.5 | Documento consolidado de benchmarks | — | Semana 6 | Input para decisiones D-005, D-007 |
| D4.6 | Template de scorecard QA REBAN para Tier 1 (5 idiomas) | Sheet/JSON | Semana 6 | Base operativa para S4 (Andrea/Gio) y A4 (Alan) |

---

### Objetivo D5: Resolver las 8 decisiones pendientes del Gold Standard
**S:** Para cada decision pendiente (D-001 a D-008), proveer datos suficientes para que el equipo decida
**M:** 8 decisiones con recomendacion fundamentada, datos de soporte, y decision tomada
**A:** La mayoria se resuelven con los benchmarks y entrevistas ya planeados
**R:** Sin decisiones, el roadmap no puede avanzar mas alla de Phase 0
**T:** Semana 5 (D-001 a D-004), Semana 8 (D-005 a D-008)

#### Timeline de decisiones

| # | Decision | Datos necesarios | Quien decide | Deadline |
|:--|:---------|:-----------------|:-------------|:---------|
| D-001 | Extender AI-Studio o rebuild? | Resultados de fixes R2 de Ramon | Daniel | Semana 3 |
| D-002 | Cuantos idiomas en MVP? | ROI por idioma (D4), benchmarks. Nota: 16 idiomas activos (Q8) vs 27 canales (Gold Standard) — baseline ROI es cero (G16: nunca se ha medido) | Andrea + Daniel | Semana 5 |
| D-003 | CSV vs Resource API? | Spike de Ramon (R3.5) | Daniel | Semana 5 |
| D-004 | Separacion audio (stems)? | Entrevista Fernando (Alan A1.2) | Daniel + Fernando | Semana 3 |
| D-005 | Pausar idiomas bajo ROI? | Benchmarks D4, ROI de Gaps Pendientes | Andrea + Daniel | Semana 8 |
| D-006 | Strictness de safety? | Research regulatorio D2 | Andrea | Semana 5 |
| D-007 | Upgrade plan ElevenLabs? | Spike API de Ramon, limitaciones encontradas | Daniel | Semana 6 |
| D-008 | Timeline migracion guionismo? | Post Phase 2 | Andrea + Daniel | Post Phase 2 |

---

### Objetivo D6: Soporte tecnico continuo a Ramon
**S:** Code review, guia de arquitectura, y desbloqueo tecnico para Ramon durante desarrollo
**M:** PR reviews < 24h, sesiones de pairing cuando sea necesario
**A:** Daniel conoce la arquitectura; Ramon necesita direccion, no micromanagement
**R:** Sin soporte, Ramon no puede avanzar de forma autonoma
**T:** Continuo (Semanas 1-12)

#### Entregables

| # | Entregable | Frecuencia |
|:--|:-----------|:-----------|
| D6.1 | Sesion de onboarding con Ramon (walkthrough del Gold Standard y AI-Studio) | Semana 1 (1 vez) |
| D6.2 | Code review de PRs de Ramon | < 24h por PR |
| D6.3 | Sesion de pairing para fixes complejos | Segun necesidad |
| D6.4 | Documentar decisiones de arquitectura (ADRs) | Por decision |

---

## 3. CALENDARIO CONSOLIDADO

```
Semana 1: Onboarding Ramon (D6.1) + contexto para Alan
Semana 2: Blacklists T1 draft (D1.1) + COPPA/AVMSD (D2.1-D2.2) + Fix bugs con Ramon
Semana 3: CJK regulations (D2.3) + Onomatopeyas (D3.1) + Decision D-001, D-004
Semana 4: Blacklists T2 draft (D1.2) + Benchmarks MOS/WER (D4.1-D4.2)
Semana 5: PCD T1 draft (D3.2) + Flash vs v3 (D4.3) + Decisiones D-002, D-003, D-006
Semana 6: Blacklists T3 draft (D1.3) + COMET benchmark (D4.4) + Scorecard REBAN (D4.6) + Decision D-007
Semana 7-8: PCD T2 draft (D3.3) + Decision D-005
Semana 9+: Soporte continuo, Kaizen loop, research avanzado
```

---

## 4. HERRAMIENTAS DE RESEARCH

### Audit prompt reutilizable
El archivo [`debate/prompts/gemini_deep_audit_prompt.md`](../debate/prompts/gemini_deep_audit_prompt.md) (v2) esta actualizado y es model-agnostic. Usarlo para:
- Auditorias con Gemini, Claude, GPT, o cualquier LLM
- Generar drafts de blacklists por idioma
- Research de regulaciones por mercado
- Benchmarking contra industria (Netflix, Disney, CoComelon)

### Datos disponibles en el repo

| Dato | Ubicacion |
|:-----|:----------|
| YouTube Analytics (AVD, revenue, ROI) | `docs/Gaps_Pendientes_Deep_Research.md` |
| ElevenLabs API reference (158 docs) | `knowledgebase/elevenlabs_api/` |
| Blacklists existentes (3 JSONs) | `knowledgebase/blacklists/` |
| Levantamientos equipo (52 docs) | `docs/levantamientos/` |
| Destilado 04_EVIDENCE (datos operativos dubbing) | `docs/levantamientos/04_EVIDENCE_destilado_multiidioma.md` |
| Destilado REBAN (ADN narrativo, audio specs, gates, checklist 12 puntos) | `docs/levantamientos/REBAN_destilado_multiidioma.md` |
| KPIs dubbing (TBD) | KPI-27 (throughput), KPI-28 (correccion 0.5-4h/ep) — sin baseline |
| Codigo existente AI-Studio | Repo AI-Studio (privado) |

### Modelos recomendados por tipo de research

| Tipo | Modelo | Razon |
|:-----|:-------|:------|
| Blacklists (draft) | Claude Opus / GPT-4o | Mejor en sensibilidad cultural |
| Regulaciones | Gemini Deep Research | Acceso a web, fuentes legales |
| Benchmarks (MOS, WER) | Local (UTMOS, jiwer) | Datos propios, no se comparten |
| PCD cultural | Claude + GPT (dual) | Cross-check entre modelos |
| Auditorias generales | Audit prompt v2 con cualquier modelo | Template estandarizado |

---

## 5. DEPENDENCIAS

| Daniel necesita de... | Que | Para cuando |
|:---------------------|:----|:------------|
| **Andrea** | Lista de 20 expresiones/modismos QPH (para PCD) | Semana 1 |
| **Andrea** | Decision D-006 (strictness) para calibrar blacklists | Semana 5 |
| **Alan** | 1 episodio real (MP4 + .docx) para benchmarks | Semana 3 |
| **Alan** | Resultados de entrevistas Fernando/Saul-Ivan | Semana 3 |
| **Ramon** | Resultados de fixes y spikes API para decisiones | Semanas 3-5 |
| **Equipo** | Tiempo para reuniones de decision (D-001 a D-008) | Semanas 3-8 |
