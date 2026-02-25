# REBAN — Destilado Multi-Idioma

> Contenido relevante a dubbing, traduccion y adaptacion cultural extraido de 10 archivos del repo REBAN (0 - Medios Digitales - Guionismo). Solo se incluye lo que aplica al pipeline de 27 idiomas de Doge-MultiLang.

**Fecha de extraccion:** 2026-02-20 | **Metodo:** Swarm de 4 agentes con filtro: dubbing, traduccion, audio quality, cultural adaptation, content safety

---

## 1. ADN DE QPH — REGLAS QUE DEBEN PRESERVARSE EN 27 IDIOMAS

### Avatar target: Noha (10 anos)

- Rango de audiencia: 8-13 anos
- Regla fundamental: si un nino de 10 anos no entiende una palabra, la historia falla
- Perfil emocional: hipersensible a la injusticia, no verbaliza emociones (las expresa con llanto y enojo), busca autonomia

### Tono obligatorio: voz confesional

La traduccion debe preservar la inmediatez de una confesion en vivo, NO prosa literaria:
- Lenguaje de calle, no academico
- Frases cortas, ritmo rapido
- Carga emocional inmediata
- Cada idioma debe encontrar equivalentes nativos que suenen igualmente informales y urgentes

### 7 anti-patrones que invalidan la adaptacion

| # | Anti-patron | Descripcion | Impacto en dubbing |
|:--|:------------|:------------|:-------------------|
| 1 | Literaturizacion | Lenguaje bonito reemplaza lenguaje viral | Traductores tienden a "mejorar" el texto |
| 2 | Moralizacion | Convertir historia en leccion explicita | Cierre debe ser emocional, no moral |
| 3 | Tecnicismos | Vocabulario adulto/psicologico/medico | Prohibido en todos los idiomas |
| 4 | Estiramiento artificial | Escenas de relleno sin conflicto | Rompe ritmo de detonadores |
| 5 | Solemnidad | Tono serio que rompe estilo QPH | Voces TTS deben evitar tono formal |
| 6 | Psicologia abstracta | Terminos como "trauma", "sanacion", "disonancia" | Reemplazar por consecuencias concretas visibles |
| 7 | Ejemplos inventados | Datos no verificables | Aplica a todas las versiones |

### Vocabulario prohibido en todos los idiomas

Terminos que deben reemplazarse por equivalentes concretos (no abstractos):
- Autoestima, heridas emocionales, disonancia cognitiva
- Trauma, introspeccion, sanacion personal
- Terminologia terapeutica, analisis moral
- Procesos internos, emociones adultas profundas

### Reglas de dialogo que deben transferirse

**Obligatorio:**
- Frases cortas, ritmo rapido, expresiones visuales
- Sarcasmo marcado, tension en cada linea
- Adultos suenan: arrogantes, autoritarios, manipuladores
- Ninos suenan: directos, exagerados, impulsivos

**Prohibido en dialogo:**
- Monologos largos, explicaciones emocionales
- Lenguaje tecnico, descripciones literarias, frases tibias

### Ritmo narrativo: detonador cada 20-40 segundos

Para dubbing: cada 20-40 segundos debe contener un mini-shock, descubrimiento, dato incomodo, cambio de humor, contradiccion o mini-cliffhanger. Las traducciones no pueden estirar ni comprimir sin romper este patron.

---

## 2. AUDIENCIA Y ADAPTACION CULTURAL

### Temas que resuenan universalmente (cross-cultural)

1. Situaciones escolares y dinamicas entre pares
2. Conflictos familiares (autoridad padre/hijo)
3. Escenarios de injusticia que requieren reparacion emocional
4. Miedos comunes: monstruos, castigo, abandono, humillacion publica
5. Diferencias economicas/estatus
6. Peligro fisico

### Apuestas validas (universales)

- Castigo real, humillacion publica, perder algo valioso
- Peligro fisico o social, ser descubierto en mentira
- Adulto abusando poder, caos descontrolado

### Apuestas invalidas (requieren adaptacion cultural)

- Perder confianza (vago, depende de cultura)
- Manejar emociones (abstracto)
- Conversacion honesta (adulto-centrica)
- Equilibrar vida adulta (irrelevante para 10 anos)

### Lo que NO funciona cross-culturally

- Referencias a celebridades internacionales sin conexion local
- Contenido tecnico sin relevancia emocional
- Narrativas de trauma extremo sin perspectiva
- Contenido que requiere contexto cultural profundo de una sola region

### Formato

- Duracion optima: 2-5 minutos (Shorts animados)
- Primeros 5 segundos criticos: accion/conflicto/reaccion directa
- 60% del consumo es sin audio — subtitulos importan

---

## 3. SPECS DE AUDIO PARA TTS/DUBBING

### Parametros tecnicos baseline (casting humano LGDV)

| Parametro | Valor target | Herramienta | Notas |
|:----------|:------------|:------------|:------|
| Noise floor | <-40 dB | Audacity: Analyze > Plot Spectrum | Umbral de silencio |
| Peaks | -6 dB a -3 dB | Audacity: Analyze > Contrast | Previene clipping |
| Sample rate | 48 kHz | — | WAV mono o stereo |
| Velocidad | 140-160 wpm (rango 120-180) | Conteo manual | Optimo LGDV |
| Formato | WAV | — | Nomenclatura: `LGDV_YYYY-MM-DD_titulo.wav` |
| Clipping | Cero (evitar 0 dB) | Audacity | Criterio de eliminacion automatica |

### Rubrica de calidad vocal (5 dimensiones)

| Dimension | Peso | Que mide |
|:----------|:-----|:---------|
| Calidad vocal | 25% | Timbre claro, sin fatiga, sin nasalidad |
| Interpretacion y emocion | 25% | Conexion emocional natural, no robotica |
| Ritmo y pausas | 20% | Ritmo dinamico con pausas estrategicas |
| Tecnica de locucion | 15% | Respiracion, articulacion clara, control volumen |
| Versatilidad y tono | 15% | Adaptacion al contenido, alineacion con marca |

**Formula:** (D1 x 0.25) + (D2 x 0.25) + (D3 x 0.20) + (D4 x 0.15) + (D5 x 0.15)

### Umbrales de decision

| Score | Decision |
|:------|:---------|
| >= 4.0 | Aprobado |
| 3.5-3.9 | Aprobacion condicional (requiere calibracion) |
| 3.0-3.4 | Rechazado |
| < 3.0 | Rechazado definitivamente |

### Filtro tecnico minimo (eliminacion automatica)

- Noise floor > -40 dB
- Volumen inconsistente
- Velocidad < 120 o > 180 wpm
- Articulacion deficiente (> 10% ininteligible)
- Clipping detectado

### Aplicacion a ElevenLabs TTS

Los outputs de TTS deben cumplir o superar estos specs:
- Audio 48 kHz WAV, peaks -6 a -3 dB
- Velocidad configurable a 140-160 wpm
- Aplicar rubrica de 5 dimensiones a samples TTS por idioma
- Marcadores de pausa via SSML para replicar delivery humano
- Mantener pesos de dimensiones consistentes en 27 idiomas

---

## 4. CONTENT SAFETY — BLACKLISTS Y GATES

### Contenido prohibido (rechazo editorial inmediato)

Criterios de exclusion no negociables — aplican a TODAS las versiones dobladas:

**Discriminatorio:**
- Contenido basado en raza, religion, minorias

**Relacionado a menores:**
- Abuso sexual o fisico, secuestro, sexualizacion

**Contenido danino:**
- Violencia explicita, drogas, tabaco, alcohol
- Suicidio, trastornos alimenticios
- Contenido sexual explicito

**Anti-etico:**
- Difamacion, fake news, manipulacion politica
- Explotacion para degradacion, burla publica

Si CUALQUIERA de estos esta presente = proyecto rechazado (sin produccion)

### Framework "Morbo PG-13" (lo permitido vs prohibido)

**PERMITIDO (apropiado para edad):**
- Tension incomoda, insinuaciones entendibles
- Adultos actuando inapropiadamente (no explicito)
- Situaciones embarazosas, conflicto interpersonal

**PROHIBIDO:**
- Contenido sexual explicito
- Detalles de trauma medico
- Violencia grafica
- Abuso psicologico adulto (solo insinuado, no visible)

### Sistema de 3 Gates pre-publicacion

| Gate | Que valida | Severidad |
|:-----|:----------|:----------|
| Gate 0 (prerequisitos) | Materiales de terceros identificados, licencias, sin material prohibido accidental | CRITICO |
| Gate 1 (legal pre-carga) | Musica/audio licenciado, video/imagen con permiso, personas/privacidad, menores (CRITICO) | CRITICO |
| Gate 2 (soft launch) | Publicar como No Listado primero, monitorear 2-6h para claims, triage por matriz de decision | MAYOR |

### Top 5 riesgos FMEA aplicables a dubbing

| # | Riesgo | RPN | Mitigacion |
|:--|:-------|:----|:-----------|
| 1 | Re-upload por terceros | 336 | Content ID registration |
| 2 | Fair Use mal aplicado | 270 | Framework de 4 factores pre-brief |
| 3 | Musica sin licencia | 240 | 100% musica con licencia perpetua |
| 4 | Claims no monitoreados 48h | 224 | Alertas automaticas diarias |
| 5 | Lenguaje que viola Community Guidelines | 180 | Revision legal de scripts sensibles pre-produccion |

**Escala RPN:** >= 200 CRITICO, 100-199 ALTO, 50-99 MEDIO, < 50 BAJO

### Replicacion por idioma

Todos los gates, checklists y scoring FMEA deben replicarse en cada version doblada porque:
- Verificacion de lenguaje problematico aplica a interpretacion de voice talent
- Verificacion de hechos aplica a narracion traducida
- Evaluacion de Fair Use aplica a contexto traducido
- Compliance de Community Guidelines aplica al tono del audio doblado

---

## 5. CHECKLIST DE NARRATIVA (12 PUNTOS) — APLICABLE A QA DE TRADUCCION

1. Conflicto central unico con villano claro
2. Hook reafirma click en 7 segundos (sin contexto previo)
3. Hechos verificados con fuentes documentadas
4. Premisa enfocada (logline <= 2 oraciones)
5. Progresion constante (0 parrafos estaticos)
6. Promesa cumplida (payoff coincide con hook)
7. Densidad controlada (1 dato por parrafo, envuelto en emocion)
8. Moods marcados (4+ cambios de tono emocional por minuto)
9. Estructura completa (Kishotenketsu: Ki > Sho > Ten > Ketsu)
10. Payoff satisfactorio (emocion clara, ultimo 20% del video)
11. Pattern interrupts (4+ en video de 6-8 min)
12. Arco del heroe (Punto A != Punto B)

**Umbral:** minimo 10/12 puntos para pasar. < 8/12 = script rechazado.

Aplicacion a dubbing: verificar que la traduccion preserva todos estos elementos, especialmente #2 (hook timing), #8 (cambios de tono), y #11 (pattern interrupts).

---

## 6. FUENTES

| Archivo REBAN | Contenido extraido |
|:--------------|:-------------------|
| `20_REBAN/11_KB/03_Tecnicas/marco_qph_v3_tecnicas.json` | 6 tecnicas narrativas QPH, detonadores 20-40s, anti-errores |
| `20_REBAN/FICHAS/03_Narrativa_Packaging/marco_narrativo_qph_v3_...ficha.md` | Manual maestro QPH: tono, dialogo, Morbo PG-13, vocabulario prohibido |
| `20_REBAN/FICHAS/10_Analitica_BI/lecciones_aprendidas_...qph_v1_ficha.md` | Temas que resuenan, alineacion con audiencia infantil |
| `20_REBAN/FICHAS/02_Investigacion_Ideacion/analisis_de_mercado_qph_v1_ficha.md` | Shorts animados, duracion optima 2-5min, saturacion mercado |
| `20_REBAN/FICHAS/10_Analitica_BI/patrones_analisis_interno_qph_v1_ficha.md` | Patrones que funcionan y que no |
| `00_INBOX/docx/_pendientes/rag/quotes.md` | Perfil avatar Noha (10 anos), perfil emocional |
| `20_REBAN/13_Talento/01_Casting/13.1.1_PLAYBOOK_casting_gold_standard_v6.md` | Specs audio: noise <-40dB, peaks -6/-3dB, 140-160wpm, rubrica 5 dimensiones |
| `20_REBAN/12_Legal/01_Strikes/12.1.3_PLAYBOOK_fmea_riesgos_gold_standard_v6.md` | FMEA top 10 riesgos, RPN, 50 palabras prohibidas |
| `20_REBAN/12_Legal/insumos/POKA_YOKE_MASTER_LEGAL_PREPUBLICACION.md` | 3 gates pre-publicacion, menores CRITICO |
| `20_REBAN/03_Narrativa/02_Guiones/insumos/ANTIPATRONES_GUIONES_POKA_YOKE.md` | 20 anti-patrones, checklist 12 puntos narrativa |
