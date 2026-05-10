import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { metricsApi } from '@/api/metrics';
import { Skeleton } from '@/components/ui/Skeleton';

const RANGES = [
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: '90d', label: '90 días' },
  { value: '12m', label: '12 meses' },
];

export function MetricasPage() {
  const [range, setRange] = useState('30d');
  const { data, isLoading } = useQuery({
    queryKey: ['metricas-global', range],
    queryFn: () => metricsApi.global(range),
  });

  const stats = data?.stats as Record<string, { value: number }> | null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 font-display">Métricas</h1>
        <div className="flex gap-1 rounded-lg border border-zinc-200 p-1">
          {RANGES.map(r => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                range === r.value
                  ? 'bg-atrato-700 text-white'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : data?.error ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">Analytics no configurado.</p>
          <p className="text-xs text-zinc-400 mt-1">Configura Umami en las variables de entorno.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Visitantes únicos" value={stats?.['visitors']?.value ?? 0} />
          <MetricCard label="Pageviews" value={stats?.['pageviews']?.value ?? 0} />
          <MetricCard label="Visitas" value={stats?.['visits']?.value ?? 0} />
          <MetricCard label="Tasa de rebote" value={`${((stats?.['bounces']?.value ?? 0) * 100 / Math.max(1, stats?.['visits']?.value ?? 1)).toFixed(1)}%`} />
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-3xl font-semibold font-display text-zinc-900">{value}</p>
    </div>
  );
}
