import authMiddleware from './auth-middleware';
import { API_KEYS, PRICING } from '../../lib/api-config';
import { updateTokenUsage, hasBalance } from '../../lib/token-tracker';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context, apiKey: clientApiKey } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing required message' });
  }

  // Usar API key del cliente si está disponible, si no del servidor
  const apiKey = clientApiKey || API_KEYS.claude;
  if (!apiKey) {
    return res.status(500).json({ error: 'Claude API not configured' });
  }

  // Verificar saldo
  if (!hasBalance('claude', 0.05)) {
    return res.status(402).json({ error: 'Insufficient balance for Claude API' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: PRICING.claude.model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        system: context === 'prompt_optimization' 
          ? 'You are an expert prompt engineer. Provide clear, specific, and actionable prompt optimizations. Focus on clarity, effectiveness, and alignment with the target LLM capabilities.'
          : undefined
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', response.status, errorData);
      
      if (response.status === 401) {
        return res.status(401).json({ error: 'Invalid API key' });
      } else if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      } else {
        return res.status(response.status).json({ error: 'Claude API error' });
      }
    }

    const data = await response.json();
    
    if (data.content && data.content[0] && data.content[0].text) {
      const content = data.content[0].text;
      
      // Actualizar uso de tokens
      const tokenStats = updateTokenUsage('claude', message, content);
      
      return res.status(200).json({
        content,
        usage: tokenStats,
        model: PRICING.claude.model
      });
    } else {
      return res.status(500).json({ error: 'Unexpected response format from Claude' });
    }
    
  } catch (error) {
    console.error('Claude API handler error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default authMiddleware(handler);