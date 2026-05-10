import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, type MeResponse } from '@/api/auth';
import { tokenStore, setUnauthorizedHandler } from '@/api/client';

export interface AdminUser {
  id: string;
  email: string;
  nombre: string | null;
  role: string;
  permisos: string[];
  establecimientos: MeResponse['establecimientos'];
}

interface AuthContextValue {
  user: AdminUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: async () => undefined,
  refetch: () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-me'],
    queryFn: authApi.me,
    enabled: !!tokenStore.get(),
    retry: false,
  });

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    tokenStore.clear();
    queryClient.clear();
    navigate('/auth/login');
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      queryClient.clear();
      navigate('/auth/login');
    });
  }, [queryClient, navigate]);

  // Logout en otra pestaña
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'visitchoco_admin_token' && !e.newValue) {
        queryClient.clear();
        navigate('/auth/login');
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [queryClient, navigate]);

  const user: AdminUser | null = data
    ? {
        id: data.user.id,
        email: data.user.email,
        nombre: data.user.nombre,
        role: data.user.role,
        permisos: data.user.permisos,
        establecimientos: data.establecimientos,
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
