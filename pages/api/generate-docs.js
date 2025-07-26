export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { geminiApiKey, content, title = 'Análisis Multi-IA', queryType = 'general' } = req.body;

  if (!geminiApiKey) {
    return res.status(400).json({ error: 'Gemini API key is required' });
  }

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    // Prompt especializado para que Gemini genere HTML estructurado para Google Docs
    const documentPrompt = `Eres un experto en creación de documentos profesionales con diseño moderno y responsive. Toma esta respuesta consolidada de múltiples IAs y genera un documento HTML estructurado que se pueda importar a Google Docs.

CONTENIDO A PROCESAR:
${content}

INSTRUCCIONES CRÍTICAS DE DISEÑO:

1. ESTRUCTURA JERÁRQUICA:
   - H1: Título principal (font-size: 2.5em, color: #1a1a1a, margin-bottom: 24px)
   - H2: Secciones principales (font-size: 1.8em, color: #2c3e50, margin: 32px 0 16px)
   - H3: Subsecciones (font-size: 1.4em, color: #34495e, margin: 24px 0 12px)
   - P: Párrafos (font-size: 1.1em, line-height: 1.8, color: #333, margin-bottom: 16px)

2. TABLAS RESPONSIVE:
   - Usa <table style="width: 100%; border-collapse: collapse; margin: 24px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
   - Headers: background-color: #3498db; color: white; padding: 12px; text-align: left;
   - Celdas: border: 1px solid #ddd; padding: 12px; alternate rows con background: #f9f9f9;
   - Responsive: overflow-x: auto; min-width: 300px;

3. INDICADORES VISUALES CON COLORES SEMÁNTICOS:
   - ✅ Éxito/Positivo: background: #d4edda; color: #155724; border-left: 4px solid #28a745;
   - ⚠️ Advertencia: background: #fff3cd; color: #856404; border-left: 4px solid #ffc107;
   - ❌ Error/Negativo: background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545;
   - ℹ️ Información: background: #d1ecf1; color: #0c5460; border-left: 4px solid #17a2b8;
   - 💡 Destacado: background: #e8daff; color: #3d1e6d; border-left: 4px solid #6f42c1;

4. SEPARADORES HORIZONTALES:
   - Entre secciones principales: <hr style="border: none; border-top: 2px solid #e9ecef; margin: 40px 0;">
   - Entre subsecciones: <hr style="border: none; border-top: 1px solid #f1f3f5; margin: 24px 0;">

5. TIPOGRAFÍA ESCALADA:
   - Font family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
   - Escala modular: 2.5em → 1.8em → 1.4em → 1.1em → 1em
   - Negrita para énfasis: font-weight: 600;
   - Cursiva para citas o términos: font-style: italic; color: #666;

6. LAYOUT ADAPTATIVO:
   - Container principal: max-width: 1200px; margin: 0 auto; padding: 40px 20px;
   - Media query simulado con max-width y padding adaptativo
   - Imágenes y tablas: width: 100%; height: auto;
   - Bloques de código: background: #f8f9fa; padding: 16px; border-radius: 8px; overflow-x: auto;

7. ELEMENTOS ADICIONALES DE DISEÑO:
   - Cajas destacadas: border-radius: 8px; padding: 20px; margin: 20px 0;
   - Listas con iconos: list-style: none; padding-left: 0; con bullets personalizados
   - Bloques de cita: border-left: 4px solid #6c757d; padding-left: 20px; margin: 20px 0;
   - Badges/etiquetas: display: inline-block; padding: 4px 12px; border-radius: 20px;

FORMATO DE SALIDA:
- Documento HTML5 completo con <!DOCTYPE html>
- <head> con meta viewport para responsive
- Título del documento: "${title}"
- Estilos CSS inline optimizados para impresión y pantalla
- Estructura semántica con <main>, <section>, <article>
- Footer estilizado: background: #2c3e50; color: white; padding: 24px; text-align: center;

ADAPTACIÓN POR TIPO DE CONSULTA (${queryType}):
- Técnica: Énfasis en tablas de especificaciones, código formateado, diagramas textuales
- Creativa: Uso de colores vibrantes, espaciado generoso, bloques inspiracionales
- Analítica: Tablas comparativas destacadas, gráficos de barras con CSS, métricas en badges
- Investigación: Referencias numeradas, citas formateadas, tablas de datos estructurados
- General: Balance entre todos los elementos, estructura clara y navegable

Genera ÚNICAMENTE el código HTML completo, sin explicaciones adicionales.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: documentPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: `Gemini API Error: ${errorData.error?.message || 'Unknown error'}` 
      });
    }

    const data = await response.json();
    const htmlContent = data.candidates[0]?.content?.parts[0]?.text;

    if (!htmlContent) {
      return res.status(500).json({ error: 'No HTML content generated by Gemini' });
    }

    // Crear un blob URL para descargar el archivo HTML
    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.html`;
    
    return res.status(200).json({ 
      htmlContent,
      fileName,
      downloadUrl: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
      success: true
    });

  } catch (error) {
    console.error('Google Docs Generation Error:', error);
    return res.status(500).json({ 
      error: `Document generation failed: ${error.message}` 
    });
  }
}