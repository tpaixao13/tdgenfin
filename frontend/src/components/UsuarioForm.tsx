import { useState } from 'react';
import { X } from 'lucide-react';
import { useCriarUsuario } from '../hooks/useUsuarios';
import type { CreateUsuarioPayload, Empresa, Role } from '../types';

const ROLES_SUPER_ADMIN: { value: Role; label: string }[] = [
  { value: 'USUARIO', label: 'Usuário' },
  { value: 'ADMIN_EMPRESA', label: 'Admin Empresa' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
];

const ROLES_ADMIN_EMPRESA: { value: Role; label: string }[] = [
  { value: 'USUARIO', label: 'Usuário' },
];

interface Props {
  isSuperAdmin: boolean;
  empresas: Empresa[];
  empresaIdAtual: string | null;
  onClose: () => void;
}

const VAZIO: CreateUsuarioPayload = {
  nome: '',
  email: '',
  senha: '',
  role: 'USUARIO',
  empresaId: undefined,
};

export default function UsuarioForm({ isSuperAdmin, empresas, empresaIdAtual, onClose }: Props) {
  const [form, setForm] = useState<CreateUsuarioPayload>({
    ...VAZIO,
    empresaId: isSuperAdmin ? '' : (empresaIdAtual ?? undefined),
  });

  const { mutate: criar, isPending, error } = useCriarUsuario();

  const errorMsg = (() => {
    if (!error) return null;
    const data = (error as any).response?.data;
    return data?.message ?? 'Erro ao criar usuário';
  })();

  function set(field: keyof CreateUsuarioPayload, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreateUsuarioPayload = {
      ...form,
      empresaId: isSuperAdmin ? (form.empresaId || undefined) : (empresaIdAtual ?? undefined),
    };
    criar(payload, { onSuccess: onClose });
  }

  const roles = isSuperAdmin ? ROLES_SUPER_ADMIN : ROLES_ADMIN_EMPRESA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Novo Usuário</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => set('nome', e.target.value)}
              required
              placeholder="Nome completo"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
              placeholder="email@empresa.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha inicial</label>
            <input
              type="password"
              value={form.senha}
              onChange={(e) => set('senha', e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {isSuperAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Empresa</label>
              <select
                value={form.empresaId ?? ''}
                onChange={(e) => set('empresaId', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sem empresa (global)</option>
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.nome}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {isPending ? 'Criando...' : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
