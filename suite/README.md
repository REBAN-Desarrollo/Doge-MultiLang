# DOGE Creative Suite v1.0 — PRD

**Fecha**: 2026-02-23
**Autor**: Daniel Garza (Arquitecto) + Claude Opus 4.6 (Co-autor tecnico)
**Status**: DRAFT — Pendiente revision equipo dev
**Repo de specs**: `Doge-MultiLang/suite/`
**Repo de codigo**: `doge-creative-suite/` (nuevo, por crear)

---

## 1. Resumen Ejecutivo

### 1.1 El Problema

El equipo de produccion de QPH (Que Perro Hilo) trabaja con herramientas desconectadas: Word para guiones, Google Drive para assets, WhatsApp para coordinacion, y scripts manuales para TTS y traduccion.

**Equipo**: Andrea (guion), Fernando (post-produccion), Alan y Ramon (factory de assets), Saul/Ivan (dubbing).

Esto causa:
- **Guion Zombie**: Los timestamps del guion se desincronizaron del video editado por Fernando
- **Assets perdidos**: No hay inventario central de que imagenes faltan por episodio
- **Audio manual**: Generacion de TTS y dubbing uno por uno, sin batch ni QA automatizado
- **Multi-idioma ciego**: 26 de 27 idiomas se publican sin revision (solo EN tiene QA humano)
- **AVD desplomado**: -58% Tamil, -49% CJK vs baseline espanol

### 1.2 La Solucion

Una **aplicacion web interna** (DOGE Creative Suite) que centraliza los 4 flujos creativos en una sola interfaz, con generacion automatizada de assets, audio y traducciones, y QA integrado.

### 1.3 Lo Que NO Es

- **NO es AI-Studio v2**. AI-Studio (REBAN ERP v3.0) tiene 19K LOC, 530+ docs, 15 servicios. Es demasiado complejo. Esta suite es una app nueva, simple, enfocada 100% al equipo creativo.
- **NO reemplaza herramientas de edicion**. Fernando sigue editando en Premiere. Alan sigue retocando en Photoshop. La suite orquesta y genera, no edita.
- **NO es un CMS publico**. Es una herramienta interna para 5-6 personas.

---

## 2. Stakeholders y Usuarios

| Persona | Rol | Uso Principal | Frecuencia |
|---------|-----|---------------|-----------|
| **Andrea** | Guionista | Sube guiones, valida dialogos, revisa blacklists | Diario |
| **Fernando** | Post-produccion | Escucha audio, resincroniza timestamps, exporta | Diario |
| **Alan** | Asset Factory | Genera imagenes bulk/hero, revisa Kanban de pendientes | Diario |
| **Ramon** | Asset Factory / Dev | Genera assets, ajusta prompts, extiende funcionalidad | Diario |
| **Saul/Ivan** | Dubbing | Revisa TTS, parcha segmentos, gestiona voces | 3x/semana |
| **Daniel** | Arquitecto | Configura, monitorea, escala | Semanal |

---

## 3. Modulos

La suite tiene 4 modulos core. Cada uno tiene su spec detallada en `suite/modules/`:

| # | Modulo | Spec | Responsable Principal |
|---|--------|------|-----------------------|
| 1 | [Guion Pipeline](modules/01_guion.md) | Parser, blacklists, status workflow | Andrea |
| 2 | [Asset Factory](modules/02_assets.md) | Kanban, bulk/hero/manual, fal.ai | Alan, Ramon |
| 3 | [Audio Hub](modules/03_audio.md) | TTS batch, QA, reproductor | Fernando, Saul |
| 4 | [Localization](modules/04_localization.md) | Traduccion, dubbing, patching, alignment | Saul, Ivan |
| 5 | [Modulos Futuros](modules/05_future.md) | Video, subtitulos, analytics (no MVP) | — |

---

## 4. Arquitectura

Ver [architecture.md](architecture.md) para las decisiones tecnicas (ADRs) y el stack completo.

**TL;DR del stack**:
- **Frontend**: Next.js 15 + shadcn/ui + Tailwind v4
- **Backend**: FastAPI + Pydantic v2 (Python 3.12+)
- **DB/Auth/Storage**: Supabase (PostgreSQL + Auth + Storage)
- **Task Queue**: ARQ + Redis
- **AI**: fal.ai (imagenes), ElevenLabs (audio), OpenRouter (LLMs)
- **Hosting**: Railway (todo en 1 proyecto)
- **Monorepo**: Turborepo + pnpm

---

## 5. Schema de Base de Datos

### 5.1 Tablas Core

```sql
-- Proyectos (contenedor principal — 1 proyecto = 1 episodio o 1 video)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft','scripted','assets','audio','localized','done')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Guiones (1 por proyecto, versionado)
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  raw_text TEXT,
  source_type TEXT DEFAULT 'paste'
    CHECK (source_type IN ('paste','docx','webhook','gdocs')),
  dialogue_json JSONB,     -- [{character, text, emotion, scene, index}]
  visual_json JSONB,       -- [{scene, background, characters, props, mood}]
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft','locked','parsed','validated')),
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Assets de imagen
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  scene_index INT,
  asset_type TEXT CHECK (asset_type IN ('background','character','prop','thumbnail','other')),
  generation_mode TEXT CHECK (generation_mode IN ('bulk','hero','manual')),
  prompt TEXT,
  storage_path TEXT,       -- Path en Supabase Storage
  provider TEXT,           -- 'fal_ai', 'comfyui', 'manual'
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','queued','generating','done','failed','rejected')),
  metadata JSONB,          -- {model, seed, width, height, steps, etc.}
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audio tracks (1 por dialogo por idioma)
CREATE TABLE audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'es',
  dialogue_index INT,
  character_name TEXT,
  voice_id TEXT,
  storage_path TEXT,
  duration_ms INT,
  wer_score FLOAT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','queued','generating','qa_pass','qa_fail','done')),
  metadata JSONB,          -- {model, stability, similarity_boost, etc.}
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Traducciones (1 por proyecto por idioma)
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  source_language TEXT DEFAULT 'es',
  translated_json JSONB,
  onomatopoeia_applied BOOLEAN DEFAULT false,
  llm_model TEXT,          -- 'claude-sonnet-4', 'gemini-2.0-flash', etc.
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','translating','translated','dubbed','qa_pass','qa_fail')),
  comet_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, language)
);

-- Jobs (tracking async de ARQ)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,   -- 'tts_batch','image_bulk','image_hero','translate','dub'
  project_id UUID REFERENCES projects(id),
  status TEXT DEFAULT 'queued'
    CHECK (status IN ('queued','running','completed','failed','cancelled')),
  progress INT DEFAULT 0,   -- 0-100
  total_items INT,
  completed_items INT DEFAULT 0,
  result JSONB,
  error TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
```

### 5.2 Tablas de Diccionarios

```sql
-- Pronunciacion (inyeccion en TTS)
CREATE TABLE pronunciation_dict (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  phoneme TEXT NOT NULL,    -- IPA notation
  language TEXT DEFAULT 'es',
  notes TEXT,
  UNIQUE(word, language)
);

-- Onomatopeyas (reemplazo pre-traduccion)
CREATE TABLE onomatopoeia_dict (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text TEXT NOT NULL,  -- "Guau"
  target_text TEXT NOT NULL,  -- "Wan wan"
  language TEXT NOT NULL,     -- "ja"
  category TEXT,              -- 'animal', 'action', 'emotion'
  UNIQUE(source_text, language)
);

-- Blacklists (palabras prohibidas por idioma)
CREATE TABLE blacklist_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  language TEXT DEFAULT 'global',
  category TEXT CHECK (category IN ('A','B','C')),
  reason TEXT,
  UNIQUE(term, language)
);

-- Voces de personajes (mapeo personaje -> voice_id)
CREATE TABLE character_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_name TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'es',
  voice_id TEXT NOT NULL,     -- ElevenLabs voice ID
  voice_name TEXT,
  UNIQUE(character_name, language)
);
```

### 5.3 RLS (Row Level Security)

```sql
-- App interna: todos los usuarios autenticados ven todo
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_access" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Repetir para cada tabla:
-- scripts, assets, audio_tracks, translations, jobs,
-- pronunciation_dict, onomatopoeia_dict, blacklist_terms, character_voices
```

---

## 6. API Endpoints

### 6.1 Guion
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/v1/guion/ingest` | Recibe texto (paste, docx, webhook), parsea a JSON |
| GET | `/api/v1/guion/{project_id}` | Retorna guion con dialogos y visuales |
| PATCH | `/api/v1/guion/{project_id}/status` | Cambiar status (draft -> locked -> parsed -> validated) |
| GET | `/api/v1/guion/{project_id}/validate` | Ejecutar blacklist check, retorna alertas |

### 6.2 Assets
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/v1/assets/{project_id}` | Lista assets del proyecto (filtros status/type) |
| POST | `/api/v1/assets/generate` | Generar imagen (body: prompt, mode, model) |
| POST | `/api/v1/assets/generate-batch` | Generar N imagenes bulk (async -> job_id) |
| POST | `/api/v1/assets/{id}/upload` | Upload manual de asset |
| PATCH | `/api/v1/assets/{id}/status` | Aprobar/rechazar asset |

### 6.3 Audio
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/v1/audio/generate-tts` | TTS batch para proyecto (async -> job_id) |
| POST | `/api/v1/audio/regenerate-segment` | Regenerar 1 segmento especifico |
| GET | `/api/v1/audio/{project_id}` | Lista audio tracks por proyecto/idioma |
| GET | `/api/v1/audio/{project_id}/player` | Datos para reproductor (tracks + timestamps) |

### 6.4 Localization
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/v1/localization/translate` | Traducir a 1 o N idiomas (async -> job_id) |
| POST | `/api/v1/localization/dub` | Generar audio doblado (async -> job_id) |
| POST | `/api/v1/localization/patch-segment` | Parchar 1 segmento de dub |
| POST | `/api/v1/localization/forced-alignment` | Resync timestamps post-edicion |
| GET | `/api/v1/localization/{project_id}/status` | Grid de estado por idioma |

### 6.5 Infraestructura
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/jobs/{job_id}` | Status de job async |
| GET | `/api/v1/jobs/{job_id}/progress` | SSE stream de progreso |
| GET/POST | `/api/v1/dictionaries/pronunciation` | CRUD diccionario pronunciacion |
| GET/POST | `/api/v1/dictionaries/onomatopoeia` | CRUD diccionario onomatopeyas |
| GET/POST | `/api/v1/dictionaries/blacklist` | CRUD blacklist |

---

## 7. Estructura del Monorepo

```
doge-creative-suite/
|-- apps/
|   |-- web/                          # Next.js 15 frontend
|   |   |-- src/
|   |   |   |-- app/
|   |   |   |   |-- (auth)/           # login, signup, callback
|   |   |   |   |-- (dashboard)/      # sidebar + header
|   |   |   |   |   |-- layout.tsx    # Dashboard shell
|   |   |   |   |   |-- page.tsx      # Home (overview)
|   |   |   |   |   |-- guion/        # Modulo 1
|   |   |   |   |   |-- assets/       # Modulo 2
|   |   |   |   |   |-- audio/        # Modulo 3
|   |   |   |   |   +-- localization/ # Modulo 4
|   |   |   |   +-- layout.tsx        # Root layout
|   |   |   |-- components/
|   |   |   +-- lib/                  # Supabase clients, API client, utils
|   |   +-- package.json
|   |
|   +-- api/                          # FastAPI backend
|       |-- app/
|       |   |-- main.py               # App + lifespan + middleware
|       |   |-- config.py             # Pydantic Settings
|       |   |-- deps.py               # Dependencies (get_current_user, get_db)
|       |   |-- routes/               # 1 archivo por dominio
|       |   |-- providers/            # SSOT: 1 archivo por API externa
|       |   |-- services/             # Business logic
|       |   |-- workers/              # ARQ workers
|       |   +-- models/               # Pydantic schemas
|       |-- pyproject.toml
|       +-- Dockerfile
|
|-- packages/
|   |-- ui/                           # shadcn/ui compartidos
|   +-- config/                       # ESLint, TS configs
|
|-- supabase/
|   +-- migrations/
|       +-- 001_initial.sql
|
|-- turbo.json
|-- pnpm-workspace.yaml
|-- package.json
|-- CLAUDE.md
+-- README.md
```

---

## 8. Deploy en Railway

```
doge-creative-suite (Railway Project)
|
|-- Service: web        (apps/web/,   port 3000, pnpm start)
|-- Service: api        (apps/api/,   port 8000, uvicorn)
|-- Service: worker     (apps/api/,   no port,   arq WorkerSettings)
|-- Service: redis      (managed, 1-click)
|
+-- Env vars compartidas:
    SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_JWT_SECRET, ELEVENLABS_API_KEY, FAL_AI_API_KEY,
    OPENROUTER_API_KEY, REDIS_URL (auto-linked)
```

**Networking interno**:
- `web` -> `api`: via `api.railway.internal:8000`
- `api` <-> `worker`: via Redis `redis.railway.internal:6379`
- `api` -> Supabase: via URL publica + connection pooling

---

## 9. Fases de Implementacion

### Fase 0: Scaffold + Deploy (2 dias)
App deployada en Railway con login funcional y dashboard vacio.

- [ ] Crear monorepo Turborepo (pnpm + turbo.json + pnpm-workspace.yaml)
- [ ] Crear `apps/web` (Next.js 15 + shadcn/ui + Tailwind v4)
- [ ] Crear `apps/api` (FastAPI + config.py + /health)
- [ ] Crear `packages/ui` (Button, Dialog, DataTable base)
- [ ] Supabase: nuevo proyecto Pro, crear tablas SQL, habilitar RLS
- [ ] Auth: login page + Supabase Auth + JWT verify en FastAPI
- [ ] Deploy: 4 servicios en Railway, verificar /health responde 200
- [ ] CLAUDE.md con reglas para el equipo

### Fase 1: Guion Pipeline (3 dias)
Pegar texto de guion -> ver dialogos parseados -> alertas de blacklist.

- [ ] Backend: `POST /api/v1/guion/ingest` + parser
- [ ] Backend: `GET /api/v1/guion/{id}` + blacklist validation
- [ ] Frontend: Script Board (lista + detalle)
- [ ] Seed: blacklists globales (de Doge-MultiLang)
- [ ] Test E2E: guion de prueba con palabra prohibida

### Fase 2: Asset Factory (4 dias)
Kanban de assets -> generar bulk/hero -> ver resultado.

- [ ] Backend: extraer requerimientos de visual_json
- [ ] Backend: `POST /api/v1/assets/generate` + `generate-batch`
- [ ] Worker: image_worker.py con fal.ai
- [ ] Backend: SSE `/api/v1/jobs/{id}/progress`
- [ ] Frontend: Kanban + generador interactivo + progress bar
- [ ] Supabase Storage: bucket "assets"
- [ ] Test E2E: generar 1 background (bulk) + 1 character (hero)

### Fase 3: Audio Hub (4 dias)
TTS batch -> escuchar -> regenerar segmento.

- [ ] Backend: `POST /api/v1/audio/generate-tts` (batch)
- [ ] Worker: audio_worker.py con ElevenLabs
- [ ] Backend: Auto-QA (Scribe v2 -> WER)
- [ ] Backend: `POST /api/v1/audio/regenerate-segment`
- [ ] Frontend: reproductor por escena + indicadores QA
- [ ] Supabase Storage: bucket "audio"
- [ ] Seed: pronunciation_dict + character_voices
- [ ] Test E2E: generar audio, escuchar, regenerar 1 segmento

### Fase 4: Localization (5 dias)
Traducir -> dubbing -> parchar -> resync.

- [ ] Backend: `POST /api/v1/localization/translate` (1 o N idiomas)
- [ ] Worker: translation_worker.py con OpenRouter
- [ ] Backend: onomatopoeia injection pre-traduccion
- [ ] Backend: `POST /api/v1/localization/dub` (ElevenLabs Dubbing)
- [ ] Backend: `POST /api/v1/localization/patch-segment`
- [ ] Backend: `POST /api/v1/localization/forced-alignment`
- [ ] Frontend: grid de idiomas + reproductor comparativo
- [ ] Seed: onomatopoeia_dict (ES->JA, ES->KO, ES->ZH minimo)
- [ ] Test E2E: traducir a 3 idiomas, generar dub, parchar 1 segmento

### Fase 5: Integracion + Pulido (3 dias)
Suite completa funcional.

- [ ] Dashboard home: overview de todos los proyectos
- [ ] Supabase Realtime: notificar cuando jobs terminan
- [ ] CRUD diccionarios (pronunciacion, onomatopeyas, blacklists)
- [ ] Integracion basica DOGE-Studio-Personajes (catalogo de estilos)
- [ ] Test E2E completo: guion -> assets -> audio -> traduccion -> dub

**Total estimado**: ~21 dias de desarrollo

---

## 10. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigacion |
|--------|---------|-----------|
| ElevenLabs sube precios | Alto | Provider SSOT permite swap a Fish Audio/XTTS |
| fal.ai tiene downtime | Medio | Fallback a Replicate (misma interfaz de prompt) |
| Supabase Storage se llena (100GB) | Bajo | Migrar a Cloudflare R2 (S3-compatible) |
| Parser de guion falla con formatos inesperados | Medio | Parser robusto + modo "paste text" como fallback |
| Fernando necesita features avanzadas de video | Bajo | Fase futura: Video Compositor (no en MVP) |
| El equipo no adopta la herramienta | Alto | Involucrar a Andrea y Fernando en demos tempranas |

---

## 11. Criterios de Exito

| Metrica | Baseline (hoy) | Target (3 meses) |
|---------|----------------|-------------------|
| Tiempo guion -> assets listos | ~2 dias manual | < 4 horas |
| TTS batch (1 episodio, 27 idiomas) | ~1 dia manual | < 30 min |
| Assets perdidos por episodio | "muchos" (sin inventario) | 0 (Kanban completo) |
| Idiomas con QA automatizado | 1 (EN) | 27 |
| Blacklists cubiertas | 3/27 idiomas | 27/27 |
| Herramientas usadas | Word + Drive + WhatsApp + scripts | 1 suite web |

---

## Documentos Relacionados

- [Arquitectura y ADRs](architecture.md)
- [Providers: ElevenLabs](providers/elevenlabs.md)
- [Providers: fal.ai](providers/fal_ai.md)
- [Providers: OpenRouter](providers/openrouter.md)
- [Evaluacion: Propuesta Gemini](evaluations/gemini_proposal_review.md)
