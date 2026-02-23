# Modulo 4: Localization (Multi-idioma)

> Hoy QPH tiene 27 idiomas. En el futuro podria haber mas idiomas, otros proyectos, u otros modelos de traduccion. Este modulo define el **PIPELINE** (traduccion -> onomatopeyas -> dubbing -> QA -> patching -> alignment), no los idiomas ni los LLMs especificos.

---

## User Stories

| ID | Story | Criterio de Aceptacion |
|----|-------|----------------------|
| L-01 | Como Saul, quiero traducir el guion a 1 o N idiomas con un click | Selector de idiomas -> "Translate" -> cola async -> traducciones en DB |
| L-02 | Como Saul, quiero que las onomatopeyas se reemplacen automaticamente | "Guau" -> "Wan wan" (JA), "Mung mung" (KO), via diccionario |
| L-03 | Como Saul, quiero generar audio doblado por idioma | "Generate Dub" -> ElevenLabs Dubbing API -> WAVs por idioma |
| L-04 | Como Saul, quiero parchar un segmento de audio doblado sin re-hacer todo | Dubbing Resource API -> patching granular por segmento |
| L-05 | Como Fernando, quiero resincronizar los timestamps despues de editar el video | Upload MP4 editado -> Forced Alignment API -> timestamps recalibrados |
| L-06 | Como Saul, quiero ver un grid de estado por idioma | Grid: 27 filas x columnas (traducido / doblado / QA pass/fail) |
| L-07 | Como futuro, quiero gestionar el diccionario cultural de onomatopeyas | CRUD por idioma, con preview de como suena antes/despues |
| L-08 | Como futuro, quiero traduccion directa ES->Target para idiomas romance | Router: Romance (FR,IT,PT) directo, CJK via pivote contextual |

---

## Pipeline Multi-idioma

```
dialogue_json (espanol, validado)
  |
  v
Pre-procesamiento:
  1. Reemplazar onomatopeyas (tabla onomatopoeia_dict)
  2. Aplicar blacklist check por idioma target
  |
  v
Traduccion (segun familia linguistica):
  - Romance (FR, IT, PT): ES -> Target directo via Claude (OpenRouter)
  - CJK (JA, KO, ZH): ES -> Contexto -> Target via Gemini (OpenRouter)
  - Otros: ES -> EN -> Target (pipeline estandar)
  |
  v
Dubbing:
  - ElevenLabs Dubbing API o TTS por segmento
  - Patching granular via Dubbing Resource API
  |
  v
Post-edicion:
  - Fernando edita video en Premiere (corta silencios)
  - Forced Alignment API recalibra timestamps de los 27 idiomas
  |
  v
QA:
  - Tier 1 (ES, EN, PT, DE, FR): humano + auto
  - Tier 2 (IT, JA, KO, AR, RU): sampling 30% + auto
  - Tier 3 (17 restantes): auto-only
```

---

## Routing de Traduccion

No todos los idiomas se traducen igual. El router decide la estrategia:

### Romance (directo)
**Idiomas**: FR, IT, PT, RO, CA
**Ruta**: ES -> Target (directo)
**LLM**: Claude (via OpenRouter)
**Razon**: Alta afinidad linguistica, la traduccion directa es mas natural.

### CJK (pivote contextual)
**Idiomas**: JA, KO, ZH-CN, ZH-TW
**Ruta**: ES -> Contexto enriquecido -> Target
**LLM**: Gemini (via OpenRouter)
**Razon**: Distancia linguistica alta. El contexto cultural extra mejora la calidad. Gemini tiene fuerte rendimiento en CJK.

### Otros (pivote ingles)
**Idiomas**: DE, RU, AR, HI, TH, VI, ID, MS, TR, PL, NL, SV, DA, FI, NO, EL, HE, CS, HU, UK, BG
**Ruta**: ES -> EN -> Target
**LLM**: Claude o GPT (via OpenRouter)
**Razon**: Ruta estandar con mas datos de entrenamiento disponibles.

---

## Onomatopeyas

Las onomatopeyas se reemplazan ANTES de traducir, usando `onomatopoeia_dict`:

| Fuente (ES) | JA | KO | ZH | EN | DE |
|-------------|----|----|----|----|-----|
| Guau (perro) | Wan wan | Mung mung | Wang wang | Woof | Wau wau |
| Miau (gato) | Nyan | Yaong | Miao | Meow | Miau |
| Ja ja (risa) | Hahaha | Hahaha | Hahaha | Hahaha | Hahaha |
| Zzz (dormir) | Guu guu | Kul kul | Hu lu | Zzz | Schnarch |
| Pum (golpe) | Don | Kwang | Peng | Boom | Bumm |

El diccionario es extensible via CRUD en la suite.

---

## Grid de Estado por Idioma

Vista principal para Saul/Ivan:

```
+----------+------------+---------+---------+----------+
| Idioma   | Traducido  | Doblado | QA Auto | QA Human |
+----------+------------+---------+---------+----------+
| ES       | --         | --      | --      | --       |
| EN       | OK         | OK      | PASS    | PASS     |
| PT       | OK         | OK      | PASS    | pending  |
| FR       | OK         | queued  | --      | --       |
| JA       | OK         | FAIL    | --      | --       |
| KO       | translating| --      | --      | --       |
| ...      | ...        | ...     | ...     | ...      |
+----------+------------+---------+---------+----------+
```

Colores:
- Verde: completado y aprobado
- Amarillo: en proceso o pendiente revision
- Rojo: fallo (QA fail, error de generacion)
- Gris: no aplica o no iniciado

---

## Dubbing y Patching

### Generar dub completo
1. Saul selecciona idiomas a doblar
2. Sistema envia a ElevenLabs Dubbing API (audio ES + traduccion target)
3. ElevenLabs genera audio doblado por idioma completo
4. WAVs se guardan en Supabase Storage (bucket "audio/{language}")

### Parchar segmento individual
1. Saul identifica un segmento con QA fail
2. Edita el texto traducido si es necesario
3. Usa Dubbing Resource API para regenerar SOLO ese segmento
4. El nuevo WAV reemplaza al anterior en storage

---

## Forced Alignment (Resync)

Cuando Fernando edita el video en Premiere (corta silencios, ajusta ritmo):

1. Fernando sube el MP4 editado
2. Sistema extrae el audio del MP4
3. Llama a ElevenLabs Forced Alignment API
4. Recibe nuevos timestamps calibrados al audio editado
5. Actualiza timestamps de los 27 idiomas

Esto resuelve el problema del "Guion Zombie" — los timestamps nunca se desincronizaran.

---

## QA Tiers

| Tier | Idiomas | QA Automatico | QA Humano | Cobertura |
|------|---------|--------------|-----------|-----------|
| 1 | ES, EN, PT, DE, FR | Si (WER + COMET) | Si (100%) | Completo |
| 2 | IT, JA, KO, AR, RU | Si (WER + COMET) | Sampling 30% | Parcial |
| 3 | 17 restantes | Si (WER + COMET) | No | Auto-only |

Metricas automaticas:
- **WER** (Word Error Rate): Compara TTS output vs texto original via STT
- **COMET**: Score de calidad de traduccion (cuando este disponible)

---

## API Endpoints

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/v1/localization/translate` | Traducir a 1 o N idiomas (async -> job_id) |
| POST | `/api/v1/localization/dub` | Generar audio doblado (async -> job_id) |
| POST | `/api/v1/localization/patch-segment` | Parchar 1 segmento de dub |
| POST | `/api/v1/localization/forced-alignment` | Resync timestamps post-edicion |
| GET | `/api/v1/localization/{project_id}/status` | Grid de estado por idioma |
