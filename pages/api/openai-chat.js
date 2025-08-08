import authMiddleware from './auth-middleware';
import { API_KEYS } from '../../lib/api-config';
import { updateTokenUsage, hasBalance } from '../../lib/token-tracker';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversation = [], apiKey: clientApiKey } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Usar API key del cliente si está disponible, si no del servidor
  const apiKey = clientApiKey || API_KEYS.openai;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API not configured' });
  }

  // Verificar saldo
  if (!hasBalance('openai', 0.05)) {
    return res.status(402).json({ error: 'Insufficient balance for OpenAI API' });
  }

  try {
    const messages = [
      ...conversation,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: `OpenAI API Error: ${errorData.error?.message || 'Unknown error'}` 
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No content received from OpenAI' });
    }

    // Actualizar uso de tokens
    const tokenStats = updateTokenUsage('openai', message, content);

    return res.status(200).json({ 
      content,
      usage: tokenStats,
      model: 'gpt-4'
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({ 
      error: `OpenAI request failed: ${error.message}` 
    });
  }
}

// Temporalmente sin middleware para testing
export default handler;
// export default authMiddleware(handler);