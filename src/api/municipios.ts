import { apiFetch } from './client';

export interface Municipio {
  id: number;
  name: string;
  slug: string;
  emoji: string | null;
  zone: string | null;
  main_activity: string | null;
  description: string | null;
  image_url: string | null;
  lat: number | null;
  lon: number | null;
  cod_dane: string | null;
  population?: number;
  updated_at: string;
}

export interface MunicipioMedia {
  id: string; url_publica: string; alt_text: string | null; posicion: number; es_principal: boolean;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.set(k, String(v)); });
  return q.toString() ? `?${q}` : '';
}

export const municipiosApi = {
  list: (params: { q?: string; zone?: string; limit?: number; offset?: number } = {}) =>
    apiFetch<{ items: Municipio[]; total: number }>(`/municipios${buildQuery(params)}`),

  get: (id: number) =>
    apiFetch<{ municipio: Municipio; media: MunicipioMedia[] }>(`/municipios/${id}`),

  update: (id: number, data: Partial<Municipio>) =>
    apiFetch<{ ok: boolean }>(`/municipios/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
