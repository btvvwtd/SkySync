import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log request headers for debugging
api.interceptors.request.use(config => {
  console.log('Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
  });
  return config;
});

export const register = async (email: string, password: string, firstName: string, lastName: string) => {
  return api.post('/register', { email, password, firstName, lastName });
};

export const login = async (email: string, password: string) => {
  return api.post('/token',
    new URLSearchParams({
      username: email,
      password: password,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
};

export const googleLogin = async (idToken: string) => {
  return api.post('/auth/google', { id_token: idToken });
};

export const checkEmail = async (email: string) => {
  return api.get(`/check-email/${encodeURIComponent(email)}`);
};

export const getCurrentUser = async (token: string) => {
  return api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createFile = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/files', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getFiles = async (token: string) => {
  return api.get('/files', {
    headers: { Authorization: `Bearer ${token}` },
  });
};