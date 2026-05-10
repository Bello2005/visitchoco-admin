import { apiFetch } from './client';

export interface DashboardMetrics {
  total_negocios?: number;
  pendientes_aprobacion?: number;
  claims_activos?: number;
  umami?: unknown;
  actividad_reciente?: Array<{
    accion: string;
    entidad_tipo: string | null;
    entidad_id: string | null;
    user_email: string | null;
    created_at: string;
  }>;
  mis_negocios?: Array<{ id: string; nombre: string }>;
}

export const metricsApi = {
  dashboard: (range = '30d') =>
    apiFetch<DashboardMetrics>(`/metrics/dashboard?range=${range}`),

  global: (range = '30d') =>
    apiFetch<{ stats: unknown; pageviews: unknown; events: unknown; range: string; error?: string }>(
      `/metrics/global?range=${range}`
    ),
};
