import { Pencil } from 'lucide-react';
import type { Empresa } from '../types';
import { useAtualizarEmpresa } from '../hooks/useEmpresa';

function formatarData(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
}

interface Props {
  empresas: Empresa[];
  onEditar: (empresa: Empresa) => void;
}

export default function EmpresasTable({ empresas, onEditar }: Props) {
  const { mutate: atualizar, isPending } = useAtualizarEmpresa();

  function toggleAtivo(emp: Empresa) {
    const acao = emp.ativo ? 'desativar' : 'ativar';
    if (!confirm(`Deseja ${acao} a empresa "${emp.nome}"?`)) return;
    atualizar({ id: emp.id, dto: { ativo: !emp.ativo } });
  }

  if (empresas.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        Nenhuma empresa cadastrada.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <th className="pb-3 pr-4">Nome</th>
            <th className="pb-3 pr-4">CNPJ</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3 pr-4">Criada em</th>
            <th className="pb-3">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {empresas.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4 font-medium text-gray-800">{emp.nome}</td>
              <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{emp.cnpj}</td>
              <td className="py-3 pr-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  emp.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {emp.ativo ? 'Ativa' : 'Inativa'}
                </span>
              </td>
              <td className="py-3 pr-4 text-gray-500">
                {formatarData(emp.createdAt)}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditar(emp)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={13} />
                    Editar
                  </button>
                  <button
                    onClick={() => toggleAtivo(emp)}
                    disabled={isPending}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                      emp.ativo
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {emp.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
