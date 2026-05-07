import { api } from './client';
import type { UsuarioItem, CreateUsuarioPayload, UpdateUsuarioPayload } from '../types';

export const usuariosApi = {
  listar: () =>
    api.get<UsuarioItem[]>('/usuarios').then((r) => r.data),

  criar: (dto: CreateUsuarioPayload) =>
    api.post<UsuarioItem>('/usuarios', dto).then((r) => r.data),

  atualizar: (id: string, dto: UpdateUsuarioPayload) =>
    api.patch<UsuarioItem>(`/usuarios/${id}`, dto).then((r) => r.data),
};
