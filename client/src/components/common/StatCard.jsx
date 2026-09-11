import CountUp from './CountUp';

export default function StatCard({
  label,
  value,
  suffix = '',
  prefix = '',
  delta,
  deltaLabel = '',
  icon: Icon,
  decimals = 0,
  className = '',
}) {
  const isPositiveDelta = delta > 0;
  const isNegativeDelta = delta < 0;

  return (
    <div className={`surface p-5 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="metric-label">{label}</span>
        {Icon && (
          <Icon className="w-4 h-4 text-text-muted" />
        )}
      </div>
      <div className="metric-value text-3xl text-text-primary">
        <CountUp end={value} decimals={decimals} suffix={suffix} prefix={prefix} />
      </div>
      {delta !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-medium ${
              isPositiveDelta ? 'text-success' : isNegativeDelta ? 'text-error' : 'text-text-muted'
            }`}
          >
            {isPositiveDelta ? '+' : ''}
            {delta}
            {suffix}
          </span>
          {deltaLabel && (
            <span className="text-xs text-text-muted">{deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
