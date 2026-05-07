import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Injeta JWT e empresa_id em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const empresaId = localStorage.getItem('empresaId');

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (empresaId && config.headers['X-Empresa-Id'] === undefined) {
    config.headers['X-Empresa-Id'] = empresaId;
  }

  return config;
});

// Redireciona para login em 401; exibe mensagem em 403
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('empresaId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
