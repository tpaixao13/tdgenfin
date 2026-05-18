import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export function useDashboardReal(empresaId?: string, dataInicio?: string, dataFim?: string) {
  return useQuery({
    queryKey: ['dashboard-real', empresaId, dataInicio, dataFim],
    queryFn: () => dashboardApi.resumoReal(dataInicio, dataFim),
    enabled: !!empresaId,
    staleTime: 60_000,
  });
}

export function useDashboardPrevisao(empresaId?: string) {
  return useQuery({
    queryKey: ['dashboard-previsao', empresaId],
    queryFn: () => dashboardApi.resumoPrevisao(),
    enabled: !!empresaId,
    staleTime: 60_000,
  });
}

export function useDashboardFluxo(empresaId?: string) {
  return useQuery({
    queryKey: ['dashboard-fluxo', empresaId],
    queryFn: () => dashboardApi.fluxoCaixa(),
    enabled: !!empresaId,
    staleTime: 60_000,
  });
}

export function useDashboardSimulacao(empresaId?: string, dataFim?: string) {
  return useQuery({
    queryKey: ['dashboard-simulacao', empresaId, dataFim],
    queryFn: () => dashboardApi.simulacao(dataFim!),
    enabled: !!empresaId && !!dataFim,
    staleTime: 30_000,
  });
}
