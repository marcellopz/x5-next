import { MatchEntrySkeleton } from "@/components/history/match-entry";

export default function Loading() {
  return (
    <div className="flex flex-col">
      {/* Header skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-pulse">
          <div>
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
          <div className="w-full md:max-w-xs">
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
      </div>

      {/* Matches list skeleton */}
      <div className="container mx-auto px-4 flex-1">
        <div className="space-y-4">
          {/* Render multiple skeleton match entries */}
          {Array.from({ length: 8 }).map((_, i) => (
            <MatchEntrySkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
