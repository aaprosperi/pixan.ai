import React, { useState } from 'react';

export default function TestInputs() {
  const [text, setText] = useState('');
  const [slider, setSlider] = useState(5);

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>Test de Inputs Básicos</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Textarea Controlado Simple:</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          cols={50}
          placeholder="Escribe aquí..."
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <p>Caracteres: {text.length}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Input Normal:</h3>
        <input
          type="text"
          onChange={(e) => console.log('Input:', e.target.value)}
          style={{ padding: '10px', fontSize: '16px', width: '300px' }}
          placeholder="Escribe aquí..."
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Slider: {slider}</h3>
        <input
          type="range"
          min="0"
          max="10"
          value={slider}
          onChange={(e) => setSlider(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0' }}>
        <h3>Información del Sistema:</h3>
        <p>React Version: {React.version}</p>
        <p>Node Env: {process.env.NODE_ENV}</p>
        <p>User Agent: <span style={{ fontSize: '12px' }}>{typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR'}</span></p>
      </div>
    </div>
  );
}