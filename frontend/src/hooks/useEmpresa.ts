import { useQuery } from '@tanstack/react-query';
import { empresaApi } from '../api/empresa';
import { useAuth } from '../contexts/AuthContext';

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
