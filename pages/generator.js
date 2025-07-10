import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Generator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedApp, setGeneratedApp] = useState(null);
  const [error, setError] = useState(null);
  const [generatedApps, setGeneratedApps] = useState([]);
  const [previewCode, setPreviewCode] = useState(null);

  // Dynamic component renderer for preview
  const DynamicPreview = ({ code }) => {
    if (!code) return null;
    
    try {
      // Create a safe preview HTML for the generated code
      const previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 20px; font-family: Inter, sans-serif; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect } = React;
            
            ${code.replace(/export default function/g, 'function GeneratedApp').replace(/export default/g, '')}
            
            ReactDOM.render(<GeneratedApp />, document.getElementById('root'));
          </script>
        </body>
        </html>
      `;
      
      return (
        <iframe
          srcDoc={previewHTML}
          className="w-full h-full border-0 rounded-lg"
          sandbox="allow-scripts"
          title="App Preview"
        />
      );
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-full bg-red-50 rounded-lg">
          <p className="text-red-600">Error en preview: {error.message}</p>
        </div>
      );
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa una descripción para tu aplicación web');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedApp(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error generando la aplicación');
      }

      setGeneratedApp(data);
      setPreviewCode(data.code);
      setGeneratedApps(prev => [data, ...prev]);
      setPrompt('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Generador de Apps Web - Pixan.ai</title>
        <meta name="description" content="Genera aplicaciones web personalizadas con IA - Pixan.ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
                  <div className="cursor-pointer">
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
                  </div>
                </Link>
              </div>
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Inicio
                </Link>
                <span className="text-gray-900 font-medium">Generador</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              Generador de Aplicaciones Web
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Describe tu aplicación web en palabras simples y nuestro sistema de IA 
              generará una aplicación funcional para ti
            </p>
          </div>

          {/* Generator Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="mb-6">
                <label htmlFor="prompt" className="block text-lg font-medium text-gray-900 mb-3">
                  Describe tu aplicación web
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                  placeholder="Ejemplo: Quiero una calculadora de propinas con campos para el monto total, porcentaje de propina y número de personas para dividir la cuenta. Que tenga botones para porcentajes comunes como 15%, 18% y 20%."
                  disabled={isGenerating}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Describe qué tipo de aplicación necesitas, sus funcionalidades principales y cualquier detalle específico que consideres importante.
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Generando tu aplicación...
                  </div>
                ) : (
                  'Generar App Web'
                )}
              </button>
            </div>

            {/* Generated App Preview */}
            {generatedApp && (
              <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    ✨ Tu aplicación está lista
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(previewCode)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      📋 Copiar Código
                    </button>
                    <button
                      onClick={() => setPreviewCode(null)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      🗑️ Limpiar
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Información</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nombre:</span> {generatedApp.name}</p>
                      <p><span className="font-medium">Descripción:</span> {generatedApp.description}</p>
                      <p><span className="font-medium">ID:</span> {generatedApp.id}</p>
                      <p><span className="font-medium">Creada:</span> {new Date(generatedApp.timestamp).toLocaleString()}</p>
                      <p><span className="font-medium">Costo:</span> {generatedApp.cost}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Código Generado</h4>
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono max-h-32 overflow-y-auto">
                        <pre>{previewCode ? previewCode.slice(0, 300) + '...' : 'No code generated'}</pre>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Vista Previa Interactiva</h3>
                    <div className="border border-gray-200 rounded-lg bg-white h-96 overflow-hidden">
                      {previewCode ? (
                        <DynamicPreview code={previewCode} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No hay preview disponible
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Apps List */}
            {generatedApps.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Aplicaciones Generadas Recientemente
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedApps.slice(0, 6).map((app) => (
                    <div key={app.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{app.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{app.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(app.timestamp).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => {
                            setGeneratedApp(app);
                            setPreviewCode(app.code);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Ver Preview →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 text-sm">
              <p>Generador de Aplicaciones Web - Powered by Pixan.ai</p>
              <p className="mt-2">
                {generatedApp ? (
                  <>
                    Costo de desarrollo: <span className="font-mono">{generatedApp.cost}</span> USD 
                    (basado en {generatedApp.tokensUsed} tokens utilizados del modelo Claude Sonnet 4 vía API de Anthropic)
                  </>
                ) : (
                  <>
                    Costo estimado: <span className="font-mono">$0.006-$0.012</span> USD por app generada
                    (basado en 2,000-4,000 tokens del modelo Claude Sonnet 4 vía API de Anthropic)
                  </>
                )}
              </p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </>
  );
}