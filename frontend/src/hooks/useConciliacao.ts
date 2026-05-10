import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conciliacaoApi } from '../api/conciliacao';
import { useAuth } from '../contexts/AuthContext';

export function usePendentes(contaId: string, page = 1) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['conciliacao', 'pendentes', contaId, page],
    queryFn: () => conciliacaoApi.listarPendentes(contaId, page, 50),
    enabled: isAuthenticated && !!contaId,
  });
}

export function useConciliarManual(contaId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lancamentoExtratoId, observacao }: { lancamentoExtratoId: string; observacao?: string }) =>
      conciliacaoApi.conciliarManual(contaId, lancamentoExtratoId, observacao),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conciliacao', 'pendentes', contaId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['despesas'] });
    },
  });
}

export function useConciliarAutomatica(contaId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => conciliacaoApi.conciliarAutomatica(contaId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conciliacao', 'pendentes', contaId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['despesas'] });
    },
  });
}
