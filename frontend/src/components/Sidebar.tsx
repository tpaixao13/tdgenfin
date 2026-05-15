import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SidebarMenu from './SidebarMenu';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 text-white flex flex-col min-h-screen" style={{ backgroundColor: '#0B2A4A' }}>
      {/* Logo */}
      <div className="flex items-center justify-center py-4 px-6 border-b border-white/10">
        <img
          src="/logo.png?v=4"
          alt="TDGenFin"
          className="w-auto object-contain brightness-0 invert"
          style={{ height: '90px' }}
        />
      </div>

      {/* Navigation — driven by menuConfig */}
      <SidebarMenu />

      {/* User footer */}
      <div className="px-3 py-4 border-t border-slate-700 shrink-0">
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
