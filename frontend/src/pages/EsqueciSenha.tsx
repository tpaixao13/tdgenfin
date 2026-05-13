import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authApi } from '../api/auth';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setErro(null);
    try {
      await authApi.esqueciSenha(email);
      setEnviado(true);
    } catch {
      // Erro de rede real — o backend sempre retorna 200
      setErro('Não foi possível processar a solicitação. Tente novamente.');
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

            {enviado ? (
              <div className="text-center">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Verifique seu e-mail</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Se o e-mail existir no sistema, você receberá as instruções para redefinir sua senha.
                </p>
                <Link to="/login" className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft size={14} />
                  Voltar ao login
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
                  <ArrowLeft size={14} />
                  Voltar ao login
                </Link>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">Esqueceu a senha?</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Digite seu e-mail e enviaremos as instruções de redefinição.
                </p>

                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                    {erro}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="seu@email.com"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                  >
                    {isPending ? 'Enviando...' : 'Enviar instruções'}
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
