import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contasReceberApi } from '../api/contasReceber';
import { useAuth } from '../contexts/AuthContext';
import type { CreateContaReceberPayload, UpdateContaReceberPayload } from '../types';

export function useContasReceber(page = 1, limit = 50) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['contas-receber', page],
    queryFn: () => contasReceberApi.listar(page, limit),
    enabled: isAuthenticated,
  });
}

export function useCriarContaReceber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateContaReceberPayload) => contasReceberApi.criar(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-receber'] }),
  });
}

export function useAtualizarContaReceber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateContaReceberPayload }) =>
      contasReceberApi.atualizar(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-receber'] }),
  });
}
