import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissoesApi } from '../api/permissoes';
import { useAuth } from '../contexts/AuthContext';

export function usePermissoes() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['permissoes'],
    queryFn: permissoesApi.listar,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

export function useAtualizarPermissao() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      usuarioId,
      permissao,
      habilitado,
    }: {
      usuarioId: string;
      permissao: string;
      habilitado: boolean;
    }) => permissoesApi.atualizar(usuarioId, permissao, habilitado),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissoes'] }),
  });
}
