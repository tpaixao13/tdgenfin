import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Usuario } from '../types';

interface AuthState {
  token: string | null;
  user: Usuario | null;
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStorage(): AuthState {
  try {
    return {
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user') ?? 'null'),
    };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readStorage);

  const login = useCallback((token: string, user: Usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // empresaId do próprio usuário (null para SUPER_ADMIN)
    if (user.empresaId) localStorage.setItem('empresaId', user.empresaId);
    setState({ token, user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('empresaId');
    setState({ token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, isAuthenticated: !!state.token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
