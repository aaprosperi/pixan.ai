import { useState } from 'react';
import Head from 'next/head';

export default function LLMColaborativa() {
  // Estado para las APIs
  const [apiKeys, setApiKeys] = useState({
    claude: '',
    openai: '',
    gemini: '',
    perplexity: ''
  });

  // Estado para el proceso
  const [query, setQuery] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [terminal, setTerminal] = useState([]);
  const [finalResponse, setFinalResponse] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  // Estado para las respuestas individuales
  const [llmResponses, setLlmResponses] = useState({
    claude: null,
    openai: null,
    gemini: null,
    perplexity: null
  });

  // Estado para la memoria de conversación (excepto Claude)
  const [conversations, setConversations] = useState({
    openai: [],
    gemini: [],
    perplexity: []
  });

  // Función para actualizar API keys
  const updateApiKey = (llm, value) => {
    setApiKeys(prev => ({ ...prev, [llm]: value }));
    if (errors[llm]) {
      setErrors(prev => ({ ...prev, [llm]: null }));
    }
  };

  // Logger del terminal con efectos visuales
  const log = (type, msg, llm = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const entry = { 
      type, 
      msg, 
      llm,
      time: timestamp,
      id: Date.now() + Math.random()
    };
    setTerminal(prev => [...prev, entry]);
  };

  // Validación de APIs disponibles
  const getAvailableLLMs = () => {
    const available = [];
    if (apiKeys.claude) available.push('claude');
    if (apiKeys.openai) available.push('openai');
    if (apiKeys.gemini) available.push('gemini');
    if (apiKeys.perplexity) available.push('perplexity');
    return available;
  };

  // Validación del formulario
  const validate = () => {
    const newErrors = {};
    if (query.length < 10) {
      newErrors.query = 'La consulta debe tener al menos 10 caracteres';
    }
    
    const availableLLMs = getAvailableLLMs();
    if (availableLLMs.length === 0) {
      newErrors.general = 'Debes proporcionar al menos una API key';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para llamar a cada API
  const callLLM = async (llmName, message, conversation = []) => {
    const endpoints = {
      claude: '/api/claude-chat',
      openai: '/api/openai-chat',
      gemini: '/api/gemini-chat',
      perplexity: '/api/perplexity-chat'
    };

    const body = llmName === 'claude' 
      ? { apiKey: apiKeys[llmName], message, context: 'general_query' }
      : llmName === 'gemini'
      ? { apiKey: apiKeys[llmName], prompt: message, parameters: { temperature: 0.7 } }
      : { apiKey: apiKeys[llmName], message, conversation };

    const response = await fetch(endpoints[llmName], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `${llmName} API Error`);
    }

    return response.json();
  };

  // Proceso principal de colaboración
  const startCollaboration = async () => {
    if (!validate()) return;

    setProcessing(true);
    setTerminal([]);
    setFinalResponse('');
    setLlmResponses({ claude: null, openai: null, gemini: null, perplexity: null });
    setMetrics(null);

    const availableLLMs = getAvailableLLMs();
    const startTime = Date.now();

    try {
      // Paso 1: Inicialización
      setStep(1);
      log('system', `🚀 Iniciando LLM Colaborativa con ${availableLLMs.length} modelos activos`);
      log('system', `📋 Modelos: ${availableLLMs.map(llm => llm.toUpperCase()).join(', ')}`);

      // Paso 2: Envío paralelo a todos los LLMs disponibles
      setStep(2);
      log('system', '⚡ Enviando consulta a todos los LLMs simultáneamente...');
      
      const llmPromises = availableLLMs.map(async (llmName) => {
        try {
          log('system', `📤 Consultando ${llmName.toUpperCase()}...`, llmName);
          
          const conversation = conversations[llmName] || [];
          const response = await callLLM(llmName, query, conversation);
          
          // Actualizar memoria para LLMs que la soportan
          if (llmName !== 'claude') {
            setConversations(prev => ({
              ...prev,
              [llmName]: [...conversation, 
                { role: 'user', content: query },
                { role: 'assistant', content: response.content }
              ]
            }));
          }
          
          log(llmName, response.content, llmName);
          return { llm: llmName, response: response.content, success: true };
        } catch (error) {
          log('error', `❌ Error en ${llmName.toUpperCase()}: ${error.message}`, llmName);
          return { llm: llmName, error: error.message, success: false };
        }
      });

      // Paso 3: Esperar respuestas
      setStep(3);
      const results = await Promise.all(llmPromises);
      const successfulResults = results.filter(r => r.success);
      
      // Actualizar estado con respuestas
      const newResponses = {};
      successfulResults.forEach(result => {
        newResponses[result.llm] = result.response;
      });
      setLlmResponses(newResponses);

      log('system', `✅ Recibidas ${successfulResults.length} respuestas exitosas`);

      if (successfulResults.length === 0) {
        throw new Error('Ningún LLM respondió exitosamente');
      }

      // Paso 4: Consolidación con Claude (si está disponible)
      setStep(4);
      if (apiKeys.claude && successfulResults.length > 1) {
        log('system', '🧠 Claude iniciando consolidación inteligente...');
        
        const consolidationQuery = `Como experto en análisis de IA, consolida estas ${successfulResults.length} respuestas de diferentes LLMs sobre la consulta: "${query}"

${successfulResults.map((result, idx) => 
  `**${result.llm.toUpperCase()} (Respuesta ${idx + 1}):**\n${result.response}`
).join('\n\n')}

INSTRUCCIONES CRÍTICAS:
1. Analiza cada respuesta por precisión, coherencia y completitud
2. Identifica información consistente entre modelos (alta confiabilidad)
3. Detecta y elimina posibles alucinaciones o inconsistencias
4. Sintetiza una respuesta final que combine lo mejor de cada modelo
5. Prioriza información que aparece en múltiples respuestas
6. Mantén el tono y estilo más apropiado para la consulta
7. Si hay contradicciones, explica brevemente por qué elegiste una versión
8. Adapta el formato según el tipo de consulta (técnica, creativa, analítica, etc.)

Genera UNA respuesta consolidada definitiva que represente la síntesis más precisa y completa.`;

        const consolidationResponse = await callLLM('claude', consolidationQuery);
        
        setStep(5);
        log('claude', consolidationResponse.content, 'claude');
        setFinalResponse(consolidationResponse.content);
        
        log('system', '🎯 Consolidación completada con máxima precisión');
      } else if (successfulResults.length === 1) {
        // Solo un LLM respondió
        setFinalResponse(successfulResults[0].response);
        log('system', `✨ Respuesta única de ${successfulResults[0].llm.toUpperCase()}`);
      } else {
        // Múltiples respuestas pero sin Claude para consolidar
        const combinedResponse = successfulResults.map((result, idx) => 
          `**${result.llm.toUpperCase()}:**\n${result.response}`
        ).join('\n\n---\n\n');
        
        setFinalResponse(combinedResponse);
        log('system', '📊 Múltiples respuestas presentadas sin consolidación');
      }

      // Paso 6: Calcular métricas
      setStep(6);
      log('system', '📈 Calculando métricas de colaboración...');
      
      const processingTime = Math.round((Date.now() - startTime) / 1000);
      const calculatedMetrics = {
        llmsUsed: successfulResults.length,
        totalLlmsAvailable: availableLLMs.length,
        processingTime,
        consolidationUsed: apiKeys.claude && successfulResults.length > 1,
        memoryEnabled: availableLLMs.filter(llm => llm !== 'claude').length,
        responseLengths: successfulResults.map(r => r.response.length)
      };
      
      setMetrics(calculatedMetrics);
      log('system', '🏆 ¡Colaboración LLM completada con éxito por Pixan.ai!');

    } catch (error) {
      log('error', `💥 Error crítico: ${error.message}`);
    } finally {
      setProcessing(false);
      setStep(0);
    }
  };

  // Función para copiar respuesta
  const copyResponse = () => {
    navigator.clipboard.writeText(finalResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Función para cancelar proceso
  const cancelProcess = () => {
    setProcessing(false);
    setStep(0);
    log('system', '⏹️ Proceso cancelado por el usuario');
  };

  // Función para limpiar memoria
  const clearMemory = () => {
    setConversations({ openai: [], gemini: [], perplexity: [] });
    log('system', '🧹 Memoria de conversación limpiada');
  };

  return (
    <>
      <Head>
        <title>LLM Colaborativa - IA Multi-Modelo | Pixan.ai</title>
        <meta name="description" content="Colaboración inteligente entre Claude, GPT-4, Gemini y Perplexity con consolidación automática - Desarrollado por Pixan.ai" />
        <link rel="icon" href="/favicon.ico" />
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
          background: #ffffff;
          color: #000000;
          line-height: 1.6;
        }

        .terminal-glow {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }

        .llm-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          margin-right: 8px;
        }

        .claude-badge { background: #8b5cf6; color: white; }
        .openai-badge { background: #10b981; color: white; }
        .gemini-badge { background: #3b82f6; color: white; }
        .perplexity-badge { background: #f59e0b; color: white; }
        .system-badge { background: #6b7280; color: white; }
        .error-badge { background: #ef4444; color: white; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(139, 92, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.8); }
        }

        .processing-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <svg width="163" height="47" viewBox="0 0 163 47" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                LLM Colaborativa
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              4 IAs trabajando juntas: Claude supervisa, GPT-4 analiza, Gemini innova, Perplexity investiga
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Tecnología revolucionaria de colaboración multi-IA por Pixan.ai 🧠
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulario */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuración Multi-LLM</h2>
                
                <div className="space-y-6">
                  {/* Consulta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tu Consulta ({query.length} caracteres)
                    </label>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Pregunta, solicitud, análisis, investigación, creatividad... cualquier consulta que necesites resolver"
                      disabled={processing}
                    />
                    {errors.query && (
                      <span className="text-sm text-red-500 mt-1">{errors.query}</span>
                    )}
                  </div>

                  {/* API Keys */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">APIs Disponibles (completa las que tengas)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <span className="claude-badge">Claude</span>
                          Clave API de Claude
                        </label>
                        <input
                          type="password"
                          value={apiKeys.claude}
                          onChange={(e) => updateApiKey('claude', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="sk-ant-..."
                          disabled={processing}
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <span className="openai-badge">GPT-4</span>
                          Clave API de OpenAI
                        </label>
                        <input
                          type="password"
                          value={apiKeys.openai}
                          onChange={(e) => updateApiKey('openai', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="sk-..."
                          disabled={processing}
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <span className="gemini-badge">Gemini</span>
                          Clave API de Gemini
                        </label>
                        <input
                          type="password"
                          value={apiKeys.gemini}
                          onChange={(e) => updateApiKey('gemini', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="AIza..."
                          disabled={processing}
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <span className="perplexity-badge">Perplexity</span>
                          Clave API de Perplexity
                        </label>
                        <input
                          type="password"
                          value={apiKeys.perplexity}
                          onChange={(e) => updateApiKey('perplexity', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="pplx-..."
                          disabled={processing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Estado de APIs */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Estado de Conexiones</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(apiKeys).map(([llm, key]) => (
                        <span 
                          key={llm}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            key ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {llm.toUpperCase()}: {key ? '✓ Conectado' : '○ Desconectado'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {errors.general && (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                      {errors.general}
                    </div>
                  )}

                  {/* Botones */}
                  <button
                    onClick={startCollaboration}
                    disabled={processing}
                    className={`w-full py-4 px-6 text-white font-medium rounded-lg transition-all duration-200 ${
                      processing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 processing-glow'
                    }`}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        🧠 Colaborando... Paso {step}/6
                      </span>
                    ) : (
                      '🚀 Iniciar Colaboración Multi-IA'
                    )}
                  </button>

                  {processing && (
                    <button
                      onClick={cancelProcess}
                      className="w-full py-3 px-6 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                      ⏹️ Cancelar Proceso
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={clearMemory}
                      disabled={processing}
                      className="flex-1 py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      🧹 Limpiar Memoria
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="space-y-6">
              <div className={`bg-gray-900 rounded-lg overflow-hidden ${processing ? 'terminal-glow' : ''}`}>
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    🧠 Colaboración Multi-IA - Pixan.ai
                  </div>
                </div>
                
                <div className="h-[700px] overflow-y-auto p-4 font-mono text-sm">
                  {terminal.map((log, idx) => (
                    <div key={log.id} className="mb-4">
                      <div className="flex items-center mb-1">
                        <span className={`llm-badge ${log.type}-badge`}>
                          {log.type.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-xs">
                          [{log.time}]
                        </span>
                      </div>
                      <div className="text-gray-300 whitespace-pre-wrap pl-4 leading-relaxed">
                        {log.msg}
                      </div>
                    </div>
                  ))}
                  
                  {processing && (
                    <div className="flex items-center text-gray-400">
                      <div className="animate-pulse text-purple-400">🧠 Procesando...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Respuesta Final */}
          {finalResponse && (
            <div className="mt-8 space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Respuesta Consolidada Multi-IA</h3>
                  <button
                    onClick={copyResponse}
                    className="flex items-center px-4 py-2 text-sm bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    {copied ? (
                      <>
                        <span className="mr-2 text-green-500">✓</span>
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📋</span>
                        Copiar Respuesta
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-inner">
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {finalResponse}
                  </div>
                </div>
              </div>

              {/* Métricas de Colaboración */}
              {metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-purple-600">{metrics.llmsUsed}/{metrics.totalLlmsAvailable}</div>
                    <div className="text-sm text-gray-600">LLMs Activos</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-cyan-600">{metrics.processingTime}s</div>
                    <div className="text-sm text-gray-600">Tiempo Total</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-green-600">{metrics.consolidationUsed ? '✓' : '○'}</div>
                    <div className="text-sm text-gray-600">Consolidación</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-orange-600">{metrics.memoryEnabled}</div>
                    <div className="text-sm text-gray-600">Con Memoria</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explicación de la Tecnología */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                🧠 Cómo Funciona la LLM Colaborativa
              </h2>
              <div className="text-center mb-8">
                <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Inteligencia Artificial Colaborativa de Nueva Generación 🚀
                </span>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Primera plataforma mundial que orquesta 4 IAs líderes trabajando simultáneamente, 
                con consolidación inteligente y memoria conversacional avanzada
              </p>
            </div>

            <div className="space-y-8">
              {/* Arquitectura */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  ⚡ Arquitectura de Colaboración Simultánea
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                      <span className="claude-badge">Claude</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Supervisor & Consolidador</h4>
                        <p className="text-sm text-gray-700">Analiza todas las respuestas, elimina alucinaciones y genera síntesis final</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                      <span className="openai-badge">GPT-4</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Analista Profundo</h4>
                        <p className="text-sm text-gray-700">Procesamiento avanzado con memoria conversacional completa</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                      <span className="gemini-badge">Gemini</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Motor de Innovación</h4>
                        <p className="text-sm text-gray-700">Perspectivas creativas y multimodales con contexto extendido</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                      <span className="perplexity-badge">Perplexity</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Investigador en Tiempo Real</h4>
                        <p className="text-sm text-gray-700">Acceso a información actualizada y verificación de datos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Innovaciones Tecnológicas */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  🚀 Innovaciones Tecnológicas Exclusivas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🧠 Memoria Selectiva</h4>
                    <p className="text-sm">GPT-4, Gemini y Perplexity mantienen contexto conversacional. Claude permanece neutro para consolidación objetiva.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold mb-2">⚡ Procesamiento Paralelo</h4>
                    <p className="text-sm">Consultas simultáneas a todos los LLMs disponibles para máxima velocidad.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🎯 Anti-Alucinación</h4>
                    <p className="text-sm">Claude verifica consistencia entre respuestas y elimina información contradictoria.</p>
                  </div>
                </div>
              </div>

              {/* Casos de Uso */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  💡 Casos de Uso Perfectos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-800">🔬 Investigación Compleja</h4>
                    <p className="text-sm text-gray-700">Combina datos actuales de Perplexity, análisis profundo de GPT-4, creatividad de Gemini, supervisión de Claude</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-800">💼 Decisiones Empresariales</h4>
                    <p className="text-sm text-gray-700">Múltiples perspectivas consolidadas en una recomendación final verificada</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800">🎨 Proyectos Creativos</h4>
                    <p className="text-sm text-gray-700">Innovación de Gemini, refinamiento de GPT-4, investigación de Perplexity, síntesis de Claude</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-800">📚 Análisis Académico</h4>
                    <p className="text-sm text-gray-700">Rigor científico con múltiples enfoques metodológicos y verificación cruzada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}