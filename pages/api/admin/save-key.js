import { promises as fs } from 'fs';
import path from 'path';
import { encrypt, isValidAPIKey } from '../../../lib/crypto-utils';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pixan-admin-secret-2024';
const KEYS_FILE = path.join(process.cwd(), '.api-keys.json');

// Middleware para verificar autenticación
function verifyAuth(req) {
  const token = req.cookies?.['admin-token'];
  if (!token) return false;
  
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, key } = req.body;
    
    if (!provider || !key) {
      return res.status(400).json({ error: 'Provider and key required' });
    }

    // Validar formato de la API key
    if (!isValidAPIKey(provider, key)) {
      return res.status(400).json({ error: 'Invalid API key format' });
    }

    // Leer keys existentes
    let keys = {};
    try {
      const data = await fs.readFile(KEYS_FILE, 'utf8');
      keys = JSON.parse(data);
    } catch {
      // Si no existe el archivo, comenzar con objeto vacío
    }

    // Encriptar y guardar la nueva key
    keys[provider] = encrypt(key);
    
    // Guardar en archivo
    await fs.writeFile(KEYS_FILE, JSON.stringify(keys, null, 2));
    
    // También actualizar las variables de entorno en memoria para uso inmediato
    process.env[`${provider.toUpperCase()}_API_KEY`] = key;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}