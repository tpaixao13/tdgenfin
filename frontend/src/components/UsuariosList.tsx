import type { UsuarioComPermissoes } from '../types';

const roleBadge: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN_EMPRESA: 'bg-blue-100 text-blue-700',
  USUARIO: 'bg-gray-100 text-gray-600',
};

interface Props {
  usuarios: UsuarioComPermissoes[];
  selecionadoId: string | null;
  onSelecionar: (id: string) => void;
}

export default function UsuariosList({ usuarios, selecionadoId, onSelecionar }: Props) {
  return (
    <ul className="divide-y divide-gray-100">
      {usuarios.map((u) => {
        const ativo = selecionadoId === u.usuarioId;
        return (
          <li key={u.usuarioId}>
            <button
              onClick={() => onSelecionar(u.usuarioId)}
              className={`w-full text-left px-4 py-3 transition-colors hover:bg-blue-50 ${
                ativo ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${ativo ? 'text-blue-700' : 'text-gray-800'}`}>
                    {u.nome}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  {u.empresa && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{u.empresa}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadge[u.role] ?? roleBadge.USUARIO}`}>
                    {u.role}
                  </span>
                  {!u.ativo && (
                    <span className="text-xs text-red-500">Inativo</span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
