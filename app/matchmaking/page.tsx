import { getPlayerList } from "@/lib/endpoints";
import FormContainer from "@/components/matchmaking/form-container";
import { getSeasonName, getSeasonPrefix } from "@/lib/metadata";
import { getLocale, getTranslations, t } from "@/lib/i18n";
import type { Metadata } from "next";

type MatchmakingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function extractSelectedPlayers(rawPlayers: string | undefined): string[] {
  if (!rawPlayers) return [];
  return rawPlayers
    .split(",")
    .map((player) => decodeParam(player).trim())
    .filter(Boolean);
}

function extractActiveFilters(
  searchParams: Record<string, string | string[] | undefined>
): string[] {
  const filters: string[] = [];

  const mo = getFirstParam(searchParams.mo);
  if (mo) filters.push(`match options=${mo}`);

  const to = getFirstParam(searchParams.to);
  if (to) filters.push(`tolerance=${to}`);

  if (getFirstParam(searchParams.pl) === "1") filters.push("preset lanes");
  if (getFirstParam(searchParams.ar) === "1") filters.push("avoid roles");
  if (getFirstParam(searchParams.pc) === "1") filters.push("player combos");
  if (getFirstParam(searchParams.pa) === "1") filters.push("keep rivals apart");
  if (getFirstParam(searchParams.rv2) === "0") filters.push("role variety off");

  return filters;
}

export async function generateMetadata({
  searchParams,
}: MatchmakingPageProps): Promise<Metadata> {
  const query = await searchParams;
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const seasonName = getSeasonName();
  const seasonPrefix = getSeasonPrefix();

  const selectedPlayers = extractSelectedPlayers(getFirstParam(query.p));
  const activeFilters = extractActiveFilters(query);

  const playersSummary =
    selectedPlayers.length > 0
      ? `Players (${selectedPlayers.length}): ${selectedPlayers.join(", ")}`
      : "Players: none selected";
  const filtersSummary =
    activeFilters.length > 0
      ? `Filters: ${activeFilters.join(", ")}`
      : "Filters: default";

  const pageTitle = `${seasonPrefix} - ${t(trans, "pages.matchmaking")} (${selectedPlayers.length}/10)`;
  const embedDescription = [`x5 ${seasonName}`, playersSummary, filtersSummary].join("\n");

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
