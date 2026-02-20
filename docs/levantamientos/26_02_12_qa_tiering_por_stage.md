# 10 CORE: Sistema QA Tiering - Pipeline de Validacion Multi-Idioma

**Version:** 1.0 | **Fecha:** 2026-02-18
**Owner:** PMO (Iris) + Saul (Dubbing)
**Fuentes:** `04_EVIDENCE/QUESTIONNAIRES/LEGACY_ELEVENLABS_DIC2025/NEW_FEATURES_UNIQUE/VALIDATION_FLOW_TIERING.md`

---

## 1. Proposito

Definir el sistema de calidad (QA) por niveles (tiers) que rige la validacion de contenido doblado en todos los idiomas del pipeline QPH. Establece que metodo de revision aplica a cada idioma, cuales son los checkpoints obligatorios en cada etapa del proceso, y cuanto cuesta operar este pipeline de calidad.

El principio rector es: **calidad > costo** en la etapa actual. El costo adicional de ~$1-2 por video es el trade-off aceptado para garantizar que ningun contenido inapropiado llegue a la audiencia objetivo (ninos 8-15 anos).

---

## 2. Clasificacion de Idiomas por Tier

### 2.1 Tres Niveles de Validacion

| Tier | Nombre | Metodo Principal | Idiomas |
|:-----|:-------|:-----------------|:--------|
| **Tier 1** | Validacion Maxima | 100% revision humana | Ingles (EN), Portugues (PT-BR), Frances (FR), Aleman (DE) |
| **Tier 2** | Validacion Media | Muestreo inteligente (~30%) | Arabe (AR), Coreano (KO), Japones (JA), Hindi (HI), Chino Mandarin (ZH) |
| **Tier 3** | Validacion Minima | Solo automatico | Filipino (FIL), Indonesio (ID), Italiano (IT), Ruso (RU), Turco (TR), Tamil (TA), Malayo (MS) |

### 2.2 Justificacion del Tiering

Los idiomas Tier 1 son los mercados de mayor impacto comercial y donde el equipo tiene capacidad de revision interna (Saul/Ivan). Los idiomas Tier 2 tienen alta audiencia potencial pero menor capacidad de revision nativa interna. Los idiomas Tier 3 se validan principalmente con metricas automaticas; cualquier flag escala a humano.

---

## 3. Checkpoints por Tier

### 3.1 Tier 1 - Validacion Maxima

**Idiomas:** EN, PT-BR, FR, DE

| Checkpoint | Metodo | Responsable |
|:-----------|:-------|:------------|
| Pre-flight ES (guion origen) | LLM Judge + Keywords | Automatico |
| Contraste ES detectado vs original | Diff automatico | Automatico |
| Traduccion ES → EN | Revision linea por linea | Saul / Ivan |
| Preview EN audio (escucha completa) | Auditiva | Saul / Ivan |
| Traduccion EN → {PT, FR, DE} | Muestreo 30% + metricas COMET/BERTScore | Automatico + Humano |
| Preview {PT, FR, DE} audio | Muestreo critico (intro, climax, final) | Revisor nativo o bilingue |

### 3.2 Tier 2 - Validacion Media

**Idiomas:** AR, KO, JA, HI, ZH

| Checkpoint | Metodo | Responsable |
|:-----------|:-------|:------------|
| Pre-flight ES (guion origen) | LLM Judge + Keywords | Automatico |
| Contraste ES detectado vs original | Diff automatico | Automatico |
| Traduccion EN → X | Metricas automaticas (COMET, BERTScore) | Automatico |
| Preview audio | Solo segmentos flaggeados por metricas | Automatico + Humano si flaggeado |
| ASR post-dubbing | WER check automatico | Automatico |

### 3.3 Tier 3 - Validacion Minima

**Idiomas:** FIL, ID, IT, RU, TR, TA, MS

| Checkpoint | Metodo | Responsable |
|:-----------|:-------|:------------|
| Pre-flight ES (guion origen) | LLM Judge + Keywords | Automatico |
| Traduccion EN → X | Metricas automaticas | Automatico |
| ASR post-dubbing | WER check | Automatico |
| Flag para revision | Solo si metricas < umbral definido | Escalado a humano |

---

## 4. Pipeline de Validacion: Cuatro Etapas

El pipeline tiene 4 etapas que aplican a TODOS los tiers, con diferente profundidad de revision segun el nivel.

### 4.1 Etapa INGESTA - Pre-flight Validator

```
ENTRADA:  Guion ES (Espanol LATAM Neutro)
PROCESO:
  1. Keyword scan contra blocklist global (ver 05_CORE_CONTENT_MODERATION.md)
  2. LLM Judge: Safety check Categoria A (prohibido absoluto) y B (suavizar)
  3. Neutralizacion: Mexicanismos -> Espanol global
  4. Timing estimation: deteccion de frases muy largas para la escena
SALIDA:
  - Guion neutralizado
  - Changelog de cambios realizados
  - Flags de riesgo (si los hay)
ACCION:   Si flags Categoria A -> revision humana obligatoria antes de continuar
```

### 4.2 Etapa TRADUCCION - Contraste Detectado vs Original

```
ENTRADA:
  - Guion ES original (texto)
  - Texto detectado por ElevenLabs (ASR interno del sistema)
PROCESO:
  1. Diff linea por linea entre original y detectado
  2. Deteccion de onomatopeyas perdidas ("Ay!", "Pum!")
  3. Deteccion de numeros/palabras malinterpretadas (ej. "no" -> "number")
  4. Deteccion de pronombres incorrectos
SALIDA:
  - Reporte de discrepancias
  - Texto corregido listo para usar en traduccion
ACCION:   Si discrepancias > umbral -> revision humana obligatoria
```

### 4.3 Etapa TRADUCCION - Validacion ES a EN

```
ENTRADA:  Texto ES + Traduccion EN (generada por ElevenLabs)
PROCESO:
  1. LLM Judge: verificacion de intencion y tono apropiado para 8-15 anos
  2. COMET score (fidelidad semantica)
  3. Keyword check: deteccion de groserías que no estaban en ES
  4. Timing check: EN no debe ser >20% mas largo o corto que ES
SALIDA:
  - Score de calidad (0-100)
  - Flags especificos por linea
  - Sugerencias de correccion
ACCION:   EN es el MASTER de traduccion -> requiere aprobacion humana 100%
          (aplica a todos los tiers porque EN es la fuente para otros idiomas)
```

### 4.4 Etapa PREVIEW - Post-dubbing QC

```
ENTRADA:
  - Audio generado (MP3/MP4)
  - Texto esperado (traduccion aprobada)
PROCESO:
  1. ASR con Whisper del audio generado
  2. WER (Word Error Rate): ASR vs texto esperado
  3. Deteccion de alucinaciones (palabras que no debian estar)
  4. Deteccion de omisiones (palabras faltantes)
SALIDA:
  - WER score
  - Lista de discrepancias
  - Timestamps de segmentos problematicos
ACCION (por umbral):
  - WER < 5%:    Aprobado automatico
  - WER 5-15%:   Muestreo humano (critico)
  - WER > 15%:   Revision humana obligatoria
```

---

## 5. KPIs por Tier

### 5.1 Metricas Objetivo

| Metrica | Target | Aplica a |
|:--------|:-------|:---------|
| **% videos con revision humana** | 100% Tier 1, >30% Tier 2, 0% Tier 3 (salvo flags) | Por tier |
| **WER promedio post-dubbing** | < 10% en todos los tiers | Global |
| **COMET score promedio** | > 0.85 | Tier 1 y 2 |
| **Tiempo deteccion a correccion** | < 2h Tier 1, < 24h Tier 2 | Por tier |
| **Flags Categoria A en publicacion** | 0 (zero tolerance) | Global |
| **Consenso STT (Whisper vs Gemini)** | > 90% de segmentos | Tier 1 |

### 5.2 Criterios de Escalado Automatico a Humano

Cualquier video en cualquier tier sube automaticamente a revision humana si:

- WER > 15% en post-dubbing
- Score COMET < 0.70 en cualquier idioma
- Se detecta 1 o mas palabras de Categoria A en el audio final
- Discrepancia de timing > 25% entre ES y traduccion destino

---

## 6. Estimacion de Costo del Pipeline

> Estos son costos adicionales al costo base de ElevenLabs. No incluyen tiempo de equipo interno.

| Componente | Costo por video (~5 min) | Frecuencia |
|:-----------|:-------------------------|:-----------|
| LLM Judge - Pre-flight | ~$0.05 - $0.10 | 1x por video |
| LLM Judge - Validacion ES a EN | ~$0.10 - $0.20 | 1x por video |
| ASR Whisper post-dubbing | ~$0.02 - $0.05 por idioma | 16 idiomas activos = ~$0.50 |
| COMET / BERTScore | ~$0.01 - $0.02 por idioma | 16 idiomas activos = ~$0.25 |
| **Total componentes automaticos** | **~$1 - $2 por video** | |
| Revision humana Tier 1 | Tiempo interno equipo | Variable segun episodio |

**Trade-off:** ~$1-2 por video de costo adicional para garantizar que ningun contenido inapropiado llegue a publicacion. Aceptado por el equipo en la etapa actual.

---

## 7. Relacion con Otros Documentos CORE

| Documento | Relacion con QA Tiering |
|:----------|:------------------------|
| `05_CORE_CONTENT_MODERATION.md` | Define la blocklist (Categoria A/B) que usa el Pre-flight Validator de este pipeline |
| `06_CORE_AUDIO_TTS.md` | El tiering de TTS (Tier 1/2/3 por WER) es la contraparte de produccion; este doc rige la validacion post-produccion |
| `07_CORE_MULTI_LANGUAGE.md` | Define que idiomas estan activos y su prioridad; este doc define el nivel de QA por cada idioma activo |
| `04_CORE_TIMING_RULES.md` | El timing check de la Etapa 4.3 (>20% diferencia) se calibra con las reglas de timing narrativo |
| `01_CORE_AUDIENCE_PROFILE.md` | La audiencia (8-15 anos) justifica el zero-tolerance de Categoria A y el umbral de tono del LLM Judge |

---

## 8. Pendientes de Implementacion

- [ ] Definir blocklist inicial (20-30 terminos Categoria A) en coordinacion con `05_CORE_CONTENT_MODERATION.md`
- [ ] Implementar Pre-flight Validator con LLM Judge
- [ ] Configurar contraste automatico guion vs texto detectado por ElevenLabs
- [ ] Definir umbrales exactos de WER por tier (actualmente: <5% auto-pass, 5-15% sampling, >15% full review)
- [ ] Documentar checklist de revision humana para Tier 1 (Saul/Ivan)
- [ ] Integrar COMET/BERTScore en pipeline automatico para Tier 2
