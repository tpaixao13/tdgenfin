import type { UsuarioItem, Role } from '../types';
import { useAtualizarUsuario } from '../hooks/useUsuarios';

const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN_EMPRESA: 'Admin Empresa',
  USUARIO: 'Usuário',
};

const ROLE_COR: Record<Role, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN_EMPRESA: 'bg-blue-100 text-blue-700',
  USUARIO: 'bg-gray-100 text-gray-600',
};

interface Props {
  usuarios: UsuarioItem[];
  empresaMap: Record<string, string>;
  isSuperAdmin: boolean;
}

export default function UsuariosTable({ usuarios, empresaMap, isSuperAdmin }: Props) {
  const { mutate: atualizar, isPending } = useAtualizarUsuario();

  function toggleAtivo(u: UsuarioItem) {
    if (!confirm(`${u.ativo ? 'Desativar' : 'Ativar'} o usuário "${u.nome}"?`)) return;
    atualizar({ id: u.id, dto: { ativo: !u.ativo } });
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        Nenhum usuário encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <th className="pb-3 pr-4">Nome / E-mail</th>
            {isSuperAdmin && <th className="pb-3 pr-4">Empresa</th>}
            <th className="pb-3 pr-4">Role</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4">
                <p className="font-medium text-gray-800">{u.nome}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </td>
              {isSuperAdmin && (
                <td className="py-3 pr-4 text-gray-600 text-sm">
                  {u.empresaId ? (empresaMap[u.empresaId] ?? '—') : (
                    <span className="text-purple-500 italic">Global</span>
                  )}
                </td>
              )}
              <td className="py-3 pr-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COR[u.role]}`}>
                  {ROLE_LABEL[u.role]}
                </span>
              </td>
              <td className="py-3 pr-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  u.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {u.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="py-3">
                <button
                  onClick={() => toggleAtivo(u)}
                  disabled={isPending}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                    u.ativo
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  {u.ativo ? 'Desativar' : 'Ativar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
