# Pixan.ai Web App Generator

## 🚀 Descripción

Sistema completo de generación de aplicaciones web mediante IA integrado en Pixan.ai. Permite a los usuarios crear aplicaciones web funcionales describiendo sus necesidades en lenguaje natural.

## ✨ Características

### Funcionalidades Principales
- **Generador por Prompt**: Interfaz intuitiva para describir aplicaciones web
- **IA Avanzada**: Integración con Claude Sonnet 4 de Anthropic
- **Páginas Dinámicas**: Sistema automático de creación de URLs únicas
- **Previsualización**: Vista previa en tiempo real de apps generadas
- **Responsive**: Diseño adaptable a todos los dispositivos

### Seguridad y Performance
- **API Ofuscada**: Credenciales completamente protegidas
- **Rate Limiting**: Prevención de abuso del sistema
- **Sanitización**: Validación exhaustiva de inputs
- **Error Handling**: Manejo robusto de errores

### Integración
- **Navegación Unificada**: Enlace prominente desde la página principal
- **Diseño Consistente**: Respeta la identidad visual de Pixan.ai
- **SEO Optimizado**: Meta tags y estructura semántica

## 🛠️ Arquitectura Técnica

### Stack Tecnológico
- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: API Routes de Next.js
- **IA**: Anthropic Claude Sonnet 4 API
- **Storage**: Sistema de archivos local
- **Deploy**: Vercel (automático)

### Estructura de Archivos
```
pixan.ai/
├── pages/
│   ├── generator.js              # Página principal del generador
│   ├── generated/
│   │   ├── [id].js              # Visor de apps generadas
│   │   └── (apps dinámicas)     # Apps generadas automáticamente
│   └── api/
│       ├── generate.js          # API principal (ofuscada)
│       └── app/
│           └── [id].js          # API de metadata
├── .env.example                 # Variables de entorno
└── GENERATOR_README.md         # Esta documentación
```

## ⚙️ Configuración

### Variables de Entorno Requeridas
```bash
# Copiar .env.example a .env.local
ANTHROPIC_API_KEY=your_key_here
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Instalación de Dependencias
```bash
# Instalar dependencias (si es necesario)
npm install next react react-dom

# Ejecutar en desarrollo
npm run dev
```

## 🎯 Uso del Sistema

### Para Usuarios
1. Navegar a `/generator` desde la página principal
2. Describir la aplicación web deseada en el textarea
3. Hacer clic en "Generar App Web"
4. Esperar la generación (15-30 segundos)
5. Ver previsualización y acceder a la app completa

### Ejemplos de Prompts Efectivos
- "Calculadora de propinas con campos para monto, porcentaje y división entre personas"
- "Dashboard de métricas con gráficos y filtros por fecha"
- "Formulario de contacto con validación y confirmación por email"
- "Lista de tareas con drag & drop y categorías"

## 🔒 Seguridad Implementada

### Protección de API
- **Credenciales Ofuscadas**: API key encriptada en múltiples capas
- **Variables de Entorno**: Configuración segura vía environment
- **Rate Limiting**: Máximo 5 requests por minuto por IP
- **Input Sanitization**: Limpieza exhaustiva de inputs del usuario

### Validación de Código
- **Sanitización**: Eliminación de código potencialmente peligroso
- **Whitelist**: Solo funciones React/JS seguras permitidas
- **Estructura**: Validación de componentes React válidos

## 📊 Monitoreo y Costos

### Tracking de Uso
- **Tokens**: Conteo automático de tokens utilizados
- **Costos**: Cálculo en tiempo real basado en pricing de Anthropic
- **Logs**: Registro de generaciones exitosas y errores

### Pricing Reference
- Claude Sonnet 4: ~$3.00 por 1M tokens
- Generación promedio: 2,000-4,000 tokens
- Costo por app: ~$0.006-$0.012 USD

## 🚀 Deploy y Mantenimiento

### Proceso de Deploy
1. Commit cambios al repositorio
2. Push activa deploy automático en Vercel
3. Variables de entorno configuradas en Vercel Dashboard
4. SSL y CDN automáticos

### Mantenimiento
- **Logs**: Revisar logs en Vercel para errores
- **Rate Limits**: Monitorear abuso del sistema
- **Storage**: Limpiar apps generadas periódicamente
- **API Limits**: Vigilar cuotas de Anthropic

## 🔧 Desarrollo y Extensiones

### Agregar Nuevas Funcionalidades
- Editar `/pages/generator.js` para UI
- Modificar `/pages/api/generate.js` para lógica backend
- Actualizar `/pages/generated/[id].js` para visualización

### Mejoras Sugeridas
- **Persistencia**: Base de datos para apps generadas
- **Usuarios**: Sistema de cuentas y historial
- **Templates**: Plantillas predefinidas
- **Colaboración**: Compartir y editar apps
- **Analytics**: Métricas de uso detalladas

## 📞 Soporte

### Troubleshooting Común
- **Error de API**: Verificar ANTHROPIC_API_KEY en .env.local
- **Rate Limit**: Esperar 1 minuto entre requests
- **App no carga**: Verificar que el archivo se generó en /pages/generated/

### Logs de Debug
- Consola del navegador para errores frontend
- Terminal del servidor para errores backend
- Vercel Dashboard para logs de producción

---

**Desarrollado para Pixan.ai**  
Powered by Claude Sonnet 4 - Anthropic API  
Sistema de generación automática de aplicaciones web con IA