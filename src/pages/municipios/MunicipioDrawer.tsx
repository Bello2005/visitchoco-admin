import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { municipiosApi, type Municipio } from '@/api/municipios';
import { EntityDrawer } from '@/components/entity/EntityDrawer';
import { ImageUploader } from '@/components/form/ImageUploader';
import { MapPicker } from '@/components/form/MapPicker';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/providers/ToastProvider';
import type { MediaAsset } from '@/api/establecimientos';

const schema = z.object({
  name:          z.string().min(2).max(100),
  description:   z.string().max(3000).optional().nullable(),
  main_activity: z.string().max(200).optional().nullable(),
  emoji:         z.string().max(10).optional().nullable(),
  zone:          z.string().max(100).optional().nullable(),
});
type Form = z.infer<typeof schema>;

const TABS = ['Info', 'Fotos', 'Mapa'] as const;
type Tab = typeof TABS[number];

export function MunicipioDrawer({ municipio: initial, onClose }: { municipio: Municipio; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('Info');
  const [coords, setCoords] = useState({ lat: initial.lat, lng: initial.lon });
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const { data, refetch: refetchDetail } = useQuery({
    queryKey: ['municipio', initial.id],
    queryFn: () => municipiosApi.get(initial.id),
  });

  const mun = data?.municipio ?? initial;
  const media = (data?.media ?? []) as MediaAsset[];

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: mun.name, description: mun.description, main_activity: mun.main_activity, emoji: mun.emoji, zone: mun.zone },
  });

  const mutation = useMutation({
    mutationFn: (d: Partial<Municipio>) => municipiosApi.update(initial.id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['municipios'] }); success('Guardado'); },
    onError: () => toastError('Error al guardar'),
  });

  return (
    <EntityDrawer open onClose={onClose} title={`${mun.emoji ?? ''} ${mun.name}`} subtitle={mun.zone ?? ''} width="lg">
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-3 text-[13px] font-medium border-b-2 transition-colors"
            style={{
              borderColor: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? 'var(--accent-fg)' : 'color-mix(in oklab, var(--carbon-900) 55%, transparent)',
            }}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === 'Info' && (
          <form onSubmit={handleSubmit(d => mutation.mutate(d as Partial<Municipio>))} className="space-y-4">
            <div className="flex gap-3">
              <div className="w-20"><Input label="Emoji" {...register('emoji')} /></div>
              <div className="flex-1"><Input label="Nombre" error={errors.name?.message} {...register('name')} /></div>
            </div>
            <Input label="Zona" {...register('zone')} />
            <Input label="Actividad principal" {...register('main_activity')} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>Descripción</label>
              <textarea className="w-full rounded px-3 py-2 text-[13px] resize-none focus-visible:outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--carbon-900)' }}
                rows={5} {...register('description')} />
            </div>
            <Button type="submit" loading={mutation.isPending} disabled={!isDirty}>Guardar cambios</Button>
          </form>
        )}

        {tab === 'Fotos' && (
          <ImageUploader entidadTipo="municipio" entidadId={String(initial.id)} assets={media} onUpdate={refetchDetail} />
        )}

        {tab === 'Mapa' && (
          <div className="space-y-4">
            <MapPicker lat={coords.lat} lng={coords.lng} onChange={c => setCoords({ lat: c.lat, lng: c.lng })} />
            <Button onClick={() => mutation.mutate({ lat: coords.lat ?? undefined, lon: coords.lng ?? undefined })} loading={mutation.isPending}>
              Guardar ubicación
            </Button>
          </div>
        )}
      </div>
    </EntityDrawer>
  );
}
