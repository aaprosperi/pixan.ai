import authMiddleware from './auth-middleware';
import { API_KEYS } from '../../lib/api-config';
import { updateTokenUsage, hasBalance } from '../../lib/token-tracker';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversation = [], apiKey: clientApiKey, generateImage = false } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Usar API key del cliente si está disponible, si no del servidor
  const apiKey = clientApiKey || API_KEYS.openai;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API not configured' });
  }

  // Verificar saldo
  if (!hasBalance('openai', generateImage ? 0.10 : 0.05)) {
    return res.status(402).json({ error: 'Insufficient balance for OpenAI API' });
  }

  try {
    // Handle image generation with DALL-E
    if (generateImage) {
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: message,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        })
      });

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json();
        return res.status(imageResponse.status).json({
          error: `DALL-E API Error: ${errorData.error?.message || 'Unknown error'}`
        });
      }

      const imageData = await imageResponse.json();
      const imageUrl = imageData.data[0]?.url;

      if (!imageUrl) {
        return res.status(500).json({ error: 'No image received from DALL-E' });
      }

      // Update token usage for image generation (approximate cost)
      const tokenStats = updateTokenUsage('openai', message, 'Image generated');

      return res.status(200).json({
        imageUrl,
        usage: tokenStats,
        model: 'dall-e-3'
      });
    }

    // Regular chat completion
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

export default authMiddleware(handler);