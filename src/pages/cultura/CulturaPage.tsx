import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { culturaApi, type Patrimonio, type Fiesta } from '@/api/cultura';
import { DataTable } from '@/components/data/DataTable';
import { EntityDrawer } from '@/components/entity/EntityDrawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/providers/ToastProvider';

const MESES = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ─── Patrimonio ────────────────────────────────────────────────────────────────

const patrimonioSchema = z.object({
  ambito:      z.string().max(200).optional().nullable(),
  descripcion: z.string().max(3000).optional().nullable(),
});

const patrimonioColumns: ColumnDef<Patrimonio, unknown>[] = [
  {
    accessorKey: 'ambito',
    header: 'Ámbito',
    cell: ({ getValue }) => <span className="text-[13px] font-medium" style={{ color: 'var(--carbon-900)' }}>{getValue() as string ?? '—'}</span>,
  },
  {
    accessorKey: 'municipio_nombre',
    header: 'Municipio',
    cell: ({ getValue }) => <span className="text-[12px]" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>{getValue() as string}</span>,
  },
];

function PatrimonioDrawer({ item, onClose }: { item: Patrimonio; onClose: () => void }) {
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { isDirty } } = useForm({
    resolver: zodResolver(patrimonioSchema),
    defaultValues: { ambito: item.ambito, descripcion: item.descripcion },
  });
  const mutation = useMutation({
    mutationFn: (d: Partial<Patrimonio>) => culturaApi.updatePatrimonio(item.id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['patrimonio'] }); success('Guardado'); },
    onError: () => toastError('Error al guardar'),
  });

  return (
    <EntityDrawer open onClose={onClose} title={item.ambito ?? 'Patrimonio'} subtitle={item.municipio_nombre} width="md">
      <div className="p-6">
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
          <Input label="Ámbito" {...register('ambito')} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>Descripción</label>
            <textarea className="w-full rounded px-3 py-2 text-[13px] resize-none focus-visible:outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--carbon-900)' }}
              rows={6} {...register('descripcion')} />
          </div>
          <Button type="submit" loading={mutation.isPending} disabled={!isDirty}>Guardar</Button>
        </form>
      </div>
    </EntityDrawer>
  );
}

// ─── Fiestas ───────────────────────────────────────────────────────────────────

const fiestaSchema = z.object({
  municipio_nombre: z.string().max(100).optional(),
  mes:              z.coerce.number().int().min(1).max(12).optional(),
  fecha_inicio_dia: z.coerce.number().int().min(1).max(31).optional().nullable(),
  descripcion:      z.string().max(2000).optional().nullable(),
});

const fiestaColumns: ColumnDef<Fiesta, unknown>[] = [
  {
    accessorKey: 'municipio_nombre',
    header: 'Municipio',
    cell: ({ getValue }) => <span className="text-[13px] font-medium" style={{ color: 'var(--carbon-900)' }}>{getValue() as string}</span>,
  },
  {
    accessorKey: 'mes',
    header: 'Mes',
    cell: ({ getValue }) => <span className="text-[12px]" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>{MESES[getValue() as number] ?? '—'}</span>,
  },
  {
    accessorKey: 'fecha_inicio_dia',
    header: 'Día',
    cell: ({ getValue }) => <span className="text-[12px] font-mono" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>{getValue() as number ?? '—'}</span>,
  },
];

function FiestaDrawer({ item, onClose }: { item: Fiesta; onClose: () => void }) {
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { isDirty } } = useForm({
    resolver: zodResolver(fiestaSchema),
    defaultValues: { municipio_nombre: item.municipio_nombre, mes: item.mes, fecha_inicio_dia: item.fecha_inicio_dia, descripcion: item.descripcion },
  });
  const mutation = useMutation({
    mutationFn: (d: Partial<Fiesta>) => culturaApi.updateFiesta(item.id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fiestas'] }); success('Guardado'); },
    onError: () => toastError('Error al guardar'),
  });

  return (
    <EntityDrawer open onClose={onClose} title={item.municipio_nombre} subtitle={MESES[item.mes] ?? ''} width="md">
      <div className="p-6">
        <form onSubmit={handleSubmit(d => mutation.mutate(d as Partial<Fiesta>))} className="space-y-4">
          <Input label="Municipio" {...register('municipio_nombre')} />
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>Mes</label>
              <select className="rounded px-3 py-2 text-[13px]"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--carbon-900)' }}
                {...register('mes')}>
                {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div className="w-24">
              <Input label="Día inicio" type="number" min={1} max={31} {...register('fecha_inicio_dia')} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>Descripción</label>
            <textarea className="w-full rounded px-3 py-2 text-[13px] resize-none focus-visible:outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--carbon-900)' }}
              rows={4} {...register('descripcion')} />
          </div>
          <Button type="submit" loading={mutation.isPending} disabled={!isDirty}>Guardar</Button>
        </form>
      </div>
    </EntityDrawer>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────

type MainTab = 'patrimonio' | 'fiestas';

export function CulturaPage() {
  const [tab, setTab] = useState<MainTab>('patrimonio');
  const [search, setSearch] = useState('');
  const [selectedP, setSelectedP] = useState<Patrimonio | null>(null);
  const [selectedF, setSelectedF] = useState<Fiesta | null>(null);

  const patrimonioQ = useQuery({
    queryKey: ['patrimonio', search],
    queryFn: () => culturaApi.listPatrimonio({ q: search || undefined, limit: 100 }),
    enabled: tab === 'patrimonio',
  });

  const fiestasQ = useQuery({
    queryKey: ['fiestas', search],
    queryFn: () => culturaApi.listFiestas({ q: search || undefined, limit: 100 }),
    enabled: tab === 'fiestas',
  });

  const total = tab === 'patrimonio' ? (patrimonioQ.data?.total ?? 0) : (fiestasQ.data?.total ?? 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-display" style={{ color: 'var(--carbon-900)' }}>Cultura</h1>
        <span className="text-[12px]" style={{ color: 'color-mix(in oklab, var(--carbon-900) 45%, transparent)' }}>{total} registros</span>
      </div>

      {/* Tabs principales */}
      <div className="flex mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
        {(['patrimonio','fiestas'] as MainTab[]).map(t => (
          <button key={t} onClick={() => { setTab(t); setSearch(''); }}
            className="px-5 py-2.5 text-[13px] font-medium border-b-2 capitalize transition-colors"
            style={{
              borderColor: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? 'var(--accent-fg)' : 'color-mix(in oklab, var(--carbon-900) 55%, transparent)',
            }}>
            {t === 'patrimonio' ? 'Patrimonio inmaterial' : 'Fiestas patronales'}
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      <div className="relative max-w-xs mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'color-mix(in oklab, var(--carbon-900) 35%, transparent)' }} />
        <input
          className="w-full pl-9 pr-3 py-2 text-[13px] rounded"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--carbon-900)' }}
          placeholder={tab === 'patrimonio' ? 'Buscar ámbito...' : 'Buscar municipio...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        {tab === 'patrimonio' ? (
          <DataTable data={patrimonioQ.data?.items ?? []} columns={patrimonioColumns}
            loading={patrimonioQ.isLoading} onRowClick={setSelectedP}
            emptyTitle="Sin patrimonio registrado" />
        ) : (
          <DataTable data={fiestasQ.data?.items ?? []} columns={fiestaColumns}
            loading={fiestasQ.isLoading} onRowClick={setSelectedF}
            emptyTitle="Sin fiestas registradas" />
        )}
      </div>

      {selectedP && <PatrimonioDrawer item={selectedP} onClose={() => { setSelectedP(null); patrimonioQ.refetch(); }} />}
      {selectedF && <FiestaDrawer item={selectedF} onClose={() => { setSelectedF(null); fiestasQ.refetch(); }} />}
    </div>
  );
}
