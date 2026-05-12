import type { ReactNode } from 'react';
import { usePermissoesCtx } from '../contexts/PermissoesContext';

interface Props {
  chave: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Mostra children apenas se o usuário tiver a permissão indicada.
 * NUNCA substitui a validação do backend — é apenas UX.
 */
export default function PermissaoGate({ chave, children, fallback = null }: Props) {
  const { temPermissao } = usePermissoesCtx();
  return temPermissao(chave) ? <>{children}</> : <>{fallback}</>;
}
