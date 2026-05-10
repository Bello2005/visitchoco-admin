import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-zinc-600">{label}</label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900',
          'placeholder:text-zinc-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atrato-600 focus-visible:ring-offset-1',
          'disabled:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60',
          error && 'border-red-400 focus-visible:ring-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
