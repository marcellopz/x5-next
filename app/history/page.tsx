import { getAllReducedData } from "@/lib/firebase-admin";
import { MatchEntry } from "@/components/history/match-entry";

export const revalidate = 0;

export default async function History() {
  const allReducedData = await getAllReducedData();

  // Convert the matches object to an array and sort by date (newest first)
  const matches = allReducedData
    ? Object.entries(allReducedData)
        .map(([matchId, matchData]) => ({ matchId, ...matchData }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Match History</h1>
          <p className="text-sm text-muted-foreground">
            {matches.length} matches found
          </p>
        </div>

        <div className="space-y-4">
          {matches.length > 0 ? (
            matches.map((match) => (
              <MatchEntry key={match.matchId} match={match} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No matches found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
