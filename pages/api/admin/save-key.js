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
  console.log('=== SAVE KEY DEBUG ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  
  if (!verifyAuth(req)) {
    console.log('AUTH FAILED');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log('AUTH OK');

  if (req.method !== 'POST') {
    console.log('METHOD ERROR:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, key } = req.body;
    console.log('Body received:', { provider, key: key ? `${key.substring(0, 10)}...` : 'null' });
    
    if (!provider || !key) {
      console.log('MISSING DATA:', { provider: !!provider, key: !!key });
      return res.status(400).json({ error: 'Provider and key required' });
    }

    // Validar formato de la API key
    const isValid = isValidAPIKey(provider, key);
    console.log('Validation result:', { provider, isValid });
    
    if (!isValid) {
      console.log('VALIDATION FAILED for:', provider);
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