import type { ContaBancaria, TipoLancamento } from '../types';

export interface FiltrosConciliacao {
  contaId: string;
  dataInicio: string;
  dataFim: string;
  tipo: TipoLancamento | '';
}

interface Props {
  filtros: FiltrosConciliacao;
  contas: ContaBancaria[];
  onChange: (f: FiltrosConciliacao) => void;
  onLimpar: () => void;
}

export default function ConciliacaoFiltro({ filtros, contas, onChange, onLimpar }: Props) {
  function set(field: keyof FiltrosConciliacao, value: string) {
    onChange({ ...filtros, [field]: value });
  }

  const temFiltro = filtros.dataInicio || filtros.dataFim || filtros.tipo;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Conta bancária</label>
        <select
          value={filtros.contaId}
          onChange={(e) => set('contaId', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {contas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.banco} — {c.numero}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Data início</label>
        <input
          type="date"
          value={filtros.dataInicio}
          onChange={(e) => set('dataInicio', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Data fim</label>
        <input
          type="date"
          value={filtros.dataFim}
          onChange={(e) => set('dataFim', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
        <select
          value={filtros.tipo}
          onChange={(e) => set('tipo', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          <option value="DEBITO">Débito</option>
          <option value="CREDITO">Crédito</option>
        </select>
      </div>

      {temFiltro && (
        <button onClick={onLimpar} className="text-sm text-blue-600 hover:underline self-end pb-2">
          Limpar filtros
        </button>
      )}
    </div>
  );
}
