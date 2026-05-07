import { api } from './client';
import type { ExtratoImportacao } from '../types';

export const extratosApi = {
  importar: (contaId: string, arquivo: File) => {
    const form = new FormData();
    form.append('arquivo', arquivo);
    return api
      .post<ExtratoImportacao>(`/extratos/importar/${contaId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  listarImportacoes: (contaId?: string) =>
    api
      .get<ExtratoImportacao[]>('/extratos/importacoes', {
        params: contaId ? { contaId } : {},
      })
      .then((r) => r.data),
};
