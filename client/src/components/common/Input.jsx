import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-3 py-2.5 rounded-[var(--radius-md)]
          bg-bg-surface border border-border
          text-text-primary text-sm placeholder-text-muted
          transition-colors duration-150
          hover:border-border-hover
          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-error focus:border-error focus:ring-error/30' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
