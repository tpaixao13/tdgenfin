import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCriarContaReceber, useAtualizarContaReceber } from '../hooks/useContasReceber';
import type {
  ContaReceber,
  CreateContaReceberPayload,
  RecorrenciaContaPagar,
  StatusContaReceber,
} from '../types';

const RECORRENCIAS: { value: RecorrenciaContaPagar; label: string }[] = [
  { value: 'NENHUMA',    label: 'Nenhuma' },
  { value: 'SEMANAL',    label: 'Semanal' },
  { value: 'MENSAL',     label: 'Mensal' },
  { value: 'TRIMESTRAL', label: 'Trimestral' },
  { value: 'ANUAL',      label: 'Anual' },
];

const STATUS_EDICAO: { value: StatusContaReceber; label: string }[] = [
  { value: 'ABERTA',    label: 'Aberta' },
  { value: 'CANCELADA', label: 'Cancelada' },
];

interface Props {
  editTarget?: ContaReceber;
  onClose: () => void;
}

const VAZIO: CreateContaReceberPayload = {
  descricao: '',
  cliente: '',
  valor: 0,
  dataRecebimento: '',
  recorrencia: 'NENHUMA',
};

export default function ContaReceberForm({ editTarget, onClose }: Props) {
  const [form, setForm] = useState<CreateContaReceberPayload>(VAZIO);
  const [statusEdicao, setStatusEdicao] = useState<StatusContaReceber>('ABERTA');

  const { mutate: criar, isPending: criando, error: erroCriar } = useCriarContaReceber();
  const { mutate: atualizar, isPending: atualizando, error: erroAtualizar } = useAtualizarContaReceber();

  const isPending = criando || atualizando;
  const isEditing = !!editTarget;
  const isRecebida = editTarget?.status === 'RECEBIDA';

  useEffect(() => {
    if (editTarget) {
      setForm({
        descricao: editTarget.descricao,
        cliente: editTarget.cliente ?? '',
        valor: editTarget.valor,
        dataRecebimento: editTarget.dataRecebimento,
        recorrencia: editTarget.recorrencia,
      });
      setStatusEdicao(editTarget.status === 'CANCELADA' ? 'CANCELADA' : 'ABERTA');
    }
  }, [editTarget]);

  const errorMsg = (() => {
    const err = erroCriar ?? erroAtualizar;
    if (!err) return null;
    const data = (err as any).response?.data;
    return data?.message ?? 'Erro ao salvar conta a receber';
  })();

  function set(field: keyof CreateContaReceberPayload, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, cliente: form.cliente || undefined };

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
            {isEditing ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
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

          {isRecebida && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
              Esta conta já foi recebida via conciliação. Edição bloqueada.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) => set('descricao', e.target.value)}
              required
              disabled={isRecebida}
              placeholder="Ex: Mensalidade cliente ABC"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cliente</label>
            <input
              type="text"
              value={form.cliente ?? ''}
              onChange={(e) => set('cliente', e.target.value)}
              disabled={isRecebida}
              placeholder="Nome do cliente (opcional)"
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
              disabled={isRecebida}
              placeholder="0,00"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de Recebimento</label>
            <input
              type="date"
              value={form.dataRecebimento}
              onChange={(e) => set('dataRecebimento', e.target.value)}
              required
              disabled={isRecebida}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Recorrência</label>
            <select
              value={form.recorrencia}
              onChange={(e) => set('recorrencia', e.target.value)}
              disabled={isRecebida}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              {RECORRENCIAS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {isEditing && !isRecebida && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={statusEdicao}
                onChange={(e) => setStatusEdicao(e.target.value as StatusContaReceber)}
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
              {isRecebida ? 'Fechar' : 'Cancelar'}
            </button>
            {!isRecebida && (
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
