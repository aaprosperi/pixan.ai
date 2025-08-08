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
  const apiKey = clientApiKey || API_KEYS.perplexity;
  if (!apiKey) {
    return res.status(500).json({ error: 'Perplexity API not configured' });
  }

  // Verificar saldo
  if (!hasBalance('perplexity', 0.02)) {
    return res.status(402).json({ error: 'Insufficient balance for Perplexity API' });
  }

  try {
    const messages = [
      ...conversation,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: `Perplexity API Error: ${errorData.error?.message || 'Unknown error'}` 
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No content received from Perplexity' });
    }

    // Actualizar uso de tokens
    const tokenStats = updateTokenUsage('perplexity', message, content);

    return res.status(200).json({ 
      content,
      usage: tokenStats,
      model: 'sonar-pro'
    });

  } catch (error) {
    console.error('Perplexity API Error:', error);
    return res.status(500).json({ 
      error: `Perplexity request failed: ${error.message}` 
    });
export default authMiddleware(handler);
