import { useState } from 'react';
import { X, CheckCheck, AlertTriangle, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { MatchProposto } from '../api/conciliacao';

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fmtData = (d: string) => {
  const [ano, mes, dia] = d.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
};

interface Props {
  matches: MatchProposto[];
  naoEncontrados: number;
  contaId: string;
  onConfirmar: (selecionados: MatchProposto[]) => void;
  onFechar: () => void;
  isPending: boolean;
}

export default function ConciliacaoPreviewModal({
  matches,
  naoEncontrados,
  onConfirmar,
  onFechar,
  isPending,
}: Props) {
  const [selecionados, setSelecionados] = useState<Set<string>>(
    () => new Set(matches.map((m) => m.lancamentoId)),
  );

  function toggleAll(checked: boolean) {
    setSelecionados(checked ? new Set(matches.map((m) => m.lancamentoId)) : new Set());
  }

  function toggle(id: string) {
    setSelecionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const matchesSelecionados = matches.filter((m) => selecionados.has(m.lancamentoId));
  const todosSelecionados = selecionados.size === matches.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h3 className="text-base font-semibold text-gray-800">Revisar Conciliações Automáticas</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Selecione os pares que estão corretos antes de confirmar
            </p>
          </div>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Sumário */}
        <div className="flex items-center gap-6 px-6 py-3 bg-gray-50 border-b border-gray-200 shrink-0">
          <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
            <CheckCheck size={15} />
            {matches.length} par{matches.length !== 1 ? 'es' : ''} encontrado{matches.length !== 1 ? 's' : ''}
          </span>
          {naoEncontrados > 0 && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-orange-500">
              <AlertTriangle size={15} />
              {naoEncontrados} sem correspondência
            </span>
          )}
          <span className="ml-auto text-sm text-gray-500">
            {selecionados.size} de {matches.length} selecionado{selecionados.size !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tabela */}
        <div className="overflow-y-auto flex-1">
          {matches.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              Nenhum par encontrado para conciliação automática.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={todosSelecionados}
                      onChange={(e) => toggleAll(e.target.checked)}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Lançamento Extrato
                  </th>
                  <th className="px-2 py-3 w-8" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Conta ERP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matches.map((m) => {
                  const ativo = selecionados.has(m.lancamentoId);
                  return (
                    <tr
                      key={m.lancamentoId}
                      onClick={() => toggle(m.lancamentoId)}
                      className={`cursor-pointer transition-colors ${ativo ? 'bg-green-50 hover:bg-green-100' : 'bg-white opacity-50 hover:opacity-70'}`}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={ativo}
                          onChange={() => toggle(m.lancamentoId)}
                          className="rounded"
                        />
                      </td>
                      {/* Extrato */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {m.lancamentoTipo === 'CREDITO' ? (
                            <TrendingUp size={14} className="text-green-500 shrink-0" />
                          ) : (
                            <TrendingDown size={14} className="text-red-500 shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-gray-800 leading-tight">
                              {m.lancamentoDescricao ?? '—'}
                            </p>
                            <p className="text-xs text-gray-400">{fmtData(m.lancamentoData)}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-semibold mt-1 ${m.lancamentoTipo === 'CREDITO' ? 'text-green-600' : 'text-red-600'}`}>
                          {m.lancamentoTipo === 'CREDITO' ? '+' : '−'}{brl(m.lancamentoValor)}
                        </p>
                      </td>
                      {/* Seta */}
                      <td className="px-2 py-3">
                        <ArrowRight size={16} className="text-gray-300" />
                      </td>
                      {/* Conta ERP */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${
                          m.tipo === 'RECEBER'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {m.tipo === 'RECEBER' ? 'A Receber' : 'A Pagar'}
                        </span>
                        <p className="font-medium text-gray-800 leading-tight">{m.contaErpDescricao}</p>
                        {m.contaErpFornecedorOuCliente && (
                          <p className="text-xs text-gray-400">{m.contaErpFornecedorOuCliente}</p>
                        )}
                        <p className="text-xs text-gray-400">Venc.: {fmtData(m.contaErpData)}</p>
                        <p className="text-sm font-semibold text-gray-700">{brl(m.contaErpValor)}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={onFechar}
            className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirmar(matchesSelecionados)}
            disabled={isPending || selecionados.size === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <CheckCheck size={15} />
            {isPending
              ? 'Confirmando...'
              : `Confirmar ${selecionados.size} conciliação${selecionados.size !== 1 ? 'ões' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
