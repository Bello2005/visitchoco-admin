import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { municipiosApi, type Municipio } from '@/api/municipios';
import { DataTable } from '@/components/data/DataTable';
import { MunicipioDrawer } from './MunicipioDrawer';

const ZONES = ['Pacífico Norte','Pacífico Sur','Atrato','San Juan','Baudó','Darién'];

const columns: ColumnDef<Municipio, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Municipio',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-lg">{row.original.emoji ?? '🏘️'}</span>
        <span className="text-[13px] font-medium" style={{ color: 'var(--carbon-900)' }}>
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'zone',
    header: 'Zona',
    cell: ({ getValue }) => (
      <span className="text-[12px]" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>
        {getValue() as string ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'main_activity',
    header: 'Actividad principal',
    cell: ({ getValue }) => (
      <span className="text-[12px]" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>
        {getValue() as string ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'population',
    header: 'Población',
    cell: ({ getValue }) => {
      const v = getValue() as number | undefined;
      return (
        <span className="text-[12px] font-mono" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>
          {v ? v.toLocaleString('es-CO') : '—'}
        </span>
      );
    },
  },
];

export function MunicipiosList() {
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('');
  const [selected, setSelected] = useState<Municipio | null>(null);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['municipios', search, zone, offset],
    queryFn: () => municipiosApi.list({ q: search || undefined, zone: zone || undefined, limit: 50, offset }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-display" style={{ color: 'var(--carbon-900)' }}>
          Municipios
        </h1>
        <span className="text-[12px]" style={{ color: 'color-mix(in oklab, var(--carbon-900) 45%, transparent)' }}>
          {data?.total ?? 0} municipios
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'color-mix(in oklab, var(--carbon-900) 35%, transparent)' }} />
          <input
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--carbon-900)' }}
            placeholder="Buscar municipio..."
            value={search}
            onChange={e => { setSearch(e.target.value); setOffset(0); }}
          />
        </div>
        <select
          className="text-[13px] rounded px-3 py-2"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--carbon-900)' }}
          value={zone}
          onChange={e => { setZone(e.target.value); setOffset(0); }}
        >
          <option value="">Todas las zonas</option>
          {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          onRowClick={setSelected}
          emptyTitle="Sin municipios"
        />
      </div>

      {data && data.total > 50 && (
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setOffset(Math.max(0, offset - 50))} disabled={offset === 0}
            className="px-3 py-1.5 text-[13px] rounded disabled:opacity-40"
            style={{ border: '1px solid var(--border)' }}>← Anterior</button>
          <button onClick={() => setOffset(offset + 50)} disabled={offset + 50 >= (data?.total ?? 0)}
            className="px-3 py-1.5 text-[13px] rounded disabled:opacity-40"
            style={{ border: '1px solid var(--border)' }}>Siguiente →</button>
        </div>
      )}

      {selected && (
        <MunicipioDrawer municipio={selected} onClose={() => { setSelected(null); refetch(); }} />
      )}
    </div>
  );
}
