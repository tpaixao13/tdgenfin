import { api } from './client';
import type { ResumoContaPeriodo, ResumoEmpresa } from '../types';

export const dashboardApi = {
  resumoConta: (contaId: string, dataInicio?: string, dataFim?: string) =>
    api
      .get<ResumoContaPeriodo>(`/dashboard/conta/${contaId}`, {
        params: { dataInicio, dataFim },
      })
      .then((r) => r.data),

  resumoEmpresa: () =>
    api.get<ResumoEmpresa>('/dashboard/empresa').then((r) => r.data),

  resumoTodasEmpresas: () =>
    api.get<ResumoEmpresa[]>('/dashboard/empresas').then((r) => r.data),

  evolucaoSaldo: (contaId: string, meses = 6) =>
    api
      .get<{ mes: string; entradas: number; saidas: number }[]>(
        `/dashboard/conta/${contaId}/evolucao`,
        { params: { meses } },
      )
      .then((r) => r.data),
};
