# UI Blueprint: Mega Dubbing Tab

To address the needs found in the Lean Analysis, the `/dubbing` route will transition into a "Command Center" for high-fidelity production.

## 1. Interface Sections (The Mega Tab)

### A. Project Overview & Matrix
- **Language Status Grid**: A matrix showing all 17 target languages vs. project stages (Source, Master EN, Global Expansion).
- **Quality Badges**: Color-coded indicators (Green/Yellow/Red) based on the "Cheap & Fast" LLM audit.

### B. Pre-Generation Editor (High Control)
- **DataGrid Interface**:
    - Row: Character Name | Source Text (ES) | Voice Assigned | Intensity/Prompt.
    - Features: Inline editing, "Sanitize All" button, and safety filter warnings.
- **Script Sync**: Upload `.docx` or JSON from Voice TTS to pre-populate characters and dialogs.

### C. Timing Control Panel (AE Integration)
- **Timecode Ingest**: Drag & Drop for After Effects EDL/XML/Markers.
- **Waveform Inspector**: Side-by-side view of original audio vs. generated segment to verify "frame-accurate" sync.
- **Fixed vs Dynamic Duration Toggles**: Per-scene control over speech speed vs. naturalness.

### D. Lean Dashboard (Graphs & Metrics)
- **Waste Counter**: Metrics on manual corrections saved (e.g., "150 'no.' bugs prevented").
- **Cost vs quality Plot**: Character consumption vs. confidence scores.
- **"Telephone Game" Variance**: Graphic showing semantic drift from ES -> EN -> Final Language.

## 2. The Multi-Track Workflow Pattern

Instead of a single "Video" upload, the UI supports a decoupled input:
1.  **Media**: MP4 (without SFX).
2.  **Coordinates**: CSV/EDL from After Effects.
3.  **Intelligence**: Character-mapped JSON script.

## 3. Interaction Design: "Quality by Exception"

The UI should not force manual review of every segment.
- **Logic**: Auto-approve "High Confidence" (Green) tracks.
- **UI Action**: Only pop up or highlight "Baja Confianza" (Low Confidence) segments for Saúl/Alan to review physically.

---

## 4. Proposed Features Roadmap (UI Focus)

| Feature | Lean Impact | Dev Priority |
| :--- | :--- | :--- |
| **Inline Script Table** | Eliminates Muda 1 & 6 | High |
| **AE Timecode Import** | Eliminates Muda 2 | High |
| **Audit Alert Sidebar** | Eliminates Muda 5 | Medium |
| **Language Matrix (Bulk)** | Eliminates Muda 3 | Medium |

---

> [!TIP]
> **Mega Tab Philosophy**: Provide total transparency of the data pipeline, allowing the user to intercept errors *before* committing to the ElevenLabs credit burn.
