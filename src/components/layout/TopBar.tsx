import { Bell, Search, LogOut, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '@/providers/AuthProvider';

export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header
      className="shrink-0 flex items-center px-6 gap-4 z-topbar"
      style={{
        height: 'var(--topbar-h)',
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in oklab, var(--surface) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Búsqueda global */}
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded text-[13px] transition-colors"
        style={{
          border: '1px solid var(--border)',
          color: 'color-mix(in oklab, var(--carbon-900) 45%, transparent)',
          width: '18rem',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <Search size={13} strokeWidth={2} />
        <span className="flex-1 text-left">Buscar…</span>
        <kbd
          className="text-[10px] font-mono px-1 rounded"
          style={{ background: 'var(--surface-sunken)', color: 'color-mix(in oklab, var(--carbon-900) 35%, transparent)' }}
        >
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Notificaciones */}
      <button
        className="p-2 rounded transition-colors hover:bg-carbon-900/5"
        style={{ color: 'color-mix(in oklab, var(--carbon-900) 50%, transparent)' }}
        aria-label="Notificaciones"
      >
        <Bell size={16} strokeWidth={1.75} />
      </button>

      {/* User menu */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="flex items-center gap-2 px-2 py-1.5 rounded transition-colors hover:bg-carbon-900/5"
            style={{ color: 'var(--carbon-900)' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent-fg)' }}
            >
              {(user?.nombre ?? user?.email ?? 'A').charAt(0).toUpperCase()}
            </div>
            <span className="text-[13px] hidden sm:block">{user?.nombre ?? user?.email}</span>
            <ChevronDown size={12} style={{ color: 'color-mix(in oklab, var(--carbon-900) 35%, transparent)' }} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="min-w-[200px] rounded-lg p-1 z-dialog"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lift)',
            }}
          >
            <DropdownMenu.Label
              className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-widest"
              style={{ color: 'color-mix(in oklab, var(--carbon-900) 40%, transparent)' }}
            >
              {user?.role.replace(/_/g, ' ')}
            </DropdownMenu.Label>
            <DropdownMenu.Separator className="my-1 h-px" style={{ background: 'var(--border)' }} />
            <DropdownMenu.Item asChild>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-[13px] rounded transition-colors hover:bg-carbon-900/5 cursor-pointer"
                style={{ color: 'var(--chirimia-600)' }}
              >
                <LogOut size={13} />
                Cerrar sesión
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}
