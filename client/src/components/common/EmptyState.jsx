export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-bg-surface-alt border border-border flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-text-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
