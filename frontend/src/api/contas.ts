import { api } from './client';
import type { ContaBancaria } from '../types';

export const contasApi = {
  listar: () => api.get<ContaBancaria[]>('/contas-bancarias').then((r) => r.data),

  buscar: (id: string) =>
    api.get<ContaBancaria>(`/contas-bancarias/${id}`).then((r) => r.data),

  recalcularSaldo: (id: string) =>
    api
      .patch<{ saldoCalculado: number; diferenca: number }>(
        `/contas-bancarias/${id}/recalcular-saldo`,
      )
      .then((r) => r.data),
};
