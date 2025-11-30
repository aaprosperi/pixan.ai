import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// LLM configurations with Vercel AI Gateway model IDs and pricing
const LLM_CONFIG = {
  claude: {
    name: 'Claude Sonnet 4.5',
    modelId: 'anthropic/claude-sonnet-4.5',
    color: '#7c3aed',
    icon: '🧠',
    context: '200K',
    inputPrice: 0.003,
    outputPrice: 0.015
  },
  gpt: {
    name: 'GPT-5.1 Think',
    modelId: 'openai/gpt-5.1-thinking',
    color: '#059669',
    icon: '🤖',
    context: '400K',
    inputPrice: 0.00125,
    outputPrice: 0.010
  },
  gemini: {
    name: 'Gemini 3 Pro',
    modelId: 'google/gemini-3-pro-preview',
    color: '#2563eb',
    icon: '✨',
    context: '1M',
    inputPrice: 0.002,
    outputPrice: 0.012
  },
  perplexity: {
    name: 'Sonar Pro',
    modelId: 'perplexity/sonar-pro',
    color: '#d97706',
    icon: '🔍',
    context: '200K',
    inputPrice: 0.003,
    outputPrice: 0.015
  },
  deepseek: {
    name: 'DeepSeek v3.2',
    modelId: 'deepseek/deepseek-v3.2-exp-thinking',
    color: '#0891b2',
    icon: '🌊',
    context: '164K',
    inputPrice: 0.00028,
    outputPrice: 0.00042
  },
  grok: {
    name: 'Grok 4.1',
    modelId: 'xai/grok-4.1-fast-reasoning',
    color: '#dc2626',
    icon: '⚡',
    context: '2M',
    inputPrice: 0.0002,
    outputPrice: 0.0005
  },
  kimi: {
    name: 'Kimi K2',
    modelId: 'moonshotai/kimi-k2-thinking',
    color: '#9333ea',
    icon: '🌙',
    context: '262K',
    inputPrice: 0.0006,
    outputPrice: 0.0025
  }
};

const AUTH_KEY = 'pixan_genai_auth';

export default function GenAI() {
  const [prompt, setPrompt] = useState('');
  const [selectedLLM, setSelectedLLM] = useState('claude');
  const [responseMode, setResponseMode] = useState('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generateInfographic, setGenerateInfographic] = useState(false);
  
  // Conversation history for continuity
  const [conversationHistory, setConversationHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Parallel streaming for group mode
  const [parallelStreams, setParallelStreams] = useState({});
  const [integrationResult, setIntegrationResult] = useState(null);
  const [infographicResult, setInfographicResult] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  
  // Token & credits tracking
  const [sessionTokens, setSessionTokens] = useState({ input: 0, output: 0 });
  const [sessionCost, setSessionCost] = useState(0);
  const [gatewayBalance, setGatewayBalance] = useState(null);
  
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const authInputRef = useRef(null);

  // Fetch gateway balance
  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/credits');
      if (response.ok) {
        const data = await response.json();
        setGatewayBalance(data.credits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      setIsAuthenticated(true);
      fetchBalance();
    } else {
      setShowAuthModal(true);
    }
  }, []);

  useEffect(() => {
    if (showAuthModal && authInputRef.current) {
      authInputRef.current.focus();
    }
  }, [showAuthModal]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, parallelStreams, integrationResult]);

  const estimateTokens = (text) => Math.ceil((text || '').length / 4);

  const calculateCost = (inputTokens, outputTokens, llmKey) => {
    const config = LLM_CONFIG[llmKey];
    if (!config) return 0;
    return (inputTokens / 1000) * config.inputPrice + (outputTokens / 1000) * config.outputPrice;
  };

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
        setAuthError('Invalid password');
        setAuthPassword('');
        return;
      }

      sessionStorage.setItem(AUTH_KEY, authPassword);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      fetchBalance();
      inputRef.current?.focus();
    } catch (error) {
      setAuthError('Connection error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getAuthPassword = () => sessionStorage.getItem(AUTH_KEY) || '';

  const buildSystemPrompt = (llmKey, isGroupMode, willGenerateInfographic, history) => {
    const parts = [`You are ${LLM_CONFIG[llmKey].name}, an expert AI assistant.`];
    
    if (isGroupMode) {
      parts.push('CONTEXT: This is a SUPERVISED GROUP query where multiple LLMs respond to the same prompt. Your response will be integrated with others by Claude. Focus on your unique perspective and strengths.');
    }
    
    if (willGenerateInfographic) {
      parts.push('NOTE: The final response will be converted to a visual INFOGRAPHIC. Structure your response with clear key points that can be easily visualized.');
    }
    
    if (history.length > 0) {
      parts.push('CONVERSATION CONTEXT: Continue the conversation naturally based on the previous exchanges.');
    }
    
    return parts.join('\n\n');
  };

  // Stream a single LLM response
  const streamLLM = async (llmKey, message, systemPrompt, onChunk) => {
    const modelId = LLM_CONFIG[llmKey].modelId;
    
    const msgs = [];
    if (systemPrompt) msgs.push({ role: 'system', content: systemPrompt });
    
    // Add conversation history for continuity
    conversationHistory.forEach(h => {
      msgs.push({ role: 'user', content: h.user });
      if (h.assistant) msgs.push({ role: 'assistant', content: h.assistant });
    });
    
    msgs.push({ role: 'user', content: message });
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-password': getAuthPassword()
      },
      body: JSON.stringify({ model: modelId, messages: msgs })
    });

    if (response.status === 401) {
      sessionStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
      setShowAuthModal(true);
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Error');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullContent += parsed.content;
              onChunk(fullContent);
            }
          } catch (e) {}
        }
      }
    }

    return fullContent;
  };

  const generateInfographicImage = async (content, question) => {
    const response = await fetch('/api/generate-infographic', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-password': getAuthPassword()
      },
      body: JSON.stringify({ prompt: content, context: { question } })
    });

    if (!response.ok) throw new Error('Infographic generation failed');
    return await response.json();
  };

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

  // Single mode handler
  const handleSingleMode = async (userMessage) => {
    const systemPrompt = buildSystemPrompt(selectedLLM, false, generateInfographic, conversationHistory);
    
    let streamContent = '';
    setMessages(prev => [...prev, { type: 'llm', llm: selectedLLM, content: '', streaming: true }]);

    const result = await streamLLM(selectedLLM, userMessage, systemPrompt, (content) => {
      streamContent = content;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { type: 'llm', llm: selectedLLM, content, streaming: true };
        return updated;
      });
    });

    const tokenInfo = trackTokens(userMessage, result, selectedLLM);
    
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { type: 'llm', llm: selectedLLM, content: result, streaming: false, tokens: tokenInfo };
      return updated;
    });

    // Update conversation history
    setConversationHistory(prev => [...prev, { user: userMessage, assistant: result }]);
    
    return result;
  };

  // Group mode handler - parallel streaming
  const handleGroupMode = async (userMessage) => {
    const llmKeys = Object.keys(LLM_CONFIG);
    
    // Initialize parallel streams
    setParallelStreams(
      llmKeys.reduce((acc, key) => ({ ...acc, [key]: { content: '', status: 'pending' } }), {})
    );
    setIntegrationResult(null);
    setCurrentPhase('collecting');

    // Start all LLMs in parallel
    const promises = llmKeys.map(async (llmKey) => {
      try {
        setParallelStreams(prev => ({
          ...prev,
          [llmKey]: { ...prev[llmKey], status: 'streaming' }
        }));

        const systemPrompt = buildSystemPrompt(llmKey, true, generateInfographic, conversationHistory);
        
        const result = await streamLLM(llmKey, userMessage, systemPrompt, (content) => {
          setParallelStreams(prev => ({
            ...prev,
            [llmKey]: { content, status: 'streaming' }
          }));
        });

        trackTokens(userMessage, result, llmKey);

        setParallelStreams(prev => ({
          ...prev,
          [llmKey]: { content: result, status: 'complete' }
        }));

        return { llmKey, result };
      } catch (error) {
        setParallelStreams(prev => ({
          ...prev,
          [llmKey]: { content: `Error: ${error.message}`, status: 'error' }
        }));
        return { llmKey, result: `Error: ${error.message}` };
      }
    });

    const results = await Promise.all(promises);
    const responses = results.reduce((acc, { llmKey, result }) => ({ ...acc, [llmKey]: result }), {});

    // Integration phase
    setCurrentPhase('integrating');

    const integrationPrompt = `You are Claude, the supervisor of this group query. Multiple LLMs have responded to the user's prompt. Your task is to INTEGRATE and SYNTHESIZE all responses into a coherent, comprehensive final response.

USER'S ORIGINAL QUESTION:
"${userMessage}"

LLM RESPONSES:

${Object.entries(responses).map(([key, response]) => `
### ${LLM_CONFIG[key].name} (${LLM_CONFIG[key].icon}):
${response}
`).join('\n---\n')}

YOUR TASK:
1. Identify key points where ALL agree
2. Highlight valuable unique perspectives from each LLM
3. Resolve any contradictions between responses
4. Synthesize everything into a FINAL integrated response

${generateInfographic ? 'NOTE: Your response will be converted to a visual infographic, so structure it with clear, visualizable points.' : ''}

Respond with:
- 🔄 CONSENSUS: (common points)
- 💡 UNIQUE INSIGHTS: (valuable contributions from each)
- ⚖️ RESOLUTION: (if there were contradictions)
- 🎯 FINAL INTEGRATED RESPONSE: (complete synthesis)`;

    let integrationContent = '';
    
    const integration = await streamLLM('claude', integrationPrompt, null, (content) => {
      integrationContent = content;
      setIntegrationResult({ content, streaming: true });
    });

    trackTokens(integrationPrompt, integration, 'claude');
    setIntegrationResult({ content: integration, streaming: false });

    // Update conversation history with the integrated response
    setConversationHistory(prev => [...prev, { user: userMessage, assistant: integration }]);

    return integration;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || isProcessing || !isAuthenticated) return;

    const userMessage = prompt;
    setPrompt('');
    setIsProcessing(true);
    setInfographicResult(null);

    setMessages(prev => [...prev, { type: 'user', content: userMessage, mode: responseMode }]);

    try {
      let finalResult;

      if (responseMode === 'single') {
        finalResult = await handleSingleMode(userMessage);
      } else {
        finalResult = await handleGroupMode(userMessage);
      }

      if (generateInfographic && finalResult) {
        setCurrentPhase('infographic');
        try {
          const infographic = await generateInfographicImage(finalResult, userMessage);
          if (infographic.images?.length > 0) {
            setInfographicResult(infographic);
          }
        } catch (error) {
          console.error('Infographic error:', error);
        }
      }

      setCurrentPhase('complete');
      fetchBalance();

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'error', content: error.message }]);
    } finally {
      setIsProcessing(false);
      setCurrentPhase(null);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setParallelStreams({});
    setIntegrationResult(null);
    setInfographicResult(null);
    setConversationHistory([]);
    setSessionTokens({ input: 0, output: 0 });
    setSessionCost(0);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setShowAuthModal(true);
    clearChat();
  };

  const downloadImage = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `pixan-infographic-${Date.now()}-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Logo component
  const PixanLogo = () => (
    <svg width="120" height="35" viewBox="0 0 163 47" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12H3.49722V37.18H0V12Z" fill="#28106A"/>
      <path d="M14.9681 12H18.6612V30.3045H14.9681V12Z" fill="#D34C54"/>
      <path d="M7.27422 12H10.9673V30.3045H7.27422V12Z" fill="#28106A"/>
      <path d="M45.4261 46.8182V10.8182H50.4034V15.0625H50.8295C51.125 14.517 51.5511 13.8864 52.108 13.1705C52.6648 12.4545 53.4375 11.8295 54.4261 11.2955C55.4148 10.75 56.7216 10.4773 58.3466 10.4773C60.4602 10.4773 62.3466 11.0114 64.0057 12.0795C65.6648 13.1477 66.9659 14.6875 67.9091 16.6989C68.8636 18.7102 69.3409 21.1307 69.3409 23.9602C69.3409 26.7898 68.8693 29.2159 67.9261 31.2386C66.983 33.25 65.6875 34.8011 64.0398 35.892C62.392 36.9716 60.5114 37.5114 58.3977 37.5114C56.8068 37.5114 55.5057 37.2443 54.4943 36.7102C53.4943 36.1761 52.7102 35.5511 52.142 34.8352C51.5739 34.1193 51.1364 33.483 50.8295 32.9261H50.5227V46.8182H45.4261ZM50.4205 23.9091C50.4205 25.75 50.6875 27.3636 51.2216 28.75C51.7557 30.1364 52.5284 31.2216 53.5398 32.0057C54.5511 32.7784 55.7898 33.1648 57.2557 33.1648C58.7784 33.1648 60.0511 32.7614 61.0739 31.9545C62.0966 31.1364 62.8693 30.0284 63.392 28.6307C63.9261 27.233 64.1932 25.6591 64.1932 23.9091C64.1932 22.1818 63.9318 20.6307 63.4091 19.2557C62.8977 17.8807 62.125 16.7955 61.0909 16C60.0682 15.2045 58.7898 14.8068 57.2557 14.8068C55.7784 14.8068 54.5284 15.1875 53.5057 15.9489C52.4943 16.7102 51.7273 17.7727 51.2045 19.1364C50.6818 20.5 50.4205 22.0909 50.4205 23.9091Z" fill="#28106A"/>
      <path d="M75.0511 37V10.8182H80.1477V37H75.0511ZM77.625 6.77841C76.7386 6.77841 75.9773 6.48295 75.3409 5.89204C74.7159 5.28977 74.4034 4.57386 74.4034 3.74432C74.4034 2.90341 74.7159 2.1875 75.3409 1.59659C75.9773 0.994317 76.7386 0.693181 77.625 0.693181C78.5114 0.693181 79.267 0.994317 79.892 1.59659C80.5284 2.1875 80.8466 2.90341 80.8466 3.74432C80.8466 4.57386 80.5284 5.28977 79.892 5.89204C79.267 6.48295 78.5114 6.77841 77.625 6.77841Z" fill="#28106A"/>
      <path d="M91.027 10.8182L96.8054 21.0114L102.635 10.8182H108.209L100.044 23.9091L108.277 37H102.703L96.8054 27.2159L90.9247 37H85.3338L93.4815 23.9091L85.4361 10.8182H91.027Z" fill="#28106A"/>
      <path d="M121.014 37.5795C119.355 37.5795 117.855 37.2727 116.514 36.6591C115.173 36.0341 114.111 35.1307 113.327 33.9489C112.554 32.767 112.168 31.3182 112.168 29.6023C112.168 28.125 112.452 26.9091 113.02 25.9545C113.588 25 114.355 24.2443 115.321 23.6875C116.287 23.1307 117.366 22.7102 118.56 22.4261C119.753 22.142 120.969 21.9261 122.207 21.7784C123.776 21.5966 125.048 21.4489 126.026 21.3352C127.003 21.2102 127.713 21.0114 128.156 20.7386C128.599 20.4659 128.821 20.0227 128.821 19.4091V19.2898C128.821 17.8011 128.401 16.6477 127.56 15.8295C126.73 15.0114 125.491 14.6023 123.844 14.6023C122.128 14.6023 120.776 14.983 119.787 15.7443C118.81 16.4943 118.134 17.3295 117.759 18.25L112.969 17.1591C113.537 15.5682 114.366 14.2841 115.457 13.3068C116.56 12.3182 117.827 11.6023 119.259 11.1591C120.69 10.7045 122.196 10.4773 123.776 10.4773C124.821 10.4773 125.929 10.6023 127.099 10.8523C128.281 11.0909 129.384 11.5341 130.406 12.1818C131.44 12.8295 132.287 13.7557 132.946 14.9602C133.605 16.1534 133.935 17.7045 133.935 19.6136V37H128.957V33.4205H128.753C128.423 34.0795 127.929 34.7273 127.27 35.3636C126.611 36 125.764 36.5284 124.73 36.9489C123.696 37.3693 122.457 37.5795 121.014 37.5795ZM122.122 33.4886C123.531 33.4886 124.736 33.2102 125.736 32.6534C126.747 32.0966 127.514 31.3693 128.037 30.4716C128.571 29.5625 128.838 28.5909 128.838 27.5568V24.1818C128.656 24.3636 128.304 24.5341 127.781 24.6932C127.27 24.8409 126.685 24.9716 126.026 25.0852C125.366 25.1875 124.724 25.2841 124.099 25.375C123.474 25.4545 122.952 25.5227 122.531 25.5795C121.543 25.7045 120.639 25.9148 119.821 26.2102C119.014 26.5057 118.366 26.9318 117.878 27.4886C117.401 28.0341 117.162 28.7614 117.162 29.6705C117.162 30.9318 117.628 31.8864 118.56 32.5341C119.491 33.1705 120.679 33.4886 122.122 33.4886Z" fill="#28106A"/>
      <path d="M145.82 21.4545V37H140.723V10.8182H145.615V15.0795H145.939C146.541 13.6932 147.484 12.5795 148.768 11.7386C150.064 10.8977 151.695 10.4773 153.661 10.4773C155.445 10.4773 157.007 10.8523 158.348 11.6023C159.689 12.3409 160.729 13.4432 161.467 14.9091C162.206 16.375 162.575 18.1875 162.575 20.3466V37H157.479V20.9602C157.479 19.0625 156.984 17.5795 155.996 16.5114C155.007 15.4318 153.649 14.892 151.922 14.892C150.74 14.892 149.689 15.1477 148.768 15.6591C147.859 16.1705 147.138 16.9205 146.604 17.9091C146.081 18.8864 145.82 20.0682 145.82 21.4545Z" fill="#28106A"/>
      <path d="M140.7 10.82H145.98V36.99H140.7V10.82Z" fill="#D34C54"/>
    </svg>
  );

  return (
    <>
      <Head>
        <title>Pixan genAI | Collaborative AI Intelligence</title>
        <meta name="description" content="Collaborative genAI - Single or supervised group responses from multiple LLMs" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, sans-serif; background: #ffffff; color: #1a1a1a; }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 24px; min-height: 100vh; display: flex; flex-direction: column; }
        
        /* Auth Modal */
        .auth-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .auth-modal { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 40px; max-width: 380px; width: 90%; }
        .auth-logo { margin-bottom: 24px; display: flex; justify-content: center; }
        .auth-title { font-size: 20px; font-weight: 600; text-align: center; margin-bottom: 8px; color: #1a1a1a; }
        .auth-subtitle { color: #666; text-align: center; margin-bottom: 24px; font-size: 14px; }
        .auth-input { width: 100%; padding: 12px 16px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; font-size: 15px; outline: none; transition: all 0.2s; margin-bottom: 16px; }
        .auth-input:focus { border-color: #28106A; background: #fff; }
        .auth-button { width: 100%; padding: 12px; background: #28106A; border: none; border-radius: 8px; color: #fff; font-weight: 500; font-size: 15px; cursor: pointer; transition: all 0.2s; }
        .auth-button:hover:not(:disabled) { background: #3d1a8f; }
        .auth-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-error { color: #dc2626; font-size: 14px; margin-bottom: 16px; padding: 10px; background: #fef2f2; border-radius: 6px; text-align: center; }
        
        /* Header */
        .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0; margin-bottom: 24px; }
        .header-left { display: flex; align-items: center; gap: 24px; }
        .header-title { font-size: 13px; color: #666; font-weight: 500; }
        
        /* Stats */
        .stats-box { display: flex; align-items: center; gap: 20px; font-size: 13px; color: #666; }
        .stat { display: flex; flex-direction: column; align-items: flex-end; }
        .stat-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-weight: 600; color: #1a1a1a; }
        .stat-value.green { color: #059669; }
        .logout-btn { padding: 6px 12px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 12px; color: #666; cursor: pointer; transition: all 0.2s; }
        .logout-btn:hover { background: #f0f0f0; border-color: #d5d5d5; }
        
        /* Controls */
        .controls { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; align-items: flex-start; }
        
        .mode-toggle { display: flex; background: #f5f5f5; border-radius: 8px; padding: 4px; }
        .mode-btn { padding: 8px 16px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: #666; cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .mode-btn.active { background: #fff; color: #1a1a1a; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        
        .llm-select { position: relative; }
        .llm-select-btn { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; font-size: 13px; cursor: pointer; transition: all 0.2s; min-width: 200px; }
        .llm-select-btn:hover { border-color: #d5d5d5; }
        .llm-select-btn .icon { font-size: 16px; }
        .llm-select-btn .info { flex: 1; text-align: left; }
        .llm-select-btn .name { font-weight: 500; display: block; }
        .llm-select-btn .meta { font-size: 11px; color: #999; }
        
        .llm-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; margin-top: 4px; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
        .llm-option { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; transition: all 0.15s; border-bottom: 1px solid #f5f5f5; }
        .llm-option:last-child { border-bottom: none; }
        .llm-option:hover { background: #fafafa; }
        .llm-option.selected { background: #f0f0ff; }
        .llm-option .icon { font-size: 18px; }
        .llm-option .info { flex: 1; }
        .llm-option .name { font-weight: 500; font-size: 13px; }
        .llm-option .meta { font-size: 11px; color: #999; }
        
        .toggle-group { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; }
        .toggle-label { font-size: 13px; color: #666; display: flex; align-items: center; gap: 6px; }
        .toggle { width: 36px; height: 20px; background: #e5e5e5; border-radius: 10px; cursor: pointer; position: relative; transition: all 0.2s; }
        .toggle.active { background: #f59e0b; }
        .toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .toggle.active::after { left: 18px; }
        
        /* Input Area - immediately after controls */
        .input-section { margin-bottom: 24px; }
        .input-wrapper { display: flex; gap: 12px; }
        .prompt-input { flex: 1; padding: 14px 18px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 10px; font-size: 15px; font-family: inherit; resize: none; outline: none; transition: all 0.2s; min-height: 52px; }
        .prompt-input:focus { border-color: #28106A; background: #fff; box-shadow: 0 0 0 3px rgba(40,16,106,0.1); }
        .prompt-input::placeholder { color: #999; }
        .send-btn { padding: 14px 24px; background: #28106A; border: none; border-radius: 10px; color: #fff; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .send-btn:hover:not(:disabled) { background: #3d1a8f; }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .clear-btn { padding: 14px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 16px; }
        .clear-btn:hover { background: #f0f0f0; }
        
        /* Chat Area */
        .chat-area { flex: 1; overflow-y: auto; }
        
        .message { margin-bottom: 20px; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        
        .message.user { display: flex; justify-content: flex-end; }
        .message.user .bubble { background: #28106A; color: #fff; padding: 12px 18px; border-radius: 16px 16px 4px 16px; max-width: 70%; }
        .message.user .mode-tag { font-size: 10px; opacity: 0.7; margin-bottom: 4px; }
        
        .message.error .bubble { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 12px 18px; border-radius: 12px; }
        
        /* Single LLM response */
        .llm-response { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; padding: 16px; }
        .llm-response-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .llm-response-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .llm-response-meta .name { font-weight: 600; font-size: 14px; }
        .llm-response-meta .tokens { font-size: 11px; color: #999; }
        .llm-response-content { font-size: 14px; line-height: 1.7; white-space: pre-wrap; color: #333; }
        
        /* Parallel streams grid */
        .parallel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-bottom: 20px; }
        .stream-card { background: #1a1a1a; border-radius: 8px; padding: 12px; font-family: 'SF Mono', 'Monaco', monospace; font-size: 11px; color: #a0a0a0; max-height: 180px; overflow-y: auto; }
        .stream-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #333; }
        .stream-card-icon { font-size: 14px; }
        .stream-card-name { color: #fff; font-weight: 500; font-family: 'Inter', sans-serif; }
        .stream-card-status { margin-left: auto; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
        .stream-card-status.pending { background: #333; color: #666; }
        .stream-card-status.streaming { background: #28106A; color: #fff; }
        .stream-card-status.complete { background: #059669; color: #fff; }
        .stream-card-status.error { background: #dc2626; color: #fff; }
        .stream-card-content { line-height: 1.5; word-break: break-word; }
        .stream-card::-webkit-scrollbar { width: 4px; }
        .stream-card::-webkit-scrollbar-track { background: #333; }
        .stream-card::-webkit-scrollbar-thumb { background: #555; border-radius: 2px; }
        
        /* Integration result */
        .integration-box { background: linear-gradient(135deg, #f8f7ff 0%, #f0f0ff 100%); border: 1px solid #e0e0ff; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .integration-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .integration-icon { width: 40px; height: 40px; background: #28106A; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .integration-title { font-weight: 600; font-size: 16px; color: #28106A; }
        .integration-subtitle { font-size: 12px; color: #666; }
        .integration-content { font-size: 14px; line-height: 1.7; white-space: pre-wrap; color: #333; }
        
        /* Infographic */
        .infographic-box { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .infographic-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .infographic-icon { width: 40px; height: 40px; background: #f59e0b; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .infographic-title { font-weight: 600; font-size: 16px; color: #92400e; }
        .infographic-images { display: flex; flex-direction: column; gap: 12px; }
        .infographic-img-wrapper { position: relative; border-radius: 8px; overflow: hidden; }
        .infographic-img { width: 100%; height: auto; display: block; }
        .download-btn { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .download-btn:hover { background: rgba(0,0,0,0.85); }
        
        /* Processing indicator */
        .processing { display: flex; align-items: center; gap: 10px; padding: 16px; background: #fafafa; border-radius: 10px; font-size: 14px; color: #666; margin-bottom: 16px; }
        .spinner { width: 18px; height: 18px; border: 2px solid #e5e5e5; border-top-color: #28106A; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Empty state */
        .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 20px; color: #666; }
        .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
        .empty-title { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; }
        .empty-desc { font-size: 14px; max-width: 400px; line-height: 1.6; }
        
        /* Footer */
        .footer { padding-top: 20px; border-top: 1px solid #f0f0f0; margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
        .footer-text { font-size: 12px; color: #999; }
        .footer-link { color: #28106A; text-decoration: none; font-weight: 500; }
        .footer-link:hover { text-decoration: underline; }
        
        @media (max-width: 768px) {
          .container { padding: 16px; }
          .header { flex-direction: column; gap: 16px; align-items: flex-start; }
          .stats-box { width: 100%; justify-content: space-between; }
          .controls { flex-direction: column; }
          .mode-toggle, .llm-select, .toggle-group { width: 100%; }
          .llm-select-btn { width: 100%; }
          .parallel-grid { grid-template-columns: 1fr; }
          .input-wrapper { flex-direction: column; }
          .send-btn, .clear-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <div className="auth-logo"><PixanLogo /></div>
            <div className="auth-title">Collaborative genAI</div>
            <div className="auth-subtitle">Enter password to continue</div>
            {authError && <div className="auth-error">{authError}</div>}
            <form onSubmit={handleAuth}>
              <input
                ref={authInputRef}
                type="password"
                className="auth-input"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Password"
                disabled={isAuthenticating}
              />
              <button type="submit" className="auth-button" disabled={!authPassword.trim() || isAuthenticating}>
                {isAuthenticating ? 'Verifying...' : 'Enter'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <a href="/" style={{ display: 'flex' }}><PixanLogo /></a>
            <span className="header-title">genAI</span>
          </div>
          
          <div className="stats-box">
            <div className="stat">
              <span className="stat-label">Gateway Balance</span>
              <span className="stat-value green">${gatewayBalance !== null ? gatewayBalance.toFixed(2) : '—'}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Session</span>
              <span className="stat-value">${sessionCost.toFixed(4)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Tokens</span>
              <span className="stat-value">{sessionTokens.input.toLocaleString()} / {sessionTokens.output.toLocaleString()}</span>
            </div>
            {isAuthenticated && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
          </div>
        </header>

        {/* Controls */}
        <div className="controls">
          <div className="mode-toggle">
            <button className={`mode-btn ${responseMode === 'single' ? 'active' : ''}`} onClick={() => setResponseMode('single')} disabled={isProcessing}>
              👤 Single
            </button>
            <button className={`mode-btn ${responseMode === 'group' ? 'active' : ''}`} onClick={() => setResponseMode('group')} disabled={isProcessing}>
              👥 Group
            </button>
          </div>

          {responseMode === 'single' && (
            <div className="llm-select">
              <button className="llm-select-btn" onClick={() => document.getElementById('llm-dropdown').style.display = document.getElementById('llm-dropdown').style.display === 'none' ? 'block' : 'none'}>
                <span className="icon">{LLM_CONFIG[selectedLLM].icon}</span>
                <span className="info">
                  <span className="name">{LLM_CONFIG[selectedLLM].name}</span>
                  <span className="meta">{LLM_CONFIG[selectedLLM].context} • ${LLM_CONFIG[selectedLLM].inputPrice}/${LLM_CONFIG[selectedLLM].outputPrice}</span>
                </span>
                <span>▾</span>
              </button>
              <div id="llm-dropdown" className="llm-dropdown" style={{ display: 'none' }}>
                {Object.entries(LLM_CONFIG).map(([key, config]) => (
                  <div
                    key={key}
                    className={`llm-option ${selectedLLM === key ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedLLM(key);
                      document.getElementById('llm-dropdown').style.display = 'none';
                    }}
                  >
                    <span className="icon">{config.icon}</span>
                    <span className="info">
                      <span className="name">{config.name}</span>
                      <span className="meta">{config.context} • ${config.inputPrice}/${config.outputPrice} per 1K</span>
                    </span>
                    {selectedLLM === key && <span>✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {responseMode === 'group' && (
            <span style={{ fontSize: '13px', color: '#666', padding: '8px 14px' }}>
              All {Object.keys(LLM_CONFIG).length} LLMs will respond → Claude integrates
            </span>
          )}

          <div className="toggle-group">
            <span className="toggle-label">🍌 Infographic</span>
            <div className={`toggle ${generateInfographic ? 'active' : ''}`} onClick={() => setGenerateInfographic(!generateInfographic)} />
          </div>
        </div>

        {/* Input Section - immediately after controls */}
        <div className="input-section">
          <form onSubmit={handleSubmit} className="input-wrapper">
            <textarea
              ref={inputRef}
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder={isAuthenticated ? `Ask anything... (${responseMode === 'single' ? LLM_CONFIG[selectedLLM].name : 'Group mode'})` : 'Authenticate to continue...'}
              disabled={isProcessing || !isAuthenticated}
              rows={1}
            />
            {messages.length > 0 && <button type="button" className="clear-btn" onClick={clearChat} title="Clear chat">🗑️</button>}
            <button type="submit" className="send-btn" disabled={!prompt.trim() || isProcessing || !isAuthenticated}>
              {isProcessing ? <><div className="spinner"></div> Processing</> : <>Send →</>}
            </button>
          </form>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {messages.length === 0 && Object.keys(parallelStreams).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{responseMode === 'single' ? '👤' : '👥'}</div>
              <div className="empty-title">{responseMode === 'single' ? 'Single Mode' : 'Supervised Group Mode'}</div>
              <div className="empty-desc">
                {responseMode === 'single'
                  ? `${LLM_CONFIG[selectedLLM].name} will respond to your question.`
                  : `All ${Object.keys(LLM_CONFIG).length} LLMs will respond simultaneously, then Claude will integrate all perspectives.`
                }
                {generateInfographic && ' The final response will be converted to a visual infographic.'}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.type}`}>
                  {msg.type === 'user' && (
                    <div className="bubble">
                      <div className="mode-tag">{msg.mode === 'single' ? '👤 Single' : '👥 Group'}</div>
                      {msg.content}
                    </div>
                  )}
                  {msg.type === 'llm' && (
                    <div className="llm-response">
                      <div className="llm-response-header">
                        <div className="llm-response-icon" style={{ background: LLM_CONFIG[msg.llm].color }}>{LLM_CONFIG[msg.llm].icon}</div>
                        <div className="llm-response-meta">
                          <div className="name">{LLM_CONFIG[msg.llm].name}</div>
                          {msg.tokens && <div className="tokens">{msg.tokens.inputTokens}/{msg.tokens.outputTokens} tokens • ${msg.tokens.cost.toFixed(6)}</div>}
                        </div>
                        {msg.streaming && <div className="spinner" style={{ marginLeft: 'auto' }}></div>}
                      </div>
                      <div className="llm-response-content">{msg.content}</div>
                    </div>
                  )}
                  {msg.type === 'error' && <div className="bubble">{msg.content}</div>}
                </div>
              ))}

              {/* Parallel streams for group mode */}
              {Object.keys(parallelStreams).length > 0 && (
                <div className="parallel-grid">
                  {Object.entries(parallelStreams).map(([llmKey, stream]) => (
                    <div key={llmKey} className="stream-card">
                      <div className="stream-card-header">
                        <span className="stream-card-icon">{LLM_CONFIG[llmKey].icon}</span>
                        <span className="stream-card-name">{LLM_CONFIG[llmKey].name}</span>
                        <span className={`stream-card-status ${stream.status}`}>
                          {stream.status === 'pending' && 'Waiting'}
                          {stream.status === 'streaming' && 'Streaming'}
                          {stream.status === 'complete' && 'Done'}
                          {stream.status === 'error' && 'Error'}
                        </span>
                      </div>
                      <div className="stream-card-content">
                        {stream.content || (stream.status === 'pending' ? 'Waiting to start...' : '')}
                        {stream.status === 'streaming' && <span style={{ opacity: 0.5 }}>▌</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Integration result */}
              {integrationResult && (
                <div className="integration-box">
                  <div className="integration-header">
                    <div className="integration-icon">🧠</div>
                    <div>
                      <div className="integration-title">Claude Integration</div>
                      <div className="integration-subtitle">Synthesized from all LLM responses</div>
                    </div>
                    {integrationResult.streaming && <div className="spinner" style={{ marginLeft: 'auto' }}></div>}
                  </div>
                  <div className="integration-content">{integrationResult.content}</div>
                </div>
              )}

              {/* Infographic */}
              {infographicResult?.images?.length > 0 && (
                <div className="infographic-box">
                  <div className="infographic-header">
                    <div className="infographic-icon">🍌</div>
                    <div className="infographic-title">Nano Banana Pro Infographic</div>
                  </div>
                  <div className="infographic-images">
                    {infographicResult.images.map((img, i) => (
                      <div key={i} className="infographic-img-wrapper">
                        <img src={img.url} alt={`Infographic ${i + 1}`} className="infographic-img" />
                        <button className="download-btn" onClick={() => downloadImage(img.url, i)}>⬇ Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing indicator */}
              {isProcessing && currentPhase === 'infographic' && (
                <div className="processing">
                  <div className="spinner"></div>
                  <span>Generating infographic with Nano Banana Pro...</span>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <footer className="footer">
          <span className="footer-text">Powered by <a href="https://pixan.ai" className="footer-link">pixan.ai</a> • Vercel AI Gateway</span>
          <span className="footer-text">Conversation continues automatically</span>
        </footer>
      </div>
    </>
  );
}
