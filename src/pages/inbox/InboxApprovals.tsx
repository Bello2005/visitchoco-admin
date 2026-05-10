import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi, type ApprovalItem } from '@/api/approvals';
import { DiffViewer } from '@/components/approval/DiffViewer';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/providers/ToastProvider';
import { timeAgo } from '@/lib/format';
import { Inbox, Check, X } from 'lucide-react';

export function InboxApprovals() {
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['approvals'],
    queryFn: () => approvalsApi.list('pendiente'),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approvalsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['establecimientos'] });
      success('Cambio aprobado', 'Los cambios se aplicaron al establecimiento.');
    },
    onError: () => toastError('Error al aprobar'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, comentario }: { id: string; comentario: string }) =>
      approvalsApi.reject(id, comentario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      setRejectTarget(null);
      success('Cambio rechazado');
    },
    onError: () => toastError('Error al rechazar'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 font-display">Aprobaciones</h1>
        <span className="text-sm text-zinc-400">{data?.total ?? 0} pendientes</span>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      )}

      {!isLoading && data?.items.length === 0 && (
        <EmptyState
          icon={<Inbox className="h-12 w-12" />}
          title="Sin pendientes"
          description="No hay cambios esperando revisión."
        />
      )}

      <div className="space-y-4">
        {data?.items.map((item: ApprovalItem) => (
          <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {item.solicitante_nombre ?? item.solicitante_email}
                </p>
                <p className="text-xs text-zinc-400">
                  {item.entidad_tipo} · {timeAgo(item.created_at)}
                </p>
                {item.comentario_solicitante && (
                  <p className="mt-2 text-xs text-zinc-500 italic">
                    "{item.comentario_solicitante}"
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setRejectTarget(item.id)}
                >
                  <X className="h-3.5 w-3.5" />
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  loading={approveMutation.isPending}
                  onClick={() => approveMutation.mutate(item.id)}
                >
                  <Check className="h-3.5 w-3.5" />
                  Aprobar
                </Button>
              </div>
            </div>

            <DiffViewer antes={item.estado_anterior} despues={item.cambios} />

            {item.autoaprobacion_at && (
              <p className="mt-3 text-xs text-zinc-400">
                Auto-aprobación: {new Date(item.autoaprobacion_at).toLocaleDateString('es-CO')}
              </p>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={motivo => rejectMutation.mutate({ id: rejectTarget!, comentario: motivo ?? '' })}
        title="Rechazar cambio"
        description="El dueño recibirá una notificación con el motivo."
        confirmLabel="Rechazar"
        variant="danger"
        requireMotivo
        loading={rejectMutation.isPending}
      />
    </div>
  );
}
