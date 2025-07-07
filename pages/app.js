import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AppPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedApp, setGeneratedApp] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const { prompt: queryPrompt } = router.query;
    if (queryPrompt) {
      setPrompt(queryPrompt);
      generateApp(queryPrompt);
    } else {
      setError('No se encontró un prompt válido');
      setIsLoading(false);
    }
  }, [router.query]);

  const generateApp = async (userPrompt) => {
    try {
      setIsLoading(true);
      
      // Simular llamada a Claude API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const appContent = generateMinimalApp(userPrompt);
      setGeneratedApp(appContent);
      
    } catch (err) {
      setError('Error al generar la aplicación. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMinimalApp = (userPrompt) => {
    const lowerPrompt = userPrompt.toLowerCase();
    
    if (lowerPrompt.includes('calculadora')) {
      return `
        <div style="max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; font-family: 'Inter', sans-serif;">
          <h2 style="text-align: center; margin-bottom: 20px; color: #333;">Calculadora</h2>
          <div id="calculator">
            <input type="text" id="display" style="width: 100%; padding: 15px; font-size: 1.2rem; text-align: right; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px;" readonly>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
              <button onclick="clearDisplay()" style="padding: 15px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 6px; cursor: pointer;">C</button>
              <button onclick="deleteLast()" style="padding: 15px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 6px; cursor: pointer;">⌫</button>
              <button onclick="appendToDisplay('/')" style="padding: 15px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 6px; cursor: pointer;">÷</button>
              <button onclick="appendToDisplay('*')" style="padding: 15px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 6px; cursor: pointer;">×</button>
              <button onclick="appendToDisplay('7')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">7</button>
              <button onclick="appendToDisplay('8')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">8</button>
              <button onclick="appendToDisplay('9')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">9</button>
              <button onclick="appendToDisplay('-')" style="padding: 15px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 6px; cursor: pointer;">-</button>
              <button onclick="appendToDisplay('4')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">4</button>
              <button onclick="appendToDisplay('5')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">5</button>
              <button onclick="appendToDisplay('6')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">6</button>
              <button onclick="appendToDisplay('+')" style="padding: 15px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 6px; cursor: pointer;">+</button>
              <button onclick="appendToDisplay('1')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">1</button>
              <button onclick="appendToDisplay('2')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">2</button>
              <button onclick="appendToDisplay('3')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">3</button>
              <button onclick="calculate()" style="padding: 15px; font-size: 1rem; border: none; background: #000; color: white; border-radius: 6px; cursor: pointer; grid-row: span 2;">=</button>
              <button onclick="appendToDisplay('0')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; grid-column: span 2;">0</button>
              <button onclick="appendToDisplay('.')" style="padding: 15px; font-size: 1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">.</button>
            </div>
          </div>
        </div>
        <script>
          function appendToDisplay(value) {
            document.getElementById('display').value += value;
          }
          function clearDisplay() {
            document.getElementById('display').value = '';
          }
          function deleteLast() {
            const display = document.getElementById('display');
            display.value = display.value.slice(0, -1);
          }
          function calculate() {
            try {
              const result = eval(document.getElementById('display').value);
              document.getElementById('display').value = result;
            } catch (error) {
              document.getElementById('display').value = 'Error';
            }
          }
        </script>
      `;
    } else if (lowerPrompt.includes('landing') || lowerPrompt.includes('página')) {
      return `
        <div style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333;">
          <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 20px; font-weight: 300;">Bienvenido</h1>
            <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto;">Una solución moderna y elegante para tus necesidades</p>
            <button style="margin-top: 30px; padding: 15px 30px; background: white; color: #667eea; border: none; border-radius: 25px; font-size: 1.1rem; cursor: pointer; font-weight: 500;">Comenzar</button>
          </header>
          <section style="padding: 80px 20px; max-width: 1200px; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
              <div style="text-align: center; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #667eea; margin-bottom: 15px;">Rápido</h3>
                <p>Soluciones eficientes y optimizadas para el mejor rendimiento.</p>
              </div>
              <div style="text-align: center; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #667eea; margin-bottom: 15px;">Confiable</h3>
                <p>Tecnología robusta en la que puedes confiar para tu negocio.</p>
              </div>
              <div style="text-align: center; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #667eea; margin-bottom: 15px;">Moderno</h3>
                <p>Diseño contemporáneo que se adapta a las últimas tendencias.</p>
              </div>
            </div>
          </section>
          <footer style="background: #f8f9fa; padding: 40px 20px; text-align: center;">
            <p>© 2025 - Desarrollado con Pixan.ai</p>
          </footer>
        </div>
      `;
    } else if (lowerPrompt.includes('todo') || lowerPrompt.includes('tareas')) {
      return `
        <div style="max-width: 600px; margin: 50px auto; padding: 20px; font-family: 'Inter', sans-serif;">
          <h1 style="text-align: center; color: #333; margin-bottom: 30px;">Lista de Tareas</h1>
          <div style="margin-bottom: 20px;">
            <input type="text" id="taskInput" placeholder="Agregar nueva tarea..." style="width: 80%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
            <button onclick="addTask()" style="width: 18%; padding: 12px; background: #000; color: white; border: none; border-radius: 6px; margin-left: 2%; cursor: pointer;">+</button>
          </div>
          <ul id="taskList" style="list-style: none; padding: 0;"></ul>
        </div>
        <script>
          let tasks = [];
          function addTask() {
            const input = document.getElementById('taskInput');
            const task = input.value.trim();
            if (task) {
              tasks.push({ id: Date.now(), text: task, completed: false });
              input.value = '';
              renderTasks();
            }
          }
          function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) task.completed = !task.completed;
            renderTasks();
          }
          function deleteTask(id) {
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
          }
          function renderTasks() {
            const list = document.getElementById('taskList');
            list.innerHTML = tasks.map(task => 
              '<li style="display: flex; align-items: center; padding: 10px; margin: 5px 0; background: #f9f9f9; border-radius: 6px;">' +
              '<input type="checkbox" ' + (task.completed ? 'checked' : '') + ' onchange="toggleTask(' + task.id + ')" style="margin-right: 10px;">' +
              '<span style="flex: 1; ' + (task.completed ? 'text-decoration: line-through; color: #888;' : '') + '">' + task.text + '</span>' +
              '<button onclick="deleteTask(' + task.id + ')" style="background: #ff4757; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">×</button>' +
              '</li>'
            ).join('');
          }
          document.getElementById('taskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
          });
        </script>
      `;
    } else {
      return `
        <div style="max-width: 800px; margin: 50px auto; padding: 40px; font-family: 'Inter', sans-serif; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h1 style="text-align: center; color: #333; margin-bottom: 20px;">Tu Aplicación</h1>
          <p style="text-align: center; color: #666; margin-bottom: 40px; font-size: 1.1rem;">
            Desarrollada basada en: "${userPrompt}"
          </p>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
            <h2 style="color: #667eea; margin-bottom: 15px;">¡Aplicación Lista!</h2>
            <p style="margin-bottom: 20px;">Tu aplicación ha sido generada exitosamente con un diseño minimalista y moderno.</p>
            <button style="padding: 12px 24px; background: #000; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;" onclick="alert('¡Funcionalidad implementada!')">
              Interactuar
            </button>
          </div>
          <div style="margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 8px;">
            <h3 style="color: #2c3e50; margin-bottom: 10px;">Características:</h3>
            <ul style="color: #34495e;">
              <li>Diseño responsivo y moderno</li>
              <li>Interfaz intuitiva y fácil de usar</li>
              <li>Optimizado para todos los dispositivos</li>
              <li>Desarrollado con las mejores prácticas</li>
            </ul>
          </div>
        </div>
      `;
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Desarrollando App - Pixan.ai</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <h2>Desarrollando tu aplicación...</h2>
            <p>Claude está creando tu app web personalizada</p>
          </div>
          <style jsx global>{`
            .loading-container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              font-family: 'Inter', sans-serif;
            }
            .loading-content {
              text-align: center;
              animation: fadeIn 0.8s ease;
            }
            .loading-content h2 {
              margin: 30px 0 15px 0;
              color: #333;
              font-weight: 400;
            }
            .loading-content p {
              color: #666;
              font-size: 1.1rem;
            }
            .spinner {
              width: 50px;
              height: 50px;
              border: 3px solid #f3f3f3;
              border-top: 3px solid #333;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error - Pixan.ai</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        <div className="error-container">
          <div className="error-content">
            <h2>Error</h2>
            <p>{error}</p>
            <Link href="/">
              <button className="home-button">Regresar a home</button>
            </Link>
          </div>
          <style jsx global>{`
            .error-container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              font-family: 'Inter', sans-serif;
            }
            .error-content {
              text-align: center;
              max-width: 500px;
              padding: 40px;
            }
            .error-content h2 {
              color: #ff4757;
              margin-bottom: 15px;
            }
            .error-content p {
              color: #666;
              margin-bottom: 30px;
            }
            .home-button {
              padding: 12px 24px;
              background: #000;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 1rem;
              transition: background 0.3s ease;
            }
            .home-button:hover {
              background: #333;
            }
          `}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tu App - Pixan.ai</title>
        <meta name="description" content={`App desarrollada: ${prompt}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="app-container">
        <div className="app-header">
          <Link href="/">
            <button className="home-button">
              Regresar a home
            </button>
          </Link>
          <h1 className="app-title">Tu aplicación está lista</h1>
          <p className="app-subtitle">Desarrollada con: "{prompt}"</p>
        </div>

        <div 
          className="app-content"
          dangerouslySetInnerHTML={{ __html: generatedApp }}
        />
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

        .app-container {
          min-height: 100vh;
          padding: 20px;
          animation: fadeIn 0.8s ease;
        }

        .app-header {
          max-width: 1200px;
          margin: 0 auto 40px auto;
          text-align: center;
          position: relative;
        }

        .home-button {
          position: absolute;
          left: 0;
          top: 0;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          padding: 12px 20px;
          background-color: #f5f5f5;
          color: #333333;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .home-button:hover {
          background-color: #e0e0e0;
          transform: translateY(-1px);
        }

        .app-title {
          font-size: 2.2rem;
          font-weight: 300;
          color: #333;
          margin-bottom: 10px;
        }

        .app-subtitle {
          font-size: 1rem;
          color: #666;
          font-style: italic;
        }

        .app-content {
          max-width: 1200px;
          margin: 0 auto;
          animation: slideUp 0.8s ease 0.2s both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .app-header {
            margin-bottom: 30px;
          }
          
          .home-button {
            position: static;
            margin-bottom: 20px;
            font-size: 0.9rem;
            padding: 10px 16px;
          }
          
          .app-title {
            font-size: 1.8rem;
          }
          
          .app-subtitle {
            font-size: 0.9rem;
            padding: 0 20px;
          }
        }

        @media (max-width: 480px) {
          .app-container {
            padding: 15px;
          }
          
          .app-title {
            font-size: 1.5rem;
          }
          
          .home-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
