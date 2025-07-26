import authMiddleware from './auth-middleware';
import { getTokenStats } from '../../lib/token-tracker';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stats = getTokenStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting token stats:', error);
    return res.status(500).json({ error: 'Failed to get token statistics' });
  }
}

export default authMiddleware(handler);