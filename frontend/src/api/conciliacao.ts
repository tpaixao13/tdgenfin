import { api } from './client';
import type { Lancamento, Paginated } from '../types';

export interface ResultadoAutomatica {
  conciliados: number;
  pendentes: number;
  naoEncontrados: number;
}

export interface MatchProposto {
  lancamentoId: string;
  lancamentoData: string;
  lancamentoDescricao: string | null;
  lancamentoValor: number;
  lancamentoTipo: string;
  tipo: 'PAGAR' | 'RECEBER';
  contaErpId: string;
  contaErpDescricao: string;
  contaErpValor: number;
  contaErpData: string;
  contaErpFornecedorOuCliente: string | null;
}

export interface PreviewAutomaticaResult {
  matches: MatchProposto[];
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

  previewAutomatica: (contaId: string) =>
    api
      .post<PreviewAutomaticaResult>(`/conciliacao/automatica/${contaId}/preview`)
      .then((r) => r.data),

  confirmarAutomatica: (
    contaId: string,
    matches: Array<{ lancamentoId: string; contaErpId: string; tipo: 'PAGAR' | 'RECEBER' }>,
  ) =>
    api
      .post<ResultadoAutomatica>(`/conciliacao/automatica/${contaId}/confirmar`, { matches })
      .then((r) => r.data),

  vincularErp: (extratoId: string, contaErpId: string, tipo: 'PAGAR' | 'RECEBER') =>
    api
      .post(`/conciliacoes/${extratoId}/vincular`, { contaErpId, tipo })
      .then((r) => r.data),
};
