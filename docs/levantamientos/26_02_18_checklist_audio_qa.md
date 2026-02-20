# Checklist: Audio QA Estandarizado

**Tiempo:** 30-45 min | **Responsable:** Fernando (C4/C5) + Gio (QA Lead)
**Cuando:** Antes de enviar episodio a publicacion. Despues del master final de Fernando.
**Aplica a:** Episodios principales (8-12 min). Para shorts ver `13_shorts_pipeline.md`.

---

## Proposito

Validar que el audio de cada episodio QPH cumple estandares de calidad antes de publicacion. Cubre 13 pistas de calidad desde voz hasta doblaje multi-idioma. Cada pista tiene criterio PASS/FAIL claro.

> **Principio:** Un episodio con audio deficiente pierde retension aunque la animacion sea excelente. Este checklist es el ultimo gate de audio antes de publicar.

---

## Pista 1: Claridad y Volumen de Voz

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Dialogos audibles sin esfuerzo | Voz principal nunca queda por debajo de la musica de fondo | DAW / escucha manual | Fernando | Cada episodio |
| Nivel de dialogo normalizado | Promedio de -14 LUFS (estandar YouTube). Picos no mayores a -1 dBFS | DAW (medidor LUFS) | Fernando | Cada episodio |
| No hay personajes con volumen inconsistente | Diferencia entre personajes < 3 dB | DAW | Fernando | Cada episodio |

```
[ ] Dialogos audibles y priorizados sobre BGM en toda la duracion
[ ] Nivel -14 LUFS confirmado (medicion con meter de DAW)
[ ] Todos los personajes dentro de rango de volumen consistente
```

---

## Pista 2: Temporalizacion y Sincronizacion de SFX

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| SFX cuadra con la accion visual | El sonido ocurre en el mismo frame que la accion (margen <= 2 frames) | After Effects / Premiere | Fernando | Cada episodio |
| Acotaciones del guion cubiertas | Cada SFX descrito en guion ("puerta azotandose", "explosion") aparece en el audio | Guion + audio | Fernando | Cada episodio |
| No hay SFX huerfanos | Ningun SFX suena sin accion visual correspondiente | Revision auditiva + visual | Gio | Cada episodio |

```
[ ] SFX alineados con accion visual (sin desfase perceptible)
[ ] Todas las acotaciones de SFX del guion presentes en el episodio
[ ] Sin SFX fuera de contexto o huerfanos
```

---

## Pista 3: Niveles de Musica de Fondo (BGM)

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| BGM no opaca la voz | Diferencia minima de 6 dB entre voz y BGM cuando hay dialogo | DAW | Fernando | Cada episodio |
| BGM baja en momentos de dialogo | Ducking aplicado correctamente: la musica cede cuando hablan | DAW (ducking/sidechain) | Fernando | Cada episodio |
| BGM coherente con mood de la escena | Musica feliz en escenas felices, suspenso en escenas de tension | Escucha manual | Fernando + Gio | Cada episodio |

```
[ ] Diferencia voz/BGM >= 6 dB durante dialogos
[ ] Ducking correcto: BGM baja cuando hay voz
[ ] Mood de la musica alineado con las escenas del episodio
```

---

## Pista 4: Sincronizacion Audio-Animacion

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Dialogos sincronizados con animacion de labios | Si hay "lip sync" animado, el audio no esta desfasado mas de 3 frames | Premiere / After Effects | Fernando | Cada episodio |
| Audio de un personaje no arranca antes de que aparezca en pantalla | El audio de cada personaje empieza cuando el personaje entra en escena | Revision visual + auditiva | Fernando | Cada episodio |
| Transiciones de audio cuadran con cortes de video | Fade in/out de audio alineados con cortes de escena | DAW | Fernando | Cada episodio |

```
[ ] Lip sync sin desfase visible (si aplica al episodio)
[ ] Audio de cada personaje inicia cuando corresponde visualmente
[ ] Transiciones de audio alineadas con cortes de video
```

---

## Pista 5: Sin Clipping ni Distorsion

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Sin clipping digital | Picos del master no superan 0 dBFS | DAW (peak meter) | Fernando | Cada episodio |
| Sin distorsion auditiva | No se escucha saturacion, crujidos ni artefactos digitales | Escucha manual + forma de onda | Fernando | Cada episodio |
| Limiter aplicado correctamente | Limiter activado en el master con ceiling a -1 dBFS | DAW | Fernando | Cada episodio |

```
[ ] Picos del master NO superan 0 dBFS (peak meter en verde/amarillo)
[ ] Sin distorsion auditiva detectable en todo el episodio
[ ] Limiter activo en master chain con ceiling correcto
```

---

## Pista 6: Volumen Consistente a lo Largo del Episodio

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Escenas consecutivas tienen volumen similar | No hay saltos bruscos de volumen entre escenas (diferencia < 4 dB) | DAW (LUFS integrado) | Fernando | Cada episodio |
| Primer minuto no es mas silencioso que el resto | El gancho inicial tiene el mismo nivel que el cuerpo del video | DAW | Fernando | Cada episodio |
| Ultimo minuto (cierre) normalizado igual | El outro no se escucha mas fuerte ni mas silencioso que el resto | DAW | Fernando | Cada episodio |

```
[ ] Sin saltos de volumen bruscos entre escenas
[ ] Primer minuto (gancho) al mismo nivel que el cuerpo
[ ] Outro/cierre al mismo nivel que el resto del episodio
```

---

## Pista 7: Calidad de Audio de Intro y Outro

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Jingle de intro claro y reconocible | Jingle de QPH audible sin distorsion. Mismo nivel en todos los episodios | Escucha manual | Fernando | Cada episodio |
| Outro finaliza limpiamente | El audio del outro no se corta de forma abrupta; hace fade out completo | DAW / escucha manual | Fernando | Cada episodio |
| Consistencia de intro/outro entre episodios | El jingle de intro/outro es identico en todos los capitulos de la misma serie | Comparacion con episodio previo | Gio | Mensual |

```
[ ] Jingle de intro suena correctamente, sin distorsion
[ ] Outro tiene fade out limpio (sin corte abrupto)
[ ] Intro/outro identicos al episodio previo de la misma serie
```

---

## Pista 8: Sonidos de Transicion

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Transiciones entre escenas tienen audio suave | No hay saltos de silencio o ruido entre escenas. Se usan fade in/out o stings | DAW | Fernando | Cada episodio |
| Stings de transicion no interrumpen dialogos | Ningun sonido de transicion corta un dialogo activo | Revision auditiva | Fernando | Cada episodio |
| Silencio entre escenas dentro de rango aceptable | Silencios entre escenas: maximo 0.5 segundos si son intencionales | DAW (timeline) | Fernando | Cada episodio |

```
[ ] Transiciones de audio suaves en todos los cortes de escena
[ ] Ningun sting interrumpe un dialogo activo
[ ] Silencios entre escenas dentro de rango (<= 0.5 s si intencional)
```

---

## Pista 9: Verificacion de Ruido de Fondo

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Sin ruido ambiental no intencional | No se escuchan artefactos de grabacion, hum electrico ni ruido de clic en TTS | Escucha manual + spectrum analyzer | Fernando | Cada episodio |
| Silencios absolutos son limpios | Los momentos de pausa no tienen zumbido de fondo ni ruido blanco | DAW (zoom en timeline silencioso) | Fernando | Cada episodio |
| TTS sin artefactos de generacion | Audio generado por ElevenLabs no tiene glitches ni sonidos fantasma | Escucha manual | Ramon | Por generacion |

```
[ ] Sin ruido ambiental no intencional detectable
[ ] Silencios absolutos limpios (sin hum ni ruido blanco)
[ ] Audio TTS libre de artefactos de generacion (glitches, clicks)
```

---

## Pista 10: Calidad TTS ElevenLabs (Herramienta Web)

> **Nota:** ElevenLabs se usa via herramienta web (Studio + API). Esta pista aplica despues de cada sesion de generacion TTS antes de entregar a post-produccion.

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Voces correctas asignadas a personajes | Cada personaje usa el VoiceID correcto del manifest. Narrador usa la voz de serie | VoiceMapper / manifest.json | Ramon | Cada episodio |
| Sin bug "no." interpretado como "number" | El sanitizador regex elimino `no.` -> `no` antes de generacion | Escucha manual + logs | Ramon (sistema) | Cada generacion |
| Audio no muestra "efecto ardilla" | Dialogos no suenan acelerados (timing ratio < 15 chars/seg) | Escucha manual | Ramon | Cada episodio |
| Dialogos emocionales tienen entonacion correcta | Escenas de climax/drama suenan con emocion adecuada (no monotono) | Escucha manual (Tier 2-3) | Ramon | Escenas criticas |

```
[ ] Todos los personajes con VoiceID correcto (validar contra manifest.json)
[ ] Sin bug "no. -> number" (logs del sanitizador sin errores)
[ ] Velocidad de habla natural (sin efecto ardilla)
[ ] Entonacion correcta en escenas emocionales
```

---

## Pista 11: Sincronizacion de Doblaje Multi-Idioma

> **Cuando aplica:** Solo episodios con doblaje activo. Coordinar con Saul/Ivan (C7).

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Ingles (master) aprobado antes de generar otros idiomas | EN revisado 100% por Saul/Ivan. COMET score > 0.85 | ElevenLabs Dubbing Studio | Saul/Ivan | Cada episodio |
| Dubbing no excede duracion de escena en mas de 20% | El audio doblado no "se come" frames de la escena siguiente | ElevenLabs timeline | Saul/Ivan | Por idioma |
| Timing drift corregido | Silencios cosechados correctamente; audio no se desplaza del video | ElevenLabs Studio | Saul/Ivan | Por idioma |
| Zero Category A en filtros de seguridad | Ningun idioma tiene contenido bloqueado por filtros de ElevenLabs | ElevenLabs (blacklist scan) | Sistema | Cada episodio |

```
[ ] EN master aprobado (100% human review + COMET > 0.85)
[ ] Duracion de dubbing dentro de +20% de duracion original por escena
[ ] Timing drift corregido (silencios cosechados manualmente si necesario)
[ ] Zero Category A en todos los idiomas procesados
```

---

## Pista 12: Verificacion WER (Word Error Rate)

> **Metodo:** Sistema transcribe el audio generado (Whisper + Gemini Flash) y compara contra el guion original. Thresholds por tier.

| Idioma / Tier | WER Maximo | Accion si Excede | Herramienta | Quien |
|:--------------|:-----------|:-----------------|:------------|:------|
| **ES (TTS original)** | 10% promedio | Re-generar segmento con VoiceID correcto | Whisper + Gemini | Ramon (sistema) |
| **EN (Tier 1 master)** | 5% | Bloquear: no generar otros idiomas hasta resolver | ElevenLabs STT | Saul/Ivan |
| **PT-BR, FR, DE (Tier 1)** | 5% | Revision humana obligatoria, re-generar | ElevenLabs STT | Saul/Ivan |
| **AR, KO, JA, HI, ZH (Tier 2)** | 10% | Muestreo inteligente, escalar a humano si hay flags | Sistema | Saul/Ivan |
| **Otros idiomas (Tier 3)** | 15% | Solo automatico; escalar si metricas < umbral | Sistema | Sistema |

```
[ ] WER de TTS en espanol < 10% (reporte de sistema)
[ ] WER de EN master < 5% antes de generar otros idiomas
[ ] WER Tier 1 (PT-BR, FR, DE) < 5%
[ ] WER Tier 2 (AR, KO, JA, HI, ZH) < 10%
[ ] WER Tier 3 (otros idiomas) < 15%
```

---

## Pista 13: Revision Final del Master de Audio

> **Este es el gate BLOQUEANTE final. Si falla cualquier item, el episodio NO se publica.**

| Item | Criterio PASS | Herramienta | Quien | Frecuencia |
|:-----|:--------------|:------------|:------|:-----------|
| Reproduccion completa de revision | Gio (QA) escucha el episodio completo en orden, sin saltar | Escucha manual | Gio | Cada episodio |
| Mix balanceado end-to-end | Voz, BGM y SFX nunca compiten. Jerarquia: Voz > SFX > BGM | Escucha manual | Gio | Cada episodio |
| Sin errores de continuidad de audio | No hay cortes abruptos, repeticion de lineas, ni silencios anomalos > 2 s | Escucha manual | Gio | Cada episodio |
| Coherencia narrativa del audio | El audio refuerza la emocion de la historia (no contradice el mood visual) | Criterio editorial | Gio | Cada episodio |

```
[ ] Reproduccion completa realizada (no skip)
[ ] Mix balanceado en todo el episodio
[ ] Sin errores de continuidad de audio
[ ] Audio coherente con la narrativa visual del episodio

=> SI TODOS PASS: AUDIO APROBADO PARA PUBLICACION
=> SI ALGUNO FALLA: Devolver a Fernando con ticket en #qph-bloqueos
```

---

## Tabla Resumen por Responsable

| Responsable | Pistas a Cubrir | Cuando |
|:------------|:----------------|:-------|
| **Ramon (C3 Audio)** | 10 (TTS ElevenLabs), 9 (ruido en TTS), 12 (WER ES) | Despues de cada sesion TTS |
| **Saul/Ivan (C7 Dubbing)** | 11 (sync dubbing), 12 (WER multi-idioma) | Despues de cada sesion dubbing |
| **Fernando (C4/C5 Post)** | 1, 2, 3, 4, 5, 6, 7, 8, 9 | Al terminar el master de audio |
| **Gio (QA Lead)** | 13 (revision final master) | Antes de enviar a publicacion |

---

## Bloqueadores Comunes y Soluciones

| Bloqueador | Solucion |
|:-----------|:---------|
| "Musica muy fuerte en escenas con dialogo" | Fernando ajusta ducking. BGM baja automaticamente con sidechain |
| "SFX desfasado del video" | Fernando re-alinea en DAW. Si es error de animacion, devolver a animador |
| "WER > 10% en segmento ES" | Ramon re-genera el segmento con VoiceID correcto + texto sanitizado |
| "Dubbing EN no aprobado" | Saul/Ivan corrigen texto en ElevenLabs Studio antes de procesar Tier 2-3 |
| "Clipping en pista final" | Fernando aplica limiter con ceiling -1 dBFS y re-exporta |
| "Artefacto en TTS (glitch/click)" | Ramon regenera el segmento especifico. No regenerar el episodio completo |
| "Ruido de fondo en silencios" | Fernando aplica noise gate o noise reduction en DAW |

---

## Registro de QA

```
Episodio: ________________________
Numero de capitulo: ________________________
Fecha de QA de audio: ________________________
QA de TTS realizado por: ________________________ (Ramon)
QA de post-produccion realizado por: ________________________ (Fernando)
QA de dubbing realizado por: ________________________ (Saul/Ivan, si aplica)
QA final realizado por: ________________________ (Gio)

Pistas fallidas (si aplica): ________________________
Fecha de re-entrega: ________________________
Estado final: [ ] APROBADO   [ ] RECHAZADO - Regresar a: ________________________
```

---

## Notas

- Este checklist complementa (no reemplaza) el `checklist_pre_publicacion.md`.
- Si un item no aplica (ej: episodio sin dubbing), marcar N/A con razon.
- Revisar mensualmente basado en errores reportados por la audiencia (comentarios YouTube).
- **Fuentes:** `00_CORE/06_CORE_AUDIO_TTS.md`, `02_OPERATIONS/08_audio_tts_workflow.md`, `02_OPERATIONS/09_dubbing_workflow.md`, `02_OPERATIONS/10_sonorizacion_workflow.md`, `04_EVIDENCE/QUESTIONNAIRES/Q7_FERNANDO_POSTPROD.md`, `04_EVIDENCE/QUESTIONNAIRES/Q8_SAUL_IVAN_DUBBING.md`.
