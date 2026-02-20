# Análisis Lean - Multi-Idiomas Pipeline

> **Metodología:** Lean Manufacturing - Identificación de Mudas (Desperdicios)
> **Fecha:** Diciembre 2025
> **Estado:** Análisis inicial basado en entrevistas

---

## Resumen de Hallazgos

| Categoría | Cantidad |
|-----------|----------|
| Mudas identificadas | 7 |
| Oportunidades de automatización | 5 |
| Puntos de control faltantes | 4 |
| Riesgos de calidad | 3 |

---

## 1. Mudas Identificadas (7 Tipos de Desperdicio Lean)

### 🔴 MUDA 1: Retrabajo por Detección Incorrecta
**Tipo Lean:** Defectos

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | ElevenLabs detecta mal el texto desde audio (onomatopeyas, "no" → "number") |
| **Impacto** | Corrección manual cada vez |
| **Frecuencia** | Frecuente |
| **Root Cause** | No se envía el texto original (guión) como referencia |

> [!TIP]
> **Oportunidad:** ElevenLabs permite enviar texto de referencia además del audio. Contrastar guión original vs. detección automática.

---

### 🔴 MUDA 2: Ajuste Manual de Timings
**Tipo Lean:** Procesamiento Extra / Movimiento

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | Las traducciones quedan desempatadas con las escenas |
| **Impacto** | Ajuste manual línea por línea |
| **Frecuencia** | Frecuente (especialmente en idiomas largos como alemán) |
| **Root Cause** | La traducción se hace sobre MP4 completo, no particionado por escenas |

> [!TIP]
> **Oportunidad:** Partir la traducción por escenas/diálogos con timestamps. Investigar si API de ElevenLabs soporta segmentación.

---

### 🔴 MUDA 3: Doble Transformación sin Validación Intermedia
**Tipo Lean:** Sobreproducción / Espera

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | ES→EN se valida, pero EN→resto NO se valida |
| **Impacto** | Errores en otros idiomas llegan hasta publicación |
| **Frecuencia** | Desconocido (no se mide) |
| **Root Cause** | No hay revisor humano para cada idioma, y no hay métricas automáticas |

> [!CAUTION]
> **Riesgo Alto:** Contenido inapropiado o errores graves pueden pasar sin detectarse en idiomas Tier 2/3.

---

### 🟡 MUDA 4: Falta de "Single Source of Truth"
**Tipo Lean:** Defectos / Inventario

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | El guión original no se contrasta formalmente con el texto detectado |
| **Impacto** | Deriva entre versiones, pérdida de intención original |
| **Frecuencia** | Ocasional |
| **Root Cause** | El guión no "viaja" como metadato junto con el MP4 |

---

### 🟡 MUDA 5: Revisión de Calidad Solo al Final
**Tipo Lean:** Espera / Defectos

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | La validación ocurre antes de publicar (muy tarde en el pipeline) |
| **Impacto** | Retrabajo costoso si se detectan problemas |
| **Frecuencia** | Variable |
| **Root Cause** | No hay puntos de control intermedios formales |

---

### 🟡 MUDA 6: Dependencia de Conocimiento Tácito
**Tipo Lean:** Talento Desperdiciado

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | Saúl/Iván saben qué errores buscar, pero no está documentado |
| **Impacto** | Si cambia el equipo, se pierde el conocimiento |
| **Frecuencia** | N/A (riesgo estructural) |
| **Root Cause** | Falta de checklist/runbook de errores comunes |

---

### 🟢 MUDA 7: Proceso Anterior Obsoleto
**Tipo Lean:** Inventario / Procesamiento Extra

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | Antes se hacían 2 guiones (latino y global) |
| **Impacto** | Ya eliminado ✅ |

---

## 2. Oportunidades de Automatización

| # | Oportunidad | Complejidad | Impacto | Prioridad |
|---|-------------|-------------|---------|-----------|
| **A1** | Validar guión original vs texto detectado | Baja | Alto | 🔴 P1 |
| **A2** | Métricas automáticas (COMET, BERTScore) para traducciones | Media | Alto | 🔴 P1 |
| **A3** | Partir traducción por escenas/timestamps | Alta | Alto | 🟡 P2 |
| **A4** | Banco de "slang seguro" por idioma | Baja | Medio | 🟡 P2 |
| **A5** | Pipeline de QC con muestreo automático | Media | Alto | 🟡 P2 |

### Detalle de Automatizaciones

#### A1: Validar Guión vs Texto Detectado
```
ENTRADA: Guión original (texto) + MP4
PROCESO: 
  1. ElevenLabs detecta texto del audio
  2. Comparar con guión original (diff)
  3. Flaggear discrepancias
SALIDA: Reporte de discrepancias + texto corregido
```

#### A2: Métricas Automáticas de Traducción
```
ENTRADA: Texto ES original + Traducción EN
PROCESO:
  1. COMET score (fidelidad semántica)
  2. BERTScore (similitud contextual)
  3. Validación de safety (LLM judge)
SALIDA: Score + flags de riesgo
```

#### A3: Traducción Particionada por Escenas
```
HIPÓTESIS: Si partimos el MP4 por escenas antes de traducir,
           podemos controlar mejor el timing.
           
INVESTIGAR: 
  - ¿ElevenLabs Dubbing API soporta segmentos?
  - ¿Se puede enviar timestamps de corte?
  - ¿Se puede enviar el texto por segmento?
```

---

## 3. Puntos de Control Faltantes

| # | Punto de Control | ¿Existe? | Propuesta |
|---|------------------|----------|-----------|
| **QC1** | Guión ES = Texto detectado | ⚠️ Parcial | Automatizar diff antes de traducir |
| **QC2** | Traducción ES→EN validada | ✅ | Formalizar checklist |
| **QC3** | Traducción EN→X validada | ❌ | Muestreo + métricas automáticas |
| **QC4** | Timing por escena cuadrado | ❌ | Tolerancia ±X% definida + flag |

---

## 4. Matriz de Riesgo por Idioma

| Idioma | Volumen | Revisor Humano | Riesgo | Mitigación Propuesta |
|--------|---------|----------------|--------|----------------------|
| **Inglés** | Alto | ✅ Saúl/Iván | 🟢 Bajo | Mantener |
| **Portugués** | Alto | ❌ | 🟡 Medio | Agregar muestreo |
| **Alemán** | Medio | ❌ | 🟡 Medio | Agregar muestreo + revisor |
| **Árabe** | Medio | ❌ | 🔴 Alto | Métricas + revisor externo |
| **Ruso** | Bajo | ❌ | 🔴 Alto | Métricas + revisor externo |
| **Otros** | Bajo | ❌ | 🟡 Medio | Métricas automáticas |

---

## 6. Riesgos Ocultos y Brechas de Arquitectura de Datos

### 📉 Pérdida de Metadatos (Data Loss)
El "Desmontaje Semántico" es rico en contexto (intenciones por escena: "susurro", "ebrio", "grito").
- **Situación:** Esta data vive en el guión/Excel.
- **Problema:** Al exportar a MP4 (audio plano), esa metadata se **elimina**.
- **Consecuencia:** ElevenLabs tiene que *inferir* la emoción solo por el audio. Si el TTS español no fue suficientemente expresivo, la traducción pierde el tono.
- **Solución Ideal:** Pasar la metadata de emoción como *prompt* o guía al motor de traducción (si la API lo permite) o al revisor.

### 📞 Efecto "Teléfono Descompuesto"
La arquitectura en cascada (ES → EN → Resto) amplifica errores.
- **Riesgo:** Un matiz perdido en la traducción ES→EN se convierte en la "verdad absoluta" para los otros 15 idiomas.
- **Ejemplo:** Si "¡Qué padre!" se traduce como "What a father!" (error burdo, pero posible en slang), el alemán traducirá "Was für ein Vater!", perdiendo totalmente el sentido original de "Cool".
- **Mitigación:** Validación humana **crítica** en el paso intermedio (EN Master).

### 🏷️ Fragilidad del ID (Nombre Clave)
Depender de "1-2 palabras clave" para vincular assets/guiones es frágil.
- **Riesgo:** Colisiones de nombres, typos, archivos perdidos.
- **Mejora:** Implementar un **Project ID (UUID)** único generado desde la creación del guión que acompañe a todos los archivos (`P-2025-001_NombreClave_v1.mp4`).

---

## 7. Próximos Pasos Recomendados

### Corto Plazo (Quick Wins)
1. [ ] Documentar checklist de errores comunes (conocimiento de Saúl/Iván)
2. [ ] Implementar contraste guión vs texto detectado (A1)
3. [ ] Definir tolerancia de timing aceptable

### Mediano Plazo
1. [ ] Implementar métricas automáticas COMET/BERTScore (A2)
2. [ ] Crear banco de slang seguro Tier 1 (A4)
3. [ ] Definir estrategia de muestreo por tier

### Investigación Requerida
1. [ ] Capacidades de ElevenLabs Dubbing API (segmentación, texto de referencia)
2. [ ] Costo de LLM-as-judge para 17 idiomas
3. [ ] Opciones de revisores externos para idiomas Tier 2/3

---

## Apéndice: Referencia a Documentación

- **[FLUJO_ACTUAL.md](./FLUJO_ACTUAL.md)** - Proceso detallado con diagramas
- **[CUESTIONARIO_DETALLE.md](./research/CUESTIONARIO_DETALLE.md)** - Para siguientes entrevistas
- **[PLAN.md](../PLAN.md)** - Plan de implementación técnica
- **[CAPABILITIES.md](../../_knowledge_base/capabilities.md)** - Capacidades técnicas de ElevenLabs Dubbing Studio (Manual Dub, CSV, Export)
