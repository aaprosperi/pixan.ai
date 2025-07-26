import authMiddleware from './auth-middleware';
import { API_KEYS } from '../../lib/api-config';
import { updateTokenUsage, hasBalance } from '../../lib/token-tracker';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversation = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Usar API key del servidor
  const apiKey = API_KEYS.inflection;
  if (!apiKey) {
    return res.status(500).json({ error: 'Inflection API not configured' });
  }

  // Verificar saldo
  if (!hasBalance('inflection', 0.03)) {
    return res.status(402).json({ error: 'Insufficient balance for Inflection API' });
  }

  try {
    const messages = [
      ...conversation,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.inflection.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'inflection-2.5',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: `Inflection API Error: ${errorData.error?.message || 'Unknown error'}` 
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No content received from Inflection' });
    }

    // Actualizar uso de tokens
    const tokenStats = updateTokenUsage('inflection', message, content);

    return res.status(200).json({ 
      content,
      usage: tokenStats,
      model: 'inflection-2.5'
    });

  } catch (error) {
    console.error('Inflection API Error:', error);
    return res.status(500).json({ 
      error: `Inflection request failed: ${error.message}` 
    });
  }
}

export default authMiddleware(handler);