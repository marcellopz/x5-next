import { MatchEntrySkeleton } from "@/components/history/match-entry";

export default function Loading() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="container mx-auto px-4 py-8 flex-shrink-0">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </div>
      </div>

      {/* Matches list skeleton */}
      <div className="flex-1 min-h-0">
        <div className="container mx-auto px-4 space-y-4 p-4">
          {/* Render multiple skeleton match entries */}
          {Array.from({ length: 8 }).map((_, i) => (
            <MatchEntrySkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
