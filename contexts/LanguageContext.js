import { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from '../lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('pixan_language');
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
    // Default language is already 'en' (English)
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('pixan_language', lang);
    }
  };

  const t = (path) => {
    return getTranslation(language, path);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}