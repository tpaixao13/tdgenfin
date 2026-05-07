import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import { contasApi } from '../api/contas';
import { useAuth } from '../contexts/AuthContext';
import CardSaldo from '../components/CardSaldo';
import type { ContaBancaria } from '../types';
import { TrendingUp, TrendingDown, Wallet, AlertTriangle } from 'lucide-react';

function StatItem({ label, value, cor }: { label: string; value: number; cor: string }) {
  return (
    <div className="text-center">
      <p className={`text-xl font-bold ${cor}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const [contaId, setContaId] = useState('');

  const { data: contas } = useQuery<ContaBancaria[]>({
    queryKey: ['contas'],
    queryFn: contasApi.listar,
    enabled: isAuthenticated,
  });

  // Seleciona a primeira conta automaticamente
  useEffect(() => {
    if (contas && contas.length > 0 && !contaId) {
      setContaId(contas[0].id);
    }
  }, [contas, contaId]);

  const { data: resumo, isLoading } = useQuery({
    queryKey: ['dashboard', 'conta', contaId],
    queryFn: () => dashboardApi.resumoConta(contaId),
    enabled: !!contaId,
  });

  const { data: resumoEmpresa } = useQuery({
    queryKey: ['dashboard', 'empresa'],
    queryFn: dashboardApi.resumoEmpresa,
    enabled: isAuthenticated && user?.role !== 'SUPER_ADMIN',
  });

  const contaAtiva = contas?.find((c) => c.id === contaId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Financeiro</h2>

        {contas && contas.length > 1 && (
          <select
            value={contaId}
            onChange={(e) => setContaId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {contas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.banco} — {c.numero}
              </option>
            ))}
          </select>
        )}
      </div>

      {contaAtiva && (
        <p className="text-sm text-gray-500">
          Banco: <strong>{contaAtiva.banco}</strong> · Ag. {contaAtiva.agencia} · CC{' '}
          {contaAtiva.numero}
        </p>
      )}

      {contas && contas.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-4 text-sm">
          Nenhuma conta bancária cadastrada.
        </div>
      )}

      {isLoading && (
        <div className="text-center text-gray-400 py-12">Carregando dashboard...</div>
      )}

      {resumo && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <CardSaldo titulo="Saldo Inicial" valor={resumo.saldoInicial} icone={<Wallet size={18} />} />
            <CardSaldo titulo="Total Entradas" valor={resumo.totalEntradas} cor="green" icone={<TrendingUp size={18} />} />
            <CardSaldo titulo="Total Saídas" valor={resumo.totalSaidas} cor="red" icone={<TrendingDown size={18} />} />
            <CardSaldo titulo="Saldo Atual" valor={resumo.saldoAtual} cor={resumo.saldoAtual >= 0 ? 'blue' : 'red'} icone={<Wallet size={18} />} />
          </div>

          {Math.abs(resumo.diferenca) > 0.01 && (
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl px-5 py-4 text-sm">
              <AlertTriangle size={20} className="shrink-0" />
              <div>
                <p className="font-semibold">Diferença de conciliação detectada</p>
                <p className="text-xs mt-0.5">
                  Saldo calculado: {brl(resumo.saldoCalculado)} · Diferença: {brl(resumo.diferenca)}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Status de Conciliação</h3>
            <div className="flex items-center justify-around">
              <StatItem label="Conciliados" value={resumo.totalConciliados} cor="text-green-600" />
              <div className="w-px h-10 bg-gray-200" />
              <StatItem label="Pendentes" value={resumo.totalPendentes} cor="text-yellow-600" />
              <div className="w-px h-10 bg-gray-200" />
              <StatItem label="Não encontrados" value={resumo.totalNaoEncontrados} cor="text-red-600" />
            </div>
          </div>
        </>
      )}

      {resumoEmpresa && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Resumo da Empresa</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-800">{resumoEmpresa.totalContas}</p>
              <p className="text-xs text-gray-500">Contas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{brl(resumoEmpresa.saldoTotal)}</p>
              <p className="text-xs text-gray-500">Saldo Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{brl(resumoEmpresa.totalEntradas)}</p>
              <p className="text-xs text-gray-500">Entradas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{brl(resumoEmpresa.totalSaidas)}</p>
              <p className="text-xs text-gray-500">Saídas</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
