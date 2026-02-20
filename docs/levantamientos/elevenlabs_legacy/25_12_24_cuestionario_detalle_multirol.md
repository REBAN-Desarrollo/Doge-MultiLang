# 🎤 Cuestionario de Profundización - Multi-Idiomas

> **Propósito:** Preguntas para entrevistas de seguimiento con cada rol del pipeline.
> **Objetivo:** Identificar detalles técnicos, tiempos, errores frecuentes y oportunidades de mejora.

---

## Instrucciones para el Entrevistador
1. Agendar 30 min por rol
2. Grabar la sesión (con permiso)
3. Llenar respuestas en este documento o copia
4. Priorizar preguntas marcadas con 🔴

---

## A. Entrevista: Guionista (Andrea y equipo)

### Proceso de Escritura
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 1 | ¿Cuánto tiempo toma escribir un guión completo (horas)? | |
| 2 | ¿Usas alguna plantilla o template estándar? | |
| 3 | ¿Cómo decides qué tan neutro es el español? ¿Hay lista de palabras prohibidas? | |
| 🔴 4 | ¿Quién aprueba el guión antes de pasarlo a animación? | |

### Desmontaje Semántico
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 5 | ¿Cómo defines las intenciones/emociones por personaje? ¿Escena por escena? | |
| 6 | ¿Documentas esto en el mismo archivo del guión o separado? | |
| 7 | ¿Has tenido problemas donde el TTS no interpretó bien una emoción? Ejemplo: | |

### Handoff a Animación
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 8 | ¿En qué formato exacto entregas el guión? (Google Doc, .docx, Drive folder?) | |
| 9 | ¿Hay algún paso de "validación de entrega" antes de que animación empiece? | |
| 10 | ¿Has recibido feedback de animación sobre problemas con el guión? | |

### Integraciones Existentes
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 11 | Mencionaron que "arrastran el guión y se colocan fondos/objetos". ¿Qué herramienta hace eso? | |
| 12 | ¿Es un script propio de After Effects, una herramienta web, o algo externo? | |
| 13 | ¿Podríamos usar ese mismo parser para extraer el texto/diálogos estructurados? | |

---

## B. Entrevista: Animadores (Equipo general)

### Recepción del Guión
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 1 | ¿Cómo recibes el guión? ¿Notificación, email, carpeta compartida? | |
| 🔴 2 | ¿El guión viene con timestamps o tiempos sugeridos por escena? | |
| 3 | ¿Alguna vez has tenido que pedir correcciones al guión antes de empezar? | |

### Generación de TTS
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 4 | ¿Qué herramienta/servicio usan para generar el TTS en español? | |
| 5 | ¿Quién hace los ajustes de pitch/velocidad en esta etapa? | |
| 6 | ¿El TTS que generas es el "definitivo" o lo vuelve a procesar Fernando? | |

### Trabajo por Escenas
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 7 | ¿Cuántas escenas animas típicamente por video? | |
| 8 | ¿Cómo nombran/organizan los archivos por escena? | |
| 9 | ¿Cuánto tiempo promedio por escena (minutos/horas)? | |

---

## C. Entrevista: Post-producción (Fernando)

### Ensamblado
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 1 | ¿Qué recibes de los animadores? ¿Proyectos individuales, renders, ambos? | |
| 2 | ¿Cuánto tiempo toma ensamblar un video completo? | |
| 🔴 3 | ¿Qué ajustes de pacing/pitch haces? ¿Es por escena o global? | |

### Exportación para Dubbing
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 4 | ¿Qué formato exacto exportas para ElevenLabs? (MP4, codec, bitrate?) | |
| 5 | ¿Es solo voz limpia o incluye algo de SFX/música? | |
| 6 | ¿Cómo se lo pasas a Saúl/Iván? (Drive, carpeta, directo?) | |

### Problemas Frecuentes
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 7 | ¿Has tenido que rehacer exports por problemas de timing? | |
| 8 | ¿Alguna vez te han pedido re-exportar porque la traducción no cuadró? | |

---

## D. Entrevista: Dubbing (Saúl / Iván)

### Proceso en ElevenLabs
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 1 | ¿Qué plan/tier de ElevenLabs usan? (Dubbing API, Voice Lab, etc.) | |
| 🔴 2 | ¿Subes el MP4 directo o lo conviertes antes? | |
| 3 | ¿ElevenLabs tiene la opción de meter el texto del guión como referencia? | |

### Detección de Texto
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 4 | ¿Con qué frecuencia ElevenLabs detecta mal el texto? (1/10, 5/10?) | |
| 5 | ¿Cuáles son los errores más comunes? (onomatopeyas, números, pronombres?) | |
| 6 | ¿Cuánto tiempo te toma corregir el texto detectado por video? | |

### Transformación ES → EN
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 7 | ¿Revisas cada línea de la traducción al inglés o solo las que "se ven mal"? | |
| 8 | ¿Qué tipo de errores corriges más frecuentemente en inglés? | |
| 9 | ¿Tienes una lista o checklist de cosas que revisar? | |

### Transformación EN → Otros
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 10 | ¿Revisas ALGÚN otro idioma además de inglés? | |
| 11 | ¿Hay idiomas que dan más problemas que otros? ¿Cuáles? | |
| 12 | ¿Cómo sabes si una traducción al árabe/ruso/japonés está bien? | |

### Timings
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 13 | ¿Con qué frecuencia tienes que ajustar timings manualmente? | |
| 14 | ¿Cómo los ajustas? ¿En la interfaz de ElevenLabs o post-exportación? | |
| 15 | ¿Hay idiomas que siempre quedan largos/cortos? | |

### Exportación Final
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 16 | ¿En qué formato exportas cada idioma? | |
| 17 | ¿Dónde los subes/almacenas? | |
| 18 | ¿Quién decide cuándo está listo para publicar? | |

---

## E. Preguntas Técnicas (Para quien conozca la API)

### ElevenLabs Dubbing API
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 🔴 1 | ¿Usan la API programáticamente o solo la interfaz web? | |
| 2 | ¿La API permite enviar timestamps de segmentación? | |
| 3 | ¿La API permite enviar texto de referencia junto con el audio? | |
| 4 | ¿Cuál es el costo por minuto de video traducido? | |

### Posibilidades de Integración
| # | Pregunta | Respuesta |
|---|----------|-----------|
| 5 | ¿Qué información del guión sería útil tener automáticamente en ElevenLabs? | |
| 6 | ¿Qué parte del proceso te gustaría que se automatizara? | |

---

## F. Métricas y KPIs (Para liderazgo)

| # | Pregunta | Respuesta |
|---|----------|-----------|
| 1 | ¿Cuántos videos traducen por semana/mes? | |
| 2 | ¿Cuál es el tiempo promedio desde guión hasta video publicado? | |
| 3 | ¿Han tenido quejas de audiencia sobre traducciones? ¿Idiomas específicos? | |
| 4 | ¿Cuánto cuesta actualmente el proceso de dubbing por video? | |
| 5 | ¿Qué idioma genera más engagement/views? | |

---

## Notas del Entrevistador

### Observaciones Generales
```
[Espacio para notas libres]
```

### Hallazgos Clave
```
1.
2.
3.
```

### Acciones de Seguimiento
```
- [ ]
- [ ]
- [ ]
```
