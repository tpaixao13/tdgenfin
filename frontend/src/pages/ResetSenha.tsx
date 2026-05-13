import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { authApi } from '../api/auth';

export default function ResetSenha() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') ?? '';

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-sm w-full text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Link inválido</h2>
          <p className="text-sm text-gray-500 mb-6">O link de redefinição é inválido ou expirou.</p>
          <Link to="/esqueci-senha" className="text-sm text-blue-600 hover:underline">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (novaSenha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (novaSenha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }

    setIsPending(true);
    try {
      await authApi.resetarSenha(token, novaSenha);
      setSucesso(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setErro(msg ?? 'Token inválido ou expirado. Solicite um novo link.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12" style={{ backgroundColor: '#0B2A4A' }}>
        <img src="/logo.png?v=4" alt="CoreFinance" className="w-auto object-contain mb-12 brightness-0 invert" style={{ height: '106px' }} />
        <h2 className="text-xl font-bold text-white leading-tight text-center">Sistema essencial de finanças</h2>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

            {sucesso ? (
              <div className="text-center">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Senha redefinida!</h2>
                <p className="text-sm text-gray-500">Redirecionando para o login...</p>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
                  <ArrowLeft size={14} />
                  Voltar ao login
                </Link>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">Nova senha</h2>
                <p className="text-sm text-gray-500 mb-6">Defina sua nova senha de acesso.</p>

                {erro && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    {erro}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nova senha</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required
                        minLength={8}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar senha</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={confirmar}
                        onChange={(e) => setConfirmar(e.target.value)}
                        required
                        placeholder="Repita a senha"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
                  >
                    {isPending ? 'Salvando...' : 'Redefinir senha'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
