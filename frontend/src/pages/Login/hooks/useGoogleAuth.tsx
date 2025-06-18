import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { googleLogin } from '../../../api/api.ts';

interface GoogleAuthProps {
  step: 'email' | 'password' | 'register';
  email: string;
  rememberMe: boolean;
  navigate: (path: string) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string) => void;
  enableOneTap?: boolean;
  currentLanguage: string; // Додаємо поточну мову як пропс
}

const useGoogleAuth = ({
  step,
  email,
  rememberMe,
  navigate,
  setIsLoading,
  setError,
  enableOneTap = true,
  currentLanguage // Отримуємо поточну мову
}: GoogleAuthProps) => {
  const { t } = useTranslation();

  // Обробник входу через Google
  const handleGoogleSignIn = async (response: GoogleCredentialResponse) => {
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

  // Ініціалізація Google API
  useEffect(() => {
    if (step !== 'email') return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google) {
        setError(t('login.errors.google_load_error'));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: '567391164162-4md16qmddhllj6hpe4e818edsnug4fmh.apps.googleusercontent.com',
        callback: handleGoogleSignIn,
        ux_mode: 'popup',
        auto_select: enableOneTap
      });

      renderGoogleButton(currentLanguage); // Рендеримо з поточною мовою

      if (enableOneTap) {
        window.google.accounts.id.prompt();
      }
    };

    script.onerror = () => {
      setError(t('login.errors.google_load_error'));
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (window.google?.accounts?.id?.cancel) {
        window.google.accounts.id.cancel();
      }
    };
  }, [step, enableOneTap, currentLanguage]); // Додаємо currentLanguage в залежності

  // Функція для рендерингу кнопки
  const renderGoogleButton = useCallback((language: string) => {
    const buttonContainer = document.getElementById('googleSignInDiv');
    if (!buttonContainer || !window.google?.accounts?.id) return;

    buttonContainer.innerHTML = '';

    window.google.accounts.id.renderButton(buttonContainer, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'signin_with',
      shape: 'rectangular',
      width: 320,
      locale: language
    });
  }, []);

  return {
    handleGoogleSignIn,
    disableAutoSelect: () => window.google?.accounts?.id?.disableAutoSelect?.()
  };
};

export default useGoogleAuth;