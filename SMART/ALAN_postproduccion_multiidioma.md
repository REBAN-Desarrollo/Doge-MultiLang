# SMART: Alan — Coordinacion Post-produccion + Multi-idioma

> Alan coordina post-produccion con los equipos de multi-idioma. Su rol es asegurar que el proceso de input (guion) a output (27 idiomas publicados) este mapeado, documentado y optimizado.

**Fecha:** 2026-02-21 | **Referencia:** Gold Standard Secciones 3, 10; Levantamientos; Propuesta No Tecnica; REBAN Destilado

---

## 1. CONTEXTO: DONDE ESTAMOS HOY

### Proceso actual (simplificado)

```
INPUT                          PRODUCCION                    OUTPUT
─────                          ──────────                    ──────
Andrea escribe guion (.docx)   Fernando arma audio/video     27 idiomas publicados
     │                              │                             │
     ▼                              ▼                             ▼
  Guion ES                    Video con voz ES              Videos doblados
  (SSOT del texto)            (mezcla final)                (sin revision)
                                    │
                                    ▼
                              Saul/Ivan suben a
                              ElevenLabs Studio
                                    │
                                    ▼
                              ElevenLabs traduce
                              ES → EN → 26 idiomas
                                    │
                                    ▼
                              Se publica TODO
                              (solo EN con QA real)
```

### Datos confirmados del pipeline de dubbing (Q8, DRAFT 70-80%)

- **7 pasos:** Video ES → subir a ElevenLabs (web UI manual) → deteccion speakers → revision manual (solo EN) → correcciones manuales → exportacion por idioma → entrega
- **Input:** Solo video completo — no reciben stems ni guion en texto
- **Fernando exporta** 2 versiones: 16:9 (horizontal) y 9:16 (vertical)
- **Error #1:** Speaker detection incorrecta (correcciones manuales masivas)
- **Voice model** no persiste entre tabs de idioma en ElevenLabs — genera retrabajo
- **Monday.com** tiene cero columnas para dubbing/traduccion — Area 09 opera en aislamiento total
- **KPI-28 estimado:** 0.5-4h de correcciones manuales por episodio (sin baseline formal)
- **No existe protocolo go/no-go operativo** con Gate 0/1/2, Morbo PG-13, FMEA ni score QA por idioma

### Lo que sabemos vs lo que NO sabemos

| Area | Documentado | Gaps |
|:-----|:------------|:-----|
| Guion (Andrea) | Si — Q1, 11_andrea_guion_checklist | Formato exacto del .docx, variaciones entre episodios |
| Animacion/TTS (Ramon, Alan) | Parcial — 06_core_audio_tts, 08_audio_tts_workflow | Proceso de seleccion de voces, criterios de calidad TTS |
| Post-produccion (Fernando) | **INCOMPLETO** — Q7 sin llenar, 11_fernando_daily_ops parcial | Silencios, timing creativo, stems, export format |
| Dubbing (Saul/Ivan) | **INCOMPLETO** — Q8 draft (70-80%), 09_dubbing_workflow | Flujo real en ElevenLabs Studio, speaker merge, revision |
| QA | Casi nulo — 26_02_18_checklist_audio_qa | Cero proceso definido, cero metricas |
| Publicacion | Parcial — REBAN define Gate 0/1/2 + FMEA | Aun no existe flujo operativo ni evidencia por idioma |

### Levantamientos pendientes (BLOCKERS)

| Cuestionario | Persona | Status | Impacto |
|:-------------|:--------|:-------|:--------|
| Q7 | Fernando | **SIN LLENAR** | Bloquea entendimiento de silencios, timing, stems |
| Q8 | Saul/Ivan | **DRAFT 70-80%** | Bloquea entendimiento de flujo ElevenLabs real |

---

## 2. OBJETIVOS SMART

### MACRO: Alan mapea el proceso completo de guion a publicacion, identifica gaps, y asegura que cada handoff tenga inputs/outputs definidos

---

### Objetivo A1: Mapa de proceso end-to-end completo
**S:** Crear un documento que mapee cada paso desde que Andrea termina el guion hasta que 27 idiomas estan publicados, con inputs, outputs, responsable, herramientas y tiempos
**M:** Diagrama de flujo + tabla de pasos con 100% de cobertura (cero pasos "se asume")
**A:** Basado en levantamientos existentes + entrevistas con Fernando y Saul/Ivan
**R:** Sin mapa, nadie sabe el flujo real — las propuestas de mejora parten de suposiciones
**T:** Semana 4

#### Entregables micro

| # | Entregable | Responsable | Deadline | Criterio |
|:--|:-----------|:------------|:---------|:---------|
| A1.1 | Compilar flujo actual desde levantamientos existentes (Q1, Q2, Q7, Q8, flujo_actual.md) | Alan | Semana 1 | Borrador con pasos conocidos y marcados "GAP: falta info" donde no hay datos |
| A1.2 | Entrevista con Fernando (30 min) para cerrar Q7 | Alan + Fernando | Semana 2 | Q7 completado al 100% — silencios, timing, formato export, stems |
| A1.3 | Entrevista con Saul/Ivan (30 min) para validar Q8 | Alan + Saul/Ivan | Semana 2 | Q8 validado — flujo real en ElevenLabs Studio, speaker mapping, revision |
| A1.4 | Mapa de proceso v1 (diagrama + tabla) | Alan | Semana 3 | Cada paso con: responsable, input, output, herramienta, tiempo promedio |
| A1.5 | Validacion del mapa con cada responsable | Alan + todos | Semana 4 | Cada persona confirma que SU parte esta correcta |

---

### Objetivo A2: Identificar y documentar gaps de handoff
**S:** Para cada handoff entre personas/sistemas, documentar que informacion se pierde, que falta, y que causa retrabajo
**M:** Tabla de handoffs con semaforo (verde/amarillo/rojo) y propuestas de solucion
**A:** Sale directamente del mapa de proceso A1
**R:** Los errores de QPH se amplifican en cada handoff no documentado
**T:** Semana 5

#### Entregables micro

| # | Entregable | Responsable | Deadline |
|:--|:-----------|:------------|:---------|
| A2.1 | Lista de handoffs: Andrea→Animacion, Animacion→Fernando, Fernando→Saul/Ivan, Saul/Ivan→Publicacion | Alan | Semana 3 |
| A2.2 | Por cada handoff: que informacion viaja, que formato, que se pierde | Alan | Semana 4 |
| A2.3 | Semaforo por handoff + propuesta de solucion para los rojos | Alan | Semana 5 |

#### Preguntas clave por handoff

**Andrea → Animacion/TTS:**
- En que formato exacto entrega Andrea el guion? (.docx con Table 2? Table 4? Solo texto?)
- Quien decide que voces se usan para cada personaje?
- Como se comunican cambios de ultimo momento al guion?

**Animacion/TTS → Fernando:**
- Fernando recibe archivos individuales por escena o un video completo?
- En que formato? (WAV, MP3, MP4, proyecto After Effects?)
- Fernando tiene acceso al guion original o solo al audio?

**Fernando → Saul/Ivan:** *(parcialmente respondido por Q8)*
- ~~Fernando entrega un MP4 final o archivos separados (stems)?~~ **RESPONDIDO:** Solo video completo, no stems
- ~~Saul/Ivan reciben instrucciones especificas o solo el video?~~ **RESPONDIDO:** Solo el video
- Existe un checklist de "listo para dubbing"?

**Saul/Ivan → ElevenLabs:** *(parcialmente respondido por Q8)*
- ~~Suben via Web UI manualmente o hay algun script?~~ **RESPONDIDO:** Web UI manual, no usan API
- Como manejan los 27 idiomas? (uno por uno? batch?)
- Cuanto tiempo toma procesar 1 episodio x 27 idiomas?
- ~~Revisan TODOS los idiomas o solo EN?~~ **RESPONDIDO:** Solo EN

**ElevenLabs → Publicacion:**
- Quien descarga los 27 archivos doblados?
- Hay revision antes de publicar o se publican directo?
- Cuanto tiempo pasa entre dubbing listo y publicado?

---

### Objetivo A3: Documentar tiempos y cuellos de botella
**S:** Medir cuanto tiempo toma cada paso del pipeline para 1 episodio tipico
**M:** Timeline con horas/dias por paso, marcando cuellos de botella
**A:** Informacion de entrevistas + observacion de 1 ciclo real
**R:** Sin tiempos, no se puede optimizar ni planear capacidad
**T:** Semana 6

#### Entregables micro

| # | Entregable | Responsable | Deadline |
|:--|:-----------|:------------|:---------|
| A3.1 | Estimacion de tiempos por paso (auto-reportado por cada persona) | Alan | Semana 4 |
| A3.2 | Observacion de 1 ciclo real (tracking de 1 episodio end-to-end) | Alan | Semana 5 |
| A3.3 | Timeline visual + identificacion de top 3 cuellos de botella | Alan | Semana 6 |

---

### Objetivo A4: Protocolo de publicacion multi-idioma (Gates + QA REBAN)
**S:** Definir y operar criterios de go/no-go por idioma usando Gate 0/1/2, Morbo PG-13 y scorecards de QA
**M:** Checklist operativo por idioma que exige: audio tecnico REBAN, rubrica vocal 5D >= 4.0, checklist narrativo >= 10/12, cero violaciones Cat A/Gate 1 y triage Gate 2 ejecutado
**A:** Basado en Gold Standard tiering (T1: humano+auto, T2: sampling 30%, T3: auto) + REBAN Destilado
**R:** Hoy se publica todo sin criterio — esto es insostenible para contenido infantil
**T:** Semana 9

#### Entregables micro

| # | Entregable | Responsable | Deadline |
|:--|:-----------|:------------|:---------|
| A4.1 | Mapear Gate 0/1/2 a pasos del pipeline real (owner, evidencia, SLA) | Alan + Andrea | Semana 6 |
| A4.2 | Definir PASS/FAIL por tier con umbrales (audio >=4.0, narrativa >=10/12, detonador 20-40s, 0 anti-patrones criticos) | Alan + Gio | Semana 7 |
| A4.3 | Disenar matriz de triage post-publicacion (claims, copyright, lenguaje sensible) | Alan + Gio | Semana 8 |
| A4.4 | Checklist operativo + template de evidencia por idioma | Alan | Semana 8 |
| A4.5 | Piloto: aplicar checklist en 1 episodio real (5 idiomas Tier 1) y documentar go/no-go | Alan + Gio | Semana 9 |

---

## 3. DEPENDENCIAS

| Alan necesita de... | Que | Para cuando |
|:--------------------|:----|:------------|
| **Fernando** | 30 min de entrevista para completar Q7 | Semana 2 |
| **Saul/Ivan** | 30 min de entrevista para validar Q8 | Semana 2 |
| **Andrea** | Confirmacion del formato de entrega del guion | Semana 1 |
| **Daniel** | Contexto tecnico del Gold Standard para entender el pipeline propuesto | Semana 1 |
| **Gio** | Apoyo en definicion de criterios de calidad para publicacion | Semana 5 |

## 4. PREGUNTAS ABIERTAS (lo que falta en los levantamientos)

### Sobre Fernando (Q7 — sin llenar)
1. Cuando Fernando modifica timing/velocidad en post, como se enteran Saul/Ivan del cambio?
2. Fernando puede exportar stems (pistas separadas por personaje)?
3. Cuantas horas dedica Fernando a 1 episodio promedio?
4. Fernando tiene acceso al guion original de Andrea o trabaja solo con el audio?
5. Que pasa cuando Fernando detecta un error en el guion despues de animar?

### Sobre Saul/Ivan (Q8 — draft 70-80%)
6. ~~Cuantos idiomas revisan manualmente? (solo EN o alguno mas?)~~ **RESPONDIDO:** Solo EN
7. Cuanto tiempo toma dubbing de 1 episodio en ElevenLabs Studio?
8. Han detectado errores graves de traduccion en algun idioma? Cuales?
9. Usan algun criterio para decidir si un dubbing "esta bien" o lo regeneran?
10. Estarian dispuestos a migrar a un flujo via API en vez de Web UI?

### Sobre el proceso general
11. Existe un "episodio tipo" documentado (duracion, # personajes, # escenas)?
12. Cuantos episodios se producen por semana/mes?
13. ~~Hay algun cuello de botella que cause retrasos recurrentes?~~ **PARCIAL:** Speaker detection incorrecta es error #1 (Q8)
14. Quien toma la decision final de "esto se publica"?
15. Existe algun proceso de rollback si se detecta un error post-publicacion?
