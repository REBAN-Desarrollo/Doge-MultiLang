# 04_EVIDENCE — Destilado Multi-Idioma

> Contenido relevante a dubbing, traducciones, audio y multi-idioma extraido de 15 archivos en `AI-Studio/docs/product/projects/video-qph/04_EVIDENCE/`. Solo se incluye lo que aporta al proyecto Doge-MultiLang.

**Fecha de extraccion:** 2026-02-20 | **Metodo:** Swarm de 9 agentes con filtro: dubbing, traduccion, audio quality, ElevenLabs, multi-idioma

---

## 1. PIPELINE DE DUBBING ACTUAL (Q8 — Saul/Ivan, DRAFT 70-80%)

### Flujo de 7 pasos

```
Video ES completo
    → Subir a ElevenLabs (web UI manual)
    → Deteccion automatica de speakers
    → Revision manual de speakers (solo EN)
    → Correcciones manuales
    → Exportacion por idioma
    → Entrega (sin QA en 26 idiomas)
```

### Inputs para dubbing

- Video completo con audio en espanol
- Fernando exporta 2 versiones: 16:9 (horizontal) y 9:16 (vertical)
- No reciben stems separados ni guion en texto — solo el video

### Division de trabajo Saul/Ivan

- Division por idioma o por episodio (no documentado formalmente)
- Uno sube, otro revisa (en teoria)
- Gate de aprobacion: ellos deciden cuando esta listo

---

## 2. DATOS OPERATIVOS

| Dato | Valor | Fuente |
|:-----|:------|:-------|
| Idiomas activos | **16** (Q8 corrige al PRD que decia 17) | QX_ANEXO |
| Idiomas activos (Gold Standard) | **27** (incluye todos los canales) | FRAMEWORK |
| Core languages hoy | **~5** | Q10 Daniel |
| ElevenLabs plan | Suscripcion pagada, **sin contrato ni SLA** | SESIONES |
| ElevenLabs budget | **$600-900 USD/mes** | SESIONES |
| ElevenLabs interface | **Solo web UI** — no usan API | QX_ANEXO |
| Plan B si ElevenLabs cae | **No existe** | QX_ANEXO |
| Canciones | **Instrumentales** (no requieren traduccion) | SESIONES |
| Pistas de audio por episodio | **13** (Andrea verifica 2-3 intuitivamente) | QX_ANEXO |
| Revenue target | **$700K-$1M MXN/mes** (triplicar) | Q10 |

---

## 3. QA DE AUDIO Y DUBBING

### Hallazgo critico: solo EN tiene QA real

- **Solo ingles** recibe revision manual linguistica
- **15/16 idiomas restantes** se publican sin revision
- Andrea verifica 2-3 idiomas intuitivamente (EN, JA) de las 13 pistas
- No existe checklist formal de publicacion multi-idioma

### 13 tracks de calidad (checklist creado 2026-02-17)

Checklist validado por Fernando + Saul/Ivan. Cubre:
- Niveles de audio normalizados
- Separacion musica vs dialogos
- Sincronizacion SFX
- Deteccion de silencios/ruido
- Sincronizacion audio-video

### Criterios de rechazo (Q4 — Gio QA)

- Audio desincronizado con animacion
- Calidad de audio deficiente (ruido, distorsion)
- Volumen incorrecto, musica demasiado fuerte
- SFX desincronizado, glitches de audio

---

## 4. GAPS CRITICOS EN DUBBING

### Gaps confirmados (ROLES — G16 a G21)

| Gap | Descripcion | Severidad |
|:----|:------------|:----------|
| G16 | No hay evaluacion de ROI por idioma — 27 idiomas sin metricas | Alta |
| G17 | No hay WER ni tasa de error por idioma | Alta |
| G18 | No hay blacklist por idioma — resuelven caso por caso | Alta |
| G19 | 26 idiomas sin validacion real (solo EN) | Critica |
| G20 | Speaker detection: correcciones manuales masivas (error #1) | Alta |
| G21 | No hay localizacion cultural por idioma | Media |

### Gaps adicionales (MATRIX)

| Gap | Descripcion | Severidad |
|:----|:------------|:----------|
| G8 | No hay catalogo de mapeo voz-personaje | Baja |
| G9 | No hay WER tracking por idioma | Baja |
| G12 | No hay blacklist centralizada de restricciones | Baja |

### Errores frecuentes reportados (Q8 — Saul/Ivan)

1. **Speaker detection incorrecta** — personaje 2 detectado como 1 (error #1)
2. Texto de traduccion incorrecto
3. Nombres propios mal traducidos
4. Onomatopeyas mal traducidas
5. Numeros leidos incorrectamente
6. Pronombres incorrectos
7. Tono/emocion no coincide
8. Timing desincronizado

### Problemas de ElevenLabs UI (Q8)

- Voice model no persiste entre tabs de idioma — genera retrabajo manual
- No priorizan idiomas — no evaluan cuales mantener y cuales no

---

## 5. DECISIONES ESTRATEGICAS

### Multi-idioma es prioridad no negociable (Q10 — Daniel)

> Multi-idioma (al menos el tracking) no se sacrifica bajo ninguna circunstancia.

- Vision 12 meses: de ~5 core languages a experiencia multiidioma global
- Revenue: triplicar de actual a $700K-$1M MXN/mes
- Equipo: mismo tamano (~20), mas eficiente

### Decisiones tomadas (SESIONES)

| Decision | Resultado |
|:---------|:---------|
| Plan B ElevenLabs | No existe. Riesgo bajo (empresa grande). Por explorar. |
| SLA ElevenLabs | No hay contrato. Solo suscripcion pagada. |
| Canciones en traduccion | N/A — todas son instrumentales |

### Monday.com: dubbing fuera de tracking

- Monday no tiene columnas para dubbing/traduccion
- 27 idiomas operan completamente fuera de Monday y cualquier sistema de tracking
- Area 09 (Traduccion/Dubbing) en aislamiento total del project management

---

## 6. KPIs DE DUBBING (sin baseline)

| KPI ID | Nombre | Formula | Baseline | Target | Owner |
|:-------|:-------|:--------|:---------|:-------|:------|
| KPI-27 | Dubbing Throughput | episodes_dubbed / week (all languages) | TBD | TBD | Saul/Ivan |
| KPI-28 | Manual Correction Time | hours_manual_corrections / episode | TBD (est. 0.5-4h) | <1h | Saul/Ivan |

**Faltan KPIs para:** calidad de traduccion, turnaround time, throughput por idioma, tasa de error, WER

---

## 7. TECNICAS DE PRODUCCION RELEVANTES (REBAN Audit)

### Audio design (aplicable a dubbing)

- **7 capas de sonido:** armas, efectos, impactos, tela/detalles, ambiente, vehiculos, musica
- **J-Cut:** audio 2-3 frames antes del corte visual
- **Capas independientes:** completar una capa antes de mezclar la siguiente
- **Check tecnico:** verificacion sistematica de audio + color antes de entrega

### Adaptacion multi-formato

- Adaptacion de contenido por formato y cultura
- Optimizacion SEO multi-idioma (titulos/descripciones por idioma)
- Clips repurposing para otros mercados/idiomas

### Gaps en REBAN

| Gap | Area | Severidad |
|:----|:-----|:----------|
| TTS / Voces sinteticas (ElevenLabs) | C3 Audio/TTS | Alta |
| Traduccion / Dubbing / Localizacion | C8 Traduccion | Media |
| SFX para animacion (Foley, ambientes) | C4 Musica/SFX | Media |

REBAN no cubre TTS ni dubbing. QPH debe crear sus propias best practices.

---

## 8. PIPELINE ERP — DUBBING FEATURES MAPEADAS

### P0 (criticos)

| Feature | Descripcion | ERP Status |
|:--------|:------------|:-----------|
| B1 | Proceso completo de dubbing (7 pasos) | Covered |
| B2 | Input requirements para dubbing | Covered |
| D1 | QA por idioma (todos, solo EN, top 3-4) | Partial |
| D3-stems | Audio separado para dubbing (stems, solo voz, video completo) | Partial |
| G1 | Tiempo dubbing completo todos idiomas | Covered |
| H4 | Gate de aprobacion dubbing | Covered |

### P1 (importantes)

| Feature | Descripcion | ERP Status |
|:--------|:------------|:-----------|
| C1 | Asignacion voces a personajes | Gap |
| C3 | Catalogo voz-personaje | Gap |
| D3-errores | Categorias de defectos dubbing | Partial |
| F3 | Tiempo en correcciones manuales | Partial |
| G2 | Throughput dubbing (episodios/semana) | Covered |
| G3 | Dubbing como cuello de botella | Partial |
| H1 | Division de trabajo Saul/Ivan | Partial |

---

## 9. FUENTES

| Archivo 04_EVIDENCE | Contenido relevante |
|:---------------------|:-------------------|
| BASELINE_PRODUCCION_OPERATIVA.md | Nada relevante |
| KPI_FRAMEWORK_V2.md + KPI_TARGETS.md | 2 KPIs TBD (KPI-27, KPI-28) |
| FRAMEWORK_VALIDATION_REPORT.md | Area 09 gap critico, Monday sin tracking dubbing |
| EXTRACTED_ROLES_AND_TIMING.md | Pipeline Q8 completo, 6 gaps (G16-G21), errores frecuentes |
| QX_ANEXO_EXPRESS.md | 7 hallazgos criticos ElevenLabs, 16 idiomas, sin QA 15/16 |
| SESIONES_CIERRE_FASE_0.md | Decisiones: no plan B, no SLA, $600-900/mes, canciones instrumentales |
| Q3_GUIONISTAS.md | Nada relevante |
| Q4_GIO_QA.md | Criterios de rechazo audio, checklist tecnico |
| Q5_ANIMADORES.md | Nada relevante |
| Q6_NADIA_PORTADAS.md | Nada relevante |
| Q9_IRIS_OPERACIONES.md | Solo referencia a C7 (celda dubbing) |
| Q10_DANIEL_SPONSOR.md | Multi-idioma no negociable, vision 5→global, revenue target |
| QUESTIONNAIRE_TO_ERP_MATRIX.md | Pipeline dubbing mapeado a ERP, 13 tracks QA, gaps G8/G9/G12 |
| GOLD_AUDIT_REPORT_2026-02-17.md | Checklist audio QA creado (13 tracks) |
| REBAN_TECHNIQUES_AUDIT.md | Tecnicas audio, gaps TTS/dubbing, adaptacion multi-formato |
