import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Landmark,
  Upload,
  Building2,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/contas', icon: Landmark, label: 'Contas' },
  { to: '/importar', icon: Upload, label: 'Importar Extrato' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">TDGenFin</h1>
        <p className="text-xs text-slate-400 mt-0.5">Gestão Financeira</p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {/* Empresas — apenas SUPER_ADMIN */}
        {user?.role === 'SUPER_ADMIN' && (
          <NavLink
            to="/empresas"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Building2 size={18} />
            Empresas
          </NavLink>
        )}
      </nav>

      {/* Rodapé com usuário */}
      <div className="px-3 py-4 border-t border-slate-700">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-white truncate">{user?.nome}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          <span className="inline-block mt-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
            {user?.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
