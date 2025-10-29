import { API_KEYS } from '../../lib/api-config';
import { updateTokenUsage, hasBalance } from '../../lib/token-tracker';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory, documentType, currentData } = req.body;

  if (!message || !documentType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verificar que el tipo sea válido
  if (documentType !== 'policy' && documentType !== 'process') {
    return res.status(400).json({ error: 'Invalid document type' });
  }

  // Usar API key del servidor
  const apiKey = API_KEYS.claude;
  if (!apiKey) {
    return res.status(500).json({ error: 'Claude API not configured' });
  }

  // Verificar saldo
  if (!hasBalance('claude', 0.05)) {
    return res.status(402).json({ error: 'Insufficient balance for Claude API' });
  }

  try {
    // Construir el system prompt según el tipo de documento
    const systemPrompt = documentType === 'policy'
      ? buildPolicySystemPrompt(currentData)
      : buildProcessSystemPrompt(currentData);

    // Construir historial de mensajes
    const messages = [];

    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    messages.push({
      role: 'user',
      content: message
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: messages
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

      // Intentar extraer datos estructurados si el mensaje indica que está completo
      const extractedData = extractStructuredData(content, documentType);

      return res.status(200).json({
        content,
        extractedData: extractedData.isComplete ? extractedData.data : null,
        isComplete: extractedData.isComplete,
        usage: tokenStats,
        model: 'claude-3-5-sonnet-20241022'
      });
    } else {
      return res.status(500).json({ error: 'Unexpected response format from Claude' });
    }

  } catch (error) {
    console.error('Proc assistant API error:', error);

    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

function buildPolicySystemPrompt(currentData) {
  return `You are an expert policy documentation assistant. Your role is to help users create comprehensive and well-structured organizational policies through a conversational interview process.

CURRENT DOCUMENT DATA:
${JSON.stringify(currentData, null, 2)}

POLICY STRUCTURE REQUIRED:
1. **Objective** (objetivo): Clear statement of what the policy aims to achieve
2. **Scope** (alcance): Who and what is covered by this policy
3. **Responsibles** (responsables): Roles and people responsible for implementation
4. **Principles** (principios): Core principles and guidelines that govern the policy
5. **Additional Documents** (additionalDocs): Related documents, references, or appendices (optional)

YOUR APPROACH:
- Be conversational, friendly, and professional in Spanish
- Ask ONE clear question at a time
- Listen to the user's responses and adapt your questions
- If information is vague, ask clarifying questions
- Provide examples when helpful
- Suggest improvements based on best practices
- When you have gathered ALL required information, present a summary in this EXACT format:

---COMPLETE---
OBJECTIVE: [extracted objective]
SCOPE: [extracted scope]
RESPONSIBLES: [extracted responsibles]
PRINCIPLES: [extracted principles]
ADDITIONAL_DOCS: [extracted additional docs or leave empty]
---END---

IMPORTANT:
- Only include the ---COMPLETE--- marker when ALL required fields are filled
- Be thorough but efficient
- Help the user think through important aspects they might miss
- Use clear, professional language suitable for official documentation`;
}

function buildProcessSystemPrompt(currentData) {
  return `You are an expert process documentation assistant. Your role is to help users create clear and actionable process documentation through a conversational interview process.

CURRENT DOCUMENT DATA:
${JSON.stringify(currentData, null, 2)}

PROCESS STRUCTURE REQUIRED:
1. **Objective** (objetivo): Clear statement of what the process aims to achieve
2. **Scope** (alcance): What activities and areas are covered by this process
3. **Responsibles** (responsables): Roles and people responsible for executing the process
4. **Steps** (steps): Detailed step-by-step instructions for executing the process
5. **Indicators** (indicators): Metrics and KPIs to measure process success
6. **Additional Documents** (additionalDocs): Related documents, templates, or references (optional)

YOUR APPROACH:
- Be conversational, friendly, and professional in Spanish
- Ask ONE clear question at a time
- Listen to the user's responses and adapt your questions
- If information is vague, ask clarifying questions
- Help break down complex processes into clear steps
- Suggest relevant KPIs and metrics
- When you have gathered ALL required information, present a summary in this EXACT format:

---COMPLETE---
OBJECTIVE: [extracted objective]
SCOPE: [extracted scope]
RESPONSIBLES: [extracted responsibles]
STEPS: [extracted steps, numbered clearly]
INDICATORS: [extracted indicators and metrics]
ADDITIONAL_DOCS: [extracted additional docs or leave empty]
---END---

IMPORTANT:
- Only include the ---COMPLETE--- marker when ALL required fields are filled
- Be thorough but efficient
- Help the user think through important aspects they might miss
- Use clear, professional language suitable for official documentation
- Ensure steps are actionable and sequential`;
}

function extractStructuredData(content, documentType) {
  // Buscar el marcador de completitud
  if (!content.includes('---COMPLETE---') || !content.includes('---END---')) {
    return { isComplete: false, data: null };
  }

  try {
    const startMarker = '---COMPLETE---';
    const endMarker = '---END---';
    const startIndex = content.indexOf(startMarker) + startMarker.length;
    const endIndex = content.indexOf(endMarker);
    const dataSection = content.substring(startIndex, endIndex).trim();

    const data = {
      objective: '',
      scope: '',
      responsibles: '',
      additionalDocs: ''
    };

    // Extraer campos comunes
    const objectiveMatch = dataSection.match(/OBJECTIVE:\s*(.+?)(?=\n[A-Z_]+:|$)/s);
    const scopeMatch = dataSection.match(/SCOPE:\s*(.+?)(?=\n[A-Z_]+:|$)/s);
    const responsiblesMatch = dataSection.match(/RESPONSIBLES:\s*(.+?)(?=\n[A-Z_]+:|$)/s);
    const additionalDocsMatch = dataSection.match(/ADDITIONAL_DOCS:\s*(.+?)(?=\n[A-Z_]+:|$)/s);

    if (objectiveMatch) data.objective = objectiveMatch[1].trim();
    if (scopeMatch) data.scope = scopeMatch[1].trim();
    if (responsiblesMatch) data.responsibles = responsiblesMatch[1].trim();
    if (additionalDocsMatch) data.additionalDocs = additionalDocsMatch[1].trim();

    // Campos específicos por tipo
    if (documentType === 'policy') {
      const principlesMatch = dataSection.match(/PRINCIPLES:\s*(.+?)(?=\n[A-Z_]+:|$)/s);
      if (principlesMatch) data.principles = principlesMatch[1].trim();
    } else if (documentType === 'process') {
      const stepsMatch = dataSection.match(/STEPS:\s*(.+?)(?=\n[A-Z_]+:|$)/s);
      const indicatorsMatch = dataSection.match(/INDICATORS:\s*(.+?)(?=\n[A-Z_]+:|$)/s);
      if (stepsMatch) data.steps = stepsMatch[1].trim();
      if (indicatorsMatch) data.indicators = indicatorsMatch[1].trim();
    }

    // Verificar que los campos requeridos no estén vacíos
    const hasRequiredFields = data.objective && data.scope && data.responsibles;
    const hasTypeSpecificFields = documentType === 'policy'
      ? data.principles
      : (data.steps && data.indicators);

    if (hasRequiredFields && hasTypeSpecificFields) {
      return { isComplete: true, data };
    }

    return { isComplete: false, data: null };
  } catch (error) {
    console.error('Error extracting structured data:', error);
    return { isComplete: false, data: null };
  }
}
