import { useTranslation } from 'react-i18next';
import { login, register, checkEmail } from '../../../api/api.ts';

interface LoginLogicProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  rememberMe: boolean;
  setStep: (step: 'email' | 'password' | 'register') => void;
  setError: (value: string) => void;
  setIsLoading: (value: boolean) => void;
  navigate: (path: string) => void;
}

const useLoginLogic = ({
  email,
  password,
  firstName,
  lastName,
  rememberMe,
  setStep,
  setError,
  setIsLoading,
  navigate,
}: LoginLogicProps) => {
  const { t } = useTranslation();

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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    const domain = email.split('@')[1].toLowerCase();
    return validDomains.includes(domain);
  };

  const isPasswordValid = (password: string) => {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasLetter && hasNumber && hasSpecial;
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

  return { handleEmailSubmit, handlePasswordSubmit, handleRegisterSubmit };
};

export default useLoginLogic;