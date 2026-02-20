# Sonorización - Checklist de Desarrollo

## Fase 1: Core Backend
- [ ] Crear modelos Pydantic: `Proyecto`, `Pista`, `Variacion`
- [ ] Endpoint: `POST /api/sonorizacion/proyecto` - Crear proyecto
- [ ] Endpoint: `GET /api/sonorizacion/proyecto/{id}` - Obtener proyecto
- [ ] Endpoint: `POST /api/sonorizacion/pista` - Crear pista
- [ ] Endpoint: `PUT /api/sonorizacion/pista/{id}` - Editar pista
- [ ] Servicio: Integración con Suno API
- [ ] Endpoint: `POST /api/sonorizacion/pista/{id}/generar` - Generar variaciones
- [ ] Almacenamiento de variaciones generadas

## Fase 2: Frontend UI
- [ ] Página: `/sonorizacion` - Lista de proyectos
- [ ] Página: `/sonorizacion/{id}` - Vista de proyecto
- [ ] Componente: Timeline visual de pistas
- [ ] Componente: Editor de especificación de pista
- [ ] Componente: Player de variaciones con rating
- [ ] Componente: Selector de variación final

## Fase 3: Integración
- [ ] Sincronización con timeline de TTS
- [ ] Exportación: Descargar todas las pistas seleccionadas
- [ ] Multi-proveedor: ElevenLabs, Mubert como alternativas

## Investigación Pendiente
- [ ] Documentar API de Suno (endpoints, auth, límites)
- [ ] Evaluar calidad de alternativas (Mubert, AIVA)
- [ ] Definir formato de exportación (MP3, WAV, stems)
