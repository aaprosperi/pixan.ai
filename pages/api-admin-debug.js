import { useState, useEffect } from 'react';

// Solo componentes básicos, sin librerías externas
export default function APIAdminDebug() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        alert('¡Acceso autorizado!');
      } else {
        alert('Contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '3rem',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minWidth: '400px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              🔐
            </div>
            <h1 style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: '2rem',
              fontWeight: '600'
            }}>
              Admin Center
            </h1>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              margin: '0.5rem 0 0 0' 
            }}>
              Ingresa tu contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ marginBottom: '1rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #4facfe, #00f2fe)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '🔄 Verificando...' : '🚀 Acceder'}
            </button>
          </form>

          <div style={{ 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.9rem'
          }}>
            Versión de debug - Sin dependencias externas
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '2rem',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            textAlign: 'center'
          }}>
            🎉 ¡Acceso Exitoso!
          </h1>
          
          <p style={{ 
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.2rem',
            margin: '0 0 2rem 0'
          }}>
            La autenticación funciona perfectamente. Esta es la versión debug sin dependencias externas.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => setIsAuthenticated(false)}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '2rem',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0' }}>📊 Información de Debug</h2>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>✅ React hooks funcionando</li>
            <li>✅ Fetch API funcionando</li>
            <li>✅ Estado de autenticación funcionando</li>
            <li>✅ Estilos inline funcionando</li>
            <li>🔧 Sin dependencias externas (framer-motion, react-icons, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}