import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Pencil } from 'lucide-react';
import { useEmpresaById } from '../hooks/useEmpresa';

function Campo({ label, valor }: { label: string; valor?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-800">{valor || <span className="text-gray-300">—</span>}</p>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">{titulo}</h3>
      {children}
    </section>
  );
}

export default function EmpresaView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: emp, isLoading, isError } = useEmpresaById(id ?? '');

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">Carregando empresa...</div>
    );
  }

  if (isError || !emp) {
    return (
      <div className="text-center py-20 text-red-500 text-sm">Empresa não encontrada.</div>
    );
  }

  const endereco = [emp.logradouro, emp.numero, emp.complemento]
    .filter(Boolean).join(', ');
  const localidade = [emp.bairro, emp.cidade, emp.estado].filter(Boolean).join(' — ');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/empresas')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <Building2 size={22} className="text-gray-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{emp.nome}</h2>
            {emp.nomeFantasia && (
              <p className="text-sm text-gray-400">{emp.nomeFantasia}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            emp.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}>
            {emp.ativo ? 'Ativa' : 'Inativa'}
          </span>
          <button
            onClick={() => navigate(`/empresas/${emp.id}/editar`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Pencil size={14} />
            Editar
          </button>
        </div>
      </div>

      {/* Identificação */}
      <Secao titulo="Identificação">
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Razão Social" valor={emp.nome} />
          <Campo label="Nome Fantasia" valor={emp.nomeFantasia} />
          <Campo label="CNPJ" valor={emp.cnpj} />
          <Campo label="Inscrição Estadual" valor={emp.inscricaoEstadual} />
          <Campo label="Inscrição Municipal" valor={emp.inscricaoMunicipal} />
        </div>
      </Secao>

      {/* Endereço */}
      <Secao titulo="Endereço">
        {endereco || localidade ? (
          <div className="grid grid-cols-2 gap-4">
            <Campo label="CEP" valor={emp.cep} />
            <Campo label="País" valor={emp.pais} />
            <div className="col-span-2">
              <Campo label="Logradouro" valor={endereco || emp.logradouro} />
            </div>
            <Campo label="Bairro" valor={emp.bairro} />
            <Campo label="Cidade / Estado" valor={localidade} />
          </div>
        ) : (
          <p className="text-sm text-gray-400">Endereço não informado.</p>
        )}
      </Secao>

      {/* Contato */}
      <Secao titulo="Contato">
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Telefone" valor={emp.telefone} />
          <Campo label="E-mail" valor={emp.email} />
          <div className="col-span-2">
            <Campo label="Site" valor={emp.site} />
          </div>
        </div>
      </Secao>

      {/* Metadados */}
      <Secao titulo="Informações do Sistema">
        <div className="grid grid-cols-2 gap-4">
          <Campo label="ID" valor={emp.id} />
          <Campo
            label="Cadastrada em"
            valor={new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            }).format(new Date(emp.createdAt))}
          />
        </div>
      </Secao>
    </div>
  );
}
