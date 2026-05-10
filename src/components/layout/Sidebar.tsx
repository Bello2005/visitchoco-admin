import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, MapPin, Fish, Landmark,
  Inbox, BarChart3, Users, LogOut, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/providers/AuthProvider';

interface NavItem {
  to: string;
  Icon: LucideIcon;
  label: string;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard',  Icon: LayoutDashboard, label: 'Inicio' },
  { to: '/negocios',   Icon: Building2,        label: 'Negocios',     roles: ['super_admin','editor_institucional','dueno_negocio'] },
  { to: '/municipios', Icon: MapPin,           label: 'Municipios',   roles: ['super_admin','editor_institucional'] },
  { to: '/cultura',    Icon: Landmark,         label: 'Cultura',      roles: ['super_admin','editor_institucional'] },
  { to: '/fauna',      Icon: Fish,             label: 'Fauna',        roles: ['super_admin','editor_institucional'] },
  { to: '/inbox',      Icon: Inbox,            label: 'Aprobaciones', roles: ['super_admin','editor_institucional'] },
  { to: '/metricas',   Icon: BarChart3,        label: 'Métricas' },
  { to: '/usuarios',   Icon: Users,            label: 'Usuarios',     roles: ['super_admin'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <aside
      className="w-sidebar shrink-0 flex flex-col bg-surface border-r"
      style={{ borderColor: 'var(--border)', height: '100dvh', position: 'sticky', top: 0 }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5"
        style={{ height: 'var(--topbar-h)', borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ border: '1.5px solid var(--atrato-700)' }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--atrato-700)' }} />
        </div>
        <span className="font-display font-semibold text-sm" style={{ color: 'var(--carbon-900)' }}>
          VisitChocó
        </span>
        <span
          className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: 'color-mix(in oklab, var(--carbon-900) 35%, transparent)' }}
        >
          Admin
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-0.5">
        {visibleItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => cn(
              'group flex items-center gap-2.5 rounded px-3 py-2 text-[13px] font-medium transition-colors',
              isActive
                ? 'bg-accent-bg text-accent-fg'
                : 'hover:bg-carbon-900/5'
            )}
            style={({ isActive }) => ({
              color: isActive
                ? 'var(--accent-fg)'
                : 'color-mix(in oklab, var(--carbon-900) 60%, transparent)',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={15} strokeWidth={isActive ? 2.25 : 1.75} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        {user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-[13px] font-medium truncate" style={{ color: 'var(--carbon-900)' }}>
              {user.nombre ?? user.email}
            </p>
            <p className="text-[11px] truncate" style={{ color: 'color-mix(in oklab, var(--carbon-900) 45%, transparent)' }}>
              {user.role.replace(/_/g, ' ')}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-[13px] transition-colors hover:bg-carbon-900/5"
          style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}
        >
          <LogOut size={14} strokeWidth={1.75} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
