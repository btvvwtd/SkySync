import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, googleLogin, checkEmail } from '../api/api';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [step, setStep] = useState<'email' | 'password' | 'register'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
    'aol.com',
    'zoho.com',
    'gmx.com',
    'yandex.com',
    'ukr.net',
    'i.ua',
    'bigmir.net',
    'meta.ua',
    'rambler.ru',
    'mail.ru',
    'live.com',
    'msn.com',
    'me.com',
  ];

  useEffect(() => {
    if (step !== 'email') return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '567391164162-4md16qmddhllj6hpe4e818edsnug4fmh.apps.googleusercontent.com',
          callback: handleGoogleSignIn,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with', shape: 'rectangular' }
        );
      }
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [step]);

  const handleGoogleSignIn = async (response: any) => {
    setIsLoading(true);
    try {
      const res = await googleLogin(response.credential);
      const { access_token } = res.data;
      if (rememberMe) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('userEmail', email);
      } else {
        sessionStorage.setItem('token', access_token);
        sessionStorage.setItem('userEmail', email);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(t('login.errors.google_login_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (provider: string) => {
    alert(`Authorization via ${provider} is not yet implemented`); // Consider translating this or removing
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    const domain = email.split('@')[1].toLowerCase();
    return validDomains.includes(domain);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('login.errors.empty_email'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('login.errors.invalid_email'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await checkEmail(email);
      if (response.data.exists) {
        setStep('password');
      } else {
        setStep('register');
      }
    } catch (err: any) {
      setError(t('login.errors.email_check_error'));
      console.error('Check email error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError(t('login.errors.empty_password'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password);
      const { access_token } = response.data;

      if (rememberMe) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('userEmail', email);
      } else {
        sessionStorage.setItem('token', access_token);
        sessionStorage.setItem('userEmail', email);
      }

      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError(t('login.errors.wrong_password'));
      } else {
        setError(t('login.errors.server_error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('login.errors.empty_email'));
      return;
    }
    if (!validateEmail(email)) {
      setError(t('login.errors.invalid_email'));
      return;
    }
    if (!firstName || !lastName) {
      setError(t('login.errors.empty_names'));
      return;
    }
    if (!isPasswordValid(password)) {
      setError(t('login.errors.invalid_password'));
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, firstName, lastName);
      const response = await login(email, password);
      const { access_token } = response.data;

      if (rememberMe) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('userEmail', email);
      } else {
        sessionStorage.setItem('token', access_token);
        sessionStorage.setItem('userEmail', email);
      }

      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(t('login.errors.email_registered'));
      } else {
        setError(t('login.errors.register_error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordValid = (password: string) => {
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

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 500,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      color: 'black',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      position: 'relative',
    }}>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 40px',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'black',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: 1,
        }}>
          <img
            src="./public/logo_icons/skysync.svg"
            alt="SkySync Logo"
            style={{
              height: '30px',
              width: '30px'
            }}
          />
          <span>{t('login.header.brand')}</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <LanguageSelector />
        </div>
      </header>

      <div style={{
        paddingTop: '70px',
        flex: '1',
        zIndex: 0,
      }}>
        <main style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '32px 0',
          backgroundColor: 'white',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            width: '320px',
          }}>
            {step === 'email' ? (
              <>
                <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
                  <p style={{ margin: 0 , fontSize: '20px' }}>{t('login.email_step.title_line1')}</p>
                  <p style={{ margin: 0, fontSize: '20px' }}>{t('login.email_step.title_line2')}</p>
                </div>

                {step === 'email' && (
                  <>
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
                        src="./public/logo_icons/apple-logo.svg"
                        alt="Apple"
                        style={{ height: '20px', width: '20px' }}
                      />
                      {t('login.email_step.continue_with_apple')}
                    </button>
                  </>
                )}

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
            ) : step === 'password' ? (
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
                        top: '40%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#666',
                      }}
                    >
                      <img
                        src={showPassword ? './public/logo_icons/view.svg' : './public/logo_icons/hide.svg'}
                        alt={showPassword ? 'Hide password' : 'Show password'}
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
                      color: '#007BFF',
                      textDecoration: 'none',
                      fontSize: '11px',
                    }}>
                      {t('login.password_step.forgot_password')}
                    </a>

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
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ display: 'none' }}
                        id="rememberMeCheckbox"
                      />
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid #000',
                          display: 'inline-block',
                          position: 'relative',
                          backgroundColor: rememberMe ? '#000' : 'transparent',
                          transition: 'background-color 0.2s ease',
                          borderRadius: '0',
                          boxSizing: 'border-box',
                        }}
                      >
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
                              left: '4px',
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
            ) : (
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
                        src={showPassword ? './public/logo_icons/view.svg' : './public/logo_icons/hide.svg'}
                        alt={showPassword ? 'Hide password' : 'Show password'}
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
            )}
          </div>
        </main>

        <footer style={{
          minHeight: '500px',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          width: '100vw',
          backgroundColor: 'black',
          color: 'white',
          padding: '120px 40px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(150px, 1fr))',
          gap: '50px',
          fontSize: '14px',
          lineHeight: '3',
          boxSizing: 'border-box',
          marginTop: '70px',
        }}>
          <div>
            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.dropbox.title')}</h4>
            <div>{t('login.footer.dropbox.desktop_app')}</div>
            <div>{t('login.footer.dropbox.mobile_app')}</div>
            <div>{t('login.footer.dropbox.integrations')}</div>
            <div>{t('login.footer.dropbox.features')}</div>
            <div>{t('login.footer.dropbox.solutions')}</div>
            <div>{t('login.footer.dropbox.security')}</div>
            <div>{t('login.footer.dropbox.early_access')}</div>
            <div>{t('login.footer.dropbox.templates')}</div>
            <div>{t('login.footer.dropbox.free_tools')}</div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.products.title')}</h4>
            <div>{t('login.footer.products.plus')}</div>
            <div>{t('login.footer.products.professional')}</div>
            <div>{t('login.footer.products.business')}</div>
            <div>{t('login.footer.products.enterprise')}</div>
            <div>{t('login.footer.products.dash')}</div>
            <div>{t('login.footer.products.reclaim')}</div>
            <div>{t('login.footer.products.sign')}</div>
            <div>{t('login.footer.products.docsend')}</div>
            <div>{t('login.footer.products.plans')}</div>
            <div>{t('login.footer.products.updates')}</div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.features.title')}</h4>
            <div>{t('login.footer.features.send_large_files')}</div>
            <div>{t('login.footer.features.send_large_videos')}</div>
            <div>{t('login.footer.features.photo_storage')}</div>
            <div>{t('login.footer.features.secure_sharing')}</div>
            <div>{t('login.footer.features.password_manager')}</div>
            <div>{t('login.footer.features.cloud_backup')}</div>
            <div>{t('login.footer.features.pdf_editing')}</div>
            <div>{t('login.footer.features.e_signatures')}</div>
            <div>{t('login.footer.features.pdf_conversion')}</div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.support.title')}</h4>
            <div>{t('login.footer.support.help_center')}</div>
            <div>{t('login.footer.support.contact_us')}</div>
            <div>{t('login.footer.support.cancel_contract')}</div>
            <div>{t('login.footer.support.privacy_terms')}</div>
            <div>{t('login.footer.support.cookie_policy')}</div>
            <div>{t('login.footer.support.cookie_ccpa')}</div>
            <div>{t('login.footer.support.ai_principles')}</div>
            <div>{t('login.footer.support.sitemap')}</div>
            <div>{t('login.footer.support.cancel_contract')}</div>
            <div>{t('login.footer.support.learning_resources')}</div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.resources.title')}</h4>
            <div>{t('login.footer.resources.blog')}</div>
            <div>{t('login.footer.resources.customer_stories')}</div>
            <div>{t('login.footer.resources.resource_library')}</div>
            <div>{t('login.footer.resources.developers')}</div>
            <div>{t('login.footer.resources.community_forums')}</div>
            <div>{t('login.footer.resources.referrals')}</div>
            <div>{t('login.footer.resources.reseller_partners')}</div>
            <div>{t('login.footer.resources.integration_partners')}</div>
            <div>{t('login.footer.resources.find_partner')}</div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.company.title')}</h4>
            <div>{t('login.footer.company.about_us')}</div>
            <div>{t('login.footer.company.legal_info')}</div>
            <div>{t('login.footer.company.careers')}</div>
            <div>{t('login.footer.company.investor_relations')}</div>
            <div>{t('login.footer.company.our_impact')}</div>
          </div>
          <div style={{
            gridColumn: '',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '30px',
            }}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="./public/logo_icons/twitter.svg"
                  alt="Twitter"
                  style={{ height: '24px', width: '24px' }}
                />
              </a>
              <a href="https://web.telegram.org/a/" target="_blank" rel="noopener noreferrer">
                <img
                  src="./public/logo_icons/telegram.svg"
                  alt="Instagram"
                  style={{ height: '24px', width: '24px' }}
                />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="./public/logo_icons/youtube.svg"
                  alt="YouTube"
                  style={{ height: '24px', width: '24px' }}
                />
              </a>
            </div>
            <div style={{
              width: '55%',
              height: '1px',
              backgroundColor: '#333',
            }}></div>
          </div>
          <div style={{
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
            }}>
              <img
                src="./public/logo_icons/internet1.svg"
                alt="Internet"
                style={{ height: '18px', width: '18px' }}
              />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>{t('login.footer.language')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>^</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;