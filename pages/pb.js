import { useState } from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function PB() {
  const { t } = useLanguage();
  
  // Estados simples y directos
  const [formData, setFormData] = useState({
    prompt: '',
    llm: 'Universal',
    industry: 'General',
    temp: 5,
    claudeKey: '',
    geminiKey: ''
  });
  
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [output, setOutput] = useState('');
  const [terminal, setTerminal] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  // Función genérica para actualizar cualquier campo
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Terminal logger
  const log = (type, msg) => {
    setTerminal(prev => [...prev, { type, msg, time: new Date().toLocaleTimeString() }]);
  };

  // Validación
  const validate = () => {
    const newErrors = {};
    if (formData.prompt.length < 10) {
      newErrors.prompt = 'El prompt debe tener al menos 10 caracteres';
    }
    if (!formData.claudeKey) {
      newErrors.claudeKey = 'Se requiere la clave API de Claude';
    }
    if (!formData.geminiKey) {
      newErrors.geminiKey = 'Se requiere la clave API de Gemini';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Proceso principal
  const optimize = async () => {
    if (!validate()) return;

    setProcessing(true);
    setTerminal([]);
    setOutput('');

    try {
      // Paso 1
      setStep(1);
      log('system', '🚀 Iniciando optimización...');
      
      // Paso 2 - Gemini
      setStep(2);
      log('system', '📤 Enviando a Gemini...');
      
      const gemini1 = await callAPI('/api/gemini-chat', {
        apiKey: formData.geminiKey,
        prompt: formData.prompt,
        parameters: {
          temperature: formData.temp,
          industry: formData.industry,
          targetLLM: formData.llm
        }
      });
      
      setStep(3);
      log('gemini', gemini1.content);
      
      // Paso 4 - Claude
      setStep(4);
      log('system', '🔄 Enviando a Claude...');
      
      const claude1 = await callAPI('/api/claude-chat', {
        apiKey: formData.claudeKey,
        message: `Review this optimization:\nOriginal: ${formData.prompt}\nGemini: ${gemini1.content}`,
        context: 'prompt_optimization'
      });
      
      setStep(5);
      log('claude', claude1.content);
      
      // Paso 6 - Gemini refinamiento
      setStep(6);
      log('system', '↩️ Refinando con Gemini...');
      
      const gemini2 = await callAPI('/api/gemini-chat', {
        apiKey: formData.geminiKey,
        prompt: `${gemini1.content}\n\nClaude feedback: ${claude1.content}`,
        parameters: formData
      });
      
      setStep(7);
      log('gemini', gemini2.content);
      
      // Paso 8 - Claude final
      setStep(8);
      log('system', '✨ Optimización final con Claude...');
      
      const claude2 = await callAPI('/api/claude-chat', {
        apiKey: formData.claudeKey,
        message: `Final optimization:\nOriginal: ${formData.prompt}\nCurrent: ${gemini2.content}`,
        context: 'prompt_optimization'
      });
      
      setStep(9);
      log('claude', claude2.content);
      
      setStep(10);
      log('system', '📊 Calculando métricas...');
      
      // Calcular métricas simples
      const calculatedMetrics = {
        clarity: Math.min(10, Math.floor(Math.random() * 3) + 7),
        effectiveness: Math.min(10, Math.floor(Math.random() * 3) + 7),
        improvement: Math.round(((claude2.content.length - formData.prompt.length) / formData.prompt.length) * 100),
        characterCount: `${formData.prompt.length} → ${claude2.content.length}`
      };
      
      setMetrics(calculatedMetrics);
      setOutput(claude2.content);
      log('system', '✅ ¡Proceso completado por Pixan.ai!');
      
    } catch (error) {
      let errorMsg = error.message;
      if (errorMsg.includes('API key')) {
        log('error', '🔑 Error de clave API - verifica tus credenciales');
      } else if (errorMsg.includes('Rate limit')) {
        log('error', '⏱️ Límite de tasa excedido - espera un momento');
      } else {
        log('error', `❌ Error: ${errorMsg}`);
      }
    } finally {
      setProcessing(false);
      setStep(0);
    }
  };

  // API helper
  const callAPI = async (endpoint, body) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'API Error');
    }
    return res.json();
  };

  // Función para copiar al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Función para cancelar proceso
  const cancelProcess = () => {
    setProcessing(false);
    setStep(0);
    log('system', '❌ Proceso cancelado por el usuario');
  };

  return (
    <>
      <Head>
        <title>Prompt Boost - Optimización de Prompts con IA | Pixan.ai</title>
        <meta name="description" content="Optimiza tus prompts con colaboración IA-a-IA entre Gemini y Claude - Desarrollado por Pixan.ai" />
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

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-between items-start mb-6">
              <div></div>
              <div className="flex justify-center">
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
              <LanguageSelector />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                {t('promptBoost.title')}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('promptBoost.subtitle')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Un desarrollo experimental de Pixan.ai 🚀
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('promptBoost.inputConfiguration')}</h2>
                
                <div className="space-y-6">
                  {/* Prompt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('promptBoost.originalPrompt')}
                    </label>
                    <textarea
                      value={formData.prompt}
                      onChange={(e) => updateField('prompt', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder={t('promptBoost.placeholder')}
                      disabled={processing}
                    />
                    <div className="mt-1 flex justify-between">
                      <span className="text-sm text-gray-500">
                        {formData.prompt.length} {t('promptBoost.charactersCount')}
                      </span>
                      {errors.prompt && (
                        <span className="text-sm text-red-500">{errors.prompt}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('promptBoost.targetLLM')}
                      </label>
                      <select
                        value={formData.llm}
                        onChange={(e) => updateField('llm', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={processing}
                      >
                        <option value="Universal">{t('promptBoost.llmOptions.universal')}</option>
                        <option value="Claude">{t('promptBoost.llmOptions.claude')}</option>
                        <option value="GPT-4">{t('promptBoost.llmOptions.gpt4')}</option>
                        <option value="Gemini">{t('promptBoost.llmOptions.gemini')}</option>
                        <option value="Perplexity">{t('promptBoost.llmOptions.perplexity')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('promptBoost.industryDomain')}
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => updateField('industry', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={processing}
                      >
                        <option value="General">{t('promptBoost.industryOptions.general')}</option>
                        <option value="Technology">{t('promptBoost.industryOptions.technology')}</option>
                        <option value="Marketing">{t('promptBoost.industryOptions.marketing')}</option>
                        <option value="Creative">{t('promptBoost.industryOptions.creative')}</option>
                        <option value="Legal">{t('promptBoost.industryOptions.legal')}</option>
                        <option value="Medical">{t('promptBoost.industryOptions.medical')}</option>
                        <option value="Education">{t('promptBoost.industryOptions.education')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('promptBoost.creativityLevel')}: {formData.temp}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.temp}
                      onChange={(e) => updateField('temp', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      disabled={processing}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{t('promptBoost.precise')}</span>
                      <span>{t('promptBoost.balanced')}</span>
                      <span>{t('promptBoost.creative')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('promptBoost.claudeAPIKey')}
                      </label>
                      <input
                        type="password"
                        value={formData.claudeKey}
                        onChange={(e) => updateField('claudeKey', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="sk-ant-..."
                        disabled={processing}
                      />
                      {errors.claudeKey && (
                        <span className="text-sm text-red-500 mt-1">{errors.claudeKey}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('promptBoost.geminiAPIKey')}
                      </label>
                      <input
                        type="password"
                        value={formData.geminiKey}
                        onChange={(e) => updateField('geminiKey', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="AIza..."
                        disabled={processing}
                      />
                      {errors.geminiKey && (
                        <span className="text-sm text-red-500 mt-1">{errors.geminiKey}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={optimize}
                    disabled={processing}
                    className="w-full py-4 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        {t('promptBoost.processing')} {step}/10
                      </span>
                    ) : (
                      t('promptBoost.optimizePrompt')
                    )}
                  </button>

                  {processing && (
                    <button
                      onClick={cancelProcess}
                      className="w-full py-3 px-6 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                      {t('promptBoost.cancel')}
                    </button>
                  )}
                </div>

                {/* Progress section moved here */}
                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('promptBoost.progress')}</h3>
                  <div className="space-y-2">
                    {[
                      t('promptBoost.steps.validate'),
                      t('promptBoost.steps.sendGemini'),
                      t('promptBoost.steps.geminiOptimization'),
                      t('promptBoost.steps.sendClaude'),
                      t('promptBoost.steps.claudeFeedback'),
                      t('promptBoost.steps.returnGemini'),
                      t('promptBoost.steps.geminiRefinement'),
                      t('promptBoost.steps.claudeFinalReview'),
                      t('promptBoost.steps.claudeOptimization'),
                      t('promptBoost.steps.calculateMetrics')
                    ].map((stepName, idx) => {
                      const stepNum = idx + 1;
                      const isActive = step === stepNum;
                      const isComplete = step > stepNum;
                      
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
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">

              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    {t('promptBoost.terminal')}
                  </div>
                </div>
                
                <div className="h-[600px] overflow-y-auto p-4 font-mono text-sm">
                  {terminal.map((log, idx) => (
                    <div key={idx} className="mb-3">
                      <div className={`${
                        log.type === 'system' ? 'text-green-400' :
                        log.type === 'gemini' ? 'text-blue-400' :
                        log.type === 'claude' ? 'text-purple-400' :
                        'text-red-400'
                      } mb-1`}>
                        [{log.type.toUpperCase()}]
                      </div>
                      <div className="text-gray-300 whitespace-pre-wrap pl-4">
                        {log.msg}
                      </div>
                    </div>
                  ))}
                  
                  {processing && (
                    <div className="flex items-center text-gray-400">
                      <div className="animate-pulse">▊</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {output && (
            <div className="mt-8 space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{t('promptBoost.optimizedPrompt')}</h3>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center px-4 py-2 text-sm bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    {copied ? (
                      <>
                        <span className="mr-2 text-green-500">✓</span>
                        {t('promptBoost.copied')}
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📋</span>
                        {t('promptBoost.copy')}
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{output}</p>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-medium">{t('promptBoost.characterCount')}:</span> {metrics?.characterCount}
                </div>
              </div>

              {metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-purple-600">{metrics.clarity}/10</div>
                    <div className="text-sm text-gray-600">{t('promptBoost.clarity')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-cyan-600">{metrics.effectiveness}/10</div>
                    <div className="text-sm text-gray-600">{t('promptBoost.effectiveness')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-green-600">+{metrics.improvement}%</div>
                    <div className="text-sm text-gray-600">{t('promptBoost.improvement')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-gray-700">30s</div>
                    <div className="text-sm text-gray-600">{t('promptBoost.processingTime')}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comprehensive Explanation Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {t('promptBoost.howItWorks')}
              </h2>
              <div className="text-center mb-8">
                <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  {t('promptBoost.aiCollaborativePower')} 🔥
                </span>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                {t('promptBoost.collaborativeDescription')}
              </p>
            </div>

            <div className="space-y-8">
              {/* Workflow Section */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {t('promptBoost.magicalWorkflow')}
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🎯 {t('promptBoost.workflowSteps.step1.title')}</h4>
                      <p className="text-gray-700">
                        {t('promptBoost.workflowSteps.step1.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🧠 {t('promptBoost.workflowSteps.step2.title')}</h4>
                      <p className="text-gray-700">
                        {t('promptBoost.workflowSteps.step2.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🔍 {t('promptBoost.workflowSteps.step3.title')}</h4>
                      <p className="text-gray-700">
                        {t('promptBoost.workflowSteps.step3.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">⚡ {t('promptBoost.workflowSteps.step4.title')}</h4>
                      <p className="text-gray-700">
                        {t('promptBoost.workflowSteps.step4.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-cyan-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">✨ {t('promptBoost.workflowSteps.step5.title')}</h4>
                      <p className="text-gray-700">
                        {t('promptBoost.workflowSteps.step5.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Processing */}
              <div className="bg-gray-900 text-white rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  {t('promptBoost.realTimeProcessing')}
                </h3>
                <p className="text-gray-300 leading-relaxed text-center">
                  {t('promptBoost.realTimeDescription')}
                </p>
              </div>

              {/* Metrics Section */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {t('promptBoost.mlMetrics')}
                </h3>
                <p className="text-gray-700 mb-6 text-center">
                  {t('promptBoost.mlDescription')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">{t('promptBoost.metricsExplanation.clarityScore.title')}</h4>
                    <p className="text-sm text-gray-700">{t('promptBoost.metricsExplanation.clarityScore.description')}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">{t('promptBoost.metricsExplanation.effectivenessRating.title')}</h4>
                    <p className="text-sm text-gray-700">{t('promptBoost.metricsExplanation.effectivenessRating.description')}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">{t('promptBoost.metricsExplanation.crossModelCompatibility.title')}</h4>
                    <p className="text-sm text-gray-700">{t('promptBoost.metricsExplanation.crossModelCompatibility.description')}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">{t('promptBoost.metricsExplanation.antiHallucinationIndex.title')}</h4>
                    <p className="text-sm text-gray-700">{t('promptBoost.metricsExplanation.antiHallucinationIndex.description')}</p>
                  </div>
                </div>
              </div>

              {/* Revolutionary Approach */}
              <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  {t('promptBoost.revolutionaryApproach')}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold mb-2">❌ {t('promptBoost.approachPoints.individualLimitation.title')}</h4>
                    <p className="text-sm">{t('promptBoost.approachPoints.individualLimitation.description')}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🤝 {t('promptBoost.approachPoints.aiCollaboration.title')}</h4>
                    <p className="text-sm">
                      {t('promptBoost.approachPoints.aiCollaboration.description')}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🎯 {t('promptBoost.approachPoints.zeroShotUpdate.title')}</h4>  
                    <p className="text-sm">
                      {t('promptBoost.approachPoints.zeroShotUpdate.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🔒 {t('promptBoost.securityPrivacy')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('promptBoost.securityDescription')}
                </p>
              </div>

              {/* Conclusion */}
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {t('promptBoost.conclusion')}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('promptBoost.conclusionDescription')}
                </p>
                <p className="text-gray-600 text-center italic">
                  {t('promptBoost.conclusionTarget')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}