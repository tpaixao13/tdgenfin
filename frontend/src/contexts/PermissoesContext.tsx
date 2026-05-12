import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

type MapaPermissoes = Record<string, boolean>;

interface PermissoesContextValue {
  permissoes: MapaPermissoes;
  temPermissao: (chave: string) => boolean;
  isLoading: boolean;
}

const PermissoesContext = createContext<PermissoesContextValue | null>(null);

async function fetchMinhasPermissoes(): Promise<MapaPermissoes> {
  const { data } = await api.get<MapaPermissoes>('/usuarios/minhas-permissoes');
  return data;
}

export function PermissoesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  const { data: permissoes = {}, isLoading } = useQuery({
    queryKey: ['minhas-permissoes', user?.id],
    queryFn: fetchMinhasPermissoes,
    enabled: isAuthenticated && !!user,
    staleTime: 60_000,
  });

  // SUPER_ADMIN tem todas as permissões sem precisar verificar
  const temPermissao = useCallback(
    (chave: string) => {
      if (user?.role === 'SUPER_ADMIN') return true;
      return permissoes[chave] === true;
    },
    [permissoes, user?.role],
  );

  return (
    <PermissoesContext.Provider value={{ permissoes, temPermissao, isLoading }}>
      {children}
    </PermissoesContext.Provider>
  );
}

export function usePermissoesCtx() {
  const ctx = useContext(PermissoesContext);
  if (!ctx) throw new Error('usePermissoesCtx deve ser usado dentro de PermissoesProvider');
  return ctx;
}
