---
title: 'QPH CORE: Reglas de Timing'
doc_id: qph-core-timing-001
owner: Andrea (GM) / Guionistas
status: active
last_updated: '2026-02-05'
doc_type: core-spec
visibility: internal
audience: guionistas, coordinacion, animadores
version: v1
product: qph
pillar: product
source: 00_Contexto_Inicial/QuePerroHilo_TIMING_RULES.md + Transcript Analysis
tags:
- qph
- core
- timing
- produccion
breadcrumbs:
- label: QPH
  path: docs/product/projects/video-qph/README.md
- label: CORE
  path: docs/product/projects/video-qph/00_CORE/
---

# QPH CORE: Reglas de Timing

> **SSOT** para las reglas de timing narrativo y de produccion del canal QuePerroHilo.
> **Dos dimensiones:** Timing narrativo (dentro del video) + Timing de produccion (entre planchados).
> **Fuente:** Timing Rules original + Narrative Bible + Transcript Analysis 2026-02-05

---

## 1. Timing Narrativo (Dentro del Video)

### 1.1 Hoja de Tiempos (Estructura Abstracta)

| Momento | % del Relato | Funcion |
|:--------|:-------------|:--------|
| **Hook 1** | 0-10% | Conflicto principal + emocion dominante (miedo, injusticia, verguenza) con cliffhanger |
| **Contexto** | 5-15% | Presenta rapidamente contexto necesario para entender el conflicto |
| **Primer giro** | 10-25% | El problema es mas grave de lo que parecia (nueva info, intencion oculta) |
| **Complicaciones** | Cada 10-20% | Plan falla, nuevo peligro, traicion, abandono |
| **Conflicto central** | 20-80% | Se mantiene vivo con pequenas victorias y retrocesos |
| **Climax** | 80-90% | Confrontacion maxima con fuente de injusticia/peligro |
| **Resolucion** | 90-100% | Reacomodo de relaciones + moral/leccion |

### 1.2 Cadencia de Tension

**Curva en "dientes de sierra":**
- Sube con injusticia o peligro
- Baja ligeramente con falsa seguridad
- Vuelve a subir con un giro

**Distribucion emocional:**
- Inicio: shock o intriga
- Centro: mezcla de rabia, miedo, culpa, verguenza
- Final: alivio relativo + justicia o redencion

### 1.3 Regla del Gancho (30 segundos)

**Regla 3.1.1 del Framework Operativo:** Los primeros 30 segundos (aprox. 60 palabras) deben contener un gancho fuerte.

**Componentes del gancho:**
- Coherencia con titulo
- Accion/consecuencia clara
- Emocion dominante activada

**Validacion dual:**
- **Automatica:** `GuionParser` analiza texto y detecta ganchos debiles
- **Humana:** Ganchista valida en Planchado de Historia

> **Evidencia transcript:** "El ganchista se encarga de corroborar que la primera escena cuente con coherencia con titulo y accion/consecuencia en descripcion y acciones para los primeros segundos."

### 1.4 Regla del Hook Reconstruido

El Hook no es necesariamente el inicio cronologico de la historia. Debe reconstruirse usando el **momento de mayor tension emocional o injusticia**. El resto de la historia se reordena para escalar hacia el climax, manteniendo claridad y ritmo.

---

## 2. Timing de Produccion (Entre Planchados)

> **Descubierto en Transcript Analysis 2026-02-05**

### 2.1 Secuencia Semanal

```
MIERCOLES: Planchado de Assets
    |
    | 2 dias de buffer para produccion de assets
    |
VIERNES: Planchado de Historia (Lock)
    |
    | Celulas de produccion se disparan
    |
VARIABLE: Planchado de Portada
    | (antes o despues del Planchado de Historia)
```

### 2.2 Detalle por Planchado

#### Planchado de Assets (Miercoles)

| Aspecto | Detalle |
|:--------|:--------|
| **Duracion tipica** | 1-2 horas |
| **Participantes** | Guionista + Coordinadora (Mayte) + Animadores (Alondra, Alex) |
| **Input** | Guion con lista de escenas |
| **Output** | Lista de assets por animador con specs visuales |
| **Regla critica** | Se debe hacer ANTES del planchado de historia para dar 2 dias de produccion |

#### Planchado de Historia (Viernes)

| Aspecto | Detalle |
|:--------|:--------|
| **Duracion tipica** | 1-3 horas (depende de largo del guion) |
| **Participantes** | Guionista + Animadores + Ganchista + Andrea (si no es guionista) |
| **Input** | Guion completo + assets en preparacion |
| **Output** | Guion Locked + dudas resueltas + animadores con vision de sus escenas |
| **Mecanica** | Lectura dramatizada: cada animador recibe un personaje y lee sus dialogos |
| **Regla critica** | El Lock aqui dispara toda la produccion |

#### Planchado de Portada (Variable)

| Aspecto | Detalle |
|:--------|:--------|
| **Duracion tipica** | 30-60 minutos |
| **Participantes** | Andrea + Nadia (portadera) + equipo (opcional) |
| **Input** | Guion aprobado + conceptos de titulo |
| **Output** | Titulo aprobado + brief de miniatura |
| **Regla critica** | Debe cumplir restricciones de YouTube (ver Content Moderation) |

### 2.3 Buffer de 2 Dias (Regla Critica)

> **Evidencia transcript (2026-01-21):** "Esta sesion se tuvo un miercoles, para que ambos animadores trabajaran en tener listos los recursos visuales necesarios y que el resto del equipo pudiera comenzar a animar el viernes."

**Regla:** Siempre debe haber al menos 2 dias habiles entre el Planchado de Assets y el Planchado de Historia. Este buffer permite que los animadores produzcan los assets visuales necesarios antes de que el guion sea "locked" y la animacion comience.

---

## 3. Timing de Publicacion

### 3.1 Horarios Optimos (Basado en Audiencia)

| Dia | Horario Peak | Audiencia |
|:----|:-------------|:----------|
| Lunes-Jueves | 3:00 PM - 6:00 PM | Despues de escuela |
| Viernes | 3:00 PM - 10:00 PM | Inicio de fin de semana |
| Sabado-Domingo | 10:00 AM - 10:00 PM | Todo el dia |

### 3.2 Cadencia de Publicacion

Definida por el calendario editorial (seccion 1.2.2 del Framework Operativo). La frecuencia exacta depende de la capacidad del equipo y el WIP limits del Pull System.

---

## 4. Reglas de Guionista para Timing

1. **Disenar la hoja de tiempos desde el inicio** - Marcar que sucede en el 10%, 25%, 50%, 75% y 90% del relato ANTES de detallar dialogos
2. **Garantizar micro-giros regulares** - Cada 10-20% del metraje debe haber una complicacion relevante
3. **Hook reconstruido** - El primer bloque no es cronologico, es el momento de mayor impacto
4. **Resolucion rapida** - El final no debe alargar despues del climax; descenso rapido
5. **Validacion con Ganchista** - Los primeros 30 segundos pasan validacion humana en planchado

---

**Documento consolidado desde:** `QuePerroHilo_TIMING_RULES.md` (Marco Narrativo Patrones y Hoja de Tiempos)
**Mejorado con:** Transcript Analysis 2026-02-05 (secuencia Mie-Vie, buffer de 2 dias, rol Ganchista, planchados multiples)
