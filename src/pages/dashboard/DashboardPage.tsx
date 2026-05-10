import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { metricsApi } from '@/api/metrics';
import { useAuth } from '@/providers/AuthProvider';
import { isSuperAdmin, isOwner } from '@/lib/permissions';
import { Skeleton } from '@/components/ui/Skeleton';
import { timeAgo } from '@/lib/format';

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => metricsApi.dashboard(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  if (isOwner(user) && data?.mis_negocios) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 font-display mb-6">
          Hola, {user?.nombre ?? user?.email}
        </h1>
        <div className="grid gap-4">
          {data.mis_negocios.map((n) => (
            <Link
              key={n.id}
              to={`/negocios/${n.id}`}
              className="block rounded-xl border border-zinc-200 bg-white p-5 hover:shadow-sm transition-shadow"
            >
              <p className="font-medium text-zinc-900">{n.nombre}</p>
              <p className="text-sm text-atrato-600 mt-1">Ver y editar →</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 font-display mb-6">
        Panel de administración
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Negocios activos" value={data?.total_negocios ?? 0} />
        <StatCard label="Pendientes revisión" value={data?.pendientes_aprobacion ?? 0} urgent={Number(data?.pendientes_aprobacion) > 0} />
        <StatCard label="Reclamos activos" value={data?.claims_activos ?? 0} />
      </div>

      {/* Actividad reciente */}
      {isSuperAdmin(user) && data?.actividad_reciente && data.actividad_reciente.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h2 className="text-sm font-semibold text-zinc-900 mb-3">Actividad reciente</h2>
          <div className="space-y-2">
            {data.actividad_reciente.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">
                    {a.accion}
                  </span>
                  <span className="text-zinc-500">{a.user_email ?? 'Sistema'}</span>
                </div>
                <span className="text-zinc-400">{timeAgo(a.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, urgent }: { label: string; value: number; urgent?: boolean }) {
  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: urgent ? 'var(--chirimia-50)' : 'var(--surface)',
        border: `1px solid ${urgent ? 'var(--chirimia-200)' : 'var(--border)'}`,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <p
        className="text-[12px] font-medium mb-2 uppercase tracking-wide"
        style={{ color: 'color-mix(in oklab, var(--carbon-900) 45%, transparent)' }}
      >
        {label}
      </p>
      <p
        className="text-4xl font-display font-semibold"
        style={{ color: urgent ? 'var(--chirimia-700)' : 'var(--carbon-900)' }}
      >
        {value}
      </p>
    </div>
  );
}
