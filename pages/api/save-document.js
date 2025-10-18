// API para guardar documentos de políticas y procedimientos
// Versión adaptada para Vercel Serverless (sin filesystem)
// Los datos se almacenan en memoria durante la sesión

// Storage temporal en memoria (se perderá al reiniciar el servidor)
// Para producción, usar Vercel KV, MongoDB, PostgreSQL, etc.
let documentsStore = [];

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir POST y GET
  if (req.method === 'POST') {
    return handleSave(req, res);
  } else if (req.method === 'GET') {
    return handleGet(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Guardar documento
async function handleSave(req, res) {
  try {
    const document = req.body;
    
    // Validar que el documento tenga los campos requeridos
    if (!document.type || !document.username || !document.objective || !document.scope || !document.responsibles) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: document 
      });
    }

    // Agregar timestamp si no existe
    if (!document.id) {
      document.id = Date.now();
    }
    if (!document.createdAt) {
      document.createdAt = new Date().toISOString();
    }

    // Guardar en el store en memoria
    documentsStore.push(document);

    console.log(`Document saved: ${document.type} by ${document.username}`);
    console.log(`Total documents in store: ${documentsStore.length}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Document saved successfully',
      document: document,
      totalDocuments: documentsStore.length
    });
    
  } catch (error) {
    console.error('Error saving document:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Obtener todos los documentos
async function handleGet(req, res) {
  try {
    const { username } = req.query;

    let documents = documentsStore;

    // Filtrar por usuario si se especifica
    if (username) {
      documents = documentsStore.filter(doc => doc.username === username);
    }

    return res.status(200).json({ 
      success: true,
      documents: documents,
      total: documents.length
    });
    
  } catch (error) {
    console.error('Error getting documents:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}