import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmailStepProps {
  email: string;
  setEmail: (value: string) => void;
  error: string;
  isLoading: boolean;
  handleEmailSubmit: (e: React.FormEvent) => void;
  handleGoogleSignIn: () => void;
  buttonStyle: React.CSSProperties;
}

const EmailStep: React.FC<EmailStepProps> = ({
  email,
  setEmail,
  error,
  isLoading,
  handleEmailSubmit,
  buttonStyle,
}) => {
  const { t } = useTranslation();

  const handleLogin = (provider: string) => {
    alert(`Authorization via ${provider} is not yet implemented`);
  };

  return (
    <>
      <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
        <p style={{ margin: 0, fontSize: '20px' }}>{t('login.email_step.title_line1')}</p>
        <p style={{ margin: 0, fontSize: '20px' }}>{t('login.email_step.title_line2')}</p>
      </div>

      <div id="googleSignInDiv" style={{ marginBottom: '10px', width: '100%' }}></div>

      <button
        onClick={() => handleLogin('Apple')}
        style={{
          ...buttonStyle,
          backgroundColor: '#fff',
          color: '#000',
          border: '1px solid #ccc',
          borderRadius: '0',
        }}
      >
        <img
          src="/logo_icons/apple-logo.svg" // Змінено шлях
          alt="Apple"
          style={{ height: '20px', width: '20px' }}
        />
        {t('login.email_step.continue_with_apple')}
      </button>

      <div style={{ width: '100%', textAlign: 'center', borderBottom: '1px solid #ccc', lineHeight: '0.1em', margin: '20px 0' }}>
        <span style={{ background: 'white', padding: '0 10px', color: '#000', fontWeight: 500 }}>{t('login.email_step.or')}</span>
      </div>

      <form onSubmit={handleEmailSubmit} style={{ width: '100%' }}>
        <label htmlFor="email" style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: 400,
          fontSize: '12px',
          color: '#666',
        }}>
          {t('login.email_step.email_label')}
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '14px',
            borderRadius: '0',
            border: error ? '1px solid red' : '1px solid #ccc',
            marginBottom: '14px',
            textAlign: 'left',
            color: '#000',
            boxSizing: 'border-box',
            fontWeight: 400,
          }}
        />
        {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...buttonStyle,
            backgroundColor: isLoading ? '#ccc' : '#007BFF',
            color: '#fff',
          }}
        >
          {isLoading ? t('login.email_step.checking') : t('login.email_step.continue_button')}
        </button>
      </form>
    </>
  );
};

export default EmailStep;