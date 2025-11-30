import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// LLM configurations with Vercel AI Gateway model IDs and pricing
const LLM_CONFIG = {
  claude: {
    name: 'Claude Sonnet 4.5',
    modelId: 'anthropic/claude-sonnet-4.5',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    icon: '🧠',
    description: 'Anthropic - Reasoning & Analysis',
    context: '200K',
    inputPrice: 0.003,
    outputPrice: 0.015
  },
  gpt: {
    name: 'GPT-5.1 Think',
    modelId: 'openai/gpt-5.1-thinking',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    icon: '🤖',
    description: 'OpenAI - General Intelligence',
    context: '400K',
    inputPrice: 0.00125,
    outputPrice: 0.010
  },
  gemini: {
    name: 'Gemini 3 Pro',
    modelId: 'google/gemini-3-pro-preview',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: '✨',
    description: 'Google - Creative & Multimodal',
    context: '1M',
    inputPrice: 0.002,
    outputPrice: 0.012
  },
  perplexity: {
    name: 'Sonar Pro',
    modelId: 'perplexity/sonar-pro',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: '🔍',
    description: 'Real-time Search & Facts',
    context: '200K',
    inputPrice: 0.003,
    outputPrice: 0.015
  },
  deepseek: {
    name: 'DeepSeek v3.2',
    modelId: 'deepseek/deepseek-v3.2-exp-thinking',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    icon: '🌊',
    description: 'Deep Analysis & Reasoning',
    context: '164K',
    inputPrice: 0.00028,
    outputPrice: 0.00042
  },
  grok: {
    name: 'Grok 4.1',
    modelId: 'xai/grok-4.1-fast-reasoning',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    icon: '⚡',
    description: 'xAI - Fast Reasoning',
    context: '2M',
    inputPrice: 0.0002,
    outputPrice: 0.0005
  },
  kimi: {
    name: 'Kimi K2',
    modelId: 'moonshotai/kimi-k2-thinking',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.1)',
    icon: '🌙',
    description: 'Moonshot AI - Thinking',
    context: '262K',
    inputPrice: 0.0006,
    outputPrice: 0.0025
  }
};

// Response modes
const RESPONSE_MODES = {
  single: {
    id: 'single',
    name: 'Individual',
    icon: '👤',
    description: 'Respuesta de un solo LLM'
  },
  group: {
    id: 'group',
    name: 'Grupal Supervisada',
    icon: '👥',
    description: 'Todas las LLMs + Claude integra'
  }
};

// Session storage key for auth
const AUTH_KEY = 'pixan_test_auth';

export default function LLMValidationTest() {
  // State
  const [prompt, setPrompt] = useState('');
  const [selectedLLM, setSelectedLLM] = useState('claude');
  const [responseMode, setResponseMode] = useState('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [currentLLM, setCurrentLLM] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState('');
  const [showLLMSelector, setShowLLMSelector] = useState(false);
  const [generateInfographic, setGenerateInfographic] = useState(true);
  
  // Token tracking
  const [sessionTokens, setSessionTokens] = useState({ input: 0, output: 0 });
  const [sessionCost, setSessionCost] = useState(0);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const authInputRef = useRef(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      setIsAuthenticated(true);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  // Focus auth input when modal shows
  useEffect(() => {
    if (showAuthModal && authInputRef.current) {
      authInputRef.current.focus();
    }
  }, [showAuthModal]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // Estimate tokens from text
  const estimateTokens = (text) => Math.ceil((text || '').length / 4);

  // Calculate cost for a model
  const calculateCost = (inputTokens, outputTokens, llmKey) => {
    const config = LLM_CONFIG[llmKey];
    if (!config) return 0;
    const inputCost = (inputTokens / 1000) * config.inputPrice;
    const outputCost = (outputTokens / 1000) * config.outputPrice;
    return inputCost + outputCost;
  };

  // Handle authentication
  const handleAuth = async (e) => {
    e?.preventDefault();
    if (!authPassword.trim() || isAuthenticating) return;

    setIsAuthenticating(true);
    setAuthError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-password': authPassword
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4.5',
          messages: [{ role: 'user', content: 'test' }]
        })
      });

      if (response.status === 401) {
        setAuthError('Contraseña incorrecta');
        setAuthPassword('');
        return;
      }

      sessionStorage.setItem(AUTH_KEY, authPassword);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      inputRef.current?.focus();
    } catch (error) {
      setAuthError('Error de conexión');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getAuthPassword = () => sessionStorage.getItem(AUTH_KEY) || '';

  // Build context-aware system prompt
  const buildSystemPrompt = (llmKey, isGroupMode, willGenerateInfographic) => {
    const contextParts = [];
    
    contextParts.push(`Eres ${LLM_CONFIG[llmKey].name}, un asistente experto.`);
    
    if (isGroupMode) {
      contextParts.push('CONTEXTO: Esta es una consulta GRUPAL SUPERVISADA donde múltiples LLMs responden al mismo prompt. Tu respuesta será integrada junto con las de otros modelos por Claude al final.');
      contextParts.push('Enfócate en tu perspectiva única y fortalezas. No necesitas ser exhaustivo - otros LLMs complementarán tu respuesta.');
    }
    
    if (willGenerateInfographic) {
      contextParts.push('NOTA: El usuario ha solicitado que la respuesta final se convierta en una INFOGRAFÍA visual usando Nano Banana Pro. Estructura tu respuesta de forma clara con puntos clave que se puedan visualizar fácilmente.');
    }
    
    return contextParts.join('\n\n');
  };

  // Call LLM API via AI Gateway with streaming
  const callLLM = async (llmKey, message, systemPrompt, onStream) => {
    const modelId = LLM_CONFIG[llmKey].modelId;
    
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: message });
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-password': getAuthPassword()
      },
      body: JSON.stringify({
        model: modelId,
        messages
      })
    });

    if (response.status === 401) {
      sessionStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
      setShowAuthModal(true);
      throw new Error('Sesión expirada. Por favor autentícate nuevamente.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `${LLM_CONFIG[llmKey].name} API Error`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullContent += parsed.content;
              if (onStream) onStream(fullContent);
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }

    return fullContent;
  };

  // Generate infographic using Nano Banana Pro
  const generateInfographicImage = async (content, question) => {
    const response = await fetch('/api/generate-infographic', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-password': getAuthPassword()
      },
      body: JSON.stringify({
        prompt: content,
        context: { question }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error generating infographic');
    }

    return await response.json();
  };

  // Track token usage
  const trackTokens = (inputText, outputText, llmKey) => {
    const inputTokens = estimateTokens(inputText);
    const outputTokens = estimateTokens(outputText);
    const cost = calculateCost(inputTokens, outputTokens, llmKey);
    
    setSessionTokens(prev => ({
      input: prev.input + inputTokens,
      output: prev.output + outputTokens
    }));
    setSessionCost(prev => prev + cost);
    
    return { inputTokens, outputTokens, cost };
  };

  // Handle SINGLE mode submission
  const handleSingleMode = async (userMessage) => {
    const systemPrompt = buildSystemPrompt(selectedLLM, false, generateInfographic);
    
    setCurrentPhase('responding');
    setCurrentLLM(selectedLLM);
    setStreamingText('');

    const result = await callLLM(selectedLLM, userMessage, systemPrompt, setStreamingText);
    const tokenInfo = trackTokens(userMessage, result, selectedLLM);

    setMessages(prev => [...prev, {
      type: 'llm',
      llm: selectedLLM,
      content: result,
      phase: 'single',
      tokens: tokenInfo,
      timestamp: new Date()
    }]);

    return result;
  };

  // Handle GROUP mode submission
  const handleGroupMode = async (userMessage) => {
    const llmKeys = Object.keys(LLM_CONFIG);
    const responses = {};

    // Phase 1: Get responses from all LLMs in parallel
    setCurrentPhase('group-collecting');
    
    for (const llmKey of llmKeys) {
      setCurrentLLM(llmKey);
      setStreamingText('');
      
      const systemPrompt = buildSystemPrompt(llmKey, true, generateInfographic);
      
      try {
        const result = await callLLM(llmKey, userMessage, systemPrompt, setStreamingText);
        responses[llmKey] = result;
        const tokenInfo = trackTokens(userMessage, result, llmKey);
        
        setMessages(prev => [...prev, {
          type: 'llm',
          llm: llmKey,
          content: result,
          phase: 'group-response',
          tokens: tokenInfo,
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error(`Error with ${llmKey}:`, error);
        responses[llmKey] = `Error: ${error.message}`;
        
        setMessages(prev => [...prev, {
          type: 'error',
          llm: llmKey,
          content: `${LLM_CONFIG[llmKey].name}: ${error.message}`,
          timestamp: new Date()
        }]);
      }
    }

    // Phase 2: Claude integrates all responses
    setCurrentPhase('integrating');
    setCurrentLLM('claude');
    setStreamingText('');

    const integrationPrompt = `Eres Claude, el supervisor de esta consulta grupal. Múltiples LLMs han respondido al siguiente prompt del usuario. Tu tarea es INTEGRAR y SINTETIZAR todas las respuestas en una respuesta final coherente y completa.

PREGUNTA ORIGINAL DEL USUARIO:
"${userMessage}"

RESPUESTAS DE LOS DIFERENTES LLMs:

${Object.entries(responses).map(([key, response]) => `
### ${LLM_CONFIG[key].name} (${LLM_CONFIG[key].icon}):
${response}
`).join('\n---\n')}

TU TAREA:
1. Identifica los puntos clave en los que TODOS coinciden
2. Destaca perspectivas únicas valiosas de cada LLM
3. Resuelve cualquier contradicción entre respuestas
4. Sintetiza todo en una respuesta FINAL integrada

${generateInfographic ? 'NOTA: Tu respuesta será convertida en una infografía visual, así que estructura los puntos de forma clara y visual.' : ''}

Responde con:
- 🔄 CONSENSO: (puntos en común)
- 💡 INSIGHTS ÚNICOS: (aportes valiosos de cada LLM)
- ⚖️ RESOLUCIÓN: (si hubo contradicciones)
- 🎯 RESPUESTA INTEGRADA FINAL: (síntesis completa)`;

    const integrationResult = await callLLM('claude', integrationPrompt, null, setStreamingText);
    const integrationTokens = trackTokens(integrationPrompt, integrationResult, 'claude');

    setMessages(prev => [...prev, {
      type: 'llm',
      llm: 'claude',
      content: integrationResult,
      phase: 'integration',
      tokens: integrationTokens,
      timestamp: new Date()
    }]);

    return integrationResult;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || isProcessing || !isAuthenticated) return;

    const userMessage = prompt;
    setPrompt('');
    setIsProcessing(true);

    // Add user message to chat
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      mode: responseMode,
      timestamp: new Date()
    }]);

    try {
      let finalResult;

      if (responseMode === 'single') {
        finalResult = await handleSingleMode(userMessage);
      } else {
        finalResult = await handleGroupMode(userMessage);
      }

      // Generate infographic if enabled
      if (generateInfographic && finalResult) {
        setCurrentPhase('infographic');
        setCurrentLLM(null);
        setStreamingText('Generando infografía con Nano Banana Pro...');

        try {
          const infographicResult = await generateInfographicImage(finalResult, userMessage);

          if (infographicResult.images && infographicResult.images.length > 0) {
            setMessages(prev => [...prev, {
              type: 'infographic',
              content: infographicResult.text || 'Infografía generada exitosamente',
              images: infographicResult.images,
              timestamp: new Date()
            }]);
          }
        } catch (infographicError) {
          console.error('Infographic error:', infographicError);
          setMessages(prev => [...prev, {
            type: 'error',
            content: `Error al generar infografía: ${infographicError.message}`,
            timestamp: new Date()
          }]);
        }
      }

      setCurrentPhase('complete');

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
      setCurrentPhase(null);
      setCurrentLLM(null);
      setStreamingText('');
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionTokens({ input: 0, output: 0 });
    setSessionCost(0);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setShowAuthModal(true);
    setMessages([]);
  };

  const downloadImage = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `infographic-${Date.now()}-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LLM Selector dropdown
  const LLMSelector = ({ selected, onSelect }) => {
    return (
      <div className="llm-selector-dropdown">
        {Object.entries(LLM_CONFIG).map(([key, config]) => (
          <button
            key={key}
            className={`llm-option ${selected === key ? 'selected' : ''}`}
            onClick={() => {
              onSelect(key);
              setShowLLMSelector(false);
            }}
            style={{ '--llm-color': config.color }}
          >
            <span className="llm-icon">{config.icon}</span>
            <div className="llm-info">
              <span className="llm-name">{config.name}</span>
              <span className="llm-desc">{config.description}</span>
              <span className="llm-pricing">
                {config.context} • ${config.inputPrice}/${config.outputPrice} per 1K
              </span>
            </div>
            {selected === key && <span className="check">✓</span>}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>LLM Validation Test | Pixan.ai</title>
        <meta name="description" content="Test LLM responses with validation and infographic generation" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          color: #ffffff;
          min-height: 100vh;
        }
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Auth Modal */
        .auth-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; backdrop-filter: blur(8px);
        }
        .auth-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px; padding: 40px;
          max-width: 400px; width: 90%; text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .auth-logo { font-size: 48px; margin-bottom: 16px; }
        .auth-title {
          font-size: 24px; font-weight: 700; margin-bottom: 8px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .auth-subtitle { color: rgba(255, 255, 255, 0.6); margin-bottom: 24px; font-size: 14px; }
        .auth-input {
          width: 100%; padding: 16px 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px; color: #fff; font-size: 16px;
          outline: none; transition: all 0.2s; margin-bottom: 16px;
        }
        .auth-input:focus { border-color: #8b5cf6; background: rgba(255, 255, 255, 0.1); }
        .auth-button {
          width: 100%; padding: 16px 32px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          border: none; border-radius: 12px; color: #fff;
          font-weight: 600; font-size: 16px; cursor: pointer; transition: all 0.2s;
        }
        .auth-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4); }
        .auth-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-error {
          color: #ef4444; font-size: 14px; margin-bottom: 16px;
          padding: 12px; background: rgba(239, 68, 68, 0.1); border-radius: 8px;
        }

        /* Header */
        .header {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 20px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 20px; gap: 20px; flex-wrap: wrap;
        }
        .header-left { display: flex; align-items: center; gap: 16px; }
        .back-button {
          background: rgba(255, 255, 255, 0.1); border: none; color: #fff;
          padding: 8px 16px; border-radius: 8px; cursor: pointer;
          font-size: 14px; transition: all 0.2s; text-decoration: none;
        }
        .back-button:hover { background: rgba(255, 255, 255, 0.2); }
        .logo {
          font-size: 24px; font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .subtitle { font-size: 14px; color: rgba(255, 255, 255, 0.6); }

        /* Token Stats Box */
        .token-stats {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px; padding: 12px 16px;
          text-align: right; min-width: 180px;
        }
        .token-stats-title { font-size: 10px; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 1px; }
        .token-stats-main { font-size: 18px; font-weight: 600; color: #10b981; }
        .token-stats-detail { font-size: 11px; color: rgba(255, 255, 255, 0.4); margin-top: 4px; }
        .logout-button {
          background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5; padding: 8px 16px; border-radius: 8px;
          cursor: pointer; font-size: 12px; transition: all 0.2s; margin-top: 8px;
        }
        .logout-button:hover { background: rgba(239, 68, 68, 0.3); }

        /* Controls Bar */
        .controls-bar {
          display: flex; align-items: stretch; gap: 16px;
          padding: 16px; background: rgba(255, 255, 255, 0.05);
          border-radius: 16px; margin-bottom: 20px; flex-wrap: wrap;
        }

        /* Mode Selector */
        .mode-selector {
          display: flex; gap: 8px;
          background: rgba(0, 0, 0, 0.2); border-radius: 12px; padding: 4px;
        }
        .mode-button {
          padding: 12px 20px; border: none; border-radius: 10px;
          background: transparent; color: rgba(255, 255, 255, 0.6);
          cursor: pointer; transition: all 0.2s; font-size: 13px;
          display: flex; align-items: center; gap: 8px;
        }
        .mode-button.active {
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          color: #fff; font-weight: 600;
        }
        .mode-button:hover:not(.active) { background: rgba(255, 255, 255, 0.1); }

        /* LLM Selector */
        .llm-selector-container { position: relative; flex: 1; min-width: 280px; }
        .llm-selector-label {
          font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.5); margin-bottom: 6px;
        }
        .llm-selector-button {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; background: rgba(255, 255, 255, 0.08);
          border: 2px solid var(--llm-color, rgba(255, 255, 255, 0.2));
          border-radius: 12px; cursor: pointer; width: 100%;
          transition: all 0.2s; color: #fff;
        }
        .llm-selector-button:hover { background: rgba(255, 255, 255, 0.12); }
        .llm-selector-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .llm-selector-dropdown {
          position: absolute; top: 100%; left: 0; right: 0;
          background: #1a1a2e; border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px; margin-top: 8px; padding: 8px;
          z-index: 100; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          max-height: 400px; overflow-y: auto;
        }
        .llm-option {
          display: flex; align-items: center; gap: 12px;
          padding: 12px; background: transparent; border: none;
          color: #fff; width: 100%; cursor: pointer;
          border-radius: 8px; transition: all 0.2s; text-align: left;
        }
        .llm-option:hover { background: rgba(255, 255, 255, 0.1); }
        .llm-option.selected { background: var(--llm-color); }
        .llm-icon { font-size: 24px; }
        .llm-info { flex: 1; }
        .llm-name { display: block; font-weight: 600; font-size: 14px; }
        .llm-desc { display: block; font-size: 11px; color: rgba(255, 255, 255, 0.6); }
        .llm-pricing { display: block; font-size: 10px; color: rgba(255, 255, 255, 0.4); margin-top: 2px; }
        .check { color: #10b981; font-weight: bold; }

        /* Toggle */
        .toggle-container {
          display: flex; align-items: center; gap: 12px;
          padding: 8px 16px; background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
        }
        .toggle-label {
          font-size: 12px; color: rgba(255, 255, 255, 0.7);
          display: flex; align-items: center; gap: 8px;
        }
        .toggle-switch {
          position: relative; width: 44px; height: 24px;
          background: rgba(255, 255, 255, 0.2); border-radius: 12px;
          cursor: pointer; transition: all 0.3s;
        }
        .toggle-switch.active { background: linear-gradient(135deg, #f59e0b, #eab308); }
        .toggle-switch::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 20px; height: 20px; background: white;
          border-radius: 50%; transition: all 0.3s;
        }
        .toggle-switch.active::after { left: 22px; }

        /* Chat Area */
        .chat-area {
          flex: 1; overflow-y: auto; padding: 20px;
          display: flex; flex-direction: column; gap: 20px;
          min-height: 300px; max-height: calc(100vh - 400px);
        }
        .message { max-width: 90%; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          padding: 16px 20px; border-radius: 20px 20px 4px 20px;
        }
        .message.llm, .message.infographic { align-self: flex-start; width: 100%; }
        .message.error {
          align-self: flex-start;
          background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444;
          padding: 12px 16px; border-radius: 12px; color: #fca5a5;
        }

        .llm-message-container { display: flex; flex-direction: column; gap: 10px; }
        .llm-header { display: flex; align-items: center; gap: 12px; }
        .llm-avatar {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; background: var(--llm-bg); border: 2px solid var(--llm-color);
        }
        .llm-meta { display: flex; flex-direction: column; }
        .llm-meta .name { font-weight: 600; font-size: 14px; color: var(--llm-color); }
        .llm-meta .phase { font-size: 11px; color: rgba(255, 255, 255, 0.5); }
        .llm-meta .tokens-info { font-size: 10px; color: rgba(255, 255, 255, 0.4); }
        .llm-content {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px 16px 16px 16px; padding: 16px;
          white-space: pre-wrap; line-height: 1.6; font-size: 14px;
        }

        /* Infographic */
        .infographic-container {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(234, 179, 8, 0.05));
          border: 2px solid rgba(245, 158, 11, 0.3);
          border-radius: 20px; padding: 24px;
        }
        .infographic-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .infographic-avatar {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; background: rgba(245, 158, 11, 0.2); border: 2px solid #f59e0b;
        }
        .infographic-meta .name { font-weight: 600; font-size: 16px; color: #f59e0b; }
        .infographic-meta .phase { font-size: 12px; color: rgba(255, 255, 255, 0.5); }
        .infographic-images { display: flex; flex-direction: column; gap: 16px; }
        .infographic-image-wrapper { position: relative; border-radius: 12px; overflow: hidden; background: #000; }
        .infographic-image { width: 100%; height: auto; display: block; }
        .download-button {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0, 0, 0, 0.7); border: none; color: #fff;
          padding: 8px 16px; border-radius: 8px; cursor: pointer;
          font-size: 12px; display: flex; align-items: center; gap: 6px;
          transition: all 0.2s;
        }
        .download-button:hover { background: rgba(0, 0, 0, 0.9); }

        /* Processing */
        .processing-indicator {
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; padding: 32px;
        }
        .processing-status {
          font-size: 14px; color: rgba(255, 255, 255, 0.8);
          display: flex; align-items: center; gap: 8px;
        }
        .spinner {
          width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #8b5cf6; border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .streaming-preview {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px; padding: 16px; max-width: 700px;
          max-height: 200px; overflow-y: auto; font-size: 13px;
          color: rgba(255, 255, 255, 0.8); white-space: pre-wrap;
        }

        /* Input Area */
        .input-area {
          padding: 20px; background: rgba(255, 255, 255, 0.05);
          border-radius: 20px; margin-top: auto;
        }
        .input-container { display: flex; gap: 12px; }
        .input-wrapper { flex: 1; }
        .prompt-input {
          width: 100%; padding: 16px 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px; color: #fff; font-size: 16px;
          resize: none; outline: none; transition: all 0.2s;
          min-height: 56px; max-height: 150px;
        }
        .prompt-input:focus { border-color: #8b5cf6; background: rgba(255, 255, 255, 0.1); }
        .prompt-input::placeholder { color: rgba(255, 255, 255, 0.4); }
        .send-button {
          padding: 16px 32px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          border: none; border-radius: 16px; color: #fff;
          font-weight: 600; font-size: 16px; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; gap: 8px;
        }
        .send-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4); }
        .send-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .clear-button {
          padding: 16px; background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px; color: #fca5a5; cursor: pointer; transition: all 0.2s;
        }
        .clear-button:hover { background: rgba(239, 68, 68, 0.3); }

        /* Empty State */
        .empty-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 40px;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
        .empty-description {
          font-size: 14px; color: rgba(255, 255, 255, 0.6);
          max-width: 500px; line-height: 1.6;
        }

        /* User message mode badge */
        .mode-badge {
          font-size: 10px; background: rgba(255,255,255,0.2);
          padding: 2px 8px; border-radius: 10px; margin-bottom: 8px;
          display: inline-block;
        }

        @media (max-width: 768px) {
          .controls-bar { flex-direction: column; }
          .mode-selector { width: 100%; justify-content: center; }
          .llm-selector-container { min-width: 100%; }
          .chat-area { max-height: calc(100vh - 500px); }
          .header { flex-direction: column; align-items: flex-start; }
          .token-stats { align-self: flex-end; }
        }
      `}</style>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <div className="auth-logo">🔐</div>
            <div className="auth-title">LLM Validation Test</div>
            <div className="auth-subtitle">Ingresa la contraseña para continuar</div>
            {authError && <div className="auth-error">{authError}</div>}
            <form onSubmit={handleAuth}>
              <input
                ref={authInputRef}
                type="password"
                className="auth-input"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Contraseña"
                disabled={isAuthenticating}
              />
              <button type="submit" className="auth-button" disabled={!authPassword.trim() || isAuthenticating}>
                {isAuthenticating ? '⏳ Verificando...' : '🚀 Entrar'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <a href="/" className="back-button">← Back</a>
            <div>
              <div className="logo">LLM Validation Test</div>
              <div className="subtitle">Individual o Grupal Supervisada + Infografías</div>
            </div>
          </div>
          
          {/* Token Stats */}
          <div className="token-stats">
            <div className="token-stats-title">Session Cost</div>
            <div className="token-stats-main">${sessionCost.toFixed(6)}</div>
            <div className="token-stats-detail">
              {sessionTokens.input.toLocaleString()} in / {sessionTokens.output.toLocaleString()} out tokens
            </div>
            {isAuthenticated && (
              <button className="logout-button" onClick={handleLogout}>🚪 Salir</button>
            )}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="controls-bar">
          {/* Mode Selector */}
          <div className="mode-selector">
            {Object.entries(RESPONSE_MODES).map(([key, mode]) => (
              <button
                key={key}
                className={`mode-button ${responseMode === key ? 'active' : ''}`}
                onClick={() => setResponseMode(key)}
                disabled={isProcessing}
              >
                <span>{mode.icon}</span>
                <span>{mode.name}</span>
              </button>
            ))}
          </div>

          {/* LLM Selector (only for single mode) */}
          {responseMode === 'single' && (
            <div className="llm-selector-container">
              <div className="llm-selector-label">LLM para responder</div>
              <button
                className="llm-selector-button"
                style={{ '--llm-color': LLM_CONFIG[selectedLLM].color }}
                onClick={() => setShowLLMSelector(!showLLMSelector)}
                disabled={isProcessing}
              >
                <span className="llm-icon">{LLM_CONFIG[selectedLLM].icon}</span>
                <div className="llm-info">
                  <span className="llm-name">{LLM_CONFIG[selectedLLM].name}</span>
                  <span className="llm-pricing">
                    {LLM_CONFIG[selectedLLM].context} • ${LLM_CONFIG[selectedLLM].inputPrice}/${LLM_CONFIG[selectedLLM].outputPrice}
                  </span>
                </div>
                <span>▼</span>
              </button>
              {showLLMSelector && <LLMSelector selected={selectedLLM} onSelect={setSelectedLLM} />}
            </div>
          )}

          {responseMode === 'group' && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                👥 Todas las {Object.keys(LLM_CONFIG).length} LLMs responderán → Claude integra
              </span>
            </div>
          )}

          {/* Infographic Toggle */}
          <div className="toggle-container">
            <div className="toggle-label">
              🍌 Infografía
              <div
                className={`toggle-switch ${generateInfographic ? 'active' : ''}`}
                onClick={() => setGenerateInfographic(!generateInfographic)}
              />
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {messages.length === 0 && !isProcessing ? (
            <div className="empty-state">
              <div className="empty-icon">
                {responseMode === 'single' ? '👤' : '👥'}
              </div>
              <div className="empty-title">
                {responseMode === 'single' ? 'Modo Individual' : 'Modo Grupal Supervisado'}
              </div>
              <div className="empty-description">
                {responseMode === 'single' 
                  ? `${LLM_CONFIG[selectedLLM].name} responderá a tu pregunta.`
                  : `Todas las LLMs (${Object.keys(LLM_CONFIG).length} modelos) responderán y Claude integrará todas las perspectivas.`
                }
                {generateInfographic && ' La respuesta final se convertirá en una infografía visual con Nano Banana Pro.'}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.type}`}>
                  {msg.type === 'user' && (
                    <div>
                      <div className="mode-badge">
                        {msg.mode === 'single' ? '👤 Individual' : '👥 Grupal'}
                      </div>
                      <div>{msg.content}</div>
                    </div>
                  )}
                  {msg.type === 'llm' && (
                    <div
                      className="llm-message-container"
                      style={{
                        '--llm-color': LLM_CONFIG[msg.llm].color,
                        '--llm-bg': LLM_CONFIG[msg.llm].bgColor
                      }}
                    >
                      <div className="llm-header">
                        <div className="llm-avatar">{LLM_CONFIG[msg.llm].icon}</div>
                        <div className="llm-meta">
                          <span className="name">{LLM_CONFIG[msg.llm].name}</span>
                          <span className="phase">
                            {msg.phase === 'single' && '👤 Respuesta Individual'}
                            {msg.phase === 'group-response' && '👥 Respuesta Grupal'}
                            {msg.phase === 'integration' && '🔄 Integración Final'}
                          </span>
                          {msg.tokens && (
                            <span className="tokens-info">
                              {msg.tokens.inputTokens}/{msg.tokens.outputTokens} tokens • ${msg.tokens.cost.toFixed(6)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="llm-content">{msg.content}</div>
                    </div>
                  )}
                  {msg.type === 'infographic' && (
                    <div className="infographic-container">
                      <div className="infographic-header">
                        <div className="infographic-avatar">🍌</div>
                        <div className="infographic-meta">
                          <span className="name">Nano Banana Pro</span>
                          <span className="phase">Infografía Generada</span>
                        </div>
                      </div>
                      {msg.content && <p style={{ marginBottom: '16px', opacity: 0.8, fontSize: '14px' }}>{msg.content}</p>}
                      <div className="infographic-images">
                        {msg.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="infographic-image-wrapper">
                            <img src={img.url} alt={`Infographic ${imgIdx + 1}`} className="infographic-image" />
                            <button className="download-button" onClick={() => downloadImage(img.url, imgIdx)}>
                              ⬇️ Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {msg.type === 'error' && !msg.llm && <div>{msg.content}</div>}
                </div>
              ))}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="processing-indicator">
                  <div className="processing-status">
                    <div className="spinner"></div>
                    {currentPhase === 'responding' && currentLLM && (
                      <span>{LLM_CONFIG[currentLLM].icon} {LLM_CONFIG[currentLLM].name} respondiendo...</span>
                    )}
                    {currentPhase === 'group-collecting' && currentLLM && (
                      <span>{LLM_CONFIG[currentLLM].icon} {LLM_CONFIG[currentLLM].name} ({Object.keys(LLM_CONFIG).indexOf(currentLLM) + 1}/{Object.keys(LLM_CONFIG).length})...</span>
                    )}
                    {currentPhase === 'integrating' && (
                      <span>🧠 Claude integrando todas las respuestas...</span>
                    )}
                    {currentPhase === 'infographic' && (
                      <span>🍌 Nano Banana Pro generando infografía...</span>
                    )}
                  </div>
                  {streamingText && currentPhase !== 'infographic' && (
                    <div className="streaming-preview">{streamingText}</div>
                  )}
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-container">
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                className="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={isAuthenticated 
                  ? `Escribe tu pregunta... (${responseMode === 'single' ? LLM_CONFIG[selectedLLM].name : 'Todas las LLMs'})`
                  : 'Autentícate para continuar...'
                }
                disabled={isProcessing || !isAuthenticated}
                rows={1}
              />
            </div>
            {messages.length > 0 && (
              <button type="button" className="clear-button" onClick={clearChat} title="Limpiar chat">
                🗑️
              </button>
            )}
            <button type="submit" className="send-button" disabled={!prompt.trim() || isProcessing || !isAuthenticated}>
              {isProcessing ? '⏳' : '🚀'} {isProcessing ? 'Procesando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
