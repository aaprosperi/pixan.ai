// API para guardar documentos de políticas y procedimientos
// Usa Vercel KV para almacenamiento persistente con fallback a memoria

import { storage } from '../../lib/kv';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Enrutar según método
  if (req.method === 'POST') {
    return handleSave(req, res);
  } else if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Guardar documento
async function handleSave(req, res) {
  try {
    const document = req.body;
    
    // Validar campos requeridos
    if (!document.type || !document.username || !document.objective || !document.scope || !document.responsibles) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: document 
      });
    }

    // Generar ID si no existe
    if (!document.id) {
      document.id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    if (!document.createdAt) {
      document.createdAt = new Date().toISOString();
    }

    // Guardar documento individual
    const docKey = `document:${document.id}`;
    await storage.set(docKey, document);

    // Actualizar índice de documentos
    const indexKey = 'documents:index';
    let index = await storage.get(indexKey) || [];
    
    // Evitar duplicados
    if (!index.includes(document.id)) {
      index.push(document.id);
      await storage.set(indexKey, index);
    }

    // Actualizar índice por usuario
    const userIndexKey = `documents:user:${document.username}`;
    let userIndex = await storage.get(userIndexKey) || [];
    if (!userIndex.includes(document.id)) {
      userIndex.push(document.id);
      await storage.set(userIndexKey, userIndex);
    }

    console.log(`Document saved: ${document.id} (${document.type}) by ${document.username}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Document saved successfully',
      document: document,
      storageType: storage.isKVAvailable() ? 'Vercel KV' : 'Memory'
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

// Obtener documentos
async function handleGet(req, res) {
  try {
    const { username, id, type } = req.query;

    // Si se solicita un documento específico
    if (id) {
      const docKey = `document:${id}`;
      const document = await storage.get(docKey);
      
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      return res.status(200).json({ 
        success: true,
        document: document
      });
    }

    // Obtener lista de IDs de documentos
    let documentIds = [];
    
    if (username) {
      // Obtener documentos de un usuario específico
      const userIndexKey = `documents:user:${username}`;
      documentIds = await storage.get(userIndexKey) || [];
    } else {
      // Obtener todos los documentos
      const indexKey = 'documents:index';
      documentIds = await storage.get(indexKey) || [];
    }

    // Cargar todos los documentos
    const documents = [];
    for (const docId of documentIds) {
      const docKey = `document:${docId}`;
      const doc = await storage.get(docKey);
      if (doc) {
        documents.push(doc);
      }
    }

    // Filtrar por tipo si se especifica
    let filteredDocs = documents;
    if (type) {
      filteredDocs = documents.filter(doc => doc.type === type);
    }

    // Ordenar por fecha (más recientes primero)
    filteredDocs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({ 
      success: true,
      documents: filteredDocs,
      total: filteredDocs.length,
      storageType: storage.isKVAvailable() ? 'Vercel KV' : 'Memory'
    });
    
  } catch (error) {
    console.error('Error getting documents:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Eliminar documento
async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Document ID required' });
    }

    // Obtener el documento para saber el usuario
    const docKey = `document:${id}`;
    const document = await storage.get(docKey);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Eliminar documento
    await storage.del(docKey);

    // Actualizar índice general
    const indexKey = 'documents:index';
    let index = await storage.get(indexKey) || [];
    index = index.filter(docId => docId !== id);
    await storage.set(indexKey, index);

    // Actualizar índice del usuario
    const userIndexKey = `documents:user:${document.username}`;
    let userIndex = await storage.get(userIndexKey) || [];
    userIndex = userIndex.filter(docId => docId !== id);
    await storage.set(userIndexKey, userIndex);

    console.log(`Document deleted: ${id}`);

    return res.status(200).json({ 
      success: true,
      message: 'Document deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}