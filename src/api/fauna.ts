import { apiFetch } from './client';

export interface Animal {
  id: number;
  common_name: string;
  scientific_name: string | null;
  description: string | null;
  image_url: string | null;
  audio_url: string | null;
  municipality_id: number | null;
  municipality_name: string | null;
  updated_at: string;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.set(k, String(v)); });
  return q.toString() ? `?${q}` : '';
}

export const faunaApi = {
  list: (params: { q?: string; municipality_id?: number; limit?: number; offset?: number } = {}) =>
    apiFetch<{ items: Animal[]; total: number }>(`/fauna${buildQuery(params)}`),

  get: (id: number) =>
    apiFetch<{ animal: Animal; media: unknown[] }>(`/fauna/${id}`),

  update: (id: number, data: Partial<Animal>) =>
    apiFetch<{ ok: boolean }>(`/fauna/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
