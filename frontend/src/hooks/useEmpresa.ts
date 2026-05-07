import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaApi } from '../api/empresa';
import { useAuth } from '../contexts/AuthContext';
import type { CreateEmpresaPayload, UpdateEmpresaPayload } from '../types';

export function useEmpresas() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['empresas'],
    queryFn: empresaApi.listar,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEmpresaById(id: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['empresa', id],
    queryFn: () => empresaApi.buscar(id),
    enabled: isAuthenticated && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCriarEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateEmpresaPayload) => empresaApi.criar(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['empresas'] }),
  });
}

export function useAtualizarEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEmpresaPayload }) =>
      empresaApi.atualizar(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['empresas'] }),
  });
}
