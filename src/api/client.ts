const API_URL = import.meta.env.VITE_API_URL as string ?? 'https://visitchoco-backend.vercel.app';
const TOKEN_KEY = 'visitchoco_admin_token';

export class APIError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/admin${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    tokenStore.clear();
    onUnauthorized?.();
    throw new APIError(401, 'sesion_expirada');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'error_desconocido' }));
    throw new APIError(res.status, (body as { error?: string }).error ?? 'error');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
