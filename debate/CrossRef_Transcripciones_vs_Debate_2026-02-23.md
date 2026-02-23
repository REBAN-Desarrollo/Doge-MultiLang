# Informe de Cruce Documental: Transcripciones vs. Documentos de Debate

**Fecha del informe:** 2026-02-23
**Autor:** Agente `debate-crossref` (Claude Sonnet 4.6)
**Fuentes primarias (nuevas):**
- `docs/levantamientos/26_02_23_ProcesosDoblaje_Angela_spa.txt` — Angela (editora) entrevistada por Ceci, presencia de Alan
- `docs/levantamientos/26_02_23_ProcesosDoblaje_Sebastian.txt` — Sebastian (editor) entrevistado por Tania, presencia de Alan

**Corpus de debate auditado:**
1. `debate/Claude_Gold_Standard_Consenso_Final.md` (2026-02-21, CANÓNICO)
2. `debate/Codex_2026-02-20_Gold_Standard_Unificado.md`
3. `debate/Gemini_3.1_PRO_Deep_Audit_QPH.md`
4. `debate/Gemini_Deep_Thinking_Deep_Audit_QPH.md`
5. `debate/Propuesta_Equipo_No_Tecnica.md`
6. `debate/Sonnet_Devil_Advocate_Critique.md`

---

## RESUMEN EJECUTIVO

Las dos transcripciones del 2026-02-23 son la **primera evidencia de observación directa** del proceso operativo real. Confirman hipótesis clave del debate, pero también exponen una **contradicción arquitectónica crítica** que invalida el supuesto central de la propuesta API-first. El hallazgo más urgente es que el flujo de trabajo es **100% GUI, sin posibilidad de migración a API sin cambiar el tipo de proyecto en ElevenLabs**.

---

## SECCIÓN 1: CONFIRMACIONES

*El debate anticipó correctamente y las transcripciones lo verifican.*

| ID | Afirmación en debate | Documento | Evidencia en transcripción | Confianza |
|----|---------------------|-----------|---------------------------|-----------|
| C-01 | El workflow real es GUI (no API) | `Codex` → BLOCKER documentado: "GUI projects NOT accessible via Dubbing Resource API" | Angela (00:01:50): "ya no es un programa, o sea, ya uno se conecta de Internet"; Sebastian (00:01:29): "venimos a lo que sería la interfaz de ElevenLabs" | CONFIRMADO 100% |
| C-02 | Inglés como idioma pivote (ES→EN→otros) | `Claude_Gold_Standard` CM-06; `Propuesta_No_Tecnica` sección 2 | Sebastian (00:02:20): "el inglés, que es el, el, como el idioma universal que vamos a usar"; Angela (00:00:53): "nos enfocamos en el inglés principalmente" | CONFIRMADO 100% |
| C-03 | QA real solo en inglés; cero revisión de contenido en otros idiomas | `Claude_Gold_Standard` H-2: "zero quality metrics"; `Propuesta_No_Tecnica`: "solo inglés revisado" | Sebastian (00:48:05): "Ya no hay, este, mucha revisión. O sea, nomás agregamos el idioma, asignamos voces y al siguiente idioma"; Angela (00:01:00): "pues estamos limitados a no saber otros idiomas" | CONFIRMADO 100% |
| C-04 | "Guion Zombie" es real (Fernando entrega video con timing de post-producción) | `Claude_Gold_Standard` CU-09: "Guion Zombie es un problema real — UNÁNIME" | Alan (00:03:05): "Fer junta todas estas [animaciones] y luego él nos exporta todo el video junto, en uno solo. Este, y es la pura voz. O sea, él le quita efectos de sonido, le quita la música, para que en el programa de Eleven Labs sea más preciso al momento de traducir." | CONFIRMADO — Fernando sí hace post-producción antes de entregar |
| C-05 | 16 idiomas de destino | `Claude_Gold_Standard` CM-06 debate (17 con tiering, 16 en master plan) | Angela (00:00:49): "En este caso son dieciséis, ¿verdad?" — Alan: "Sí, ahorita estamos trabajando de español a otros dieciséis idiomas." | CONFIRMADO — 16 es el número correcto operacional |
| C-06 | División de trabajo por VIDEO, no por idioma | Implícito en arquitectura; no documentado explícitamente | Sebastian (00:50:07): "Sebastián o... o Iván. o Ángela también, puede ser cualquier." (nombre del editor en el proyecto); Angela nomina proyectos con su nombre de editor | CONFIRMADO — cada editor hace un episodio completo en todos sus idiomas |
| C-07 | Voces pre-testeadas / lista de prioridad | `Gemini_3.1_PRO` pronunciación como problema de consistencia | Alan (00:47:00): "voces que ya hemos escuchado anteriormente y sabemos que tienen una buena dicción para todos los idiomas"; Sebastian (00:38:29): "hay voces dentro de ElevenLabs que pueden escucharse medio raras o que no funcionan en distintos idiomas. Entonces, estas voces ya están como testeadas" | CONFIRMADO — existe lista de voces aprobadas |
| C-08 | Dos cuentas ElevenLabs separadas | Mencionado en previos levantamientos; no en debate/ explícitamente | Alan (00:09:43): "actualmente se tienen dos cuentas. Una la usábamos para crear los TTS, específicamente para eso, y otra específicamente para doblajes. Porque si juntábamos las dos tareas en una misma cuenta, no nos daban los créditos" | CONFIRMADO — créditos insuficientes si se combinan |
| C-09 | Hack de 50% reducción de caracteres con marca de agua en video | Mencionado en previos levantamientos | Alan (00:09:14): "Reduce el uso de caracteres en un cincuenta por ciento. ¿Por qué lo hace? Porque añade una marca de agua al video, pero como nosotros no ocupamos el video, sino el puro audio, realmente no nos afecta, pero es un beneficio porque gastamos menos créditos de Eleven Labs." | CONFIRMADO — workaround deliberado de créditos |
| C-10 | Entrega de Fernando es MP4 sin SFX ni música | `Propuesta_No_Tecnica`: Fernando → video | Alan (00:03:05): "él le quita efectos de sonido, le quita la música"; Alan (00:16:32): "MP4 para poder agregar la marca de agua y nos dé la opción de reducir el número de caracteres" | CONFIRMADO — MP4 voz-únicamente es requerimiento técnico |

---

## SECCIÓN 2: CONTRADICCIONES

*El debate asumió algo que las transcripciones demuestran incorrecto o diferente.*

| ID | Afirmación en debate | Documento | Evidencia contraria en transcripción | Impacto |
|----|---------------------|-----------|-------------------------------------|---------|
| **CONTRA-01** | **La arquitectura objetivo es API-first. El equipo migra a Dubbing Resource API.** | `Claude_Gold_Standard` H-1: "API-first (GUI as fallback) — UNÁNIME"; `Codex` GS-01 | **El proceso descrito por ambos operadores es 100% GUI. No existe mención alguna de API, scripts, programación, ni CLI. Todo ocurre en la interfaz web de ElevenLabs. El Codex mismo documenta: "BLOCKER: GUI projects NOT accessible via Dubbing Resource API"** — esto significa que los proyectos ya existentes no migran automáticamente | **CRÍTICO** — invalida la ruta de implementación asumida en todo el debate |
| CONTRA-02 | El guion de origen es un archivo `.docx` (Guion Zombie como archivo .docx con timestamps obsoletos) | `Claude_Gold_Standard` CU-09: Guion Zombie — timestamps en .docx se vuelven stale | Angela (00:11:46): "nos mandan un link de Google Docs"; Angela (00:11:28): "todo es en Google [Docs] y usan sus cuentas personales" — **no es un archivo .docx descargable, es un Google Doc en línea** | MEDIO — el Guion Zombie sigue siendo real, pero el formato de entrega del guion es Google Docs, no .docx. Impacta la arquitectura del Forced Alignment propuesto, que asume ingesta de .docx |
| CONTRA-03 | Se asumen 27 idiomas operacionales (o 17 con tiering) | `Claude_Gold_Standard` CM-06: "27 operational total"; `Gemini_Deep_Thinking` DTR sobre 27 idiomas | Angela (00:00:49) + Alan (00:00:53): **"dieciséis idiomas"** confirmado explícitamente. Sebastian enumera: inglés, árabe, coreano, alemán, filipino, francés, hindi, indonesio, italiano, japonés, portugués, ruso, turco, chino, malayo y tamil — **16 total, incluyendo el inglés como idioma generado** | MEDIO — los modelos y cálculos del debate (AVD data, QPS estimados) asumen más idiomas de los que existen |
| CONTRA-04 | El modelo de QA considera una revisión por tiers (Tier 1/2/3 con flujos diferenciados) | `Claude_Gold_Standard` QA Tiering; `Gemini_Deep_Thinking` Tier 1/2/3 | El proceso real es **binario**: EN recibe revisión detallada (corrección de transcripción española + verificación de traducción inglesa); todos los demás idiomas reciben solo un **check visual de alineamiento temporal** (que las líneas no se sobrepasen). No existe estructura de tiers operacional. | ALTO — el QA Tiering es una propuesta a construir desde cero, no una optimización |
| CONTRA-05 | La fuente de verdad del guion es un documento controlado accesible programáticamente | `Codex` SSOT: `dialogue_objects.json` como fuente canónica | Angela confirma que el guion es "un link de Google Docs" personal, Angela lleva su lista de voces en OneNote/archivo de texto local. "Todos tienen acceso a todo, hasta eso" — **no existe SSOT centralizado programáticamente accesible** | ALTO — el SSOT de 4 capas propuesto no tiene punto de entrada real |

---

## SECCIÓN 3: GAPS EN DOCUMENTOS DE DEBATE

*Información operativa real que no estaba cubierta en el debate.*

| ID | Hallazgo nuevo en transcripciones | Impacto en diseño |
|----|-----------------------------------|-------------------|
| G-01 | **Proceso de creación del proyecto GUI tiene parámetros críticos:** checkbox 1 ("crear proyecto de doblaje" para habilitar el editor), checkbox 2 ("reducir caracteres 50%"), y campo "número de hablantes" — si el número de hablantes es incorrecto, ElevenLabs asigna diálogos al personaje equivocado. Esto es una fuente de error no documentada. | API alternativa debería replicar exactamente estos 3 parámetros; el número de hablantes es un input manual crítico |
| G-02 | **Fernando entrega siempre en formato MP4** (no solo audio) — esto es un requerimiento técnico, no preferencia: el checkbox de 50% de caracteres solo funciona con video MP4. Si se envía solo audio, la opción no aparece. | Cualquier pipeline automatizado debe incluir MP4 como container de entrada, aunque el contenido sea solo pista de voz |
| G-03 | **Errores de fusión de voces (voice merging)** — ElevenLabs a veces asigna el diálogo de un personaje a la línea de otro ("lo puso en la línea de la mamá"). Sebastian (00:25:43): "un error que cometió Leon labs, que es como fusionar voces". Requiere corrección manual de drag-and-drop de segmentos entre líneas. | Necesita proceso de validación de asignación personaje→línea antes del export |
| G-04 | **El operador usa la lista de voces en formato texto local** (OneNote, archivo de texto) para asignación de voces durante la edición — Angela (00:45:30): "lo tengo guardado en un OneNote o en un archivo de texto, en el Escritorio". No hay ningún sistema que propague la asignación automáticamente entre idiomas. Para cada idioma nuevo se busca y reasigna la misma voz manualmente. | `voice_manifest.json` propuesto en Codex resolvería este problema concreto |
| G-05 | **Splitting basado en puntuación** (técnica de Sebastian): puntos = corte de línea; comas = mismo contexto → no cortar; "..." = pausa dramática. La IA de ElevenLabs interpreta la puntuación para el tono/prosodia en la traducción. Sebastian (00:24:30): "Si lo corta, muchas veces puede dejar aquí de que... va a sacar de contexto, lo va a decir de otra manera." | La calidad de la traducción depende del splitting correcto, que actualmente es 100% manual y tácito (no documentado como estándar) |
| G-06 | **El guion de Google Docs es la fuente de verdad para QA en inglés**, no el archivo de video. Angela (00:34:07): "Lo puede verificar viendo el guion. Verificar que no haya errores... comparando con el guion." El flujo es: escuchar EN → detectar error → verificar en guion ES → corregir. | Forced Alignment necesita acceder a Google Docs como fuente, no a .docx local |
| G-07 | **Problemas de pronunciación en inglés reportados directamente**: Sebastian muestra en vivo que cuando una voz no tiene ElevenLabs voice asignada específicamente, "va a leer" el texto con acento/prosodia española, "no va a sonar como un nativo". Tania (00:42:05): "Siento que está hablando un chinito en inglés." | Confirma que el problema de pronunciación existe; Pronunciation Dictionaries son relevantes pero el problema real es la asignación correcta de voces nativas para cada idioma |
| G-08 | **Workflow de export multi-idioma en secuencia**: ES → EN (revisión profunda) → árabe → siguiente idioma → ... El operador hace todos los idiomas en secuencia dentro del mismo proyecto de doblaje. Sebastian (00:48:05): "nomás agregamos el idioma, asignamos voces y al siguiente idioma." Los ajustes hechos en EN se propagan automáticamente a los otros idiomas. | Diseño de pipeline debe respetar la secuencia: EN-first como prerequisito para los demás idiomas |
| G-09 | **Sin convención de nomenclatura estandarizada** — Angela describe usar su nombre de editor; Sebastian menciona que puede ser "Sebastián o Iván o Ángela". Alan no corrige esto. No existe una convención establecida formalmente. | El `naming_convention` propuesto en el debate no está implementado ni acordado |
| G-10 | **Entrega a Fernando de los doblajes**: Angela (00:02:43): "al mero final, le entregamos los doblajes y él pone las voces en inglés y todo eso, otra vez al video." — El loop completo es: Fernando entrega MP4→operador dobla→exporta MP3 de audio→regresa a Fernando→Fernando monta en video con SFX+música. El debate no documentó el loop de cierre. | El pipeline debe incluir el paso de regreso a Fernando; el output del operador es audio (MP3), no video |

---

## SECCIÓN 4: GAPS EN TRANSCRIPCIONES

*Temas que el debate cubre extensamente pero que NO aparecen en las transcripciones.*

| ID | Tema cubierto en debate | Ausencia en transcripciones | Interpretación |
|----|------------------------|---------------------------|----------------|
| GAP-T01 | **Dubbing Resource API vs. CSV Manual** (D-003) | Ningún operador menciona API, CSV, ni programación. Todo el flujo es web GUI. | Los operadores no tienen visibilidad de las opciones técnicas de API. La decisión D-003 es 100% arquitectónica y no afecta el workflow actual de los operadores |
| GAP-T02 | **Pronunciation Dictionaries (.pls files)** | No mencionados por ningún operador. El problema de pronunciación se menciona pero la solución propuesta (diccionarios .pls) no existe en el vocabulario operativo. | Los diccionarios de pronunciación son una herramienta ElevenLabs existente pero no adoptada. Requeriría capacitación y proceso nuevo. |
| GAP-T03 | **Forced Alignment API** | No mencionado. Los operadores no conocen este concepto. | Es una solución técnica para el Guion Zombie que requeriría implementación externa al workflow GUI actual. |
| GAP-T04 | **Dynamic Translation Routing** (DTR: Romance vs. CJK clusters) | No mencionado. Los operadores no distinguen clusters lingüísticos. | El DTR es una propuesta de arquitectura técnica invisible para los operadores. |
| GAP-T05 | **Model Tiering** (Eleven v3 vs. Flash v2.5) | No mencionado. Los operadores no seleccionan modelo TTS por idioma. | La selección del modelo es automática dentro de ElevenLabs GUI; los operadores no tienen control sobre esto. |
| GAP-T06 | **WER (Word Error Rate) como métrica** | No mencionado. No existe noción de métricas cuantitativas de calidad. | Confirma H-2 del Gold Standard: "zero quality metrics". No existe infraestructura de medición. |
| GAP-T07 | **Stems de Fernando** (DA-01: ¿Puede Fernando exportar stems?) | Las transcripciones confirman que Fernando entrega solo pista de voz, sin SFX ni música — esto responde parcialmente DA-01: Fernando SÍ separa pistas, pero entrega voz como archivo unificado, no stems separados por personaje. | DA-01 parcialmente respondida: Fernando hace separación de capas (voz / SFX+música), pero no stems por personaje individual. |
| GAP-T08 | **Saul/Ivan en AI-Studio** (DA-02: ¿Migrarán a AI-Studio?) | No mencionado. Los operadores son Angela y Sebastian; Saul e Ivan son otros editores con distinta área. | DA-02 sigue abierta. Las transcripciones de Angela y Sebastian no informan sobre el equipo de Saul/Ivan. |

---

## SECCIÓN 5: EVALUACIÓN DE DECISIONES DE DEBATE ESPECÍFICAS

### D-003: "CSV vs. Dubbing Resource API" — ¿Las transcripciones apoyan la decisión de ir por Resource API?

**Veredicto: NEUTRO con sesgo hacia CSV Manual como puente necesario.**

Las transcripciones confirman que el workflow actual es 100% GUI. El Codex ya documentaba el BLOCKER: los proyectos creados vía GUI no son accesibles por la Dubbing Resource API. Esto significa que:

1. La Resource API requeriría **crear proyectos desde cero vía API** — los operadores actuales no verían sus proyectos existentes.
2. El Manual Dub CSV es la única ruta de transición que preserva la estructura de proyectos existente en GUI.
3. **Sin embargo**, el `Sonnet_Devil_Advocate` documenta que el CSV Manual está marcado como "production use strongly discouraged" en docs de ElevenLabs.

**Recomendación de datos:** La migración a Resource API requiere un cambio de paradigma total (nuevos proyectos desde código, no desde GUI). El CSV Manual podría ser un puente temporal para el piloto E2E, pero no es una arquitectura permanente. La decisión D-003 permanece válida, pero la implementación debe ser gradual y no puede reutilizar proyectos GUI existentes.

---

### S-09: Confianza 35% en Manual Dub CSV — ¿Las transcripciones cambian este estimado?

**Veredicto: La confianza del 35% se MANTIENE o BAJA.**

Las transcripciones revelan que el proceso de edición GUI tiene una granularidad que el CSV Manual probablemente no captura:

- Splitting contextual basado en puntuación (G-05)
- Fusión de voces que requiere corrección de drag-and-drop (G-03)
- Parámetro de "número de hablantes" como input crítico (G-01)
- Reasignación manual de segmentos entre líneas de personaje

El CSV Manual es un formato de entrada plano que no representa estas operaciones de edición post-creación del proyecto. **La confianza realista en el CSV como sustituto completo del flujo GUI es menor del 35%**.

---

### Concepto de "Guion Zombie" — ¿Las transcripciones lo confirman?

**Veredicto: CONFIRMADO PARCIALMENTE. La causa raíz es correcta; la manifestación específica difiere.**

El debate describe el Guion Zombie como: "timestamps en el .docx del guion se vuelven stale después de la edición de Fernando en post-producción".

Las transcripciones revelan que:
1. **El guion no es un .docx** — es un Google Doc (CONTRA-02). No tiene timestamps embebidos como archivo descargable.
2. **Fernando sí hace edición de post-producción** que cambia el timing del audio (Alan: "él junta todas las animaciones y exporta el video junto"), validando que el timing del guion original difiere del timing del video entregado.
3. **La verificación actual es auricular y visual**, no automática. El operador escucha EN, detecta error semántico, verifica en guion ES.

El Guion Zombie es real como **problema de desincronía entre guion y video entregado**, pero la forma de resolverlo (Forced Alignment API leyendo un .docx) no aplica directamente porque el guion es Google Docs. La solución debe considerar una API de Google Docs o exportación previa.

---

### Pronunciation Dictionaries como solución — ¿Las transcripciones mencionan problemas de pronunciación?

**Veredicto: El PROBLEMA está confirmado. La SOLUCIÓN específica (.pls dictionaries) no es la respuesta completa.**

Evidencia de problema de pronunciación:
- Sebastian (en vivo, ~00:41:55): muestra que sin voz asignada específicamente, ElevenLabs "lo va a hacer así como muy raro, no se va a escuchar" bien.
- Sebastian (~00:49:22): "No va a sonar como un nativo, se puede decir."
- Tania (00:42:05): "Siento que está hablando un chinito en inglés." (voz española leyendo EN sin voice assignment correcto)

El problema de pronunciación tiene **dos causas**:
1. **Voz incorrecta asignada** — voz entrenada en español intenta articular inglés → acento no nativo. Esto se resuelve con la lista de voces pre-testeadas que ya existe.
2. **Términos específicos del show** (nombres propios, neologismos, términos de animación) — estos sí se beneficiarían de Pronunciation Dictionaries .pls.

**Los Pronunciation Dictionaries son relevantes pero no son la solución principal**. La solución principal ya está en práctica: la lista de voces pre-testeadas por idioma. Los .pls resolverían el problema residual de términos del show, no el problema central de voz inapropiada por idioma.

---

## SECCIÓN 6: MAPA DE RIESGOS ACTUALIZADO

| Riesgo | Nivel previo (debate) | Nivel actualizado | Justificación |
|--------|-----------------------|-------------------|---------------|
| API-first architecture no viable directamente | ALTO | **CRÍTICO** | Confirmado: proyectos GUI no accesibles por API. Requiere cambio de paradigma, no solo configuración |
| Guion Zombie invalida timestamps | ALTO | ALTO | Confirmado, pero el guion es Google Docs, no .docx — cambia la implementación de Forced Alignment |
| Zero QA en idiomas no-EN | ALTO | ALTO | Confirmado 100%: "nomás agregamos el idioma, asignamos voces y al siguiente idioma" |
| SSOT inexistente | ALTO | **CRÍTICO** | Confirmado: lista de voces en OneNote personal, guion en Google Docs compartido sin estructura API-accesible |
| Inconsistencia de nomenclatura | MEDIO | MEDIO | Confirmado: no existe convención formal entre editores |
| Manual Dub CSV como ruta permanente | ALTO | ALTO | La granularidad del flujo GUI supera lo que CSV captura |
| Fusión de voces / errores de segmentación | (no documentado) | **NUEVO — ALTO** | Confirmado por Sebastian: ElevenLabs fusiona voces entre personajes; requiere corrección manual |
| Número de hablantes como parámetro crítico | (no documentado) | **NUEVO — MEDIO** | Si se especifica incorrecto, todo el proyecto falla en asignación de personajes |

---

## SECCIÓN 7: PREGUNTAS ABIERTAS ACTUALIZADAS

| Pregunta | Estado previo | Estado post-transcripciones |
|----------|--------------|----------------------------|
| DA-01: ¿Fernando puede exportar stems? | ABIERTA | **PARCIALMENTE RESUELTA**: Fernando sí separa voz de SFX+música, entrega MP4 solo voz. No exporta stems por personaje individual. |
| DA-02: ¿Saul/Ivan migrarán a AI-Studio? | ABIERTA | Sigue ABIERTA — transcripciones no cubren equipo Saul/Ivan |
| ¿Existe convención de nomenclatura? | Sin datos | **RESUELTA negativamente**: No existe convención formal. Angela y Sebastian usan sus nombres de editor, sin estándar |
| ¿Cómo accede el operador al guion? | Sin datos claros | **RESUELTA**: Google Docs link compartido en Slack/Monday, no archivo descargable |
| ¿El proceso de QA usa el guion como referencia? | Sin datos | **RESUELTA**: Sí. El operador verifica transcripción ES escuchando + comparando con Google Doc del guion |
| ¿Cuál es el formato de salida del operador a Fernando? | Sin datos | **RESUELTA**: MP3 de audio únicamente (no video). Fernando monta el audio sobre el video con SFX+música |

---

## CONCLUSIÓN

Las transcripciones del 2026-02-23 son el primer levantamiento con **observación directa** del proceso operativo. Sus contribuciones críticas al corpus de debate son:

1. **Contradicción arquitectónica confirmada**: El BLOCKER del Codex (GUI ≠ API) es real y vigente. La arquitectura API-first requiere un diseño de migración gradual, no un switch directo.

2. **Guion Zombie confirmado con matiz**: La desincronía existe y es real, pero el guion es Google Docs, no .docx. El Forced Alignment debe leer desde Google Docs API.

3. **Zero QA confirmado**: El proceso de los 14 idiomas no-EN es assign-voice-and-export. No hay revisión de contenido, prosodia, ni timing semántico.

4. **Nuevos hallazgos de alto valor**: Fusión de voces (G-03), splitting contextual como tácito conocimiento (G-05), número de hablantes como parámetro crítico (G-01), loop de entrega de vuelta a Fernando (G-10).

5. **Validación del voice manifest**: El uso actual de listas de voces en archivos de texto locales (OneNote, .txt) confirma que un `voice_manifest.json` centralizado resolvería un pain point operativo real y existente.

**Próxima acción recomendada:** Producir síntesis de recomendaciones actualizadas (Tarea #6) incorporando estos hallazgos, especialmente la ruta de migración API-first que respete el BLOCKER GUI→API.

---

## REFERENCIAS

### Documentacion API de ElevenLabs (Knowledgebase)

- **Manual Dub CSV (experimental):** [`knowledgebase/elevenlabs_api/api-reference__dubbing__create.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__create.md) — L142-144: *"manual mode is experimental and production use is strongly discouraged"*
- **Formato CSV y ejemplos:** [`knowledgebase/elevenlabs_api/eleven-creative__products__dubbing__dubbing-studio.md`](../knowledgebase/elevenlabs_api/eleven-creative__products__dubbing__dubbing-studio.md) — L187-221
- **Dubbing Resource API (GET):** [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__get-resource.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__get-resource.md)
- **Dubbing Resource API (PATCH segment):** [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__update-segment.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__update-segment.md)
- **Dubbing Resource API (migrate segments):** [`knowledgebase/elevenlabs_api/api-reference__dubbing__resources__migrate-segments.md`](../knowledgebase/elevenlabs_api/api-reference__dubbing__resources__migrate-segments.md)
- **Forced Alignment:** [`knowledgebase/elevenlabs_api/api-reference__forced-alignment__create.md`](../knowledgebase/elevenlabs_api/api-reference__forced-alignment__create.md)
- **Speech-to-Text (Scribe v2):** [`knowledgebase/elevenlabs_api/api-reference__speech-to-text__convert.md`](../knowledgebase/elevenlabs_api/api-reference__speech-to-text__convert.md)
- **Pronunciation Dictionaries:** [`knowledgebase/elevenlabs_api/api-reference__pronunciation-dictionaries__create-from-rules.md`](../knowledgebase/elevenlabs_api/api-reference__pronunciation-dictionaries__create-from-rules.md)

### Documentos de debate referenciados

- [`debate/Claude_Gold_Standard_Consenso_Final.md`](Claude_Gold_Standard_Consenso_Final.md) — H-1 API-first, H-5 CSV no es pilar, D-003 CSV vs Resource API
- [`debate/Codex_2026-02-20_Gold_Standard_Unificado.md`](Codex_2026-02-20_Gold_Standard_Unificado.md) — GS-01 BLOCKER GUI/API, SSOT 4 capas
- [`debate/Sonnet_Devil_Advocate_Critique.md`](Sonnet_Devil_Advocate_Critique.md) — L176 CSV riesgo ALTO, L303 GUI/API separacion
- [`debate/Gemini_3.1_PRO_Deep_Audit_QPH.md`](Gemini_3.1_PRO_Deep_Audit_QPH.md) — Dubbing Resource API, Forced Alignment
- [`debate/Gemini_Deep_Thinking_Deep_Audit_QPH.md`](Gemini_Deep_Thinking_Deep_Audit_QPH.md) — DTR, tiering de idiomas
- [`debate/Propuesta_Equipo_No_Tecnica.md`](Propuesta_Equipo_No_Tecnica.md) — Flujo ES→EN→otros

### Transcripciones fuente

- [`docs/levantamientos/26_02_23_ProcesosDoblaje_Angela_spa.txt`](../docs/levantamientos/26_02_23_ProcesosDoblaje_Angela_spa.txt)
- [`docs/levantamientos/26_02_23_ProcesosDoblaje_Sebastian.txt`](../docs/levantamientos/26_02_23_ProcesosDoblaje_Sebastian.txt)

### Sintesis final

- [`debate/Sintesis_Final_Auditoria_Doblaje_2026-02-23.md`](Sintesis_Final_Auditoria_Doblaje_2026-02-23.md) — 3 rutas para Ramon, voice manifest, top 10 recomendaciones
