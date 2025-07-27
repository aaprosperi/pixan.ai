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
  const apiKey = API_KEYS.qwen;
  if (!apiKey) {
    return res.status(500).json({ error: 'Qwen API not configured' });
  }

  // Verificar saldo
  if (!hasBalance('qwen', 0.01)) {
    return res.status(402).json({ error: 'Insufficient balance for Qwen API' });
  }

  try {
    const messages = [
      ...conversation,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen1.5-110b-chat',
        input: {
          messages: messages
        },
        parameters: {
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: `Qwen API Error: ${errorData.error?.message || errorData.message || 'Unknown error'}` 
      });
    }

    const data = await response.json();
    const content = data.output?.text || data.output?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No content received from Qwen' });
    }

    // Actualizar uso de tokens
    const tokenStats = updateTokenUsage('qwen', message, content);

    return res.status(200).json({ 
      content,
      usage: tokenStats,
      model: 'qwen1.5-110b-chat'
    });

  } catch (error) {
    console.error('Qwen API Error:', error);
    return res.status(500).json({ 
      error: `Qwen request failed: ${error.message}` 
    });
  }
}

export default authMiddleware(handler);