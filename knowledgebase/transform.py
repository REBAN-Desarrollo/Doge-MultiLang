# ==============================================================================
# TRANSFORMADOR DE KNOWLEDGEBASE RAW
# ==============================================================================
# Este script procesa el JSON crudo de Apify y genera datasets optimizados
# para sistemas RAG.
#
# OPERACIONES:
# 1. Limpieza de markdown (elimina ruido de UI)
# 2. Enriquecimiento de metadata (category, description, crawledAt)
# 3. Auditoría de calidad (filtra contenido vacío/pobre)
# 4. Partición (Split): Separa Docs vs Helper
# 5. Inyección (Inject): Copia artículos técnicos del Helper a Docs
#
# USO:
#   python transform.py
#
# OUTPUT:
#   - ElevenLabs Docs.json     (documentación técnica + artículos técnicos inyectados)
#   - ElevenLabs Helper.json   (soporte general)
# ==============================================================================

import json
import os
import re
from datetime import datetime

# ==============================================================================
# CONFIGURACIÓN
# ==============================================================================

RAW_FILE = "ElevenLabs Knowledgebase_RAW.json"
DOCS_OUTPUT = "ElevenLabs Docs.json"
HELPER_OUTPUT = "ElevenLabs Helper.json"

# Umbral mínimo de contenido (caracteres) para considerar válido
MIN_CONTENT_LENGTH = 50

# Keywords que indican contenido técnico valioso
TECH_KEYWORDS = ["api", "sdk", "python", "node", "websocket", "streaming", 
                 "latency", "pcm", "mp3", "optimize", "voice_design", "key",
                 "endpoint", "request", "response", "json", "curl"]

# ==============================================================================
# FUNCIONES DE LIMPIEZA
# ==============================================================================

def clean_markdown(text):
    """Elimina ruido de UI común en documentación."""
    if not text:
        return ""
    
    # Patrones de ruido de Fern Framework
    text = re.sub(r'Tip: You can toggle this pane with\s+⌘\s+\+\s+/', '', text)
    text = re.sub(r'Hi, I\'m an AI assistant with access to documentation and other content\.', '', text)
    
    # Patrones de ruido de Zendesk
    text = re.sub(r'Was this article helpful\?.*?(Yes|No)', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'Related Articles:.*$', '', text, flags=re.MULTILINE | re.DOTALL)
    
    # Navegación genérica
    text = re.sub(r'^Skip to (content|main).*\n', '', text, flags=re.MULTILINE | re.IGNORECASE)
    
    # Normalizar saltos de línea excesivos
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()

# ==============================================================================
# FUNCIONES DE CLASIFICACIÓN
# ==============================================================================

def categorize_url(url):
    """Asigna categoría basada en patrones de URL."""
    if "api-reference" in url:
        return "API Reference"
    elif "/changelog" in url:
        return "Changelog"
    elif "help.elevenlabs.io" in url:
        return "Help Center"
    elif "/developers" in url:
        return "Developer Guides"
    elif "/creative-platform" in url:
        return "Creative Platform"
    else:
        return "Documentation"

def is_technical_content(title, markdown):
    """Determina si el contenido es técnicamente valioso para inyección."""
    title_lower = title.lower()
    
    # Criterio 1: Keywords en título
    has_keyword = any(k in title_lower for k in TECH_KEYWORDS)
    
    # Criterio 2: Bloques de código en contenido
    has_code = "```" in markdown
    
    return has_keyword or has_code

def is_docs_url(url):
    """Determina si la URL pertenece a la documentación técnica."""
    return "elevenlabs.io/docs" in url

def is_helper_url(url):
    """Determina si la URL pertenece al Help Center."""
    return "help.elevenlabs.io" in url

# ==============================================================================
# PIPELINE PRINCIPAL
# ==============================================================================

def transform():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Iniciando transformación...")
    print(f"📂 Leyendo: {RAW_FILE}")
    
    with open(RAW_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    original_size = os.path.getsize(RAW_FILE)
    print(f"   Registros crudos: {len(data)}")
    
    docs_records = []
    helper_records = []
    seen_urls = set()
    
    stats = {
        "skipped_duplicate": 0,
        "skipped_short": 0,
        "docs_native": 0,
        "helper_native": 0,
        "helper_injected_to_docs": 0
    }
    
    for item in data:
        url = item.get('url', '')
        
        # Deduplicación
        if not url or url in seen_urls:
            stats["skipped_duplicate"] += 1
            continue
        seen_urls.add(url)
        
        # Extraer metadata
        meta = item.get('metadata', {})
        title = meta.get('title', '').replace(' – ElevenLabs', '').replace(' - ElevenLabs Help Center', '').strip()
        description = meta.get('description', '')
        crawled_at = item.get('crawledAt', '')
        
        # Limpiar markdown
        markdown = clean_markdown(item.get('markdown', ''))
        
        # Auditoría: Filtrar contenido pobre
        if len(markdown) < MIN_CONTENT_LENGTH:
            stats["skipped_short"] += 1
            continue
        
        # Clasificar
        category = categorize_url(url)
        is_tech = is_technical_content(title, markdown)
        
        # Crear registro limpio
        record = {
            "url": url,
            "title": title,
            "description": description,
            "crawledAt": crawled_at,
            "category": category,
            "markdown": markdown
        }
        
        # Partición + Inyección
        if is_docs_url(url):
            # Documentación nativa → Solo a Docs
            docs_records.append(record)
            stats["docs_native"] += 1
            
        elif is_helper_url(url):
            # Help Center → Siempre a Helper
            helper_records.append(record)
            stats["helper_native"] += 1
            
            # Si es técnico → También a Docs (inyección)
            if is_tech:
                injected_record = record.copy()
                injected_record["category"] = "Technical Support"  # Marcar origen
                docs_records.append(injected_record)
                stats["helper_injected_to_docs"] += 1
    
    # Guardar outputs
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Guardando archivos...")
    
    with open(DOCS_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(docs_records, f, indent=2, ensure_ascii=False)
    
    with open(HELPER_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(helper_records, f, indent=2, ensure_ascii=False)
    
    # Reporte final
    docs_size = os.path.getsize(DOCS_OUTPUT)
    helper_size = os.path.getsize(HELPER_OUTPUT)
    
    print(f"\n{'='*60}")
    print("📊 REPORTE DE TRANSFORMACIÓN")
    print(f"{'='*60}")
    print(f"📥 Input:  {RAW_FILE} ({original_size/1024:.1f} KB)")
    print(f"📤 Output: {DOCS_OUTPUT} ({docs_size/1024:.1f} KB) - {len(docs_records)} registros")
    print(f"📤 Output: {HELPER_OUTPUT} ({helper_size/1024:.1f} KB) - {len(helper_records)} registros")
    print(f"\n📈 Estadísticas:")
    print(f"   - Docs nativos: {stats['docs_native']}")
    print(f"   - Helper nativos: {stats['helper_native']}")
    print(f"   - Inyectados a Docs: {stats['helper_injected_to_docs']}")
    print(f"   - Filtrados (duplicados): {stats['skipped_duplicate']}")
    print(f"   - Filtrados (contenido pobre): {stats['skipped_short']}")
    print(f"\n✅ Transformación completada.")

if __name__ == "__main__":
    transform()
