import { redirect } from "next/navigation";
import { getFullMatch, getMatchRoles } from "@/lib/endpoints";
import { MatchDetails } from "@/components/match/match-details";
import { MatchComponent } from "@/components/match/match-component";
import { DamageChart } from "@/components/match/damage-chart";
import { PlayerTabs } from "@/components/match/player-tabs";
import { generatePageMetadata } from "@/lib/metadata";

interface MatchPageProps {
  params: Promise<{ matchId: string }>;
}

export async function generateMetadata({ params }: MatchPageProps) {
  const { matchId } = await params;
  return generatePageMetadata(
    `Match ${matchId}`,
    `Detailed match analysis with player performance and statistics`
  );
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = await params;

  // Handle URL format conversion: redirect from "match{number}" to just "{number}"
  if (matchId.startsWith("match")) {
    const numericId = matchId.replace("match", "");
    redirect(`/match/${numericId}`);
  }

  // Fetch match data - need to add "match" prefix for the API call
  const fullMatchId = `match${matchId}`;
  const [matchData, matchRoles] = await Promise.all([
    getFullMatch(fullMatchId),
    getMatchRoles(fullMatchId),
  ]);

  if (!matchData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-2">Match Not Found</h1>
          <p className="text-muted-foreground">
            The match data is not available yet.
          </p>
        </div>
      </div>
    );
  }

  // Extract match data (type will be defined later)
  const match = matchData as {
    gameCreationDate?: number;
    gameDuration?: number;
    gameId?: string;
    [key: string]: unknown;
  };

  const date = match.gameCreationDate
    ? new Date(match.gameCreationDate)
    : new Date();
  const gameDuration = match.gameDuration ?? 0;
  const gameId = match.gameId ?? matchId;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <MatchDetails date={date} gameDuration={gameDuration} gameId={gameId} />
        <MatchComponent matchData={matchData} matchRoles={matchRoles} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <DamageChart matchData={matchData} />
          </div>
          <div className="lg:col-span-8">
            <PlayerTabs matchData={matchData} />
          </div>
        </div>
      </div>
    </div>
  );
}
