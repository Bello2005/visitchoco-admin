import { apiFetch } from './client';

export interface Patrimonio {
  id: number;
  municipio_nombre: string;
  ambito: string | null;
  descripcion: string | null;
}

export interface Fiesta {
  id: number;
  municipio_nombre: string;
  mes: number;
  fecha_inicio_dia: number | null;
  descripcion: string | null;
  slug: string | null;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.set(k, String(v)); });
  return q.toString() ? `?${q}` : '';
}

export const culturaApi = {
  listPatrimonio: (params: { q?: string; municipio?: string; limit?: number; offset?: number } = {}) =>
    apiFetch<{ items: Patrimonio[]; total: number }>(`/cultura/patrimonio${buildQuery(params)}`),

  getPatrimonio: (id: number) =>
    apiFetch<{ patrimonio: Patrimonio }>(`/cultura/patrimonio/${id}`),

  updatePatrimonio: (id: number, data: Partial<Patrimonio>) =>
    apiFetch<{ ok: boolean }>(`/cultura/patrimonio/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  listFiestas: (params: { q?: string; mes?: number; limit?: number; offset?: number } = {}) =>
    apiFetch<{ items: Fiesta[]; total: number; meses: string[] }>(`/cultura/fiestas${buildQuery(params)}`),

  getFiesta: (id: number) =>
    apiFetch<{ fiesta: Fiesta }>(`/cultura/fiestas/${id}`),

  updateFiesta: (id: number, data: Partial<Fiesta>) =>
    apiFetch<{ ok: boolean }>(`/cultura/fiestas/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
