import { useState } from 'react';
import Head from 'next/head';

export default function PB() {
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

  // Función genérica para actualizar cualquier campo
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Terminal logger
  const log = (type, msg) => {
    setTerminal(prev => [...prev, { type, msg, time: new Date().toLocaleTimeString() }]);
  };

  // Proceso principal
  const optimize = async () => {
    if (formData.prompt.length < 10) {
      alert('El prompt debe tener al menos 10 caracteres');
      return;
    }
    if (!formData.claudeKey || !formData.geminiKey) {
      alert('Se requieren ambas claves API');
      return;
    }

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
      log('gemini', gemini1.content.substring(0, 100) + '...');
      
      // Paso 4 - Claude
      setStep(4);
      log('system', '🔄 Enviando a Claude...');
      
      const claude1 = await callAPI('/api/claude-chat', {
        apiKey: formData.claudeKey,
        message: `Review this optimization:\nOriginal: ${formData.prompt}\nGemini: ${gemini1.content}`,
        context: 'prompt_optimization'
      });
      
      setStep(5);
      log('claude', claude1.content.substring(0, 100) + '...');
      
      // Paso 6 - Gemini refinamiento
      setStep(6);
      log('system', '↩️ Refinando con Gemini...');
      
      const gemini2 = await callAPI('/api/gemini-chat', {
        apiKey: formData.geminiKey,
        prompt: `${gemini1.content}\n\nClaude feedback: ${claude1.content}`,
        parameters: formData
      });
      
      setStep(7);
      log('gemini', gemini2.content.substring(0, 100) + '...');
      
      // Paso 8 - Claude final
      setStep(8);
      log('system', '✨ Optimización final con Claude...');
      
      const claude2 = await callAPI('/api/claude-chat', {
        apiKey: formData.claudeKey,
        message: `Final optimization:\nOriginal: ${formData.prompt}\nCurrent: ${gemini2.content}`,
        context: 'prompt_optimization'
      });
      
      setStep(9);
      log('claude', 'Optimización completada');
      
      setStep(10);
      setOutput(claude2.content);
      log('system', '✅ ¡Proceso completado!');
      
    } catch (error) {
      log('error', `❌ Error: ${error.message}`);
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

  return (
    <>
      <Head>
        <title>Prompt Boost - Pixan.ai</title>
      </Head>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', margin: '20px 0' }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Prompt Boost
            </span>
          </h1>
          <p style={{ fontSize: '20px', color: '#666' }}>
            Optimiza tus prompts con IA colaborativa
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Formulario */}
          <div style={{ background: '#f9fafb', padding: '30px', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '20px' }}>Configuración</h2>
            
            {/* Prompt */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Tu Prompt ({formData.prompt.length} caracteres)
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => updateField('prompt', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'none'
                }}
                placeholder="Escribe tu prompt aquí..."
                disabled={processing}
              />
            </div>

            {/* Selects */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  LLM Objetivo
                </label>
                <select
                  value={formData.llm}
                  onChange={(e) => updateField('llm', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  disabled={processing}
                >
                  <option value="Universal">Universal</option>
                  <option value="Claude">Claude</option>
                  <option value="GPT-4">GPT-4</option>
                  <option value="Gemini">Gemini</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Industria
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  disabled={processing}
                >
                  <option value="General">General</option>
                  <option value="Technology">Tecnología</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Creative">Creativo</option>
                  <option value="Legal">Legal</option>
                  <option value="Medical">Médico</option>
                </select>
              </div>
            </div>

            {/* Temperatura */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Creatividad: {formData.temp}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.temp}
                onChange={(e) => updateField('temp', parseInt(e.target.value))}
                style={{ width: '100%' }}
                disabled={processing}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                <span>Preciso</span>
                <span>Balanceado</span>
                <span>Creativo</span>
              </div>
            </div>

            {/* API Keys */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Claude API Key
                </label>
                <input
                  type="password"
                  value={formData.claudeKey}
                  onChange={(e) => updateField('claudeKey', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  placeholder="sk-ant-..."
                  disabled={processing}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={formData.geminiKey}
                  onChange={(e) => updateField('geminiKey', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  placeholder="AIza..."
                  disabled={processing}
                />
              </div>
            </div>

            {/* Botón */}
            <button
              onClick={optimize}
              disabled={processing}
              style={{
                width: '100%',
                padding: '16px',
                background: processing ? '#9ca3af' : 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: processing ? 'not-allowed' : 'pointer'
              }}
            >
              {processing ? `Procesando Paso ${step}/10...` : 'Optimizar Prompt'}
            </button>
          </div>

          {/* Terminal */}
          <div>
            {/* Progress */}
            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>Progreso</h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <div
                    key={n}
                    style={{
                      flex: 1,
                      height: '8px',
                      background: step >= n ? '#8b5cf6' : '#e5e7eb',
                      borderRadius: '4px',
                      transition: 'background 0.3s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Terminal Output */}
            <div style={{ 
              background: '#1f2937',
              borderRadius: '12px',
              overflow: 'hidden',
              height: '400px'
            }}>
              <div style={{ 
                background: '#374151',
                padding: '10px 15px',
                borderBottom: '1px solid #4b5563',
                fontSize: '14px',
                color: '#9ca3af'
              }}>
                Terminal IA - Pixan.ai
              </div>
              <div style={{
                padding: '15px',
                height: 'calc(100% - 41px)',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                {terminal.map((log, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <span style={{ 
                      color: log.type === 'system' ? '#10b981' :
                            log.type === 'gemini' ? '#3b82f6' :
                            log.type === 'claude' ? '#8b5cf6' :
                            '#ef4444'
                    }}>
                      [{log.time}] {log.type.toUpperCase()}:
                    </span>
                    <div style={{ color: '#e5e7eb', paddingLeft: '20px' }}>
                      {log.msg}
                    </div>
                  </div>
                ))}
                {processing && (
                  <span style={{ color: '#6b7280' }}>▊</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resultado */}
        {output && (
          <div style={{ 
            marginTop: '30px',
            background: 'linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%)',
            padding: '30px',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '24px', margin: 0 }}>Prompt Optimizado</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  alert('¡Copiado!');
                }}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                📋 Copiar
              </button>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6'
            }}>
              {output}
            </div>
          </div>
        )}
      </div>
    </>
  );
}