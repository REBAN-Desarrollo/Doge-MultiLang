# SMART: Alan — Coordinacion Post-produccion + Multi-idioma

> Alan coordina post-produccion con los equipos de multi-idioma. Su rol es asegurar que el proceso de input (guion) a output (27 idiomas publicados) este mapeado, documentado y optimizado.

**Fecha:** 2026-02-20 | **Referencia:** Gold Standard Secciones 3, 10; Levantamientos; Propuesta No Tecnica

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
                              (cero QA en 26 idiomas)
```

### Lo que sabemos vs lo que NO sabemos

| Area | Documentado | Gaps |
|:-----|:------------|:-----|
| Guion (Andrea) | Si — Q1, 11_andrea_guion_checklist | Formato exacto del .docx, variaciones entre episodios |
| Animacion/TTS (Ramon, Alan) | Parcial — 06_core_audio_tts, 08_audio_tts_workflow | Proceso de seleccion de voces, criterios de calidad TTS |
| Post-produccion (Fernando) | **INCOMPLETO** — Q7 sin llenar, 11_fernando_daily_ops parcial | Silencios, timing creativo, stems, export format |
| Dubbing (Saul/Ivan) | **INCOMPLETO** — Q8 draft (70-80%), 09_dubbing_workflow | Flujo real en ElevenLabs Studio, speaker merge, revision |
| QA | Casi nulo — 26_02_18_checklist_audio_qa | Cero proceso definido, cero metricas |
| Publicacion | No documentado | Quien publica, criterios de go/no-go, distribucion |

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

**Fernando → Saul/Ivan:**
- Fernando entrega un MP4 final o archivos separados (stems)?
- Saul/Ivan reciben instrucciones especificas o solo el video?
- Existe un checklist de "listo para dubbing"?

**Saul/Ivan → ElevenLabs:**
- Suben via Web UI manualmente o hay algun script?
- Como manejan los 27 idiomas? (uno por uno? batch?)
- Cuanto tiempo toma procesar 1 episodio x 27 idiomas?
- Revisan TODOS los idiomas o solo EN?

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

### Objetivo A4: Protocolo de publicacion multi-idioma
**S:** Definir criterios de go/no-go para publicar cada idioma
**M:** Checklist de publicacion con criterios minimos por tier
**A:** Basado en Gold Standard tiering (T1: humano+auto, T2: sampling 30%, T3: auto)
**R:** Hoy se publica todo sin criterio — esto es insostenible para contenido infantil
**T:** Semana 8

#### Entregables micro

| # | Entregable | Responsable | Deadline |
|:--|:-----------|:------------|:---------|
| A4.1 | Definir criterios minimos para publicar Tier 1 (con Andrea) | Alan + Andrea | Semana 5 |
| A4.2 | Definir criterios para Tier 2 y Tier 3 | Alan + Gio | Semana 6 |
| A4.3 | Checklist de publicacion (documento operativo) | Alan | Semana 7 |
| A4.4 | Piloto: aplicar checklist a 1 episodio real | Alan + Gio | Semana 8 |

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
6. Cuantos idiomas revisan manualmente? (solo EN o alguno mas?)
7. Cuanto tiempo toma dubbing de 1 episodio en ElevenLabs Studio?
8. Han detectado errores graves de traduccion en algun idioma? Cuales?
9. Usan algun criterio para decidir si un dubbing "esta bien" o lo regeneran?
10. Estarian dispuestos a migrar a un flujo via API en vez de Web UI?

### Sobre el proceso general
11. Existe un "episodio tipo" documentado (duracion, # personajes, # escenas)?
12. Cuantos episodios se producen por semana/mes?
13. Hay algun cuello de botella que cause retrasos recurrentes?
14. Quien toma la decision final de "esto se publica"?
15. Existe algun proceso de rollback si se detecta un error post-publicacion?
