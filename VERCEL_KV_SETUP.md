# Configuración de Vercel KV para Políticas y Procedimientos

## ¿Qué es Vercel KV?

Vercel KV es una base de datos Redis serverless que permite almacenar datos de forma persistente en Vercel. **Es GRATIS** hasta 30,000 comandos por mes.

## Estado Actual

La aplicación **funciona sin Vercel KV** usando almacenamiento en memoria como fallback. Sin embargo, los datos se perderán cuando:
- El servidor se reinicie
- Vercel haga un cold start
- Se despliegue una nueva versión

## Beneficios de Configurar Vercel KV

✅ **Persistencia permanente** - Los documentos nunca se pierden
✅ **Acceso rápido** - Redis es extremadamente rápido
✅ **Escalable** - Soporta miles de documentos sin problemas
✅ **Gratis** - Plan gratuito generoso de Vercel

## Pasos para Configurar (5 minutos)

### 1. Crear una base de datos KV en Vercel

1. Ve a tu proyecto en Vercel Dashboard: https://vercel.com/dashboard
2. Selecciona tu proyecto `pixan.ai`
3. Ve a la pestaña **Storage**
4. Haz clic en **Create Database**
5. Selecciona **KV** (Redis)
6. Dale un nombre (ej: `pixan-policies-db`)
7. Haz clic en **Create**

### 2. Conectar KV a tu proyecto

Vercel automáticamente agregará las variables de entorno necesarias:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

**No necesitas hacer nada más**, el código ya está preparado para usarlas.

### 3. Verificar que funciona

1. Ve a `https://pixan.ai/proc`
2. Crea un nuevo documento (política o proceso)
3. Cierra la pestaña
4. Vuelve a abrir `https://pixan.ai/proc`
5. Ve a "Consultar Documentos"
6. **Deberías ver tu documento guardado** ✅

## ¿Cómo saber si KV está activo?

Abre la consola del navegador (F12) y verás mensajes como:
```
Vercel KV initialized successfully
Document saved: doc_123... (policy) by username
```

Si ves `using in-memory storage` significa que KV no está configurado.

## Límites del Plan Gratuito

- **30,000 comandos/mes** - Más que suficiente para uso normal
- **256 MB de almacenamiento** - Miles de documentos
- Sin límite de tiempo

## ¿Qué pasa si no configuro KV?

La aplicación seguirá funcionando con almacenamiento en memoria:
- ✅ Guardar documentos funciona
- ✅ Consultar documentos funciona
- ✅ Exportar a CSV funciona
- ❌ Los datos se pierden al reiniciar el servidor

## Soporte

Si tienes problemas con la configuración:
1. Revisa los logs en Vercel Dashboard → Deployments → Functions
2. Asegúrate de que las variables de entorno estén configuradas
3. El código tiene fallback automático a memoria si hay problemas

---

**Recomendación:** Configura Vercel KV para tener persistencia permanente. Solo toma 5 minutos y es completamente gratis.
