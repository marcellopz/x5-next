import { PlayerMvpPerformanceInGames } from "@/lib/types";
import { StatsCard } from "./stats-card";
import { TimeSinceLastMatch } from "./time-since-last-match";
import { getLocale, getTranslations, t } from "@/lib/i18n";
import { LOCALE_MAP } from "@/lib/i18n/types";

interface StatsCardsSectionProps {
  numberOfGames: number;
  totalPlayers: number;
  mostRecentGameTimestamp: number | undefined;
  recentMVP: PlayerMvpPerformanceInGames | undefined;
}

export async function StatsCardsSection({
  numberOfGames,
  totalPlayers,
  mostRecentGameTimestamp,
  recentMVP,
}: StatsCardsSectionProps) {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const intlLocale = LOCALE_MAP[locale];

  const lastMatchDescription = mostRecentGameTimestamp
    ? `${t(trans, "common.lastMatchWasOn")} ${new Date(
        mostRecentGameTimestamp
      ).toLocaleDateString(intlLocale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo",
      })}`
    : t(trans, "common.noMatchesYet");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title={t(trans, "common.numberOfMatches")}
        value={numberOfGames}
        description={t(trans, "common.numberOfMatchesPlayed")}
        linkTo="/history"
      />
      <StatsCard
        title={t(trans, "common.totalPlayers")}
        value={totalPlayers}
        description={t(trans, "common.allRegisteredPlayers")}
        linkTo="/player-list"
      />
      <TimeSinceLastMatch
        mostRecentGameTimestamp={mostRecentGameTimestamp}
        description={lastMatchDescription}
      />
      <StatsCard
        title={t(trans, "common.recentMvp")}
        value={recentMVP?.gameName || "???"}
        description={t(trans, "common.bestPerformingPlayer")}
        linkTo="/stats/mvp-table"
      />
    </div>
  );
}
