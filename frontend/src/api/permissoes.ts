import { api } from './client';
import type { UsuarioComPermissoes } from '../types';

export const permissoesApi = {
  listar: (): Promise<UsuarioComPermissoes[]> =>
    api.get<UsuarioComPermissoes[]>('/usuarios/permissoes').then((r) => r.data),

  atualizar: (
    usuarioId: string,
    permissao: string,
    habilitado: boolean,
  ): Promise<void> =>
    api
      .post(`/usuarios/${usuarioId}/permissoes`, { permissao, habilitado })
      .then(() => undefined),
};
