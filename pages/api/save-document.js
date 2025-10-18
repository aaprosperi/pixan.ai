// API para guardar documentos de políticas y procedimientos
// Los datos se guardan en archivos JSON estáticos en el servidor

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const document = req.body;
    
    // Validar que el documento tenga los campos requeridos
    if (!document.type || !document.username || !document.objective || !document.scope || !document.responsibles) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Crear directorio data si no existe
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Nombre del archivo basado en el tipo y timestamp
    const filename = `${document.type}_${document.id}.json`;
    const filepath = path.join(dataDir, filename);

    // Guardar el documento
    fs.writeFileSync(filepath, JSON.stringify(document, null, 2));

    // También agregar a un archivo de índice
    const indexPath = path.join(dataDir, 'index.json');
    let index = [];
    
    if (fs.existsSync(indexPath)) {
      const indexData = fs.readFileSync(indexPath, 'utf-8');
      index = JSON.parse(indexData);
    }
    
    index.push({
      id: document.id,
      type: document.type,
      username: document.username,
      objective: document.objective,
      createdAt: document.createdAt,
      filename: filename
    });
    
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

    return res.status(200).json({ 
      success: true, 
      message: 'Document saved successfully',
      document: document
    });
    
  } catch (error) {
    console.error('Error saving document:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}