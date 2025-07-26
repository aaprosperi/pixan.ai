import { AUTH_PASSWORD } from '../../lib/api-config';

export default function authMiddleware(handler) {
  return async (req, res) => {
    // Verificar password en el header o body
    const password = req.headers['x-auth-password'] || req.body?.password;
    
    if (!password || password !== AUTH_PASSWORD) {
      return res.status(401).json({ 
        error: 'Acceso no autorizado. Password incorrecto.',
        code: 'AUTH_FAILED' 
      });
    }
    
    // Si el password es correcto, continuar con el handler
    return handler(req, res);
  };
}