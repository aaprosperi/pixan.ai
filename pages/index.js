import React, { useState } from 'react';
import Head from 'next/head';
import { Code, Zap, Download, ArrowRight, Settings, Play, FileText, Cpu, Sparkles, Globe, Github, Link, CheckCircle, AlertCircle } from 'lucide-react';

export default function PixanDesktop() {
  const [currentView, setCurrentView] = useState('landing');
  const [userPrompt, setUserPrompt] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [projectName, setProjectName] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [vercelConnected, setVercelConnected] = useState(false);
  const [deployStatus, setDeployStatus] = useState('idle');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [deployLogs, setDeployLogs] = useState([]);

  const questionTemplates = {
    'landing': [
      "¿Cuál es el público objetivo principal de esta landing page?",
      "¿Qué acción principal quieres que realicen los usuarios (CTA)?",
      "¿Prefieres un diseño minimalista o con muchos elementos visuales?",
      "¿Necesitas formularios de contacto o suscripción?",
      "¿Qué colores representan mejor tu marca o proyecto?"
    ],
    'dashboard': [
      "¿Qué tipo de datos necesitas visualizar (métricas, tablas, gráficos)?",
      "¿Cuántos usuarios diferentes usarán este dashboard?",
      "¿Necesitas funcionalidades de filtrado o búsqueda?",
      "¿Prefieres gráficos estáticos o interactivos?",
      "¿Qué secciones principales debe tener el menú lateral?"
    ],
    'portfolio': [
      "¿Eres desarrollador, diseñador, o de otra área profesional?",
      "¿Cuántos proyectos principales quieres destacar?",
      "¿Necesitas blog o sección de artículos?",
      "¿Prefieres un estilo creativo y colorido o profesional y serio?",
      "¿Qué información de contacto quieres incluir?"
    ],
    'app': [
      "¿Qué tipo de aplicación web quieres crear (SaaS, herramienta, juego)?",
      "¿Necesitas autenticación de usuarios?",
      "¿Qué funcionalidades principales debe tener?",
      "¿Prefieres React, Vue o HTML vanilla?",
      "¿Necesitas base de datos o es una app estática?"
    ]
  };

  const detectProjectType = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('landing') || lowerPrompt.includes('startup')) return 'landing';
    if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('admin')) return 'dashboard';
    if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal')) return 'portfolio';
    if (lowerPrompt.includes('app') || lowerPrompt.includes('aplicacion')) return 'app';
    return 'landing';
  };

  const generateProjectName = (prompt) => {
    const words = prompt.toLowerCase().split(' ').filter(word => word.length > 3);
    const relevantWords = words.slice(0, 2);
    return relevantWords.join('-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4);
  };

  const generateQuestions = () => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);
    const projectType = detectProjectType(userPrompt);
    const projectQuestions = questionTemplates[projectType];
    const autoProjectName = generateProjectName(userPrompt);
    
    setTimeout(() => {
      setQuestions(projectQuestions);
      setProjectName(autoProjectName);
      setCurrentStep(2);
      setIsGenerating(false);
    }, 1500);
  };

  const optimizePrompt = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const answersText = Object.values(answers).join('. ');
      const optimized = `${userPrompt}

ESPECIFICACIONES TÉCNICAS:
${answersText}

REQUERIMIENTOS:
- Diseño responsive
- Código Next.js + Tailwind
- Performance optimizado`;

      setOptimizedPrompt(optimized);
      setCurrentStep(3);
      setIsGenerating(false);
    }, 2000);
  };

  const generateCode = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const code = {
        'package.json': `{
  "name": "${projectName}",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
        'pages/index.js': `import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>${projectName}</title>
        <meta name="description" content="${userPrompt}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            ${projectName.split('-')[0].toUpperCase()}
          </h1>
          <p className="text-xl mb-8">
            ${userPrompt}
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Comenzar
          </button>
        </div>
      </main>
    </>
  )
}`,
        'README.md': `# ${projectName}

${userPrompt}

Generado con Pixan.ai 2.0`
      };
      
      setGeneratedCode(code);
      setCurrentStep(4);
      setIsGenerating(false);
    }, 3000);
  };

  const connectGitHub = async () => {
    setIsGenerating(true);
    setDeployLogs(prev => [...prev, '🔗 Conectando con GitHub...']);
    
    setTimeout(() => {
      setGithubConnected(true);
      setIsGenerating(false);
      setDeployLogs(prev => [...prev, '✅ GitHub conectado exitosamente']);
    }, 2000);
  };

  const connectVercel = async () => {
    setIsGenerating(true);
    setDeployLogs(prev => [...prev, '🔗 Conectando con Vercel...']);
    
    setTimeout(() => {
      setVercelConnected(true);
      setIsGenerating(false);
      setDeployLogs(prev => [...prev, '✅ Vercel conectado exitosamente']);
    }, 2000);
  };

  const deployProject = async () => {
    if (!githubConnected || !vercelConnected) {
      alert('Primero conecta GitHub y Vercel');
      return;
    }

    setDeployStatus('creating-repo');
    setIsGenerating(true);
    
    setDeployLogs(prev => [...prev, '📁 Creando repositorio en GitHub...']);
    setTimeout(() => {
      const mockRepoUrl = `https://github.com/usuario/${projectName}`;
      setRepoUrl(mockRepoUrl);
      setDeployLogs(prev => [...prev, `✅ Repositorio creado: ${mockRepoUrl}`]);
      
      setDeployLogs(prev => [...prev, '🚀 Iniciando deploy en Vercel...']);
      setTimeout(() => {
        const mockLiveUrl = `https://${projectName}.vercel.app`;
        setLiveUrl(mockLiveUrl);
        setDeployStatus('completed');
        setIsGenerating(false);
        setDeployLogs(prev => [...prev, `🎉 ¡Deploy completado! Sitio en vivo: ${mockLiveUrl}`]);
        setCurrentStep(5);
      }, 4000);
    }, 3000);
  };

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (currentView === 'landing') {
    return (
      <>
        <Head>
          <title>Pixan.ai - Generador Automático Web</title>
          <meta name="description" content="De la idea al sitio web en vivo automáticamente" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
          <div className="flex justify-between items-center p-5 md:px-10 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Cpu size={32} />
              <h1 className="text-xl md:text-2xl font-bold">Pixan.ai 2.0</h1>
            </div>
            <button
              onClick={() => setCurrentView('lab')}
              className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg cursor-pointer flex items-center gap-2 text-sm md:text-base transition-all transform hover:scale-105"
            >
              <Code size={20} />
              Crear Aplicación
            </button>
          </div>

          <div className="text-center px-5 md:px-10 py-16 md:py-20 max-w-4xl mx-auto">
            <div className="mb-8">
              <Globe size={48} className="mx-auto mb-6 md:w-16 md:h-16" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Generador Automático Web
            </h1>
            
            <p className="text-lg md:text-xl mb-10 opacity-90 leading-relaxed max-w-2xl mx-auto">
              De la idea al sitio web en vivo automáticamente. 
              Genera código, crea repositorio en GitHub y deploya en Vercel con un solo click.
            </p>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-xl">
                <Github size={32} className="mb-4 text-yellow-300 md:w-10 md:h-10" />
                <h3 className="text-lg md:text-xl font-semibold mb-3">GitHub Integration</h3>
                <p className="text-sm md:text-base opacity-80">
                  Crea repositorio automáticamente y sube tu código
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-xl">
                <Globe size={32} className="mb-4 text-green-300 md:w-10 md:h-10" />
                <h3 className="text-lg md:text-xl font-semibold mb-3">Deploy Automático</h3>
                <p className="text-sm md:text-base opacity-80">
                  Tu sitio en vivo en Vercel en minutos
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-xl">
                <Zap size={32} className="mb-4 text-red-300 md:w-10 md:h-10" />
                <h3 className="text-lg md:text-xl font-semibold mb-3">Next.js Ready</h3>
                <p className="text-sm md:text-base opacity-80">
                  Código optimizado con Next.js y Tailwind CSS
                </p>
              </div>
            </div>
          </div>

          <div className="text-center p-10 border-t border-white/10">
            <p className="opacity-70">
              Powered by Pixan AI • De la idea al deploy en minutos
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Pixan Lab - Generador de Código</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
        <div className="flex justify-between items-center p-5 md:px-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Code size={24} className="md:w-8 md:h-8" />
            <h1 className="text-lg md:text-xl font-bold">Pixan CODE LAB</h1>
          </div>
          <button
            onClick={() => setCurrentView('landing')}
            className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-3 md:px-4 py-2 rounded-md cursor-pointer text-sm md:text-base"
          >
            ← Volver
          </button>
        </div>

        <div className="p-5 md:p-10 max-w-4xl mx-auto">
          
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                🚀 Paso 1: Describe tu Proyecto
              </h2>
              
              <div className="mb-6">
                <label className="block mb-3 text-base md:text-lg">
                  ¿Qué aplicación web quieres crear?
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Ejemplo: 'Landing page moderna para startup de inteligencia artificial'"
                  className="w-full h-32 p-4 rounded-lg border-none text-base bg-white/90 text-gray-900 resize-none"
                />
              </div>

              <button
                onClick={generateQuestions}
                disabled={!userPrompt.trim() || isGenerating}
                className={`${
                  isGenerating ? 'bg-gray-600' : 'bg-gradient-to-r from-red-500 to-orange-500'
                } text-white border-none p-4 rounded-lg text-base cursor-pointer flex items-center gap-3 justify-center disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    Analizando...
                  </>
                ) : (
                  <>
                    <ArrowRight size={20} />
                    Generar Preguntas
                  </>
                )}
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                🎯 Paso 2: Especificaciones
              </h2>
              
              <div className="bg-white/10 p-5 rounded-lg mb-8">
                <p className="mb-3 text-sm opacity-80">Nombre del proyecto:</p>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-3 rounded-md border-none bg-white/90 text-gray-900"
                />
              </div>
              
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="bg-white/10 p-5 rounded-lg">
                    <label className="block mb-3 font-medium">
                      {index + 1}. {question}
                    </label>
                    <input
                      type="text"
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="w-full p-3 rounded-md border-none bg-white/90 text-gray-900"
                      placeholder="Tu respuesta..."
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={optimizePrompt}
                disabled={Object.keys(answers).length < questions.length || isGenerating}
                className={`${
                  isGenerating ? 'bg-gray-600' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                } text-white border-none p-4 rounded-lg cursor-pointer flex items-center gap-3 mt-8 justify-center disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    Optimizando...
                  </>
                ) : (
                  <>
                    <Settings size={20} />
                    Optimizar Prompt
                  </>
                )}
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                ⚡ Paso 3: Prompt Optimizado
              </h2>
              
              <div className="bg-white/10 p-6 rounded-xl mb-8">
                <h3 className="mb-4 text-lg font-semibold">Prompt Final:</h3>
                <div className="bg-black/20 p-5 rounded-lg text-sm leading-relaxed max-h-80 overflow-y-auto whitespace-pre-line">
                  {optimizedPrompt}
                </div>
              </div>

              <button
                onClick={generateCode}
                disabled={isGenerating}
                className={`${
                  isGenerating ? 'bg-gray-600' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                } text-gray-900 border-none p-4 rounded-lg font-semibold cursor-pointer flex items-center gap-3 justify-center disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
                    Generando código...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Generar Código
                  </>
                )}
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                🚀 Paso 4: Deploy
              </h2>
              
              <div className="bg-white/10 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-bold mb-5 text-green-400">
                  ✅ Código Generado
                </h3>
                
                <div className="grid gap-4 mb-6">
                  {Object.keys(generatedCode).map((filename) => (
                    <div key={filename} className="bg-white/10 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span className="text-sm">{filename}</span>
                      </div>
                      <button
                        onClick={() => downloadFile(filename, generatedCode[filename])}
                        className="bg-white/20 border border-white/30 text-white p-2 rounded cursor-pointer"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 p-6 rounded-xl mb-8">
                <h3 className="mb-5 text-lg font-semibold">🔗 Conectar Servicios</h3>
                
                <div className="flex gap-4 mb-5">
                  <button
                    onClick={connectGitHub}
                    disabled={githubConnected}
                    className={`${
                      githubConnected ? 'bg-green-600' : 'bg-white/20'
                    } border border-white/30 text-white p-3 rounded-lg flex items-center gap-2 flex-1 justify-center`}
                  >
                    {githubConnected ? <CheckCircle size={16} /> : <Github size={16} />}
                    {githubConnected ? 'GitHub Conectado' : 'Conectar GitHub'}
                  </button>

                  <button
                    onClick={connectVercel}
                    disabled={vercelConnected}
                    className={`${
                      vercelConnected ? 'bg-green-600' : 'bg-white/20'
                    } border border-white/30 text-white p-3 rounded-lg flex items-center gap-2 flex-1 justify-center`}
                  >
                    {vercelConnected ? <CheckCircle size={16} /> : <Globe size={16} />}
                    {vercelConnected ? 'Vercel Conectado' : 'Conectar Vercel'}
                  </button>
                </div>

                <button
                  onClick={deployProject}
                  disabled={!githubConnected || !vercelConnected || isGenerating}
                  className={`${
                    (!githubConnected || !vercelConnected || isGenerating) ? 'bg-gray-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'
                  } text-white border-none p-4 rounded-lg cursor-pointer flex items-center gap-3 w-full justify-center disabled:cursor-not-allowed`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                      Desplegando...
                    </>
                  ) : (
                    <>
                      <Globe size={20} />
                      🚀 Deploy Automático
                    </>
                  )}
                </button>
              </div>

              {deployLogs.length > 0 && (
                <div className="bg-black/30 p-5 rounded-lg text-sm font-mono max-h-48 overflow-y-auto">
                  {deployLogs.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                🎉 ¡Deploy Completado!
              </h2>
              
              <div className="bg-green-900/20 border-2 border-green-500 p-8 rounded-xl text-center mb-8">
                <CheckCircle size={48} className="text-green-400 mb-5 mx-auto" />
                <h3 className="text-2xl font-bold mb-4 text-green-400">
                  ¡Tu sitio está en vivo!
                </h3>
                
                <div className="flex gap-4 justify-center">
                  
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-3 rounded-lg no-underline flex items-center gap-2"
                  >
                    <Globe size={20} />
                    Ver Sitio
                  </a>
                  
                  
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 text-white p-3 rounded-lg no-underline flex items-center gap-2"
                  >
                    <Github size={20} />
                    Ver Código
                  </a>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentStep(1);
                  setUserPrompt('');
                  setQuestions([]);
                  setAnswers({});
                  setOptimizedPrompt('');
                  setGeneratedCode({});
                  setProjectName('');
                  setGithubConnected(false);
                  setVercelConnected(false);
                  setDeployStatus('idle');
                  setRepoUrl('');
                  setLiveUrl('');
                  setDeployLogs([]);
                }}
                className="bg-white/20 text-white p-4 rounded-lg cursor-pointer w-full flex items-center justify-center gap-3"
              >
                🔄 Crear Nuevo Proyecto
              </button>
            </div>
          )}

          <div className="fixed bottom-5 right-5 bg-white/10 p-4 rounded-xl">
            <div className="text-xs font-medium mb-2">
              Progreso: {currentStep}/5
            </div>
            <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
