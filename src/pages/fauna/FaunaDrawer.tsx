import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { faunaApi, type Animal } from '@/api/fauna';
import { EntityDrawer } from '@/components/entity/EntityDrawer';
import { ImageUploader } from '@/components/form/ImageUploader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/providers/ToastProvider';
import type { MediaAsset } from '@/api/establecimientos';

const schema = z.object({
  common_name:     z.string().min(2).max(100),
  scientific_name: z.string().max(150).optional().nullable(),
  description:     z.string().max(3000).optional().nullable(),
});
type Form = z.infer<typeof schema>;

const TABS = ['Info', 'Foto'] as const;
type Tab = typeof TABS[number];

export function FaunaDrawer({ animal: initial, onClose }: { animal: Animal; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('Info');
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const { data, refetch: refetchDetail } = useQuery({
    queryKey: ['fauna-detail', initial.id],
    queryFn: () => faunaApi.get(initial.id),
  });

  const animal = data?.animal ?? initial;
  const media = (data?.media ?? []) as MediaAsset[];

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { common_name: animal.common_name, scientific_name: animal.scientific_name, description: animal.description },
  });

  const mutation = useMutation({
    mutationFn: (d: Partial<Animal>) => faunaApi.update(initial.id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fauna'] }); success('Guardado'); },
    onError: () => toastError('Error al guardar'),
  });

  return (
    <EntityDrawer open onClose={onClose} title={animal.common_name} subtitle={animal.scientific_name ?? ''} width="md">
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
          <form onSubmit={handleSubmit(d => mutation.mutate(d as Partial<Animal>))} className="space-y-4">
            <Input label="Nombre común" error={errors.common_name?.message} {...register('common_name')} />
            <Input label="Nombre científico" {...register('scientific_name')} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'color-mix(in oklab, var(--carbon-900) 55%, transparent)' }}>Descripción</label>
              <textarea className="w-full rounded px-3 py-2 text-[13px] resize-none focus-visible:outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--carbon-900)' }}
                rows={5} {...register('description')} />
            </div>
            <Button type="submit" loading={mutation.isPending} disabled={!isDirty}>Guardar</Button>
          </form>
        )}

        {tab === 'Foto' && (
          <ImageUploader entidadTipo="fauna" entidadId={String(initial.id)} assets={media} onUpdate={refetchDetail} />
        )}
      </div>
    </EntityDrawer>
  );
}
