import { api } from './client';
import type { Empresa, CreateEmpresaPayload, UpdateEmpresaPayload } from '../types';

export const empresaApi = {
  listar: () => api.get<Empresa[]>('/empresas').then((r) => r.data),

  buscar: (id: string) => api.get<Empresa>(`/empresas/${id}`).then((r) => r.data),

  criar: (dto: CreateEmpresaPayload) =>
    api.post<Empresa>('/empresas', dto).then((r) => r.data),

  atualizar: (id: string, dto: UpdateEmpresaPayload) =>
    api.patch<Empresa>(`/empresas/${id}`, dto).then((r) => r.data),
};
