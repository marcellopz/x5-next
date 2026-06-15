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

function laneCodeToShortLabel(code: string): string {
  switch (code) {
    case "t":
      return "top";
    case "j":
      return "jng";
    case "m":
      return "mid";
    case "a":
      return "adc";
    case "s":
      return "sup";
    default:
      return code;
  }
}

function parseAvoidRoles(rawRules: string | undefined): string {
  if (!rawRules) return "Avoid roles: enabled";
  const rules = rawRules
    .split(";")
    .map((entry) => {
      const [rawPlayer, laneCode] = entry.split(":");
      if (!rawPlayer || !laneCode) return null;
      const player = decodeParam(rawPlayer).trim();
      const lane = laneCodeToShortLabel(laneCode.trim().toLowerCase());
      if (!player || !lane) return null;
      return `${player} (${lane})`;
    })
    .filter((x): x is string => Boolean(x));

  return rules.length > 0 ? `Avoid roles: ${rules.join(", ")}` : "Avoid roles: enabled";
}

function parsePresetLanes(rawAssignments: string | undefined): string {
  if (!rawAssignments) return "Preset lanes: enabled";
  const assignments = rawAssignments
    .split(";")
    .map((entry) => {
      const [laneCode, rawPlayer1 = "", rawPlayer2 = ""] = entry.split(":");
      if (!laneCode) return null;
      const lane = laneCodeToShortLabel(laneCode.trim().toLowerCase());
      const player1 = decodeParam(rawPlayer1).trim();
      const player2 = decodeParam(rawPlayer2).trim();

      if (player1 && player2) return `${lane}: ${player1} vs ${player2}`;
      if (player1) return `${lane}: ${player1}`;
      if (player2) return `${lane}: ${player2}`;
      return null;
    })
    .filter((x): x is string => Boolean(x));

  return assignments.length > 0
    ? `Preset lanes: ${assignments.join("; ")}`
    : "Preset lanes: enabled";
}

function parsePlayerCombos(rawCombos: string | undefined): string {
  if (!rawCombos) return "Player combos: enabled";
  const combos = rawCombos
    .split(";")
    .map((combo) =>
      combo
        .split(",")
        .map((player) => decodeParam(player).trim())
        .filter(Boolean)
        .join(" + ")
    )
    .filter(Boolean);

  return combos.length > 0 ? `Player combos: ${combos.join("; ")}` : "Player combos: enabled";
}

function parseRivalPairs(rawPairs: string | undefined): string {
  if (!rawPairs) return "Keep rivals apart: enabled";
  const pairs = rawPairs
    .split(";")
    .map((entry) => {
      const [rawPlayer1, rawPlayer2] = entry.split(":");
      if (!rawPlayer1 || !rawPlayer2) return null;
      const player1 = decodeParam(rawPlayer1).trim();
      const player2 = decodeParam(rawPlayer2).trim();
      if (!player1 || !player2) return null;
      return `${player1} vs ${player2}`;
    })
    .filter((x): x is string => Boolean(x));

  return pairs.length > 0
    ? `Keep rivals apart: ${pairs.join("; ")}`
    : "Keep rivals apart: enabled";
}

function extractFormattedFilters(
  searchParams: Record<string, string | string[] | undefined>
): string[] {
  const filters: string[] = [];

  const matchOptions = getFirstParam(searchParams.mo);
  if (matchOptions) {
    filters.push(`Match options: ${matchOptions}`);
  }

  const tolerance = getFirstParam(searchParams.to);
  if (tolerance) {
    filters.push(`Tolerance: ${tolerance}`);
  }

  if (getFirstParam(searchParams.pl) === "1") {
    filters.push(parsePresetLanes(getFirstParam(searchParams.ln)));
  }
  if (getFirstParam(searchParams.ar) === "1") {
    filters.push(parseAvoidRoles(getFirstParam(searchParams.rr)));
  }
  if (getFirstParam(searchParams.pc) === "1") {
    filters.push(parsePlayerCombos(getFirstParam(searchParams.co)));
  }
  if (getFirstParam(searchParams.pa) === "1") {
    filters.push(parseRivalPairs(getFirstParam(searchParams.rv)));
  }
  if (getFirstParam(searchParams.rv2) === "0") {
    filters.push("Role variety: off");
  }

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
  const activeFilters = extractFormattedFilters(query);

  const playersSummary =
    selectedPlayers.length > 0
      ? `Players (${selectedPlayers.length}): ${selectedPlayers.join(", ")}`
      : "Players: none selected";
  const filtersSummary =
    activeFilters.length > 0 ? activeFilters.join("\n") : "Filters: default";

  const pageTitle = `${seasonPrefix} - ${t(trans, "pages.matchmaking")} (${selectedPlayers.length}/10)`;
  const embedDescription = [`x5 ${seasonName}`, playersSummary, filtersSummary].join("\n\n");

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
