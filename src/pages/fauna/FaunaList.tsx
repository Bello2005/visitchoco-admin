import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { faunaApi, type Animal } from '@/api/fauna';
import { DataTable } from '@/components/data/DataTable';
import { FaunaDrawer } from './FaunaDrawer';

const columns: ColumnDef<Animal, unknown>[] = [
  {
    accessorKey: 'common_name',
    header: 'Nombre común',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.image_url && (
          <img src={row.original.image_url} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0" />
        )}
        <div>
          <p className="text-[13px] font-medium" style={{ color: 'var(--carbon-900)' }}>{row.original.common_name}</p>
          {row.original.scientific_name && (
            <p className="text-[11px] italic" style={{ color: 'color-mix(in oklab, var(--carbon-900) 45%, transparent)' }}>
              {row.original.scientific_name}
            </p>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'municipality_name',
    header: 'Municipio',
    cell: ({ getValue }) => (
      <span className="text-[12px]" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>
        {getValue() as string ?? '—'}
      </span>
    ),
  },
];

export function FaunaList() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Animal | null>(null);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['fauna', search, offset],
    queryFn: () => faunaApi.list({ q: search || undefined, limit: 50, offset }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-display" style={{ color: 'var(--carbon-900)' }}>Fauna</h1>
        <span className="text-[12px]" style={{ color: 'color-mix(in oklab, var(--carbon-900) 45%, transparent)' }}>
          {data?.total ?? 0} especies
        </span>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'color-mix(in oklab, var(--carbon-900) 35%, transparent)' }} />
          <input
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--carbon-900)' }}
            placeholder="Buscar especie..."
            value={search}
            onChange={e => { setSearch(e.target.value); setOffset(0); }}
          />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          onRowClick={setSelected}
          emptyTitle="Sin fauna registrada"
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

      {selected && <FaunaDrawer animal={selected} onClose={() => { setSelected(null); refetch(); }} />}
    </div>
  );
}
