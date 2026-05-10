import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { establecimientosApi, type Establecimiento } from '@/api/establecimientos';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { NegocioDrawer } from './NegocioDrawer';

function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useCallback(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay])();
  return debouncedValue;
}

const CATEGORIAS = [
  { value: '', label: 'Todas las categorías' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'fritanga', label: 'Fritanga' },
  { value: 'agencia_viajes', label: 'Agencia de viajes' },
  { value: 'guia_turismo', label: 'Guía de turismo' },
  { value: 'pasteleria', label: 'Pastelería' },
  { value: 'viche_licores', label: 'Viche & licores' },
  { value: 'otro', label: 'Otro' },
];

const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'verificado', label: 'Verificado' },
];

const columns: ColumnDef<Establecimiento, unknown>[] = [
  {
    accessorKey: 'nombre',
    header: 'Negocio',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.foto_url && (
          <img
            src={row.original.foto_url}
            alt=""
            className="w-8 h-8 rounded object-cover flex-shrink-0"
          />
        )}
        <div>
          <p className="font-medium text-zinc-900 text-sm">{row.original.nombre}</p>
          <p className="text-xs text-zinc-400 capitalize">{row.original.categoria.replace('_', ' ')}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'municipio_nombre',
    header: 'Municipio',
    cell: ({ getValue }) => <span className="text-sm">{getValue() as string ?? '—'}</span>,
  },
  {
    accessorKey: 'activo',
    header: 'Estado',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {!row.original.activo && <Badge variant="default">Inactivo</Badge>}
        {row.original.verificado && <Badge variant="success">Verificado</Badge>}
        {row.original.reclamado && <Badge variant="info">Reclamado</Badge>}
        {row.original.tiene_cambios_pendientes && <Badge variant="warning">Pendiente</Badge>}
      </div>
    ),
  },
  {
    accessorKey: 'telefono',
    header: 'Teléfono',
    cell: ({ getValue }) => <span className="text-sm font-mono">{getValue() as string ?? '—'}</span>,
  },
];

export function NegociosList() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [selected, setSelected] = useState<Establecimiento | null>(null);
  const [offset, setOffset] = useState(0);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['establecimientos', debouncedSearch, categoria, estado, offset],
    queryFn: () => establecimientosApi.list({ q: debouncedSearch, categoria: categoria || undefined, estado: estado || undefined, limit: 50, offset }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 font-display">Negocios</h1>
        <span className="text-sm text-zinc-400">{data?.total ?? 0} registros</span>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atrato-600"
            placeholder="Buscar negocio..."
            value={search}
            onChange={e => { setSearch(e.target.value); setOffset(0); }}
          />
        </div>
        <select
          className="text-sm border border-zinc-200 rounded px-3 py-2 focus-visible:outline-none"
          value={categoria}
          onChange={e => { setCategoria(e.target.value); setOffset(0); }}
        >
          {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select
          className="text-sm border border-zinc-200 rounded px-3 py-2 focus-visible:outline-none"
          value={estado}
          onChange={e => { setEstado(e.target.value); setOffset(0); }}
        >
          {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200">
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          onRowClick={row => setSelected(row)}
          emptyTitle="Sin negocios"
          emptyDescription="No hay establecimientos con esos filtros."
        />
      </div>

      {/* Paginación simple */}
      {data && data.total > 50 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setOffset(Math.max(0, offset - 50))}
            disabled={offset === 0}
            className="px-3 py-1.5 text-sm border rounded disabled:opacity-40"
          >
            ← Anterior
          </button>
          <button
            onClick={() => setOffset(offset + 50)}
            disabled={offset + 50 >= data.total}
            className="px-3 py-1.5 text-sm border rounded disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}

      {selected && (
        <NegocioDrawer
          establecimiento={selected}
          onClose={() => { setSelected(null); refetch(); }}
        />
      )}
    </div>
  );
}
