import { getAllReducedData } from "@/lib/endpoints";
import { MatchesContainer } from "@/components/history/matches-container";

export default async function History() {
  // Fetch data server-side (already sorted by date with matchId included)
  const matches = await getAllReducedData();

  return (
    <div className="h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Match History</h1>
        <p className="text-sm text-muted-foreground">
          {matches.length} matches total
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <MatchesContainer matches={matches} />
      </div>
    </div>
  );
}
