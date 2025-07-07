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
      
      // Simular tiempo de generación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const appContent = generateSpecificApp(userPrompt);
      setGeneratedApp(appContent);
      
    } catch (err) {
      setError('Error al generar la aplicación. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSpecificApp = (userPrompt) => {
    const lowerPrompt = userPrompt.toLowerCase();
    
    // Página en blanco con círculo negro
    if (lowerPrompt.includes('página en blanco') && lowerPrompt.includes('círculo negro')) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { height: 100%; overflow: hidden; }
          </style>
        </head>
        <body style="width: 100vw; height: 100vh; background-color: white; display: flex; align-items: center; justify-content: center; margin: 0; padding: 0;">
          <div style="width: 50px; height: 50px; background-color: black; border-radius: 50%;"></div>
        </body>
        </html>
      `;
    }
    
    // Calculadora
    else if (lowerPrompt.includes('calculadora')) {
      return `
        <div style="max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; font-family: 'Inter', sans-serif; background: white;">
          <h2 style="text-align: center; margin-bottom: 20px; color: #333; font-weight: 300;">Calculadora</h2>
          <div id="calculator">
            <input type="text" id="display" style="width: 100%; padding: 15px; font-size: 1.5rem; text-align: right; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; background: #fafafa;" readonly>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
              <button onclick="clearDisplay()" style="padding: 20px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 8px; cursor: pointer; font-weight: 500;">C</button>
              <button onclick="deleteLast()" style="padding: 20px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 8px; cursor: pointer;">⌫</button>
              <button onclick="appendToDisplay('/')" style="padding: 20px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 8px; cursor: pointer;">÷</button>
              <button onclick="appendToDisplay('*')" style="padding: 20px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 8px; cursor: pointer;">×</button>
              <button onclick="appendToDisplay('7')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">7</button>
              <button onclick="appendToDisplay('8')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">8</button>
              <button onclick="appendToDisplay('9')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">9</button>
              <button onclick="appendToDisplay('-')" style="padding: 20px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 8px; cursor: pointer;">-</button>
              <button onclick="appendToDisplay('4')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">4</button>
              <button onclick="appendToDisplay('5')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">5</button>
              <button onclick="appendToDisplay('6')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">6</button>
              <button onclick="appendToDisplay('+')" style="padding: 20px; font-size: 1rem; border: none; background: #f5f5f5; border-radius: 8px; cursor: pointer;">+</button>
              <button onclick="appendToDisplay('1')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">1</button>
              <button onclick="appendToDisplay('2')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">2</button>
              <button onclick="appendToDisplay('3')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">3</button>
              <button onclick="calculate()" style="padding: 20px; font-size: 1.2rem; border: none; background: #000; color: white; border-radius: 8px; cursor: pointer; grid-row: span 2; font-weight: 500;">=</button>
              <button onclick="appendToDisplay('0')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; grid-column: span 2;">0</button>
              <button onclick="appendToDisplay('.')" style="padding: 20px; font-size: 1.1rem; border: none; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">.</button>
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
              const result = eval(document.getElementById('display').value.replace('×', '*').replace('÷', '/'));
              document.getElementById('display').value = result;
            } catch (error) {
              document.getElementById('display').value = 'Error';
            }
          }
        </script>
      `;
    }
    
    // Lista de tareas / To-Do
    else if (lowerPrompt.includes('todo') || lowerPrompt.includes('tareas') || lowerPrompt.includes('lista')) {
      return `
        <div style="max-width: 600px; margin: 40px auto; padding: 30px; font-family: 'Inter', sans-serif; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <h1 style="text-align: center; color: #333; margin-bottom: 30px; font-weight: 300; font-size: 2rem;">Lista de Tareas</h1>
          <div style="margin-bottom: 25px; display: flex; gap: 10px;">
            <input type="text" id="taskInput" placeholder="Agregar nueva tarea..." style="flex: 1; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; font-family: inherit;">
            <button onclick="addTask()" style="padding: 15px 20px; background: #000; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 500;">Agregar</button>
          </div>
          <ul id="taskList" style="list-style: none; padding: 0; margin: 0;"></ul>
          <div id="stats" style="text-align: center; margin-top: 20px; color: #666; font-size: 0.9rem;"></div>
        </div>
        <script>
          let tasks = [];
          let taskId = 1;
          
          function addTask() {
            const input = document.getElementById('taskInput');
            const task = input.value.trim();
            if (task) {
              tasks.push({ id: taskId++, text: task, completed: false });
              input.value = '';
              renderTasks();
              updateStats();
            }
          }
          
          function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
              task.completed = !task.completed;
              renderTasks();
              updateStats();
            }
          }
          
          function deleteTask(id) {
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
            updateStats();
          }
          
          function renderTasks() {
            const list = document.getElementById('taskList');
            list.innerHTML = tasks.map(task => 
              '<li style="display: flex; align-items: center; padding: 15px; margin: 8px 0; background: ' + (task.completed ? '#f8f9fa' : '#ffffff') + '; border: 1px solid #e9ecef; border-radius: 8px; transition: all 0.2s ease;">' +
              '<input type="checkbox" ' + (task.completed ? 'checked' : '') + ' onchange="toggleTask(' + task.id + ')" style="margin-right: 15px; transform: scale(1.2);">' +
              '<span style="flex: 1; font-size: 1rem; ' + (task.completed ? 'text-decoration: line-through; color: #6c757d;' : 'color: #333;') + '">' + task.text + '</span>' +
              '<button onclick="deleteTask(' + task.id + ')" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; font-size: 0.8rem;">Eliminar</button>' +
              '</li>'
            ).join('');
          }
          
          function updateStats() {
            const completed = tasks.filter(t => t.completed).length;
            const total = tasks.length;
            const stats = document.getElementById('stats');
            stats.innerHTML = total > 0 ? 'Completadas: ' + completed + ' de ' + total + ' tareas' : 'No hay tareas aún';
          }
          
          document.getElementById('taskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
          });
          
          updateStats();
        </script>
      `;
    }
    
    // Si menciona formas específicas o páginas simples
    else if (lowerPrompt.includes('círculo') || lowerPrompt.includes('circulo')) {
      const size = lowerPrompt.includes('pequeño') ? '30px' : lowerPrompt.includes('grande') ? '120px' : '60px';
      const circleColor = lowerPrompt.includes('negro') ? '#000000' : 
                         lowerPrompt.includes('rojo') ? '#ef4444' : 
                         lowerPrompt.includes('azul') ? '#3b82f6' : '#333333';
      
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { height: 100%; overflow: hidden; }
          </style>
        </head>
        <body style="width: 100vw; height: 100vh; background-color: white; display: flex; align-items: center; justify-content: center; margin: 0; padding: 0; font-family: 'Inter', sans-serif;">
          <div style="width: ${size}; height: ${size}; background-color: ${circleColor}; border-radius: 50%;"></div>
        </body>
        </html>
      `;
    }

    // App genérica personalizada
    else {
      return `
        <div style="max-width: 900px; margin: 40px auto; padding: 40px; font-family: 'Inter', sans-serif; background: white; border-radius: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #333; margin-bottom: 15px; font-weight: 300; font-size: 2.5rem;">Tu Aplicación</h1>
            <p style="color: #666; font-size: 1.1rem; font-style: italic; background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
              "${userPrompt}"
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 40px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 25px;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 1.8rem; font-weight: 400;">✨ Aplicación Desarrollada</h2>
              <p style="margin-bottom: 25px; color: #555; font-size: 1rem; line-height: 1.6;">Tu aplicación ha sido generada exitosamente con un diseño minimalista y moderno basado en tu descripción.</p>
              <button style="padding: 15px 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 1rem; font-weight: 500; transition: all 0.3s ease;" onclick="showInteraction()">
                Probar Funcionalidad
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px;">
            <div style="padding: 25px; background: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;">
              <h3 style="color: #495057; margin-bottom: 15px; font-size: 1.2rem; font-weight: 500;">🎨 Diseño</h3>
              <p style="color: #6c757d; font-size: 0.95rem; line-height: 1.5;">Interfaz moderna y minimalista adaptada a tu solicitud específica.</p>
            </div>
            
            <div style="padding: 25px; background: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;">
              <h3 style="color: #495057; margin-bottom: 15px; font-size: 1.2rem; font-weight: 500;">📱 Responsivo</h3>
              <p style="color: #6c757d; font-size: 0.95rem; line-height: 1.5;">Optimizado para funcionar perfectamente en todos los dispositivos.</p>
            </div>
            
            <div style="padding: 25px; background: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;">
              <h3 style="color: #495057; margin-bottom: 15px; font-size: 1.2rem; font-weight: 500;">⚡ Rápido</h3>
              <p style="color: #6c757d; font-size: 0.95rem; line-height: 1.5;">Desarrollado con las mejores prácticas para máximo rendimiento.</p>
            </div>
          </div>
        </div>
        
        <script>
          function showInteraction() {
            alert('¡Funcionalidad implementada!\\n\\nTu aplicación: "${userPrompt}"\\n\\nEsta demostración muestra cómo Pixan.ai puede desarrollar aplicaciones web automáticamente.');
          }
        </script>
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
            <p>Claude está analizando: "{prompt}"</p>
          </div>
          <style jsx global>{`
            body { margin: 0; padding: 0; }
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
              max-width: 500px;
              padding: 0 20px;
            }
            .loading-content h2 {
              margin: 30px 0 15px 0;
              color: #333;
              font-weight: 300;
              font-size: 1.8rem;
            }
            .loading-content p {
              color: #666;
              font-size: 1rem;
              font-style: italic;
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            .spinner {
              width: 60px;
              height: 60px;
              border: 4px solid #f3f3f3;
              border-top: 4px solid #667eea;
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
        </Head>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
            <h2 style={{ color: '#ff4757', marginBottom: '15px' }}>Error</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>{error}</p>
            <Link href="/">
              <button style={{ padding: '12px 24px', background: '#000', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Regresar a home
              </button>
            </Link>
          </div>
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

      <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto 40px auto', textAlign: 'center', position: 'relative' }}>
          <Link href="/">
            <button style={{ 
              position: 'absolute', 
              left: '0', 
              top: '0', 
              padding: '12px 20px', 
              background: '#f5f5f5', 
              color: '#333', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease'
            }}>
              Regresar a home
            </button>
          </Link>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '300', color: '#333', marginBottom: '10px' }}>
            Tu aplicación está lista
          </h1>
          <p style={{ fontSize: '1rem', color: '#666', fontStyle: 'italic' }}>
            Desarrollada con: "{prompt}"
          </p>
        </div>

        <div 
          style={{ maxWidth: '1200px', margin: '0 auto' }}
          dangerouslySetInnerHTML={{ __html: generatedApp }}
        />
      </div>
    </>
  );
}
