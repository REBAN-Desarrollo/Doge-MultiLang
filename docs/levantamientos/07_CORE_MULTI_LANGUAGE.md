# 07 CORE: Multi-Idioma y Doblaje - Especificacion Consolidada

**Version:** 1.0 | **Fecha:** 2026-02-06
**Fuentes:** `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md`, `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/01_Analysis/FLUJO_ACTUAL.md`, `_recovery/NEW_FEATURES/ElevenLabs/Quality/VALIDATION_FLOW_TIERING.md`

---

## 1. Proposito

Definir la estrategia de doblaje multi-idioma para QPH: idiomas target, tiering de calidad, sistema de blacklist, objetivos de WER, mapeo de personajes entre idiomas y mitigaciones para los 7 problemas recurrentes (mudas) de ElevenLabs.

---

## 2. Idiomas Target (17 Total)

### 2.1 Tiering de Idiomas

La estrategia sigue un modelo de 3 tiers basado en alcance de audiencia y capacidad de QA:

| Tier | Idiomas | Codigo | QA | Justificacion |
|:-----|:--------|:-------|:---|:--------------|
| **Tier 1 (Prioritarios)** | Espanol (base), Ingles, Portugues (BR), Frances, Aleman | ES, EN, PT-BR, FR, DE | 100% revision humana | Mercados principales, ingles es master para el resto |
| **Tier 2 (Alto Alcance)** | Arabe, Coreano, Japones, Hindi, Chino Mandarin | AR, KO, JA, HI, ZH | Muestreo inteligente (~30%) | Alto volumen de audiencia, muestreo de segmentos riesgosos |
| **Tier 3 (Expansion)** | Filipino, Indonesio, Italiano, Ruso, Turco, Tamil, Malay | FIL, ID, IT, RU, TR, TA, MS | Solo automatico | Expansion de alcance, solo flagged por metricas |

### 2.2 Cadena de Traduccion

```
  Espanol (ES) ──[Transformacion 1]──> Ingles (EN) = MASTER
                                            |
                                  [Transformacion 2]
                                            |
                        ┌───────────────────┼───────────────────┐
                        v                   v                   v
                   Tier 1 (3)          Tier 2 (5)          Tier 3 (7)
                   PT-BR, FR, DE       AR, KO, JA,         FIL, ID, IT,
                                       HI, ZH              RU, TR, TA, MS
```

> El ingles se convierte en el "Single Source of Truth" para las traducciones a otros idiomas. NUNCA se traduce directamente de ES a idiomas que no sean EN.

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/01_Analysis/FLUJO_ACTUAL.md` (Resumen Ejecutivo)

---

## 3. Sistema de Blacklist (Filtros de Seguridad)

### 3.1 Categorias de Contenido

| Categoria | Nombre | Accion | Ejemplos |
|:----------|:-------|:-------|:---------|
| **A: Prohibido Absoluto** | Zero Tolerance | Bloqueo automatico, NUNCA publicar | Groserías fuertes, contenido sexual, violencia grafica, self-harm, sustancias |
| **B: Requiere Contexto** | Suavizar | Reemplazar automaticamente con sinonimos | "idiota" -> "tonto", "te odio" -> "estoy muy enojado", "voy a morir" -> "esto es aterrador" |
| **C: Permitido con Cuidado** | Intencion clara | Permitido si tiene proposito narrativo | Drama familiar, injusticia, tension emocional, suspenso |

> Audiencia target: ninos 8-15 anos (Avatar: Noha Williams, 10 anos). Todas las decisiones de contenido pasan por este filtro.

### 3.2 Blacklist por Idioma

ElevenLabs aplica filtros de seguridad que varian por idioma. Palabras validas en espanol pueden ser bloqueadas al traducir.

| Termino (ES) | Severidad | Idiomas Problemáticos | Comportamiento ElevenLabs | Alternativas Seguras |
|:-------------|:----------|:---------------------|:--------------------------|:---------------------|
| "muerte" | Alta | FR, DE, AR | Bloqueado por filtro de seguridad | "final", "pérdida", "desenlace", "partida" |
| "matar" | Alta | Multiples | Bloqueado en contexto infantil | "vencer", "derrotar", "eliminar", "acabar con" |
| "droga" | Alta | Multiples | Filtro de sustancias | "sustancia", "medicamento", "tratamiento" |
| "suicidio" | Critica | Todos | Politica de salud mental | "decisión extrema", "acto desesperado" |
| "sexy" | Media | EN, FR, DE, JA | Filtro de contenido adulto | "atractivo", "encantador", "seductor", "irresistible" |
| "sangre" | Media | DE, JA, KO | Filtro de violencia | "herida", "lesión", "daño" |

> Severidad critica = bloqueo automatico en TODOS los idiomas sin excepcion. Severidad alta = bloqueo en la mayoria de idiomas Tier 2-3.

### 3.3 Estructura de Datos del Blacklist

```json
{
  "global": {
    "category_a_absolute": ["fuck", "shit", "puta", "mierda", "kill yourself"],
    "category_b_soften": [
      {"find": "idiota", "replace": "tonto"},
      {"find": "estupido", "replace": "bobo"},
      {"find": "te odio", "replace": "estoy muy enojado"}
    ]
  },
  "by_language": {
    "en": { "category_a": ["f*ck", "sh*t", "damn", "hell"] },
    "pt-br": { "category_a": ["porra", "caralho"] },
    "de": { "category_a": ["Scheisse"], "sensitive": ["Tod", "Blut"] },
    "ja": { "sensitive": ["死", "血", "殺す"] }
  }
}
```

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Quality/VALIDATION_FLOW_TIERING.md` (Seccion 1: Content Filters, Seccion 5: Keyword Blocklist)

### 3.4 Bugs de Puntuacion (Global)

ElevenLabs malinterpreta ciertos patrones de puntuacion en espanol independientemente del idioma destino. Aplicar sanitizacion regex antes de enviar a TTS o dubbing.

| Patron | Problema | Solucion | Ejemplo Incorrecto | Ejemplo Correcto |
|:-------|:---------|:---------|:-------------------|:-----------------|
| `no.` | Interpretado como abreviatura de "number" | Eliminar punto o usar coma | "No. eso no es cierto" | "No, eso no es cierto" |
| `Sr.` | Puede pronunciarse "Senior" en algunas voces | Escribir "Señor" completo | "Sr. García llegó" | "Señor García llegó" |
| `etc.` | Pronunciacion inconsistente entre voces | Usar "etcétera" o reformular | "traer flores, regalos, etc." | "traer flores, regalos, y demás" |

> Estos bugs estan cubiertos por el sanitizador regex pre-envio (Muda M4). Ver `06_CORE_AUDIO_TTS.md §3.3`.

### 3.5 Blacklist Especifico: Arabe (AR)

El arabe tiene nivel de sensibilidad ALTO por filtros religiosos y culturales de ElevenLabs. Estos terminos son validos en espanol pero bloqueados o conflictivos en la version AR.

| Termino (ES) | Termino (AR) | Razon del Bloqueo | Alternativa Segura |
|:-------------|:-------------|:------------------|:-------------------|
| "cerdo" | خنزير | Referencia a animal haram | "animal" |
| "alcohol" | كحول | Sustancia prohibida (haram) | "bebida" |
| "dios" | إله | Referencia religiosa requiere contexto cuidadoso | "destino", "providencia" |
| "iglesia" | كنيسة | Termino religioso cristiano | "lugar sagrado" |
| "beso" | قبلة | Contenido romantico filtrado | "gesto de cariño" |

**Notas culturales adicionales para AR:**
- Evitar escenas romanticas con contacto fisico.
- Referencias religiosas requieren adaptacion cultural, no traduccion directa.
- Temas de honor familiar pueden necesitar suavizacion.
- Dinamicas de genero pueden requerir revision antes de publicar.

### 3.6 Blacklist Especifico: Aleman (DE)

El aleman tiene nivel de sensibilidad MEDIO con regulaciones historicas y de medios especificas.

| Termino (ES) | Termino (DE) | Razon del Bloqueo | Alternativa / Contexto |
|:-------------|:-------------|:------------------|:-----------------------|
| "nazi" | Nazi | Sensibilidad historica — puede ser flaggeado | Usar contexto historico completo si es necesario |
| "guerra" | Krieg | Filtro de violencia en contenido infantil | Omitir o contextualizar; OK en contexto historico/educativo |

**Notas de pronunciacion para DE:**
- Los Umlauts (ä, ö, ü) deben estar correctamente codificados en UTF-8 en el texto enviado.
- La ß (eszett) a veces es leida como "ss" por el TTS; verificar en QA auditivo.
- Las palabras compuestas largas pueden ser divididas incorrectamente por el TTS.

**Formalidad en aleman:**
| Pronombre | Uso | Contexto QPH |
|:----------|:----|:-------------|
| `Sie` (formal) | Contenido corporativo, adultos | No aplica a QPH (audiencia 8-15) |
| `du` (informal) | Casual, contenido juvenil | Usar `du` consistentemente en QPH |

> Mezclar niveles de formalidad (`Sie`/`du`) en el mismo episodio es jarring para audiencias germanoparlantes. Definir una vez y mantener consistente.

---

## 4. Objetivos WER (Word Error Rate) por Tier

| Tier | WER Target | Accion si Excede | Metodo de Medicion |
|:-----|:-----------|:-----------------|:-------------------|
| **Tier 1** | < 5% | Revision humana linea por linea | Whisper STT + diff vs guion |
| **Tier 2** | < 10% | Muestreo de segmentos flaggeados | Whisper STT + metricas automaticas (COMET, BERTScore) |
| **Tier 3** | < 15% | Solo si metricas < umbral, escalado a humano | ASR automatico + WER check |

### 4.1 Metricas Complementarias

| Metrica | Descripcion | Target | Tier que Aplica |
|:--------|:------------|:-------|:----------------|
| **COMET Score** | Fidelidad semantica de traduccion | > 0.85 | Tier 1 y 2 |
| **BERTScore** | Similaridad semantica por embeddings | > 0.85 | Tier 2 y 3 |
| **Consenso STT** | Whisper == Gemini en transcripcion | > 90% | Tier 1 |
| **Timing Check** | Traduccion no excede 20% de duracion del ES | < 20% delta | Todos |
| **Category A Flags** | Contenido prohibido en publicacion | 0 | Todos |

### 4.2 KPIs de Validacion

| KPI | Target | Justificacion |
|:----|:-------|:--------------|
| % videos con revision humana | 100% Tier 1, >30% Tier 2 | Calidad > Costo |
| WER promedio post-dubbing | < 10% | Fidelidad de audio |
| Tiempo deteccion -> correccion | < 2h Tier 1 | Rapidez de feedback |
| Flags Category A detectados | 0 en publicacion | Zero tolerance |
| COMET score promedio | > 0.85 | Fidelidad semantica |

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Quality/VALIDATION_FLOW_TIERING.md` (Seccion 6: Metricas Clave)

---

## 5. Mapeo de Personajes entre Idiomas

### 5.1 Reglas de Mapping

| Regla | Descripcion |
|:------|:------------|
| **Herencia de Voice IDs** | El mapeo `Personaje -> VoiceID` definido en TTS (ES) se reutiliza automaticamente en dubbing |
| **Re-mapping prohibido** | Saul/Ivan NO deben re-asignar voces manualmente por idioma; el sistema hereda el casting |
| **Consistencia cross-episodio** | Si "Gabriel" tiene VoiceID `abc123` en ES, el dubbing usa el equivalente ElevenLabs para cada idioma |
| **manifest.json como SSOT** | El archivo `manifest.json` exportado por Voice TTS es la fuente de verdad del casting |

### 5.2 Flujo de Herencia

```
  Voice TTS (Ramon)           Dubbing (Saul/Ivan)
  ──────────────────          ──────────────────────
  Personaje -> VoiceID   ──>  Auto-import del manifest
  Texto final sanitizado ──>  Texto base para traduccion
  Estilos emocionales   ──>  Style Propagation a otros idiomas
  Diccionario pronuncia ──>  Pronunciation Dictionary compartido
```

---

## 6. Las 7 Mudas de ElevenLabs (Problemas Recurrentes)

Problemas identificados en entrevistas con el equipo de produccion (Saul, Alan). Cada muda tiene descripcion, impacto, workaround actual y mitigacion propuesta.

| # | Muda | Descripcion | Impacto | Workaround Actual | Mitigacion Propuesta |
|:--|:-----|:------------|:--------|:-------------------|:---------------------|
| M1 | **Re-Mapping de Personajes** | Saul asigna voces "de memoria" y re-mapea en cada idioma | ~5-10 min/proyecto x N idiomas | Memorizar orden de personajes | Persistencia de Voice IDs via manifest.json (D1) |
| M2 | **Cosecha Manual de Silencios** | ElevenLabs comprime/estira silencios del audio original | Saul corta waveforms a mano, visualmente | Observar waveform y cortar "a la mitad del silencio" | Manual Dub CSV con timestamps de After Effects (D6/D9) |
| M3 | **Mezcla de Dialogos en Pista Unica** | Multiples personajes detectados como uno solo | Separacion manual y reasignacion de pistas | Revision auditiva completa | Voice Segments v3: etiquetado por orador (D10) |
| M4 | **Bug `no.` -> `number`** | Punto despues de "no" interpretado como abreviatura | Audio incorrecto que requiere edicion de texto | Edicion manual del texto en ElevenLabs | Sanitizador regex pre-envio (D2) |
| M5 | **Filtros de Seguridad por Idioma** | Palabras como "muerte", "sexy" bloqueadas en ciertos idiomas | Retrabajo manual, cambiar texto ES para que traduzca | Cambiar manualmente el texto fuente | Pre-scanner LLM + diccionario de blacklist (D3/D8) |
| M6 | **Audio "Comido" (Clipping)** | ElevenLabs recorta audio mas de lo debido, silabas perdidas | Deteccion auditiva, "S arrastrada" | Recorrer manualmente el audio para ajustar | Fixed Duration + buffer de respiro (D5) |
| M7 | **Falta de Auto-Scroll** | Editor no sigue la linea de tiempo automaticamente | Scroll manual constante durante revision | Scroll manual | Limitacion de UX de ElevenLabs (sin solucion backend) |

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md` (Seccion: Problemas Identificados)

### 6.1 Mapeo Muda -> Solucion API

| Muda | Solucion Tecnica | API ElevenLabs | Estado |
|:-----|:-----------------|:---------------|:-------|
| M1: Re-Mapping | Persistencia Voice IDs | Studio Projects (`from_content_json`) | Implementado |
| M2: Silencios | Manual Dub CSV + timestamps AE | Dubbing API (CSV mode) | Pendiente |
| M3: Mezcla | Voice Segments v3 | Text to Dialogue | Pendiente |
| M4: `no.` bug | Sanitizador regex | Dubbing Transcript PATCH | Implementado |
| M5: Filtros | Pre-Scanner + Blacklist | (Pre-procesamiento, no API) | Pendiente |
| M6: Clipping | Fixed Duration + Buffer | Dubbing API (duration params) | Pendiente |
| M7: Auto-Scroll | N/A (limitacion UX) | N/A | Sin solucion |

---

## 7. Estimacion de Tiempos y Costos de Dubbing

### 7.1 Tiempos (Guion Tipico: 347 dialogos, ~42K caracteres)

| Escenario | Tiempo Manual | Tiempo Automatizado | Ahorro |
|:----------|:-------------|:--------------------|:-------|
| ES -> EN | ~40 min | ~5 min | 87% |
| 16 idiomas completo | ~4.5 hrs | ~40 min | 85% |

### 7.2 Costos de Validacion (16 idiomas x 10 min video)

| Componente | Costo |
|:-----------|:------|
| Whisper STT | $1.02 |
| Gemini Flash STT | $0.17 |
| Analisis Semantico | $0.01 |
| **Total por proyecto** | **~$1.20** |

> ROI: Revision manual (~4 hrs, $60-80) vs auditoría automatica (~30 min, $7-10). Ahorro ~$50/proyecto.

**Fuente:** `_recovery/NEW_FEATURES/ElevenLabs/Dubbing/02_Planning/MASTER_PLAN.md` (Anexo A.6: Estimacion de Costos)

---

## 8. Relacion con Otros Documentos

| Documento | Relacion |
|:----------|:---------|
| `06_CORE_AUDIO_TTS.md` | TTS en espanol es la base; este doc define que pasa con el output multi-idioma |
| `05_CORE_CONTENT_MODERATION.md` | Categorias A/B/C de contenido aplican al blacklist de traduccion |
| `01_CORE_AUDIENCE_PROFILE.md` | Audiencia 8-15 anos determina los filtros de seguridad |
| `02_OPERATIONS/09_dubbing_workflow.md` | Workflow operativo detallado de este spec |
| `02_OPERATIONS/08_audio_tts_workflow.md` | Pipeline TTS que alimenta al dubbing |
