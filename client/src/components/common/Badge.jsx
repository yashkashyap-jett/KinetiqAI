export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-bg-surface-alt text-text-secondary border-border',
    accent: 'bg-accent-muted text-accent-text border-accent/20',
    success: 'bg-success-muted text-success border-success/20',
    warning: 'bg-warning-muted text-warning border-warning/20',
    error: 'bg-error-muted text-error border-error/20',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium
        rounded-[var(--radius-sm)] border
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
