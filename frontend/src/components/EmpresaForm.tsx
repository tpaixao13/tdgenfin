import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCriarEmpresa, useAtualizarEmpresa } from '../hooks/useEmpresa';
import type { Empresa } from '../types';

function maskCnpj(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

interface Props {
  empresa?: Empresa;
  onClose: () => void;
}

export default function EmpresaForm({ empresa, onClose }: Props) {
  const isEdit = !!empresa;

  const [nome, setNome] = useState(empresa?.nome ?? '');
  const [cnpj, setCnpj] = useState(empresa?.cnpj ?? '');

  useEffect(() => {
    if (empresa) {
      setNome(empresa.nome);
      setCnpj(empresa.cnpj);
    }
  }, [empresa]);

  const { mutate: criar, isPending: criando, error: erroCriar } = useCriarEmpresa();
  const { mutate: atualizar, isPending: atualizando, error: erroAtualizar } = useAtualizarEmpresa();

  const isPending = criando || atualizando;
  const error = erroCriar ?? erroAtualizar;

  const errorMsg = (() => {
    if (!error) return null;
    const data = (error as any).response?.data;
    return data?.message ?? 'Erro ao salvar empresa';
  })();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit) {
      atualizar({ id: empresa.id, dto: { nome, cnpj } }, { onSuccess: onClose });
    } else {
      criar({ nome, cnpj }, { onSuccess: onClose });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEdit ? 'Editar Empresa' : 'Nova Empresa'}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Razão social"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">CNPJ</label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(maskCnpj(e.target.value))}
              required
              placeholder="00.000.000/0001-00"
              maxLength={18}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {isPending ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
