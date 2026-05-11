import { api } from './client';
import type { Lancamento, Paginated } from '../types';

export interface ResultadoAutomatica {
  conciliados: number;
  pendentes: number;
  naoEncontrados: number;
}

export const conciliacaoApi = {
  listarPendentes: (contaId: string, page = 1, limit = 50) =>
    api
      .get<Paginated<Lancamento>>(`/extratos/lancamentos/${contaId}`, {
        params: { page, limit },
      })
      .then((r) => r.data),

  conciliarManual: (contaId: string, lancamentoExtratoId: string, observacao?: string) =>
    api
      .post(`/conciliacao/manual/${contaId}`, { lancamentoExtratoId, observacao })
      .then((r) => r.data),

  conciliarAutomatica: (contaId: string) =>
    api
      .post<ResultadoAutomatica>(`/conciliacao/automatica/${contaId}`)
      .then((r) => r.data),

  vincularErp: (extratoId: string, contaErpId: string, tipo: 'PAGAR' | 'RECEBER') =>
    api
      .post(`/conciliacoes/${extratoId}/vincular`, { contaErpId, tipo })
      .then((r) => r.data),
};
