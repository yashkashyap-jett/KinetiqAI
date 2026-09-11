import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-hover focus:ring-accent/30',
  secondary:
    'bg-bg-surface-alt text-text-primary border border-border hover:border-border-hover hover:bg-bg-surface-active',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-bg-surface-alt',
  danger:
    'bg-error text-white hover:bg-red-600 focus:ring-error/30',
  accent:
    'bg-accent-muted text-accent-text border border-accent/20 hover:bg-accent/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

const Button = forwardRef(
  ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 font-medium
          rounded-[var(--radius-md)] transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
