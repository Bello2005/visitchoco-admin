import { apiFetch } from './client';

export interface UploadUrlResponse {
  upload_url: string;
  key: string;
  public_url: string;
}

export interface MediaAsset {
  id: string;
  r2_key: string;
  url_publica: string;
  entidad_tipo: string;
  entidad_id: string;
  mime_type: string;
  size_bytes: number;
  width_px: number | null;
  height_px: number | null;
  alt_text: string | null;
  caption: string | null;
  es_principal: boolean;
  posicion: number;
}

export const mediaApi = {
  getUploadUrl: (params: {
    entidad_tipo: string;
    entidad_id: string;
    mime_type: string;
    filename: string;
  }) => apiFetch<UploadUrlResponse>('/media/upload-url', {
    method: 'POST',
    body: JSON.stringify(params),
  }),

  confirm: (data: {
    r2_key: string;
    url_publica: string;
    entidad_tipo: string;
    entidad_id: string;
    mime_type: string;
    size_bytes: number;
    width_px?: number;
    height_px?: number;
    alt_text?: string;
    es_principal?: boolean;
  }) => apiFetch<{ ok: boolean; asset: MediaAsset }>('/media/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  delete: (id: string) =>
    apiFetch<{ ok: boolean }>(`/media/${id}`, { method: 'DELETE' }),

  setPrincipal: (id: string) =>
    apiFetch<{ ok: boolean }>(`/media/${id}/principal`, { method: 'PATCH' }),
};
