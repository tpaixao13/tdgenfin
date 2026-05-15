import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissoesCtx } from '../contexts/PermissoesContext';
import { dashboardItem, menuGroups } from '../config/menuConfig';
import type { MenuItem, MenuGroup, Role } from '../config/menuConfig';

// ── Collapse state persisted in localStorage ──────────────────────────────────

function loadCollapsed(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem('sidebar-collapsed') ?? '{}');
  } catch {
    return {};
  }
}

function saveCollapsed(state: Record<string, boolean>) {
  localStorage.setItem('sidebar-collapsed', JSON.stringify(state));
}

// ── Styles ────────────────────────────────────────────────────────────────────

const topCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

const subCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 pl-6 pr-3 py-2 rounded-lg text-sm transition-colors ${
    isActive
      ? 'bg-blue-600 text-white font-medium'
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
  }`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function useItemVisible() {
  const { user } = useAuth();
  const { temPermissao } = usePermissoesCtx();

  return useCallback(
    (item: MenuItem): boolean => {
      if (item.roles && !item.roles.includes(user?.role as Role)) return false;
      if (item.permissao && !temPermissao(item.permissao)) return false;
      return true;
    },
    [user, temPermissao],
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function NavItem({ item, sub = false }: { item: MenuItem; sub?: boolean }) {
  const Icon = item.icon;
  const cls = sub ? subCls : topCls;
  return (
    <NavLink to={item.path} end={item.end} className={cls}>
      <Icon size={sub ? 15 : 18} />
      {item.label}
    </NavLink>
  );
}

function GroupSection({
  group,
  visibleItems,
  collapsed,
  onToggle,
}: {
  group: MenuGroup;
  visibleItems: MenuItem[];
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
      >
        {group.label}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${collapsed ? '-rotate-90' : 'rotate-0'}`}
        />
      </button>

      {!collapsed && (
        <div className="mt-0.5 space-y-0.5">
          {visibleItems.map((item) => (
            <NavItem key={item.path} item={item} sub />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SidebarMenu() {
  const isVisible = useItemVisible();

  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>(
    () => loadCollapsed(),
  );

  function toggleGroup(id: string) {
    setCollapsedState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveCollapsed(next);
      return next;
    });
  }

  function isCollapsed(group: MenuGroup): boolean {
    // localStorage overrides defaultOpen; if no stored value, use defaultOpen inverted
    if (collapsedState[group.id] !== undefined) return collapsedState[group.id];
    return !group.defaultOpen;
  }

  const showDashboard = isVisible(dashboardItem);

  return (
    <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
      {/* Dashboard — top-level, no group */}
      {showDashboard && <NavItem item={dashboardItem} />}

      {/* Groups */}
      {menuGroups.map((group) => {
        const visibleItems = group.itens.filter(isVisible);
        if (visibleItems.length === 0) return null;

        return (
          <GroupSection
            key={group.id}
            group={group}
            visibleItems={visibleItems}
            collapsed={isCollapsed(group)}
            onToggle={() => toggleGroup(group.id)}
          />
        );
      })}
    </nav>
  );
}
