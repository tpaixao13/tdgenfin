import { useQuery } from '@tanstack/react-query';
import { contasApi } from '../api/contas';
import { useAuth } from '../contexts/AuthContext';
import { Landmark, RefreshCw } from 'lucide-react';

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export default function Contas() {
  const { isAuthenticated } = useAuth();

  const { data: contas, isLoading, error, refetch } = useQuery({
    queryKey: ['contas'],
    queryFn: contasApi.listar,
    enabled: isAuthenticated,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Carregando contas...
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
        Erro ao carregar contas bancárias.
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contas Bancárias</h2>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          <RefreshCw size={15} />
          Atualizar
        </button>
      </div>

      {!contas?.length ? (
        <div className="text-center text-gray-400 py-16">
          Nenhuma conta bancária cadastrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contas.map((conta) => (
            <div
              key={conta.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Landmark size={22} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{conta.banco}</p>
                    <p className="text-sm text-gray-500">
                      Ag. {conta.agencia} · CC {conta.numero}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    conta.ativo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {conta.ativo ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              {conta.descricao && (
                <p className="text-sm text-gray-500 mb-4">{conta.descricao}</p>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Saldo Inicial</p>
                  <p className="font-semibold text-gray-700">
                    {formatCurrency(conta.saldoInicial)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Saldo Atual</p>
                  <p
                    className={`font-bold text-lg ${
                      conta.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(conta.saldoAtual)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
