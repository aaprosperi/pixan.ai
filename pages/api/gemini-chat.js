export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, prompt, parameters } = req.body;

  if (!apiKey || !prompt) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const systemPrompt = `You are an expert prompt engineer specializing in optimizing prompts for AI systems. 
    Target LLM: ${parameters.targetLLM}
    Industry/Domain: ${parameters.industry}
    Temperature preference: ${parameters.temperature}/10 (${parameters.temperature < 4 ? 'precise' : parameters.temperature > 6 ? 'creative' : 'balanced'})
    
    Provide clear, specific optimizations that enhance clarity, effectiveness, and alignment with the target LLM's capabilities.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPlease optimize this prompt:\n\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: parameters.temperature / 10,
          maxOutputTokens: 1000,
          topK: 40,
          topP: 0.95
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_ONLY_HIGH'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_ONLY_HIGH'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      
      if (response.status === 400) {
        return res.status(400).json({ error: 'Invalid request or API key' });
      } else if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      } else {
        return res.status(response.status).json({ error: 'Gemini API error' });
      }
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const content = data.candidates[0].content.parts[0].text;
      
      if (data.candidates[0].finishReason === 'SAFETY') {
        return res.status(400).json({ error: 'Content was blocked by safety filters' });
      }
      
      return res.status(200).json({ content });
    } else {
      return res.status(500).json({ error: 'Unexpected response format from Gemini' });
    }
    
  } catch (error) {
    console.error('Gemini API handler error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}