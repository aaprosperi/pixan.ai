import React, { useState } from 'react';
import Head from 'next/head';
import { Code, Zap, Download, ArrowRight, Settings, Play, FileText, Cpu, Sparkles, Globe, Github, CheckCircle } from 'lucide-react';

export default function PixanDesktop() {
  const [currentView, setCurrentView] = useState('landing');
  const [userPrompt, setUserPrompt] = useState('');

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
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              🚀 Generador en Construcción
            </h2>
            
            <div className="bg-white/10 p-6 rounded-xl text-center">
              <Settings size={48} className="mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-bold mb-4">Próximamente</h3>
              <p className="text-gray-300">
                El generador automático de código estará disponible muy pronto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
