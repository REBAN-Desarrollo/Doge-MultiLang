# Dubbing Dashboard - Saul / Ivan

> **Tu comando central: Doblaje Multi-Idioma + Calidad de Traduccion**

---

## Rol

| Aspecto | Detalle |
|:--------|:--------|
| **Titulo** | Dubbing Specialists |
| **Celula** | C7 (Dubbing Multi-Idioma) |
| **Reporta a** | Alan / Ramon (Factory Managers) |
| **Coordinan con** | Fernando (input: audio ES), Andrea (revision calidad ingles), Gio (QA) |

---

## Responsabilidad Critica

Saul e Ivan son los **Duenos del Pipeline Multi-Idioma**. Reciben el MP4/audio en espanol de Fernando, lo procesan en ElevenLabs Studio para generar 16 idiomas activos target y aseguran que el output de cada idioma cumpla los objetivos de WER antes de entregarlo para publicacion.

**Regla de cadena de traduccion:** El ingles es siempre el MASTER. NUNCA se traduce directamente de ES a otros idiomas; todo pasa por EN primero.

**Evidencia:** "Cuando tuvimos el MP4 para ElevenLabs, hacia su transcripcion... hacíamos cortes para que los dialogos quedaran no tan largos" (Alan, transcript Dic 31). "A veces los pronombres los manda mal, y el 'no.' lo pasaba como 'number'" (Alan, ibid).

---

## Flujo de Trabajo

```
Fernando entrega:
  MP4/Audio ES (voz limpia, sin BGM/SFX solapados)
  |
  v
[1] PREPROCESAMIENTO (antes de subir a ElevenLabs)
  |  - Sanitizar texto: fix regex "no." -> corregir abreviatura (M4)
  |  - Pre-scan blacklist por idioma (M5)
  |  - Verificar speaker labels del guion (manifest.json de Ramon)
  |
  v
[2] SUBIDA A ELEVENLABS STUDIO
  |  - Subir video ES (actualmente via interfaz web; objetivo: API)
  |  - ElevenLabs detecta speakers y genera transcripcion
  |  - Importar Voice IDs del manifest.json (no reasignar manualmente)
  |
  v
[3] REVISION STT + CORRECCIONES (ES -> EN)
  |  - Revisar transcripcion generada vs guion original
  |  - Corregir drift de STT (silencios, oraciones cortadas)
  |  - Cortar dialogos largos para reducir drift en sincronizacion
  |  - Ajustar waveforms EN para empatar con waveforms ES
  |
  v
[4] REVISION DE CALIDAD INGLES (Tier 1 - 100% revision humana)
  |  - Verificar pronombres (el/ella), onomatopeyas, numeros
  |  - Ajustar timing: waveform EN debe empatar con waveform ES
  |  - Fix "no." -> "number" y errores de puntuacion
  |
  v
[5] GENERACION OTROS IDIOMAS (Tier 2 y 3)
  |  - A partir del MASTER EN, generar: PT-BR, FR, DE, AR, KO, JA, HI, ZH, FIL, ID, IT, RU, TR, TA, MS
  |  - Tier 2: muestreo inteligente ~30%
  |  - Tier 3: solo automatico, flagged por metricas
  |
  v
[6] EXPORTACION Y ENTREGA
     - Descargar audio por idioma
     - Regresar archivos a Fernando -> el exporta version final con SFX/BGM + pistas de audio
     - Entrega para revision de calidad (Alan/Ramon/Andrea)
```

---

## Tiering de Idiomas

| Tier | Idiomas (Codigo) | QA | WER Target |
|:-----|:----------------|:---|:-----------|
| **Tier 1 (Prioritarios)** | Espanol ES (base), Ingles EN (master), Portugues PT-BR, Frances FR, Aleman DE | 100% revision humana | < 5% |
| **Tier 2 (Alto Alcance)** | Arabe AR, Coreano KO, Japones JA, Hindi HI, Mandarin ZH | Muestreo ~30% | < 10% |
| **Tier 3 (Expansion)** | Filipino FIL, Indonesio ID, Italiano IT, Ruso RU, Turco TR, Tamil TA, Malay MS | Solo automatico | < 15% |

> **Idiomas totales activos:** 27 listados en operacion (Q8 DRAFT). Objetivo inmediato: priorizar los 17 con mayor ROI y establecer metricas de views/retention por idioma para evaluar expansion o contraccion.

---

## KPIs

| Metrica | Objetivo | Frecuencia | Estado |
|:--------|:---------|:-----------|:-------|
| WER Tier 1 (ES, EN, PT-BR, FR, DE) | < 5% | Por episodio | No medido - pendiente baseline |
| WER Tier 2 (AR, KO, JA, HI, ZH) | < 10% | Por episodio | No medido - pendiente baseline |
| WER Tier 3 (resto) | < 15% | Por episodio | No medido - pendiente baseline |
| % videos con revision humana Tier 1 | 100% | Por episodio | Actualmente: solo ingles se revisa al 100% |
| % videos con muestreo Tier 2 | > 30% | Por episodio | Actualmente: confianza total, sin muestreo |
| Speaker detection accuracy | > 90% correcta | Por episodio | No medido (problema #1) |
| Flags Category A bloqueados en publicacion | 0 | Por episodio | Sin blacklist formal aun |
| COMET score (fidelidad semantica) | > 0.85 | Por episodio | No medido |
| Tiempo total dubbing completo (ES -> 16 idiomas activos) | < 40 min (con API) | Por episodio | No medido; estimado manual: ~4.5 hrs |
| Correcciones manuales por episodio | Reducir vs baseline | Por episodio | No medido |

---

## Las 7 Mudas de ElevenLabs (Pain Points Documentados)

| # | Muda | Descripcion | Impacto | Mitigacion Propuesta |
|:--|:-----|:------------|:--------|:---------------------|
| M1 | **Re-Mapping de Personajes** | Saul asigna voces "de memoria" y re-mapea en cada idioma | ~5-10 min/proyecto x N idiomas | Persistencia de Voice IDs via manifest.json (automatico) |
| M2 | **Cosecha Manual de Silencios** | ElevenLabs comprime/estira silencios del audio original | Saul corta waveforms a mano, visualmente | Manual Dub CSV con timestamps de AE |
| M3 | **Mezcla de Dialogos en Pista Unica** | Multiples personajes detectados como uno solo | Separacion manual y reasignacion de pistas | Voice Segments v3: etiquetado por orador |
| M4 | **Bug `no.` -> `number`** | Punto despues de "no" interpretado como abreviatura de "number" | Audio incorrecto que requiere edicion de texto | Sanitizador regex pre-envio (implementado) |
| M5 | **Filtros de Seguridad por Idioma** | "muerte", "sexy", "matar" bloqueadas en ciertos idiomas | Retrabajo manual; a veces obliga a cambiar el guion en espanol | Pre-scanner LLM + diccionario de blacklist por idioma |
| M6 | **Audio "Comido" (Clipping)** | ElevenLabs recorta audio mas de lo debido, silabas perdidas | Deteccion auditiva, "S arrastrada" | Fixed Duration + buffer de respiro |
| M7 | **Falta de Auto-Scroll** | Editor no sigue la linea de tiempo automaticamente | Scroll manual constante durante revision | Limitacion de UX de ElevenLabs (sin solucion backend) |

**Evidencia transcripts:** "A veces los pronombres los manda mal... el 'no.' a veces lo pasaba como 'number'... teníamos que estar corrigiendo eso" (Alan, Dic 31). "ElevenLabs no da 100% de garantia de quien habla... subes el mismo audio y te da una deteccion distinta" (Daniel describiendo relato de Saul, Dic 31).

---

## Otros Pain Points Criticos

### STT Drift
La transcripcion generada por ElevenLabs puede desviarse del guion original. El workaround actual es cortar dialogos largos en segmentos mas cortos para que los waveforms de cada idioma empaten con el espanol. Esta correccion manual consume tiempo significativo por episodio.

### Blacklist por Idioma - NO EXISTE (pero debe existir)
Han tenido problemas con filtros de seguridad de ElevenLabs para palabras como "muerte", "sexy" en idiomas especificos. El proceso actual es resolver caso por caso. No hay una blacklist formalmente documentada. Esto genera retrabajo y en algunos casos obliga a modificar el guion fuente.

### Tropicalizacion Cultural - Gap Critico
No se validan idiomas que no sean espanol e ingles. La audiencia objetivo (8-15 anos) requiere adaptacion cultural: palabras prohibidas, modismos apropiados, referencias culturales. Actualmente se confia ciegamente en la traduccion automatica para Tier 2 y Tier 3.

### Validacion por Hablantes Nativos - No existe
Solo se verifica que el audio "suene al idioma" y se muestrean algunos. El equipo reconoce que deberian usar hablantes nativos + IA con reglas para validar correctamente idiomas que no hablan.

### ROI por Idioma - No evaluado
27 idiomas activos pero no hay metrica de views, retention o revenue por idioma para decidir cuales mantener, pausar o agregar.

---

## Herramientas

| Herramienta | Uso | Estado |
|:------------|:----|:-------|
| ElevenLabs Studio | Dubbing multi-idioma, deteccion de speakers, generacion de voces | Activo (interfaz web) |
| ElevenLabs API | Automatizacion de dubbing, batch processing | Objetivo - pendiente migracion |
| Whisper (STT) | Validacion WER: transcripcion post-dubbing para comparar vs guion | Por implementar |
| Adobe Audition / Premiere | Ajuste de waveforms, sincronizacion de silencios | Uso puntual |
| manifest.json | SSOT de Voice IDs por personaje (generado por Ramon en Workflow 08) | Por implementar formalmente |
| NAS | Almacenamiento de archivos de audio por idioma | Activo |

---

## Workflows Relacionados

| Workflow | Relacion |
|:---------|:---------|
| [08 Audio TTS](../02_OPERATIONS/PROCESSES/08_audio_tts_workflow.md) | Ramon genera el audio TTS en espanol que es el input del dubbing |
| [09 Dubbing](../02_OPERATIONS/PROCESSES/09_dubbing_workflow.md) | Workflow operativo detallado de Saul/Ivan |
| [07 QA Publicacion](../02_OPERATIONS/PROCESSES/07_qa_publicacion_workflow.md) | Gio revisa el output multi-idioma antes de publicar |
| [10 Sonorizacion](../02_OPERATIONS/PROCESSES/10_sonorizacion_workflow.md) | Fernando regresa los audios doblados para export final |

---

## Documentos CORE Relevantes

| Documento | Relacion |
|:----------|:---------|
| [07 CORE Multi-Idioma](../00_CORE/07_CORE_MULTI_LANGUAGE.md) | Tiering, WER targets, blacklist, mapeo de personajes, las 7 Mudas |
| [06 CORE Audio TTS](../00_CORE/06_CORE_AUDIO_TTS.md) | Especificaciones del audio ES que reciben de Fernando (SSOT) |
| [05 CORE Content Moderation](../00_CORE/05_CORE_CONTENT_MODERATION.md) | Categorias A/B/C de contenido que alimentan la blacklist de traduccion |
| [01 CORE Audience Profile](../00_CORE/01_CORE_AUDIENCE_PROFILE.md) | Audiencia 8-15 anos que determina los filtros de seguridad |
| [08 CORE Lean Framework](../00_CORE/08_CORE_LEAN_FRAMEWORK.md) | Las 7 Mudas aplicadas al proceso de dubbing |

---

## Puntos de Atencion

- **Input critico:** El MP4 que reciben de Fernando debe tener la voz ES limpia (sin SFX/BGM solapados). Si el audio llega sucio, ElevenLabs no detecta bien los segmentos de dialogo.
- **SSOT:** El guion .docx puede estar desactualizado. El MP4 final de Fernando es la fuente de verdad del audio. No corregir el guion en docx sin notificar.
- **Ingles primero:** Toda correccion del STT y el ajuste de silencios se hace en ingles. Los demas idiomas heredan esa base.
- **Blacklist:** Documentar caso por caso las palabras que activan filtros en cada idioma. Acumular en una blacklist formal.
- **ElevenLabs plan:** Plan Pro activo. Para migrar a API se necesita validacion tecnica de costos y capacidad.

---

**Ultima actualizacion:** 2026-02-18
**Fuentes:** Q8 SAUL IVAN DUBBING DRAFT (2026-02-13), Transcript QPH Post-Produccion Dic 31 2025, CORE 07 Multi-Idioma v1.0 (2026-02-06)
**Status del DRAFT:** ~70-80% confianza (basado en conocimiento del owner). Pendiente validacion con Saul e Ivan.
