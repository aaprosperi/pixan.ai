import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function GeneratedAppViewer() {
  const router = useRouter();
  const { id } = router.query;
  const [appContent, setAppContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadGeneratedApp = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/app/${id}`);
        
        if (!response.ok) {
          throw new Error('App not found');
        }
        
        const data = await response.json();
        setAppContent(data);
      } catch (err) {
        setError('La aplicación solicitada no fue encontrada o no existe.');
      } finally {
        setLoading(false);
      }
    };

    loadGeneratedApp();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">App No Encontrada</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/generator">
            <a className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Crear Nueva App
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{appContent?.name || 'App Generada'} - Pixan.ai</title>
        <meta name="description" content={appContent?.description || 'Aplicación web generada con IA'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* App Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/generator">
                <a className="text-blue-600 hover:text-blue-700 text-sm">← Volver al Generador</a>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg font-medium text-gray-900">{appContent?.name}</h1>
                {appContent?.timestamp && (
                  <p className="text-xs text-gray-500">
                    Creada el {new Date(appContent.timestamp).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                🔄 Recargar
              </button>
              <Link href="/">
                <a className="text-gray-600 hover:text-gray-900 text-sm">Pixan.ai</a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* App Content */}
      <div className="min-h-screen bg-gray-50">
        {appContent && (
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* This is where the generated app content would be dynamically loaded */}
                  <div id="generated-app-container">
                    {/* Placeholder - actual implementation would dynamically import the generated component */}
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🚀</div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {appContent.name}
                      </h2>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        {appContent.description}
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                        <p className="text-blue-800 mb-4">
                          <strong>Estado:</strong> La aplicación ha sido generada exitosamente.
                        </p>
                        <p className="text-sm text-blue-600">
                          En una implementación completa, aquí se cargaría dinámicamente 
                          el componente React generado por la IA.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>Aplicación generada con Pixan.ai - Powered by Claude Sonnet 4</p>
          </div>
        </div>
      </footer>
    </>
  );
}