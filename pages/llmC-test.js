import { useState, useEffect } from 'react';

export default function LLMCTest() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('Test component mounted');
  }, []);
  
  const testFetch = async () => {
    try {
      setStep(1);
      console.log('Starting fetch test...');
      
      const response = await fetch('/api/token-stats/', {
        headers: {
          'x-auth-password': 'pixan'
        }
      });
      
      setStep(2);
      console.log('Response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setStep(3);
        console.log('Data received:', data);
      }
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    }
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>LLM Colaborativa - Test Page</h1>
      <p>Step: {step}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <button onClick={testFetch} style={{ padding: '10px', marginTop: '10px' }}>
        Test Fetch Token Stats
      </button>
      <div style={{ marginTop: '20px' }}>
        <p>Esta es una página de prueba para debuggear el problema.</p>
        <p>Abre la consola (F12) para ver los logs.</p>
      </div>
    </div>
  );
}