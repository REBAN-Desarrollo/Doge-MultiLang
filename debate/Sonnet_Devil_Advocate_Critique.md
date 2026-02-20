# Critica: Abogado del Diablo — Plan Doge-MultiLang

**Fecha:** 2026-02-19
**Autor:** Claude Sonnet 4.6 — Critica independiente, no consenso
**Contexto:** Tras leer los 4 documentos asignados MAS los siguientes archivos descubiertos en el repo:
- `PRD_FINAL.md` (producto del swarm de 4 waves)
- `knowledgebase/blacklists/` (3 archivos JSON)
- `docs/levantamientos/26_02_18_checklist_audio_qa.md` (13 pistas)
- `knowledgebase/theories/model_comparison_benchmark.md`
- `docs/levantamientos/elevenlabs_legacy/25_12_24_benchmark_research_dubbing.md`
- `docs/levantamientos/elevenlabs_legacy/25_12_24_technical_spec_elevenlabs.md`

**Metodologia:** Buscar contradicciones, asunciones no verificadas, riesgos ignorados y preguntas que nadie ha formulado. Sin piedad pero con propuesta de mitigacion en cada punto.

---

## RESUMEN EJECUTIVO DEL PROBLEMA

El `claude_debate.md` v2 (el documento a criticar) esta bien razonado pero descansa sobre una premisa central que nunca se verifica: **que el codigo en AI-Studio (PR #71) existe, funciona y es relevante**. Todo lo demas es secundario a esa asuncion. Si el PR esta stale, roto o abandonado, el plan v2 se derrumba tan completamente como el plan del swarm. Solo el nombre del error cambia.

---

## SECCION 1: ASUNCIONES NO VERIFICADAS

### 1.1 "Phase 1 + Phase 2 estan implementadas" — No verificado desde dentro del repo

**El problema:**
El master plan de dic 2024 dice que `backend/api/dubbing.py`, `services/elevenlabs.py`, `services/docx_parser.py` y `app/dubbing/page.tsx` estan implementados. El `claude_debate.md` v2 toma eso como hecho.

**Pero nadie ha abierto esos archivos.**

El master plan es un documento de planificacion escrito en diciembre 2024. La afirmacion "IMPLEMENTADO" en ese documento puede significar cualquiera de las siguientes cosas, y el plan no distingue entre ellas:
- A) Codigo en produccion, probado con episodios reales
- B) Codigo que compila y tiene tests unitarios
- C) Codigo que compila sin tests
- D) Codigo escrito en diciembre 2024, nunca ejecutado, posiblemente roto por cambios en dependencias
- E) Un esqueleto de codigo con `# TODO` adentro

**La evidencia real disponible:**
- El master plan dice "PR #71 abierto para revision" — en DICIEMBRE 2024.
- Hoy es FEBRERO 2026. Han pasado 14 meses.
- No hay evidencia de que ese PR haya sido mergeado, rechazado o actualizado.
- No hay evidencia de que el sistema haya procesado UN SOLO episodio real.
- El `DUBBING_SAUL_IVAN.md` (actualizado 2026-02-18) dice explicitamente: "ElevenLabs API: Objetivo - pendiente migracion." Si el modulo de AI-Studio estuviera funcionando, Saul/Ivan ya lo estarian usando. No lo estan.

**Conclusion:** La probabilidad de que un PR abierto hace 14 meses, que jamas se menciona como "en uso", este en condicion de produccion es extremadamente baja. El plan v2 asume el escenario A sin haberlo verificado.

**Mitigacion:** Antes de escribir una linea de Phase 3, verificar el estado real de ese PR. Esto no toma "2-3 horas de investigacion" como dice el plan v2 — toma 15 minutos de abrir el repo de AI-Studio y ejecutar `python main.py` seguido de un test end-to-end manual.

---

### 1.2 "alignment_engine.py esta entregado (Phase 3)"

**El problema:**
El master plan en su tabla de estado marca M5 (Audio Desincronizado) como: "alignment_engine.py — Entregado (Phase 3)". Pero en la misma tabla, Phase 3 esta marcada como "PENDIENTE". El `claude_debate.md` v2 detecta esta contradiccion pero la deja como "pregunta abierta para Daniel".

**Esto no es una pregunta. Es una bandera roja.**

Si alignment_engine.py "fue entregado" pero Phase 3 "no esta implementada", la explicacion mas probable es una de dos:
- A) La columna "Estado" en esa tabla fue llenada optimistamente antes de escribir el codigo, y no refleja realidad
- B) El archivo existe pero esta vacio o es un stub

En cualquiera de los dos casos, el "Re-Alignment Engine" (Prioridad 3 del plan v2) no existe. Y ese componente es el que resuelve el problema del Guion Zombie, que es el problema sistemico mas critico del pipeline segun el mismo `POSTPROD_FERNANDO.md`.

**Mitigacion:** Antes de planear "completar Phase 3", confirmar si alignment_engine.py existe en AI-Studio, cuantas lineas tiene, y si puede ejecutarse. No asumir.

---

### 1.3 "El costo es ~$1.20/proyecto"

**El problema:**
El calculo en el Anexo A del master plan es:
- Whisper: 170 min x $0.006/min = $1.02
- Gemini Flash: 170 min x $0.001/min = $0.17
- Total: ~$1.20

Esta calculo tiene al menos 4 problemas:

**Problema A — El precio de Whisper era de dic 2024.**
OpenAI ha modificado precios multiples veces. Whisper-1 a $0.006/min era el precio en 2024. En feb 2026 puede ser diferente. Nadie lo ha verificado.

**Problema B — "170 min" es una estimacion sin respaldo.**
16 idiomas x 10 min = 160 min de audio. Pero 10 min es la duracion del video, no del audio de cada idioma. El dubbing genera audio por personaje, con silencios. La duracion real del audio a transcribir puede ser menor (solo segmentos con dialogo) o mayor si se procesan idiomas en paralelo con padding. El numero exacto no se justifica.

**Problema C — El calculo asume que Whisper puede transcribir en todos los idiomas con igual precision.**
Para Tamil (TA), Malay (MS) y Filipino (FIL) — idiomas del Tier 3 — Whisper tiene precision significativamente menor. Un WER alto en la transcripcion de auditoria no significa que el audio este mal; puede significar que Whisper no puede transcribir ese idioma bien. El sistema de auditoria podria generar falsos positivos masivos en Tier 3.

**Problema D — Solo se cuenta el costo del audio generado, no el costo del MP4 inicial.**
Si el Re-Alignment Engine usa Whisper sobre el MP4 de Fernando (el paso previo a dubbing), ese costo de STT no esta en el calculo.

**Mitigacion:** Verificar precio actual de Whisper y Gemini Flash. Medir duracion real de audio con dialogo (no video completo) en un episodio real. Evaluar precision de Whisper en los 10 idiomas del Tier 3 antes de usarlo como juez de calidad en esos idiomas.

---

### 1.4 Los levantamientos de Saul/Ivan y Fernando NO han sido validados

**El problema:**
`DUBBING_SAUL_IVAN.md` dice explicitamente al final: "Status del DRAFT: ~70-80% confianza (basado en conocimiento del owner). Pendiente validacion con Saul e Ivan."

`POSTPROD_FERNANDO.md` dice: "Status del DRAFT: ~75-85% confianza (Daniel cubriendo rol de Fernando). Pendiente validacion de Fernando."

**El plan v2 trata los 7 Mudas de Saul/Ivan y las 5 Mudas de Fernando como hechos verificados.** No lo son. Son la interpretacion de Daniel del proceso, sin confirmacion del actor real.

Consecuencias practicas:
- Las 7 Mudas pueden estar incompletas o mal priorizadas
- Saul/Ivan pueden tener dolor points que Daniel no menciona
- Fernando puede tener restricciones tecnicas para exportar stems que Daniel no conoce
- El "Guion Zombie" puede ser menos frecuente de lo que parece

**Mitigacion:** Ninguna solucion tecnica deberia comenzar a implementarse sin al menos una sesion de validacion de 30 minutos con Saul/Ivan y con Fernando. Esto no es burocracia — es engineering basico.

---

## SECCION 2: RIESGOS IGNORADOS

### 2.1 ElevenLabs cambio su API entre dic 2024 y feb 2026 — 14 meses de delta

**El problema:**
La KB de ElevenLabs en `knowledgebase/` fue crawleada en diciembre 2024. La `knowledgebase/README.md` lo confirma. Han pasado 14 meses.

**Lo que pudo cambiar:**
- Text-to-Dialogue v3: El master plan lo menciona como solucion para M3 (Mezcla de Personajes). El PRD_FINAL.md dice que "Voice Segments v3 does not exist as an ElevenLabs product" (encontrado con 0 resultados en 735 entradas KB). Si Text-to-Dialogue v3 tampoco existe o cambio su API, la solucion para M3 no tiene sustento.
- Manual Dub CSV: El Holy Grail del plan depende de que ElevenLabs acepte un CSV con timestamps. El PRD_FINAL.md marca esto como "1 unknown API format". Si este formato no existe o cambio, el Holy Grail Workflow no funciona.
- Forced Alignment API: Listada en el master plan como disponible. Puede haber sido deprecada.
- Precios: La cuenta de ElevenLabs que usa el equipo (Plan Pro segun DUBBING_SAUL_IVAN.md) puede tener limitaciones de rate o cambios de precio que invalidan el modelo de costos.
- Dubbing Resources API: El endpoint `/v1/dubbing/{id}/resources` que el plan usa para editar segmentos puede haber cambiado su schema.

**El `claude_debate.md` v2 menciona esto exactamente UNA vez:** "Verificar la API actual de ElevenLabs (feb 2026 vs dic 2024)." Y lo trata como un item de checklist de 5 puntos, no como el riesgo bloqueante que es.

**Mitigacion:** Antes de implementar CUALQUIER componente que toque la API de ElevenLabs, hacer un spike tecnico de 1 dia: levantar un proyecto de prueba con el endpoint critico (Manual Dub CSV y/o Text-to-Dialogue) y confirmar que funciona con la documentacion actual de ElevenLabs. No usar la KB de dic 2024 como fuente de verdad de la API.

---

### 2.2 Saul/Ivan pueden rechazar migrar a AI-Studio

**El problema:**
El plan v2 dice "Onboard a Saul/Ivan en el modulo de AI-Studio en vez de Web UI." Pero:
- Saul/Ivan llevan tiempo trabajando con la Web UI de ElevenLabs. Tienen un workflow, atajos de teclado, y familiaridad.
- AI-Studio es un producto interno que probablemente tiene menos pulido de UX que la Web UI de ElevenLabs.
- No hay evidencia de que Saul/Ivan hayan sido consultados sobre si QUIEREN migrar.
- El `DUBBING_SAUL_IVAN.md` menciona "ElevenLabs API: Objetivo - pendiente migracion" — esto suena a decision de management, no a preferencia del operador.

**Escenario real:** Saul/Ivan miran AI-Studio, encuentran que faltan features de la Web UI (como auto-scroll — Muda #7), y prefieren seguir con ElevenLabs Web UI. El trabajo de Phase 1+2 queda inutilizado.

**Otro escenario:** AI-Studio tiene bugs en el modulo de dubbing (PR #71 nunca mergeado = potencialmente nunca probado en produccion), Saul/Ivan pierden trabajo real durante la transicion, y se genera resistencia organisacional hacia el proyecto.

**Mitigacion:** Antes de planear el onboarding, hacer una demo de 1 hora con Saul/Ivan donde ellos usen AI-Studio y den feedback. Identificar que features de la Web UI son indispensables para ellos y garantizar que estan en AI-Studio antes de pedir la migracion.

---

### 2.3 Fernando NO puede exportar stems por personaje — y nadie lo ha confirmado

**El problema:**
La Opcion A ("Multi-Track Stems") es descrita en el master plan como "El Ideal." La dependencia critica es que Fernando exporte audio separado por personaje desde After Effects.

Pero:
- El `POSTPROD_FERNANDO.md` describe el flujo de Fernando en detalle. En ningun momento menciona exportar stems por personaje. Su workflow termina en un MP4 con audio mixeado.
- El paso 7 del flujo de Fernando dice: "Export dual — 16:9 y 9:16" y "Audio ES separado para Saul/Ivan (voz limpia sin BGM/SFX solapados)." Esto es un solo archivo de audio, no pistas separadas por personaje.
- El `POSTPROD_FERNANDO.md` fue escrito por Daniel cubriendo el rol de Fernando. 75-85% de confianza. No validado.
- Sacar stems por personaje de After Effects requiere que Fernando haya mantenido las pistas de audio de cada personaje separadas durante todo el proceso. Dado que Fernando recibe el TTS de Ramon (que SI es por personaje), esto es tecnicamente posible, pero requiere disciplina de proyecto que actualmente no esta forzada.

**Mitigacion:** Preguntar directamente a Fernando si puede (y quiere) exportar stems por personaje. Si la respuesta es no, eliminar la Opcion A del plan y quedarse con la Opcion B (Re-Alignment). No planear arquitectura sobre una capacidad no confirmada.

---

### 2.4 El sistema de tiering de QA asume validadores que no existen

**El problema:**
`DUBBING_SAUL_IVAN.md` define un sistema de 3 tiers:
- Tier 1 (ES, EN, PT-BR, FR, DE): 100% revision humana
- Tier 2 (AR, KO, JA, HI, ZH): muestreo ~30%
- Tier 3 (FIL, ID, IT, RU, TR, TA, MS): solo automatico

El documento luego dice:
> "Solo se verifica que el audio 'suene al idioma' y se muestrean algunos. El equipo reconoce que deberian usar hablantes nativos + IA con reglas para validar correctamente idiomas que no hablan."

**Para Tier 2: ¿Quien hace el muestreo del 30%?**
Saul/Ivan no hablan arabe, coreano, japones, hindi ni mandarin. El "muestreo inteligente" es operativamente imposible sin hablantes nativos. El sistema de tiering es un deseo, no una realidad operativa.

**Para Tier 3: "Solo automatico" es en realidad "sin validacion".**
WER mide si las palabras son correctas, no si la traduccion es apropiada culturalmente para ninos de 8-15 anos. Una traduccion puede tener WER de 0% y ser culturalmente ofensiva o inapropiada en el contexto del contenido.

**Mitigacion:** Reconocer explicitamente que actualmente Tier 2 y Tier 3 son "confianza ciega en ElevenLabs." Si el plan de QA no incluye presupuesto para revisores nativos o servicios de localizacion, los umbrales de WER son decorativos.

---

### 2.5 El checklist de 13 pistas tiene pistas que no se pueden automatizar — y nadie lo dice

**El problema:**
El `checklist_audio_qa.md` define 13 pistas de calidad. El plan v2 dice que `audit_service.py` deberia "automatizar lo que se pueda de estas 13 pistas."

Revisando las pistas:
- Pistas 1-9: Pertenecen al trabajo de Fernando en post-produccion (BGM, SFX, LUFS, lip sync). Son del video final mezclado, NO del audio de dubbing. `audit_service.py` no puede auditarlas sin acceso al video final, y hacerlo requeriria analisis de video, no solo de audio.
- Pista 10: TTS ElevenLabs — automatizable
- Pista 11: Sync de dubbing — parcialmente automatizable
- Pista 12: WER — automatizable
- Pista 13: Revision final del master — 100% humana (requiere juicio editorial)

El Anexo A del master plan SOLO automatiza WER (Pista 12) y parcialmente Pista 11. Las Pistas 1-9 son trabajo de Fernando y no se pueden delegar a `audit_service.py` sin arquitectura adicional significativa.

El plan v2 menciona que "el checklist deberia ser la base del audit_service.py" sin aclarar que 9 de 13 pistas son fuera del scope del dubbing automatico.

**Mitigacion:** Ser explicito sobre que `audit_service.py` cubre Pistas 10-12 (parcialmente) y la Pista 13 queda humana siempre. No generar expectativas de que "las 13 pistas" seran automatizadas.

---

## SECCION 3: GAPS EN EL PLAN

### 3.1 No hay plan de onboarding para Saul/Ivan

**El problema:**
El plan v2 dice "Onboard a Saul/Ivan en el modulo de AI-Studio." Eso no es un plan. Es un objetivo.

No existe en ningun documento:
- Como se va a demostrar el valor del modulo a Saul/Ivan
- Cuanto tiempo tomara la transicion
- Quien entrena a Saul/Ivan en el nuevo flujo
- Como se maneja el periodo en que Saul/Ivan estan aprendiendo AI-Studio y la velocidad de produccion cae
- Que pasa si encuentran un bug critico en produccion durante la transicion
- Como se hace rollback a la Web UI si algo falla

**Mitigacion:** Crear un plan de migracion gradual. Propuesta: primero correr un episodio completo en paralelo (Web UI y AI-Studio) para comparar resultados. Solo migrar completamente cuando AI-Studio demuestre paridad o superioridad en un episodio real.

---

### 3.2 No hay plan de testing del codigo existente

**El problema:**
El plan v2 dice en Prioridad 1: "Verificar que PR #71 existe y funciona en AI-Studio" y "Probar el flujo completo: docx -> dubbing -> ElevenLabs."

Pero "probar el flujo completo" en un sistema que no tiene tests automaticos y cuyo PR lleva 14 meses sin ser mergeado no es trivial. No hay:
- Definicion de que significa "funciona" (criterios de exito)
- Casos de prueba definidos
- Datos de prueba disponibles (un docx real, un MP4 real)
- Ambiente de staging separado de produccion

Si el equipo prueba Phase 1+2 sobre la cuenta de ElevenLabs de produccion y algo falla, puede corromper proyectos activos.

**Mitigacion:** Crear un ambiente de testing con una cuenta de ElevenLabs separada (o usar un proyecto de prueba) antes de cualquier verificacion. Definir criterios de exito claros para Phase 1+2 antes de declarar que funcionan.

---

### 3.3 La transicion de Web UI a API no tiene plan de rollback

**El problema:**
Actualmente Saul/Ivan usan la Web UI de ElevenLabs directamente. El plan v2 propone que usen AI-Studio como intermediario. Esto introduce una nueva capa de fallo.

Si AI-Studio tiene un bug durante produccion de un episodio:
- El episodio queda bloqueado hasta que el bug se corrija
- El workaround es volver a la Web UI, pero Saul/Ivan ya subieron el proyecto via API (AI-Studio)
- Los proyectos creados via API y via Web UI son instancias separadas en ElevenLabs — no se puede continuar en Web UI un proyecto iniciado por API con los mismos datos facilmente

No hay documentado:
- Cuando se puede hacer rollback a la Web UI
- Como se recupera el trabajo hecho en API si el sistema cae
- Quien es el responsable de resolver bugs de AI-Studio durante produccion

**Mitigacion:** Documentar explicitamente el procedimiento de emergencia si AI-Studio falla durante dubbing de un episodio en produccion.

---

### 3.4 Los 10 idiomas de Tier 3 son un pasivo no cuantificado

**El problema:**
Hay 7 idiomas en Tier 3: Filipino (FIL), Indonesio (ID), Italiano (IT), Ruso (RU), Turco (TR), Tamil (TA), Malay (MS). Y potencialmente mas hasta llegar a 27 totales. Estos son "solo automatico, flagged por metricas."

Pero:
- Nadie habla estos idiomas en el equipo para validar la calidad
- Whisper tiene precision notablemente menor en Tamil (TA) — uno de los idiomas mas dificiles para STT
- ElevenLabs puede tener voces de calidad variable en estos idiomas
- Una traduccion incorrecta en indonesio o turco que llega a millones de ninos de 8-15 anos puede generar problemas reputacionales serios
- No hay metrica de views o engagement por idioma para saber si estos mercados valen la inversion de riesgo

El plan v2 dice "27 idiomas sin validacion para la mayoria" en la seccion "Lo que esta roto" — pero no propone hacer nada al respecto. Es solo una nota.

**Mitigacion:** Evaluar si los 10 idiomas de menor alcance deben pausarse hasta tener capacidad de validacion real. El costo de un episodio mal doblado en turco puede superar el beneficio del alcance en ese mercado.

---

## SECCION 4: CONTRADICCIONES ENTRE DOCUMENTOS

### 4.1 "17 idiomas activos" vs "27 idiomas" vs "16 idiomas activos"

**Las tres fuentes:**
- `master_plan_dubbing.md` (dic 2024): Menciona "16 idiomas activos" en el diagrama del workflow y en el calculo de costos (16 x 10 min = 160 min)
- `DUBBING_SAUL_IVAN.md` (feb 2026): "27 idiomas activos listados en operacion"
- `claude_debate.md` v2: "Son 27 idiomas activos segun Q8 DRAFT. Se priorizan 17, pero operan 27."
- `checklist_audio_qa.md` (feb 2026): Pista 12 define tiering para idiomas sin mencionar el numero total
- `PRD_FINAL.md`: Habla de "17 target languages" en la UI Blueprint

**El numero real de idiomas activos es desconocido.** Y no es trivial — afecta directamente el costo de auditoria, el tiempo de procesamiento y la capacidad del equipo.

**Mitigacion:** Definir y documentar en un solo lugar el numero canonico de idiomas activos, con distincion entre "activos en produccion", "en prueba", y "objetivo futuro".

---

### 4.2 "alignment_engine.py Entregado" vs "Phase 3 PENDIENTE"

Documentado en detalle en seccion 1.2. Esta es la contradiccion mas importante del plan.

---

### 4.3 El PRD_FINAL.md del swarm y el claude_debate.md v2 son incompatibles pero coexisten

**El problema:**
El repo tiene dos documentos que proponen arquitecturas mutuamente excluyentes:
- `PRD_FINAL.md`: "0 scripts implementados. Construir 18 scripts desde cero en Doge-MultiLang."
- `claude_debate.md` v2: "Phase 1+2 implementadas en AI-Studio. No construir scripts sueltos. Solo Phase 3 falta."

Ambos documentos estan en el repo como si fueran igualmente validos. Cualquier persona nueva que lea el proyecto sin contexto estara confundida sobre cual es el plan real.

No hay un documento que diga explicitamente: "El PRD_FINAL.md fue invalidado por los hallazgos del claude_debate.md v2. El plan correcto es X."

**Mitigacion:** Necesita haber un documento de decision (Architecture Decision Record) que cierre formalmente el PRD_FINAL.md y declare cual es el plan actual. Sin ese documento, el proximo AI que analice el repo va a producir una opinion v3 que contradice v2.

---

### 4.4 Los levantamientos de Saul/Ivan usan "17 idiomas" en el workflow y "27 idiomas" en el tiering

**En `DUBBING_SAUL_IVAN.md`:**
- El flujo de trabajo menciona "genera 16 idiomas activos" (en el diagrama)
- La seccion de tiering lista 7+5+7=... contando: ES, EN, PT-BR, FR, DE (5), AR, KO, JA, HI, ZH (5), FIL, ID, IT, RU, TR, TA, MS (7) = 17 idiomas en la tabla de tiering
- La nota al pie dice "27 idiomas activos listados en operacion"

**La discrepancia entre 17 y 27 nunca se explica.** Los 10 idiomas adicionales no aparecen en ninguna tabla. No sabemos cuales son, en que tier estan, ni si generan audio o solo texto.

---

## SECCION 5: LO QUE NADIE HA PREGUNTADO

### 5.1 Cuanto dinero se pierde por episodio mal doblado?

**Nadie lo ha calculado.**

Los documentos hablan de "KPIs" y "objetivos de WER" pero no cuantifican el impacto economico de un episodio con dubbing de baja calidad. Sin este numero, no hay forma de priorizar cuanto invertir en QA.

Preguntas sin respuesta:
- Si un episodio en aleman tiene 20% WER, cuanto cae la retencion en ese mercado?
- Cuanto revenue representa ese mercado para QPH?
- Cuanto cuesta re-procesar ese episodio (tiempo de Saul/Ivan)?
- Comparado con el costo de Phase 3: vale la pena?

Si el mercado aleman genera $0 de revenue directo (solo views), y re-procesar un episodio toma 2 horas de Saul/Ivan, el ROI de Phase 3 es muy diferente al que proyecta el Anexo A ($50/proyecto de ahorro).

**Mitigacion:** Conseguir datos de analytics de YouTube por idioma antes de planear la expansion de QA. Si 15 de los 27 idiomas generan menos del 5% de views combinados, la decision correcta puede ser reducir el scope, no automatizar mas.

---

### 5.2 Cuantas quejas de audiencia ha recibido QPH por idioma?

**No hay datos de esto en ningun documento.**

El sistema de tiering asume que Tier 1 (ES, EN, PT-BR, FR, DE) tiene la audiencia mas critica. Pero esa asuncion puede estar equivocada. QPH puede tener una base de fans muy activa en coreano que se queja activamente de errores de traduccion, mientras que la audiencia en frances puede ser mas tolerante o mas pequena.

Sin datos de quejas por idioma, el sistema de tiering es una opinion, no un sistema basado en evidencia.

**Mitigacion:** Revisar comentarios de YouTube y redes sociales en los idiomas del Tier 2 y Tier 3 para identificar donde estan los problemas reales de calidad percibidos por la audiencia.

---

### 5.3 Cual es el costo real de operar 27 idiomas vs reducir a 10?

**El problema:**
El equipo asume que mas idiomas = mas alcance = mas bueno. Pero cada idioma adicional tiene costo:
- Costo de ElevenLabs por episodio (characters processed)
- Costo de tiempo de Saul/Ivan para revision
- Costo de QA (aunque sea automatico, hay latencia y debugging)
- Riesgo reputacional de contenido malo en idiomas que nadie valida
- Costo de soporte si algo sale mal

Nadie ha calculado el costo total por idioma activo. La decision de "operar 27 idiomas" puede ser una decision financieramente irresponsable si 17 de esos idiomas no generan ROI positivo.

**Mitigacion:** Calcular el costo mensual por idioma (ElevenLabs + tiempo humano) y comparar contra el revenue o valor de audiencia generado por ese idioma. Pausar idiomas con ROI negativo.

---

### 5.4 ElevenLabs es el proveedor correcto en febrero 2026?

**El problema:**
La eleccion de ElevenLabs fue hecha en diciembre 2024. Han pasado 14 meses. El mercado de dubbing automatizado ha cambiado significativamente.

El documento `benchmark_research_dubbing.md` menciona que el modelo de benchmarking es GPT-4o vs Claude 3.5 Sonnet. Pero el `model_comparison_benchmark.md` en `knowledgebase/theories/` (presumiblemente mas reciente) identifica a Gemini 2.5 Pro como el modelo #1 para traduccion segun WMT25, y menciona DeepSeek V3 como "altamente competitivo y economico."

**Lo que no se pregunta en ningun documento:**
- Hay alternativas a ElevenLabs para dubbing multi-idioma en feb 2026? (Play.ht, Murf, HeyGen, Resemble AI, etc.)
- Alguna alternativa tiene mejor soporte para los idiomas del Tier 3 (Tamil, Malay)?
- El costo por caracter de ElevenLabs es competitivo en feb 2026 vs alternativas?
- ElevenLabs tiene las mismas voces para ninos que necesita QPH en las alternativas?

El plan completo asume que ElevenLabs es el proveedor correcto porque fue elegido en dic 2024. Esa asuncion merece revision anual.

**Mitigacion:** Hacer un benchmark de al menos 2 alternativas contra ElevenLabs con un segmento real del pipeline de QPH. Especialmente evaluar calidad en Tier 3 donde ElevenLabs puede tener gaps.

---

### 5.5 El "Guion Zombie" tiene una solucion correcta pero con una asuncion oculta

**El problema:**
Tanto el master plan como el `claude_debate.md` v2 proponen la "Transcription-First Architecture" como solucion al Guion Zombie: usar Whisper sobre el MP4 de Fernando para obtener el texto REAL, luego hacer fuzzy match con el manifest.json de Ramon para identificar quienes hablan.

**La asuncion oculta:** El fuzzy match funciona.

Escenario real de fallo:
- Fernando anade una linea nueva que no existia en el guion de Ramon (ad-lib, corrección de director)
- Whisper transcribe esa linea correctamente
- El fuzzy match busca esa linea en el manifest.json de Ramon
- No la encuentra porque no existia
- El sistema no sabe a quien asignar esa linea

El `POSTPROD_FERNANDO.md` confirma que Fernando puede anadir dialogos: "Fernando puede recortar, ajustar o modificar dialogos durante la mezcla." Esto incluye potencialmente agregar lineas.

Para lineas agregadas por Fernando que no estan en el manifest de Ramon, el Re-Alignment Engine falla silenciosamente o asigna voz incorrecta. En un sistema de produccion para ninos, este tipo de error (personaje A habla con voz de personaje B) es exactamente el defecto que se quiere eliminar.

**Mitigacion:** El Re-Alignment Engine necesita manejar explicitamente el caso de "linea sin match en manifest." Opciones: flag para revision humana, asignar a un voice ID de "voz desconocida", o usar speaker diarization por separado para estimar quien habla. Este caso edge debe estar en los tests antes de declarar el sistema funcional.

---

## SECCION 6: LOS PROBLEMAS MAS CRITICOS (ORDENADOS POR IMPACTO)

| # | Problema | Impacto | Verificable en | Accion Minima |
|:--|:---------|:--------|:---------------|:--------------|
| 1 | PR #71 puede estar stale/roto — toda la premisa del plan v2 depende de el | CRITICO | Abrir AI-Studio y ejecutar el modulo | 15 minutos |
| 2 | alignment_engine.py puede no existir — invalida Prioridad 3 del plan | CRITICO | Buscar el archivo en AI-Studio | 5 minutos |
| 3 | ElevenLabs API cambio en 14 meses — Manual Dub CSV y Text-to-Dialogue pueden no funcionar | ALTO | Hacer un POST a la API actual | 1 dia de spike |
| 4 | Levantamientos de Saul/Ivan y Fernando no validados — las Mudas pueden estar mal | ALTO | 30 min de entrevista con cada uno | 1 hora |
| 5 | 27 idiomas sin datos de ROI — puede ser un pasivo, no un activo | ALTO | Extraer analytics de YouTube por idioma | 2 horas |
| 6 | Fuzzy match falla en lineas agregadas por Fernando | MEDIO | Testear con un episodio real que tenga ad-libs | 2 horas |
| 7 | Whisper tiene precision baja en Tamil/Malay — auditoria da falsos positivos en Tier 3 | MEDIO | Benchmark Whisper en 5 min de audio TA/MS | 1 dia |
| 8 | No hay plan de rollback si AI-Studio falla en produccion | MEDIO | Documentar el procedimiento | 2 horas |
| 9 | PRD_FINAL.md y claude_debate.md v2 coexisten como contradiccion sin resolver | BAJO | Escribir un ADR que cierre el PRD | 30 minutos |
| 10 | Blacklists solo tienen 3 idiomas cubiertos (global, AR, DE) — faltan 24 | BAJO | Inventariar que idiomas no tienen blacklist | 30 minutos |

---

## SECCION 7: SOBRE LAS BLACKLISTS — UN GAP CONCRETO

El directorio `knowledgebase/blacklists/` contiene 3 archivos:
- `blacklist_global.json` — 6 palabras, actualizado 2024-12-24
- `blacklist_ar.json` — 5 palabras, actualizado 2024-12-24
- `blacklist_de.json` — (presente en dos lugares: docs/levantamientos/ y knowledgebase/)

**Los 27 idiomas activos necesitan blacklists especificas.** Se tienen 2 idiomas cubiertos (AR, DE) de un subconjunto de palabras. Los idiomas faltantes incluyen algunos de los mas criticos para contenido infantil:
- KO (coreano): sin blacklist
- JA (japones): sin blacklist
- ZH (mandarin): sin blacklist — y el mercado chino tiene filtros de contenido extremadamente estrictos
- HI (hindi): sin blacklist
- TR (turco): sin blacklist

La `blacklist_global.json` tiene "version: 1.0" y fue actualizada por ultima vez el 24 de diciembre de 2024. No hay mecanismo documentado para actualizarla cuando se descubren palabras nuevas.

**La nota al pie de blacklist_global.json dice:**
> "Ver archivos en by_language/ para restricciones por idioma"

Pero el directorio `by_language/` no existe en el repo.

---

## CONCLUSION: QUE HACER EN LOS PROXIMOS 5 DIAS ANTES DE ESCRIBIR CODIGO

El plan v2 propone "verificar en 2-3h" y luego implementar. Eso esta mal. Antes de una sola linea de codigo:

**Dia 1 — Verificacion de codigo existente (no se puede delegar):**
1. Abrir el repo de AI-Studio. Encontrar PR #71.
2. Verificar si fue mergeado. Si no, por que no?
3. Si existe la rama, ejecutar `python main.py` en ambiente local
4. Abrir `/dubbing` en el browser. Funciona la UI?
5. Buscar `alignment_engine.py`. Existe? Cuantas lineas tiene?
6. Documentar el estado real con screenshots o logs

**Dia 2 — Validacion de API de ElevenLabs:**
1. Abrir la documentacion actual de ElevenLabs (no la KB de dic 2024)
2. Verificar que `POST /v1/dubbing` con CSV de timestamps funciona
3. Verificar que Text-to-Dialogue o su equivalente actual existe
4. Testear `POST /v1/forced-alignment` — sigue activo?
5. Documentar los endpoints que funcionan vs los que cambiaron

**Dia 3 — Validacion humana (entrevistas):**
1. 30 min con Saul/Ivan: mostrarles el plan de AI-Studio, obtener feedback real
2. 30 min con Fernando: confirmar si puede exportar stems por personaje
3. Documentar las respuestas — no asumir

**Dia 4 — Datos de negocio:**
1. Extraer views de YouTube por idioma para los ultimos 3 meses
2. Identificar los 5 idiomas con mayor retorno de inversion
3. Identificar los idiomas que podrian pausarse sin impacto significativo
4. Revisar comentarios en los idiomas del Tier 2/3 para detectar quejas de calidad

**Dia 5 — Decision de arquitectura:**
Con datos reales de los dias 1-4, tomar decisiones informadas:
- El codigo de AI-Studio sirve o hay que reconstruir?
- ElevenLabs tiene la API que se necesita o hay que hacer ajustes?
- Cuantos idiomas deben estar en el MVP de Phase 3?
- Vale la pena implementar Re-Alignment o la Opcion A (Stems) es mas rapida?

Solo despues de ese proceso, el plan v2 puede ser validado o revisado con datos reales. Sin ese proceso, el plan v2 es solo una opinion mejor informada que el swarm original — pero sigue siendo una opinion.

---

**Nota del autor:**
El `claude_debate.md` v2 es un trabajo de analisis solido que corrigio errores importantes del swarm. Pero la correccion de "greenfield a Phase 3" descansa en evidencia documental, no en evidencia de codigo ejecutable. La diferencia entre un documento que dice "IMPLEMENTADO" y un sistema que funciona en produccion es exactamente el tipo de gap que destruye proyectos de ingenieria. Verificar antes de planear.

---

*Claude Sonnet 4.6 — Critica independiente del plan Doge-MultiLang*
*No es opinion de consenso. Es busqueda de lo que puede fallar.*
