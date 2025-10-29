import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import toast, { Toaster } from 'react-hot-toast';

export default function Proc() {
  const { t } = useLanguage();
  const [step, setStep] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [docType, setDocType] = useState('');
  const [formData, setFormData] = useState({
    objective: '',
    scope: '',
    responsibles: '',
    additionalDocs: '',
    principles: '',
    steps: '',
    indicators: ''
  });

  const [allDocs, setAllDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState(null);

  // AI Assistant states
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (step === 'consult') {
      loadDocuments();
    }
  }, [step]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setStep('selection');
      toast.success(t('proc.login.success'));
    } else {
      toast.error(t('proc.login.error'));
    }
  };

  const handleSelection = (type) => {
    if (type === 'consult') {
      setStep('consult');
    } else if (type === 'ai-policy' || type === 'ai-process') {
      // Modo asistente AI
      setDocType(type === 'ai-policy' ? 'policy' : 'process');
      setConversationHistory([]);
      setExtractedData(null);
      setShowPreview(false);
      setStep('ai-assistant');
    } else {
      setDocType(type);
      setFormData({
        objective: '',
        scope: '',
        responsibles: '',
        additionalDocs: '',
        principles: '',
        steps: '',
        indicators: ''
      });
      setStep('form');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const document = {
      type: docType,
      username: username,
      timestamp: new Date().toISOString(),
      ...formData
    };

    try {
      const response = await fetch('/api/save-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document)
      });

      if (response.ok) {
        toast.success(t('proc.form.success'));
        setStep('selection');
        setFormData({
          objective: '',
          scope: '',
          responsibles: '',
          additionalDocs: '',
          principles: '',
          steps: '',
          indicators: ''
        });
      } else {
        toast.error(t('proc.form.error'));
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error(t('proc.form.error'));
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/save-document');
      if (response.ok) {
        const data = await response.json();
        setAllDocs(data.documents || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error(t('proc.consult.loadError'));
    }
  };

  // AI Assistant functions
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isAiLoading) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsAiLoading(true);

    // Agregar mensaje del usuario al historial
    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];
    setConversationHistory(newHistory);

    try {
      const response = await fetch('/api/proc-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
          documentType: docType,
          currentData: extractedData || {}
        })
      });

      if (!response.ok) {
        throw new Error('Error communicating with AI assistant');
      }

      const data = await response.json();

      // Agregar respuesta del asistente al historial
      setConversationHistory([
        ...newHistory,
        { role: 'assistant', content: data.content }
      ]);

      // Si hay datos extraídos, mostrarlos
      if (data.isComplete && data.extractedData) {
        setExtractedData(data.extractedData);
        setShowPreview(true);
        toast.success('Documento completo! Revisa los datos y guarda.');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al comunicarse con el asistente AI');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveAiDocument = async () => {
    if (!extractedData) {
      toast.error('No hay datos para guardar');
      return;
    }

    const document = {
      type: docType,
      username: username,
      timestamp: new Date().toISOString(),
      ...extractedData
    };

    try {
      const response = await fetch('/api/save-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document)
      });

      if (response.ok) {
        toast.success(t('proc.form.success'));
        setStep('selection');
        setConversationHistory([]);
        setExtractedData(null);
        setShowPreview(false);
      } else {
        toast.error(t('proc.form.error'));
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error(t('proc.form.error'));
    }
  };

  const handleStartNewConversation = () => {
    setConversationHistory([]);
    setExtractedData(null);
    setShowPreview(false);
    setCurrentMessage('');
  };

  const handleDelete = async (docId) => {
    if (!confirm(t('proc.consult.deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/save-document?id=${docId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success(t('proc.consult.deleteSuccess'));
        loadDocuments();
        setSelectedDoc(null);
      } else {
        toast.error(t('proc.consult.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error(t('proc.consult.deleteError'));
    }
  };

  const handleExport = async () => {
    try {
      const docsToExport = getFilteredDocs();
      const response = await fetch('/api/export-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: docsToExport })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `documentos_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(t('proc.consult.exportSuccess'));
      } else {
        toast.error(t('proc.consult.exportError'));
      }
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error(t('proc.consult.exportError'));
    }
  };

  const getFilteredDocs = () => {
    return allDocs.filter(doc => {
      const matchesSearch = !searchTerm || 
        doc.objective?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.responsibles?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || doc.type === filterType;
      
      return matchesSearch && matchesType;
    });
  };

  const handleBack = () => {
    if (step === 'form' || step === 'consult' || step === 'ai-assistant') {
      setStep('selection');
      setSelectedDoc(null);
      setConversationHistory([]);
      setExtractedData(null);
      setShowPreview(false);
    } else if (step === 'selection') {
      setStep('login');
    }
  };

  const renderLogin = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {t('proc.title')}
        </h1>
        <p className="text-gray-600 mb-8 text-center">{t('proc.subtitle')}</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('proc.login.username')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('proc.login.usernamePlaceholder')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('proc.login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('proc.login.passwordPlaceholder')}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('proc.login.submit')}
          </button>
        </form>
      </div>
    </div>
  );

  const renderSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('proc.selection.welcome')}, {username}
          </h1>
          <p className="text-gray-600 mb-8">{t('proc.selection.choose')}</p>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">✨ Asistente AI (Recomendado)</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => handleSelection('ai-policy')}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg border-2 border-yellow-300"
              >
                <div className="text-4xl mb-3">🤖📋</div>
                <h3 className="text-lg font-bold mb-2">Política con AI</h3>
                <p className="text-indigo-100 text-sm">Claude te ayudará paso a paso a crear una política completa</p>
              </button>

              <button
                onClick={() => handleSelection('ai-process')}
                className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg border-2 border-yellow-300"
              >
                <div className="text-4xl mb-3">🤖⚙️</div>
                <h3 className="text-lg font-bold mb-2">Proceso con AI</h3>
                <p className="text-teal-100 text-sm">Claude te guiará para documentar tu proceso de forma profesional</p>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">📝 Modo Manual</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => handleSelection('policy')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-lg font-bold mb-2">{t('proc.selection.policy')}</h3>
                <p className="text-blue-100 text-sm">{t('proc.selection.policyDesc')}</p>
              </button>

              <button
                onClick={() => handleSelection('process')}
                className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-4xl mb-3">⚙️</div>
                <h3 className="text-lg font-bold mb-2">{t('proc.selection.process')}</h3>
                <p className="text-green-100 text-sm">{t('proc.selection.processDesc')}</p>
              </button>

              <button
                onClick={() => handleSelection('consult')}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-bold mb-2">{t('proc.selection.consult')}</h3>
                <p className="text-purple-100 text-sm">{t('proc.selection.consultDesc')}</p>
              </button>
            </div>
          </div>

          <button
            onClick={handleBack}
            className="mt-8 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← {t('proc.form.back')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {docType === 'policy' ? t('proc.policy.title') : t('proc.process.title')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('proc.form.author')}: <span className="font-semibold">{username}</span>
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('proc.common.objective')}
              </label>
              <textarea
                value={formData.objective}
                onChange={(e) => handleInputChange('objective', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('proc.common.scope')}
              </label>
              <textarea
                value={formData.scope}
                onChange={(e) => handleInputChange('scope', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('proc.common.responsibles')}
              </label>
              <textarea
                value={formData.responsibles}
                onChange={(e) => handleInputChange('responsibles', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                required
              />
            </div>
            
            {docType === 'policy' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('proc.policy.principles')}
                </label>
                <textarea
                  value={formData.principles}
                  onChange={(e) => handleInputChange('principles', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  required
                />
              </div>
            )}
            
            {docType === 'process' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('proc.process.steps')}
                  </label>
                  <textarea
                    value={formData.steps}
                    onChange={(e) => handleInputChange('steps', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="5"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('proc.process.indicators')}
                  </label>
                  <textarea
                    value={formData.indicators}
                    onChange={(e) => handleInputChange('indicators', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('proc.common.additionalDocs')}
              </label>
              <textarea
                value={formData.additionalDocs}
                onChange={(e) => handleInputChange('additionalDocs', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                {t('proc.form.back')}
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('proc.form.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderConsult = () => {
    const filteredDocs = getFilteredDocs();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto pt-8 pb-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              {t('proc.consult.title')}
            </h1>
            
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder={t('proc.consult.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleExport}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap"
                >
                  📊 {t('proc.consult.export')}
                </button>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t('proc.consult.filterAll')}
                </button>
                <button
                  onClick={() => setFilterType('policy')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'policy'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📋 {t('proc.consult.filterPolicies')}
                </button>
                <button
                  onClick={() => setFilterType('process')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'process'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ⚙️ {t('proc.consult.filterProcesses')}
                </button>
              </div>
            </div>

            {filteredDocs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">📭</div>
                <p>{t('proc.consult.noDocuments')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                      doc.type === 'policy'
                        ? 'border-blue-200 hover:border-blue-400'
                        : 'border-green-200 hover:border-green-400'
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{doc.type === 'policy' ? '📋' : '⚙️'}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        doc.type === 'policy' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {doc.type === 'policy' ? t('proc.consult.typePolicy') : t('proc.consult.typeProcess')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {doc.objective}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>👤 {doc.username}</p>
                      <p>📅 {new Date(doc.timestamp).toLocaleDateString()}</p>
                    </div>
                    <button
                      className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {t('proc.consult.viewDetails')} →
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleBack}
              className="mt-8 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← {t('proc.form.back')}
            </button>
          </div>
        </div>

        {selectedDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedDoc.type === 'policy' ? '📋 ' + t('proc.consult.typePolicy') : '⚙️ ' + t('proc.consult.typeProcess')}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t('proc.form.author')}: {selectedDoc.username} • {new Date(selectedDoc.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">{t('proc.common.objective')}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedDoc.objective}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">{t('proc.common.scope')}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedDoc.scope}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">{t('proc.common.responsibles')}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedDoc.responsibles}</p>
                </div>
                
                {selectedDoc.type === 'policy' && selectedDoc.principles && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{t('proc.policy.principles')}</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedDoc.principles}</p>
                  </div>
                )}
                
                {selectedDoc.type === 'process' && (
                  <>
                    {selectedDoc.steps && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">{t('proc.process.steps')}</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">{selectedDoc.steps}</p>
                      </div>
                    )}
                    {selectedDoc.indicators && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">{t('proc.process.indicators')}</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">{selectedDoc.indicators}</p>
                      </div>
                    )}
                  </>
                )}
                
                {selectedDoc.additionalDocs && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{t('proc.common.additionalDocs')}</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedDoc.additionalDocs}</p>
                  </div>
                )}
              </div>
              
              <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex gap-4">
                <button
                  onClick={() => handleDelete(selectedDoc.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  🗑️ {t('proc.consult.delete')}
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  {t('proc.consult.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAiAssistant = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto pt-8 pb-8">
        <div className="bg-white rounded-lg shadow-xl p-8 h-[calc(100vh-8rem)] flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🤖 {docType === 'policy' ? 'Asistente AI para Política' : 'Asistente AI para Proceso'}
            </h1>
            <p className="text-gray-600">
              Chatea con Claude Sonnet 4.5 para crear tu documento de forma guiada
            </p>
          </div>

          {/* Chat container */}
          <div className="flex-1 overflow-y-auto mb-6 border rounded-lg bg-gray-50 p-4 space-y-4">
            {conversationHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg mb-2">¡Hola! Soy tu asistente AI</p>
                <p className="text-sm">
                  {docType === 'policy'
                    ? 'Te ayudaré a crear una política completa. Cuéntame sobre la política que quieres documentar.'
                    : 'Te ayudaré a documentar tu proceso. Describe el proceso que quieres documentar.'}
                </p>
              </div>
            ) : (
              conversationHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl">
                        {msg.role === 'user' ? '👤' : '🤖'}
                      </span>
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message input */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAiLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isAiLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>

            <div className="flex gap-2 justify-between">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Volver
              </button>

              {conversationHistory.length > 0 && (
                <button
                  onClick={handleStartNewConversation}
                  className="text-orange-600 hover:text-orange-800 transition-colors"
                >
                  🔄 Nueva conversación
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && extractedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ✅ Documento Completo - Revisar antes de guardar
              </h2>
              <p className="text-sm text-gray-600">
                Revisa que toda la información sea correcta antes de guardar en Vercel KV
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Objetivo</h3>
                <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">{extractedData.objective}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Alcance</h3>
                <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">{extractedData.scope}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Responsables</h3>
                <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">{extractedData.responsibles}</p>
              </div>

              {docType === 'policy' && extractedData.principles && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Principios</h3>
                  <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">{extractedData.principles}</p>
                </div>
              )}

              {docType === 'process' && (
                <>
                  {extractedData.steps && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Pasos</h3>
                      <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">{extractedData.steps}</p>
                    </div>
                  )}
                  {extractedData.indicators && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Indicadores</h3>
                      <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">{extractedData.indicators}</p>
                    </div>
                  )}
                </>
              )}

              {extractedData.additionalDocs && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Documentos Adicionales</h3>
                  <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">{extractedData.additionalDocs}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex gap-4">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Seguir editando
              </button>
              <button
                onClick={handleSaveAiDocument}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                💾 Guardar en Vercel KV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Head>
        <title>{t('proc.title')} | Pixan.ai</title>
        <meta name="description" content={t('proc.subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Toaster position="top-center" />

      {step === 'login' && renderLogin()}
      {step === 'selection' && renderSelection()}
      {step === 'form' && renderForm()}
      {step === 'consult' && renderConsult()}
      {step === 'ai-assistant' && renderAiAssistant()}
    </>
  );
}
