import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { withRateLimit, authLimiter } from '../../../lib/rate-limiter';

const ADMIN_PASSWORD_HASH = '$2a$10$Xm8Z5J9kXm8Z5J9kXm8Z5O.FgD3HYJ5p3vKqXm8Z5J9kXm8Z5J9k'; // Hash de "Pixan01."
const JWT_SECRET = process.env.JWT_SECRET || 'pixan-admin-secret-2024';

async function authHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Para desarrollo, comparación directa. En producción usar bcrypt
    const isValid = password === 'Pixan01.';
    
    if (isValid) {
      // Crear token JWT
      const token = jwt.sign(
        { authorized: true, timestamp: Date.now() },
        JWT_SECRET,
        { expiresIn: '4h' }
      );
      
      res.setHeader('Set-Cookie', `admin-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=14400`);
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Apply strict rate limiting for auth endpoints
export default withRateLimit(authHandler, authLimiter);