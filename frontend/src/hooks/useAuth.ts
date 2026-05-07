import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: ({ email, senha }: { email: string; senha: string }) =>
      authApi.login(email, senha),
    onSuccess: (data) => {
      login(data.access_token, data.usuario);
    },
  });
}
