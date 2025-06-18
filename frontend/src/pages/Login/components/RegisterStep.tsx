import React from 'react';
import { useTranslation } from 'react-i18next';

interface RegisterStepProps {
  email: string;
  setEmail: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  marketingConsent: boolean;
  setMarketingConsent: (value: boolean) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  error: string;
  isLoading: boolean;
  handleRegisterSubmit: (e: React.FormEvent) => void;
  setStep: (step: 'email' | 'password' | 'register') => void;
  buttonStyle: React.CSSProperties;
}

const RegisterStep: React.FC<RegisterStepProps> = ({
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  password,
  setPassword,
  marketingConsent,
  setMarketingConsent,
  showPassword,
  setShowPassword,
  error,
  isLoading,
  handleRegisterSubmit,
  setStep,
  buttonStyle,
}) => {
  const { t } = useTranslation();

  const isPasswordValid = (password: string): boolean => {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasLetter && hasNumber && hasSpecial;
  };

  const getPasswordRequirement = (condition: boolean) => {
    return condition ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 15.17L6.83 12L5.41 13.41L10 18L19 9L17.59 7.59L10 15.17Z" fill="#28a745"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 7.58 7.58 4 12 4C14.36 4 16.53 5.03 18.07 6.66L6.66 18.07C5.03 16.53 4 14.36 4 12ZM12 20C9.64 20 7.47 18.97 5.93 17.34L17.34 5.93C18.97 7.47 20 9.64 20 12C20 16.42 16.42 20 12 20Z" fill="#dc3545"/>
      </svg>
    );
  };

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
        <span style={{ textDecoration: 'underline', textDecorationColor: '#000' }}>{t('login.register_step.back')}</span>
      </button>

      <div style={{ textAlign: 'center', lineHeight: '1.2', width: '100%' }}>
        <p style={{ margin: 0, textAlign: 'center', fontSize: '25px' }}>{t('login.register_step.register_free')}</p>
      </div>

      <form onSubmit={handleRegisterSubmit} style={{ width: '100%' }}>
        <label htmlFor="email" style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: '400',
          fontSize: '12px',
          color: '#666',
        }}>
          {t('login.register_step.email_label')}
        </label>
        <input
          type="email"
          id="email"
          placeholder=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            fontWeight: '400',
            height: '40px',
            outline: 'none',
            transition: 'border-color 0.2s ease-in-out',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#007BFF')}
          onBlur={e => (e.currentTarget.style.borderColor = error ? 'red' : '#ccc')}
        />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="firstName" style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 400,
              fontSize: '12px',
              color: '#666',
            }}>
              {t('login.register_step.first_name_label')}
            </label>
            <input
              type="text"
              id="firstName"
              placeholder=""
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '16px',
                borderRadius: '0',
                border: error ? '1px solid red' : '1px solid #ccc',
                marginBottom: '0',
                textAlign: 'left',
                color: '#000',
                boxSizing: 'border-box',
                fontWeight: '400',
                height: '40px',
                outline: 'none',
                transition: 'border-color 0.2s ease-in-out',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#007BFF')}
              onBlur={e => (e.currentTarget.style.borderColor = error ? 'red' : '#ccc')}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="lastName" style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 400,
              fontSize: '12px',
              color: '#666',
            }}>
              {t('login.register_step.last_name_label')}
            </label>
            <input
              type="text"
              id="lastName"
              placeholder=""
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '16px',
                borderRadius: '0',
                border: error ? '1px solid red' : '1px solid #ccc',
                marginBottom: '0',
                textAlign: 'left',
                color: '#000',
                boxSizing: 'border-box',
                fontWeight: '400',
                height: '40px',
                outline: 'none',
                transition: 'border-color 0.2s ease-in-out',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#007BFF')}
              onBlur={e => (e.currentTarget.style.borderColor = error ? 'red' : '#ccc')}
            />
          </div>
        </div>

        <label htmlFor="password" style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 400,
          fontSize: '12px',
          color: '#666',
        }}>
          {t('login.register_step.password_label')}
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
              border: !isPasswordValid(password) || error ? '1px solid red' : '1px solid #ccc',
              marginBottom: '14px',
              textAlign: 'left',
              color: '#000',
              boxSizing: 'border-box',
              fontWeight: '400',
              height: '40px',
              outline: 'none',
              transition: 'border-color 0.2s ease-in-out',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#007BFF')}
            onBlur={e => (e.currentTarget.style.borderColor = !isPasswordValid(password) || error ? 'red' : '#ccc')}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '40%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            <img
              src={showPassword ? '/logo_icons/view.svg' : '/logo_icons/hide.svg'} // Updated path
              alt={showPassword ? t('login.register_step.hide_password') : t('login.register_step.show_password')}
              style={{ width: '20px', height: '20px' }}
            />
          </span>
        </div>
        <div style={{ marginBottom: '14px', fontSize: '10px', color: '#9b0032' }}>
          {t('login.register_step.password_instruction')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getPasswordRequirement(password.length >= 8)} <span>{t('login.register_step.password_min_length')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getPasswordRequirement(/[a-zA-Z]/.test(password))} <span>{t('login.register_step.password_has_letter')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getPasswordRequirement(/\d/.test(password))} <span>{t('login.register_step.password_has_number')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getPasswordRequirement(/[!@#$%^&*(),.?":{}|<>]/.test(password))} <span>{t('login.register_step.password_has_special')}</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              style={{ display: 'none' }}
              id="marketingConsent"
            />
            <span
              style={{
                width: '18px',
                height: '18px',
                border: '2px solid #000',
                display: 'inline-block',
                position: 'relative',
                backgroundColor: marketingConsent ? '#000' : 'transparent',
                transition: 'background-color 0.2s ease',
                borderRadius: '0',
                boxSizing: 'border-box',
              }}
            >
              {marketingConsent && (
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
                    left: '4px',
                    width: '12px',
                    height: '12px',
                  }}
                >
                  <polyline points="4 12 10 18 20 6" />
                </svg>
              )}
            </span>
            <span onClick={() => setMarketingConsent(!marketingConsent)}>{t('login.register_step.marketing_consent')}</span>
          </label>
          <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
            {t('login.register_step.terms_agreement')}
          </p>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
        <button
          type="submit"
          disabled={isLoading || !isPasswordValid(password)}
          style={{
            ...buttonStyle,
            backgroundColor: (isLoading || !isPasswordValid(password)) ? '#ccc' : '#007BFF',
            color: '#fff',
            marginBottom: '60px',
            fontSize: '16px'
          }}
        >
          {isLoading ? t('login.register_step.registering') : t('login.register_step.register_button')}
        </button>
      </form>
    </>
  );
};

export default RegisterStep;