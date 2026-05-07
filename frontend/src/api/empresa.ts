import { api } from './client';
import type { Empresa } from '../types';

export const empresaApi = {
  listar: () => api.get<Empresa[]>('/empresas').then((r) => r.data),

  buscar: (id: string) => api.get<Empresa>(`/empresas/${id}`).then((r) => r.data),
};
