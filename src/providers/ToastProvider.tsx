import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '@/lib/cn';

type ToastVariant = 'default' | 'success' | 'error';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => undefined,
  success: () => undefined,
  error: () => undefined,
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...opts, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const success = useCallback((title: string, description?: string) =>
    addToast({ title, description, variant: 'success' }), [addToast]);

  const error = useCallback((title: string, description?: string) =>
    addToast({ title, description, variant: 'error' }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error }}>
      <ToastPrimitive.Provider>
        {children}
        {toasts.map(t => (
          <ToastPrimitive.Root
            key={t.id}
            className={cn(
              'fixed bottom-4 right-4 z-toast flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg',
              'bg-white border-zinc-200 text-zinc-900',
              'data-[state=open]:animate-fade-in',
              t.variant === 'success' && 'border-atrato-200 bg-atrato-50',
              t.variant === 'error' && 'border-red-200 bg-red-50'
            )}
            open
          >
            <div>
              <ToastPrimitive.Title className="text-sm font-semibold">{t.title}</ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="text-xs text-zinc-500 mt-0.5">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
