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

  const InputForm = () => {
    const handleInputChange = (field, value) => {
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
    };

    const validateForm = () => {
      const newErrors = {};
      
      if (appState.form.originalPrompt.length < 10) {
        newErrors.originalPrompt = 'Prompt must be at least 10 characters';
      }
      
      if (!appState.form.claudeApiKey) {
        newErrors.claudeApiKey = 'Claude API key is required';
      }
      
      if (!appState.form.geminiApiKey) {
        newErrors.geminiApiKey = 'Gemini API key is required';
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
            Original Prompt
          </label>
          <textarea
            value={appState.form.originalPrompt}
            onChange={(e) => handleInputChange('originalPrompt', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Enter your prompt to optimize..."
            disabled={appState.processing.isActive}
          />
          <div className="mt-1 flex justify-between">
            <span className="text-sm text-gray-500">
              {appState.form.originalPrompt.length} characters
            </span>
            {errors.originalPrompt && (
              <span className="text-sm text-red-500">{errors.originalPrompt}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target LLM
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
              Industry/Domain
            </label>
            <select
              value={appState.form.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={appState.processing.isActive}
            >
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Marketing">Marketing</option>
              <option value="Creative">Creative</option>
              <option value="Legal">Legal</option>
              <option value="Medical">Medical</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature Level: {appState.form.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={appState.form.temperature}
            onChange={(e) => handleInputChange('temperature', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={appState.processing.isActive}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Precise</span>
            <span>Balanced</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claude API Key
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
              Gemini API Key
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
              Processing Step {appState.processing.currentStep}/10
            </span>
          ) : (
            'Optimize Prompt'
          )}
        </button>

        {appState.processing.isActive && (
          <button
            type="button"
            onClick={cancelProcessing}
            className="w-full py-3 px-6 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
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
            AI Terminal
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
      'Validate inputs',
      'Send to Gemini',
      'Gemini optimization',
      'Send to Claude',
      'Claude feedback',
      'Back to Gemini',
      'Gemini refinement',
      'Final Claude review',
      'Claude optimization',
      'Calculate metrics'
    ];

    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress</h3>
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
            <h3 className="text-xl font-semibold text-gray-800">Optimized Prompt</h3>
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 text-sm bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              {copied ? (
                <>
                  <Check size={16} className="mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" />
                  Copy
                </>
              )}
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-wrap">{appState.results.finalPrompt}</p>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Character count:</span> {appState.results.metrics?.characterCount}
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
          <div className="text-sm text-gray-600">Clarity Score</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-cyan-600">{metrics.effectiveness}/10</div>
          <div className="text-sm text-gray-600">Effectiveness</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-green-600">+{metrics.improvement}%</div>
          <div className="text-sm text-gray-600">Improvement</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-gray-700">{metrics.processingTime}s</div>
          <div className="text-sm text-gray-600">Processing Time</div>
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
      addMessage('system', 'Starting prompt optimization process...');
      
      updateStep(2);
      addMessage('system', 'Sending original prompt to Gemini AI...');
      
      const geminiResponse1 = await callGeminiAPI(
        appState.form.originalPrompt,
        'Please optimize this prompt for better clarity and effectiveness. Consider the target LLM, industry context, and desired output format.'
      );
      
      updateStep(3);
      addMessage('gemini', geminiResponse1);
      
      updateStep(4);
      addMessage('system', 'Sending Gemini\'s suggestion to Claude for validation...');
      
      const claudeResponse1 = await callClaudeAPI(
        `Please review and provide feedback on this prompt optimization:\n\nOriginal: ${appState.form.originalPrompt}\n\nGemini's Optimization: ${geminiResponse1}\n\nProvide specific feedback for improvement.`
      );
      
      updateStep(5);
      addMessage('claude', claudeResponse1);
      
      updateStep(6);
      addMessage('system', 'Sending Claude\'s feedback back to Gemini...');
      
      const geminiResponse2 = await callGeminiAPI(
        geminiResponse1,
        `Based on this feedback from Claude, please refine your optimization:\n\n${claudeResponse1}`
      );
      
      updateStep(7);
      addMessage('gemini', geminiResponse2);
      
      updateStep(8);
      addMessage('system', 'Sending refined version to Claude for final optimization...');
      
      const claudeResponse2 = await callClaudeAPI(
        `Please provide the final optimized version of this prompt:\n\nOriginal: ${appState.form.originalPrompt}\n\nCurrent version: ${geminiResponse2}\n\nTarget LLM: ${appState.form.targetLLM}\nIndustry: ${appState.form.industry}`
      );
      
      updateStep(9);
      addMessage('claude', claudeResponse2);
      
      updateStep(10);
      addMessage('system', 'Calculating optimization metrics...');
      
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
      
      addMessage('system', 'Optimization complete! Scroll down to see results.');
      
    } catch (error) {
      if (error.name === 'AbortError') {
        addMessage('system', 'Process cancelled by user.');
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
        <title>Prompt Boost - AI-to-AI Prompt Optimization | Pixan.ai</title>
        <meta name="description" content="Optimize your prompts with AI-to-AI collaboration between Gemini and Claude" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Prompt Boost
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Optimize your prompts with AI-to-AI collaboration between Gemini and Claude
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Input Configuration</h2>
                <InputForm />
              </div>
            </div>

            <div className="space-y-6">
              <ProgressIndicator />
              <AITerminal />
            </div>
          </div>

          <ResultsPanel />
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