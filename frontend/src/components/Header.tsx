import { Building2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEmpresa } from '../contexts/EmpresaContext';
import { useEmpresas } from '../hooks/useEmpresa';

export default function Header() {
  const { user } = useAuth();
  const { empresaAtiva, setEmpresaAtiva } = useEmpresa();
  const { data: empresas } = useEmpresas();
  const [open, setOpen] = useState(false);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const nomeEmpresa = empresaAtiva?.nome ?? 'Selecione uma empresa';

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-500">
        <Building2 size={16} />
        {isSuperAdmin ? (
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {nomeEmpresa}
              <ChevronDown size={14} />
            </button>

            {open && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {empresas?.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setEmpresaAtiva(emp);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      empresaAtiva?.id === emp.id
                        ? 'text-blue-600 font-medium bg-blue-50'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="block font-medium">{emp.nome}</span>
                    <span className="block text-xs text-gray-400">{emp.cnpj}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm font-medium text-gray-700">
            {nomeEmpresa}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Bem-vindo, <span className="font-medium text-gray-800">{user?.nome}</span>
      </p>
    </header>
  );
}
