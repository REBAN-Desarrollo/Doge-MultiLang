# Evaluacion: Propuesta de Gemini 3.1 Pro

Revision de la propuesta original de arquitectura generada por Gemini 3.1 Pro para la DOGE Creative Suite.

**Contexto**: Se le pidio a Gemini que propusiera la arquitectura. No pudo leer AI-Studio ni DOGE-Studio-Personajes. Asumio tecnologias y patrones que no existen.

---

## Los 7 Errores Principales

### 1. LoRAs de Stable Diffusion que no existen

**Gemini asumio**: Que DOGE-Studio-Personajes tiene LoRAs de Stable Diffusion con trigger words para generar personajes.

**Realidad**: DOGE-Studio-Personajes usa **Google Gemini API** (gemini-2.5-flash-image). No hay modelos Stable Diffusion, no hay LoRAs, no hay trigger words. El estilo visual se logra con prompting, no con fine-tuning.

### 2. ComfyUI local como componente central

**Gemini asumio**: Que usamos ComfyUI para la pipeline de generacion de imagenes.

**Realidad**: AI-Studio tiene ComfyUI **explicitamente deshabilitado** (ADR-026: cloud-first). La generacion es 100% cloud via fal.ai.

### 3. MinIO como storage

**Gemini propuso**: MinIO self-hosted para almacenar assets y audio.

**Realidad**: Ya existe Supabase Storage (incluido en el plan Pro) y Cloudflare R2 en AI-Studio. No hay razon para agregar otro servicio de storage que requiere mantenimiento.

### 4. Celery como task queue

**Gemini propuso**: Celery + RabbitMQ para procesamiento async.

**Realidad**: AI-Studio usa Trigger.dev v3. Para la suite, ARQ (Asynchronous Redis Queue) es mas apropiado: async-nativo, solo necesita Redis, ~3 dependencias vs 20+ de Celery.

### 5. Servidor local + Linode para hosting

**Gemini propuso**: Servidor local para desarrollo + Linode para produccion.

**Realidad**: El equipo ya usa Railway para todos los servicios. Un solo proveedor simplifica billing, networking y deployment. No hay razon para diversificar hosting para una app de 5-6 usuarios.

### 6. Arquitectura sobre-dimensionada

**Gemini propuso**: Microservicios completos con service mesh, API gateway dedicado, monitoring stack completo (Prometheus + Grafana).

**Realidad**: Es una app interna para 5-6 personas. FastAPI + Next.js monolith con ARQ workers es suficiente. El monitoring se hace con Railway dashboard + logs.

### 7. No considero el ecosistema existente

**Gemini no leyo**:
- AI-Studio (19K LOC, 530+ docs) — patrones reutilizables
- DOGE-Studio-Personajes — la pipeline real de generacion visual
- Supabase como proveedor central de DB + Auth + Storage + Realtime
- OpenRouter como gateway de LLMs

---

## Lo Rescatable

A pesar de los errores, la propuesta de Gemini acierta en:

1. **La vision de modulos**: Guion -> Assets -> Audio -> Localization es correcta
2. **La necesidad de Kanban de assets**: Identifico correctamente el problema de assets perdidos
3. **La necesidad de QA automatizado**: WER check para audio es una buena idea
4. **Onomatopeyas como diccionario**: El concepto de reemplazo pre-traduccion es valido

---

## Leccion Aprendida

Cuando un LLM no puede leer el codebase existente, **inventa** un codebase imaginario basado en patrones comunes. Esto es peligroso porque:

- Las tecnologias asumidas no coinciden con las reales
- Los patrones propuestos duplican o contradicen lo existente
- Las dependencias propuestas agregan complejidad innecesaria

**Regla**: Siempre darle al LLM acceso al codebase existente ANTES de pedir propuestas de arquitectura.
