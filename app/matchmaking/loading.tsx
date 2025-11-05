export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="w-full bg-card border-border rounded-lg border p-4 sm:p-6 animate-pulse">
        <div className="flex items-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-muted" />
              <div className="mt-2 space-y-1">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-32 hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 bg-muted rounded w-48" />
          <div className="h-9 bg-muted rounded w-32" />
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
