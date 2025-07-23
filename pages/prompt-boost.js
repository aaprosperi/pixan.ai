import React, { useState, useCallback, useRef, useEffect } from 'react';
import Head from 'next/head';
import { AlertCircle, Copy, Check, Loader2, Terminal } from 'lucide-react';

export default function PromptBoost() {
  const [appState, setAppState] = useState({
    form: {
      originalPrompt: '',
      targetLLM: 'Universal',
      industry: 'General',
      temperature: 5,
      claudeApiKey: '',
      geminiApiKey: ''
    },
    processing: {
      isActive: false,
      currentStep: 0,
      status: 'ready',
      startTime: null,
      messages: []
    },
    results: {
      finalPrompt: '',
      metrics: null,
      visible: false
    }
  });

  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const terminalRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleInputChange = useCallback((field, value) => {
    setAppState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: value
      }
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const InputForm = () => {
    const validateForm = () => {
      const newErrors = {};
      
      if (appState.form.originalPrompt.length < 10) {
        newErrors.originalPrompt = 'El prompt debe tener al menos 10 caracteres';
      }
      
      if (!appState.form.claudeApiKey) {
        newErrors.claudeApiKey = 'Se requiere la clave API de Claude';
      }
      
      if (!appState.form.geminiApiKey) {
        newErrors.geminiApiKey = 'Se requiere la clave API de Gemini';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        startProcessing();
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu Prompt Original
          </label>
          <textarea
            value={appState.form.originalPrompt}
            onChange={(e) => handleInputChange('originalPrompt', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Escribe aquí el prompt que quieres optimizar..."
            disabled={appState.processing.isActive}
          />
          <div className="mt-1 flex justify-between">
            <span className="text-sm text-gray-500">
              {appState.form.originalPrompt.length} caracteres
            </span>
            {errors.originalPrompt && (
              <span className="text-sm text-red-500">{errors.originalPrompt}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LLM Objetivo
            </label>
            <select
              value={appState.form.targetLLM}
              onChange={(e) => handleInputChange('targetLLM', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={appState.processing.isActive}
            >
              <option value="Universal">Universal</option>
              <option value="Claude">Claude</option>
              <option value="GPT-4">GPT-4</option>
              <option value="Gemini">Gemini</option>
              <option value="Perplexity">Perplexity</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industria/Dominio
            </label>
            <select
              value={appState.form.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={appState.processing.isActive}
            >
              <option value="General">General</option>
              <option value="Technology">Tecnología</option>
              <option value="Marketing">Marketing</option>
              <option value="Creative">Creativo</option>
              <option value="Legal">Legal</option>
              <option value="Medical">Médico</option>
              <option value="Education">Educación</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nivel de Creatividad: {appState.form.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={appState.form.temperature}
            onChange={(e) => handleInputChange('temperature', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={appState.processing.isActive}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Preciso</span>
            <span>Balanceado</span>
            <span>Creativo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clave API de Claude
            </label>
            <input
              type="password"
              value={appState.form.claudeApiKey}
              onChange={(e) => handleInputChange('claudeApiKey', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="sk-ant-..."
              disabled={appState.processing.isActive}
            />
            {errors.claudeApiKey && (
              <span className="text-sm text-red-500 mt-1">{errors.claudeApiKey}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clave API de Gemini
            </label>
            <input
              type="password"
              value={appState.form.geminiApiKey}
              onChange={(e) => handleInputChange('geminiApiKey', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="AIza..."
              disabled={appState.processing.isActive}
            />
            {errors.geminiApiKey && (
              <span className="text-sm text-red-500 mt-1">{errors.geminiApiKey}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={appState.processing.isActive}
          className="w-full py-4 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {appState.processing.isActive ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" size={20} />
              Procesando Paso {appState.processing.currentStep}/10
            </span>
          ) : (
            'Optimizar Prompt'
          )}
        </button>

        {appState.processing.isActive && (
          <button
            type="button"
            onClick={cancelProcessing}
            className="w-full py-3 px-6 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Cancelar
          </button>
        )}
      </form>
    );
  };

  const AITerminal = () => {
    useEffect(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, [appState.processing.messages]);

    const getMessageColor = (type) => {
      switch (type) {
        case 'system': return 'text-green-400';
        case 'gemini': return 'text-blue-400';
        case 'claude': return 'text-purple-400';
        case 'error': return 'text-red-400';
        default: return 'text-gray-400';
      }
    };

    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Terminal size={16} className="mr-2" />
            Terminal IA - Pixan.ai
          </div>
        </div>
        
        <div
          ref={terminalRef}
          className="h-96 overflow-y-auto p-4 font-mono text-sm"
        >
          {appState.processing.messages.map((msg, idx) => (
            <div key={idx} className="mb-3">
              <div className={`${getMessageColor(msg.type)} mb-1`}>
                [{msg.type.toUpperCase()}]
              </div>
              <div className="text-gray-300 whitespace-pre-wrap pl-4">
                {msg.content}
              </div>
            </div>
          ))}
          
          {appState.processing.isActive && (
            <div className="flex items-center text-gray-400">
              <div className="animate-pulse">▊</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ProgressIndicator = () => {
    const steps = [
      'Validar entradas',
      'Enviar a Gemini',
      'Optimización de Gemini',
      'Enviar a Claude',
      'Retroalimentación de Claude',
      'Regresar a Gemini',
      'Refinamiento de Gemini',
      'Revisión final de Claude',
      'Optimización de Claude',
      'Calcular métricas'
    ];

    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progreso</h3>
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = appState.processing.currentStep === stepNum;
            const isComplete = appState.processing.currentStep > stepNum;
            
            return (
              <div key={idx} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                  isComplete ? 'bg-green-500 text-white' :
                  isActive ? 'bg-blue-500 text-white animate-pulse' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {isComplete ? '✓' : stepNum}
                </div>
                <span className={`text-sm ${
                  isActive ? 'text-gray-900 font-medium' : 'text-gray-600'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ResultsPanel = () => {
    const handleCopy = () => {
      navigator.clipboard.writeText(appState.results.finalPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (!appState.results.visible) return null;

    return (
      <div className="mt-8 space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Prompt Optimizado</h3>
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 text-sm bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              {copied ? (
                <>
                  <Check size={16} className="mr-2 text-green-500" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" />
                  Copiar
                </>
              )}
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-wrap">{appState.results.finalPrompt}</p>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Conteo de caracteres:</span> {appState.results.metrics?.characterCount}
          </div>
        </div>

        <MetricsCard />
      </div>
    );
  };

  const MetricsCard = () => {
    const { metrics } = appState.results;
    if (!metrics) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-purple-600">{metrics.clarity}/10</div>
          <div className="text-sm text-gray-600">Claridad</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-cyan-600">{metrics.effectiveness}/10</div>
          <div className="text-sm text-gray-600">Efectividad</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-green-600">+{metrics.improvement}%</div>
          <div className="text-sm text-gray-600">Mejora</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-gray-700">{metrics.processingTime}s</div>
          <div className="text-sm text-gray-600">Tiempo de Proceso</div>
        </div>
      </div>
    );
  };

  const addMessage = useCallback((type, content) => {
    setAppState(prev => ({
      ...prev,
      processing: {
        ...prev.processing,
        messages: [...prev.processing.messages, { type, content, timestamp: Date.now() }]
      }
    }));
  }, []);

  const updateStep = useCallback((step) => {
    setAppState(prev => ({
      ...prev,
      processing: {
        ...prev.processing,
        currentStep: step
      }
    }));
  }, []);

  const startProcessing = async () => {
    abortControllerRef.current = new AbortController();
    
    setAppState(prev => ({
      ...prev,
      processing: {
        isActive: true,
        currentStep: 1,
        status: 'processing',
        startTime: Date.now(),
        messages: []
      },
      results: {
        finalPrompt: '',
        metrics: null,
        visible: false
      }
    }));

    try {
      addMessage('system', '🚀 Iniciando proceso de optimización por Pixan.ai...');
      
      updateStep(2);
      addMessage('system', '📤 Enviando prompt original a Gemini AI...');
      
      const geminiResponse1 = await callGeminiAPI(
        appState.form.originalPrompt,
        'Please optimize this prompt for better clarity and effectiveness. Consider the target LLM, industry context, and desired output format.'
      );
      
      updateStep(3);
      addMessage('gemini', geminiResponse1);
      
      updateStep(4);
      addMessage('system', '🔄 Enviando sugerencia de Gemini a Claude para validación...');
      
      const claudeResponse1 = await callClaudeAPI(
        `Please review and provide feedback on this prompt optimization:\n\nOriginal: ${appState.form.originalPrompt}\n\nGemini's Optimization: ${geminiResponse1}\n\nProvide specific feedback for improvement.`
      );
      
      updateStep(5);
      addMessage('claude', claudeResponse1);
      
      updateStep(6);
      addMessage('system', '↩️ Enviando retroalimentación de Claude de vuelta a Gemini...');
      
      const geminiResponse2 = await callGeminiAPI(
        geminiResponse1,
        `Based on this feedback from Claude, please refine your optimization:\n\n${claudeResponse1}`
      );
      
      updateStep(7);
      addMessage('gemini', geminiResponse2);
      
      updateStep(8);
      addMessage('system', '✨ Enviando versión refinada a Claude para optimización final...');
      
      const claudeResponse2 = await callClaudeAPI(
        `Please provide the final optimized version of this prompt:\n\nOriginal: ${appState.form.originalPrompt}\n\nCurrent version: ${geminiResponse2}\n\nTarget LLM: ${appState.form.targetLLM}\nIndustry: ${appState.form.industry}`
      );
      
      updateStep(9);
      addMessage('claude', claudeResponse2);
      
      updateStep(10);
      addMessage('system', '📊 Calculando métricas de optimización...');
      
      const processingTime = Math.round((Date.now() - appState.processing.startTime) / 1000);
      const metrics = calculateMetrics(appState.form.originalPrompt, claudeResponse2, processingTime);
      
      setAppState(prev => ({
        ...prev,
        processing: {
          ...prev.processing,
          status: 'complete',
          isActive: false
        },
        results: {
          finalPrompt: claudeResponse2,
          metrics: metrics,
          visible: true
        }
      }));
      
      addMessage('system', '✅ ¡Optimización completada por Pixan.ai! Desplázate hacia abajo para ver los resultados.');
      
    } catch (error) {
      if (error.name === 'AbortError') {
        addMessage('system', '❌ Proceso cancelado por el usuario.');
      } else {
        addMessage('error', `Error: ${error.message}`);
      }
      
      setAppState(prev => ({
        ...prev,
        processing: {
          ...prev.processing,
          status: 'error',
          isActive: false
        }
      }));
    }
  };

  const callGeminiAPI = async (prompt, context) => {
    const response = await fetch('/api/gemini-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: appState.form.geminiApiKey,
        prompt: `${context}\n\n${prompt}`,
        parameters: {
          temperature: appState.form.temperature,
          industry: appState.form.industry,
          targetLLM: appState.form.targetLLM
        }
      }),
      signal: abortControllerRef.current.signal
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Gemini API error');
    }

    const data = await response.json();
    return data.content;
  };

  const callClaudeAPI = async (message) => {
    const response = await fetch('/api/claude-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: appState.form.claudeApiKey,
        message: message,
        context: 'prompt_optimization'
      }),
      signal: abortControllerRef.current.signal
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Claude API error');
    }

    const data = await response.json();
    return data.content;
  };

  const calculateMetrics = (original, optimized, processingTime) => {
    const calculateClarity = (text) => {
      const factors = {
        hasStructure: /\n|\•|\.|\?/.test(text) ? 2 : 0,
        hasSpecificity: text.length > 50 ? 2 : 1,
        hasClearObjective: /what|how|create|generate|analyze/i.test(text) ? 2 : 0,
        properLength: text.length > 30 && text.length < 500 ? 2 : 1,
        hasContext: /context|background|given|assuming/i.test(text) ? 2 : 0
      };
      
      return Math.min(10, Object.values(factors).reduce((a, b) => a + b, 0));
    };
    
    const calculateEffectiveness = (text) => {
      const factors = {
        hasExamples: /example|e\.g\.|for instance/i.test(text) ? 2 : 0,
        hasConstraints: /must|should|avoid|limit/i.test(text) ? 2 : 0,
        hasFormat: /format|structure|style/i.test(text) ? 2 : 0,
        isActionable: /create|write|analyze|explain/i.test(text) ? 2 : 0,
        hasOutputSpec: /output|result|response/i.test(text) ? 2 : 0
      };
      
      return Math.min(10, Object.values(factors).reduce((a, b) => a + b, 0));
    };
    
    const clarity = calculateClarity(optimized);
    const effectiveness = calculateEffectiveness(optimized);
    const improvement = Math.round(((optimized.length - original.length) / original.length) * 100);
    
    return {
      clarity,
      effectiveness,
      improvement: Math.abs(improvement),
      processingTime,
      characterCount: `${original.length} → ${optimized.length}`
    };
  };

  const cancelProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setAppState(prev => ({
      ...prev,
      processing: {
        ...prev.processing,
        isActive: false,
        status: 'cancelled'
      }
    }));
  };

  return (
    <>
      <Head>
        <title>Prompt Boost - Optimización de Prompts con IA | Pixan.ai</title>
        <meta name="description" content="Optimiza tus prompts con colaboración IA-a-IA entre Gemini y Claude - Desarrollado por Pixan.ai" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                Prompt Boost
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Optimiza tus prompts con colaboración IA-a-IA entre Gemini y Claude
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Un desarrollo experimental de Pixan.ai 🚀
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuración de Entrada</h2>
                <InputForm />
              </div>
            </div>

            <div className="space-y-6">
              <ProgressIndicator />
              <AITerminal />
            </div>
          </div>

          <ResultsPanel />

          {/* Comprehensive Explanation Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                ¿Cómo funciona Prompt Boost?
              </h2>
              <div className="text-center mb-8">
                <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  El poder de la IA colaborativa 🔥
                </span>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Prompt Boost es un orquestador colaborativo AI-to-AI donde dos de los modelos más avanzados del planeta trabajan juntos para perfeccionar tu prompt en tiempo real
              </p>
            </div>

            <div className="space-y-8">
              {/* Workflow Section */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  El Flujo de Trabajo Mágico (Paso a Paso)
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🎯 Tu Entrada + Contexto</h4>
                      <p className="text-gray-700">
                        Capturas tu prompt y le das contexto con metadata específica: LLM objetivo, industria, temperatura de creatividad. 
                        Esto le da a nuestros algoritmos el framework necesario para la optimización.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🧠 Gemini da el primer paso</h4>
                      <p className="text-gray-700">
                        Tu prompt se envía primero a Gemini AI. Gemini analiza la estructura, identifica brechas de especificidad, 
                        y propone la primera iteración de optimización usando su massive training dataset.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🔍 Claude entra en acción</h4>
                      <p className="text-gray-700">
                        Claude AI (Anthropic) recibe la sugerencia de Gemini y la pasa por su sistema validation & feedback. 
                        Claude identifica si la sugerencia de Gemini es sólida o necesita refinamiento.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">⚡ Iteración AI-to-AI</h4>
                      <p className="text-gray-700">
                        Basado en la retroalimentación de Claude, Gemini genera una segunda iteración más refinada. 
                        Es literalmente como ver dos IAs haciendo pair programming para tu prompt.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-cyan-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">✨ El toque final de Claude</h4>
                      <p className="text-gray-700">
                        Claude toma la segunda versión de Gemini y la pasa por su anti-hallucination engine y cross-LLM compatibility optimizer. 
                        El resultado: un prompt que no solo es más claro, sino que funciona óptimamente en diferentes modelos de IA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Processing */}
              <div className="bg-gray-900 text-white rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Real-time processing
                </h3>
                <p className="text-gray-300 leading-relaxed text-center">
                  Todo este flujo de trabajo sucede en real-time streaming. Puedes ver literalmente cómo las dos IAs conversan entre ellas 
                  en nuestra terminal - es como ser testigo silencioso mientras dos neural networks colaboran.
                </p>
              </div>

              {/* Metrics Section */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Métricas de Machine Learning que Importan
                </h3>
                <p className="text-gray-700 mb-6 text-center">
                  Al final del proceso, nuestros algoritmos calculan métricas avanzadas:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Clarity Score</h4>
                    <p className="text-sm text-gray-700">Análisis de especificidad y estructura semántica</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Effectiveness Rating</h4>
                    <p className="text-sm text-gray-700">Basado en prompt engineering best practices</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Cross-Model Compatibility</h4>
                    <p className="text-sm text-gray-700">Qué tan bien funciona en diferentes LLMs</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Anti-Hallucination Index</h4>
                    <p className="text-sm text-gray-700">Reducción de probabilidad de respuestas inconsistentes</p>
                  </div>
                </div>
              </div>

              {/* Revolutionary Approach */}
              <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  ¿Por qué nuestro enfoque es revolucionario?
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold mb-2">❌ Limitación de IA Individual</h4>
                    <p className="text-sm">Un solo modelo tiene sus sesgos y limitaciones inherentes.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🤝 Colaboración AI-to-AI</h4>
                    <p className="text-sm">
                      Dos modelos diferentes (la escala masiva de Gemini + el enfoque de seguridad de Claude) 
                      se complementan para eliminar debilidades mutuas.
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🎯 Actualización Zero-Shot to Few-Shot</h4>  
                    <p className="text-sm">
                      Tu prompt básico se convierte en una obra maestra diseñada que da resultados más consistentes y precisos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🔒 Security & privacy by design
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Tus claves API se manejan session-only (sin persistencia). Los prompts se procesan in-memory sin registro. 
                  Es como tener un espacio de trabajo privado donde puedes experimentar sin preocuparte por filtración de datos.
                </p>
              </div>

              {/* Conclusion */}
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  La conclusión
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Prompt Boost es básicamente tener dos ingenieros de IA optimizando tu prompt en dos redes neuronales 
                  mientras tú ves el proceso en vivo. Es tecnología de colaboración combinada con prompt engineering 
                  y transparencia en tiempo real.
                </p>
                <p className="text-gray-600 text-center italic">
                  Perfecto para desarrolladores, marketers, creadores de contenido, y cualquier usuario avanzado 
                  que quiera extraer el máximo valor de sus interacciones con IA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
          border-radius: 50%;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
}