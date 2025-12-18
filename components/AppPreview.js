import { useState, useEffect, useRef } from 'react';

/**
 * AppPreview Component
 * Visualiza aplicaciones web generadas por IA con iframe sandboxed
 * Soporta: HTML/CSS/JS vanilla, React (CDN), Vue (CDN)
 */
const AppPreview = ({ code, framework = 'html', onClose }) => {
  const [view, setView] = useState('split'); // 'split', 'code', 'preview'
  const [editedCode, setEditedCode] = useState(code);
  const iframeRef = useRef(null);

  useEffect(() => {
    setEditedCode(code);
  }, [code]);

  useEffect(() => {
    if (iframeRef.current && editedCode) {
      updatePreview();
    }
  }, [editedCode, framework]);

  const updatePreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const htmlContent = generateHTML(editedCode, framework);

    // Crear blob URL para contenido del iframe
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    iframe.src = url;

    // Limpiar URL después de cargar
    iframe.onload = () => {
      URL.revokeObjectURL(url);
    };
  };

  const generateHTML = (code, framework) => {
    const templates = {
      html: () => code, // Ya es HTML completo

      javascript: () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JS App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${code}
  </script>
</body>
</html>`,

      react: () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}

    // Auto-render si hay un componente App
    if (typeof App !== 'undefined') {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    }
  </script>
</body>
</html>`,

      vue: () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue App</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    const { createApp } = Vue;
    ${code}

    // Auto-mount si hay un objeto app o App
    if (typeof app !== 'undefined') {
      createApp(app).mount('#app');
    } else if (typeof App !== 'undefined') {
      createApp(App).mount('#app');
    }
  </script>
</body>
</html>`,

      css: () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Demo</title>
  <style>
    ${code}
  </style>
</head>
<body>
  <div class="container">
    <h1>CSS Preview</h1>
    <p>Add your HTML elements here</p>
  </div>
</body>
</html>`
    };

    return templates[framework]?.() || templates.html();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(editedCode);
    alert('Código copiado al portapapeles');
  };

  const downloadCode = () => {
    const extensions = {
      html: 'html',
      javascript: 'js',
      react: 'jsx',
      vue: 'vue',
      css: 'css'
    };

    const blob = new Blob([editedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app.${extensions[framework] || 'html'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    const htmlContent = generateHTML(editedCode, framework);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h3 style={styles.title}>
              🚀 App Preview - {framework.toUpperCase()}
            </h3>
            <div style={styles.viewToggle}>
              <button
                style={{...styles.toggleBtn, ...(view === 'code' ? styles.toggleBtnActive : {})}}
                onClick={() => setView('code')}
              >
                Code
              </button>
              <button
                style={{...styles.toggleBtn, ...(view === 'split' ? styles.toggleBtnActive : {})}}
                onClick={() => setView('split')}
              >
                Split
              </button>
              <button
                style={{...styles.toggleBtn, ...(view === 'preview' ? styles.toggleBtnActive : {})}}
                onClick={() => setView('preview')}
              >
                Preview
              </button>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.iconBtn} onClick={copyCode} title="Copy code">
              📋
            </button>
            <button style={styles.iconBtn} onClick={downloadCode} title="Download">
              💾
            </button>
            <button style={styles.iconBtn} onClick={openInNewTab} title="Open in new tab">
              🔗
            </button>
            <button style={styles.iconBtn} onClick={updatePreview} title="Refresh">
              🔄
            </button>
            <button style={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Code Editor */}
          {(view === 'code' || view === 'split') && (
            <div style={{
              ...styles.panel,
              ...(view === 'split' ? styles.panelHalf : styles.panelFull)
            }}>
              <div style={styles.panelHeader}>
                <span>📝 Code Editor</span>
                <span style={styles.panelBadge}>{framework}</span>
              </div>
              <textarea
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
                style={styles.codeEditor}
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview */}
          {(view === 'preview' || view === 'split') && (
            <div style={{
              ...styles.panel,
              ...(view === 'split' ? styles.panelHalf : styles.panelFull)
            }}>
              <div style={styles.panelHeader}>
                <span>👁️ Live Preview</span>
              </div>
              <iframe
                ref={iframeRef}
                style={styles.iframe}
                sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
                title="App Preview"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>
            ⚡ Sandboxed iframe | Edit code and it will update in real-time
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '20px'
  },
  modal: {
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    width: '95vw',
    height: '90vh',
    maxWidth: '1600px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  header: {
    padding: '16px 24px',
    backgroundColor: '#252526',
    borderBottom: '1px solid #3e3e42',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  headerRight: {
    display: 'flex',
    gap: '8px'
  },
  title: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0
  },
  viewToggle: {
    display: 'flex',
    gap: '4px',
    backgroundColor: '#1e1e1e',
    padding: '4px',
    borderRadius: '6px'
  },
  toggleBtn: {
    padding: '6px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#ccc',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s'
  },
  toggleBtnActive: {
    backgroundColor: '#0e639c',
    color: '#fff'
  },
  iconBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#ccc',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: '#f44336',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: 'bold',
    marginLeft: '8px'
  },
  content: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: '#1e1e1e'
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1e1e1e'
  },
  panelHalf: {
    flex: 1,
    borderRight: '1px solid #3e3e42'
  },
  panelFull: {
    flex: 1
  },
  panelHeader: {
    padding: '12px 16px',
    backgroundColor: '#252526',
    borderBottom: '1px solid #3e3e42',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ccc',
    fontSize: '13px',
    fontWeight: '500'
  },
  panelBadge: {
    backgroundColor: '#0e639c',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  codeEditor: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    border: 'none',
    padding: '16px',
    fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
    fontSize: '14px',
    lineHeight: '1.6',
    resize: 'none',
    outline: 'none',
    overflow: 'auto'
  },
  iframe: {
    flex: 1,
    width: '100%',
    border: 'none',
    backgroundColor: '#fff'
  },
  footer: {
    padding: '12px 24px',
    backgroundColor: '#252526',
    borderTop: '1px solid #3e3e42',
    flexShrink: 0
  },
  footerText: {
    color: '#888',
    fontSize: '12px'
  }
};

export default AppPreview;
