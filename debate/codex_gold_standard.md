# Codex Gold Standard v2 - Doge-MultiLang

**Fecha:** 2026-02-20  
**Autor:** Codex (GPT-5)  
**Base usada:** repo actual + 16 archivos recuperados + `C:/AI/AI-Studio/libs/knowledge-base-external/projects_datasets/elevenlabs/4_outputs`

---

## TL;DR
El proyecto no debe seguir como "GUI-first". El gold standard es:
1. `docx` como SSOT de texto/estructura.
2. `manifest.json` como SSOT de casting.
3. `timing_objects.json` como SSOT de timing real (reconciliado).
4. API-first para automatizar; GUI solo para excepciones/auditoria.

---

## Lo que cambio con la evidencia nueva

### 1) Los levantamientos nuevos SI agregan decisiones utiles
- `docs/levantamientos/26_02_06_q8_draft_saul_ivan_dubbing.md` confirma dolor operativo real:
  - speaker detection inconsistente
  - correccion manual de silencios
  - falta de blacklist operativa
- `docs/levantamientos/26_02_12_qa_tiering_por_stage.md` y `docs/levantamientos/26_02_18_checklist_audio_qa.md` ya traen gates claros por tier (WER/timing/checklists).

### 2) Legacy "completado" no equivale a implementado en este repo
- En este repo, `scripts/` sigue vacio.  
- Cualquier estado "entregado" en legacy debe tratarse como referencia de diseno, no como estado real de Doge-MultiLang.

### 3) El dataset `4_outputs` aclara API vs GUI
- Hay evidencia util para API:
  - endpoint de TTS con timestamps
  - soporte de pausas por SSML (`<break time="..."/>`)
  - docs de capacidades API actuales
- El "Manual Dub CSV" aparece en legacy como estrategia, pero no debe asumirse como contrato estable sin prueba end-to-end en tu stack actual.

---

## Gold Standard (reglas obligatorias)

### GS-01: SSOT en 4 capas
1. **Text SSOT**: `dialogue_objects.json` (desde docx parser).
2. **Voice SSOT**: `voice_manifest.json` (personaje -> voice_id).
3. **Timing SSOT**: `timing_objects.json` (heuristico + reconciliado).
4. **QA SSOT**: `qa_report.json` (WER, timing drift, flags).

### GS-02: Nada downstream lee docx directo
Todos los procesos consumen JSON canonico, no el `.docx` crudo.

### GS-03: API-first, GUI-fallback
La UI de ElevenLabs sirve para excepciones y control manual, no como pipeline primario.

### GS-04: Re-mapping manual prohibido
Si no hay `manifest.json` valido, el pipeline debe bloquearse.

### GS-05: Timing sin trazabilidad no se publica
Toda correccion de silencios/speaker boundary debe dejar fuente:
`heuristic | reconciled | manual_override`.

---

## Gaps criticos actuales (estado real del repo)
1. No existe `docx_parser.py`.
2. No existe `voice_mapper.py` ni manifest enforce.
3. No existe reconciliacion docx vs audio final ("guion zombie gate").
4. No existe pipeline QA automatizado (WER/timing) en codigo ejecutable.
5. No existe capa de overrides auditables en UI/API.
6. En este repo esta transcript de Q8, pero no veo transcript real de Q7 importado aqui.

---

## Prioridad de ejecucion (actualizada)

### P0 (primer vertical slice, 48-72h)
1. `docx_parser` -> `dialogue_objects.json`
2. `voice_manifest_builder` -> `voice_manifest.json`
3. `timing_defaults` (reglas base) -> `timing_objects.json`
4. `qa_min` (WER + timing drift checks)
5. Snapshot consolidado por episodio (`ssot_bundle.json`)

### P1 (automatizacion fuerte, semana 1)
1. `timing_reconciler` (audio final ES -> timings reales)
2. `guion_zombie_gate` (diff+WER threshold)
3. blacklist pre/post por idioma
4. endpoints API para parse/build/reconcile/override

### P2 (operacion escalable, semana 2+)
1. UI de auditoria (speaker/silence overrides)
2. export bridge para Doge-Animator
3. observabilidad (errores recurrentes por idioma/personaje)

---

## No-go (lo que NO se debe hacer)
1. Arrancar por UI bonita sin contrato SSOT v1 congelado.
2. Tomar "Manual Dub CSV" como pilar unico sin validar compatibilidad real.
3. Seguir permitiendo re-mapping manual por memoria.
4. Publicar sin WER + timing checks minimos por tier.

---

## Criterios de exito del piloto
1. Un episodio corre E2E desde docx a bundle canonico.
2. Mismo personaje conserva voz en todos los idiomas target.
3. Timing drift detectado automaticamente antes de publicar.
4. Overrides manuales quedan trazados (quien/cuando/por que).
5. Checklist QA por stage se puede marcar con evidencia real, no solo declarativa.

---

## Opinion final de Codex
Con lo recuperado, la direccion correcta no cambia: **primero SSOT ejecutable, luego UI/API de operacion**.  
Lo nuevo si mejora precision: ahora hay mejor base para gates QA y para usar capacidades API (timestamps + control de pausas) sin depender de trabajo visual manual como flujo principal.

