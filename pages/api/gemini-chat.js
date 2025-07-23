export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { apiKey, prompt, parameters } = req.body;
  
  if (!apiKey || !prompt) {
    return res.status(400).json({ error: 'Missing apiKey or prompt' });
  }
  
  try {
    const systemPrompt = `You are an expert prompt engineer specializing in optimizing prompts for AI systems. 
    Target LLM: ${parameters?.targetLLM || 'Universal'}
    Industry/Domain: ${parameters?.industry || 'General'}
    Temperature preference: ${parameters?.temperature || 7}/10 (${(parameters?.temperature || 7) < 4 ? 'precise' : (parameters?.temperature || 7) > 6 ? 'creative' : 'balanced'})
    
    Provide clear, specific optimizations that enhance clarity, effectiveness, and alignment with the target LLM's capabilities.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nPlease optimize this prompt:\n\n${prompt}`
            }]
          }],
          generationConfig: {
            temperature: parameters?.temperature ? parameters.temperature / 10 : 0.7,
            maxOutputTokens: 2000,
            topP: 0.95,
            topK: 40
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
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API Error:', data.error);
      return res.status(400).json({ 
        error: `Gemini API Error: ${data.error.message || 'Unknown API error'}` 
      });
    }
    
    if (!response.ok) {
      console.error('Gemini API HTTP Error:', response.status, data);
      
      if (response.status === 400) {
        return res.status(400).json({ error: 'Invalid request or API key for Gemini 2.5 Flash' });
      } else if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded - please try again' });
      } else if (response.status === 403) {
        return res.status(403).json({ error: 'API key invalid or insufficient permissions' });
      } else {
        return res.status(response.status).json({ error: `Gemini API Error: ${response.status}` });
      }
    }
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response structure:', data);
      return res.status(500).json({ 
        error: 'Invalid response format from Gemini API - no candidates found' 
      });
    }

    const candidate = data.candidates[0];
    
    if (candidate.finishReason === 'SAFETY') {
      return res.status(400).json({ 
        error: 'Content was blocked by Gemini safety filters - try rephrasing your prompt' 
      });
    }
    
    if (!candidate.content.parts || !candidate.content.parts[0]) {
      return res.status(500).json({ 
        error: 'Invalid response format from Gemini API - no content parts' 
      });
    }
    
    const content = candidate.content.parts[0].text;
    
    if (!content || content.trim() === '') {
      return res.status(500).json({ 
        error: 'Empty response received from Gemini API' 
      });
    }
    
    res.status(200).json({ content });
    
  } catch (error) {
    console.error('Gemini API request failed:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout - Gemini API took too long' });
    }
    
    if (error.message && error.message.includes('fetch')) {
      return res.status(500).json({ 
        error: 'Failed to connect to Gemini API - check your internet connection' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error while calling Gemini API' 
    });
  }
}