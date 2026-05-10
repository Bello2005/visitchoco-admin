import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type DrawerWidth = 'md' | 'lg' | 'xl';

interface EntityDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: DrawerWidth;
  footer?: ReactNode;
}

const WIDTH_MAP: Record<DrawerWidth, string> = {
  md: 'max-w-[480px]',
  lg: 'max-w-[640px]',
  xl: 'max-w-[800px]',
};

export function EntityDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 'lg',
  footer,
}: EntityDrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={v => !v && onClose()}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-drawer bg-zinc-950/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                className={cn(
                  'fixed right-0 top-0 bottom-0 z-drawer w-full bg-white shadow-xl',
                  'flex flex-col',
                  WIDTH_MAP[width]
                )}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-4 flex-shrink-0">
                  <div>
                    <DialogPrimitive.Title className="text-sm font-semibold text-zinc-900">
                      {title}
                    </DialogPrimitive.Title>
                    {subtitle && (
                      <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 rounded p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
                    aria-label="Cerrar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="border-t border-zinc-100 px-6 py-4 flex-shrink-0">
                    {footer}
                  </div>
                )}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
