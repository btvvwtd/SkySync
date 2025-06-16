import React, { useState, useEffect } from 'react';
import i18n from '../i18n/i18n';
import { useTranslation } from 'react-i18next';

interface LanguageButtonProps {
  onClick: () => void;
}

const LanguageButton: React.FC<LanguageButtonProps> = ({ onClick }) => (
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        color: '#333',
        fontSize: '14px',
      }}
    >
      <img
        src="/logo_icons/internet.svg"
        alt="Language Selector"
        style={{ height: '18px', width: '18px' }}
      />
    </button>
  </div>
);

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const languages = [
    { name: 'Bahasa Indonesia', code: 'id' },
    { name: 'Français (Canada)', code: 'fr-CA' },
    { name: 'Svenska', code: 'sv' },
    { name: 'Bahasa Malaysia', code: 'ms' },
    { name: 'Français (France)', code: 'fr' },
    { name: 'Українська', code: 'uk' },
    { name: 'Dansk', code: 'da' },
    { name: 'Italiano', code: 'it' },
    { name: 'ไทย', code: 'th' },
    { name: 'Deutsch', code: 'de' },
    { name: 'Nederlands', code: 'nl' },
    { name: '中文（简体）', code: 'zh-CN' },
    { name: 'English (United Kingdom)', code: 'en-GB' },
    { name: 'Norsk (bokmål)', code: 'nb' },
    { name: '中文（繁體）', code: 'zh-TW' },
    { name: 'English (United States)', code: 'en' },
    { name: 'Polski', code: 'pl' },
    { name: '日本語', code: 'ja' },
    { name: 'Español (España)', code: 'es' },
    { name: 'Português (Brasil)', code: 'pt-BR' },
    { name: '한국어', code: 'ko' },
    { name: 'Español (Latinoamérica)', code: 'es-LA' },
    { name: 'Русский', code: 'ru' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 999,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '27%',
          left: '50%',
          transform: 'translate(-50%, -40%)',
          backgroundColor: '#fff',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          width: '700px',
          padding: '32px',
          fontFamily: 'system-ui, sans-serif',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '4px',
            right: '10px',
            width: '30px',
            height: '30px',
            fontSize: '22px',
            border: 'none',
            background: 'none',
            color: '#222',
            cursor: 'pointer',
            padding: '0',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          ×
        </button>
        <h2
          style={{
            fontSize: '20px',
            marginBottom: '24px',
            fontWeight: 500,
            color: '#111',
          }}
        >
          {t('language_selector.choose_language')}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px 24px',
          }}
        >
          {languages.map((lang, idx) => (
            <div
              key={idx}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                localStorage.setItem('language', lang.code); // Збереження обраної мови
                onClose();
              }}
              style={{
                cursor: 'pointer',
                fontSize: '13px',
                color: '#222',
                padding: '4px 6px',
                borderRadius: 'none',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {lang.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <LanguageButton onClick={() => setIsOpen(true)} />
      <LanguageModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default LanguageSelector;