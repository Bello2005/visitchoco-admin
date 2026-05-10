import { apiFetch } from './client';

export interface AuthResponse {
  ok: boolean;
  accessToken?: string;
  user?: { id: string; email: string; role: string };
}

export interface MeResponse {
  user: {
    id: string;
    email: string;
    nombre: string | null;
    telefono: string | null;
    avatar_url: string | null;
    role: string;
    permisos: string[];
    ultimo_login_at: string | null;
  };
  establecimientos: Array<{ id: string; nombre: string; categoria: string; rol_negocio: string }>;
}

export const authApi = {
  sendMagicLink: (email: string) =>
    apiFetch<{ ok: boolean }>('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verify: (token: string) =>
    apiFetch<AuthResponse>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  me: () => apiFetch<MeResponse>('/auth/me'),

  logout: () =>
    apiFetch<{ ok: boolean }>('/auth/logout', { method: 'POST' }),
};
