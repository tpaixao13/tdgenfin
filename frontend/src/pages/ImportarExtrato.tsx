import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { extratosApi } from '../api/extratos';
import { contasApi } from '../api/contas';
import { useAuth } from '../contexts/AuthContext';
import { usePermissoesCtx } from '../contexts/PermissoesContext';
import AcessoNegado from '../components/AcessoNegado';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function ImportarExtrato() {
  const { isAuthenticated } = useAuth();
  const { temPermissao, isLoading: permLoading } = usePermissoesCtx();

  if (!permLoading && !temPermissao('EXTRATO_IMPORT')) return <AcessoNegado />;
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contaId, setContaId] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);

  const { data: contas } = useQuery({
    queryKey: ['contas'],
    queryFn: contasApi.listar,
    enabled: isAuthenticated,
  });

  const { mutate: importar, isPending, isSuccess, error, reset } = useMutation({
    mutationFn: () => extratosApi.importar(contaId, arquivo!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setArquivo(null);
    },
  });

  const errorMsg = (() => {
    if (!error) return null;
    const data = (error as any).response?.data;
    return data?.message ?? 'Erro ao importar extrato';
  })();

  function handleFile(file: File) {
    const allowed = ['ofx', 'qfx', 'csv', 'xlsx', 'xls'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowed.includes(ext)) {
      alert('Formato não suportado. Use OFX, CSV ou XLSX.');
      return;
    }
    setArquivo(file);
    reset();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Importar Extrato Bancário</h2>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Seleção de conta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conta Bancária <span className="text-red-500">*</span>
          </label>
          <select
            value={contaId}
            onChange={(e) => setContaId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma conta</option>
            {contas?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.banco} — Ag. {c.agencia} · CC {c.numero}
              </option>
            ))}
          </select>
        </div>

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arquivo <span className="text-red-500">*</span>
          </label>

          {arquivo ? (
            <div className="flex items-center gap-3 border border-green-300 bg-green-50 rounded-lg px-4 py-3">
              <FileText size={20} className="text-green-600 shrink-0" />
              <span className="text-sm text-green-700 flex-1 truncate">{arquivo.name}</span>
              <button
                onClick={() => { setArquivo(null); reset(); }}
                className="text-green-600 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                drag
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <Upload size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600">
                Arraste o arquivo ou{' '}
                <span className="text-blue-600 font-medium">clique para selecionar</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">OFX, CSV ou XLSX · máx. 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".ofx,.qfx,.csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          )}
        </div>

        {/* Feedback */}
        {isSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            <CheckCircle size={16} />
            Extrato importado com sucesso!
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {/* Botão */}
        <button
          onClick={() => importar()}
          disabled={!contaId || !arquivo || isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg text-sm transition-colors"
        >
          {isPending ? 'Importando...' : 'Importar Extrato'}
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
        <strong>Formatos suportados:</strong> OFX (Open Financial Exchange), CSV e XLSX.
        O mesmo arquivo não pode ser importado duas vezes.
      </div>
    </div>
  );
}
