interface MatchEntrySkeletonProps {
  className?: string;
}

export function MatchEntrySkeleton({ className }: MatchEntrySkeletonProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-shadow duration-200 p-3 sm:p-4 animate-pulse ${
        className || ""
      }`}
    >
      {/* Match header skeleton */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <div className="h-4 bg-muted rounded w-20"></div>
          <div className="h-4 bg-muted rounded w-1"></div>
          <div className="h-4 bg-muted rounded w-12"></div>
        </div>
        <div className="h-7 bg-muted rounded w-32"></div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {/* Team 100 skeleton */}
        <div className="space-y-2">
          {/* Team header skeleton */}
          <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
            <div className="h-4 bg-muted rounded w-16"></div>
            <div className="h-4 bg-muted rounded w-12"></div>
            <div className="h-4 bg-muted rounded w-8"></div>
          </div>

          {/* Player rows skeleton */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-2 p-2 bg-muted/30 rounded"
            >
              <div className="h-8 w-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-2 bg-muted rounded w-16"></div>
              </div>
              <div className="h-3 bg-muted rounded w-8"></div>
            </div>
          ))}
        </div>

        {/* Team 200 skeleton */}
        <div className="space-y-2">
          {/* Team header skeleton */}
          <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
            <div className="h-4 bg-muted rounded w-16"></div>
            <div className="h-4 bg-muted rounded w-12"></div>
            <div className="h-4 bg-muted rounded w-8"></div>
          </div>

          {/* Player rows skeleton */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-2 p-2 bg-muted/30 rounded"
            >
              <div className="h-8 w-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-2 bg-muted rounded w-16"></div>
              </div>
              <div className="h-3 bg-muted rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
