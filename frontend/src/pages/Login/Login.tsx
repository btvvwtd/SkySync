import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import EmailStep from './components/EmailStep.tsx';
import PasswordStep from './components/PasswordStep.tsx';
import RegisterStep from './components/RegisterStep.tsx';
import useGoogleAuth from './hooks/useGoogleAuth.tsx';
import useLoginLogic from './hooks/useLoginLogic.tsx';

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const { handleGoogleSignIn } = useGoogleAuth({
    step,
    email,
    rememberMe,
    navigate,
    setIsLoading,
    setError,
    currentLanguage // Передаємо поточну мову
  });

  const { handleEmailSubmit, handlePasswordSubmit, handleRegisterSubmit } = useLoginLogic({
    email,
    password,
    firstName,
    lastName,
    rememberMe,
    setStep,
    setError,
    setIsLoading,
    navigate,
  });

  // Слідкуємо за зміною мови
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

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
      <Header />
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
            {step === 'email' && (
              <EmailStep
                email={email}
                setEmail={setEmail}
                error={error}
                isLoading={isLoading}
                handleEmailSubmit={handleEmailSubmit}
                handleGoogleSignIn={handleGoogleSignIn}
                buttonStyle={buttonStyle}
                currentLanguage={currentLanguage} // Передаємо мову в EmailStep
              />
            )}
            {step === 'register' && (
              <RegisterStep
                email={email}
                setEmail={setEmail}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                password={password}
                setPassword={setPassword}
                marketingConsent={marketingConsent}
                setMarketingConsent={setMarketingConsent}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                error={error}
                isLoading={isLoading}
                handleRegisterSubmit={handleRegisterSubmit}
                setStep={setStep}
                buttonStyle={buttonStyle}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Login;