import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="language-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-button"
        aria-label="Select language"
      >
        <span className="flag">{currentLang.flag}</span>
        <span className="lang-code">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`chevron ${isOpen ? 'rotate' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`language-option ${lang.code === language ? 'active' : ''}`}
            >
              <span className="flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .language-selector {
          position: relative;
          z-index: 1000;
        }

        .language-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .language-button:hover {
          border-color: #28106A;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .flag {
          font-size: 18px;
          line-height: 1;
        }

        .lang-code {
          font-weight: 600;
        }

        .chevron {
          transition: transform 0.2s ease;
        }

        .chevron.rotate {
          transform: rotate(180deg);
        }

        .language-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          min-width: 140px;
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 14px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          text-align: left;
          transition: background 0.2s ease;
        }

        .language-option:hover {
          background: #f8f9fa;
        }

        .language-option.active {
          background: #28106A;
          color: white;
        }

        .lang-name {
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .language-button {
            padding: 6px 10px;
            font-size: 13px;
          }

          .flag {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}