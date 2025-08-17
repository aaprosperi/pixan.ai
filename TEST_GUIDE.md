# 🧪 Guía de Pruebas - Pixan.ai LLM Colaborativa

## 📋 Resumen
Este documento describe el sistema de pruebas implementado para la aplicación LLM Colaborativa de Pixan.ai.

## 🚀 Instalación

Primero, instala las dependencias de testing:

```bash
npm install
```

## 🏃 Ejecutar Pruebas

### Todas las pruebas
```bash
npm test
```

### Modo watch (desarrollo)
```bash
npm run test
```

### Pruebas con coverage
```bash
npm run test:coverage
```

### CI/CD
```bash
npm run test:ci
```

## 📂 Estructura de Pruebas

```
pixan.ai/
├── __tests__/
│   ├── pages/
│   │   └── llmC.test.js          # Pruebas del componente principal
│   ├── integration/
│   │   └── llm-apis.test.js      # Pruebas de integración de APIs
│   └── utils/
│       └── llm-helpers.test.js   # Pruebas unitarias de funciones helper
├── jest.config.js                 # Configuración de Jest
└── jest.setup.js                  # Setup global de pruebas
```

## 🎯 Tipos de Pruebas

### 1. **Pruebas Unitarias** (`__tests__/pages/llmC.test.js`)
- ✅ Autenticación de usuario
- ✅ Validación de formularios
- ✅ Renderizado de componentes
- ✅ Manejo de estados
- ✅ Gestión de API keys

### 2. **Pruebas de Integración** (`__tests__/integration/llm-apis.test.js`)
- ✅ Llamadas a Claude API
- ✅ Llamadas a OpenAI API
- ✅ Llamadas a Gemini API
- ✅ Llamadas a Perplexity API
- ✅ Manejo de errores de API
- ✅ Llamadas paralelas a múltiples APIs
- ✅ Estadísticas de tokens

### 3. **Pruebas de Funciones Helper** (`__tests__/utils/llm-helpers.test.js`)
- ✅ Validación de API keys
- ✅ Cálculo de costos de tokens
- ✅ Formateo de respuestas
- ✅ Validación de consultas
- ✅ Gestión de memoria de conversación

## 📊 Coverage Report

Para ver el reporte de cobertura:

```bash
npm run test:coverage
```

Esto generará:
- Reporte en consola
- Reporte HTML en `coverage/lcov-report/index.html`

### Objetivos de Coverage
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🔧 Configuración

### Jest Config (`jest.config.js`)
- Entorno: `jsdom` para pruebas de React
- Path mappings para imports absolutos
- Coverage de componentes, páginas y librerías
- Exclusión de archivos de configuración

### Setup (`jest.setup.js`)
- Mock de `localStorage`
- Mock de `fetch` API
- Mock de `navigator.clipboard`
- Testing Library configurado

## 🐛 Debugging

### Ejecutar una prueba específica
```bash
npm test -- llmC.test.js
```

### Ejecutar con verbose
```bash
npm test -- --verbose
```

### Modo debug
```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

## ✅ Checklist Pre-Deploy

Antes de hacer deploy, asegúrate de:

- [ ] Todas las pruebas pasan: `npm run test:ci`
- [ ] Coverage > 80%: `npm run test:coverage`
- [ ] Sin console.logs en producción
- [ ] API keys no hardcodeadas
- [ ] Validación de inputs funcionando
- [ ] Manejo de errores implementado

## 🔄 CI/CD Integration

Para GitHub Actions, agrega a `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:coverage
```

## 📝 Mejoras Futuras

### Prioridad Alta
- [ ] Agregar pruebas E2E con Playwright
- [ ] Implementar pruebas de performance
- [ ] Mock de WebSockets para tiempo real

### Prioridad Media
- [ ] Pruebas de accesibilidad (a11y)
- [ ] Pruebas de internacionalización
- [ ] Visual regression testing

### Prioridad Baja
- [ ] Mutation testing
- [ ] Security testing
- [ ] Load testing

## 🆘 Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tests muy lentos
- Revisa si hay timeouts largos
- Usa `--runInBand` para debugging
- Considera usar `--maxWorkers=2`

### Mocks no funcionan
- Verifica que `jest.setup.js` se está cargando
- Limpia cache: `npm test -- --clearCache`

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

*Última actualización: Agosto 2025*