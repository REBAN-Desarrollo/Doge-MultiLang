# 👶 Audience Persona: Kids (6-12 años)

> Contenido diseñado para audiencia infantil con vocabulario simplificado y restricciones de contenido.

---

## 📊 Demografía

| Atributo | Valor |
|----------|-------|
| **Rango de edad** | 6-12 años |
| **Nivel de lectura** | Primaria |
| **Atención promedio** | 10-15 min |
| **Contexto típico** | Educativo, entretenimiento familiar |

---

## 🎤 Características de Voz

### Tono General
- **Brillante** y **energético**
- **Amigable** y accesible
- **Claro** y bien articulado
- Evitar voces muy graves o intimidantes

### Velocidad de Habla
| Parámetro | Valor |
|-----------|-------|
| Palabras/minuto | 120-140 (más lento que adulto) |
| Stability | 0.6-0.7 |
| Similarity | 0.7-0.8 |

### Voces Recomendadas (ElevenLabs)

| Idioma | Voice ID | Nombre | Notas |
|--------|----------|--------|-------|
| ES | `pNInz6obpgDQGcFmaJgB` | Adam (kids mode) | Energético |
| EN | `EXAVITQu4vr4xnSDxMaL` | Bella | Friendly |
| DE | - | TBD | - |

---

## 📝 Vocabulario

### ✅ Usar
- Palabras simples y concretas
- Oraciones cortas (máximo 15 palabras)
- Repetición de conceptos clave
- Onomatopeyas cuando sea apropiado

### ❌ Evitar
| Categoría | Ejemplos |
|-----------|----------|
| Violencia | muerte, matar, sangre, arma |
| Contenido adulto | sexy, amor romántico, beso apasionado |
| Miedo extremo | terror, pesadilla, demonio |
| Complejidad | abstracto, metáfora, ironía sutil |

---

## 🚫 Blacklist Específica

```json
{
  "absolutely_blocked": [
    "muerte", "matar", "sangre", "arma",
    "sexy", "droga", "alcohol", "suicidio",
    "demonio", "infierno", "maldición"
  ],
  "context_dependent": [
    "miedo", "oscuro", "solo",
    "pelear", "enemigo"
  ]
}
```

---

## 🎬 Ejemplo de Adaptación

### Original (adulto)
> "La muerte llegó silenciosa aquella noche fría, y Juan supo que su destino estaba sellado."

### Adaptado (kids)
> "Aquella noche todo cambió para Juan, y supo que su aventura apenas comenzaba."

---

## ✅ Checklist Pre-Envío

- [ ] Vocabulario revisado contra blacklist
- [ ] Oraciones de máximo 15 palabras
- [ ] Sin contenido violento/adulto
- [ ] Velocidad de voz configurada a 0.9x
- [ ] Voz seleccionada es apropiada para niños

---

> **Última actualización**: Dic 2024
