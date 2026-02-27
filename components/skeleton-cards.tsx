export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
          <div className="h-4 w-2/3 rounded bg-secondary mb-3" />
          <div className="h-3 w-full rounded bg-secondary/60 mb-2" />
          <div className="h-3 w-4/5 rounded bg-secondary/60 mb-4" />
          <div className="h-8 w-1/3 rounded bg-secondary" />
        </div>
      ))}
    </div>
  )
}
