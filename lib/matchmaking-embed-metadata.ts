import { generateMatches } from "@/lib/matchmaking-algorithm";
import type { MatchmakingConfig } from "@/components/matchmaking/matchmaking-context";
import type { Player } from "@/lib/types";

export type MatchmakingQueryParams = Record<
  string,
  string | string[] | undefined
>;

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

function parseNonNegativeInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return parsed;
}

function laneCodeToLane(
  code: string
): "top" | "jungle" | "mid" | "adc" | "support" | null {
  switch (code) {
    case "t":
      return "top";
    case "j":
      return "jungle";
    case "m":
      return "mid";
    case "a":
      return "adc";
    case "s":
      return "support";
    default:
      return null;
  }
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

export function extractSelectedPlayersFromQuery(
  query: MatchmakingQueryParams
): string[] {
  const rawPlayers = getFirstParam(query.p);
  if (!rawPlayers) return [];
  return Array.from(
    new Set(
      rawPlayers
        .split(",")
        .map((player) => decodeParam(player).trim())
        .filter(Boolean)
    )
  );
}

export function extractFormattedFiltersFromQuery(
  query: MatchmakingQueryParams
): string[] {
  const filters: string[] = [];

  const matchOptions = getFirstParam(query.mo);
  if (matchOptions) {
    filters.push(`Match options: ${matchOptions}`);
  }

  const tolerance = getFirstParam(query.to);
  if (tolerance) {
    filters.push(`Tolerance: ${tolerance}`);
  }

  if (getFirstParam(query.pl) === "1") {
    filters.push(parsePresetLanes(getFirstParam(query.ln)));
  }
  if (getFirstParam(query.ar) === "1") {
    filters.push(parseAvoidRoles(getFirstParam(query.rr)));
  }
  if (getFirstParam(query.pc) === "1") {
    filters.push(parsePlayerCombos(getFirstParam(query.co)));
  }
  if (getFirstParam(query.pa) === "1") {
    filters.push(parseRivalPairs(getFirstParam(query.rv)));
  }
  if (getFirstParam(query.rv2) === "0") {
    filters.push("Role variety: off");
  }

  return filters;
}

export function buildMatchmakingConfigFromQuery(
  query: MatchmakingQueryParams
): MatchmakingConfig {
  const config: MatchmakingConfig = {
    matchOptions: parseNonNegativeInt(getFirstParam(query.mo), 5),
    tolerance: parseNonNegativeInt(getFirstParam(query.to), 1),
    presetLanes: {
      usePresetLanes: getFirstParam(query.pl) === "1",
      randomizeSides: getFirstParam(query.rs) !== "0",
      lanes: {
        top: { player1: null, player2: null },
        jungle: { player1: null, player2: null },
        mid: { player1: null, player2: null },
        adc: { player1: null, player2: null },
        support: { player1: null, player2: null },
      },
    },
    avoidRoles: {
      enabled: getFirstParam(query.ar) === "1",
      rules: [],
    },
    playerCombos: {
      enabled: getFirstParam(query.pc) === "1",
      combos: [],
    },
    playerSeparations: {
      enabled: getFirstParam(query.pa) === "1",
      pairs: [],
    },
    roleVariety: {
      enabled: getFirstParam(query.rv2) !== "0",
    },
  };

  const laneAssignments = getFirstParam(query.ln);
  if (laneAssignments) {
    laneAssignments.split(";").forEach((entry) => {
      const [laneCode, rawPlayer1 = "", rawPlayer2 = ""] = entry.split(":");
      const lane = laneCodeToLane(laneCode?.trim().toLowerCase() ?? "");
      if (!lane) return;
      const player1 = decodeParam(rawPlayer1).trim();
      const player2 = decodeParam(rawPlayer2).trim();
      config.presetLanes.lanes[lane] = {
        player1: player1 || null,
        player2: player2 || null,
      };
    });
  }

  const rawRules = getFirstParam(query.rr);
  if (rawRules) {
    config.avoidRoles.rules = rawRules
      .split(";")
      .map((rule) => {
        const [rawPlayerId, laneCode] = rule.split(":");
        if (!rawPlayerId || !laneCode) return null;
        const lane = laneCodeToLane(laneCode.trim().toLowerCase());
        if (!lane) return null;
        return {
          playerId: decodeParam(rawPlayerId).trim(),
          lane,
        };
      })
      .filter(
        (
          rule
        ): rule is {
          playerId: string;
          lane: "top" | "jungle" | "mid" | "adc" | "support";
        } => Boolean(rule && rule.playerId)
      );
  }

  const rawCombos = getFirstParam(query.co);
  if (rawCombos) {
    config.playerCombos.combos = rawCombos
      .split(";")
      .map((rawCombo, index) => {
        const players = rawCombo
          .split(",")
          .map((id) => decodeParam(id).trim())
          .filter(Boolean);
        if (players.length === 0) return null;
        return {
          id: `combo-${index + 1}`,
          players,
        };
      })
      .filter(
        (combo): combo is { id: string; players: string[] } =>
          Boolean(combo && combo.players.length > 0)
      );
  }

  const rawRivalPairs = getFirstParam(query.rv);
  if (rawRivalPairs) {
    config.playerSeparations.pairs = rawRivalPairs
      .split(";")
      .map((rawPair, index) => {
        const [rawPlayer1, rawPlayer2] = rawPair.split(":");
        if (!rawPlayer1 || !rawPlayer2) return null;
        const player1 = decodeParam(rawPlayer1).trim();
        const player2 = decodeParam(rawPlayer2).trim();
        if (!player1 || !player2 || player1 === player2) return null;
        return {
          id: `rivals-${index + 1}`,
          player1,
          player2,
        };
      })
      .filter(
        (
          pair
        ): pair is {
          id: string;
          player1: string;
          player2: string;
        } => Boolean(pair)
      );
  }

  return config;
}

export function buildMatchCountsSummary(
  selectedPlayerIds: string[],
  config: MatchmakingConfig,
  allPlayers: Player[]
): string {
  const selectedPlayersForAlgo = selectedPlayerIds
    .map((nameId) => allPlayers.find((p) => p.name_id === nameId))
    .filter((player): player is Player => Boolean(player));

  if (selectedPlayersForAlgo.length !== 10) {
    return "Matches: n/a\nMatches with filters: n/a";
  }

  const result = generateMatches(selectedPlayersForAlgo, config, allPlayers);
  if (!result.success) {
    return "Matches: n/a\nMatches with filters: n/a";
  }

  return [
    `Matches: ${result.allMatches.length}`,
    `Matches with filters: ${result.filteredMatches.length}`,
  ].join("\n");
}

