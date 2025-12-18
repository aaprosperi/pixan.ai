import authMiddleware from './auth-middleware';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'AI Gateway API key not configured.' 
    });
  }

  try {
    // Use the prompt directly from the frontend (already formatted with correct mode)
    // The frontend sends the appropriate prompt for schema/infographic/ultrarealistic
    const imagePrompt = prompt;

    // Call Vercel AI Gateway with image generation model
    const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-image',
        messages: [
          {
            role: 'user',
            content: imagePrompt
          }
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('AI Gateway error:', errorData);
      
      return res.status(response.status).json({ 
        error: `AI Gateway error: ${response.status}`,
        details: errorData
      });
    }

    const data = await response.json();
    
    // Extract image from response
    const message = data.choices?.[0]?.message;
    const textContent = message?.content || '';
    const images = message?.images || [];

    // Return response with images
    return res.status(200).json({
      success: true,
      text: textContent,
      images: images.map(img => ({
        url: img.image_url?.url || img.url || null
      })).filter(img => img.url),
      model: 'google/gemini-3-pro-image',
      usage: data.usage
    });

  } catch (error) {
    console.error('Image generation API error:', error);
    return res.status(500).json({
      error: 'Failed to generate image',
      details: error.message
    });
  }
}

// Export with authentication middleware
export default authMiddleware(handler);
