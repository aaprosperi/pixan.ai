import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiUnlock, FiKey, FiCheck, FiX, FiDollarSign, FiEye, FiEyeOff, FiRefreshCw, FiZap, FiShield, FiDatabase, FiActivity, FiTrendingUp, FiTrash } from 'react-icons/fi';
import { SiOpenai, SiGoogle, SiAnthropic } from 'react-icons/si';
import { BiBot } from 'react-icons/bi';
import { toast, Toaster } from 'react-hot-toast';
// Eliminamos confetti por ahora para evitar errores de SSR

const API_PROVIDERS = [
  { id: 'claude', name: 'Claude', icon: SiAnthropic, color: 'from-purple-500 to-purple-700', supportsBalance: true, glow: 'shadow-purple-500/50' },
  { id: 'openai', name: 'OpenAI', icon: SiOpenai, color: 'from-emerald-500 to-emerald-700', supportsBalance: true, glow: 'shadow-emerald-500/50' },
  { id: 'gemini', name: 'Gemini', icon: SiGoogle, color: 'from-blue-500 to-blue-700', supportsBalance: true, glow: 'shadow-blue-500/50' },
  { id: 'perplexity', name: 'Perplexity', icon: BiBot, color: 'from-indigo-500 to-indigo-700', supportsBalance: true, glow: 'shadow-indigo-500/50' },
  { id: 'deepseek', name: 'DeepSeek', icon: BiBot, color: 'from-cyan-500 to-cyan-700', supportsBalance: true, glow: 'shadow-cyan-500/50' },
  { id: 'mistral', name: 'Mistral', icon: BiBot, color: 'from-orange-500 to-orange-700', supportsBalance: true, glow: 'shadow-orange-500/50' }
];

export default function APIAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [apiKeys, setApiKeys] = useState({});
  const [showKeys, setShowKeys] = useState({});
  const [loading, setLoading] = useState({});
  const [balances, setBalances] = useState({});
  const [connectionStatus, setConnectionStatus] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      loadAPIKeys();
    }
  }, [isAuthenticated]);

  // Función para encriptar en el cliente
  const encryptClient = (text) => {
    // Simple encriptación para localStorage (NO es seguridad real, solo ofuscación)
    return btoa(encodeURIComponent(text));
  };

  // Función para desencriptar en el cliente
  const decryptClient = (text) => {
    try {
      return decodeURIComponent(atob(text));
    } catch {
      return '';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        toast.success('Acceso autorizado', {
          icon: '🔓',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        toast.error('Contraseña incorrecta', {
          icon: '🔒',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      toast.error('Error de autenticación');
    }
  };

  const loadAPIKeys = async () => {
    try {
      // Cargar desde localStorage
      const storedKeys = {};
      API_PROVIDERS.forEach(provider => {
        const encryptedKey = localStorage.getItem(`pixan_api_${provider.id}`);
        if (encryptedKey) {
          const decryptedKey = decryptClient(encryptedKey);
          if (decryptedKey) {
            // Mostrar solo los primeros y últimos caracteres
            const masked = decryptedKey.substring(0, 8) + '...' + decryptedKey.substring(decryptedKey.length - 4);
            storedKeys[provider.id] = masked;
          }
        }
      });
      setApiKeys(storedKeys);
    } catch (error) {
      console.error('Error loading keys:', error);
      toast.error('Error al cargar las API keys');
    }
  };

  const saveAPIKey = async (provider, key) => {
    setLoading({ ...loading, [provider]: true });
    
    try {
      // Validar la API key primero
      const response = await fetch('/api/admin/save-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, key })
      });

      if (response.ok) {
        // Guardar en localStorage encriptada
        const encryptedKey = encryptClient(key);
        localStorage.setItem(`pixan_api_${provider}`, encryptedKey);
        
        toast.success(`API key de ${provider} guardada localmente`, {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        await loadAPIKeys();
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setLoading({ ...loading, [provider]: false });
    }
  };

  const testConnection = async (provider) => {
    setConnectionStatus({ ...connectionStatus, [provider]: 'testing' });
    
    try {
      // Obtener la API key de localStorage
      const encryptedKey = localStorage.getItem(`pixan_api_${provider}`);
      if (!encryptedKey) {
        toast.error('No se encontró API key guardada');
        setConnectionStatus({ ...connectionStatus, [provider]: 'error' });
        return;
      }
      
      const apiKey = decryptClient(encryptedKey);
      
      const response = await fetch('/api/admin/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey })
      });

      const data = await response.json();
      
      if (data.success) {
        setConnectionStatus({ ...connectionStatus, [provider]: 'success' });
        
        // Obtener balance si es compatible
        if (API_PROVIDERS.find(p => p.id === provider)?.supportsBalance) {
          const balanceResponse = await fetch('/api/admin/check-balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider })
          });
          
          if (balanceResponse.ok) {
            const balanceData = await balanceResponse.json();
            if (balanceData.success) {
              setBalances({ ...balances, [provider]: balanceData.balance });
            }
          }
        }
        
        // Efectos visuales de éxito - confetti removido temporalmente
        
        toast.success(`${provider} conectado correctamente`, {
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        setConnectionStatus({ ...connectionStatus, [provider]: 'error' });
        const errorMessage = data.error || 'Error desconocido';
        toast.error(`Error en ${provider}: ${errorMessage}`, {
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            maxWidth: '500px',
          },
        });
      }
    } catch (error) {
      setConnectionStatus({ ...connectionStatus, [provider]: 'error' });
      toast.error('Error de conexión');
    }
  };

  const toggleShowKey = (provider) => {
    setShowKeys({ ...showKeys, [provider]: !showKeys[provider] });
  };

  const deleteAPIKey = (provider) => {
    try {
      // Remove from localStorage
      localStorage.removeItem(`pixan_api_${provider}`);
      
      // Update state to remove the masked key
      const updatedKeys = { ...apiKeys };
      delete updatedKeys[provider];
      setApiKeys(updatedKeys);
      
      // Clear connection status for this provider
      const updatedStatus = { ...connectionStatus };
      delete updatedStatus[provider];
      setConnectionStatus(updatedStatus);
      
      toast.success(`API de ${API_PROVIDERS.find(p => p.id === provider)?.name} eliminada`, {
        icon: '🗑️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error('Error al eliminar API');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-gray-800 shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", duration: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"
            >
              <FiLock className="text-white text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Administración de APIs</h1>
            <p className="text-gray-400">Ingresa la contraseña para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <FiKey className="absolute right-3 top-3.5 text-gray-500" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Acceder
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8">
      <Toaster position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
            >
              <FiShield className="text-white text-2xl" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white">Centro de Control de APIs</h1>
              <p className="text-gray-400 mt-1">Administra todas las APIs de Pixan.ai</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center gap-2"
          >
            <FiUnlock /> Cerrar sesión
          </motion.button>
        </div>

        {/* Explanatory text about client vs server API keys */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <FiDatabase className="text-blue-400 text-xl mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">APIs del Cliente vs Servidor</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                <strong>APIs del Cliente:</strong> Las APIs que configures aquí se almacenan localmente en tu navegador y tienen prioridad. 
                Estas se perderán si cambias de navegador o eliminas los datos del sitio.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>APIs del Servidor:</strong> Como respaldo, también tenemos APIs configuradas en los servidores de Vercel que se utilizarán 
                automáticamente cuando no tengas APIs del cliente configuradas.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {API_PROVIDERS.map((provider, index) => {
            const Icon = provider.icon;
            const status = connectionStatus[provider.id];
            
            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${provider.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl ${provider.glow}`} />
                
                <div className={`relative bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-2xl ${connectionStatus[provider.id] === 'success' ? provider.glow : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${provider.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="text-white text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{provider.name}</h3>
                        {balances[provider.id] !== undefined && (
                          <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                            <FiDollarSign className="text-xs" />
                            <span>${balances[provider.id].toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {status && (
                      <div className="flex items-center gap-2">
                        {status === 'testing' && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <FiRefreshCw className="text-yellow-400" />
                          </motion.div>
                        )}
                        {status === 'success' && <FiCheck className="text-green-400 text-xl" />}
                        {status === 'error' && <FiX className="text-red-400 text-xl" />}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type={showKeys[provider.id] ? 'text' : 'password'}
                        value={apiKeys[provider.id] || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, [provider.id]: e.target.value })}
                        onFocus={(e) => {
                          // Al hacer focus, cargar la key real si existe
                          const encryptedKey = localStorage.getItem(`pixan_api_${provider.id}`);
                          if (encryptedKey && apiKeys[provider.id]?.includes('...')) {
                            const decryptedKey = decryptClient(encryptedKey);
                            setApiKeys({ ...apiKeys, [provider.id]: decryptedKey });
                          }
                        }}
                        placeholder="API Key"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-10"
                      />
                      <button
                        onClick={() => toggleShowKey(provider.id)}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {showKeys[provider.id] ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => saveAPIKey(provider.id, apiKeys[provider.id])}
                        disabled={loading[provider.id]}
                        className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading[provider.id] ? 'Guardando...' : 'Guardar'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => testConnection(provider.id)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
                      >
                        <FiZap /> Test
                      </motion.button>
                      
                      {apiKeys[provider.id] && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => deleteAPIKey(provider.id)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/30 transition-all flex items-center"
                          title="Eliminar API"
                        >
                          <FiTrash />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <FiDatabase className="text-purple-400" />
            </motion.div>
            Estado del Sistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-400 text-sm">APIs Configuradas</div>
                <FiKey className="text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white">
                {Object.values(apiKeys).filter(Boolean).length} / {API_PROVIDERS.length}
              </div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(Object.values(apiKeys).filter(Boolean).length / API_PROVIDERS.length) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-green-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-400 text-sm">APIs Activas</div>
                <FiActivity className="text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-400">
                {Object.values(connectionStatus).filter(s => s === 'success').length}
              </div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(Object.values(connectionStatus).filter(s => s === 'success').length / API_PROVIDERS.length) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-400 text-sm">Saldo Total</div>
                <FiTrendingUp className="text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white flex items-center">
                <FiDollarSign className="text-green-400 text-2xl" />
                {Object.values(balances).reduce((sum, b) => sum + (b || 0), 0).toFixed(2)}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {Object.values(balances).filter(b => b > 0).length} APIs con saldo
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}