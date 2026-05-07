import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '../api/usuarios';
import { useAuth } from '../contexts/AuthContext';
import type { CreateUsuarioPayload, UpdateUsuarioPayload } from '../types';

export function useUsuarios() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosApi.listar,
    enabled: isAuthenticated,
  });
}

export function useCriarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUsuarioPayload) => usuariosApi.criar(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useAtualizarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUsuarioPayload }) =>
      usuariosApi.atualizar(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}
