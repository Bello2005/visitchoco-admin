import { cn } from '@/lib/cn';
import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        {
          'bg-zinc-100 text-zinc-700': variant === 'default',
          'bg-atrato-100 text-atrato-800': variant === 'success',
          'bg-chirimia-100 text-chirimia-800': variant === 'warning',
          'bg-red-100 text-red-700': variant === 'error',
          'bg-blue-100 text-blue-700': variant === 'info',
          'border border-zinc-200 bg-white text-zinc-600': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
