import { StatsCard } from "./stats-card";
import { getTimeElapsed } from "@/lib/utils";

interface StatsCardsSectionProps {
  numberOfGames: number;
  totalPlayers: number;
  mostRecentGameTimestamp: number | undefined;
  recentMVP: string;
}

export function StatsCardsSection({
  numberOfGames,
  totalPlayers,
  mostRecentGameTimestamp,
  recentMVP,
}: StatsCardsSectionProps) {
  // Calculate time since last match
  const timeSinceLastMatch = mostRecentGameTimestamp
    ? getTimeElapsed(mostRecentGameTimestamp)
    : "Unknown";

  // Format the date for description
  const lastMatchDescription = mostRecentGameTimestamp
    ? `Last match was on ${new Date(mostRecentGameTimestamp).toLocaleDateString(
        "pt-BR",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        }
      )}`
    : "No matches yet";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Number of matches"
        value={numberOfGames}
        description="Number of matches played"
      />
      <StatsCard
        title="Total Players"
        value={totalPlayers}
        description="All registered players"
      />
      <StatsCard
        title="Time since last match"
        value={timeSinceLastMatch}
        description={lastMatchDescription}
      />
      <StatsCard
        title="Recent MVP"
        value={recentMVP}
        description="Most wins in the last 10 matches"
      />
    </div>
  );
}
