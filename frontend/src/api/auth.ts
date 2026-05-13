import { api } from './client';
import type { LoginResponse } from '../types';

export const authApi = {
  login: (email: string, senha: string) =>
    api.post<LoginResponse>('/auth/login', { email, senha }).then((r) => r.data),

  esqueciSenha: (email: string) =>
    api.post<{ message: string }>('/auth/esqueci-senha', { email }).then((r) => r.data),

  resetarSenha: (token: string, novaSenha: string) =>
    api.post<{ message: string }>('/auth/reset-senha', { token, novaSenha }).then((r) => r.data),
};
