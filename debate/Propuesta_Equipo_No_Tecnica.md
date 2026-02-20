# Propuesta Multi-Idioma QPH: Lo que Tenemos, lo que Falta, y Como Mejorarlo

| Campo | Valor |
|:------|:------|
| **Para** | Andrea (GM), Ramon (Audio/TTS), Alan (Factory Manager), Iris (Operaciones), Giovanna/Gio (QA) |
| **Fecha** | 2026-02-20 |
| **Version** | v1.2 |
| **Objetivo** | Presentar la situacion actual del doblaje multi-idioma, los problemas reales, y una propuesta completa de mejora |

> **Nota:** Este documento esta pensado para todo el equipo, no solo para el area tecnica. Si algo no queda claro, pregunten -- la idea es que TODOS entiendan el problema y la solucion.

---

## RESUMEN DE 1 PAGINA

### Que decidimos

1. Implementar **4 puntos de revision automatica (Gates)** en el pipeline de doblaje multi-idioma
2. Usar **3 IAs como "jueces"** independientes para auditar traducciones (Claude + GPT-4 + Gemini)
3. Crear **listas de palabras prohibidas para los 27 idiomas** (hoy solo tenemos 3)
4. **Medir calidad por primera vez:** tasa de error (WER), calidad de traduccion, naturalidad de audio, emociones, timing
5. Implementar en **5 fases a lo largo de 11 semanas**, con valor visible desde la semana 3
6. **Priorizar por Tiers:** Tier 1 (5 idiomas, revision humana completa), Tier 2 (5 idiomas, muestreo 30%), Tier 3 (17 idiomas, solo automatico)
7. Implementar un **sistema de aprendizaje continuo (Kaizen)** que reduce errores con cada episodio

### Que NO decidimos (pendiente)

1. Cuantos idiomas incluir en el piloto: 5 (Tier 1), 10 (Tier 1+2), o los 27?
2. Presupuesto mensual para la capa de QA automatizado (~$8-16 por episodio)
3. Quien es el dueno permanente de las blacklists por idioma
4. Si pausar idiomas de bajo ROI (necesitamos datos primero)
5. Si migrar al plan Enterprise de ElevenLabs o quedarnos con Pro
6. Quien cubre soporte tecnico si algo falla en produccion

### Que necesito de cada persona ESTA SEMANA

| Persona | Accion concreta | Tiempo estimado |
|:--------|:----------------|:----------------|
| **Alan** | Revisar este documento y agendar sesion de alineacion con el equipo | 30 min |
| **Andrea** | Listar las 10 expresiones/modismos mas usados en guiones recientes | 30 min |
| **Ramon** | Validar que el catalogo de voces (manifest.json) este completo y actualizado | 1 hora |
| **Iris** | Identificar los 3 idiomas donde han recibido mas quejas de audiencia | 30 min |
| **Gio** | Revisar el checklist de 13 pistas de audio y marcar cuales aplican a dubbing | 1 hora |
| **Saul/Ivan** | Confirmar disponibilidad para prueba piloto con 1 episodio real (2 horas, a agendar) | 10 min |

---

## TABLA DE CONTENIDOS

1. [Donde estamos hoy](#1-donde-estamos-hoy)
2. [Los problemas reales (con ejemplos)](#2-los-problemas-reales)
3. [Por que importa resolverlo](#3-por-que-importa-resolverlo)
4. [La solucion propuesta (paso a paso)](#4-la-solucion-propuesta)
5. [Ejemplo completo: un episodio antes y despues](#5-ejemplo-completo-un-episodio-antes-y-despues)
6. [Como cambiaria el dia a dia de cada quien](#6-como-cambiaria-el-dia-a-dia)
7. [RACI: quien decide, ejecuta y aprueba](#7-raci-quien-decide-ejecuta-y-aprueba)
8. [Objetivos SMART y metas medibles](#8-objetivos-smart-y-metas-medibles)
9. [Costos y ahorros](#9-costos-y-ahorros)
10. [Plan de implementacion](#10-plan-de-implementacion)
11. [Plan de contingencia](#11-plan-de-contingencia)
12. [Decisiones solicitadas al equipo](#12-decisiones-solicitadas-al-equipo)
13. [Preguntas frecuentes](#13-preguntas-frecuentes)
14. [Glosario](#14-glosario)

---

## 1. DONDE ESTAMOS HOY

### 1.1 El proceso actual en una frase

**Andrea escribe el guion en espanol -> Fernando arma el audio/video final -> Saul e Ivan suben ese video a ElevenLabs -> ElevenLabs traduce y dobla a 27 idiomas -> se publica.**

Ese es el flujo basico. Funciona, pero tiene huecos importantes de calidad que vamos a explicar.

### 1.2 Como funciona hoy el doblaje (paso a paso)

```
PASO 1: Andrea escribe el guion en espanol neutro
         (sin mexicanismos, sin doble sentido regional)
              |
PASO 2: Los animadores generan el audio TTS en espanol
         y animan cada escena
              |
PASO 3: Fernando ensambla todo, ajusta ritmo y velocidad,
         y exporta un video con la voz limpia en espanol
              |
PASO 4: Saul e Ivan suben ese video a ElevenLabs Studio
         (la plataforma de doblaje por inteligencia artificial)
              |
PASO 5: ElevenLabs detecta automaticamente que se dice
         en el video y genera una transcripcion
              |
PASO 6: Saul e Ivan revisan esa transcripcion y la corrigen
         donde haya errores
              |
PASO 7: Se genera la traduccion de espanol a INGLES
         (el ingles es el "master" -- todo parte de ahi)
              |
PASO 8: Saul e Ivan revisan el ingles a detalle
              |
PASO 9: Del ingles se generan TODOS los demas idiomas
         (portugues, frances, aleman, arabe, japones, etc.)
              |
PASO 10: Se descargan los audios y se entregan para
          publicacion
```

### 1.3 La cadena de traduccion

Es importante entender como funciona la cadena:

```
Espanol (original de Andrea)
    |
    v
Ingles (se revisa al 100% por Saul/Ivan)
    |
    +---> Portugues
    +---> Frances
    +---> Aleman
    +---> Arabe
    +---> Japones
    +---> Coreano
    +---> Hindi
    +---> Mandarin
    +---> ... y 18 idiomas mas
```

**El ingles es la base de TODO.** Si el ingles tiene un error, ese error se multiplica en TODOS los demas idiomas.

### 1.4 Los 27 idiomas activos

Hoy manejamos 27 idiomas. Son muchos. Aqui los mas importantes por numero de hablantes:

| Prioridad | Idiomas | Hablantes potenciales |
|:----------|:--------|:----------------------|
| **Maxima** | Espanol, Ingles | 2,100 millones |
| **Alta** | Mandarin, Hindi, Arabe, Frances | 2,471 millones |
| **Media** | Portugues, Ruso, Indonesio, Aleman, Japones, Bengali | 1,250 millones |
| **Baja** | Coreano, Turco, Vietnamita, Italiano, Polaco, Filipino, Tailandes, Malay, Tamil, Telugu, Marathi, Cantones, Persa, Punjabi, Urdu | ~1,400 millones |

> **Pregunta clave:** Estamos invirtiendo en 27 idiomas pero no sabemos cuales nos dan resultados. No tenemos datos de views ni de retencion por idioma.

---

## 2. LOS PROBLEMAS REALES

### Problema 1: Solo revisamos 1 de 27 idiomas

**El dato mas preocupante:** De los 27 idiomas que publicamos, solo el ingles se revisa al 100% de manera manual. Los otros 26 idiomas se publican "confiando" en que ElevenLabs hizo un buen trabajo.

Esto significa que si hay un error en japones, en arabe, o en hindi, probablemente nadie lo detecta antes de que llegue a la audiencia.

**Ejemplo real:** Imaginemos que en una escena un personaje dice "Que padre!" (expresion mexicana que significa "que genial!"). Si ElevenLabs traduce esto literalmente al ingles como "What a father!" en vez de "That's awesome!", ese error se va a los 26 idiomas restantes. En aleman diria "Was fur ein Vater!" (que padre tan bueno), en japones "Nante otousan!" -- ninguno tiene sentido.

A esto le llamamos el **"efecto telefono descompuesto"**: un error pequeno en la primera traduccion se amplifica y distorsiona en todas las demas.

### Problema 2: No medimos la calidad

Hoy no tenemos NINGUNA metrica de calidad del doblaje:

| Que deberiamos medir | Lo medimos hoy? |
|:---------------------|:-----------------|
| Tasa de error por idioma (WER) | No |
| Calidad de la traduccion (COMET score) | No |
| Que tan natural suena el audio | No |
| Si las emociones se preservan (triste suena triste) | No |
| Si el timing esta sincronizado con la animacion | No |
| Si los personajes mantienen su voz consistente | No |
| Cuantas correcciones manuales se hacen por episodio | No |
| Tiempo total del proceso de doblaje | No |

**Basicamente estamos publicando sin saber si lo que publicamos tiene buena calidad en la mayoria de los idiomas.**

### Problema 3: Los personajes se confunden

ElevenLabs no siempre detecta correctamente QUIEN habla. A veces el personaje A habla con la voz del personaje B. Esto pasa porque el sistema escucha el audio y trata de adivinar quien es cada hablante, pero no siempre acierta.

**Ejemplo:** Gabriel esta hablando y de repente suena con la voz de Valentina. Esto confunde a la audiencia y se ve poco profesional.

Saul e Ivan tienen que revisar esto manualmente en cada idioma, voz por voz, lo cual consume mucho tiempo.

### Problema 4: Problemas con onomatopeyas y expresiones

Las onomatopeyas (sonidos como "guau", "bum", "ay!") no son iguales en todos los idiomas:

| Sonido | Espanol | Ingles | Japones | Coreano | Arabe |
|:-------|:--------|:-------|:--------|:--------|:------|
| Perro | guau | woof | wan wan | meong meong | haw haw |
| Gato | miau | meow | nyan | yaong | miyau |
| Risa | jaja | haha | ahaha | kkkk | hahaha |
| Dolor | ay! | ouch! | itai! | aya! | aakh! |

Si ElevenLabs traduce "guau" literalmente, en japones podria decir algo que no suena nada a un perro ladrando. Esto rompe la inmersion para la audiencia.

### Problema 5: No hay lista de palabras prohibidas

Producimos contenido para ninos de 8 a 15 anos. En diferentes culturas, diferentes palabras son inapropiadas:

- En paises arabes, mencionar "cerdo" como insulto es culturalmente muy ofensivo (el cerdo es un animal prohibido en el Islam)
- En ciertos idiomas, palabras que en espanol son inofensivas pueden ser groserias
- Filtros de seguridad de ElevenLabs a veces bloquean palabras como "muerte" o "matar" en algunos idiomas, obligando a modificar el guion

**Hoy resolvemos esto caso por caso.** No tenemos una lista formal de "esto NO se puede decir en este idioma". Solo tenemos listas para aleman, arabe y una lista global muy basica (6 palabras).

### Problema 6: Los pronombres se confunden

ElevenLabs a veces confunde "el" con "ella", o usa un nivel de formalidad incorrecto. En muchos idiomas, la formalidad importa mucho:

| Idioma | Informal (entre ninos) | Formal (con adultos) | Error tipico |
|:-------|:----------------------|:---------------------|:-------------|
| Aleman | du (tu) | Sie (usted) | Ninos hablando de "usted" entre si |
| Frances | tu | vous | Amigos usando "vous" |
| Japones | Casual | Keigo (formal) | Ninos hablando como ejecutivos |
| Coreano | Haerache (informal) | Hapsyo (super formal) | Ninos hablando como en una junta |

Para contenido infantil, los personajes ninos SIEMPRE deberian hablar de manera informal entre ellos. Si un nino le habla de "usted" a su amigo, suena extranisimo.

### Problema 7: El timing se desfasa

Las traducciones no siempre tienen la misma duracion que el audio original. Una frase que en espanol dura 3 segundos, en aleman puede durar 5 (el aleman tiende a ser mas largo), y en japones puede durar 2.

Cuando esto pasa, el audio queda **desfasado** con la animacion: el personaje mueve la boca pero ya no esta hablando, o sigue hablando cuando la escena ya cambio.

### Problema 8: No sabemos si vale la pena cada idioma

Tenemos 27 idiomas activos, pero no sabemos:
- Cuantas vistas genera cada idioma
- Cuanto tiempo de retencion tiene la audiencia de cada idioma
- Cuanto nos cuesta producir cada idioma
- Si hay idiomas que nos conviene pausar o agregar

Sin estos datos, estamos invirtiendo recursos sin saber si dan resultado.

### Problema 9: La revision de calidad tiene un sesgo

La revision final de calidad depende de pocas personas. Si la persona que revisa "confia plenamente" en el resultado sin cuestionarlo, la revision no cumple su proposito. No es culpa de nadie -- es que no hay herramientas ni procesos que ayuden a detectar problemas de manera objetiva.

### Problema 10: Todo es manual

Saul e Ivan hacen gran parte del trabajo a mano:
- Reasignar voces a personajes en cada idioma
- Cortar y ajustar los silencios del audio
- Corregir la transcripcion palabra por palabra
- Revisar pronombres y expresiones
- Bajar los archivos y organizarlos

Esto funciona para pocos episodios, pero no escala. A medida que producimos mas contenido, el cuello de botella crece.

---

## 3. POR QUE IMPORTA RESOLVERLO

### 3.1 Nuestra audiencia son ninos

QPH produce contenido para ninos de 8 a 15 anos. Esto hace que la calidad del doblaje sea CRITICA, no opcional:

- **Contenido inapropiado** que pase en un idioma que no revisamos puede generar problemas serios de reputacion
- **Errores culturales** pueden ofender comunidades enteras (ejemplo: usar referencias al cerdo en contenido para audiencia arabe)
- **Voces confundidas** o audio robotico hace que los ninos dejen de ver el contenido

### 3.2 El mercado potencial es enorme

Con 27 idiomas, QPH potencialmente alcanza a miles de millones de hablantes. Pero si la calidad del doblaje es mala, estamos desperdiciando ese alcance. Un nino en Tokio o en Seul no va a seguir viendo un video donde el audio suena raro o los personajes hablan de manera extrana.

### 3.3 La competencia lo hace mejor

Empresas como Netflix invierten mas de $100 millones de dolares al ano en calidad de doblaje. No estamos compitiendo a esa escala, pero si podemos usar inteligencia artificial para acercarnos a esa calidad a una fraccion del costo.

---

## 4. LA SOLUCION PROPUESTA

La solucion se basa en una idea simple: **poner "puntos de revision automaticos" en cada etapa del proceso**, para detectar problemas ANTES de que lleguen a la audiencia.

Imaginenlo como los controles de calidad en una fabrica: en vez de revisar el producto terminado al final (cuando ya es tarde), revisamos en cada paso del proceso.

### 4.1 Los 4 puntos de revision ("Gates")

```
GATE 1: Antes de enviar a ElevenLabs
  "El guion esta listo para traducir?"
     |
GATE 2: Despues de la traduccion a ingles
  "El ingles esta bien traducido?"
     |
GATE 3: Despues de traducir a los demas idiomas
  "Cada idioma esta bien?"
     |
GATE 4: Despues de generar el audio final
  "El audio suena bien, a tiempo, y con la emocion correcta?"
```

Veamos cada uno en detalle:

---

### GATE 1: Revision Pre-Vuelo (antes de traducir)

**Que hace:** Revisa el guion en espanol ANTES de enviarlo a ElevenLabs, para prevenir problemas.

**Que revisa:**

1. **Lista de palabras prohibidas:** Busca palabras que sabemos que van a causar problemas en ciertos idiomas. Por ejemplo, si el guion dice "cerdo" como insulto, lo marca ANTES de que se traduzca al arabe.

2. **Expresiones que no se traducen bien:** Detecta modismos mexicanos o regionalismos que no tienen equivalente en otros idiomas. Por ejemplo, "que padre!" o "no manches".

3. **Onomatopeyas:** Identifica sonidos que necesitan adaptarse (el "guau" del perro, el "miau" del gato) y verifica que exista un equivalente para cada idioma.

4. **Estimacion de duracion:** Calcula si alguna frase va a ser demasiado larga en otro idioma (por ejemplo, el aleman tiende a tener frases 30% mas largas que el espanol).

5. **Seguridad:** Verifica que no haya contenido que pueda ser inapropiado para ninos en alguna cultura.

**Resultado:** Si todo pasa, se continua. Si algo se marca, Saul/Ivan lo corrigen ANTES de enviar a ElevenLabs, ahorrando retrabajo despues.

**Analogia:** Es como revisar que la receta esta completa antes de empezar a cocinar. Si falta un ingrediente, es mejor saberlo al inicio que a la mitad.

---

### GATE 2: Auditoria del Ingles (despues de ES -> EN)

**Que hace:** Verifica que la traduccion del espanol al ingles sea correcta, porque el ingles es la base de TODOS los demas idiomas.

**Como lo hace:**

1. **Tres "jueces" de inteligencia artificial:** Tres modelos de IA diferentes (Claude, GPT-4, Gemini) leen la traduccion de manera independiente y dan su opinion. Si los tres dicen que esta bien, se aprueba. Si alguno detecta un problema, se marca para revision humana.

   **Por que tres y no uno?** Porque cada IA tiene sus propias fortalezas y debilidades. Usar tres reduce enormemente la posibilidad de que un error pase desapercibido. Es como pedir tres opiniones medicas en vez de una.

2. **Puntuacion automatica (COMET):** Un programa especializado le da una calificacion de 0 a 1 a la traduccion. Si la calificacion es menor a 0.85, se marca para revision.

3. **Verificacion de intencion:** La IA compara no solo las palabras, sino la INTENCION. "El personaje queria expresar sorpresa -- la traduccion al ingles tambien expresa sorpresa?"

4. **Revision humana obligatoria:** Despues de los jueces automaticos, Saul/Ivan SIEMPRE revisan el ingles al 100%. La IA ayuda a encontrar los problemas, pero la decision final es humana.

**Resultado:** Solo cuando el ingles esta aprobado (tanto por la IA como por Saul/Ivan) se procede a traducir a los demas idiomas. Esto evita el "efecto telefono descompuesto".

**Analogia:** Es como revisar los cimientos de un edificio antes de construir los pisos de arriba. Si los cimientos tienen una grieta, mejor arreglarla ahora que cuando ya hay 10 pisos encima.

---

### GATE 3: Auditoria Multi-Idioma (EN -> todos los demas)

**Que hace:** Revisa cada idioma individualmente despues de la traduccion.

**Como lo hace (adaptado por prioridad):**

**Para idiomas Tier 1 (ingles, portugues, frances, aleman):**
- Las mismas 3 IAs revisan la traduccion
- Puntuacion COMET obligatoria
- Revision humana de cada idioma
- Meta: menos de 5% de tasa de error

**Para idiomas Tier 2 (arabe, coreano, japones, hindi, mandarin):**
- Las 3 IAs revisan
- Puntuacion automatica
- Revision humana del 30% (muestreo inteligente, enfocandose en las partes mas riesgosas)
- Meta: menos de 10% de tasa de error

**Para idiomas Tier 3 (el resto: filipino, indonesio, italiano, ruso, etc.):**
- Solo revision automatica por IA
- Se marcan los segmentos problematicos
- Revision humana solo si la IA detecta algo grave
- Meta: menos de 15% de tasa de error

**Que revisan las IAs en cada idioma:**
- Que las listas de palabras prohibidas se respeten
- Que los pronombres sean correctos (no mezclar tu/usted)
- Que las onomatopeyas esten adaptadas
- Que las expresiones culturalmente sensibles esten bien manejadas

**Analogia:** Es como el control de calidad en una linea de produccion. Los productos premium (Tier 1) se revisan uno por uno. Los productos estandar (Tier 2) se muestrean. Los productos de alto volumen (Tier 3) se revisan por lotes con alertas automaticas.

---

### GATE 4: Verificacion del Audio Final

**Que hace:** Una vez que ElevenLabs genera el audio doblado, verificamos que el audio en si sea de buena calidad.

**Que revisa:**

1. **Que dice el audio vs que deberia decir:** Dos programas diferentes "escuchan" el audio generado y lo transcriben de vuelta a texto. Luego comparamos ese texto con la traduccion original. Si hay diferencias significativas, algo salio mal en la generacion del audio.

   **Por que dos y no uno?** Por la misma razon que usamos 3 jueces para traducciones: si los dos coinciden, tenemos alta confianza. Si difieren, hay que revisar.

   **Novedad:** ElevenLabs ahora incluye un motor de transcripcion (Scribe v2) que detecta automaticamente contenido ofensivo (`offensive_language`). Esto significa que la propia plataforma puede funcionar como uno de los dos "escuchas", reduciendo costos y agregando una capa de seguridad especifica para contenido infantil sin costo adicional.

2. **Naturalidad:** Un programa especializado le da una calificacion de "que tan natural suena" (del 1 al 5). Si suena demasiado robotico (calificacion menor a 3.5), se marca.

3. **Emociones:** Si el guion dice que Gabriel esta triste en esa escena, pero el audio suena feliz, eso es un error. Un programa de deteccion de emociones compara lo que el audio transmite vs lo que el guion pide.

4. **Sincronizacion (timing):** Medimos si el audio doblado tiene la misma duracion que el original. Si el audio en aleman dura 5 segundos pero la escena solo tiene espacio para 3, hay un problema.

5. **Consistencia de voz:** Verificamos que Gabriel siempre suene como Gabriel, y no cambie de voz a mitad del episodio.

6. **Calidad de audio:** Detectamos si hay "recortes" (audio cortado bruscamente), ruido, o distorsion.

**Resultado:** Si todo pasa, se aprueba automaticamente. Si algo falla, se genera un reporte detallado para que Saul/Ivan sepan exactamente QUE esta mal y DONDE.

**Analogia:** Es como la prueba de manejo de un auto nuevo antes de entregarlo al cliente. No basta con que se vea bien -- tiene que funcionar bien.

---

### 4.2 Listas de palabras prohibidas completas (Blacklists)

**Que son:** Diccionarios por idioma de palabras o expresiones que NO deben aparecer en el contenido de QPH.

**Que tenemos hoy:** Solo 3 listas (aleman, arabe, y una lista global con 6 palabras).

**Que necesitamos:** 27 listas, una por cada idioma.

**Como se crean:**
1. Una IA genera un primer borrador basado en sensibilidades culturales de cada region
2. Un hablante nativo revisa y corrige el borrador
3. Se guarda como archivo en el sistema

**Categorias de la lista:**
- **Categoria A (CRITICO):** Contenido que jamas debe aparecer (groserias fuertes, contenido sexual, self-harm). Si aparece algo de Categoria A, se BLOQUEA la publicacion automaticamente.
- **Categoria B (RIESGO ALTO):** Contenido sensible que requiere revision (violencia, referencias religiosas, temas politicos).
- **Categoria C (PRECAUCION):** Contenido que podria ser inapropiado dependiendo del contexto (formalidad, slang, modismos).

**Ejemplo practico:**

| Palabra/Expresion | Categoria | Idioma | Razon |
|:------------------|:----------|:-------|:------|
| "khanzir" (cerdo) | A | Arabe | Animal haram, culturalmente ofensivo como insulto |
| "Schwein" (cerdo) como insulto | B | Aleman | Agresivo para audiencia infantil |
| "kuso" (mierda) | A | Japones | Groseria fuerte |
| "baka" (tonto) | C | Japones | Puede ser broma o insulto segun tono |

---

### 4.3 Diccionario Cultural Positivo (nuevo)

**Concepto:** No solo necesitamos saber que NO decir, sino que SI decir. Un diccionario de como adaptar expresiones mexicanas a cada cultura.

**Ejemplo:**

| Expresion en espanol | Significado | En ingles | En japones | En arabe |
|:---------------------|:------------|:----------|:-----------|:---------|
| "Que padre!" | Que genial! | That's awesome! | Sugoi! | Yaa salaam! |
| "No manches" | No puede ser | No way! | Maji de?! | Mish ma'qul! |
| "Esta cañon" | Esta dificil | That's tough | Yabai! | Sa'b jiddan! |

Esto ayuda a que las traducciones suenen NATURALES en cada idioma, no como una traduccion literal.

---

### 4.4 Sistema de aprendizaje (Modulo Kaizen)

**Concepto:** Un sistema que APRENDE de sus errores. Cada vez que Saul, Ivan, o cualquier persona del equipo corrige algo, esa correccion se guarda y se aplica automaticamente en el futuro.

**Como funciona:**

```
Episodio 1: Saul detecta que "no." se traduce como "number"
            y lo corrige manualmente
                |
                v
  El sistema GUARDA esa correccion:
  "Cuando veas 'no.' antes de una letra mayuscula,
   no lo traduzcas como 'number', es la palabra 'no'
   con punto."
                |
                v
Episodio 2: El sistema detecta el mismo patron
            y lo corrige AUTOMATICAMENTE
                |
                v
  Saul ya no tiene que hacer esa correccion a mano
```

**Beneficio:** Con cada episodio que pasa, el sistema se vuelve mas inteligente y hay menos trabajo manual. Las correcciones que hoy toman horas, eventualmente se hacen solas.

**Que aprende el sistema:**
- Correcciones de traduccion (modismos, expresiones)
- Asignaciones correctas de voces a personajes
- Ajustes de timing por idioma
- Onomatopeyas que necesitan adaptacion
- Palabras que activan filtros de seguridad
- Reglas de pronunciacion via Pronunciation Dictionaries de ElevenLabs (IPA phonemes para nombres propios)

---

### 4.5 Dashboard de calidad

**Concepto:** Un tablero visual (como un "monitor de control") donde todo el equipo puede ver de un vistazo como va la calidad del doblaje.

**Que muestra:**

1. **Semaforo por idioma:** Verde (todo bien), amarillo (algunos warnings), rojo (problemas que necesitan atencion)

2. **Tasa de error por idioma:** Un numero simple que dice "japones tuvo 3% de error este mes, arabe tuvo 12%"

3. **Episodios aprobados a la primera:** Que porcentaje de episodios paso todos los controles sin necesidad de correcciones (meta: ir subiendo este numero con el tiempo)

4. **Correcciones mas comunes:** Cuales son los errores que se repiten mas -- para poder atacar la causa raiz

5. **ROI por idioma:** Cuantas vistas y cuanto tiempo de retencion genera cada idioma vs cuanto nos cuesta producirlo

---

### 4.6 Retroalimentacion de la audiencia

**Concepto:** Usar los datos de YouTube (comentarios, vistas, retencion) para detectar problemas de calidad.

**Como funciona:**

1. Se analizan las curvas de retencion por idioma. Si el video en arabe pierde 40% de audiencia en el minuto 3:20, algo paso ahi.

2. Se analizan los comentarios automaticamente con IA para detectar quejas de calidad ("el audio suena raro", "no entendi que dijo", "la voz cambio de repente").

3. Se cruza esa informacion con los datos del doblaje: "en el minuto 3:20 habia un error de speaker detection y el WER era alto".

4. Esto se presenta semanalmente en la reunion del equipo para tomar acciones.

---

## 5. EJEMPLO COMPLETO: UN EPISODIO ANTES Y DESPUES

Para que quede claro como funciona todo junto, veamos un ejemplo concreto paso a paso.

### El episodio: "Gabriel y el Misterio del Laboratorio" (EP042)

**Escena problematica (minuto 3:20):** Gabriel entra al laboratorio y dice:

> **Guion original (ES):** "No manches, este laboratorio esta bien canon! Miren, hasta tiene un cerdo robot!"

### COMO SE PROCESA HOY (sin la solucion)

```
PASO 1: Saul sube el video a ElevenLabs

PASO 2: ElevenLabs traduce al ingles:
        "Don't stain, this laboratory is very cannon!
         Look, it even has a pig robot!"
        (traduccion literal -- no tiene sentido)

PASO 3: Saul revisa el ingles y corrige manualmente:
        "No way, this lab is so cool! Look, it even has a robot pig!"
        (Bien, pero le tomo 10 minutos encontrar y arreglar)

PASO 4: Del ingles corregido se generan 26 idiomas mas

PASO 5: En ARABE, "robot pig" se traduce como "khanzir ali"
        -- culturalmente ofensivo para audiencia musulmana
        PERO NADIE LO DETECTA porque no revisamos arabe

PASO 6: Se publica. Semanas despues llegan comentarios negativos.
```

**Errores que llegaron a publicacion sin detectar:**

| Idioma | Error | Gravedad |
|:-------|:------|:---------|
| Arabe | Referencia al cerdo (ofensa cultural grave) | CRITICA |
| Japones | "No manches" traducido sin sentido | Media |
| Coreano | Gabriel hablo con formalidad "de junta" en vez de casual | Media |
| Aleman | El timing de la frase se desbordo 2.3 segundos | Baja |

### COMO SE PROCESARIA CON LA SOLUCION

```
=== GATE 1: REVISION PRE-VUELO ===

  El sistema analiza el guion en espanol ANTES de enviar:

  [ALERTA] "No manches" -- modismo mexicano.
           Sugerencia: "No puede ser!" (mas neutro y traducible)

  [ALERTA] "cerdo robot" contiene la palabra "cerdo"
           -> Blacklist arabe: "cerdo" es Categoria A (CRITICO)
           -> Sugerencia: cambiar a "robot con forma de animal"

  [ALERTA] "esta bien canon" -- slang mexicano.
           Sugerencia: "es increible!"

  [INFO]   Frase tiene 15 palabras. En aleman estimamos ~20.
           Tiempo estimado: 5.2 seg vs 3.8 disponibles.
           Sugerencia: acortar la frase.

  -> Saul/Ivan corrigen ANTES de enviar a ElevenLabs:
     "No puede ser, este laboratorio es increible!
      Miren, hasta tiene un robot con forma de animal!"


=== GATE 2: AUDITORIA DEL INGLES ===

  ElevenLabs traduce al ingles:
  "No way, this lab is amazing! Look, it even has an animal-shaped robot!"

  Juez 1 (Claude Sonnet):  PASS -- intencion de asombro preservada
  Juez 2 (GPT-4o):         PASS -- fluido y natural
  Juez 3 (Gemini Flash):   PASS -- apropiado para ninos
  Puntuacion COMET:        0.91 (excelente, umbral es 0.85)

  -> 3 de 3 jueces PASS + COMET > 0.85 = APROBADO
  -> Saul/Ivan confirman (revision humana obligatoria del ingles)


=== GATE 3: AUDITORIA MULTI-IDIOMA ===

  Arabe:   PASS -- sin referencia a cerdo, culturalmente neutro
  Japones: PASS -- "Uso!" (wow!) -- natural y casual
  Coreano: PASS -- haerache (informal) -- correcto para ninos
  Aleman:  [WARNING] Traduccion +18% mas larga que el original
           -> Dentro del umbral permitido (< 20%). Aprobado con nota.

  -> 27 de 27 idiomas pasan Gate 3


=== GATE 4: VERIFICACION DE AUDIO ===

  Arabe:   WER 2.1%, naturalidad 4.2/5, emocion=sorpresa OK
  Japones: WER 1.8%, naturalidad 4.4/5, emocion=sorpresa OK
  Coreano: WER 2.5%, naturalidad 4.1/5, emocion=sorpresa OK
  Aleman:  WER 3.1%, naturalidad 3.9/5, emocion=sorpresa OK
           Timing: +180ms [WARNING pero < 200ms limite, OK]

  Consistencia de voz: Gabriel = Gabriel en TODOS los idiomas
  Audio cortado (clipping): Ninguno detectado

  -> 27 de 27 idiomas APROBADOS. Listo para publicacion.
```

### Resumen de la comparacion

| Concepto | Sin la solucion | Con la solucion |
|:---------|:----------------|:----------------|
| Errores que llegan a publicacion | 4 (arabe, japones, coreano, aleman) | 0 |
| Tiempo de correccion manual | ~45 min (solo revisar ingles) | ~10 min (pre-correccion en Gate 1) |
| Quejas de audiencia post-publicacion | Si (comentarios negativos en arabe) | No |
| Datos de calidad generados | Ninguno | Reporte completo por idioma y escena |
| Ofensa cultural prevenida | No (llego al publico) | Si (detectada en Gate 1) |

---

## 6. COMO CAMBIARIA EL DIA A DIA

### Para Andrea (Guion / GM)

| Hoy | Con la solucion |
|:----|:----------------|
| Escribe el guion sin restricciones de traduccion | Sigue escribiendo igual, pero con acceso a un diccionario cultural que le indica si alguna expresion va a ser problematica |
| A veces tiene que cambiar el guion porque ElevenLabs bloquea una palabra | El sistema le avisaria ANTES de que llegue a ElevenLabs que hay palabras que van a causar problemas |
| No sabe como les va a los episodios en otros idiomas | Tiene un dashboard donde puede ver calidad y performance por idioma |

### Para Ramon (Audio / TTS)

| Hoy | Con la solucion |
|:----|:----------------|
| Genera el audio TTS y entrega a Fernando | Sigue igual. Ademas, el manifest (catalogo de voces) se usa automaticamente |
| No tiene visibilidad de como suena el audio doblado | Puede ver reportes de calidad de audio: naturalidad, clipping, volumen |

### Para Alan (Factory Manager)

| Hoy | Con la solucion |
|:----|:----------------|
| Coordina el proceso general | Tiene metricas reales de eficiencia: tiempo de doblaje, tasa de error, costo por idioma |
| No puede medir productividad del dubbing | Puede ver cuanto tiempo toma cada episodio y cuantas correcciones se hacen |
| Toma decisiones sobre idiomas sin datos | Tiene datos de ROI por idioma para decidir cuales mantener, expandir o pausar |

### Para Iris (Operaciones)

| Hoy | Con la solucion |
|:----|:----------------|
| Coordina operaciones sin metricas de dubbing | Tiene visibilidad completa del pipeline: que episodios estan en proceso, cuales estan atrasados, cuales ya pasaron QA |
| No puede anticipar problemas | El sistema genera alertas tempranas cuando algo va mal |

### Para Gio (QA)

| Hoy | Con la solucion |
|:----|:----------------|
| Revisa calidad basandose en su criterio personal | Tiene un checklist automatizado con datos objetivos por episodio |
| Tiene que confiar en que los 26 idiomas que no habla estan bien | Tiene un reporte de calidad por idioma basado en metricas medibles |
| No puede medir si la calidad esta mejorando con el tiempo | Tiene graficas de tendencia que muestran si los errores estan bajando o subiendo |
| Revision final es "todo o nada" | Revision escalonada: el sistema ya filtro lo obvio, Gio se enfoca en lo que realmente necesita criterio humano |

### Para Saul e Ivan (Dubbing)

| Hoy | Con la solucion |
|:----|:----------------|
| Reasignan voces manualmente en cada idioma | Las voces se asignan automaticamente desde el catalogo (manifest.json) |
| Corrigen errores de transcripcion a mano | El sistema pre-corrige errores conocidos (como "no." -> "number") |
| Solo revisan ingles, confian en los demas | El sistema revisa automaticamente TODOS los idiomas y les dice exactamente donde hay problemas |
| No saben que errores son los mas comunes | Tienen un reporte de "errores frecuentes" que se reduce episodio a episodio |
| Trabajan solo con la interfaz web de ElevenLabs | Eventualmente pueden usar la API para procesar mas rapido y en lote |

---

## 7. RACI: QUIEN DECIDE, EJECUTA Y APRUEBA

La tabla RACI define roles claros para evitar confusion: **R**esponsable (ejecuta el trabajo), **A**prueba (da el visto bueno), **C**onsultado (da su opinion antes), **I**nformado (recibe el resultado despues).

### Por Fase de Implementacion

| Fase | Daniel | Saul/Ivan | Andrea | Ramon | Alan | Iris | Gio |
|:-----|:-------|:----------|:-------|:------|:-----|:-----|:----|
| **Fase 0:** Preparacion | **R** | C | I | C | **A** | I | I |
| **Fase 1:** Medir calidad | **R** | **R** | I | I | **A** | I | C |
| **Fase 2:** Blacklists y proteccion | **R** | C | C | C | **A** | C | C |
| **Fase 3:** Automatizar | **R** | **R** | I | I | **A** | C | C |
| **Fase 4:** Optimizar y Kaizen | **R** | C | I | I | **A** | C | **R** |

### Por Gate (operacion diaria, una vez implementado)

| Gate | Sistema | Saul/Ivan | Andrea | Ramon | Alan | Iris | Gio |
|:-----|:--------|:----------|:-------|:------|:-----|:-----|:----|
| **Gate 1:** Pre-vuelo | Ejecuta revision | **R** (corrige alertas) | C (si es tema de guion) | I | I | I | I |
| **Gate 2:** Ingles master | Ejecuta 3 jueces IA | **R** (revisa) + **A** (aprueba EN) | I | I | I | I | I |
| **Gate 3:** Multi-idioma | Ejecuta metricas | **R** (revisa Tier 1) | I | I | I | I | C |
| **Gate 4:** Audio final | Ejecuta verificacion | **R** (resuelve flags) | I | C (temas de audio) | I | I | **A** (aprueba) |
| **Publicacion** | - | I | I | I | I | I | **A** (decide publicar) |

### Decisiones clave: quien aprueba que

| Decision | Quien aprueba | Consultados |
|:---------|:-------------|:------------|
| Agregar o quitar un idioma | Alan + Management | Daniel, Saul/Ivan |
| Modificar una blacklist (lista de palabras prohibidas) | Gio | Andrea, Daniel |
| Cambiar el flujo de trabajo de dubbing | Alan | Saul/Ivan, Daniel, Iris |
| Aprobar un episodio para publicacion | Gio | Saul/Ivan |
| Pausar un idioma por baja calidad persistente | Alan | Daniel, Gio, Iris |
| Presupuesto de herramientas de QA | Management | Alan, Daniel |
| Override de una alerta del sistema (publicar a pesar de flag) | Gio (con justificacion documentada) | Saul/Ivan |

---

## 8. OBJETIVOS SMART Y METAS MEDIBLES

### 8.1 Que significa SMART

Cada objetivo debe ser: **E**specifico (que exactamente), **M**edible (con que numero), **A**lcanzable (es realista), **R**elevante (por que importa), con **T**iempo definido (para cuando).

### 8.2 Baseline vs Meta a 90 Dias

Esta tabla muestra donde estamos hoy vs donde queremos estar en 1, 2 y 3 meses:

| Metrica | Hoy (Baseline) | Meta 30 dias | Meta 60 dias | Meta 90 dias |
|:--------|:---------------|:-------------|:-------------|:-------------|
| **Idiomas con revision de calidad** | 1 de 27 (solo EN) | 5 de 27 (Tier 1) | 10 de 27 (Tier 1+2) | **27 de 27** |
| **Tasa de error (WER) Tier 1** | Desconocido | Medido (1er baseline) | < 8% | **< 5%** |
| **Tasa de error (WER) Tier 2** | Desconocido | Desconocido | Medido (1er baseline) | **< 10%** |
| **Tasa de error (WER) Tier 3** | Desconocido | Desconocido | Desconocido | **Medido (1er baseline)** |
| **Blacklists activas** | 3 de 27 | 3 de 27 | 10 de 27 (Tier 1+2) | **27 de 27** |
| **Episodios aprobados a la primera** | Desconocido | Medido (1er baseline) | > 40% | **> 60%** |
| **Correcciones manuales por episodio** | Desconocido | Medido (1er baseline) | -20% vs baseline | **-40% vs baseline** |
| **Contenido Categoria A publicado** | Desconocido | 0 en Tier 1 | 0 en Tier 1+2 | **0 en todos** |
| **Tiempo de doblaje por episodio** | ~4.5 hrs (estimado) | Medido exacto | -15% vs baseline | **-30% vs baseline** |
| **ROI por idioma calculado** | 0 idiomas | 0 idiomas | 5 idiomas (Tier 1) | **27 idiomas** |

> **Nota:** Los primeros 30 dias son para MEDIR. No podemos mejorar lo que no medimos. Los "desconocido" de hoy se convierten en numeros reales que nos permiten fijar metas realistas.

### 8.3 Los 7 Objetivos SMART

| # | Objetivo | Especifico | Medible | Alcanzable | Relevante | Tiempo |
|:--|:---------|:-----------|:--------|:-----------|:----------|:-------|
| **O1** | Medir calidad de 27 idiomas | Instalar medicion WER y ejecutar en 1 episodio piloto con los 27 idiomas | WER score por idioma (%) | Herramientas gratuitas + 1 episodio | Sin medir no podemos mejorar nada | Semana 3 |
| **O2** | Zero Categoria A en Tier 1 | Ningun contenido critico (groserias, ofensas culturales) pasa a publicacion en los 5 idiomas prioritarios | 0 flags Cat. A post-publicacion | Gate 1 + blacklists bloquean automaticamente | Audiencia infantil, reputacion de marca | Semana 6 |
| **O3** | 27 blacklists completas | Crear listas de palabras prohibidas para cada uno de los 27 idiomas | 27 archivos validados | IA genera borrador, nativo valida (~2-3 dias total) | Ya tuvimos problemas con filtros y contenido sensible | Semana 6 |
| **O4** | Reducir correcciones 40% | El sistema aprende de correcciones pasadas y las aplica solo en episodios futuros | % reduccion vs baseline de Fase 1 | Empresas como Netflix logran 95% automatico con IA | Saul/Ivan dedican horas a correcciones repetitivas | Semana 10 |
| **O5** | Dashboard QA visible | Tablero con semaforo por idioma, tasa de error, tendencias y reporte por episodio | Dashboard accesible a todo el equipo con datos reales | Herramienta gratuita (Metabase) conectada a los datos | Todo el equipo necesita ver la calidad, no solo Daniel | Semana 10 |
| **O6** | ROI por idioma calculado | Cruzar YouTube Analytics (vistas, retencion, revenue) con costo de produccion por idioma | ROI = ingresos estimados / costo por idioma | YouTube Analytics API + datos internos de costo | Para decidir que idiomas mantener, pausar o agregar | Semana 12 |
| **O7** | 60% episodios aprobados a la primera | Porcentaje de episodios que pasan los 4 Gates sin necesidad de correcciones manuales | FTR (First Time Right) medido semanalmente | Kaizen + pre-correccion + blacklists lo permiten | Menos retrabajo = mas eficiencia operativa | Semana 12 |

### 8.4 Como sabremos si estamos avanzando

Cada semana en la reunion de equipo (OVEJA), se revisan 3 indicadores simples:

1. **Semaforo general:** Cuantos idiomas estan en verde, amarillo o rojo
2. **FTR de la semana:** Que porcentaje de episodios paso sin correcciones
3. **Tendencia:** Los numeros estan mejorando, estancados, o empeorando?

Si despues de 4 semanas consecutivas algun indicador no mejora, se escala para revisar el enfoque.

---

## 9. COSTOS Y AHORROS

### 9.1 Cuanto cuesta la revision humana completa

Si quisieramos pagar a traductores humanos profesionales para revisar los 27 idiomas de cada episodio:

| Concepto | Costo | Tiempo |
|:---------|:------|:-------|
| 27 traductores nativos revisando un episodio completo | $5,400 - $8,100 por episodio | 2-4 semanas |
| 27 traductores revisando solo el 10% | $540 - $810 por episodio | 3-5 dias |

Esto es claramente insostenible para el volumen de contenido que producimos.

### 9.2 Cuanto cuesta la solucion automatizada

Con la solucion propuesta:

| Componente | Costo por episodio | Notas |
|:-----------|:-------------------|:------|
| ElevenLabs (generacion de audio) | Ya incluido en el plan actual | No hay costo adicional |
| 3 jueces de IA revisando traducciones de 27 idiomas | ~$4 - $8 | Claude + GPT-4 + Gemini |
| Deteccion de contenido ofensivo (ElevenLabs Scribe v2) | ~$0 | Incluido en plan Pro (entity detection: offensive_language) |
| Programas que "escuchan" el audio para verificar | ~$3 - $6 | Whisper + Deepgram |
| Programas de calidad de audio (naturalidad, emociones, timing) | ~$0 | Son gratuitos (open source) |
| Computacion para correr los programas | ~$1 - $2 | Servidores en la nube |
| **Subtotal automatico** | **~$8 - $16** | |
| Revision humana de Tier 1 (Saul/Ivan, 5 idiomas) | ~$40 - $50 | Tiempo interno del equipo |
| **TOTAL** | **~$48 - $66 por episodio** | |

### 9.3 La comparacion

| Escenario | Costo/Episodio | Calidad |
|:----------|:---------------|:--------|
| **Hoy** (solo revisar ingles, confiar en lo demas) | ~$40 (tiempo de Saul/Ivan) | Baja -- no sabemos la calidad de 26 idiomas |
| **Revision humana de 27 idiomas** | $5,400 - $8,100 | Alta -- pero insostenible |
| **Solucion propuesta** (IA + humano en Tier 1) | ~$48 - $66 | Media-Alta -- 27 idiomas revisados, 5 por humano |

> **Conclusion:** Por un costo adicional de $8-26 por episodio (la parte automatizada), pasamos de revisar 1 idioma a revisar los 27. Es una mejora de calidad enorme por un costo minimo.

### 9.4 Ahorro potencial

Si consideramos que un error de calidad no detectado puede resultar en:
- Quejas de audiencia y perdida de suscriptores
- Necesidad de volver a doblar y subir el episodio
- Dano a la reputacion de la marca

El costo de prevencion (~$8-16 por episodio) es insignificante comparado con el costo de correccion.

---

## 10. PLAN DE IMPLEMENTACION

### 10.1 Vision general: 5 fases en 11 semanas

No vamos a implementar todo de golpe. Vamos paso a paso, empezando por lo mas urgente.

```
Fase 0 (Semana 1): Preparacion
  "Asegurarnos de que lo que ya tenemos funciona"

Fase 1 (Semanas 2-3): Medir
  "Empezar a medir la calidad por primera vez"

Fase 2 (Semanas 4-6): Proteger
  "Crear las listas de palabras prohibidas y mejorar deteccion"

Fase 3 (Semanas 7-10): Automatizar
  "Hacer que el proceso corra con menos intervencion manual"

Fase 4 (Semana 11+): Optimizar
  "Dashboard, ROI por idioma, mejora continua"
```

### 10.2 Detalle por fase

#### Fase 0: Preparacion (Semana 1)

**Objetivo:** Arreglar los problemas basicos y verificar que lo que ya construimos funciona.

| Que se hace | Por que importa | Quien participa |
|:------------|:----------------|:----------------|
| Arreglar los 2 bugs conocidos del sistema | El sistema tiene errores que lo hacen crashear | Daniel |
| Conectar las piezas del sistema que estan desconectadas | Hay partes del sistema que existen pero no se hablan entre si | Daniel |
| Probar el flujo completo con UN episodio real | Para verificar que realmente funciona de principio a fin | Daniel + Saul/Ivan |
| Organizar los archivos del proyecto | Evitar perder documentacion y tener todo en orden | Daniel |

**Para el equipo:** Esta fase no requiere accion del equipo. Es trabajo tecnico de preparacion.

---

#### Fase 1: Empezar a Medir (Semanas 2-3)

**Objetivo:** Por primera vez, tener numeros reales de calidad del doblaje.

| Que se hace | Por que importa | Quien participa |
|:------------|:----------------|:----------------|
| Instalar el medidor de tasa de error (WER) | Para saber POR PRIMERA VEZ que tan buenos/malos son los doblajes | Daniel |
| Medir los 27 idiomas de UN episodio | Para tener un "baseline": el punto de partida | Daniel + Saul/Ivan |
| Configurar los 3 jueces de IA | Para empezar a auditar traducciones automaticamente | Daniel |
| Configurar la verificacion de audio | Para detectar problemas de calidad de audio | Daniel |
| Crear los primeros reportes | Para que el equipo vea los resultados | Daniel |

**Para el equipo:** Al final de esta fase, van a ver POR PRIMERA VEZ un reporte de calidad por idioma. Pueden ser numeros que sorprendan (para bien o para mal). Es normal -- es el primer paso para mejorar.

**Meta:** Al terminar esta fase, sabremos la calidad REAL de cada uno de los 27 idiomas.

---

#### Fase 2: Proteger el Contenido (Semanas 4-6)

**Objetivo:** Crear las defensas contra errores graves de contenido.

| Que se hace | Por que importa | Quien participa |
|:------------|:----------------|:----------------|
| Crear listas de palabras prohibidas para los 27 idiomas | Prevenir contenido inapropiado para ninos | Daniel + hablantes nativos |
| Mejorar la deteccion de quien habla (speaker detection) | Evitar que Gabriel suene como Valentina | Daniel |
| Activar la revision pre-vuelo (Gate 1) | Detectar problemas ANTES de enviar a ElevenLabs | Daniel |

**Para el equipo:** Iris y Gio pueden ayudar a revisar las listas de palabras prohibidas. Andrea puede indicar que expresiones del guion suelen dar problemas. Ramon puede verificar el catalogo de voces.

**Meta:** Al terminar esta fase, ningun contenido de Categoria A (critico) llega a publicacion sin ser detectado.

---

#### Fase 3: Automatizar (Semanas 7-10)

**Objetivo:** Reducir el trabajo manual de Saul e Ivan.

| Que se hace | Por que importa | Quien participa |
|:------------|:----------------|:----------------|
| Conectar con la API de ElevenLabs (en vez de usar solo la pagina web) | Permite procesar episodios mas rapido y en lote | Daniel + Saul/Ivan |
| Procesar multiples episodios a la vez (batch) | Reduce el tiempo total de doblaje | Daniel |
| Crear un dashboard basico de calidad | Para que todo el equipo vea metricas en tiempo real | Daniel |
| Entrenar a Saul e Ivan en el nuevo flujo | Para que se sientan comodos con las herramientas | Daniel + Alan |

**Para el equipo:** Saul e Ivan participan en una sesion de demo y entrenamiento. Alan valida que el nuevo flujo funciona operativamente. Gio valida que los reportes de calidad son utiles.

**Meta:** Al terminar esta fase, un episodio puede procesarse con significativamente menos intervencion manual.

---

#### Fase 4: Optimizar y Mejorar Continuamente (Semana 11+)

**Objetivo:** Pasar de "funciona" a "funciona cada vez mejor".

| Que se hace | Por que importa | Quien participa |
|:------------|:----------------|:----------------|
| Dashboard de ROI por idioma | Saber cuales idiomas valen la pena | Alan + Management |
| Activar el sistema de aprendizaje (Kaizen) | Que el sistema se vuelva mas inteligente con cada episodio | Daniel |
| Tropicalizacion activa | Adaptar expresiones culturales automaticamente | Daniel + hablantes nativos |
| Analisis de sentimiento de comentarios | Detectar problemas via feedback de audiencia | Daniel + Gio |

**Para el equipo:** Con datos de ROI por idioma, el equipo de management puede tomar decisiones informadas: pausar idiomas de bajo rendimiento, invertir mas en idiomas de alto rendimiento, o agregar nuevos idiomas con confianza.

**Meta:** Tener un proceso que se mejore SOLO con cada episodio que pasa, con datos para tomar decisiones estrategicas.

---

## 11. PLAN DE CONTINGENCIA

### Si algo falla, que hacemos?

La automatizacion se agrega ENCIMA del proceso actual, no lo reemplaza. Si falla cualquier componente, el equipo puede seguir trabajando exactamente como lo hace hoy.

| Escenario | Que pasa | Que hacemos | Tiempo para volver a la normalidad |
|:----------|:---------|:------------|:------------------------------------|
| **Los jueces de IA no responden** (servicio caido) | Las traducciones no se auditan automaticamente | Saul/Ivan revisan ingles manualmente (como hoy). Los otros idiomas se posponen hasta que el servicio regrese | 0 min -- se trabaja como hoy |
| **ElevenLabs tiene una caida** | No se puede generar dubbing | Se pausa el dubbing hasta que ElevenLabs regrese. No hay alternativa de generacion | Depende de ElevenLabs (historico: < 4 hrs) |
| **El medidor de calidad (WER) da resultados raros** | Las metricas no son confiables | Se desactiva la verificacion automatica. Saul/Ivan hacen revision manual de audio | 0 min |
| **Una blacklist bloquea algo que SI deberia pasar** (falso positivo) | Un episodio se traba innecesariamente | Gio o Saul/Ivan hacen un override manual con justificacion escrita. Se actualiza la blacklist para evitar que pase de nuevo | < 15 min |
| **El sistema de aprendizaje aplica una correccion incorrecta** | Un error "aprendido" se repite en varios episodios | Se identifica la regla incorrecta, se elimina del sistema, se corrigen los episodios afectados | < 1 hora |
| **Daniel no esta disponible y hay un problema tecnico** | Nadie puede arreglar el sistema automatizado | Se regresa al flujo 100% manual (como hoy). Se documenta el problema para cuando Daniel regrese | 0 min -- el flujo manual siempre esta disponible |

### Principio fundamental

> **El flujo manual actual NUNCA se desconecta.** Si falla la automatizacion, se sigue trabajando como siempre. No hay riesgo de quedarse "sin poder producir" por una falla del sistema nuevo.

### Escalacion de problemas

```
Nivel 1: Saul/Ivan detectan algo raro
  -> Intentan resolver solos (maximo 15 minutos)

Nivel 2: No pueden resolverlo
  -> Avisan a Daniel por mensaje/llamada
  -> Mientras tanto, siguen con flujo manual

Nivel 3: Daniel no esta disponible
  -> Avisan a Alan
  -> Se trabaja 100% manual
  -> Alan decide si pausar publicacion o publicar sin QA automatico

Nivel 4: Problema critico (contenido inapropiado publicado)
  -> Alan escala a Management inmediatamente
  -> Se baja el contenido afectado
  -> Se revisa que paso y se corrige
```

---

## 12. DECISIONES SOLICITADAS AL EQUIPO

Para poder arrancar, necesitamos que el equipo tome las siguientes decisiones. Cada una tiene una fecha limite propuesta.

### Decisiones pendientes

| # | Decision | Opciones | Quien decide | Fecha limite | Que pasa si no se decide |
|:--|:---------|:---------|:-------------|:-------------|:-------------------------|
| **D1** | Cuantos idiomas en el piloto? | A) Solo ingles B) Tier 1 = 5 idiomas C) Todos = 27 | Alan + Daniel | **27 Feb** | No podemos definir el alcance de la prueba |
| **D2** | Aprobar presupuesto QA (~$8-16/episodio) | A) Si, arrancar B) Necesito mas info C) No por ahora | Alan + Management | **28 Feb** | Sin presupuesto no se activan los 3 jueces de IA |
| **D3** | Quien es dueno de las blacklists? | A) Gio (QA) B) Andrea (guion) C) Iris (ops) D) Compartido | Alan | **3 Mar** | Las blacklists se crean pero nadie las mantiene actualizadas |
| **D4** | Aprobar plan de 5 fases y fecha de inicio | A) Iniciar semana del 3 Mar B) Posponer C) Modificar plan | Alan + Management | **28 Feb** | Cada semana de retraso = episodios publicados sin QA |
| **D5** | Disponibilidad de Saul/Ivan para piloto | A) Esta semana B) Siguiente semana C) Agendar despues | Saul/Ivan + Alan | **27 Feb** | Fase 0 no puede arrancar sin episodio real de prueba |
| **D6** | Evaluar pausar idiomas de bajo ROI? | A) Si, despues de tener datos (Fase 4) B) Mantener todos C) Decidir ahora | Management | **15 May** | Posible inversion sin retorno en idiomas que nadie ve |
| **D7** | Que tan estricto debe ser el sistema? | A) Que bloquee de mas (seguro) B) Que deje pasar mas (eficiente) C) Balance medio | Gio + Andrea | **3 Mar** | Sin definir, el sistema no sabe que tan estricto ser |
| **D8** | Dia y hora de la reunion semanal de calidad | A) Lunes AM B) Viernes PM C) Otro dia/hora | Todo el equipo | **27 Feb** | Sin reunion, los datos de calidad no se revisan ni se toman acciones |

### Acciones inmediatas por persona

| Persona | Que necesito | Para cuando |
|:--------|:-------------|:------------|
| **Alan** | Revisar este documento completo y agendar sesion de alineacion | **27 Feb** |
| **Andrea** | Listar 10 modismos/expresiones frecuentes en guiones recientes | **28 Feb** |
| **Ramon** | Enviar catalogo actualizado de voces por personaje (manifest.json) | **28 Feb** |
| **Iris** | Listar los 3 idiomas con mas quejas o problemas reportados por audiencia | **28 Feb** |
| **Gio** | Revisar el checklist de 13 pistas de audio y marcar cuales aplican a dubbing | **28 Feb** |
| **Saul/Ivan** | Confirmar disponibilidad para prueba piloto de 2 horas con 1 episodio | **27 Feb** |
| **Daniel** | Preparar ambiente tecnico para Fase 0, con episodio de prueba listo | **3 Mar** |

---

## 13. PREGUNTAS FRECUENTES

### "Esto va a reemplazar a Saul e Ivan?"

**NO.** La solucion automatiza las partes repetitivas y tediosas del trabajo (reasignar voces, buscar errores uno por uno, ajustar silencios). Saul e Ivan siguen siendo esenciales para:
- Aprobar la calidad del ingles (y eventualmente otros idiomas Tier 1)
- Tomar decisiones de contexto que solo un humano puede hacer
- Entrenar al sistema con sus correcciones (el modulo Kaizen depende de su conocimiento)
- Manejar casos especiales que la IA no puede resolver

La idea es que su trabajo pase de "buscar agujas en un pajar" a "revisar lo que la IA ya marco como potencialmente problematico".

### "Cuanto tiempo toma implementar todo?"

Aproximadamente 11 semanas, pero con valor incremental:
- **Semana 1:** Los bugs se arreglan, el sistema basico funciona
- **Semana 3:** Ya tenemos los PRIMEROS datos de calidad por idioma
- **Semana 6:** Ya tenemos listas de palabras prohibidas para los 27 idiomas
- **Semana 10:** El proceso esta significativamente automatizado
- **Semana 11+:** Mejora continua con datos reales

### "Que pasa si la IA se equivoca?"

La IA NO toma decisiones finales sola. El sistema funciona asi:
- Si la IA dice "todo bien" en un idioma Tier 2 o 3: se aprueba automaticamente (pero con metricas registradas)
- Si la IA dice "posible problema": se marca para revision humana
- Si la IA dice "problema grave": se BLOQUEA hasta que un humano revise

Para idiomas Tier 1 (ingles, portugues, frances, aleman), SIEMPRE hay revision humana, sin importar lo que diga la IA.

Ademas, si la IA comete un error sistematico, el modulo Kaizen lo detecta (porque los errores se repiten) y se corrige la regla.

### "Esto funciona con ElevenLabs o necesitamos cambiar de proveedor?"

Funciona CON ElevenLabs. Todo esta disenado para complementar lo que ElevenLabs ya hace:
- ElevenLabs genera las traducciones y el audio
- Nuestra solucion VERIFICA que lo que genero esta bien

No necesitamos cambiar de proveedor. Si en el futuro surge una mejor alternativa, el sistema es flexible para adaptarse.

Ademas, ElevenLabs ahora ofrece funciones que complementan directamente nuestra solucion:
- **Pronunciation Dictionaries:** Reglas persistentes para que los nombres de personajes (Gabriel, Valentina) se pronuncien correctamente en todos los idiomas, episodio tras episodio. Esto es basicamente la version nativa del modulo Kaizen para correcciones de pronunciacion.
- **Scribe v2 con deteccion de contenido ofensivo:** ElevenLabs puede detectar automaticamente lenguaje inapropiado en las transcripciones, agregando una capa de seguridad sin costo adicional.
- **Reasignacion masiva de speakers:** Un nuevo endpoint permite corregir en bulk cuando ElevenLabs asigna mal las voces de los personajes, reduciendo significativamente el trabajo manual de Saul/Ivan.

### "Es seguro usar IA para revisar contenido infantil?"

Si, por varias razones:
1. La IA no PRODUCE el contenido, solo lo REVISA
2. Todo contenido que la IA marque como riesgoso va a revision humana
3. Las listas de palabras prohibidas son revisadas por humanos antes de activarse
4. El contenido de Categoria A (critico) SIEMPRE se bloquea automaticamente -- es mejor un falso positivo (bloquear algo que estaba bien) que un falso negativo (dejar pasar algo malo)

### "Cuanto cuesta mantener esto?"

El costo operativo es de ~$8-16 por episodio (la parte automatizada). El plan Pro de ElevenLabs ya lo estamos pagando. Las herramientas de verificacion de audio son gratuitas (open source). Los jueces de IA se pagan por uso (pocos dolares por episodio).

### "Y si algun idioma sale consistentemente mal?"

El dashboard lo va a mostrar claramente. Si un idioma tiene problemas recurrentes, el equipo puede decidir:
1. **Subir de Tier:** Dedicar mas revision humana a ese idioma
2. **Pausar:** Temporalmente dejar de publicar en ese idioma hasta resolver el problema
3. **Investigar:** Ver si es un problema de ElevenLabs con ese idioma especifico

Con datos objetivos, estas decisiones dejan de ser opiniones y se vuelven decisiones informadas.

### "Que necesitamos del equipo para arrancar?"

| Persona | Que necesitamos | Cuando |
|:--------|:----------------|:-------|
| **Andrea** | Lista de expresiones/modismos que usa frecuentemente | Fase 2 |
| **Ramon** | Verificar el catalogo de voces (manifest.json) | Fase 0 |
| **Alan** | Validar metricas operativas y participar en decisiones de ROI | Fase 1 y 4 |
| **Iris** | Revisar las listas de palabras prohibidas desde perspectiva operativa | Fase 2 |
| **Gio** | Validar que los reportes de calidad son utiles y actionables | Fase 1 |
| **Saul/Ivan** | Participar en demo, probar el flujo nuevo, dar feedback | Fase 0 y 3 |

---

## 14. GLOSARIO

Terminos que usamos en este documento y que puede ser util tener a la mano:

| Termino | Que significa |
|:--------|:-------------|
| **API** | Interfaz de Programacion. Es como un "control remoto" para usar ElevenLabs automaticamente en vez de hacerlo a mano en la pagina web |
| **Blacklist** | Lista de palabras prohibidas por idioma y cultura |
| **COMET** | Programa que califica la calidad de una traduccion del 0 al 1 (1 = perfecto) |
| **Dashboard** | Tablero visual con graficas y numeros para ver la situacion de un vistazo |
| **ElevenLabs** | La plataforma de inteligencia artificial que usamos para doblar el contenido a multiples idiomas |
| **Gate** | Punto de control/revision en el proceso. Si no se pasa el gate, no se continua |
| **Kaizen** | Palabra japonesa que significa "mejora continua". Un sistema que aprende de sus errores |
| **MOS** | Calificacion de naturalidad del audio (1=robotico, 5=humano) |
| **MVP** | Producto Minimo Viable. La version mas basica que funciona |
| **Onomatopeya** | Palabras que imitan sonidos (guau, miau, bum, crash) |
| **Open Source** | Software gratuito que cualquiera puede usar |
| **QA** | Aseguramiento de Calidad (Quality Assurance) |
| **ROI** | Retorno de Inversion. Cuanto nos devuelve lo que invertimos |
| **STT** | Speech-to-Text. Programa que convierte audio en texto |
| **Tier** | Nivel de prioridad. Tier 1 = maximo, Tier 3 = basico |
| **Tropicalizacion** | Adaptar contenido a una cultura especifica (no solo traducir las palabras) |
| **TTS** | Text-to-Speech. Programa que convierte texto en audio (voz) |
| **WER** | Tasa de Error de Palabras. Que porcentaje de palabras estan mal (0% = perfecto) |
| **Pronunciation Dictionary** | Diccionario de reglas de pronunciacion por idioma. Permite definir como se pronuncian nombres propios y terminos especificos usando notacion fonetica (IPA) |
| **Entity Detection** | Capacidad de detectar automaticamente tipos de contenido en texto: informacion personal, lenguaje ofensivo, datos medicos, etc. |
| **Scribe v2** | El motor de transcripcion mas reciente de ElevenLabs, con soporte para 90+ idiomas y deteccion automatica de contenido ofensivo |

---

**Documento preparado por:** Daniel Garza
**Fecha:** 2026-02-20
**Version:** v1.2 (+ actualizacion API ElevenLabs feb 2026: Scribe v2, Pronunciation Dictionaries, migrate-segments)
**Basado en:** Mega Propuesta Final v1.0, Addendum Deep Research v1.0, Levantamientos Q1-Q8, Entrevistas equipo QPH Dic 2025 - Feb 2026
