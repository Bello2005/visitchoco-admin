import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/providers/ToastProvider';
import { UserPlus } from 'lucide-react';
import { timeAgo } from '@/lib/format';

interface User {
  id: string;
  email: string;
  nombre: string | null;
  estado: string;
  role: string;
  ultimo_login_at: string | null;
  created_at: string;
}

const inviteSchema = z.object({
  email: z.string().email(),
  role_slug: z.enum(['editor_institucional', 'dueno_negocio']),
  mensaje_personal: z.string().max(500).optional(),
});
type InviteForm = z.infer<typeof inviteSchema>;

export function UsuariosPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiFetch<{ items: User[] }>('/users'),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role_slug: 'editor_institucional' },
  });

  const inviteMutation = useMutation({
    mutationFn: (data: InviteForm) => apiFetch('/users/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setInviteOpen(false);
      reset();
      success('Invitación enviada');
    },
    onError: () => toastError('Error al enviar invitación'),
  });

  const ROLE_LABELS: Record<string, string> = {
    super_admin: 'Super Admin',
    editor_institucional: 'Editor',
    dueno_negocio: 'Dueño',
  };

  const ESTADO_VARIANTS: Record<string, 'success' | 'default' | 'error'> = {
    activo: 'success',
    suspendido: 'error',
    eliminado: 'default',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 font-display">Usuarios</h1>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-3.5 w-3.5" />
          Invitar
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
          {data?.items.map(user => (
            <div key={user.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-zinc-900">{user.nombre ?? user.email}</p>
                {user.nombre && <p className="text-xs text-zinc-400">{user.email}</p>}
                {user.ultimo_login_at && (
                  <p className="text-xs text-zinc-400">Último acceso: {timeAgo(user.ultimo_login_at)}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{ROLE_LABELS[user.role] ?? user.role}</Badge>
                <Badge variant={ESTADO_VARIANTS[user.estado] ?? 'default'}>{user.estado}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invitar usuario">
        <form onSubmit={handleSubmit(d => inviteMutation.mutate(d))} className="space-y-4">
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-600">Rol</label>
            <select className="rounded border border-zinc-200 px-3 py-2 text-sm" {...register('role_slug')}>
              <option value="editor_institucional">Editor Institucional</option>
              <option value="dueno_negocio">Dueño de Negocio</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-600">Mensaje personal (opcional)</label>
            <textarea
              className="rounded border border-zinc-200 px-3 py-2 text-sm resize-none"
              rows={2}
              {...register('mensaje_personal')}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setInviteOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" type="submit" loading={isSubmitting}>
              Enviar invitación
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
