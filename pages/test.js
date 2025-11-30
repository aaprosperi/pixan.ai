import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// LLM configurations with Vercel AI Gateway model IDs
const LLM_CONFIG = {
  claude: {
    name: 'Claude Sonnet 4.5',
    modelId: 'anthropic/claude-sonnet-4.5',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    icon: '🧠',
    description: 'Anthropic - Reasoning & Analysis'
  },
  gpt: {
    name: 'GPT-5.1',
    modelId: 'openai/gpt-5.1-thinking',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    icon: '🤖',
    description: 'OpenAI - General Intelligence'
  },
  gemini: {
    name: 'Gemini 3 Pro',
    modelId: 'google/gemini-3-pro-preview',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: '✨',
    description: 'Google - Creative & Multimodal'
  },
  perplexity: {
    name: 'Sonar Pro',
    modelId: 'perplexity/sonar-pro',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: '🔍',
    description: 'Real-time Search & Facts'
  },
  deepseek: {
    name: 'DeepSeek v3.2',
    modelId: 'deepseek/deepseek-v3.2-exp-thinking',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    icon: '🌊',
    description: 'Deep Analysis & Reasoning'
  },
  grok: {
    name: 'Grok 4.1',
    modelId: 'xai/grok-4.1-fast-reasoning',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    icon: '⚡',
    description: 'xAI - Fast Reasoning'
  }
};

// Session storage key for auth
const AUTH_KEY = 'pixan_test_auth';

export default function LLMValidationTest() {
  // State
  const [prompt, setPrompt] = useState('');
  const [primaryLLM, setPrimaryLLM] = useState('claude');
  const [validatorLLM, setValidatorLLM] = useState('gpt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState('');
  const [showLLMSelector, setShowLLMSelector] = useState(null);
  
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

  // Handle authentication
  const handleAuth = async (e) => {
    e?.preventDefault();
    if (!authPassword.trim() || isAuthenticating) return;

    setIsAuthenticating(true);
    setAuthError('');

    try {
      // Test the password with a minimal API call
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

      // Auth successful - save to session
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

  // Get stored password
  const getAuthPassword = () => {
    return sessionStorage.getItem(AUTH_KEY) || '';
  };

  // Call LLM API via AI Gateway with streaming
  const callLLM = async (llmKey, message, onStream) => {
    const modelId = LLM_CONFIG[llmKey].modelId;
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-password': getAuthPassword()
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (response.status === 401) {
      // Auth expired or invalid
      sessionStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
      setShowAuthModal(true);
      throw new Error('Sesión expirada. Por favor autentícate nuevamente.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `${LLM_CONFIG[llmKey].name} API Error`);
    }

    // Process streaming response
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
      timestamp: new Date()
    }]);

    try {
      // Phase 1: Primary LLM response
      setCurrentPhase('primary');
      setStreamingText('');

      const primaryResult = await callLLM(primaryLLM, userMessage, setStreamingText);

      // Add primary response to messages
      setMessages(prev => [...prev, {
        type: 'llm',
        llm: primaryLLM,
        content: primaryResult,
        phase: 'primary',
        timestamp: new Date()
      }]);

      // Phase 2: Validator LLM analyzes and completes
      setCurrentPhase('validating');
      setStreamingText('');

      const validationPrompt = `Eres un validador experto. Analiza la siguiente respuesta de ${LLM_CONFIG[primaryLLM].name} a la pregunta del usuario.

PREGUNTA ORIGINAL DEL USUARIO:
"${userMessage}"

RESPUESTA DE ${LLM_CONFIG[primaryLLM].name.toUpperCase()}:
${primaryResult}

TU TAREA:
1. Valida la precisión y completitud de la respuesta
2. Identifica cualquier error o información faltante
3. Complementa con información adicional relevante
4. Proporciona tu análisis final mejorado

Responde de forma estructurada con:
- ✅ VALIDACIÓN: (qué está correcto)
- ⚠️ CORRECCIONES: (si hay errores)
- 📝 COMPLEMENTO: (información adicional)
- 🎯 RESPUESTA FINAL MEJORADA: (síntesis completa)`;

      const validatorResult = await callLLM(validatorLLM, validationPrompt, setStreamingText);

      // Add validator response to messages
      setMessages(prev => [...prev, {
        type: 'llm',
        llm: validatorLLM,
        content: validatorResult,
        phase: 'validator',
        timestamp: new Date()
      }]);

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
      setStreamingText('');
      inputRef.current?.focus();
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setShowAuthModal(true);
    setMessages([]);
  };

  // LLM Selector dropdown component
  const LLMSelector = ({ selected, onSelect, exclude }) => {
    const llms = Object.entries(LLM_CONFIG).filter(([key]) => key !== exclude);

    return (
      <div className="llm-selector-dropdown">
        {llms.map(([key, config]) => (
          <button
            key={key}
            className={`llm-option ${selected === key ? 'selected' : ''}`}
            onClick={() => {
              onSelect(key);
              setShowLLMSelector(null);
            }}
            style={{ '--llm-color': config.color }}
          >
            <span className="llm-icon">{config.icon}</span>
            <div className="llm-info">
              <span className="llm-name">{config.name}</span>
              <span className="llm-desc">{config.description}</span>
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
        <meta name="description" content="Test LLM responses with validation from another AI" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          color: #ffffff;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Auth Modal */
        .auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }

        .auth-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .auth-logo {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .auth-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-subtitle {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 24px;
          font-size: 14px;
        }

        .auth-input {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #fff;
          font-size: 16px;
          outline: none;
          transition: all 0.2s;
          margin-bottom: 16px;
        }

        .auth-input:focus {
          border-color: #8b5cf6;
          background: rgba(255, 255, 255, 0.1);
        }

        .auth-button {
          width: 100%;
          padding: 16px 32px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }

        .auth-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-error {
          color: #ef4444;
          font-size: 14px;
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 8px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          text-decoration: none;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .powered-by {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        .logout-button {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .logout-button:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .llm-selection-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .llm-selector-container {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .llm-selector-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid var(--llm-color, rgba(255, 255, 255, 0.2));
          border-radius: 12px;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
          color: #fff;
        }

        .llm-selector-button:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .llm-selector-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 4px;
        }

        .llm-selector-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          margin-top: 8px;
          padding: 8px;
          z-index: 100;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .llm-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: transparent;
          border: none;
          color: #fff;
          width: 100%;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .llm-option:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .llm-option.selected {
          background: var(--llm-color);
        }

        .llm-icon {
          font-size: 24px;
        }

        .llm-info {
          flex: 1;
          text-align: left;
        }

        .llm-name {
          display: block;
          font-weight: 600;
          font-size: 14px;
        }

        .llm-desc {
          display: block;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }

        .check {
          color: #10b981;
          font-weight: bold;
        }

        .flow-arrow {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.4);
        }

        .chat-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: 400px;
          max-height: calc(100vh - 380px);
        }

        .message {
          max-width: 85%;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          padding: 16px 20px;
          border-radius: 20px 20px 4px 20px;
        }

        .message.llm {
          align-self: flex-start;
        }

        .llm-message-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .llm-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .llm-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background: var(--llm-bg);
          border: 2px solid var(--llm-color);
        }

        .llm-meta {
          display: flex;
          flex-direction: column;
        }

        .llm-meta .name {
          font-weight: 600;
          font-size: 14px;
          color: var(--llm-color);
        }

        .llm-meta .phase {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .llm-content {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px 20px 20px 20px;
          padding: 20px;
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .message.error {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          padding: 16px;
          border-radius: 12px;
          color: #fca5a5;
        }

        .processing-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 40px;
        }

        .flow-visualization {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .flow-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          border-radius: 16px;
          transition: all 0.3s;
        }

        .flow-node.active {
          transform: scale(1.1);
          box-shadow: 0 0 30px var(--node-color);
        }

        .flow-node .icon {
          font-size: 32px;
        }

        .flow-node .label {
          font-size: 12px;
          font-weight: 600;
        }

        .flow-connection {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .flow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          animation: flowPulse 1.5s ease infinite;
        }

        .flow-dot:nth-child(2) { animation-delay: 0.2s; }
        .flow-dot:nth-child(3) { animation-delay: 0.4s; }
        .flow-dot:nth-child(4) { animation-delay: 0.6s; }
        .flow-dot:nth-child(5) { animation-delay: 0.8s; }

        @keyframes flowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .processing-status {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }

        .streaming-preview {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          max-width: 600px;
          max-height: 200px;
          overflow-y: auto;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          white-space: pre-wrap;
        }

        .input-area {
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          margin-top: auto;
        }

        .input-container {
          display: flex;
          gap: 12px;
        }

        .input-wrapper {
          flex: 1;
          position: relative;
        }

        .prompt-input {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: #fff;
          font-size: 16px;
          resize: none;
          outline: none;
          transition: all 0.2s;
          min-height: 56px;
          max-height: 200px;
        }

        .prompt-input:focus {
          border-color: #8b5cf6;
          background: rgba(255, 255, 255, 0.1);
        }

        .prompt-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .send-button {
          padding: 16px 32px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .clear-button {
          padding: 16px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          color: #fca5a5;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-button:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .empty-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          max-width: 400px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .llm-selection-bar {
            flex-direction: column;
          }

          .flow-arrow {
            transform: rotate(90deg);
          }

          .chat-area {
            max-height: calc(100vh - 500px);
          }

          .message {
            max-width: 95%;
          }

          .flow-visualization {
            flex-direction: column;
          }

          .flow-connection {
            flex-direction: column;
          }

          .header-right {
            flex-direction: column;
            gap: 8px;
          }
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
              <button
                type="submit"
                className="auth-button"
                disabled={!authPassword.trim() || isAuthenticating}
              >
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
              <div className="subtitle">Response validation with AI collaboration</div>
            </div>
          </div>
          <div className="header-right">
            <div className="powered-by">
              Powered by Vercel AI Gateway
            </div>
            {isAuthenticated && (
              <button className="logout-button" onClick={handleLogout}>
                🚪 Salir
              </button>
            )}
          </div>
        </div>

        {/* LLM Selection Bar */}
        <div className="llm-selection-bar">
          {/* Primary LLM Selector */}
          <div className="llm-selector-container">
            <div className="llm-selector-label">Primary LLM (Responds First)</div>
            <button
              className="llm-selector-button"
              style={{ '--llm-color': LLM_CONFIG[primaryLLM].color }}
              onClick={() => setShowLLMSelector(showLLMSelector === 'primary' ? null : 'primary')}
            >
              <span className="llm-icon">{LLM_CONFIG[primaryLLM].icon}</span>
              <div className="llm-info">
                <span className="llm-name">{LLM_CONFIG[primaryLLM].name}</span>
                <span className="llm-desc">{LLM_CONFIG[primaryLLM].description}</span>
              </div>
              <span>▼</span>
            </button>
            {showLLMSelector === 'primary' && (
              <LLMSelector
                selected={primaryLLM}
                onSelect={setPrimaryLLM}
                exclude={validatorLLM}
              />
            )}
          </div>

          <div className="flow-arrow">→</div>

          {/* Validator LLM Selector */}
          <div className="llm-selector-container">
            <div className="llm-selector-label">Validator LLM (Analyzes & Completes)</div>
            <button
              className="llm-selector-button"
              style={{ '--llm-color': LLM_CONFIG[validatorLLM].color }}
              onClick={() => setShowLLMSelector(showLLMSelector === 'validator' ? null : 'validator')}
            >
              <span className="llm-icon">{LLM_CONFIG[validatorLLM].icon}</span>
              <div className="llm-info">
                <span className="llm-name">{LLM_CONFIG[validatorLLM].name}</span>
                <span className="llm-desc">{LLM_CONFIG[validatorLLM].description}</span>
              </div>
              <span>▼</span>
            </button>
            {showLLMSelector === 'validator' && (
              <LLMSelector
                selected={validatorLLM}
                onSelect={setValidatorLLM}
                exclude={primaryLLM}
              />
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {messages.length === 0 && !isProcessing ? (
            <div className="empty-state">
              <div className="empty-icon">🧠⚡🔍</div>
              <div className="empty-title">LLM Validation Chain</div>
              <div className="empty-description">
                Write a prompt and watch how {LLM_CONFIG[primaryLLM].name} responds first,
                then {LLM_CONFIG[validatorLLM].name} validates and enhances the response.
                Perfect for getting verified, comprehensive answers.
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.type}`}>
                  {msg.type === 'user' && (
                    <div>{msg.content}</div>
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
                            {msg.phase === 'primary' ? 'Primary Response' : 'Validation & Enhancement'}
                          </span>
                        </div>
                      </div>
                      <div className="llm-content">{msg.content}</div>
                    </div>
                  )}
                  {msg.type === 'error' && (
                    <div>{msg.content}</div>
                  )}
                </div>
              ))}

              {/* Processing Animation */}
              {isProcessing && (
                <div className="processing-indicator">
                  <div className="flow-visualization">
                    <div
                      className={`flow-node ${currentPhase === 'primary' ? 'active' : ''}`}
                      style={{
                        '--node-color': LLM_CONFIG[primaryLLM].color,
                        background: LLM_CONFIG[primaryLLM].bgColor,
                        border: `2px solid ${LLM_CONFIG[primaryLLM].color}`
                      }}
                    >
                      <span className="icon">{LLM_CONFIG[primaryLLM].icon}</span>
                      <span className="label">{LLM_CONFIG[primaryLLM].name}</span>
                    </div>

                    <div className="flow-connection">
                      <div className="flow-dot" style={{ background: currentPhase === 'validating' ? '#10b981' : undefined }}></div>
                      <div className="flow-dot" style={{ background: currentPhase === 'validating' ? '#10b981' : undefined }}></div>
                      <div className="flow-dot" style={{ background: currentPhase === 'validating' ? '#10b981' : undefined }}></div>
                      <div className="flow-dot" style={{ background: currentPhase === 'validating' ? '#10b981' : undefined }}></div>
                      <div className="flow-dot" style={{ background: currentPhase === 'validating' ? '#10b981' : undefined }}></div>
                    </div>

                    <div
                      className={`flow-node ${currentPhase === 'validating' ? 'active' : ''}`}
                      style={{
                        '--node-color': LLM_CONFIG[validatorLLM].color,
                        background: LLM_CONFIG[validatorLLM].bgColor,
                        border: `2px solid ${LLM_CONFIG[validatorLLM].color}`
                      }}
                    >
                      <span className="icon">{LLM_CONFIG[validatorLLM].icon}</span>
                      <span className="label">{LLM_CONFIG[validatorLLM].name}</span>
                    </div>
                  </div>

                  <div className="processing-status">
                    {currentPhase === 'primary' && `${LLM_CONFIG[primaryLLM].icon} ${LLM_CONFIG[primaryLLM].name} is generating response...`}
                    {currentPhase === 'validating' && `${LLM_CONFIG[validatorLLM].icon} ${LLM_CONFIG[validatorLLM].name} is validating and enhancing...`}
                  </div>

                  {streamingText && (
                    <div className="streaming-preview">
                      {streamingText}
                    </div>
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
                placeholder={isAuthenticated ? "Ask anything... Press Enter to send, Shift+Enter for new line" : "Autentícate para continuar..."}
                disabled={isProcessing || !isAuthenticated}
                rows={1}
              />
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                className="clear-button"
                onClick={clearChat}
                title="Clear chat"
              >
                🗑️
              </button>
            )}
            <button
              type="submit"
              className="send-button"
              disabled={!prompt.trim() || isProcessing || !isAuthenticated}
            >
              {isProcessing ? (
                <>⏳ Processing...</>
              ) : (
                <>🚀 Send</>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
