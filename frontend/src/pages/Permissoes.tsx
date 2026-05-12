import { useState } from 'react';
import { ShieldCheck, Search, AlertCircle, Loader2 } from 'lucide-react';
import { usePermissoes, useAtualizarPermissao } from '../hooks/usePermissoes';
import UsuariosList from '../components/UsuariosList';
import PermissoesToggle from '../components/PermissoesToggle';

export default function Permissoes() {
  const { data: usuarios, isLoading, isError } = usePermissoes();
  const { mutate: atualizar } = useAtualizarPermissao();

  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [pendentes, setPendentes] = useState<Set<string>>(new Set());

  const usuariosFiltrados = (usuarios ?? []).filter((u) => {
    const q = busca.toLowerCase();
    return (
      u.nome.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.empresa ?? '').toLowerCase().includes(q)
    );
  });

  const selecionado = (usuarios ?? []).find((u) => u.usuarioId === selecionadoId) ?? null;

  function handleToggle(chave: string, habilitado: boolean) {
    if (!selecionadoId) return;

    setPendentes((prev) => new Set(prev).add(chave));

    atualizar(
      { usuarioId: selecionadoId, permissao: chave, habilitado },
      {
        onSettled: () => {
          setPendentes((prev) => {
            const next = new Set(prev);
            next.delete(chave);
            return next;
          });
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <ShieldCheck size={22} className="text-gray-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Permissões</h2>
          <p className="text-sm text-gray-500">Gerencie o acesso individual de cada usuário</p>
        </div>
      </div>

      {isError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} />
          Erro ao carregar usuários. Tente novamente.
        </div>
      )}

      <div className="flex gap-4 h-[calc(100vh-180px)] min-h-0">
        {/* Painel esquerdo — lista de usuários */}
        <div className="w-72 shrink-0 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 size={20} className="animate-spin text-blue-500" />
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Nenhum usuário encontrado</p>
            ) : (
              <UsuariosList
                usuarios={usuariosFiltrados}
                selecionadoId={selecionadoId}
                onSelecionar={(id) => {
                  setSelecionadoId(id);
                  setPendentes(new Set());
                }}
              />
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
            {usuariosFiltrados.length} usuário{usuariosFiltrados.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Painel direito — permissões do usuário selecionado */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto">
          {!selecionado ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <ShieldCheck size={40} className="text-gray-200" />
              <p className="text-sm">Selecione um usuário para gerenciar as permissões</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Header do usuário */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selecionado.nome}</h3>
                  <p className="text-sm text-gray-500">{selecionado.email}</p>
                  {selecionado.empresa && (
                    <p className="text-sm text-gray-400">{selecionado.empresa}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    selecionado.role === 'SUPER_ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : selecionado.role === 'ADMIN_EMPRESA'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selecionado.role}
                  </span>
                  {!selecionado.ativo && (
                    <span className="text-xs text-red-500 font-medium">Inativo</span>
                  )}
                </div>
              </div>

              {/* Toggles */}
              <PermissoesToggle
                permissoes={selecionado.permissoes}
                pendentes={pendentes}
                onToggle={handleToggle}
                bloqueado={selecionado.role === 'SUPER_ADMIN'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
