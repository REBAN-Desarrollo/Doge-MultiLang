# Scorecard de Gio — Auditora de Calidad (LQA Specialist)

> Basado en como funcionan Netflix (Dubbing Production Supervisor), ISO 17100 (separacion traductor/revisor) y MQM (scoring por severidad). Adaptado a la escala de QPH.

**Fecha:** 2026-02-24

---

## Modelo de referencia: como lo hace la industria

| Industria | Quien define el estandar | Quien audita | Quien decide publicar |
|:----------|:-------------------------|:-------------|:----------------------|
| **Netflix** | Netflix (guias creativas + tecnicas) | Dubbing Production Supervisor | Netflix (Dubbing Title Manager) |
| **Localizacion (ISO 17100)** | Quality Manager | LQA Specialist | Quality Manager |
| **AI Dubbing (Papercup, Deepdub)** | Cliente / Product Owner | Human-in-the-loop (linguista nativo) | Cliente |
| **QPH** | **Andrea** (dueña de producto) | **Gio** (auditora) | **Andrea** |

---

## Scorecard de Gio: que mide, como lo mide

### Parte 1 — Evaluacion por video (lo que Gio llena cada vez que audita)

Inspirado en el sistema de Netflix (Blocker / Issue) y MQM (severidades con peso numerico).

```
=== EVALUACION DE VIDEO DOBLADO ===

Video: _______________
Idioma: _______________
Fecha de revision: _______________
Auditora: Gio

--- AUDIO ---

1. Claridad de voz
   [ ] Sin problemas
   [ ] Menor: momentos donde cuesta entender (minuto: ___)
   [ ] Grave: voz ininteligible o cortada (minuto: ___)

2. Ritmo del habla
   [ ] Sin problemas — fluido, natural
   [ ] Menor: se acelera o pausa raro en algun momento (minuto: ___)
   [ ] Grave: entrecortado, robotico, o silencios largos sin sentido (minuto: ___)

3. Mezcla (voz vs musica vs efectos)
   [ ] Sin problemas — la voz se escucha clara
   [ ] Menor: en algun momento la musica tapa la voz (minuto: ___)
   [ ] Grave: no se distingue la voz del fondo en varias partes

4. Glitches / artefactos de audio
   [ ] Sin problemas
   [ ] Menor: 1-2 glitches pequenos (minuto: ___)
   [ ] Grave: glitches frecuentes o muy notorios

--- CONTENIDO ---

5. Blacklist
   [ ] Sin terminos prohibidos detectados
   [ ] Termino detectado: _______________ (minuto: ___)
   (Referencia: lista de Andrea)

6. Coherencia narrativa
   [ ] La historia se entiende
   [ ] Parcialmente: hay partes confusas (cuales: ___)
   [ ] No se entiende la historia

--- SCORING (estilo MQM simplificado) ---

Cada "Menor" = 1 punto
Cada "Grave" = 5 puntos
Blacklist violada = 25 puntos (blocker)

Total de puntos de penalizacion: ___

VEREDICTO:
[ ] PASA (0-4 puntos) — publicar
[ ] PASA CON OBSERVACIONES (5-14 puntos) — Andrea decide
[ ] NO PASA (15-24 puntos) — retrabajo obligatorio
[ ] BLOQUEADO (25+ puntos o blacklist violada) — no se publica, escalar a Andrea

Notas para Saul/Ivan (si no pasa — que arreglar):
_______________________________________________

Notas para Andrea (si requiere decision):
_______________________________________________
```

---

### Parte 2 — Scorecard semanal (lo que Gio entrega a Andrea cada semana)

```
=== SCORECARD SEMANAL DE CALIDAD — Semana del ___/___/2026 ===
Auditora: Gio
Entregado a: Andrea

VOLUMEN
- Videos revisados: ___
- Por idioma: EN: ___ | RU: ___ | Otro: ___

RESULTADOS
- Pasa al 1er intento: ___ (___ %)
- Pasa con observaciones: ___ (___ %)
- No pasa (retrabajo): ___ (___ %)
- Bloqueados: ___ (___ %)

SCORE PROMEDIO POR IDIOMA
| Idioma | Videos | Puntos penalizacion promedio | Peor video (puntos) |
|--------|--------|------------------------------|---------------------|
| EN     |        |                              |                     |
| RU     |        |                              |                     |

TOP 3 PROBLEMAS MAS FRECUENTES
1. _______________  (frecuencia: ___ de ___ videos)
2. _______________  (frecuencia: ___ de ___ videos)
3. _______________  (frecuencia: ___ de ___ videos)

BLACKLIST
- Violaciones detectadas esta semana: ___
- Terminos: _______________

COMPARATIVA VS SEMANA ANTERIOR
- Tasa de aprobacion: ___% → ___% (mejoro / empeoro / igual)
- Problemas recurrentes resueltos: ___
- Problemas nuevos: ___

PARA DECISION DE ANDREA
- [ ] _______________________________________________
- [ ] _______________________________________________
```

---

### Parte 3 — Scorecard mensual (tendencia, para Andrea y el equipo)

```
=== SCORECARD MENSUAL — ________ 2026 ===
Auditora: Gio
Entregado a: Andrea + equipo

RESUMEN DEL MES
- Total videos auditados: ___
- Tasa de aprobacion 1er intento: ___% (meta: >70%)
- Tasa de retrabajo: ___% (meta: <30%)
- Bloqueados: ___ (meta: 0)
- Violaciones de blacklist: ___ (meta: 0)

TENDENCIA (ultimas 4 semanas)
| Semana | Videos | Aprobacion 1er intento | Retrabajo | Bloqueados |
|--------|--------|------------------------|-----------|------------|
| S1     |        |                        |           |            |
| S2     |        |                        |           |            |
| S3     |        |                        |           |            |
| S4     |        |                        |           |            |

POR IDIOMA (acumulado del mes)
| Idioma | Videos | Score promedio | Aprobacion | Problema #1 |
|--------|--------|----------------|------------|-------------|
| EN     |        |                |            |             |
| RU     |        |                |            |             |

PATRONES DETECTADOS ESTE MES
1. _______________ (persistente / nuevo / resuelto)
2. _______________ (persistente / nuevo / resuelto)

RECOMENDACIONES DE GIO PARA ANDREA
(Gio propone, Andrea decide)
- [ ] _______________________________________________
- [ ] _______________________________________________
```

---

## Flujo operativo de Gio

```
Alan/Saul entregan video listo
         |
         v
   Gio recibe video
         |
         v
   Gio escucha completo
   + llena evaluacion por video
         |
         v
   Calcula puntos de penalizacion
         |
    +-----------+-----------+-----------+
    |           |           |           |
  0-4 pts    5-14 pts   15-24 pts    25+ pts
  PASA       OBSERV.    NO PASA     BLOQUEADO
    |           |           |           |
    v           v           v           v
 Publica    Andrea      Saul/Ivan   Andrea
            decide      retrabajan  decide
                |           |
                v           v
            Publica o   Gio re-audita
            retrabaja   cuando este listo
```

---

## Metas trimestrales (para evaluar a Gio)

| Meta | Q1 (baseline) | Q2 (mejora) | Como se mide |
|:-----|:--------------|:------------|:-------------|
| Cobertura de auditoria | 100% de Tier 1 (ES, EN, RU) | 100% Tier 1 + muestreo Tier 2 | Videos auditados / Videos publicados |
| Tiempo de auditoria por video | Establecer baseline | Reducir 20% vs baseline | Cronometro |
| Tasa de aprobacion 1er intento | Establecer baseline | +10% vs baseline | Scorecard semanal |
| Violaciones de blacklist publicadas | Establecer baseline | 0 por mes | Scorecard semanal |
| Entrega de scorecard semanal | 4 de 4 semanas | 4 de 4 semanas | Se entrego o no |
| Patrones documentados | Minimo 2 por mes | Minimo 2 por mes + 1 resuelto | Scorecard mensual |

---

## Lo que NO es responsabilidad de Gio

Para que quede claro y no se mezcle con Andrea:

| Gio NO hace esto | Quien lo hace |
|:-----------------|:-------------|
| Definir que es "calidad aceptable" | Andrea |
| Crear o modificar la blacklist | Andrea |
| Decidir publicar o retirar un video | Andrea |
| Decidir que idiomas producir | Andrea + Daniel |
| Investigar por que falla algo | Daniel |
| Arreglar el audio | Saul/Ivan |
| Coordinar entregas | Alan |
| Construir herramientas de QA automatizado | Ramon |

**Gio SI hace:** escuchar, medir, llenar formatos, detectar patrones, reportar a Andrea, devolver a Saul/Ivan con notas especificas.

---

## Para el viernes 27: que trae Gio

1. **Haber escuchado 2 videos** (1 EN, 1 RU) con el formato de evaluacion por video
2. **Proponer 5-10 criterios** que ella considere que deberian estar en el checklist (Andrea los aprueba o modifica)
3. **Opinion sobre el scorecard:** le funciona este formato? que le cambiaria?

*Basado en: Netflix Dubbing Production Supervisor role, ISO 17100 reviewer independence, MQM severity scoring (Critical=25, Major=5, Minor=1), Papercup/Deepdub human-in-the-loop model.*
