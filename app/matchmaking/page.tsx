import { getPlayerList } from "@/lib/endpoints";
import FormContainer from "@/components/matchmaking/form-container";
import { getSeasonName, getSeasonPrefix } from "@/lib/metadata";
import { getLocale, getTranslations, t } from "@/lib/i18n";
import {
  buildMatchCountsSummary,
  buildMatchmakingConfigFromQuery,
  extractFormattedFiltersFromQuery,
  extractSelectedPlayersFromQuery,
} from "@/lib/matchmaking-embed-metadata";
import type { Metadata } from "next";

type MatchmakingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: MatchmakingPageProps): Promise<Metadata> {
  const query = await searchParams;
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const seasonName = getSeasonName();
  const seasonPrefix = getSeasonPrefix();

  const selectedPlayers = extractSelectedPlayersFromQuery(query);
  const activeFilters = extractFormattedFiltersFromQuery(query);
  const config = buildMatchmakingConfigFromQuery(query);

  const playerList = await getPlayerList();
  const allPlayers = playerList ? Object.values(playerList) : [];
  const matchesCountSummary = buildMatchCountsSummary(
    selectedPlayers,
    config,
    allPlayers
  );

  const playersSummary =
    selectedPlayers.length > 0
      ? `Players (${selectedPlayers.length}): ${selectedPlayers.join(", ")}`
      : "Players: none selected";
  const filtersSummary =
    activeFilters.length > 0 ? activeFilters.join("\n") : "Filters: default";

  const pageTitle = `${seasonPrefix} - ${t(trans, "pages.matchmaking")} (${selectedPlayers.length}/10)`;
  const embedDescription = [
    `x5 ${seasonName}`,
    playersSummary,
    filtersSummary,
    matchesCountSummary,
  ].join("\n\n");

  return {
    title: pageTitle,
    description: embedDescription,
    openGraph: {
      title: pageTitle,
      description: embedDescription,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: embedDescription,
    },
  };
}

export default async function MatchmakingPage() {
  const playerList = await getPlayerList();

  // Convert playerList object to array and filter out hidden players
  const players = playerList ? Object.values(playerList) : [];

  return <FormContainer players={players} />;
}
