import { api } from './client';
import type { LoginResponse } from '../types';

export const authApi = {
  login: (email: string, senha: string) =>
    api.post<LoginResponse>('/auth/login', { email, senha }).then((r) => r.data),
};
