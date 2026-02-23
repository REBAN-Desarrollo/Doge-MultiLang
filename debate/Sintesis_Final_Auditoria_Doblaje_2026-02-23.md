# Sintesis Final: Auditoria Cruzada de Doblaje Multi-Idioma QPH

| Campo | Valor |
|:------|:------|
| Fecha | 2026-02-23 |
| Autor | Agente Sintetizador (Claude Opus 4.6) |
| Estado | **DOCUMENTO ACTIONABLE PARA DESARROLLO** |
| Fuentes | 2 transcripciones operadores (Angela, Sebastian), Informe cruce documental, Gold Standard Consenso Final, Codex Gold Standard Unificado, Sonnet Devil's Advocate, Gemini 3.1 PRO Deep Audit, Gemini Deep Thinking Deep Audit, Propuesta Equipo No Tecnica, insight estrategico del usuario (CSV Seeding como prevencion) |
| Destinatario principal | **Ramon (developer)** |

---

## 1. RESUMEN EJECUTIVO

### Estado actual

QPH (Que Perro Hilo) es un canal de animacion infantil que dobla videos de espanol a 16 idiomas usando ElevenLabs. El proceso actual es **100% GUI manual**, operado por editores (Angela, Sebastian, Ivan) que ejecutan ~20 pasos por video durante ~1 hora cada uno. El flujo es: Fernando entrega MP4 (solo voz) -> operador crea proyecto en ElevenLabs GUI -> dobla ES->EN (revision profunda) -> agrega 15 idiomas restantes (sin revision de contenido) -> exporta MP3 -> devuelve a Fernando para montaje final.

### Los 5 hallazgos mas importantes

| # | Hallazgo | Fuente |
|:--|:---------|:-------|
| **1** | **BLOCKER: Proyectos GUI NO son accesibles via Dubbing Resource API.** Solo proyectos creados con `dubbing_studio: true` via API exponen endpoints de edicion. Los proyectos existentes no migran. | Auditoria API + transcripciones |
| **2** | **CSV Seeding desde guion SSOT puede PREVENIR el 60-80% de errores manuales** antes de crear el proyecto, sin depender de edicion CSV post-creacion (que ElevenLabs desaconseja). | Insight estrategico del usuario + validacion con datos de Angela/Sebastian |
| **3** | **Zero QA en 14 de 16 idiomas.** Solo ingles recibe revision de contenido. El resto es "asignar voces y al siguiente idioma" (Sebastian, 00:48:05). Contenido infantil en 14 idiomas publicado sin revision. | Angela + Sebastian, confirmado unanimemente |
| **4** | **El guion en Google Docs es la unica fuente de verdad operativa**, pero no es accesible programaticamente. No existe SSOT centralizado — las voces aprobadas viven en OneNote/archivos de texto locales del operador. | Angela (00:11:46, 00:45:30) |
| **5** | **Automatizacion API puede ahorrar 70-80% del tiempo manual** (de 120-195 min a 25-45 min por episodio), pero requiere que TODOS los proyectos nuevos se creen via API. | Auditoria API + calculo cruzado Angela/Sebastian |

### El BLOCKER principal y como resolverlo

Los proyectos creados en la GUI de ElevenLabs **no exponen** los endpoints de la Dubbing Resource API (`GET resource`, `PATCH segment`, `migrate-segments`, etc.). Solo proyectos creados via `POST /v1/dubbing` con `dubbing_studio: true` tienen acceso programatico.

**Resolucion:** No intentar migrar proyectos GUI existentes. En su lugar, crear TODOS los proyectos nuevos via API desde el dia 1. La Ruta C (Hibrida) permite que los operadores sigan verificando en GUI mientras los proyectos se crean programaticamente.

---

## 2. TABLA DE VALIDACION DE CLAIMS DE GEMINI

| Claim de Gemini | Veredicto | Evidencia |
|:----------------|:----------|:----------|
| **English como pivot language (ES->EN->otros)** | **CONFIRMADO 100%** | Sebastian (00:02:20): "el ingles, que es el idioma universal que vamos a usar"; Angela (00:00:53): "nos enfocamos en el ingles principalmente". Los 15 idiomas restantes se generan DESPUES de aprobar EN. |
| **Manual cleanup extenso** | **CONFIRMADO con datos cuantitativos** | Angela: ~1 hora por video, 20 pasos. Sebastian: 37 pasos detallados, 6 fases. 11 tipos de errores documentados (speaker misassignment, fusion de voces, silencios confundidos como audio, splitting incorrecto, etc.) |
| **Cost/credit optimization (50% hack, 2 cuentas)** | **CONFIRMADO 100%** | Alan (00:09:14): "Reduce el uso de caracteres en un 50%... anade marca de agua al video, pero como no ocupamos el video sino el puro audio, no nos afecta." Alan (00:09:43): "actualmente se tienen dos cuentas" — una para TTS, otra para doblaje, por insuficiencia de creditos. ~3,900 creditos/video con hack (seria ~7,800 sin el). |
| **CSV vs API como decision arquitectonica** | **ACTUALIZADO: CSV como PREVENCION, no como EDICION** | El debate descarto CSV como herramienta de edicion permanente (35% confianza, "production use strongly discouraged"). PERO el insight del usuario redefine el CSV como **herramienta de inicializacion**: inyectar datos correctos desde el guion SSOT AL CREAR el proyecto, no para editar despues. Esto es un uso de 1 sola vez que esquiva la advertencia de ElevenLabs sobre uso continuo en produccion. |
| **GUI vs API project separation** | **CONFIRMADO como BLOCKER CRITICO** | Codex documenta: "GUI projects NOT accessible via Dubbing Resource API." Ambas transcripciones confirman que el proceso es 100% GUI. Ningun operador menciona API, scripts o programacion. El cambio requiere crear proyectos nuevos via API, no migrar los existentes. |

---

## 3. MAPA DE PROCESO ACTUALIZADO

### Flujo actual (100% GUI, ~60-120 min por episodio)

```
FERNANDO                    OPERADOR (Angela/Sebastian)                    FERNANDO
   |                              |                                          |
   |  1. Exporta MP4              |                                          |
   |  (solo voz, sin SFX/musica)  |                                          |
   |----------------------------->|                                          |
   |                              |                                          |
   |  2. Sube link a Slack/Monday |                                          |
   |  + link Google Docs (guion)  |                                          |
   |                              |                                          |
   |                     3. Descarga MP4 del NAS                             |
   |                     4. Abre ElevenLabs GUI                              |
   |                     5. Crea proyecto:                                   |
   |                        [x] Crear proyecto de doblaje                    |
   |                        [x] Reducir caracteres 50%                       |
   |                        num_speakers = N                                 |
   |                        Sube MP4                                         |
   |                              |                                          |
   |                     6. ESPANOL: Verifica transcripcion ES               |
   |                        vs Google Docs (guion SSOT)                      |
   |                        - Corrige speaker misassignment                  |
   |                        - Corrige fusion de voces                        |
   |                        - Elimina silencios detectados como audio        |
   |                        - Splitting contextual (puntos, comas, "...")    |
   |                              |                                          |
   |                     7. INGLES: Agrega EN como idioma                    |
   |                        - Asigna voces pre-testeadas                     |
   |                          (Ivana, Ivy, Adeline, Evie, Alexander)         |
   |                        - Revisa traduccion EN vs guion ES               |
   |                        - Corrige errores de traduccion                  |
   |                        - Verifica prosodia/pronunciacion                |
   |                        - <<< QA PROFUNDO solo aqui >>>                  |
   |                              |                                          |
   |                     8. OTROS 14 IDIOMAS (en secuencia):                 |
   |                        Para cada idioma:                                |
   |                          - Agregar idioma                               |
   |                          - Asignar voces (de lista local)               |
   |                          - Check visual de alineamiento temporal        |
   |                          - <<< SIN revision de contenido >>>            |
   |                          - Siguiente idioma                             |
   |                              |                                          |
   |                     9. Exporta MP3 por idioma                           |
   |                     10. Renombra x16 archivos                           |
   |                     11. Sube al NAS                                     |
   |                              |                                          |
   |                              |-------------------------------------------->|
   |                              |  12. MP3 de 16 idiomas                   |
   |                              |                                          |
   |                              |                     13. Fernando monta    |
   |                              |                     audio sobre video     |
   |                              |                     con SFX + musica      |
   |                              |                     14. Publica           |
```

### Puntos de automatizacion identificados (marcados con [A])

```
PIPELINE PROPUESTO (Ruta C Hibrida)

  GUION (Google Docs)          MP4 (Fernando)
       |                            |
       v                            v
  [A] Google Docs API         [A] Forced Alignment API
       |                            |
       v                            v
  texto por personaje          timestamps reales
       |                            |
       +------------+---------------+
                    |
                    v
           [A] Generador CSV
           speaker,start,end,transcription,translation
                    |
                    v
           [A] POST /v1/dubbing
           (dubbing_studio: true, mode: manual, CSV adjunto)
                    |
                    v
           Proyecto creado con datos LIMPIOS
           (speakers correctos, transcripcion verificada)
                    |
                    v
           OPERADOR verifica en GUI  <-- Fase 2 humana
           (proyecto ya viene limpio, solo micro-parches)
                    |
                    v
           [A] Dubbing Resource API para parches post-QA
           PATCH /v1/dubbing/resource/{id}/segment/{seg}/{lang}
                    |
                    v
           [A] Render + Export automatizado
           POST /v1/dubbing/resource/{id}/render
                    |
                    v
           [A] Naming convention + upload NAS automatizado
```

---

## 4. LAS 3 RUTAS PARA RAMON (DEVELOPER)

### RUTA A: "CSV Seeding" (Quick Win — Semanas 1-4)

**Objetivo:** Prevenir errores inyectando datos del guion SSOT al crear el proyecto, eliminando 60-80% de la correccion manual.

**Fundamento estrategico:** El CSV Manual Dub esta marcado como experimental por ElevenLabs ("production use strongly discouraged"), pero esa advertencia aplica a su uso como herramienta de EDICION continua. Usarlo como herramienta de INICIALIZACION (1 sola vez al crear el proyecto) es un uso acotado y de bajo riesgo. El guion ya contiene speaker, texto y contexto — es la Single Source of Truth.

**Pipeline tecnico:**

```
1. INPUT
   - Google Doc del guion (via Google Docs API o export manual)
   - MP4 de Fernando (solo voz)

2. FORCED ALIGNMENT
   POST /v1/forced-alignment
   Input: audio del MP4 + texto del guion ES
   Output: timestamps reales (start_time, end_time) por frase

3. GENERACION CSV
   Formato: speaker,start_time,end_time,transcription,translation
   - speaker: extraido del guion (nombres de personaje)
   - start_time/end_time: del Forced Alignment
   - transcription: texto ES del guion
   - translation: pre-generado con ElevenLabs Translate API
     o dejado vacio para que ElevenLabs traduzca

4. VALIDACION PRE-UPLOAD
   - Verificar que num_speakers en CSV == num personajes en guion
   - Verificar que no hay gaps > X segundos sin segmento asignado
   - Verificar que la traduccion EN no tiene terminos en blacklist

5. CREACION DEL PROYECTO
   POST /v1/dubbing
   Body: {
     file: MP4,
     csv: CSV generado,
     mode: "manual",
     dubbing_studio: true,
     source_language: "es",
     target_language: "en",
     num_speakers: N,
     watermark: true  // para hack 50% creditos
   }

6. OUTPUT
   Proyecto ElevenLabs creado con:
   - Speakers correctos (no misassigned)
   - Transcripcion limpia (no "silencios como audio")
   - Traduccion pre-validada en texto
```

**Ahorro estimado por episodio:**

| Error prevenido | Tiempo manual actual | Ahorro con CSV Seeding |
|:----------------|:---------------------|:----------------------|
| Speaker misassignment | 20-35 min | ~100% prevenido |
| Silencios como audio | 15-25 min | ~100% prevenido |
| Errores de transcripcion | 25-40 min | ~90% prevenido |
| Errores de traduccion EN | 10-20 min | ~70% prevenido (validacion en texto) |
| **Total** | **70-120 min** | **Ahorro: ~50-95 min/episodio** |

**Riesgos:**

| Riesgo | Probabilidad | Mitigacion |
|:-------|:-------------|:-----------|
| CSV experimental cambia de formato | Media | Wrapper con version pinning; test automatizado semanal |
| Forced Alignment no soporta diarizacion | Confirmado | No depender de FA para diarizacion; speakers vienen del guion |
| Google Docs API requiere auth OAuth | Baja (es estandar) | Service account con scope read-only |
| ElevenLabs depreca CSV endpoint | Baja a corto plazo | CSV solo se usa 1 vez; migrar a from_content_json cuando este disponible |

**Dependencias:**

1. Google Docs API (lectura del guion) — o parser de Google Doc exportado
2. Forced Alignment API de ElevenLabs (timestamps)
3. Endpoint `POST /v1/dubbing` con soporte de CSV
4. Definicion del formato del guion en Google Docs (convencion de nombres de personaje)

**Entregable:** Script Python que reciba Google Doc URL + MP4 y genere CSV + cree proyecto en ElevenLabs.

---

### RUTA B: "API-First Full" (Mediano Plazo — Semanas 5-12)

**Objetivo:** Automatizacion completa del pipeline de doblaje usando Dubbing Resource API para edicion programatica.

**Pipeline tecnico:**

```
1. CREACION
   POST /v1/dubbing
   Body: { file: MP4, dubbing_studio: true, source_language: "es", ... }

2. LECTURA DEL RECURSO
   GET /v1/dubbing/resource/{dubbing_id}
   -> Obtiene todos los segmentos, speakers, transcripciones

3. MIGRACION DE SEGMENTOS (si necesario)
   POST /v1/dubbing/resource/{dubbing_id}/migrate-segments

4. EDICION PROGRAMATICA
   Para cada segmento que necesite correccion:
   PATCH /v1/dubbing/resource/{dubbing_id}/segment/{segment_id}/{language}
   Body: { text: "texto corregido", speaker_id: "correcto" }

5. AGREGAR IDIOMAS
   POST /v1/dubbing/resource/{dubbing_id}/add-language
   Body: { language: "fr", ... }
   Repetir para cada idioma target

6. DUB (generar audio)
   POST /v1/dubbing/resource/{dubbing_id}/dub
   (para cada idioma o en batch)

7. RENDER
   POST /v1/dubbing/resource/{dubbing_id}/render

8. DOWNLOAD + NAMING + UPLOAD NAS
   Automatizado con naming convention estandarizada
```

**Endpoints clave (todos requieren `dubbing_studio: true` en creacion):**

| Endpoint | Metodo | Funcion |
|:---------|:-------|:--------|
| `/v1/dubbing` | POST | Crear proyecto |
| `/v1/dubbing/resource/{id}` | GET | Leer recurso completo |
| `/v1/dubbing/resource/{id}/migrate-segments` | POST | Migrar formato de segmentos |
| `/v1/dubbing/resource/{id}/segment/{seg}/{lang}` | PATCH | Editar segmento |
| `/v1/dubbing/resource/{id}/segment/{seg}` | DELETE | Eliminar segmento |
| `/v1/dubbing/resource/{id}/segment` | POST | Crear segmento nuevo |
| `/v1/dubbing/resource/{id}/dub` | POST | Generar dub de segmentos |
| `/v1/dubbing/resource/{id}/render` | POST | Renderizar proyecto |
| `/v1/dubbing/resource/{id}/add-language` | POST | Agregar idioma target |

**Ahorro estimado:**

| Fase | Tiempo manual | Tiempo API | Ahorro |
|:-----|:-------------|:-----------|:-------|
| Creacion proyecto | 15-20 min | 2-3 min | ~85% |
| Correccion ES | 30-45 min | 5-10 min | ~75% |
| QA + correccion EN | 25-40 min | 10-15 min | ~60% |
| 14 idiomas restantes | 40-70 min | 5-10 min | ~85% |
| Export + renombrado | 10-20 min | 2-5 min | ~80% |
| **Total** | **120-195 min** | **25-45 min** | **~75%** |

**Dependencias:**

1. `voice_manifest.json` (ver seccion 5)
2. Naming convention estandarizada
3. QA pipeline (WER, timing drift, safety checks)
4. NAS upload automation
5. Smoke tests de TODOS los endpoints antes de implementar

**Entregable:** SDK/CLI wrapper (`qph-dub`) que exponga comandos como `qph-dub create`, `qph-dub fix-segment`, `qph-dub add-langs`, `qph-dub render`, `qph-dub export`.

---

### RUTA C: "Hibrida A+B" (RECOMENDADA)

**Objetivo:** Entregar valor desde la semana 1 respetando el BLOCKER, con migracion gradual a full API.

```
FASE 1 (Semanas 1-4): CSV Seeding
+-------------------------------------------------------+
| - Script que lee guion de Google Docs                  |
| - Forced Alignment para obtener timestamps             |
| - Genera CSV con speaker/time/text/translation         |
| - Crea proyecto via POST /v1/dubbing con CSV           |
| - Proyecto nace LIMPIO                                 |
| - VALOR: -50-95 min de correccion manual/episodio      |
+-------------------------------------------------------+
                         |
                         v
FASE 2 (Semanas 5-8): Verificacion GUI sobre proyecto limpio
+-------------------------------------------------------+
| - Operadores verifican en GUI (ya saben usarla)        |
| - El proyecto viene limpio: solo micro-parches          |
| - Se documenta cada parche manual como feedback         |
|   para mejorar el CSV Seeding iterativamente            |
| - VALOR: Operadores hacen QA real, no cleanup           |
+-------------------------------------------------------+
                         |
                         v
FASE 3 (Semanas 9-12): Dubbing Resource API para parches
+-------------------------------------------------------+
| - Los micro-parches documentados en Fase 2 se          |
|   automatizan con PATCH /segment/{id}/{lang}            |
| - QA automatizado: WER en EN, timing drift check       |
| - Pronunciation dictionaries para terminos del show     |
| - VALOR: Ciclo de parches automatico post-QA humano     |
+-------------------------------------------------------+
                         |
                         v
FASE 4 (Semanas 13+): Pipeline completo API-first
+-------------------------------------------------------+
| - GUI solo como fallback para excepciones              |
| - Full automation: create -> edit -> dub -> render      |
| - QA tiering: EN profundo, Tier 1 WER, Tier 2/3 visual|
| - Export + naming + NAS upload automatizado             |
| - VALOR: Pipeline E2E, ~25-45 min/episodio              |
+-------------------------------------------------------+
```

**Por que esta ruta es la recomendada:**

1. **Respeta el BLOCKER**: No intenta migrar proyectos GUI existentes; crea nuevos via API.
2. **Valor desde dia 1**: CSV Seeding elimina los errores mas costosos (speaker misassignment, silencios fantasma) desde la primera semana.
3. **No rompe el workflow actual**: Los operadores siguen usando GUI para verificar; solo el metodo de CREACION cambia.
4. **Feedback loop natural**: Los parches manuales de Fase 2 informan que automatizar en Fase 3.
5. **Rollback claro**: Si CSV Seeding falla, se vuelve a crear el proyecto manualmente en GUI. Sin perdida.

---

## 5. VOICE MANIFEST SPEC

Basado en las voces reales documentadas por Angela y Sebastian, y en la necesidad de centralizar la lista que actualmente vive en OneNote/archivos de texto locales.

### Estructura: `voice_manifest.json`

```json
{
  "version": "1.0.0",
  "updated": "2026-02-23",
  "show": "QPH",
  "notes": "Voces pre-testeadas para todos los idiomas. Cada voz fue seleccionada por buena diccion multi-idioma.",
  "characters": {
    "mama": {
      "description": "Madre, voz femenina adulta",
      "gender": "female",
      "age_group": "adult",
      "voices": {
        "primary": "Ivana",
        "alternates": ["Ivy", "Adeline"]
      }
    },
    "papa": {
      "description": "Padre, voz masculina adulta",
      "gender": "male",
      "age_group": "adult",
      "voices": {
        "primary": null,
        "alternates": []
      },
      "notes": "Pendiente documentar voz aprobada"
    },
    "hijo": {
      "description": "Hijo, voz infantil",
      "gender": "male",
      "age_group": "child",
      "voices": {
        "primary": "Alexander",
        "alternates": []
      }
    },
    "hija": {
      "description": "Hija, voz femenina joven",
      "gender": "female",
      "age_group": "child",
      "voices": {
        "primary": "Evie",
        "alternates": ["Adeline"]
      }
    },
    "narradora": {
      "description": "Narradora, voz femenina",
      "gender": "female",
      "age_group": "adult",
      "voices": {
        "primary": "Ivy",
        "alternates": ["Ivana"]
      }
    }
  },
  "approved_voices": {
    "female_adult": ["Ivana", "Ivy", "Adeline"],
    "female_young": ["Evie", "Adeline"],
    "male_child": ["Alexander"],
    "male_adult": []
  },
  "voice_selection_criteria": [
    "Buena diccion en todos los idiomas target",
    "Testeada previamente por operadores en proyectos reales",
    "Sin acento extranjero notorio al cambiar de idioma",
    "Prosodia natural para contenido infantil"
  ],
  "languages": [
    "es", "en", "ar", "ko", "de", "fil", "fr",
    "hi", "id", "it", "ja", "pt", "ru", "tr", "zh", "ms", "ta"
  ],
  "language_notes": {
    "en": "Idioma pivot. QA profundo obligatorio.",
    "ar": "RTL. Verificar alineamiento temporal extra.",
    "zh": "CJK. AVD -49% vs ES. Candidato a evaluacion ROI.",
    "ta": "AVD -58% vs ES. Candidato a pausa por ROI negativo.",
    "fil": "AVD baja. Candidato a evaluacion ROI."
  }
}
```

### Notas de implementacion para Ramon

1. **Poblado inicial**: Entrevistar a Angela y Sebastian para completar TODOS los personajes y sus voces asignadas. El manifest actual es parcial basado en lo que mencionaron en las transcripciones.
2. **Voice IDs de ElevenLabs**: Los nombres ("Ivana", "Ivy") deben mapearse a `voice_id` reales de la API. Usar `GET /v1/voices` para obtener la lista de voces disponibles en la cuenta.
3. **Actualizacion**: Agregar campo `elevenlabs_voice_id` junto al nombre legible.
4. **Validacion**: El script de CSV Seeding debe leer este manifest para asignar `speaker` en el CSV automaticamente.

---

## 6. TOP 10 RECOMENDACIONES PRIORIZADAS

| # | Recomendacion | Impacto | Endpoint(s) ElevenLabs | Complejidad | Dependencias |
|:--|:-------------|:--------|:----------------------|:------------|:-------------|
| **R1** | **Implementar CSV Seeding desde guion SSOT** — Script que lea Google Doc, ejecute Forced Alignment, genere CSV y cree proyecto limpio. | **CRITICO**: Elimina 50-95 min de correccion manual por episodio. Previene speaker misassignment, silencios fantasma y errores de transcripcion. | `POST /v1/forced-alignment`, `POST /v1/dubbing` (con CSV) | Media | Google Docs API o export, voice_manifest.json |
| **R2** | **Crear voice_manifest.json centralizado** — Reemplazar OneNote/archivos de texto locales con JSON versionado en el repo. | **ALTO**: Elimina reasignacion manual de voces x16 idiomas. Habilita automatizacion de asignacion de voces. | `GET /v1/voices` (para obtener voice_ids) | Baja | Entrevista con Angela/Sebastian para datos completos |
| **R3** | **Smoke-test todos los endpoints de Dubbing Resource API** — Verificar en la cuenta real de QPH que cada endpoint funciona como esta documentado. | **ALTO**: Sin esto, Ruta B y Fase 3-4 de Ruta C no son viables. Cierra las 4 contradicciones abiertas del Codex. | Todos los de la tabla de Ruta B | Baja | Acceso a cuenta ElevenLabs con credenciales de produccion |
| **R4** | **Estandarizar naming convention para proyectos y exports** — Definir formato: `QPH_{episodio}_{idioma}_{fecha}_{editor}` | **MEDIO**: Elimina renombrado manual x16, habilita automation de upload al NAS. | N/A (logica local) | Baja | Acuerdo del equipo sobre formato |
| **R5** | **Implementar QA automatizado en ingles** — WER de transcripcion EN vs guion ES traducido. Timing drift check. Safety check contra blacklists. | **ALTO**: Es el unico idioma que se revisa hoy; automatizarlo libera ~25-40 min del operador. | `POST /v1/speech-to-text` (Scribe v2 para STT) | Media | Blacklists EN actualizadas, guion como referencia |
| **R6** | **Crear Pronunciation Dictionary para terminos del show** — Nombres propios, neologismos, terminos de animacion que se pronuncian mal en multiples idiomas. | **MEDIO**: Mejora prosodia en EN y idiomas que "leen" nombres espanoles con acento local. | `POST /v1/pronunciation-dictionaries/add-from-file` | Baja | Lista de terminos del show (de Angela/Sebastian) |
| **R7** | **Automatizar export + upload al NAS** — Script que descargue MP3 por idioma, aplique naming convention y suba al NAS. | **MEDIO**: Elimina 10-20 min de trabajo mecanico por episodio (descargar, renombrar, subir). | `GET /v1/dubbing/{id}/audio/{language}` | Baja | Naming convention (R4), acceso NAS |
| **R8** | **Implementar pre-validacion de traducciones en texto** — Antes de gastar creditos de voz, verificar traduccion EN contra blacklists, longitud, y terminos clave. | **ALTO**: Previene quema de creditos (~3,900/video) en traducciones defectuosas. Permite correccion en texto ANTES de sintetizar voz. | N/A (logica local, pre-API) | Media | Blacklists, guion, traduccion pre-generada |
| **R9** | **Documentar splitting rules como estandar** — Las reglas de Sebastian (puntos = corte, comas = no cortar, "..." = pausa) son conocimiento tacito no documentado. | **MEDIO**: Permite automatizar splitting o al menos validar el splitting automatico de ElevenLabs contra reglas conocidas. | N/A (documentacion) | Baja | Entrevista con Sebastian para formalizar reglas |
| **R10** | **Evaluar ROI por idioma y decidir pausas** — Tamil (30K views, ~$10 revenue, AVD 1:58), Filipino (46K views, ~$50), Chino (65K views, ~$140) son candidatos a pausa. | **MEDIO a largo plazo**: Reducir de 16 a 12-13 idiomas ahorraria ~25% de creditos y tiempo de operador. | N/A (decision de negocio) | Baja (tecnica), Alta (politica) | Datos YouTube Analytics actualizados, decision de Alan/management |

---

## 7. PREGUNTAS ABIERTAS PARA PROXIMO SPRINT

### Preguntas tecnicas (para Ramon)

| # | Pregunta | Contexto | Accion sugerida |
|:--|:---------|:---------|:----------------|
| PT-01 | El endpoint `POST /v1/dubbing` con CSV adjunto, acepta el parametro `dubbing_studio: true`? | Si no lo acepta, los proyectos creados con CSV no tendrian Dubbing Resource API. Esto invalidaria la Ruta C. | Smoke test con cuenta real. Prioridad: DIA 1. |
| PT-02 | El Forced Alignment API, que formato de output retorna exactamente? | Necesitamos `start_time` y `end_time` por frase para generar el CSV. La documentacion dice que no soporta diarizacion, pero no necesitamos diarizacion si los speakers vienen del guion. | Smoke test con un audio de prueba. |
| PT-03 | Cual es el formato exacto del CSV que acepta Manual Dub? | Documentado como `speaker,start_time,end_time,transcription,translation` pero podria haber campos adicionales o restricciones no documentadas. | Probar con CSV minimo y verificar que el proyecto se crea correctamente. |
| PT-04 | Los ajustes hechos en EN, se propagan automaticamente a otros idiomas cuando se agregan via API? | Sebastian confirma que en GUI si se propagan. Necesitamos verificar el mismo comportamiento via API. | Test: crear proyecto API, editar EN, agregar FR, verificar que cambios persisten. |
| PT-05 | Existe rate limiting en la cuenta Pro para creacion de proyectos via API? | Con ~4-5 episodios/semana y 16 idiomas cada uno, necesitamos saber los limites. | Consultar documentacion de rate limits o probar empiricamente. |

### Preguntas operativas (para el equipo)

| # | Pregunta | Contexto | Quien responde |
|:--|:---------|:---------|:---------------|
| PO-01 | Cual es la lista COMPLETA de personajes y sus voces asignadas? | El voice_manifest.json necesita datos completos. Las transcripciones solo mencionan 5 voces (Ivana, Ivy, Adeline, Evie, Alexander). | Angela + Sebastian |
| PO-02 | Fernando puede entregar el MP4 junto con timestamps por escena/frase? | Si Fernando ya tiene timing en su proyecto de edicion, se podria saltar Forced Alignment. | Fernando |
| PO-03 | El guion de Google Docs tiene formato consistente? (nombre de personaje siempre en el mismo formato?) | El parser de Google Docs necesita saber como identificar speakers en el texto. | Angela + Alan |
| PO-04 | Saul e Ivan usan el mismo flujo que Angela y Sebastian? | Si el flujo es identico, la automatizacion aplica a todo el equipo. Si difiere, necesitamos otro levantamiento. | Saul + Ivan |
| PO-05 | Que episodios recientes tuvieron mas problemas de speaker misassignment? | Necesitamos un episodio "dificil" para probar CSV Seeding en el peor caso. | Angela o Sebastian |

### Preguntas estrategicas (para Alan/management)

| # | Pregunta | Contexto |
|:--|:---------|:---------|
| PE-01 | Se aprueba la estrategia de crear todos los proyectos nuevos via API (no GUI)? | Esto es prerequisito de las Rutas B y C. Los operadores seguirian usando GUI para verificar, pero la creacion seria programatica. |
| PE-02 | Hay presupuesto para upgrade de cuenta ElevenLabs si se necesitan features Enterprise (`from_content_json`)? | El CSV es la alternativa a `from_content_json` que esta bloqueado en plan Pro. Si no funciona, necesitamos upgrade. |
| PE-03 | Se aprueba la evaluacion de pausa de idiomas con ROI negativo (Tamil, Filipino, Chino)? | Pausar 3-4 idiomas ahorraria ~25% de creditos y tiempo. Pero es decision de negocio, no tecnica. |

---

## APENDICE A: Resumen de fuentes y confianza

| Fuente | Tipo | Confianza | Aporte principal |
|:-------|:-----|:----------|:-----------------|
| Transcripcion Angela | Observacion directa | 95% | Flujo completo, pain points, workarounds, voces |
| Transcripcion Sebastian | Observacion directa | 95% | Tecnicas de edicion, splitting, errores ElevenLabs, 37 pasos |
| CrossRef Transcripciones vs Debate | Analisis cruzado | 90% | 10 confirmaciones, 5 contradicciones, 10 gaps |
| Auditoria API | Investigacion tecnica | 85% | BLOCKER GUI/API, tabla de endpoints, estimacion de ahorro |
| Comparacion con levantamientos previos | Analisis diferencial | 85% | 9 hallazgos nuevos, 4 contradicciones con docs previos |
| Insight CSV Seeding del usuario | Propuesta estrategica | 80% (requiere smoke test) | Redireccion del CSV de edicion a prevencion |
| Gold Standard Consenso Final | Consenso multi-agente | 75% (pre-transcripciones) | Framework de referencia, ahora parcialmente desactualizado en numero de idiomas y formato de guion |
| Codex Gold Standard | Sintesis tecnica | 75% | SSOT en 4 capas, matriz de endpoints |

## APENDICE B: Glosario rapido

| Termino | Significado |
|:--------|:------------|
| SSOT | Single Source of Truth — fuente unica de verdad |
| CSV Seeding | Uso del CSV Manual Dub como herramienta de inicializacion, no de edicion |
| Forced Alignment | API de ElevenLabs que alinea texto con audio para obtener timestamps |
| Dubbing Resource API | Conjunto de endpoints para edicion programatica de proyectos de doblaje |
| Speaker misassignment | ElevenLabs asigna el dialogo de un personaje a la linea de otro |
| Voice merging | Bug donde ElevenLabs fusiona segmentos de dos personajes en uno |
| Splitting contextual | Tecnica de cortar lineas respetando contexto semantico (puntos si, comas no) |
| Hack 50% | Marca de agua en MP4 que reduce uso de creditos al 50% |
| NAS | Network Attached Storage — almacenamiento compartido del equipo |
| QPH | Que Perro Hilo — nombre del canal |
| DTR | Dynamic Translation Routing — traduccion directa sin pivot para idiomas cercanos |

## APENDICE C: Checklist de arranque para Ramon

```
SEMANA 1 — Validaciones criticas
[ ] Smoke test: POST /v1/dubbing con CSV + dubbing_studio: true
[ ] Smoke test: POST /v1/forced-alignment con audio de prueba
[ ] Smoke test: GET /v1/dubbing/resource/{id} sobre proyecto recien creado
[ ] Verificar formato exacto de CSV aceptado por Manual Dub
[ ] Obtener voice_ids reales con GET /v1/voices
[ ] Entrevistar Angela/Sebastian para completar voice_manifest.json

SEMANA 2 — Prototipo CSV Seeding
[ ] Parser basico de Google Doc (o export a texto plano)
[ ] Script Forced Alignment -> timestamps
[ ] Generador de CSV desde guion + timestamps
[ ] Test: crear proyecto con CSV generado y verificar en GUI

SEMANA 3 — Validacion con operador
[ ] Angela o Sebastian verifican proyecto creado via CSV Seeding
[ ] Documentar delta: que tuvo que corregir el operador manualmente?
[ ] Iterar CSV Seeding basado en feedback

SEMANA 4 — Estabilizacion
[ ] Script robusto con manejo de errores
[ ] voice_manifest.json completo y versionado
[ ] Naming convention implementada
[ ] Documentacion de uso para operadores
[ ] Decision: avanzar a Fase 2 o iterar Fase 1?
```

---

## APENDICE D: Referencias a documentacion del repo

### API de ElevenLabs (Knowledgebase)

| Tema | Archivo | Lineas clave |
|:-----|:--------|:-------------|
| **Crear doblaje (POST /v1/dubbing)** | [`knowledgebase/elevenlabs_api/api-reference__dubbing__create.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__create.md) | L121-144: parametros `mode`, `dubbing_studio`, `num_speakers`, `watermark` |
| **Manual Dub CSV — advertencia experimental** | [`knowledgebase/elevenlabs_api/api-reference__dubbing__create.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__create.md) | L142-144: *"manual mode is experimental and production use is strongly discouraged"* |
| **Formato CSV y ejemplos** | [`knowledgebase/elevenlabs_api/eleven-creative__products__dubbing__dubbing-studio.md`](../knowledgebase/elevenlabs_api/eleven-creative__products__dubbing__dubbing-studio.md) | L187-221: formato `speaker,start_time,end_time,transcription,translation` con 3 tipos de timecodes |
| **Dubbing Resource — obtener recurso** | [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__get-resource.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__get-resource.md) | GET /v1/dubbing/resource/{dubbing_id} — requiere `dubbing_studio: true` |
| **Dubbing Resource — editar segmento** | [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__update-segment.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__update-segment.md) | PATCH /v1/dubbing/resource/{id}/segment/{seg}/{lang} |
| **Dubbing Resource — eliminar segmento** | [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__delete-segment.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__delete-segment.md) | DELETE /v1/dubbing/resource/{id}/segment/{seg} |
| **Dubbing Resource — migrar segmentos** | [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__migrate-segments.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__migrate-segments.md) | POST /v1/dubbing/resource/{id}/migrate-segments |
| **Dubbing Resource — crear segmento** | [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__create-segment.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__create-segment.md) | POST /v1/dubbing/resource/{id}/speaker/{speaker_id}/segment |
| **Dubbing Resource — dub segmento** | [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__dub-segment.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__dub-segment.md) | POST /v1/dubbing/resource/{id}/dub |
| **Dubbing Resource — render proyecto** | [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__render-project.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__render-project.md) | POST /v1/dubbing/resource/{id}/render/{lang} |
| **Forced Alignment** | [`knowledgebase/elevenlabs_api/api-reference__forced-alignment__create.md`](../knowledgebase/elevenlabs_api/api-reference__forced-alignment__create.md) | POST /v1/forced-alignment — timestamps por caracter/palabra, NO soporta diarizacion |
| **Speech-to-Text (Scribe v2)** | [`knowledgebase/elevenlabs_api/api-reference__speech-to-text__convert.md`](../knowledgebase/elevenlabs_api/api-reference__speech-to-text__convert.md) | POST /v1/speech-to-text — `diarize: true`, `num_speakers` |
| **Pronunciation Dictionaries** | [`knowledgebase/elevenlabs_api/api-reference__pronunciation-dictionaries__create-from-rules.md`](../knowledgebase/elevenlabs_api/api-reference__pronunciation-dictionaries__create-from-rules.md) | POST /v1/pronunciation-dictionaries/add-from-rules |
| **Audio Isolation** | [`knowledgebase/elevenlabs_api/api-reference__audio-isolation__convert.md`](../knowledgebase/elevenlabs_api/api-reference__audio-isolation__convert.md) | Solo elimina ruido de fondo, NO separa voces de efectos |
| **Indice KB completo** | [`knowledgebase/elevenlabs_api/README.md`](../knowledgebase/elevenlabs_api/README.md) | Tabla de status de todos los endpoints documentados |

### Documentos de debate (corpus auditado)

| Documento | Archivo | Temas clave |
|:----------|:--------|:------------|
| **Gold Standard Consenso Final** | [`debate/Claude_Gold_Standard_Consenso_Final.md`](Claude_Gold_Standard_Consenso_Final.md) | H-1 API-first, H-2 zero QA, H-5 CSV no es pilar, D-003 CSV vs Resource API, CU-09 Guion Zombie |
| **Codex Gold Standard Unificado** | [`debate/Codex_2026-02-20_Gold_Standard_Unificado.md`](Codex_2026-02-20_Gold_Standard_Unificado.md) | GS-01 BLOCKER GUI/API, SSOT 4 capas, matriz de endpoints |
| **Sonnet Devil's Advocate** | [`debate/Sonnet_Devil_Advocate_Critique.md`](Sonnet_Devil_Advocate_Critique.md) | L176 CSV como riesgo ALTO, L303 GUI/API separacion, L477 inestabilidad API |
| **Gemini 3.1 PRO Deep Audit** | [`debate/Gemini_3.1_PRO_Deep_Audit_QPH.md`](Gemini_3.1_PRO_Deep_Audit_QPH.md) | Dubbing Resource API, Forced Alignment, Pronunciation Dictionaries |
| **Gemini Deep Thinking Audit** | [`debate/Gemini_Deep_Thinking_Deep_Audit_QPH.md`](Gemini_Deep_Thinking_Deep_Audit_QPH.md) | DTR clusters, 27 idiomas (corregido a 16), Tier 1/2/3 |
| **Propuesta Equipo No Tecnica** | [`debate/Propuesta_Equipo_No_Tecnica.md`](Propuesta_Equipo_No_Tecnica.md) | Flujo ES→EN→otros, QA solo ingles |
| **CrossRef Transcripciones vs Debate** | [`debate/CrossRef_Transcripciones_vs_Debate_2026-02-23.md`](CrossRef_Transcripciones_vs_Debate_2026-02-23.md) | 10 confirmaciones, 5 contradicciones, 18 gaps |

### Transcripciones de levantamientos (fuentes primarias)

| Documento | Archivo |
|:----------|:--------|
| **Angela — proceso de doblaje (2026-02-23)** | [`docs/levantamientos/26_02_23_ProcesosDoblaje_Angela_spa.txt`](../docs/levantamientos/26_02_23_ProcesosDoblaje_Angela_spa.txt) |
| **Sebastian — proceso de doblaje (2026-02-23)** | [`docs/levantamientos/26_02_23_ProcesosDoblaje_Sebastian.txt`](../docs/levantamientos/26_02_23_ProcesosDoblaje_Sebastian.txt) |
| **Saul/Ivan — doblaje (2026-02-17)** | [`docs/levantamientos/26_02_17_q8_saul_ivan_dubbing_spa.txt`](../docs/levantamientos/26_02_17_q8_saul_ivan_dubbing_spa.txt) |

---

*Documento generado el 2026-02-23 como sintesis final de la auditoria cruzada de doblaje multi-idioma QPH. Todas las recomendaciones son actionables y priorizadas por impacto/factibilidad. La Ruta C (Hibrida) es la recomendada por consenso de los 5 agentes de analisis.*
