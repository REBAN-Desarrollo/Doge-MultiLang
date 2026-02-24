# ISSUE-01: Migración a Monorepo "Gold Standard" y Reorganización de Proyecto

## Contexto
Actualmente, el repositorio cuenta con una gran cantidad de documentación y análisis (`analysis/`, `debate/`, `knowledgebase/`, `SMART/`, `suite/`, `docs/levantamientos/`). Según el plan arquitectónico (`suite/architecture.md`), se ha decidido construir la "DOGE Creative Suite v1.0" desde cero utilizando un enfoque de Monorepo con Turborepo, Next.js 15 y FastAPI.

Para evitar conflictos con cualquier PR en curso y alinear a todo el equipo, este issue documenta el plan de migración y la nueva estructura de carpetas (Gold Standard 2026).

## Nueva Estructura (Gold Standard)

```text
Doge-MultiLang/
├── apps/                   # Aplicaciones desplegables
│   ├── web/                # Frontend: Next.js 15 + Tailwind + shadcn/ui (pnpm)
│   └── api/                # Backend: FastAPI + Pydantic v2 + ARQ (uv)
├── packages/               # Lógica y configuraciones compartidas
│   ├── typescript-config/
│   └── eslint-config/
├── docs/                   # Documentación consolidada
│   ├── architecture/       # ADRs, decisiones técnicas, plan de monorepo
│   ├── product/            # PRDs, objetivos SMART, análisis
│   ├── workflow/           # Levantamientos, biblias de operaciones
│   ├── api-reference/      # Documentación de ElevenLabs (knowledgebase)
│   └── research/           # Debates y análisis de agentes
├── data/                   # Archivos estáticos y de sistema
│   └── blacklists/         # Diccionarios y palabras prohibidas
├── scripts/                # Scripts de utilidad
├── turbo.json              # Configuración de Turborepo
└── package.json            # Workspaces de pnpm
```

## Fases de Ejecución

### Fase 1: Limpieza y Reorganización de Conocimiento (✅ COMPLETADA)
- Mover `suite/` a `docs/architecture/`
- Mover `analysis/` y `SMART/` a `docs/product/`
- Mover `docs/levantamientos/` a `docs/workflow/levantamientos/` para preservar todo el contexto sin borrar nada.
- Extraer planes críticos multi-idioma (como master plans de dubbing y destilados) y consolidarlos en `docs/product/` o `docs/architecture/` según corresponda para que funjan como PRD/ADR.
- Mover `knowledgebase/` a `docs/api-reference/`
- Mover `debate/` a `docs/research/`
- Eliminar carpetas vacías originales.

### Fase 2: Inicialización del Monorepo (✅ COMPLETADA)
- Crear la estructura de carpetas `apps/web/`, `apps/api/`, `packages/`.
- Crear el archivo `package.json` raíz configurando los workspaces para `pnpm`.
- Crear `turbo.json` para orquestación.
- Inicializar configuraciones base.
- Inicializar cascarón de Next.js 15 en `apps/web/`.
- Inicializar esqueleto de FastAPI en `apps/api/`.

---
**@Ramon:** El esqueleto del monorepo está completamente inicializado y funcional. Ya puedes empezar a integrar lógica dentro de `apps/web/` o `apps/api/`. Las dependencias base y los gestores de paquetes (`pnpm` para web, `uv`/estándar para api) están listos.

**Nota para el resto del equipo:** Si tienes un PR abierto que modifica archivos en `docs/`, `knowledgebase/`, `SMART/` o `suite/`, prepárate para resolver conflictos de rutas o cambiar el destino de tus archivos hacia la nueva carpeta `docs/`.
