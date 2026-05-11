import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCriarContaPagar, useAtualizarContaPagar } from '../hooks/useContasPagar';
import type {
  ContaPagar,
  CreateContaPagarPayload,
  RecorrenciaContaPagar,
  StatusContaPagar,
} from '../types';

const RECORRENCIAS: { value: RecorrenciaContaPagar; label: string }[] = [
  { value: 'NENHUMA',    label: 'Nenhuma' },
  { value: 'SEMANAL',    label: 'Semanal' },
  { value: 'MENSAL',     label: 'Mensal' },
  { value: 'TRIMESTRAL', label: 'Trimestral' },
  { value: 'ANUAL',      label: 'Anual' },
];

const STATUS_EDICAO: { value: StatusContaPagar; label: string }[] = [
  { value: 'ABERTA',    label: 'Aberta' },
  { value: 'CANCELADA', label: 'Cancelada' },
];

interface Props {
  editTarget?: ContaPagar;
  onClose: () => void;
}

const VAZIO: CreateContaPagarPayload = {
  descricao: '',
  fornecedor: '',
  valor: 0,
  dataVencimento: '',
  recorrencia: 'NENHUMA',
};

export default function ContaPagarForm({ editTarget, onClose }: Props) {
  const [form, setForm] = useState<CreateContaPagarPayload>(VAZIO);
  const [statusEdicao, setStatusEdicao] = useState<StatusContaPagar>('ABERTA');

  const { mutate: criar, isPending: criando, error: erroCriar } = useCriarContaPagar();
  const { mutate: atualizar, isPending: atualizando, error: erroAtualizar } = useAtualizarContaPagar();

  const isPending = criando || atualizando;
  const isEditing = !!editTarget;
  const isPaga = editTarget?.status === 'PAGA';

  useEffect(() => {
    if (editTarget) {
      setForm({
        descricao: editTarget.descricao,
        fornecedor: editTarget.fornecedor ?? '',
        valor: editTarget.valor,
        dataVencimento: editTarget.dataVencimento,
        recorrencia: editTarget.recorrencia,
      });
      setStatusEdicao(editTarget.status === 'CANCELADA' ? 'CANCELADA' : 'ABERTA');
    }
  }, [editTarget]);

  const errorMsg = (() => {
    const err = erroCriar ?? erroAtualizar;
    if (!err) return null;
    const data = (err as any).response?.data;
    return data?.message ?? 'Erro ao salvar conta a pagar';
  })();

  function set(field: keyof CreateContaPagarPayload, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, fornecedor: form.fornecedor || undefined };

    if (isEditing && editTarget) {
      atualizar(
        { id: editTarget.id, dto: { ...payload, status: statusEdicao } },
        { onSuccess: onClose },
      );
    } else {
      criar(payload, { onSuccess: onClose });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {errorMsg}
            </div>
          )}

          {isPaga && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
              Esta conta já foi paga via conciliação. Edição bloqueada.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) => set('descricao', e.target.value)}
              required
              disabled={isPaga}
              placeholder="Ex: Aluguel do escritório"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fornecedor</label>
            <input
              type="text"
              value={form.fornecedor ?? ''}
              onChange={(e) => set('fornecedor', e.target.value)}
              disabled={isPaga}
              placeholder="Nome do fornecedor (opcional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Valor (R$)</label>
            <input
              type="number"
              value={form.valor}
              onChange={(e) => set('valor', parseFloat(e.target.value) || 0)}
              required
              min={0.01}
              step={0.01}
              disabled={isPaga}
              placeholder="0,00"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de Vencimento</label>
            <input
              type="date"
              value={form.dataVencimento}
              onChange={(e) => set('dataVencimento', e.target.value)}
              required
              disabled={isPaga}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Recorrência</label>
            <select
              value={form.recorrencia}
              onChange={(e) => set('recorrencia', e.target.value)}
              disabled={isPaga}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              {RECORRENCIAS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {isEditing && !isPaga && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={statusEdicao}
                onChange={(e) => setStatusEdicao(e.target.value as StatusContaPagar)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_EDICAO.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              {isPaga ? 'Fechar' : 'Cancelar'}
            </button>
            {!isPaga && (
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                {isPending ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
