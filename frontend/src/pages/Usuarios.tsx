import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { useUsuarios } from '../hooks/useUsuarios';
import { useEmpresas } from '../hooks/useEmpresa';
import { useAuth } from '../contexts/AuthContext';
import UsuariosTable from '../components/UsuariosTable';
import UsuarioForm from '../components/UsuarioForm';
import type { Empresa } from '../types';

export default function Usuarios() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const { data: usuarios, isLoading, isError } = useUsuarios();
  const { data: empresas } = useEmpresas();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const empresaMap: Record<string, string> = {};
  empresas?.forEach((e: Empresa) => { empresaMap[e.id] = e.nome; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">Usuários</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <UserPlus size={16} />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {isLoading && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Carregando usuários...
          </div>
        )}

        {isError && (
          <div className="text-center py-16 text-red-500 text-sm">
            Erro ao carregar usuários. Tente novamente.
          </div>
        )}

        {!isLoading && !isError && (
          <UsuariosTable
            usuarios={usuarios ?? []}
            empresaMap={empresaMap}
            isSuperAdmin={isSuperAdmin}
          />
        )}
      </div>

      {showForm && (
        <UsuarioForm
          isSuperAdmin={isSuperAdmin}
          empresas={empresas ?? []}
          empresaIdAtual={user?.empresaId ?? null}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
