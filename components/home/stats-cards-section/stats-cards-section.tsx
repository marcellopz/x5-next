import { PlayerMvpPerformanceInGames } from "@/lib/types";
import { StatsCard } from "./stats-card";
import { TimeSinceLastMatch } from "./time-since-last-match";

interface StatsCardsSectionProps {
  numberOfGames: number;
  totalPlayers: number;
  mostRecentGameTimestamp: number | undefined;
  recentMVP: PlayerMvpPerformanceInGames | undefined;
}

export function StatsCardsSection({
  numberOfGames,
  totalPlayers,
  mostRecentGameTimestamp,
  recentMVP,
}: StatsCardsSectionProps) {
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
        linkTo="/history"
      />
      <StatsCard
        title="Total Players"
        value={totalPlayers}
        description="All registered players"
        linkTo="/player-list"
      />
      <TimeSinceLastMatch
        mostRecentGameTimestamp={mostRecentGameTimestamp}
        description={lastMatchDescription}
      />
      <StatsCard
        title="Recent MVP"
        value={recentMVP?.gameName || "???"}
        description="Most wins in the last 10 matches"
        linkTo="/stats/mvp-table"
      />
    </div>
  );
}
