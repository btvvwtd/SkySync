import React from 'react';
import { useTranslation } from 'react-i18next';

interface PasswordStepProps {
  email: string;
  password: string;
  setPassword: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  error: string;
  isLoading: boolean;
  handlePasswordSubmit: (e: React.FormEvent) => void;
  setStep: (step: 'email' | 'password' | 'register') => void;
  buttonStyle: React.CSSProperties;
}

const PasswordStep: React.FC<PasswordStepProps> = ({
  email,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  error,
  isLoading,
  handlePasswordSubmit,
  setStep,
  buttonStyle,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <button
        onClick={() => setStep('email')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          alignSelf: 'flex-start',
          padding: '8px 0',
          color: '#333',
          fontWeight: 500,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span style={{ textDecoration: 'underline', textDecorationColor: '#000' }}>{t('login.password_step.back')}</span>
      </button>

      <div style={{ textAlign: 'center', lineHeight: 1.2, width: '100%' }}>
        <p style={{ margin: 0, textAlign: 'center', fontSize: '25px' }}>{t('login.password_step.welcome_back')}</p>
        <p style={{
          margin: '8px 0 24px',
          textAlign: 'center',
          fontSize: '16px',
          color: '#333',
          lineHeight: '60px',
          fontWeight: '400'
        }}>
          {t('login.password_step.sign_in_with', { email })}
        </p>
      </div>

      <form onSubmit={handlePasswordSubmit} style={{ width: '100%' }}>
        <label htmlFor="password" style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 400,
          fontSize: '12px',
          marginTop: '-30px',
          color: '#666',
        }}>
          {t('login.password_step.password_label')}
        </label>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '16px',
              borderRadius: '0',
              border: error ? '1px solid red' : '1px solid #ccc',
              marginBottom: '14px',
              textAlign: 'left',
              color: '#000',
              boxSizing: 'border-box',
              fontWeight: 400,
              height: '40px',
              outline: 'none',
              transition: 'border-color 0.2s ease-in-out',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#007BFF')}
            onBlur={e => (e.currentTarget.style.borderColor = error ? 'red' : '#ccc')}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px', // Adjusted to align with input height
              transform: 'translateY(-10%)',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            <img
              src={showPassword ? '/logo_icons/view.svg' : '/logo_icons/hide.svg'} // Змінено шлях
              alt={showPassword ? t('login.password_step.hide') : t('login.password_step.show')}
              style={{ width: '20px', height: '20px' }}
            />
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <a href="#" style={{
            minHeight: '25px',
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '12px',
          }}>
            {t('login.password_step.forgot_password')}
          </a>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            userSelect: 'none',
          }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ display: 'none' }}
              id="remember-me-checkbox"
            />
            <span style={{
              width: '18px',
              height: '18px',
              border: '2px solid #000',
              display: 'inline-block',
              position: 'relative',
              backgroundColor: rememberMe ? '#000' : 'transparent',
              transition: 'background-color 0.2s ease',
              borderRadius: '0',
              boxSizing: 'border-box',
            }}>
              {rememberMe && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '1px',
                    width: '12px',
                    height: '12px',
                  }}
                >
                  <polyline points="4 12 10 18 20 6" />
                </svg>
              )}
            </span>
            <span onClick={() => setRememberMe(!rememberMe)}>{t('login.password_step.remember_me')}</span>
          </label>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...buttonStyle,
            backgroundColor: isLoading ? '#ccc' : '#007BFF',
            color: '#fff',
            marginBottom: '60px',
            fontSize: '16px'
          }}
        >
          {isLoading ? t('login.password_step.logging_in') : t('login.password_step.login_button')}
        </button>
      </form>
    </>
  );
};

export default PasswordStep;