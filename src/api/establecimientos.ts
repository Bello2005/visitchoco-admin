import { apiFetch } from './client';

export interface Establecimiento {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria: string | null;
  descripcion: string | null;
  municipio_id: number | null;
  municipio_nombre: string | null;
  telefono: string | null;
  email: string | null;
  whatsapp: string | null;
  sitio_web: string | null;
  direccion: string | null;
  lat: number | null;
  lng: number | null;
  especialidades: string[];
  horario: Record<string, string>;
  rango_precio: string | null;
  rnt: string | null;
  activo: boolean;
  verificado: boolean;
  foto_url: string | null;
  reclamado: boolean;
  tiene_cambios_pendientes: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListResponse {
  items: Establecimiento[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListParams {
  q?: string;
  categoria?: string;
  municipio_id?: number;
  estado?: string;
  reclamado?: 'si' | 'no';
  limit?: number;
  offset?: number;
}

function buildQuery(params: ListParams): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') q.set(k, String(v));
  });
  return q.toString() ? `?${q}` : '';
}

export const establecimientosApi = {
  list: (params: ListParams = {}) =>
    apiFetch<ListResponse>(`/establecimientos${buildQuery(params)}`),

  get: (id: string) =>
    apiFetch<{ establecimiento: Establecimiento; media: MediaAsset[]; cambios_pendientes: unknown }>
      (`/establecimientos/${id}`),

  update: (id: string, data: Partial<Establecimiento>) =>
    apiFetch<{ ok: boolean; en_revision?: boolean; queue_id?: string }>(`/establecimientos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ ok: boolean }>(`/establecimientos/${id}`, { method: 'DELETE' }),
};

export interface MediaAsset {
  id: string;
  url_publica: string;
  alt_text: string | null;
  caption: string | null;
  posicion: number;
  es_principal: boolean;
  r2_key?: string;
  entidad_tipo?: string;
  entidad_id?: string;
  mime_type?: string;
  size_bytes?: number;
  width_px?: number | null;
  height_px?: number | null;
  credito?: string | null;
}
