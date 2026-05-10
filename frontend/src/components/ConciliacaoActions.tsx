import { useState } from 'react';
import { Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useConciliarAutomatica } from '../hooks/useConciliacao';
import type { ResultadoAutomatica } from '../api/conciliacao';

interface Props {
  contaId: string;
  totalPendentes: number;
}

export default function ConciliacaoActions({ contaId, totalPendentes }: Props) {
  const [resultado, setResultado] = useState<ResultadoAutomatica | null>(null);
  const { mutate: executar, isPending } = useConciliarAutomatica(contaId);

  function handleAutomatica() {
    if (!confirm(`Executar conciliação automática para ${totalPendentes} lançamentos pendentes?`)) return;
    setResultado(null);
    executar(undefined, {
      onSuccess: (res) => setResultado(res),
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={handleAutomatica}
        disabled={isPending || totalPendentes === 0}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <Zap size={16} />
        {isPending ? 'Processando...' : 'Executar Automática'}
      </button>

      {resultado && (
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-green-600 font-medium">
            <CheckCircle size={15} />
            {resultado.conciliados} conciliados
          </span>
          {resultado.naoEncontrados > 0 && (
            <span className="flex items-center gap-1.5 text-yellow-600 font-medium">
              <AlertTriangle size={15} />
              {resultado.naoEncontrados} não encontrados
            </span>
          )}
          {resultado.pendentes > 0 && (
            <span className="text-gray-500">{resultado.pendentes} ainda pendentes</span>
          )}
        </div>
      )}
    </div>
  );
}
