# Gaps Pendientes: Analisis Cruzado AVD x Calidad de Dubbing

| Campo | Valor |
|:------|:------|
| **Version** | v1.0 |
| **Fecha** | 2026-02-20 |
| **Complementa** | Mega Propuesta Final v1.0, Addendum v1.1, Propuesta No Tecnica v1.2 |
| **Fuente de datos** | YouTube Analytics Ene-Dic 2025 (DOGE-Andrea-Gamero) |
| **Objetivo** | Documentar gaps no cubiertos y cruzar metricas de audiencia con calidad de dubbing |

> **Este documento identifica 6 areas donde las propuestas existentes tienen cobertura insuficiente o nula, y presenta datos reales de YouTube que justifican la urgencia.**

---

## 1. HALLAZGO CRITICO: AVD por Idioma Revela Posible Problema de Calidad TTS

### 1.1 Datos Reales (YouTube Analytics 2025, VOD)

| Idioma | Views | Watch Time (hrs) | AVD (Average View Duration) | Delta vs ES | Categoria |
|:-------|:------|:-----------------|:---------------------------|:------------|:----------|
| **es** | 142.2M | 11.1M | **4:41** | baseline | Original |
| **es-MX** | 90.0M | 6.5M | **4:22** | -7% | Original (variante) |
| **de** | 2.1M | 131K | **3:40** | -22% | Doblado - Tier 1 |
| **fr** | 4.9M | 299K | **3:38** | -22% | Doblado - Tier 1 |
| **it** | 4.4M | 262K | **3:34** | -24% | Doblado - Tier 2 |
| **ru** | 19.0M | 1.2M | **3:43** | -21% | Doblado - Tier 2 |
| **tr** | 5.4M | 321K | **3:33** | -24% | Doblado - Tier 2 |
| **pt** | 35.5M | 2.3M | **3:49** | -18% | Doblado - Tier 1 |
| **ar** | 3.0M | 170K | **3:23** | -28% | Doblado - Tier 2 |
| **en** | 38.0M | 2.0M | **3:04** | -35% | Doblado - Master |
| **id** | 3.6M | 188K | **3:06** | -34% | Doblado - Tier 3 |
| **hi** | 840K | 41K | **2:56** | -37% | Doblado - Tier 2 |
| **ko** | 629K | 26K | **2:27** | -48% | Doblado - CJK |
| **zh** | 65K | 2.6K | **2:24** | -49% | Doblado - CJK |
| **ja** | 692K | 27K | **2:22** | -49% | Doblado - CJK |
| **fil** | 46K | 1.9K | **2:24** | -49% | Doblado - Tier 3 |
| **ms** | 73K | 3.0K | **2:26** | -48% | Doblado - Tier 3 |
| **ta** | 30K | 995 | **1:58** | -58% | Doblado - Tier 3 |

### 1.2 Patron Identificado

```
AVD POR CLUSTER:
  Original (ES):        4:41  ████████████████████  100%
  Europeos (DE,FR,IT):  3:37  ███████████████       77%
  PT-BR:                3:49  ████████████████      81%  <-- mas cercano a ES (idioma hermano)
  RU/TR:                3:38  ███████████████       77%
  EN (master):          3:04  ████████████          65%  <-- ALERTA: el master pierde 35%
  AR:                   3:23  █████████████         72%
  HI:                   2:56  ████████████          63%
  CJK (JA,KO,ZH):      2:24  ██████████            51%  <-- pierden MITAD del AVD
  SEA (ID,FIL,MS):      2:25  ██████████            51%
  Tamil:                1:58  ████████              42%  <-- peor caso
```

### 1.3 Hipotesis a Investigar

**H1: La calidad del TTS de ElevenLabs varia significativamente por idioma.**
- Los idiomas CJK pierden ~50% de AVD vs el original
- Esto PUEDE ser por: (a) TTS suena robotico, (b) traduccion mala, (c) diferencia cultural en consumo de contenido, (d) competencia local mas fuerte
- Se necesita un benchmark de naturalidad (MOS score) por idioma para aislar el factor TTS

**H2: PT-BR deberia traducirse directo desde ES, no via EN.**
- PT-BR tiene el AVD mas alto entre idiomas doblados (3:49, -18%)
- Portugues comparte mas "ADN linguistico" con espanol que con ingles
- La cadena ES -> EN -> PT-BR introduce una traduccion intermedia innecesaria
- Investigar si ElevenLabs soporta dubbing ES -> PT-BR directo

**H3: El ingles master pierde 35% de AVD — no es solo un problema de traduccion downstream.**
- EN tiene AVD de 3:04 vs ES 4:41
- Si el EN master ya tiene problemas, TODOS los idiomas downstream se ven afectados
- Posibles causas: adaptacion cultural insuficiente, humor mexicano que no traduce, TTS quality en EN

**H4: Los idiomas Tier 3 con AVD < 2:30 podrian no justificar la inversion.**
- Tamil (1:58, 30K views), Filipino (2:24, 46K views), Malay (2:26, 73K views)
- Costo de dubbing vs revenue generado puede ser negativo
- Necesitamos cruzar con revenue por pais para decision D-005 (pausar idiomas)

### 1.4 Revenue por Pais vs AVD (datos clave para ROI)

| Pais | Revenue USD | Views | AVD | Idioma dominante |
|:-----|:-----------|:------|:----|:-----------------|
| US | $123,633 | 23.1M | 3:26 | en |
| MX | $66,410 | 81.0M | 4:44 | es |
| BR | $18,616 | 36.8M | 3:42 | pt |
| DE | $12,853 | 3.1M | 3:36 | de |
| IT | $10,631 | 4.9M | 3:27 | it |
| PE | $9,999 | 23.7M | 4:47 | es |
| CL | $7,883 | 10.4M | 4:31 | es |
| AR | $7,605 | 25.0M | 4:26 | es |
| ES | $7,282 | 3.7M | 3:59 | es |
| FR | $6,853 | 2.5M | 3:30 | fr |
| JP | $1,280 | 830K | 2:32 | ja |
| KR | $611 | 683K | 2:30 | ko |
| RU | $6 | 5.8M | 3:23 | ru (VPN theory: real revenue via US/DE) |
| IN | $465 | 1.8M | 2:50 | hi |
| ID | $748 | 4.7M | 2:54 | id |

**Insight clave:** Los mercados premium (US, DE, FR) tienen AVD 3:26-3:36 en idiomas doblados. Los mercados CJK (JP 2:32, KR 2:30) pierden significativamente mas audiencia. Si la calidad del TTS mejora y sube AVD de JA de 2:22 a 3:30, el revenue de JP podria subir proporcionalmente.

---

## 2. GAP: Translation Chain Optimization (ES -> EN -> Target)

### Estado actual
La regla es: "NUNCA se traduce directamente de ES a otros idiomas; todo pasa por EN primero" (dubbing_saul_ivan.md, linea 22).

### Por que deberia cuestionarse

1. **Error amplification:** Cada error en ES -> EN se multiplica x26 idiomas downstream
2. **Efecto telefono descompuesto confirmado:** La Propuesta No Tecnica (Sec 2, Problema 1) describe exactamente este problema con "Que padre!" -> "What a father!"
3. **PT-BR es idioma hermano de ES:** Comparten ~89% de vocabulario cognado. Traducir ES -> EN -> PT-BR es como traducir espanol a ingles y luego a portugues cuando podrias ir directo
4. **FR, IT tambien son romance:** Comparten raiz latina con ES. La traduccion directa podria preservar mas matices

### Investigacion necesaria

| Pregunta | Como investigar | Esfuerzo |
|:---------|:----------------|:---------|
| ElevenLabs soporta dubbing ES -> PT-BR directo? | Test con API: `source_lang=es`, `target_lang=pt` | 1h |
| La calidad ES -> PT-BR es mejor que ES -> EN -> PT-BR? | Benchmark COMET + WER en 1 episodio piloto | 4h |
| Para cuales idiomas el bypass de EN mejora calidad? | Benchmark ES -> target vs ES -> EN -> target en 5 idiomas | 8h |
| ElevenLabs detecta bien el espanol como source? | Test con `source_lang=es` vs `source_lang=auto` | 1h |

### Propuesta
Agregar al roadmap Phase 1: **Spike de translation chain** (8h). Probar ES -> PT-BR directo y ES -> FR directo. Comparar COMET scores contra la cadena actual via EN.

---

## 3. GAP: TTS Quality Benchmarking por Idioma

### Estado actual
- UTMOS/MOS mencionado como herramienta en el Addendum (Sec 5.1)
- Q8 pregunta sobre "idiomas donde TTS suena robotico" pero no hay respuesta documentada
- Cero datos de naturalidad (MOS score) por idioma
- Cero correlacion con watch time

### Lo que necesitamos

| Benchmark | Herramienta | Que mide | Costo |
|:----------|:------------|:---------|:------|
| MOS por idioma | UTMOS (open source) | Naturalidad 1-5 | $0 |
| Flash v2.5 vs v3 por idioma | Ambos modelos, mismo texto | Cual suena mejor donde | ~$5-10 en API |
| Correlacion MOS vs AVD | Regresion estadistica | Si MOS explica la caida de AVD | $0 |
| Idiomas con MOS < 3.0 | UTMOS en output de ElevenLabs | Candidatos a mejorar o pausar | $0 |

### Hipotesis a validar
- Si MOS de JA/KO/ZH es significativamente menor que MOS de DE/FR/PT, la calidad TTS explica la caida de AVD
- Si MOS es similar para todos, la caida de AVD se explica por factores culturales (y no vale la pena invertir en mejorar TTS para esos idiomas)
- Flash v2.5 vs v3: si v3 mejora MOS en idiomas CJK, justifica el costo adicional para esos idiomas

---

## 4. GAP: Voice Consistency Cross-Episodio

### Estado actual
- ECAPA-TDNN mencionado como herramienta (Addendum Sec 5.1)
- Cosine similarity > 0.75 como umbral
- PERO: no hay diseno de tracking cross-episodio
- No se sabe si ElevenLabs mantiene consistencia de voz entre sesiones de dubbing

### Lo que falta

| Componente | Que es | Por que importa |
|:-----------|:-------|:----------------|
| Voice fingerprint baseline | Embedding ECAPA-TDNN de cada personaje en EP001 | Sin baseline no hay comparacion |
| Drift detection | Comparar embedding de Gabriel en EP001 vs EP050 | Detectar si la voz "cambia" con el tiempo |
| Cross-language consistency | Gabriel en ES vs Gabriel en EN vs Gabriel en JA | Verificar que suena "como la misma persona" |
| ElevenLabs session tracking | Documentar si voice_id produce output identico entre sesiones | Saber si ElevenLabs tiene variance interna |
| Pronunciation Dictionaries | Reglas IPA para "Gabriel", "Valentina" por idioma | Asegurar nombres correctos cross-episodio |

### Propuesta
Agregar a Phase 2: **Voice consistency baseline** (4h). Extraer embeddings ECAPA-TDNN de 3 episodios para 5 personajes principales en 5 idiomas. Establecer el baseline y detectar outliers.

---

## 5. GAP: Adaptacion Cultural por Cluster de Idiomas

### Estado actual
- Addendum tiene: tabla de pronombres, onomatopeyas, diccionario cultural positivo (concepto)
- Existe la guia ES-LATAM (`25_12_24_guide_es_latam.md`)
- NO existen guias equivalentes para EN, PT-BR, FR, AR, JA, KO, DE, etc.
- NO hay benchmarking contra canales kids exitosos

### Canales de referencia a estudiar

| Canal | Idiomas | Audiencia | Que hacen bien |
|:------|:--------|:----------|:---------------|
| CoComelon | 15+ idiomas | 0-5 anos | Doblaje profesional, adaptacion cultural fuerte, canciones re-grabadas |
| ChuChu TV | 10+ idiomas | 2-8 anos | Originan en ingles, adaptan a hindi y otros |
| Like Nastya | 20+ idiomas | 3-8 anos | Contenido visual, menor dependencia de dialogo |
| Vlad and Niki | 20+ idiomas | 4-10 anos | Dubbing profesional, alta retencion cross-idioma |

### Lo que necesitamos

1. **Guias de localizacion por cluster de idioma** (similar a ES-LATAM guide):
   - Cluster CJK (JA, KO, ZH): honorificos, onomatopeyas extensas, humor visual > verbal
   - Cluster Arabe (AR, UR): sensibilidad religiosa, genero gramatical, lectura RTL
   - Cluster Indico (HI, TA, BN): formalidad, referencias familiares, festividades
   - Cluster Europeo (DE, FR, IT): formalidad tu/vous/du, humor, referencias escolares

2. **Que adaptar vs que preservar por mercado:**
   - Humor: adaptar (jokes mexicanos no funcionan en JA)
   - Escuela: adaptar (sistemas educativos diferentes)
   - Comida: adaptar (comida mexicana no es universal)
   - Familia: mayormente preservar (dinamica familiar es universal)
   - Nombres de personajes: PRESERVAR (Gabriel = Gabriel en todos)

---

## 6. GAP: Impacto Financiero del Dubbing — ROI por Idioma

### Datos disponibles para cruzar

Con los datos de DOGE-Andrea-Gamero podemos estimar:

| Idioma | Views VOD | Watch Hours | Revenue estimado* | Costo dubbing/ep | ROI |
|:-------|:----------|:------------|:------------------|:-----------------|:----|
| en | 38.0M | 2.0M | ~$129K (US+GB+CA+AU) | ~$2-3 (API) | **MUY ALTO** |
| pt | 35.5M | 2.3M | ~$19K (BR+PT) | ~$2-3 | **ALTO** |
| de | 2.1M | 131K | ~$14K (DE+AT+CH) | ~$2-3 | **ALTO** |
| fr | 4.9M | 299K | ~$8K (FR+BE+CH) | ~$2-3 | **MEDIO-ALTO** |
| it | 4.4M | 262K | ~$11K (IT) | ~$2-3 | **ALTO** |
| ru | 19.0M | 1.2M | ~$2K+ (RU+KZ+BY+UA, + VPN theory) | ~$2-3 | **MEDIO** (o ALTO si VPN) |
| tr | 5.4M | 321K | ~$2.5K (TR) | ~$2-3 | **MEDIO** |
| ar | 3.0M | 170K | ~$1K (SA+AE+EG+IQ) | ~$2-3 | **BAJO** |
| ja | 692K | 27K | ~$1.3K (JP) | ~$2-3 | **BAJO** |
| ko | 629K | 26K | ~$611 (KR) | ~$2-3 | **MUY BAJO** |
| hi | 840K | 41K | ~$465 (IN) | ~$2-3 | **MUY BAJO** |
| id | 3.6M | 188K | ~$748 (ID) | ~$2-3 | **BAJO** |
| ta | 30K | 995 | ~$10 (estimado) | ~$2-3 | **NEGATIVO** |
| fil | 46K | 1.9K | ~$50 (PH parcial) | ~$2-3 | **NEGATIVO** |
| ms | 73K | 3.0K | ~$616 (MY) | ~$2-3 | **BAJO** |
| zh | 65K | 2.6K | ~$140 (HK+TW+CN) | ~$2-3 | **NEGATIVO** |

*Revenue estimado sumando paises donde ese idioma es dominante. Aproximacion, no exacta.

### Decision D-005 (pausar idiomas) ahora tiene datos

**Candidatos a pausar/evaluar:**
- Tamil (30K views, ~$10 revenue, AVD 1:58) — costo > revenue
- Filipino (46K views, ~$50 revenue, AVD 2:24) — costo > revenue
- Chino/Mandarin (65K views, ~$140 revenue, AVD 2:24) — marginal
- Coreano (629K views, ~$611 revenue, AVD 2:27) — break-even

**Candidatos a invertir mas:**
- Portugues (35.5M views, ~$19K revenue, AVD 3:49) — segundo mercado
- Aleman (2.1M views, ~$14K revenue, AVD 3:40) — RPM premium
- Italiano (4.4M views, ~$11K revenue, AVD 3:34) — sorprendentemente alto

---

## RESUMEN: 6 Gaps y Estado

| # | Gap | Cobertura actual | Prioridad | Esfuerzo estimado |
|:--|:----|:-----------------|:----------|:------------------|
| 1 | AVD x Calidad TTS (MOS benchmark) | 10% | **CRITICA** | 8h (benchmark) |
| 2 | Translation Chain Optimization | 5% | **ALTA** | 8h (spike) |
| 3 | TTS Quality por Idioma (Flash v2.5 vs v3) | 10% | **ALTA** | 4h (test) |
| 4 | Voice Consistency Cross-Episodio | 40% | **MEDIA** | 4h (baseline) |
| 5 | Adaptacion Cultural por Cluster | 35% | **MEDIA** | 16h (guias) |
| 6 | ROI por Idioma con datos reales | 0% -> **DATOS AQUI** | **CRITICA** | 2h (analisis) |

### Para Deep Research en AI Studio (sugerido)

Temas ideales para profundizar:
1. Benchmark Scribe v2 vs Whisper vs Deepgram por familia de idiomas (especialmente Tier 3)
2. ES -> PT-BR directo vs ES -> EN -> PT-BR: test real con COMET
3. MOS score de ElevenLabs Flash v2.5 en CJK — hay datos publicados?
4. Canales kids exitosos (CoComelon, Like Nastya): como manejan dubbing multi-idioma
5. Webhook architecture pattern para 27 idiomas en paralelo

---

*Documento generado cruzando YouTube Analytics 2025 (DOGE-Andrea-Gamero) con propuestas tecnicas (Doge-MultiLang/debate). Los datos de revenue son estimaciones basadas en atribucion geografica, no valores exactos por idioma.*
