import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { useEmpresas } from '../hooks/useEmpresa';
import EmpresasTable from '../components/EmpresasTable';
import EmpresaForm from '../components/EmpresaForm';
import type { Empresa } from '../types';

export default function Empresas() {
  const { data: empresas, isLoading, isError } = useEmpresas();
  const [formAberto, setFormAberto] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState<Empresa | undefined>();

  function abrirEditar(emp: Empresa) {
    setEmpresaEditando(emp);
    setFormAberto(true);
  }

  function fecharForm() {
    setFormAberto(false);
    setEmpresaEditando(undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 size={22} className="text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">Empresas</h2>
        </div>
        <button
          onClick={() => setFormAberto(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nova Empresa
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {isLoading && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Carregando empresas...
          </div>
        )}

        {isError && (
          <div className="text-center py-16 text-red-500 text-sm">
            Erro ao carregar empresas. Tente novamente.
          </div>
        )}

        {!isLoading && !isError && (
          <EmpresasTable
            empresas={empresas ?? []}
            onEditar={abrirEditar}
          />
        )}
      </div>

      {formAberto && (
        <EmpresaForm
          empresa={empresaEditando}
          onClose={fecharForm}
        />
      )}
    </div>
  );
}
