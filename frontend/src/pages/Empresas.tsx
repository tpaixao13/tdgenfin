import { useEmpresas } from '../hooks/useEmpresa';
import { useEmpresa } from '../contexts/EmpresaContext';
import { Building2, CheckCircle } from 'lucide-react';

export default function Empresas() {
  const { data: empresas, isLoading, error } = useEmpresas();
  const { empresaAtiva, setEmpresaAtiva } = useEmpresa();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Carregando empresas...
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
        Erro ao carregar empresas.
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Empresas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {empresas?.map((emp) => (
          <div
            key={emp.id}
            onClick={() => setEmpresaAtiva(emp)}
            className={`bg-white border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${
              empresaAtiva?.id === emp.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{emp.nome}</p>
                  <p className="text-sm text-gray-500">{emp.cnpj}</p>
                </div>
              </div>
              {empresaAtiva?.id === emp.id && (
                <CheckCircle size={20} className="text-blue-600 shrink-0" />
              )}
            </div>
            <div className="mt-3">
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                  emp.ativo
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {emp.ativo ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!empresas?.length && (
        <div className="text-center text-gray-400 py-16">Nenhuma empresa encontrada.</div>
      )}
    </div>
  );
}
