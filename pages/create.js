import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    // Redirect to the app page with the prompt
    router.push({
      pathname: '/app',
      query: { prompt: prompt.trim() }
    });
  };

  return (
    <>
      <Head>
        <title>Crear App - Pixan.ai</title>
        <meta name="description" content="Desarrolla tu app web con Pixan.ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-white overflow-hidden">
        <div className="container max-w-2xl mx-auto px-8">
          <div className="text-center mb-12">
            <Link href="/">
              <h1 className="logo-title">
                Pixan.ai
              </h1>
            </Link>
            <p className="subtitle">
              Describe tu app web y la desarrollaremos al instante
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-container">
            <div className="input-group">
              <label htmlFor="prompt" className="input-label">
                Prompt para desarrollar en pixan.ai
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ejemplo: Una calculadora simple con diseño moderno, o una landing page para una cafetería..."
                className="prompt-input"
                rows={6}
                required
              />
            </div>

            <div className="button-group">
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="develop-button"
              >
                {isLoading ? 'Desarrollando...' : 'Desarrollar y publicar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #ffffff;
          color: #1a1a1a;
        }

        .container {
          animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .logo-title {
          font-family: 'Inter', sans-serif;
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #000000;
          margin-bottom: 16px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .logo-title:hover {
          color: #666666;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #666666;
          font-weight: 400;
          line-height: 1.5;
        }

        .form-container {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .input-group {
          margin-bottom: 32px;
        }

        .input-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 500;
          color: #333333;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .prompt-input {
          width: 100%;
          padding: 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          line-height: 1.5;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .prompt-input:focus {
          outline: none;
          border-color: #000000;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
        }

        .prompt-input::placeholder {
          color: #999999;
        }

        .button-group {
          text-align: center;
        }

        .develop-button {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          padding: 16px 40px;
          background-color: #000000;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          letter-spacing: -0.01em;
          min-width: 200px;
        }

        .develop-button:hover:not(:disabled) {
          background-color: #333333;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .develop-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          transform: none;
        }

        .develop-button:active:not(:disabled) {
          transform: translateY(0px);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .logo-title {
            font-size: 2rem;
          }
          
          .form-container {
            padding: 24px;
          }
          
          .develop-button {
            font-size: 1rem;
            padding: 14px 32px;
            min-width: 180px;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 16px;
          }
          
          .logo-title {
            font-size: 1.8rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
          
          .form-container {
            padding: 20px;
          }
          
          .develop-button {
            width: 100%;
            min-width: auto;
          }
        }
        
        /* Subtle background texture */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0.01) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
        }
      `}</style>
    </>
  );
}
