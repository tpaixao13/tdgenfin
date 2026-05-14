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

  const empresaAtual = !isSuperAdmin && user?.empresaId
    ? empresas?.find((e: Empresa) => e.id === user.empresaId)
    : undefined;

  const usuariosAtivos = (usuarios ?? []).filter(u => u.ativo).length;
  const maxUsuarios = empresaAtual?.maxUsuarios ?? 0;
  const limiteAtingido = !isSuperAdmin && maxUsuarios > 0 && usuariosAtivos >= maxUsuarios;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">Usuários</h2>
        </div>
        <div className="flex items-center gap-4">
          {!isSuperAdmin && empresaAtual && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Licença</p>
              <p className={`text-sm font-semibold ${limiteAtingido ? 'text-red-600' : 'text-gray-700'}`}>
                {usuariosAtivos} / {maxUsuarios} usuários ativos
              </p>
            </div>
          )}
          <button
            onClick={() => setShowForm(true)}
            disabled={limiteAtingido}
            title={limiteAtingido ? `Limite de ${maxUsuarios} usuário(s) atingido` : undefined}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <UserPlus size={16} />
            Novo Usuário
          </button>
        </div>
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
