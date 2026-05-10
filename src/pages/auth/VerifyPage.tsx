import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { tokenStore } from '@/api/client';
import { useQueryClient } from '@tanstack/react-query';

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Token inválido');
      return;
    }

    authApi.verify(token).then(result => {
      if (!result.ok || !result.accessToken) {
        setError('El enlace expiró o ya fue usado');
        return;
      }
      tokenStore.set(result.accessToken);
      queryClient.invalidateQueries({ queryKey: ['admin-me'] });
      navigate('/dashboard', { replace: true });
    }).catch(() => {
      setError('Error al verificar el enlace');
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        {error ? (
          <div>
            <p className="text-zinc-700 font-medium">{error}</p>
            <a href="/auth/login" className="mt-2 block text-sm text-atrato-600 hover:underline">
              Solicitar nuevo enlace
            </a>
          </div>
        ) : (
          <div>
            <div className="h-6 w-6 border-2 border-atrato-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-zinc-500">Verificando...</p>
          </div>
        )}
      </div>
    </div>
  );
}
