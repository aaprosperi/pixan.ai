import { useState } from 'react';

export default function APIAdminSimple() {
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

      const data = await response.json();
      
      if (response.ok) {
        setIsAuthenticated(true);
        alert('Acceso autorizado');
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
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#000',
        color: '#fff',
        fontFamily: 'system-ui'
      }}>
        <div style={{ 
          padding: '2rem', 
          background: '#111', 
          borderRadius: '8px',
          minWidth: '300px'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Admin Simple
          </h1>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              style={{
                width: '100%',
                padding: '1rem',
                marginBottom: '1rem',
                background: '#222',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff'
              }}
            />
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#0066cc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Verificando...' : 'Acceder'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui'
    }}>
      <h1>¡Acceso Exitoso!</h1>
      <p>La autenticación funciona correctamente.</p>
      <button 
        onClick={() => setIsAuthenticated(false)}
        style={{
          padding: '0.5rem 1rem',
          background: '#cc0000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}