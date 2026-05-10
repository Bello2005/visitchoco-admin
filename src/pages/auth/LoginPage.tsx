import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/api/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({ email: z.string().email('Email inválido') });
type Form = z.infer<typeof schema>;

export function LoginPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    await authApi.sendMagicLink(data.email);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="max-w-sm w-full mx-4 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-atrato-100 text-atrato-700 mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-zinc-900 font-display">Revisa tu email</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Enviamos un enlace de acceso a <strong>{getValues('email')}</strong>. Expira en 15 minutos.
            </p>
          </div>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-atrato-600 hover:underline"
          >
            Usar otro email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="max-w-sm w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full border-2 border-atrato-700 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-atrato-700" />
            </div>
            <span className="font-display font-semibold text-zinc-900">VisitChocó</span>
            <span className="text-xs text-zinc-400">Admin</span>
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">Iniciar sesión</h1>
          <p className="text-sm text-zinc-500 mt-1">Te enviamos un enlace — sin contraseña.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Enviar enlace de acceso
          </Button>
        </form>
      </div>
    </div>
  );
}
