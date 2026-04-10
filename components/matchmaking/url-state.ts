"use client";

import type { Player } from "@/lib/types";
import type { Lane, MatchmakingConfig } from "./matchmaking-context";
import { initialMatchmakingConfig } from "./matchmaking-context";

type Step = 1 | 2 | 3;

interface EncodedStateInput {
  step: number;
  selectedPlayerIds: string[];
  players: Player[];
  config: MatchmakingConfig;
}

export interface DecodedMatchmakingState {
  step: Step;
  selectedPlayerIds: string[];
  wildcardPlayers: Player[];
  config: MatchmakingConfig;
}

const KEY_STEP = "s";
const KEY_SELECTED_PLAYERS = "p";
const KEY_MATCH_OPTIONS = "mo";
const KEY_TOLERANCE = "to";
const KEY_PRESET_LANES_ENABLED = "pl";
const KEY_RANDOMIZE_SIDES = "rs";
const KEY_LANE_ASSIGNMENTS = "ln";
const KEY_AVOID_ROLES_ENABLED = "ar";
const KEY_AVOID_RULES = "rr";
const KEY_PLAYER_COMBOS_ENABLED = "pc";
const KEY_PLAYER_COMBOS = "co";
const KEY_WILDCARDS = "w";

export const MATCHMAKING_QUERY_KEYS = [
  KEY_STEP,
  KEY_SELECTED_PLAYERS,
  KEY_MATCH_OPTIONS,
  KEY_TOLERANCE,
  KEY_PRESET_LANES_ENABLED,
  KEY_RANDOMIZE_SIDES,
  KEY_LANE_ASSIGNMENTS,
  KEY_AVOID_ROLES_ENABLED,
  KEY_AVOID_RULES,
  KEY_PLAYER_COMBOS_ENABLED,
  KEY_PLAYER_COMBOS,
  KEY_WILDCARDS,
] as const;

const laneToCode: Record<Lane, string> = {
  top: "t",
  jungle: "j",
  mid: "m",
  adc: "a",
  support: "s",
};

const codeToLane: Record<string, Lane> = {
  t: "top",
  j: "jungle",
  m: "mid",
  a: "adc",
  s: "support",
};

function encodeString(value: string): string {
  return encodeURIComponent(value);
}

function decodeString(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function createInitialConfig(): MatchmakingConfig {
  return {
    matchOptions: initialMatchmakingConfig.matchOptions,
    tolerance: initialMatchmakingConfig.tolerance,
    presetLanes: {
      usePresetLanes: initialMatchmakingConfig.presetLanes.usePresetLanes,
      randomizeSides: initialMatchmakingConfig.presetLanes.randomizeSides,
      lanes: {
        top: { ...initialMatchmakingConfig.presetLanes.lanes.top },
        jungle: { ...initialMatchmakingConfig.presetLanes.lanes.jungle },
        mid: { ...initialMatchmakingConfig.presetLanes.lanes.mid },
        adc: { ...initialMatchmakingConfig.presetLanes.lanes.adc },
        support: { ...initialMatchmakingConfig.presetLanes.lanes.support },
      },
    },
    avoidRoles: {
      enabled: initialMatchmakingConfig.avoidRoles.enabled,
      rules: [],
    },
    playerCombos: {
      enabled: initialMatchmakingConfig.playerCombos.enabled,
      combos: [],
    },
  };
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return parsed;
}

function getWildcardPlayers(players: Player[], selectedPlayerIds: string[]): Player[] {
  const selectedSet = new Set(selectedPlayerIds);
  return players.filter((player) => player.isWildcard && selectedSet.has(player.name_id));
}

export function encodeMatchmakingStateToQuery(input: EncodedStateInput): URLSearchParams {
  const params = new URLSearchParams();
  const selectedPlayerIds = Array.from(
    new Set(input.selectedPlayerIds.filter((id) => id.length > 0))
  );
  const selectedSet = new Set(selectedPlayerIds);
  const wildcards = getWildcardPlayers(input.players, selectedPlayerIds);

  if (input.step > 1 && input.step <= 3) {
    params.set(KEY_STEP, String(input.step));
  }

  if (selectedPlayerIds.length > 0) {
    params.set(
      KEY_SELECTED_PLAYERS,
      selectedPlayerIds.map((id) => encodeString(id)).join(",")
    );
  }

  if (wildcards.length > 0) {
    const wildcardValue = wildcards
      .map((player) =>
        [
          encodeString(player.name_id),
          encodeString(player.name),
          String(player.top),
          String(player.jungle),
          String(player.mid),
          String(player.adc),
          String(player.support),
        ].join("|")
      )
      .join("~");
    params.set(KEY_WILDCARDS, wildcardValue);
  }

  const { config } = input;

  if (config.matchOptions !== initialMatchmakingConfig.matchOptions) {
    params.set(KEY_MATCH_OPTIONS, String(config.matchOptions));
  }
  if (config.tolerance !== initialMatchmakingConfig.tolerance) {
    params.set(KEY_TOLERANCE, String(config.tolerance));
  }

  if (config.presetLanes.usePresetLanes) {
    params.set(KEY_PRESET_LANES_ENABLED, "1");
    if (!config.presetLanes.randomizeSides) {
      params.set(KEY_RANDOMIZE_SIDES, "0");
    }

    const laneAssignments = (Object.keys(config.presetLanes.lanes) as Lane[])
      .map((lane) => {
        const assignment = config.presetLanes.lanes[lane];
        const player1 = assignment.player1 && selectedSet.has(assignment.player1)
          ? encodeString(assignment.player1)
          : "";
        const player2 = assignment.player2 && selectedSet.has(assignment.player2)
          ? encodeString(assignment.player2)
          : "";
        if (!player1 && !player2) return null;
        return `${laneToCode[lane]}:${player1}:${player2}`;
      })
      .filter((entry): entry is string => entry !== null);

    if (laneAssignments.length > 0) {
      params.set(KEY_LANE_ASSIGNMENTS, laneAssignments.join(";"));
    }
  }

  if (config.avoidRoles.enabled) {
    params.set(KEY_AVOID_ROLES_ENABLED, "1");
    const avoidRules = config.avoidRoles.rules
      .filter((rule) => selectedSet.has(rule.playerId))
      .map((rule) => `${encodeString(rule.playerId)}:${laneToCode[rule.lane]}`);
    if (avoidRules.length > 0) {
      params.set(KEY_AVOID_RULES, avoidRules.join(";"));
    }
  }

  if (config.playerCombos.enabled) {
    params.set(KEY_PLAYER_COMBOS_ENABLED, "1");
    const combos = config.playerCombos.combos
      .map((combo) =>
        combo.players
          .filter((playerId) => selectedSet.has(playerId))
          .map((playerId) => encodeString(playerId))
          .join(",")
      )
      .filter((entry) => entry.length > 0);

    if (combos.length > 0) {
      params.set(KEY_PLAYER_COMBOS, combos.join(";"));
    }
  }

  return params;
}

export function decodeMatchmakingStateFromQuery(
  query: URLSearchParams,
  basePlayers: Player[]
): DecodedMatchmakingState {
  const config = createInitialConfig();
  const wildcardPlayers: Player[] = [];

  const wildcardRaw = query.get(KEY_WILDCARDS);
  if (wildcardRaw) {
    wildcardRaw.split("~").forEach((rawEntry, index) => {
      const [rawNameId, rawName, top, jungle, mid, adc, support] = rawEntry.split("|");
      if (!rawNameId || !rawName) return;
      const name_id = decodeString(rawNameId).trim();
      const name = decodeString(rawName).trim();
      if (!name_id || !name) return;

      const roleValues = [top, jungle, mid, adc, support].map((value) => {
        const parsed = Number.parseInt(value || "0", 10);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
      });

      wildcardPlayers.push({
        account_id: `wildcard-${index}-${name_id}`,
        name,
        name_id,
        top: roleValues[0],
        jungle: roleValues[1],
        mid: roleValues[2],
        adc: roleValues[3],
        support: roleValues[4],
        hide: false,
        isWildcard: true,
      });
    });
  }

  const knownPlayerIds = new Set([
    ...basePlayers.map((player) => player.name_id),
    ...wildcardPlayers.map((player) => player.name_id),
  ]);

  const selectedRaw = query.get(KEY_SELECTED_PLAYERS);
  const selectedPlayerIds = selectedRaw
    ? Array.from(
        new Set(
          selectedRaw
            .split(",")
            .map((id) => decodeString(id).trim())
            .filter((id) => knownPlayerIds.has(id))
        )
      )
    : [];

  config.matchOptions = parsePositiveInt(
    query.get(KEY_MATCH_OPTIONS),
    initialMatchmakingConfig.matchOptions
  );
  config.tolerance = parsePositiveInt(
    query.get(KEY_TOLERANCE),
    initialMatchmakingConfig.tolerance
  );

  const selectedSet = new Set(selectedPlayerIds);
  if (query.get(KEY_PRESET_LANES_ENABLED) === "1") {
    config.presetLanes.usePresetLanes = true;
    config.presetLanes.randomizeSides = query.get(KEY_RANDOMIZE_SIDES) !== "0";

    const laneAssignmentsRaw = query.get(KEY_LANE_ASSIGNMENTS);
    if (laneAssignmentsRaw) {
      laneAssignmentsRaw.split(";").forEach((entry) => {
        const [laneCode, rawPlayer1, rawPlayer2] = entry.split(":");
        const lane = codeToLane[laneCode];
        if (!lane) return;
        const player1 = rawPlayer1 ? decodeString(rawPlayer1) : null;
        const player2 = rawPlayer2 ? decodeString(rawPlayer2) : null;
        config.presetLanes.lanes[lane] = {
          player1: player1 && selectedSet.has(player1) ? player1 : null,
          player2: player2 && selectedSet.has(player2) ? player2 : null,
        };
      });
    }
  }

  if (query.get(KEY_AVOID_ROLES_ENABLED) === "1") {
    config.avoidRoles.enabled = true;
    const rawRules = query.get(KEY_AVOID_RULES);
    if (rawRules) {
      config.avoidRoles.rules = rawRules
        .split(";")
        .map((rule) => {
          const [rawPlayerId, laneCode] = rule.split(":");
          const lane = codeToLane[laneCode];
          if (!rawPlayerId || !lane) return null;
          const playerId = decodeString(rawPlayerId);
          if (!selectedSet.has(playerId)) return null;
          return { playerId, lane };
        })
        .filter((rule): rule is { playerId: string; lane: Lane } => rule !== null);
    }
  }

  if (query.get(KEY_PLAYER_COMBOS_ENABLED) === "1") {
    config.playerCombos.enabled = true;
    const rawCombos = query.get(KEY_PLAYER_COMBOS);
    if (rawCombos) {
      config.playerCombos.combos = rawCombos
        .split(";")
        .map((rawCombo, index) => {
          const players = Array.from(
            new Set(
              rawCombo
                .split(",")
                .map((playerId) => decodeString(playerId))
                .filter((playerId) => selectedSet.has(playerId))
            )
          );
          if (players.length === 0) return null;
          return { id: `combo-${index + 1}`, players };
        })
        .filter((combo): combo is { id: string; players: string[] } => combo !== null);
    }
  }

  const rawStep = Number.parseInt(query.get(KEY_STEP) || "1", 10);
  const step: Step = rawStep >= 1 && rawStep <= 3 ? (rawStep as Step) : 1;

  return {
    step,
    selectedPlayerIds,
    wildcardPlayers,
    config,
  };
}
