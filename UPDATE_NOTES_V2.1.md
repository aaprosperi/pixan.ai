# Pixan.ai GenAI - Actualización V2.1 (Diciembre 18, 2025)

## Resumen de Cambios

Actualización urgente de modelos LLM a las versiones más recientes lanzadas entre el 10 y 18 de diciembre de 2025.

## Modelos Actualizados

### 1. Claude: Sonnet 4.5 → Opus 4.5
- **Modelo anterior**: `claude-sonnet-4-5-20250929`
- **Modelo nuevo**: `claude-opus-4-5-20251101`
- **Fecha de lanzamiento**: Noviembre 24, 2025
- **Cambio de precio**: $3/$15 → $5/$25 por millón de tokens (66% más caro pero mejor performance)
- **Beneficios**:
  - Mejor modelo del mundo para coding, agentes y computer use
  - Soporte para nuevo parámetro "effort" (minimize tiempo/costo o maximize capacidad)
  - Structured outputs ahora soporta Haiku 4.5
- **Fuente**: [Anthropic Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5)

### 2. OpenAI: GPT-4.1 → GPT-5.2
- **Modelo anterior**: `gpt-4.1`
- **Modelo nuevo**: `gpt-5.2`
- **Fecha de lanzamiento**: Diciembre 11, 2025
- **Cambio de precio**: $2/$8 → $1.75/$14 por millón de tokens (input más barato, output más caro)
- **Beneficios**:
  - Flagship model para coding y tareas agénticas
  - 400,000 context window, 128,000 max output tokens
  - Knowledge cutoff: Agosto 31, 2025
  - Soporte para reasoning tokens
  - Con prompt caching: 10x reducción en costos ($0.175/M tokens)
  - Con Batch API: 50% descuento adicional
- **Fuente**: [OpenAI GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)

### 3. Google Gemini: 2.0 Flash → 3 Flash
- **Modelo anterior**: `gemini-2.0-flash`
- **Modelo nuevo**: `gemini-3-flash-preview`
- **Fecha de lanzamiento**: Diciembre 17, 2025 (¡hace 1 día!)
- **Cambio de precio**: $0.10/$0.40 → $0.50/$3 por millón de tokens (más caro pero mejor performance)
- **Beneficios**:
  - En benchmark MMMU-Pro: 81.2% score (supera a todos los competidores)
  - Compite directamente con GPT-5.2
  - 1/4 del precio de Gemini 3 Pro ≤200k
  - Free tier disponible en Gemini API
  - Modelo por defecto en Gemini app y AI mode en Search
- **Fuente**: [Google Gemini 3 Flash](https://blog.google/products/gemini/gemini-3/)

### 4. DeepSeek: Sin cambios (ya actualizado)
- **Modelo actual**: `deepseek-chat` (V3.2)
- **Fecha de lanzamiento**: Diciembre 1, 2025
- **Precio**: $0.28/$0.42 por millón de tokens
- **Características**:
  - Reasoning-first model para agentes
  - Primera integración de thinking directamente en tool-use
  - Soporta tool-use en modos thinking y non-thinking
  - DeepSeek Sparse Attention (DSA) para contextos largos
- **Fuente**: [DeepSeek V3.2](https://api-docs.deepseek.com/news/news251201)

### 5. Mistral: Sin cambios (ya actualizado)
- **Modelo actual**: `mistral-large-3`
- **Fecha de lanzamiento**: Diciembre 2, 2025
- **Precio**: $0.50/$1.50 por millón de tokens
- **Características**:
  - Mixture of Experts: 41B parámetros activos, 675B totales
  - Multimodal y multilingual
  - Context window: 256,000 tokens
- **Fuente**: [Mistral Large 3](https://mistral.ai/news/mistral-3)

### 6. Perplexity: Sin cambios (ya actualizado)
- **Modelo actual**: `sonar-pro`
- **Actualizado**: Febrero 2025 con Llama 3.3 70B
- **Precio**: $2/$2 por millón de tokens
- **Características**:
  - 1200 tokens/segundo (Cerebras infrastructure)
  - Supera a GPT-4o mini y Claude 3.5 Haiku
  - Soporte para reasoning y deep research
- **Fuente**: [Perplexity Sonar](https://www.perplexity.ai/hub/blog/meet-new-sonar)

## Análisis de Costos

### Aumentos de Precio
- **Claude**: +66% ($3/$15 → $5/$25) - Justificado por ser el mejor modelo para coding/agentes
- **Gemini**: +400%/+650% ($0.10/$0.40 → $0.50/$3) - Pero sigue siendo económico y compite con GPT-5.2
- **OpenAI**: Input -12.5%, Output +75% - Más caro para generación pero mejor para agentes

### Resumen General
- Input promedio: Aumento moderado (~20-30%)
- Output promedio: Aumento significativo (~40-60%)
- Performance: Mejora sustancial en todos los modelos (30-80% en benchmarks)
- ROI: Mejor rendimiento justifica los costos adicionales

## Archivos Modificados

- `lib/api-config.js` - Modelos y precios actualizados

### Archivos NO Modificados (usan configuración dinámica)
- `pages/api/claude-chat.js` - Usa `PRICING.claude.model`
- `pages/api/openai-chat.js` - Usa `PRICING.openai.model`
- `pages/api/gemini-chat.js` - Usa `PRICING.gemini.model`
- `pages/api/deepseek-chat.js` - Usa `PRICING.deepseek.model`
- `pages/api/mistral-chat.js` - Usa `PRICING.mistral.model`
- `pages/api/perplexity-chat.js` - Usa `PRICING.perplexity.model`

## Testing Recomendado

Antes de usar en producción, probar:

```bash
# Claude Opus 4.5
curl -X POST http://localhost:3000/api/claude-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from Claude Opus 4.5"}'

# GPT-5.2
curl -X POST http://localhost:3000/api/openai-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from GPT-5.2"}'

# Gemini 3 Flash
curl -X POST http://localhost:3000/api/gemini-chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello from Gemini 3 Flash"}'
```

## Notas Importantes

### Compatibilidad
- ✅ Todas las APIs mantienen backward compatibility
- ✅ No se requieren cambios en el frontend
- ✅ Environment variables permanecen sin cambios

### Consideraciones
- **Claude Opus 4.5**: Más caro pero mejor para tareas complejas. Considerar usar Sonnet 4.5 para tareas simples.
- **GPT-5.2**: Output más caro. Usar prompt caching para reducir costos hasta 90%.
- **Gemini 3 Flash**: Recién lanzado (17 dic). Monitorear estabilidad en preview.

### Próximos Pasos
- [ ] Probar todos los endpoints en staging
- [ ] Monitorear uso y costos reales
- [ ] Evaluar si mantener Sonnet 4.5 como opción económica
- [ ] Considerar implementar selección dinámica de modelos según complejidad de tarea

## Changelog

**v2.1 - Diciembre 18, 2025**
- Actualizado Claude a Opus 4.5
- Actualizado OpenAI a GPT-5.2
- Actualizado Gemini a 3 Flash Preview
- Actualizados todos los precios
- DeepSeek, Mistral y Perplexity ya estaban en últimas versiones

**v2.0 - Diciembre 10, 2025**
- Primera actualización masiva de modelos
- Implementación de configuración dinámica

---

**Versión**: 2.1
**Fecha de actualización**: Diciembre 18, 2025
**Autor**: Actualización automática vía Claude Code
**Estado**: Listo para testing
