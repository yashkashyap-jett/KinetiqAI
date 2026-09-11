export default function SkeletonLoader({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="surface p-5 space-y-3">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-8 w-16" />
      <div className="skeleton h-3 w-32" />
    </div>
  );
}

export function SkeletonList({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="surface p-4 flex items-center gap-4">
          <div className="skeleton h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
