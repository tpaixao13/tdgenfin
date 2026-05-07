import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Empresa } from '../types';

interface EmpresaContextValue {
  empresaAtiva: Empresa | null;
  setEmpresaAtiva: (empresa: Empresa) => void;
}

const EmpresaContext = createContext<EmpresaContextValue | null>(null);

export function EmpresaProvider({ children }: { children: ReactNode }) {
  const [empresaAtiva, setEmpresaAtivaState] = useState<Empresa | null>(null);

  const setEmpresaAtiva = useCallback((empresa: Empresa) => {
    localStorage.setItem('empresaId', empresa.id);
    setEmpresaAtivaState(empresa);
  }, []);

  return (
    <EmpresaContext.Provider value={{ empresaAtiva, setEmpresaAtiva }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  const ctx = useContext(EmpresaContext);
  if (!ctx) throw new Error('useEmpresa deve ser usado dentro de EmpresaProvider');
  return ctx;
}
