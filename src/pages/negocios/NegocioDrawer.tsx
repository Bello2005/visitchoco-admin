import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { establecimientosApi, type Establecimiento, type MediaAsset } from '@/api/establecimientos';
import { EntityDrawer } from '@/components/entity/EntityDrawer';
import { ImageUploader } from '@/components/form/ImageUploader';
import { MapPicker } from '@/components/form/MapPicker';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/providers/ToastProvider';
import { useAuth } from '@/providers/AuthProvider';
import { isOwner } from '@/lib/permissions';

const editSchema = z.object({
  nombre: z.string().min(2).max(200),
  descripcion: z.string().max(2000).optional().nullable(),
  telefono: z.string().max(50).optional().nullable(),
  email: z.string().email().optional().nullable(),
  whatsapp: z.string().max(50).optional().nullable(),
  sitio_web: z.string().url().optional().nullable(),
  direccion: z.string().max(500).optional().nullable(),
});

type EditForm = z.infer<typeof editSchema>;

interface NegocioDrawerProps {
  establecimiento: Establecimiento;
  onClose: () => void;
}

const TABS = ['Info', 'Fotos', 'Ubicación'] as const;
type Tab = typeof TABS[number];

export function NegocioDrawer({ establecimiento: initial, onClose }: NegocioDrawerProps) {
  const [tab, setTab] = useState<Tab>('Info');
  const [coords, setCoords] = useState({ lat: initial.lat, lng: initial.lng });
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const { data, refetch: refetchDetail } = useQuery({
    queryKey: ['establecimiento-detail', initial.id],
    queryFn: () => establecimientosApi.get(initial.id),
  });

  const estab = data?.establecimiento ?? initial;
  const media: MediaAsset[] = (data?.media ?? []) as MediaAsset[];

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      nombre: estab.nombre,
      descripcion: estab.descripcion,
      telefono: estab.telefono,
      email: estab.email,
      whatsapp: estab.whatsapp,
      sitio_web: estab.sitio_web,
      direccion: estab.direccion,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData: Partial<Establecimiento>) =>
      establecimientosApi.update(initial.id, formData),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['establecimientos'] });
      if (result.en_revision) {
        success('Cambios enviados', 'Están en revisión y serán aplicados cuando sean aprobados.');
      } else {
        success('Cambios guardados');
      }
    },
    onError: () => toastError('Error al guardar'),
  });

  const onSubmit = (formData: EditForm) => {
    updateMutation.mutate(formData as Partial<Establecimiento>);
  };

  const saveLocation = () => {
    if (coords.lat && coords.lng) {
      updateMutation.mutate({ lat: coords.lat, lng: coords.lng });
    }
  };

  return (
    <EntityDrawer
      open
      onClose={onClose}
      title={estab.nombre}
      subtitle={`${estab.categoria.replace('_', ' ')} · ${estab.municipio_nombre ?? ''}`}
      width="lg"
    >
      {/* Tabs */}
      <div className="flex border-b border-zinc-100 px-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-atrato-700 text-atrato-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Banner en revisión */}
        {isOwner(user) && (
          <div className="mb-4 rounded-lg bg-chirimia-50 border border-chirimia-200 px-4 py-3 text-sm text-chirimia-800">
            Tus cambios se enviarán a revisión antes de publicarse.
          </div>
        )}

        {/* Estados */}
        <div className="flex gap-2 mb-5">
          {estab.verificado && <Badge variant="success">Verificado</Badge>}
          {estab.reclamado && <Badge variant="info">Reclamado</Badge>}
          {estab.tiene_cambios_pendientes && <Badge variant="warning">Cambios pendientes</Badge>}
          {!estab.activo && <Badge variant="default">Inactivo</Badge>}
        </div>

        {/* Tab: Info */}
        {tab === 'Info' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Nombre" error={errors.nombre?.message} {...register('nombre')} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-600">Descripción</label>
              <textarea
                className="w-full rounded border border-zinc-200 px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atrato-600"
                rows={4}
                {...register('descripcion')}
              />
            </div>
            <Input label="Teléfono" error={errors.telefono?.message} {...register('telefono')} />
            <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
            <Input label="WhatsApp" error={errors.whatsapp?.message} {...register('whatsapp')} />
            <Input label="Sitio web" type="url" error={errors.sitio_web?.message} {...register('sitio_web')} />
            <Input label="Dirección" error={errors.direccion?.message} {...register('direccion')} />
            <Button
              type="submit"
              loading={updateMutation.isPending}
              disabled={!isDirty}
            >
              Guardar cambios
            </Button>
          </form>
        )}

        {/* Tab: Fotos */}
        {tab === 'Fotos' && (
          <ImageUploader
            entidadTipo="establecimiento"
            entidadId={initial.id}
            assets={media}
            onUpdate={refetchDetail}
          />
        )}

        {/* Tab: Ubicación */}
        {tab === 'Ubicación' && (
          <div className="space-y-4">
            <MapPicker
              lat={coords.lat}
              lng={coords.lng}
              onChange={setCoords}
            />
            <Button
              onClick={saveLocation}
              loading={updateMutation.isPending}
              disabled={!coords.lat || !coords.lng}
            >
              Guardar ubicación
            </Button>
          </div>
        )}
      </div>
    </EntityDrawer>
  );
}
