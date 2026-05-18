import { useState } from 'react';
import { Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { usePreviewAutomatica, useConfirmarAutomatica } from '../hooks/useConciliacao';
import ConciliacaoPreviewModal from './ConciliacaoPreviewModal';
import type { MatchProposto, PreviewAutomaticaResult } from '../api/conciliacao';
import type { ResultadoAutomatica } from '../api/conciliacao';

interface Props {
  contaId: string;
  totalPendentes: number;
}

export default function ConciliacaoActions({ contaId, totalPendentes }: Props) {
  const [preview, setPreview] = useState<PreviewAutomaticaResult | null>(null);
  const [resultado, setResultado] = useState<ResultadoAutomatica | null>(null);

  const { mutate: buscarPreview, isPending: buscando } = usePreviewAutomatica(contaId);
  const { mutate: confirmar, isPending: confirmando } = useConfirmarAutomatica(contaId);

  function handleExecutar() {
    setResultado(null);
    buscarPreview(undefined, {
      onSuccess: (res) => setPreview(res),
    });
  }

  function handleConfirmar(selecionados: MatchProposto[]) {
    confirmar(
      selecionados.map((m) => ({
        lancamentoId: m.lancamentoId,
        contaErpId: m.contaErpId,
        tipo: m.tipo,
      })),
      {
        onSuccess: (res) => {
          setPreview(null);
          setResultado(res);
        },
      },
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleExecutar}
          disabled={buscando || totalPendentes === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Zap size={16} />
          {buscando ? 'Buscando...' : 'Executar Automática'}
        </button>

        {resultado && (
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-green-600 font-medium">
              <CheckCircle size={15} />
              {resultado.conciliados} conciliado{resultado.conciliados !== 1 ? 's' : ''}
            </span>
            {resultado.naoEncontrados > 0 && (
              <span className="flex items-center gap-1.5 text-orange-500 font-medium">
                <AlertTriangle size={15} />
                {resultado.naoEncontrados} não encontrado{resultado.naoEncontrados !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {preview && (
        <ConciliacaoPreviewModal
          matches={preview.matches}
          naoEncontrados={preview.naoEncontrados}
          contaId={contaId}
          onConfirmar={handleConfirmar}
          onFechar={() => setPreview(null)}
          isPending={confirmando}
        />
      )}
    </>
  );
}
