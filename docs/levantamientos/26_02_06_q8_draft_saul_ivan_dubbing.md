# Q8 Saul/Ivan Dubbing - Respuestas [DRAFT]

| Campo | Valor |
|:------|:------|
| **Fuente** | Conocimiento del owner (Daniel Garza) - NO entrevista directa |
| **Status** | DRAFT - Pendiente validacion con Saul e Ivan |
| **Fecha captura** | 2026-02-13 |
| **Confianza estimada** | ~70-80% (basado en conocimiento operativo del owner) |

> **IMPORTANTE:** Este documento es un DRAFT basado en conocimiento del owner. Cuando se realice la entrevista real con Saul/Ivan, reemplazar con respuestas verificadas y marcar deltas.

---

## Seccion A: Panorama de Idiomas

**A1.** Cuantos idiomas manejan actualmente?

> 27 idiomas listados. Pudiera ser que se agreguen o quiten algunos. **Debemos evaluar cuales mantener - cosa que al dia de hoy no hacemos.**

**A2.** Idiomas activos con audiencia potencial (millones de hablantes):

| Idioma | Hablantes (M) | Prioridad |
|:-------|:-------------|:----------|
| Ingles | 1,500 | Maxima |
| Mandarin | 1,150 | Alta |
| Hindi | 600 | Alta |
| Espanol | 600 | Nativo |
| Arabe | 400 | Alta |
| Frances | 321 | Media-Alta |
| Bengali | 270 | Media |
| Portugues | 260 | Media |
| Ruso | 260 | Media |
| Urdu | 230 | Media |
| Indonesio | 200 | Media |
| Punjabi | 140 | Baja-Media |
| Aleman | 130 | Media |
| Japones | 130 | Media |
| Persa (Irani) | 110 | Baja-Media |
| Cantones | 105 | Baja-Media |
| Marathi | 95 | Baja |
| Telugu | 95 | Baja |
| Turco | 90 | Baja |
| Tamil | 85 | Baja |
| Vietnamita | 85 | Baja |
| Koreano | 80 | Baja |
| Malay | 80 | Baja |
| Filipino | 75 | Baja |
| Tailandes | 70 | Baja |
| Italiano | 65 | Baja |
| Polaco | 45 | Baja |

**A3.** Idiomas en pausa o desactivados?

> No especificado. Pero se necesita evaluar cuales mantener y cuales no (ROI por idioma).

**A4.** Nuevos idiomas planeados?

> Pudiera ser que agregamos algunos. No hay proceso formal de evaluacion.

---

## Seccion B: Workflow de ElevenLabs

**B1.** Proceso completo de dubbing:

```
Paso 1: Reciben el video completo en espanol
Paso 2: Suben a ElevenLabs (interfaz web actualmente)
Paso 3: ElevenLabs procesa deteccion de speakers y traduccion
Paso 4: Revision manual (ingles se revisa, demas se confian)
Paso 5: Correcciones manuales donde sea necesario
Paso 6: Exportacion de audio por idioma
Paso 7: Entrega para revision de calidad (con Alan, Ramon, Andrea)
```

**B2.** Que reciben como input?

- [x] Video completo con audio en espanol

**B3.** Interfaz web o API?

- [x] Solo interfaz web (actualmente)
- Podrian usar API y quieren hacerlo

**B4.** Plan/tier de ElevenLabs?

- [x] Pro (el plan mas alto antes del de empresas/Enterprise)

---

## Seccion C: Mapeo de Voces

**C1.** Como asignan voces a personajes?

- [x] Cada personaje tiene una voz fija en ElevenLabs
- Depende del personaje, genero, y lo que es mejor para cada personaje y la intencion

**C2.** Cuantas voces diferentes por episodio?

> Al menos 3 a 6 personajes principales. No tienen metrica exacta de cuantas voces diferentes existen.

**C3.** Catalogo de voz por personaje documentado?

- [x] Si, tenemos un mapeo completo (ya estan mapeados)

**C4.** Personajes que dan problemas con TTS?

> Si existen personajes que dan problemas. Antes usaban Loquendo (un TTS antiguo) que era interesante. Algunos personajes no suenan bien con ElevenLabs.

---

## Seccion D: Validacion de Calidad por Idioma

**D1.** Revisan manualmente cada idioma?

- [x] Solo ingles (y los demas se confian)
- Revisan algunos y los muestrean. Lo ideal seria revisar todos.
- **No deberia ser asi** - reconocen que confiar sin validar es un riesgo.

**D2.** Como validan idiomas que no hablan?

- [x] No los validamos, solo verificamos que suene natural
- Solo validan que si sea el idioma y algunos los muestrean
- **Deberian usar hablantes nativos + IA para validar con cierto set de reglas**
- En voz y en texto, creen que podrian hacerlo con IA (multimodales) al dia de hoy

**D3.** Tipos de errores mas frecuentes:

- [x] Deteccion incorrecta del texto original (speaker detection: ElevenLabs no da 100% garantia de quien habla)
- [x] Traduccion erronea (por signos de puntuacion, palabras que no deberian ir)
- [x] Onomatopeyas que se traducen mal
- [x] Numeros que se leen incorrectamente
- [x] Pronombres incorrectos (el/ella)
- [x] Tono/emocion que no coincide con la escena (MUY IMPORTANTE)
- [x] Timing desfasado (traducciones no se cortan bien, hay que cortarlas)
- [x] Temas culturales (tropicalizacion faltante)

---

## Seccion E: Safety Filters y Blacklist

**E1.** Problemas con filtros de seguridad de ElevenLabs?

- [x] Si, han tenido problemas

**E2.** Tipo de contenido que activa filtros?

> No especificado en detalle, pero si han tenido problemas.

**E3.** Como resuelven cuando un filtro bloquea contenido?

> No especificado.

**E4.** Lista negra (blacklist)?

- [x] No, vamos resolviendo caso por caso
- **Deberian tener una blacklist pero NO la tienen al momento.** Reconocen que deberian corregir esto.

**E5.** Modificaciones del guion por problemas de filtros/traduccion?

- [x] Si, varias veces (han tenido modificaciones del guion por temas de trabajo)

---

## Seccion F: WER y Metricas de Calidad

**F1.** Miden la tasa de error (WER)?

- [x] No, no la medimos
- Seria bueno medirlo

**F2.** Tasa de error por idioma?

> No tienen tasa de error por idioma. **Seria muy bueno medirlo.**

**F3.** Tiempo en correcciones manuales por episodio?

> Se invierte una persona completa para correcciones manuales por episodio. Deberian ser lo mas eficiente posible.

**F4.** Porcentaje correcciones vs procesamiento automatico?

> No saben la distribucion. Seria bueno medirla.

---

## Seccion G: Tiempos y Capacidad

**G1.** Cuanto tiempo toma el dubbing completo?

> No sabe cuanto tiempo toma el dubbing completo de un episodio. Depende de duracion y complejidad.

**G2.** Episodios por semana?

> No especificado.

**G3.** El dubbing es cuello de botella?

- [x] No, nunca retrasa la publicacion (es raro que sea cuello de botella)

**G4.** Que idioma toma mas tiempo?

> Al momento todos toman lo mismo tiempo procesar, dado que confian en la herramienta. Pero **deberian escrutinizar o poner mejores controles de calidad** en lugar de confiar ciegamente.

---

## Seccion H: Gestion de Idiomas

**H1.** Como organizan el trabajo entre Saul e Ivan?

> No especificado en detalle en esta captura.

**H2.** Naming y organizacion de archivos por idioma?

- Deberian nombrar y organizar los archivos por idioma
- Formato sugerido: Episodio + Idioma (ej: EP001_EN, EP001_FR)
- No recuerda el formato exacto actual

**H3.** Donde almacenan los archivos?

- [x] NAS (almacenan archivos en un NAS)

**H4.** Quien decide cuando un episodio doblado esta listo?

- Revisa con Alan y Ramon, luego con Andrea para revision de calidad
- **Andrea confia plenamente** → hay un sesgo en la revision de calidad

---

## Seccion I: Problemas Especificos de TTS

**I1.** Idiomas donde TTS suena robotico?

> No especificado en detalle. Antes usaban Loquendo que tenia un estilo particular.

**I2.** Quejas de la audiencia?

- [x] A veces
- En general la audiencia lo entiende pero deberian mejorarlo
- Deberia adaptarse a situaciones culturales, edad, cosas que no se pueden decir, tropicalizacion

**I3.** Que pasa cuando un idioma falla?

> No especificado en esta captura.

---

## Seccion J: Canciones y Contenido Especial

**J1.** Como manejan canciones?

> Las canciones no son problema.

**J2.** Contenido que no se puede doblar?

> No especificado en esta captura.

---

## Seccion K: Mejoras y Vision

**K1.** Ranking de frustraciones (1 = mas frustrante):

```
1. Correcciones manuales por deteccion incorrecta de speaker (personaje 2 es el 1)
2. No poder validar idiomas que no hablo
3. Falta de automatizacion en el proceso
4. Timing desfasado entre idiomas y animacion
5. Filtros de seguridad que bloquean contenido
```

**K2.** Que parte automatizaria?

> Lo mayor posible. Especificamente la deteccion de speakers y las correcciones manuales.

**K3.** Si pudiera cambiar UNA cosa:

> Automatizar la deteccion correcta de speakers y reducir correcciones manuales.

**K4.** Informacion que necesita y no tiene:

> Metricas de calidad por idioma, tasa de error, blacklist de palabras.

**K5.** Anotaciones especiales para dubbing en el guion?

> No especificado pero seria util dado los problemas de tropicalizacion.

---

## EXTRAS: Insights fuera del cuestionario

> Estos insights salieron organicamente y NO mapean a preguntas especificas pero son criticos para el ERP.

### E1. Evaluacion de ROI por idioma - NO EXISTE

- 27 idiomas activos pero **no se evalua cuales mantener y cuales no**
- No hay metrica de views/revenue por idioma para decidir si vale la pena
- **Impacto ERP:** Dashboard de performance por idioma (views, retention, revenue) para decidir expansion/contraccion de idiomas

### E2. Speaker Detection - Problema #1 de calidad

- ElevenLabs no da 100% de garantia en deteccion del speaker
- Error tipico: "personaje 2 es el 2 cuando deberia ser el 1"
- No cree que se pueda mejorar con algoritmo dependiendo la narrativa en este momento
- **Impacto ERP:** Pre-procesamiento del guion con speaker labels como input a ElevenLabs. Mapear personaje → voz ANTES de enviar a TTS. Reduccion estimada de correcciones: significativa.

### E3. Tropicalizacion cultural - Gap critico

- No validan idiomas que no son espanol/ingles
- **Incluso en ingles** ya tienen marcado que no saben modismos, cosas que no se pueden decir
- Para audiencia de 8-16 anos: palabras prohibidas, modismos apropiados, adaptacion cultural
- Falta: como tropicalizar un ingles "general" para diferentes mercados
- **Impacto ERP:** Modulo de tropicalizacion con reglas por idioma + edad target. Blacklist por idioma. Guia de modismos por mercado.

### E4. Blacklist de palabras - NO EXISTE pero DEBE EXISTIR

- Han tenido problemas con filtros de seguridad
- **No tienen blacklist al momento**
- Reconocen que deberian corregir esto
- **Impacto ERP:** Tabla maestra de blacklist por idioma, actualizable. Pre-filtro antes de enviar a TTS.

### E5. Sesgo en revision de calidad

- Andrea "confia plenamente" en el output
- Esto crea un sesgo: la revision final no es critica
- **Impacto ERP:** QA automatizado como capa independiente. No depender de una sola persona que "confia".

### E6. Proceso de doblaje documentado en otra comunicacion

- El proceso ya esta levantado en otra comunicacion (buscar en docs existentes)
- Referencia: probablemente en `docs/product/projects/video-qph/02_OPERATIONS/PROCESSES/` o similar

### E7. KPIs no contemplados en el cuestionario original

| KPI propuesto | Por que importa |
|:--------------|:----------------|
| WER (Word Error Rate) por idioma | No medido, critico para calidad |
| Tasa de error por idioma | Para priorizar mejoras |
| Tiempo de correcciones vs automatico | Entender eficiencia real |
| Tiempo total de dubbing por episodio | Capacidad del equipo |
| Views/retention por idioma | ROI para decidir expansion |
| Speaker detection accuracy | Medir el problema #1 |
| Blacklist violations por episodio | Medir riesgo de contenido |
| Costo ElevenLabs por idioma | Para evaluar ROI |

### E8. Hablantes nativos + IA para validacion

- Propuesta concreta: hablantes nativos + IA con set de reglas para validar
- Hoy confian ciegamente en idiomas que no hablan
- IA podria validar: es el idioma correcto, pronunciacion, apropiado para edad, sin ofensas culturales
- **Impacto ERP:** Pipeline de validacion: TTS output → IA validation → human review (solo flagged items)

### E9. Tabla de idiomas como asset estrategico

- La tabla de 27 idiomas con hablantes es un asset de negocio
- Deberia vivir como configuracion del ERP, no como dato suelto
- Permite: priorizar idiomas, calcular mercado potencial, asignar recursos

### E10. ElevenLabs API migration

- Hoy usan interfaz web
- Quieren migrar a API
- Esto habilitaria: automatizacion, batch processing, integracion con ERP
- Tienen el plan Pro (tier antes de Enterprise)

---

**Siguiente paso:** Validar con Saul/Ivan en entrevista real. Buscar proceso de doblaje documentado en comunicaciones previas. Marcar deltas vs este DRAFT.
