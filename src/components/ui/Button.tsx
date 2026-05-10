import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'h-8 px-3 text-[12.5px] rounded': size === 'sm',
          'h-9 px-4 text-[13px] rounded': size === 'md',
          'h-11 px-5 text-[14px] rounded-md': size === 'lg',
        },
        {
          'bg-carbon-900 text-white hover:opacity-90': variant === 'primary',
          'bg-surface text-carbon-900 border hover:bg-carbon-900/5': variant === 'secondary',
          'text-carbon-900/70 hover:bg-carbon-900/5 hover:text-carbon-900': variant === 'ghost',
          'bg-chirimia-500 text-white hover:bg-chirimia-600': variant === 'danger',
        },
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
