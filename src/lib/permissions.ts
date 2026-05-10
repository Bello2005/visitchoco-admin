import type { AdminUser } from '@/providers/AuthProvider';

export function hasPermission(user: AdminUser | null, ...permisos: string[]): boolean {
  if (!user) return false;
  if (user.permisos.includes('*')) return true;
  return permisos.some(p => user.permisos.includes(p));
}

export function isSuperAdmin(user: AdminUser | null): boolean {
  return user?.role === 'super_admin';
}

export function isOwner(user: AdminUser | null): boolean {
  return user?.role === 'dueno_negocio';
}

export function isEditor(user: AdminUser | null): boolean {
  return user?.role === 'editor_institucional';
}
