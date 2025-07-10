// No filesystem imports needed - everything in memory

// Obfuscated security layer
const _0x1a2b = {
  _0x3c4d: 'YW50aHJvcGlj',
  _0x5e6f: 'YXBpLmFudGhyb3BpYy5jb20=',
  _0x7g8h: 'Y2xhdWRlLTMtNS1zb25uZXQtMjAyNDEwMjI=',
  _0x9i0j: 'Q0xBVURFX0FQSV9LRVk=',
  _0x1k2l: Buffer.from('aHR0cHM6Ly8=', 'base64').toString(),
};

const _0x3m4n = (str) => Buffer.from(str, 'base64').toString();
const _0x5o6p = () => process.env[_0x3m4n(_0x1a2b._0x9i0j)] || process.env.ANTHROPIC_API_KEY;

// Rate limiting storage
const _0x7q8r = new Map();
const _0x9s0t = 5; // max requests per minute
const _0x1u2v = 60000; // 1 minute in ms

// Sanitization functions
const _0x3w4x = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 2000); // Max 2000 chars
};

const _0x5y6z = (ip) => {
  const now = Date.now();
  const key = `rate_${ip}`;
  const requests = _0x7q8r.get(key) || [];
  
  // Clean old requests
  const validRequests = requests.filter(time => now - time < _0x1u2v);
  
  if (validRequests.length >= _0x9s0t) {
    return false;
  }
  
  validRequests.push(now);
  _0x7q8r.set(key, validRequests);
  return true;
};

// Token tracking
let _0xTokenCount = 0;
const _0xTokenRate = 0.000003; // $3 per 1M tokens (approximate)

// App generator core
const _0x7a8b = async (prompt) => {
  const apiKey = _0x5o6p();
  if (!apiKey) {
    throw new Error('API configuration missing');
  }

  const endpoint = _0x1a2b._0x1k2l + _0x3m4n(_0x1a2b._0x5e6f);
  
  const systemPrompt = `You are an expert web developer. Generate a complete, functional React component for a Next.js page based on the user's description. 

REQUIREMENTS:
1. Return ONLY valid JSX/React code for a complete page component
2. Use Tailwind CSS for styling (assume it's available)
3. Include all necessary React hooks (useState, useEffect, etc.)
4. Make it responsive and mobile-friendly
5. Add proper form validation and error handling where needed
6. Include interactive features when relevant
7. Use modern React patterns and best practices
8. NO external libraries except React built-ins
9. Include proper accessibility features
10. Add smooth animations and transitions

The component should be self-contained and immediately functional. Start directly with the component code.

Generate clean, production-ready code based on this request: "${prompt}"`;

  try {
    const response = await fetch(endpoint + '/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: _0x3m4n(_0x1a2b._0x7g8h),
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: systemPrompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid API response');
    }

    // Track tokens
    if (data.usage && data.usage.input_tokens && data.usage.output_tokens) {
      _0xTokenCount += data.usage.input_tokens + data.usage.output_tokens;
    }

    return {
      code: data.content[0].text,
      usage: data.usage
    };
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

// App metadata generator
const _0x9c0d = (prompt) => {
  const words = prompt.split(' ').slice(0, 5);
  const name = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    name: name || 'Mi App Web',
    description: prompt.slice(0, 150) + (prompt.length > 150 ? '...' : ''),
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    timestamp: new Date().toISOString()
  };
};

// Code validation and cleanup
const _0x1e2f = (code) => {
  // Remove potential security risks
  const dangerous = [
    'eval(',
    'Function(',
    'document.write',
    'innerHTML',
    'dangerouslySetInnerHTML',
    'script>',
    'javascript:',
    'data:text/html'
  ];
  
  let cleanCode = code;
  dangerous.forEach(risk => {
    cleanCode = cleanCode.replace(new RegExp(risk, 'gi'), '');
  });
  
  // Ensure proper component structure
  if (!cleanCode.includes('export default') && !cleanCode.includes('export {')) {
    cleanCode = `export default function GeneratedApp() {\n  return (\n    <div>\n${cleanCode}\n    </div>\n  );\n}`;
  }
  
  return cleanCode;
};

// In-memory storage for generated apps
const _0x3g4h = (id, code, metadata) => {
  const cleanCode = _0x1e2f(code);
  
  // Format code with metadata (no file creation)
  const formattedCode = `// Generated App: ${metadata.name}
// Created: ${metadata.timestamp}
// Description: ${metadata.description}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';

${cleanCode}
`;
  
  // Return code and metadata (no filesystem operations)
  return {
    code: formattedCode,
    cleanCode: cleanCode,
    success: true
  };
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!_0x5y6z(clientIP)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait before making another request.' 
      });
    }

    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt provided' });
    }

    const sanitizedPrompt = _0x3w4x(prompt);
    
    if (sanitizedPrompt.length < 10) {
      return res.status(400).json({ 
        error: 'Prompt too short. Please provide a more detailed description.' 
      });
    }

    // Generate app metadata
    const metadata = _0x9c0d(sanitizedPrompt);
    
    // Generate code using AI
    const { code, usage } = await _0x7a8b(sanitizedPrompt);
    
    // Process code in memory (no filesystem)
    const processedCode = _0x3g4h(metadata.id, code, metadata);
    
    // Calculate cost
    const estimatedCost = (_0xTokenCount * _0xTokenRate).toFixed(4);
    
    // Log (without sensitive data)
    console.log(`Generated app: ${metadata.id}, Tokens: ${_0xTokenCount}, Cost: $${estimatedCost}`);
    
    return res.status(200).json({
      ...metadata,
      code: processedCode.cleanCode,
      formattedCode: processedCode.code,
      cost: `$${estimatedCost}`,
      tokensUsed: _0xTokenCount,
      success: true
    });
    
  } catch (error) {
    console.error('Generation error:', error.message);
    
    return res.status(500).json({ 
      error: 'Failed to generate application. Please try again with a different prompt.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}