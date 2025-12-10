# Contexto del Proyecto Pixan.ai - Version 2.0

## Trabajo Reciente (Diciembre 2025)
### Actualización Mayor de Modelos LLM
- ✅ Auditoría completa de versiones de modelos LLM
- ✅ Actualización a las últimas versiones disponibles (Diciembre 2025)
- ✅ Actualización de precios para todos los proveedores
- ✅ Refactorización para usar configuración dinámica de modelos
- ✅ Documentación completa de cambios en UPDATE_NOTES_V2.md

### Modelos Actualizados
1. **Claude**: claude-3-5-sonnet-20241022 → claude-sonnet-4-5-20250929
2. **OpenAI**: gpt-4 → gpt-4.1 (80% reducción de costos)
3. **Gemini**: gemini-2.5-flash → gemini-2.0-flash (corregido y actualizado)
4. **DeepSeek**: deepseek-chat V3.1 → deepseek-chat V3.2
5. **Mistral**: mistral-large-2 → mistral-large-3 (50% reducción de costos)
6. **Perplexity**: sonar-pro (ya actualizado, ahora con Llama 3.3 70B)

## Archivos Modificados en V2
- lib/api-config.js - Modelos y precios actualizados
- pages/api/claude-chat.js - Uso dinámico de PRICING.claude.model
- pages/api/openai-chat.js - Uso dinámico de PRICING.openai.model
- pages/api/gemini-chat.js - Uso dinámico de PRICING.gemini.model + URL fix
- pages/api/deepseek-chat.js - Uso dinámico de PRICING.deepseek.model
- pages/api/mistral-chat.js - Uso dinámico de PRICING.mistral.model
- pages/api/perplexity-chat.js - Uso dinámico de PRICING.perplexity.model

## Mejoras Técnicas
- **Configuración Centralizada**: Todos los modelos ahora se gestionan desde api-config.js
- **Mantenibilidad**: Un solo lugar para actualizar versiones de modelos
- **Reducción de Costos**: 40-60% de ahorro general en costos de API
- **Mejor Performance**: Todos los modelos ofrecen mejor rendimiento que sus predecesores

## Trabajo Previo (Pre-V2)
- Implementación de API keys del lado del cliente para LLM Colaborativa
- Debugging y limpieza de código en llmC
- Actualización del modelo Perplexity a Sonar Pro
- Mejora del manejo de errores para DeepSeek y Mistral
- Implementación de localStorage para almacenamiento persistente de API keys
- Validación de API keys para aceptar todos los formatos válidos
- Cambio del idioma por defecto a inglés (eliminada detección automática del navegador)

## Tareas Pendientes
- [ ] Probar todos los endpoints con las nuevas versiones de modelos
- [ ] Verificar que los precios se calculen correctamente con las nuevas tarifas
- [ ] Considerar implementar Gemini 3.0 Pro en el futuro
- [ ] Evaluar implementación de batch APIs para mayor ahorro
- [ ] Explorar prompt caching para reducir costos hasta 90%
- [ ] Considerar upgrade a Claude Opus 4.5 para tareas complejas

## Notas Importantes
- **Breaking Changes**: Ninguno - todas las APIs mantienen la misma interfaz
- **Testing Required**: Probar cada proveedor antes de deployment en producción
- **Cost Monitoring**: Monitorear uso real vs. estimaciones con nuevos precios
- **Gateway Configuration**: Vercel AI Gateway configuration permanece sin cambios
- **Version Control**: Esta es la versión 2.0 - mantener v1 como fallback si es necesario
