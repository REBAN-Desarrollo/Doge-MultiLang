# Plan de Implementacion: Phase 3 - QA Automation

**Fecha:** 2026-02-19
**Autor:** Analisis tecnico basado en Anexo A (master plan) + checklist audio QA + Q8 Saul/Ivan + 07_CORE_MULTI_LANGUAGE
**Status:** PROPUESTA - pendiente validacion con Daniel

---

## 0. Punto de Partida: Que Existe Hoy

Antes de planificar, es critico ser honesto sobre el estado real:

| Componente | Estado Real | Nota |
|:-----------|:------------|:-----|
| `audit_service.py` | NO EXISTE | Solo hay un diseno en documentos |
| `prompt_scanner.py` | NO EXISTE | La blacklist JSON existe, el scanner no |
| `validate_speakers` | NO EXISTE | Ni siquiera como diseno detallado |
| Blacklists JSON | EXISTEN | `blacklist_global.json`, `blacklist_ar.json`, `blacklist_de.json` |
| Sanitizador regex | IMPLEMENTADO | `docx_parser.py` maneja `no.` -> `no` |
| WER medido | CERO | Saul/Ivan confirman que no miden nada |
| Revision humana EN | PARCIAL | Solo ingles, confian en el resto |

El repo actual es una **knowledgebase y documentacion**, no el backend de AI-Studio. El codigo backend (`dubbing.py`, `elevenlabs.py`, etc.) vive en otro repositorio. Este plan asume que se implementara ahi.

---

## 1. Critica del Diseno Existente (Anexo A)

### 1.1 Lo que esta bien

- La arquitectura dual STT (Whisper + Gemini) es correcta: usar dos fuentes reduce falsos negativos.
- El modelo de datos (PROJECT -> LANGUAGE -> SEGMENT -> AUDIT_RESULT -> ISSUE) es solido y normalizado.
- Los umbrales de WER por tier (<5% Tier1, <10% Tier2, <15% Tier3) son razonables y estan alineados con el checklist de QA.
- El concepto de "auto-aprobar alta confianza, escalar baja confianza" es la logica correcta para reducir carga humana.
- La estimacion de costo ($1.20/proyecto) es realista y el ROI esta bien argumentado.

### 1.2 Lo que esta mal o es incompleto

**Problema critico #1: El Anexo A asume que tienes el audio traducido.**
El pipeline propuesto dice "audio generado (ElevenLabs)" -> Whisper -> WER. Pero el problema real segun Q8 es anterior: ElevenLabs detecta mal al speaker ANTES de generar. El WER post-generacion solo detecta el sintoma, no la causa. Necesitas `validate_speakers` ANTES de generar, no despues.

**Problema critico #2: "Dual STT" es mas caro de lo que justifica el valor.**
Correr Whisper + Gemini en PARALELO para cada segmento de cada idioma (16 idiomas x promedio 347 segmentos) es:
- Costo: $1.20/proyecto (segun el propio Anexo A)
- Valor real: El "consenso STT" (Whisper == Gemini) como metrica es un proxy debil. Si ambos transcriben el audio mal generado de la misma forma, el consenso es 100% pero el problema sigue.
- Propuesta: Usar Whisper como primario (mas barato, 100+ idiomas, mejor para audio imperfecto). Usar Gemini SOLO para analisis semantico y safety check, no para STT redundante.

**Problema critico #3: El checklist de QA tiene 13 pistas, el Anexo A solo cubre 3.**
El Anexo A se enfoca en WER, semantic similarity, y censorship. Pero el checklist cubre LUFS, clipping, BGM ducking, SFX sync, lip sync, intro/outro, transiciones de audio - todo lo cual requiere capacidades completamente diferentes (analisis de forma de onda, no NLP).

**Problema critico #4: No existe un plan para el problema #1 de Saul.**
La frustracion #1 confirmada en Q8 es speaker detection. El Anexo A no tiene ni una mencion de como validar que los speakers fueron detectados correctamente ANTES de generar. El `validate_speakers` listado como componente no tiene ni un parrafo de diseno.

**Problema critico #5: Las estimaciones de tiempo del "swarm" (75h) son fantasiosas.**
El Anexo A tiene un roadmap de 4 fases con ~22 dias calendario. Implementar dual STT + semantic analysis + dashboard + caching + batch processing + auto-fix en menos de un mes asume que ya tienes la infraestructura, las claves API, los tests, y un equipo dedicado. En realidad 75h es solo el codigo feliz, sin tests, sin debugging de edge cases, sin la integracion real con ElevenLabs.

**Problema critico #6: La arquitectura asume que tienes "expected_translation" por segmento.**
El modelo de datos tiene `SEGMENT.expected_translation`. Pero en la practica, ElevenLabs genera la traduccion internamente - no hay un "texto esperado" al nivel de segmento a menos que hagas un pre-paso de traduccion separado. Esto es un gap de datos fundamental que el diseno ignora.

**Problema menor: Los endpoints API propuestos son correctos en estructura pero incompletos.**
Les falta: autenticacion, rate limiting, manejo de errores, paginacion en `/issues`, y un endpoint para rerun de auditorias especificas.

### 1.3 Lo que sobra

- El Gantt chart de implementacion (A.8) es ruido decorativo para un equipo de 1-2 personas.
- La seccion A.4 (mindmap de deteccion) mezcla problemas de naturaleza completamente diferente (audio corrupto vs censura vs pronunciacion). No es accionable como guia de implementacion.
- La alternativa de Deepgram (A.11) no tiene justificacion para considerarse: ElevenLabs STT ya esta incluido en el plan Pro y tiene 29 idiomas suficientes para los Tier 1 y 2.

---

## 2. Las 13 Pistas del Checklist: Automatable vs Requiere Humano

Esta es la clasificacion honesta. No todo lo que parece automatizable lo es en la practica.

### 2.1 Automatizable con Alta Confianza (Valor real, factible)

| Pista | Item | Metodo Automatico | Herramienta | Esfuerzo |
|:------|:-----|:------------------|:------------|:---------|
| **12: WER** | WER por tier | ASR audio -> diff vs guion | Whisper API | Medio |
| **12: WER** | Umbral por idioma | Logica de comparacion | Python `jiwer` | Bajo |
| **11: Dubbing** | Zero Category A | Keyword scan en texto detectado | Blacklist JSON | Bajo |
| **10: TTS** | Bug "no." -> "number" | Regex pre-scan en logs | Ya implementado | Muy Bajo |
| **10: TTS** | VoiceID correcto | Comparar contra manifest.json | Logica Python | Bajo |
| **5: Clipping** | Picos > 0 dBFS | Analisis de forma de onda | `librosa` / `pydub` | Medio |
| **1: Volumen** | LUFS target (-14 LUFS) | Medicion LUFS integrado | `pyloudnorm` | Medio |
| **11: Dubbing** | Duracion dubbing dentro de +20% | Comparar duraciones | `pydub` | Bajo |

### 2.2 Automatizable con Confianza Media (Posibles falsos positivos)

| Pista | Item | Limitacion del Automatico | Propuesta |
|:------|:-----|:--------------------------|:----------|
| **10: TTS** | "Efecto ardilla" (velocidad excesiva) | Timing ratio es proxy, no garantia | Flag si chars/seg > 15, humano confirma |
| **9: Ruido** | TTS sin glitches/artefactos | Muy dependiente del tipo de artefacto | Analisis espectral + flag para humano |
| **3: BGM** | BGM no opaca la voz (diff > 6dB) | Requiere pistas separadas (mix down no sirve) | Solo si se tiene acceso a pistas separadas |
| **8: Transiciones** | Silencios > 0.5s entre escenas | Deteccion VAD puede tener falsos positivos | Usar como alerta, no como bloqueante |

### 2.3 Requiere Humano (No automatizable de forma confiable)

| Pista | Item | Por que no se puede automatizar | Quien |
|:------|:-----|:--------------------------------|:------|
| **13: Master Final** | Reproduccion completa end-to-end | Criterio editorial, coherencia narrativa | Gio (QA Lead) |
| **13: Master Final** | Coherencia narrativa del audio | Juicio creativo, no metrico | Gio |
| **4: Sync** | Lip sync con animacion | Requiere video + audio juntos, muy costoso en compute | Fernando |
| **2: SFX** | SFX cuadra con accion visual | Requiere vision (video frame) + audio | Fernando |
| **3: BGM** | Mood alineado con escena | Criterio subjetivo/editorial | Fernando + Gio |
| **7: Intro/Outro** | Consistencia entre episodios | Requiere referencia de episodio anterior | Gio |
| **11: Dubbing** | Tono/emocion correcto en escenas criticas | La metrica COMET no captura registro emocional | Saul/Ivan |
| **10: TTS** | Entonacion emocional correcta | Escucha auditiva experta | Ramon |

**Conclusion practica:** De los 39 items del checklist (~3 items x 13 pistas), aproximadamente **15-18 items son automatizables** con alta o media confianza. Los otros 21-24 requieren humano permanentemente o como fallback. El objetivo del MVP es automatizar los 15-18 alcanzables.

---

## 3. Componentes a Implementar: Diseno Ajustado

### 3.1 Componente 1: `prompt_scanner.py` (Pre-flight)

**Que hace:** Escanea el guion ES ANTES de enviarlo a ElevenLabs. Detecta Categoria A (bloqueo automatico) y Categoria B (sugerencia de reemplazo). Tambien aplica sanitizacion de puntuacion.

**Inputs:**
- Texto del guion (string o lista de dialogos)
- Idioma destino (para cargar blacklist especifica)

**Outputs:**
```python
{
  "status": "pass" | "warn" | "block",
  "issues": [
    {
      "line": 42,
      "text": "Lo voy a matar",
      "category": "B",
      "suggestion": "Lo voy a vencer",
      "idiomas_afectados": ["de", "ja", "ko"]
    }
  ],
  "auto_replacements": [
    {"original": "no. eso", "replacement": "no eso", "count": 3}
  ]
}
```

**Logica:**
1. Cargar `blacklist_global.json` + `blacklist_{lang}.json`
2. Para cada dialogo: keyword scan contra Categoria A -> si match, status = "block"
3. Para cada dialogo: keyword scan contra Categoria B -> si match, agregar sugerencia
4. Aplicar sanitizacion regex (`no.`, `Sr.`, `etc.`)
5. Retornar reporte consolidado

**Por que primero:** Es el componente mas simple, no requiere APIs externas, y da valor inmediato (elimina Muda M5 que actualmente interrumpe el flujo manualmente). Las blacklists JSON ya existen en el repo.

**Dependencias:** Ninguna externa. Solo los JSON de blacklist.

**Esfuerzo real:** 4-6 horas incluyendo tests.

---

### 3.2 Componente 2: `validate_speakers.py` (Pre-generacion)

**Que hace:** Compara los speakers detectados por ElevenLabs (via ASR interno) contra el manifest.json del proyecto. Detecta mezclas de personajes y desalineaciones antes de generar el dubbing.

**El problema real que resuelve:** Frustacion #1 de Saul - ElevenLabs asigna la voz de personaje 2 a personaje 1. Actualmente se detecta DESPUES de escuchar el audio generado. Este componente lo detecta ANTES.

**Inputs:**
- `manifest.json` (mapeo conocido de personajes)
- Texto detectado por ElevenLabs ASR (obtenible via `GET /v1/dubbing/{id}/transcript`)
- Guion original (con speaker labels)

**Outputs:**
```python
{
  "alignment_score": 0.87,
  "mismatches": [
    {
      "segment_index": 23,
      "expected_speaker": "Gabriel",
      "detected_speaker": "Elsa",
      "confidence": 0.43,
      "text": "Mis padres me ofrecieron en marketplace"
    }
  ],
  "mixed_segments": [
    {
      "segment_index": 45,
      "issue": "Dos personajes en un segmento. Esperado: 1"
    }
  ]
}
```

**Logica:**
1. Obtener transcript via ElevenLabs API (incluye speaker diarization)
2. Cargar manifest.json con personajes esperados
3. Fuzzy match: para cada segmento del guion original, buscar el texto mas cercano en el transcript detectado
4. Comparar el speaker label detectado vs el esperado por manifest
5. Detectar segmentos con mas de un speaker cuando el guion solo tenia uno

**Limitaciones honestas:**
- El fuzzy match puede fallar cuando Fernando modifico mucho el dialogo (problema del "Guion Zombie")
- En dialogos muy cortos (< 5 palabras), el matching no es confiable
- Este componente NO soluciona speaker detection en ElevenLabs, solo lo detecta y alerta

**Dependencias:** ElevenLabs API (ya existente en el backend), `manifest.json`, libreria `rapidfuzz` para fuzzy matching.

**Esfuerzo real:** 8-12 horas incluyendo tests y manejo de edge cases del fuzzy match.

---

### 3.3 Componente 3: `audit_service.py` (Post-generacion)

Este es el componente central del Anexo A, pero con alcance reducido al que realmente es implementable.

**Que hace:** Dado el audio generado por ElevenLabs (dubbing completado), transcribe con Whisper y calcula WER contra el texto esperado. Detecta omisiones, palabras incorrectas y timing drift.

**Diseno ajustado vs Anexo A:**
- Usa Whisper como STT primario (no dual STT en paralelo por defecto)
- Usa Gemini SOLO para safety check del texto transcrito (no como STT redundante)
- El "consenso STT" se activa solo en segmentos con WER > umbral (modo investigation)

**Sub-modulos:**

#### 3.3.1 `wer_calculator.py`

```python
def calculate_wer(reference: str, hypothesis: str) -> dict:
    """
    reference: texto esperado (guion o traduccion aprobada)
    hypothesis: transcripcion Whisper del audio generado
    """
    # Retorna: {"wer": 0.08, "insertions": 2, "deletions": 1, "substitutions": 3}
```

Libreria: `jiwer` (pip install, sin APIs externas, calculo local).

#### 3.3.2 `whisper_client.py`

Wrapper del endpoint `POST /audio/transcriptions` de OpenAI. Maneja:
- Chunking si el audio es > 25MB (limite de Whisper)
- Retry con backoff exponencial
- Cache de transcripciones por hash del audio (evita re-procesar)

#### 3.3.3 `timing_checker.py`

```python
def check_timing_drift(original_duration_ms: int, dubbed_duration_ms: int) -> dict:
    """
    Detecta si el dubbing excede 20% de la duracion original.
    """
    delta = (dubbed_duration_ms - original_duration_ms) / original_duration_ms
    return {
        "delta_percent": delta * 100,
        "status": "pass" if abs(delta) < 0.20 else "warn" if abs(delta) < 0.30 else "fail"
    }
```

#### 3.3.4 `confidence_classifier.py`

```python
def classify_confidence(wer: float, timing_status: str, has_category_a: bool) -> str:
    """
    Implementa la logica de A.3 del Anexo A.
    """
    if has_category_a:
        return "low"  # Siempre baja confianza si hay contenido prohibido
    if wer < 0.05 and timing_status == "pass":
        return "high"
    if wer < 0.15 and timing_status in ("pass", "warn"):
        return "medium"
    return "low"
```

**Inputs del `audit_service.py` principal:**
- `project_id`: ID del proyecto ElevenLabs
- `language_code`: idioma a auditar (o None para todos)
- `audio_url`: URL del audio generado
- `expected_text`: texto de referencia (traduccion aprobada o guion)

**Output:**
```python
{
  "audit_id": "uuid",
  "project_id": "abc123",
  "language": "de",
  "tier": 1,
  "wer": 0.08,
  "timing_delta_percent": 12.5,
  "confidence": "medium",
  "issues": [
    {
      "type": "substitution",
      "expected": "nicht",
      "got": "vielleicht",
      "position": 23,
      "severity": "medium"
    }
  ],
  "action_required": "human_review",
  "whisper_transcript": "...",
  "cost_usd": 0.043
}
```

**Dependencias:** OpenAI Whisper API, `jiwer`, `pydub` para duracion de audio, `prompt_scanner.py` (para safety check del transcript).

**Esfuerzo real:** 12-16 horas para el core sin dashboard UI.

---

### 3.4 Componente 4: Endpoints API (glue code)

Implementar los endpoints del Anexo A.7 en el backend existente:

```
POST /api/dubbing/audit/{project_id}
GET  /api/dubbing/audit/{project_id}/status
GET  /api/dubbing/audit/{project_id}/report
POST /api/dubbing/scan/{project_id}        # <- prompt_scanner
GET  /api/dubbing/validate/speakers/{id}   # <- validate_speakers
```

**Esfuerzo real:** 4-6 horas.

---

### 3.5 Componente 5: Modelo de Datos

El modelo del Anexo A.5 es correcto. Implementarlo como tablas en la base de datos existente (o como JSON files si aun no hay DB para auditorias).

**Tablas minimas para MVP:**
- `audit_jobs`: job_id, project_id, language, status, created_at
- `audit_results`: result_id, job_id, wer, confidence, whisper_transcript, issues_json

**Esfuerzo real:** 2-3 horas (migracion + modelos ORM).

---

## 4. Orden de Implementacion con Dependencias

```
Semana 1 (Dias 1-2): MVP

  [DIA 1 MANANA]
  prompt_scanner.py
    - Carga blacklist JSONs
    - Keyword scan Categoria A/B
    - Regex sanitizacion
    - Tests unitarios con casos reales del Q8
    ENTREGABLE: Endpoint POST /api/dubbing/scan funcional

  [DIA 1 TARDE]
  wer_calculator.py + whisper_client.py
    - Wrapper Whisper API
    - Calculo WER con jiwer
    - Cache basico (dict en memoria, luego Redis)
    ENTREGABLE: Funcion calculate_wer con audio de prueba

  [DIA 2 MANANA]
  audit_service.py (core)
    - Integra whisper_client + wer_calculator + timing_checker
    - confidence_classifier
    - Modelo de datos minimo (audit_jobs + audit_results)
    ENTREGABLE: audit_service.run_audit(project_id, language_code)

  [DIA 2 TARDE]
  validate_speakers.py
    - Obtener transcript de ElevenLabs API
    - Fuzzy match vs manifest
    - Reporte de mismatches
    ENTREGABLE: validate_speakers.check(project_id, manifest_path)

Semana 2 (Dias 3-5): Integracion y Pulido

  [DIA 3]
  Endpoints API REST
    - Conectar los 5 endpoints propuestos
    - Manejo de errores 4xx/5xx
    - Logging estructurado

  [DIA 4]
  Tests de integracion
    - Usar audio real de un episodio existente
    - Calibrar umbrales WER con datos reales
    - Verificar que el costo estimado ($1.20) es correcto

  [DIA 5]
  UI minima (opcional, baja prioridad)
    - Badge de confianza en la UI de dubbing existente
    - Lista de issues por idioma
    - Boton "Auditar" en el proyecto
```

**Dependencias de implementacion:**
```
prompt_scanner  <-- ningun prereq (implementar primero)
whisper_client  <-- ningun prereq (implementar en paralelo con scanner)
wer_calculator  <-- requiere whisper_client
timing_checker  <-- ningun prereq (independiente)
audit_service   <-- requiere whisper_client + wer_calculator + timing_checker + prompt_scanner
validate_speakers <-- requiere ElevenLabs API (ya existe) + manifest.json (ya existe)
endpoints       <-- requieren audit_service + validate_speakers + prompt_scanner
modelo DB       <-- puede hacerse en paralelo con cualquier componente
```

---

## 5. Estimacion de Esfuerzo Realista

La estimacion del Anexo A (roadmap de 4 fases, ~22 dias) no es para Phase 3 MVP. Es para la version final con dashboard completo, caching, batch processing y auto-fix.

La estimacion del "swarm" (75h) cubre todo incluyendo refactoring de codigo existente y features que no son criticas.

**Estimacion honesta para MVP funcional:**

| Componente | Horas Optimistas | Horas Realistas | Por que el delta |
|:-----------|:-----------------|:----------------|:-----------------|
| `prompt_scanner.py` | 3h | 5h | Edge cases de regex, tests de blacklist por idioma |
| `whisper_client.py` | 2h | 4h | Manejo de audio > 25MB, retry logic, formatos |
| `wer_calculator.py` | 1h | 2h | Normalizacion de texto (mayusculas, puntuacion) antes del diff |
| `timing_checker.py` | 1h | 2h | Obtener duracion real del audio de ElevenLabs |
| `confidence_classifier.py` | 1h | 1h | Logica pura, sin dependencias |
| `audit_service.py` (core) | 4h | 8h | Orquestar todo, manejo de errores, async |
| `validate_speakers.py` | 4h | 10h | Fuzzy matching es mas complejo de lo que parece |
| Endpoints API | 3h | 5h | Integracion con el backend existente, auth |
| Modelo de datos | 2h | 3h | Migracion sin romper lo existente |
| Tests de integracion | 3h | 6h | Conseguir audio real, calibrar umbrales |
| **TOTAL** | **24h** | **46h** |  |

**Conclusion:** 2 dias de trabajo intenso para MVP funcional es alcanzable SOLO para `prompt_scanner` + `audit_service` core (sin `validate_speakers`, sin UI). Para el set completo, 5 dias de trabajo de 1 persona es realista.

**Lo que NO entra en estas estimaciones:**
- Conseguir y configurar claves API de Whisper y Gemini en el backend
- Tener audio de prueba real (un episodio ya doblado)
- Configurar el modelo de datos en la DB de produccion
- Code review y deployment

---

## 6. MVP en 1-2 Dias: Propuesta Concreta

Si el objetivo es dar valor en 1-2 dias de trabajo, aqui esta la secuencia exacta:

### Dia 1: prompt_scanner (valor inmediato, sin APIs externas)

**Objetivo del dia:** Eliminar Muda M5 (filtros de seguridad que bloquean el flujo). Saul/Ivan dejan de descubrir palabras bloqueadas despues de generar.

**Lo que entregas:**
1. `services/prompt_scanner.py` - Clase `PromptScanner` con metodos:
   - `scan_script(text: str, target_language: str) -> ScanResult`
   - `batch_scan(dialogs: list[str], languages: list[str]) -> list[ScanResult]`
2. Endpoint `POST /api/dubbing/scan` que acepta el guion y retorna issues
3. En la UI: warning banner antes de iniciar el dubbing si hay palabras problemáticas

**Codigo esquema para orientar la implementacion:**

```python
# services/prompt_scanner.py

import json
import re
from pathlib import Path
from dataclasses import dataclass

@dataclass
class ScanIssue:
    line_index: int
    original_text: str
    category: str  # "A" o "B"
    matched_term: str
    suggestion: str | None
    affected_languages: list[str]

@dataclass
class ScanResult:
    status: str  # "pass", "warn", "block"
    issues: list[ScanIssue]
    auto_replacements: list[dict]
    scan_duration_ms: float

class PromptScanner:
    REGEX_SANITIZATIONS = [
        (r'\bno\.\s', 'no '),    # no. -> no
        (r'\bSr\.\s', 'Señor '), # Sr. -> Señor
        (r'\betc\.\s', 'etcetera '),
    ]

    def __init__(self, blacklist_dir: str = "config/blacklists"):
        self.blacklists = {}
        self._load_blacklists(blacklist_dir)

    def _load_blacklists(self, path: str):
        # Cargar blacklist_global.json y los especificos por idioma
        global_path = Path(path) / "blacklist_global.json"
        if global_path.exists():
            with open(global_path) as f:
                self.blacklists["global"] = json.load(f)

        for lang_file in Path(path).glob("blacklist_*.json"):
            lang = lang_file.stem.replace("blacklist_", "")
            if lang != "global":
                with open(lang_file) as f:
                    self.blacklists[lang] = json.load(f)

    def scan_script(self, text: str, target_language: str = "all") -> ScanResult:
        issues = []
        replacements = []

        # 1. Regex sanitizacion
        sanitized = text
        for pattern, replacement in self.REGEX_SANITIZATIONS:
            matches = list(re.finditer(pattern, sanitized, re.IGNORECASE))
            if matches:
                replacements.append({
                    "pattern": pattern,
                    "replacement": replacement,
                    "count": len(matches)
                })
            sanitized = re.sub(pattern, replacement, sanitized, flags=re.IGNORECASE)

        # 2. Keyword scan global
        global_blacklist = self.blacklists.get("global", {})
        for term in global_blacklist.get("category_a_absolute", []):
            if term.lower() in text.lower():
                issues.append(ScanIssue(
                    line_index=0,
                    original_text=text,
                    category="A",
                    matched_term=term,
                    suggestion=None,
                    affected_languages=["all"]
                ))

        for item in global_blacklist.get("category_b_soften", []):
            if item["find"].lower() in text.lower():
                issues.append(ScanIssue(
                    line_index=0,
                    original_text=text,
                    category="B",
                    matched_term=item["find"],
                    suggestion=item["replace"],
                    affected_languages=["all"]
                ))

        # 3. Determinar status
        has_block = any(i.category == "A" for i in issues)
        status = "block" if has_block else ("warn" if issues else "pass")

        return ScanResult(
            status=status,
            issues=issues,
            auto_replacements=replacements,
            scan_duration_ms=0.0  # completar con timing real
        )
```

**Nota:** Este esquema usa los JSON de blacklist que ya existen en el repo (`blacklist_global.json`, `blacklist_ar.json`, `blacklist_de.json`). No hay que inventar los datos.

**Valor del dia 1:** Alan (que reemplazo a Saul en dubbing) puede escanear el guion completo ANTES de subirlo a ElevenLabs. Los bloqueos inesperados dejan de ser sorpresas.

---

### Dia 2: audit_service core (WER + confianza por idioma)

**Objetivo del dia:** Implementar medicion de WER para la pista 12 del checklist. Por primera vez, el equipo tendra una metrica objetiva en lugar de confiar a ciegas.

**Lo que entregas:**
1. `services/whisper_client.py` - Wrapper de la API de OpenAI Whisper
2. `services/wer_calculator.py` - Calculo WER con `jiwer`
3. `services/audit_service.py` - Orquestador que toma project_id + language -> retorna reporte
4. Endpoint `POST /api/dubbing/audit/{project_id}` y `GET .../report`
5. Stored results en DB o en un JSON file por proyecto (si no hay DB lista)

**Prioridad de idiomas para el primer run:**
1. Espanol (ES) - WER de TTS original, el mas facil de verificar
2. Ingles (EN) - El master que Saul ya revisa manualmente, podra comparar
3. Resto de Tier 1 (PT-BR, FR, DE) - Automatico

**Valor del dia 2:** Saul/Ivan (ahora Alan) tiene numeros concretos. "Ingles tiene 3.2% WER, aleman tiene 11.8% WER -> aleman requiere revision". Esto reemplaza la confianza ciega que Q8 documenta como riesgo.

---

## 7. Integracion de los 2 AI Auditores (Diseno Ajustado)

El Anexo A propone dual STT en paralelo siempre. El diseno ajustado es mas eficiente:

### Modo Normal (95% de los casos):

```
Audio generado
      |
  Whisper STT
      |
  WER Calculator
      |
  < umbral tier? ─── SI ─── PASS (sin Gemini)
      |
     NO
      |
  prompt_scanner (en texto del transcript)
      |
  Category A? ─── SI ─── BLOCK (sin Gemini)
      |
     NO
      |
  WARN: human review
```

### Modo Investigacion (segmentos con WER > umbral o cuando hay discrepancia):

```
Segmento flaggeado
      |
  ┌───────────────┐
  │  Whisper STT  │
  └───────┬───────┘
          |
  ┌───────────────┐
  │   Gemini STT  │  <- Solo aqui se activa Gemini como STT
  └───────┬───────┘
          |
  Consenso? ─── SI ─── Confiar en el WER de Whisper
      |
     NO
      |
  Gemini Semantico: "Cual es mas fiel al original?"
      |
  Reportar discrepancia como evidencia adicional
```

**Por que esto es mejor:**
- Costo reducido: Whisper corre siempre ($0.006/min), Gemini como STT solo en casos con WER alto (estimado: 20% de segmentos)
- El valor del "consenso" aumenta: si dos modelos discrepan en un segmento problematico, eso SI es evidencia util
- Gemini se usa en lo que es mas fuerte: analisis semantico del texto, no transcripcion redundante

**Costo estimado ajustado (16 idiomas x 10 min):**
- Whisper: 170 min x $0.006 = $1.02 (sin cambio)
- Gemini STT (solo 20% de segmentos con WER > umbral): ~$0.03 (vs $0.17 del Anexo A)
- Gemini semantico (solo flags): ~$0.02
- Total: **~$1.07/proyecto** (similar, pero mas sensato en la distribucion)

---

## 8. Pistas del Checklist que NO Entran en Phase 3

Estas pistas son validas como QA, pero no son implementables en el backend de dubbing. Necesitan otro tipo de solucion:

| Pista | Por que queda fuera | Solucion correcta |
|:------|:--------------------|:------------------|
| 1, 5, 6: LUFS, Clipping, Volumen | Requieren acceso al master de audio de Fernando, no al dubbing | Herramienta separada para Fernando en su DAW |
| 2, 3, 4: SFX, BGM, Sync | Requieren analisis de video + audio combinados | Post-produccion de Fernando, no dubbing |
| 7, 8: Intro/outro, Transiciones | Son del master final, no del audio doblado | Checklist manual de Fernando/Gio |
| 13: Revision final Gio | Por definicion no automatizable | Proceso humano, puede asistirse con el reporte del audit_service |
| 9: Ruido TTS | Aplica al TTS de Ramon (pre-dubbing), no al dubbing | Agregar al workflow de Ramon, no al de Saul |

**Lo que si entra en Phase 3 directamente:**
- Pista 10: TTS ElevenLabs (VoiceID correcto, bug no., efecto ardilla) -> `validate_speakers` + `prompt_scanner`
- Pista 11: Dubbing multi-idioma (EN aprobado, duracion +20%, timing drift, Zero Cat-A) -> `audit_service` + `timing_checker`
- Pista 12: WER por tier -> `audit_service` + `wer_calculator`

---

## 9. Riesgos Reales de Implementacion

| Riesgo | Probabilidad | Impacto | Mitigacion |
|:-------|:-------------|:--------|:-----------|
| No tener audio real de episodios doblados para probar | Alta | Alto | Solicitar a Alan un episodio completo antes de empezar |
| Las blacklists JSON en el repo tienen formato diferente al que espera el scanner | Media | Medio | Leer los JSON primero, adaptar el scanner a su estructura real |
| Whisper falla en idiomas Tier 2/3 (AR, ZH, JA) | Media | Medio | Whisper soporta los 27 idiomas listados; validar con audio real |
| ElevenLabs API no retorna el transcript en el formato esperado | Media | Alto | Revisar la API response con un proyecto real antes de codear el parser |
| El "expected_translation" no existe por segmento (gap critico del Anexo A) | Alta | Alto | Usar el transcript del propio ElevenLabs como "reference" y el output de Whisper como "hypothesis"; no necesitas una traduccion perfecta pre-existente |
| validate_speakers falla cuando Fernando modifico el dialogo (Guion Zombie) | Alta | Medio | El speaker validator es "best effort"; documentar que tiene falsos negativos cuando el guion difiere del audio |

---

## 10. Metricas de Exito del MVP

Para saber si Phase 3 funciona, estas son las metricas objetivo a las 2 semanas de deployment:

| Metrica | Target | Como Medir |
|:--------|:-------|:-----------|
| % episodios con WER medido | 100% de nuevos episodios | Contar audit_jobs completados |
| Tiempo de QA de dubbing reducido | De "1 persona completa" a < 2h Tier 1 | Auto-report del tiempo de revision humana |
| Blacklist catches pre-generacion | > 0 por mes | Contador en prompt_scanner |
| False positive rate en WER alerts | < 20% | Casos donde humano revisa y no encuentra problema |
| Costo por proyecto | < $2 USD | Sumar costos de Whisper API por proyecto |

---

## 11. Relacion con Otros Componentes Pendientes

Phase 3 QA depende de, pero no bloquea, estos otros componentes del roadmap:

| Componente | Relacion | Estado |
|:-----------|:---------|:-------|
| `alignment_engine.py` (M2: silencios) | Phase 3 no lo requiere, pero su output (timestamps) mejoraria el timing_checker | Pendiente |
| `voice_manifest.py` (M1: re-mapping) | `validate_speakers` necesita manifest.json; si el manifest es incorrecto, el validator falla | Implementado (segun master plan) |
| CSV de timestamps de After Effects (M2) | Si existiera, eliminaria la necesidad del timing_check basado en ratio | Pendiente (depende de Fernando) |
| Dashboard UI de auditorias | Independiente del backend; puede hacerse despues del MVP | Pendiente |

---

## 12. Siguiente Accion Inmediata

Antes de escribir codigo, hacer esto en orden:

1. **Leer los blacklist JSON reales** para confirmar su estructura (`blacklist_global.json`, `blacklist_ar.json`, `blacklist_de.json` en el repo).
2. **Conseguir 1 episodio real ya doblado** de Alan (cualquier idioma que haya pasado por ElevenLabs) para usarlo como caso de prueba.
3. **Verificar la response de `GET /v1/dubbing/{id}/transcript`** con un proyecto existente de ElevenLabs para saber exactamente que formato retorna el speaker diarization.
4. **Confirmar que las keys API** de Whisper y Gemini estan configuradas en el entorno de desarrollo.

Solo despues de estos 4 pasos, empezar con `prompt_scanner.py`.
