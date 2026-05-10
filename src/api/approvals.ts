import { apiFetch } from './client';

export interface ApprovalItem {
  id: string;
  entidad_tipo: string;
  entidad_id: string;
  cambios: Record<string, unknown>;
  estado_anterior: Record<string, unknown>;
  solicitado_por: string;
  solicitante_email: string;
  solicitante_nombre: string;
  comentario_solicitante: string | null;
  estado: string;
  autoaprobacion_at: string | null;
  created_at: string;
}

export const approvalsApi = {
  list: (estado = 'pendiente', limit = 50, offset = 0) =>
    apiFetch<{ items: ApprovalItem[]; total: number }>(
      `/approvals?estado=${estado}&limit=${limit}&offset=${offset}`
    ),

  approve: (id: string) =>
    apiFetch<{ ok: boolean }>(`/approvals/${id}/aprobar`, { method: 'POST' }),

  reject: (id: string, comentario: string) =>
    apiFetch<{ ok: boolean }>(`/approvals/${id}/rechazar`, {
      method: 'POST',
      body: JSON.stringify({ comentario }),
    }),
};
