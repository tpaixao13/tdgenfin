import { useState } from 'react';
import { BarChart2, Search, CheckCircle, XCircle, Download } from 'lucide-react';
import { usePermissoes } from '../hooks/usePermissoes';

const roleBadge: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN_EMPRESA: 'bg-blue-100 text-blue-700',
  USUARIO: 'bg-gray-100 text-gray-600',
};

export default function Relatorios() {
  const { data: usuarios, isLoading } = usePermissoes();
  const [busca, setBusca] = useState('');
  const [expandido, setExpandido] = useState<string | null>(null);

  const filtrados = (usuarios ?? []).filter((u) => {
    const q = busca.toLowerCase();
    return (
      u.nome.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.empresa ?? '').toLowerCase().includes(q)
    );
  });

  const totalHabilitadas = (u: typeof filtrados[number]) =>
    u.permissoes.filter((p) => p.habilitado).length;

  function exportarCsv() {
    if (!usuarios?.length) return;

    const linhas: string[] = ['Nome,Email,Empresa,Role,Permissão,Habilitado'];
    for (const u of usuarios) {
      for (const p of u.permissoes) {
        linhas.push(
          `"${u.nome}","${u.email}","${u.empresa ?? ''}","${u.role}","${p.chave}","${p.habilitado}"`,
        );
      }
    }

    const blob = new Blob([linhas.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permissoes-usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <BarChart2 size={22} className="text-gray-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Relatório de Permissões</h2>
            <p className="text-sm text-gray-500">
              Visão completa do acesso de cada usuário ao sistema
            </p>
          </div>
        </div>
        <button
          onClick={exportarCsv}
          disabled={!filtrados.length}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={15} />
          Exportar CSV
        </button>
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuário ou empresa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabela / Cards */}
      {isLoading ? (
        <div className="text-sm text-gray-400 py-8 text-center">Carregando...</div>
      ) : filtrados.length === 0 ? (
        <div className="text-sm text-gray-400 py-8 text-center">Nenhum usuário encontrado</div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((u) => {
            const aberto = expandido === u.usuarioId;
            const qtd = totalHabilitadas(u);

            return (
              <div
                key={u.usuarioId}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Linha de resumo — clicável para expandir */}
                <button
                  onClick={() => setExpandido(aberto ? null : u.usuarioId)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">{u.nome}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadge[u.role] ?? roleBadge.USUARIO}`}>
                          {u.role}
                        </span>
                        {!u.ativo && (
                          <span className="text-xs text-red-500 font-medium">Inativo</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{u.email}</p>
                      {u.empresa && <p className="text-xs text-gray-400">{u.empresa}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      <span className="font-semibold text-green-600">{qtd}</span>
                      /{u.permissoes.length} permissões
                    </span>
                    <span className={`text-xs transition-transform ${aberto ? 'rotate-90' : ''}`}>›</span>
                  </div>
                </button>

                {/* Detalhe expandido */}
                {aberto && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-3">
                      {u.permissoes.map((p) => (
                        <div
                          key={p.chave}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                            p.habilitado
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-50 text-gray-400'
                          }`}
                        >
                          {p.habilitado ? (
                            <CheckCircle size={13} className="shrink-0" />
                          ) : (
                            <XCircle size={13} className="shrink-0" />
                          )}
                          <span className="truncate font-mono">{p.chave}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-400">{filtrados.length} usuário{filtrados.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
