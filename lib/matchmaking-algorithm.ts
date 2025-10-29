import type { Player } from "@/lib/types";
import type { MatchmakingConfig } from "@/components/matchmaking/matchmaking-context";

export interface MatchResult {
  pairingsRoles: {
    [role: string]: Array<{ name: string; rank: number }>;
  };
  matchScore: {
    blue: number;
    red: number;
  };
  pairings: Player[];
}

export interface MatchmakingResult {
  matches: MatchResult[];
  success: boolean;
  error?: string;
}

/**
 * Main matchmaking algorithm that handles all configuration options
 */
export function generateMatches(
  players: Player[],
  config: MatchmakingConfig
): MatchmakingResult {
  try {
    // Validate input
    if (players.length !== 10) {
      return {
        matches: [],
        success: false,
        error: "Exactly 10 players are required for matchmaking",
      };
    }

    // Convert players to algorithm format
    const algorithmPlayers = players.map((player) => ({
      playerId: player.account_id,
      name: player.name,
      ranks: [
        player.top,
        player.jungle,
        player.mid,
        player.adc,
        player.support,
      ],
    }));

    const matches: MatchResult[] = [];
    const laneCounts = new Map<string | number, number[]>(); // Track role variety

    // Generate multiple match options with role variety
    for (let i = 0; i < config.matchOptions; i++) {
      const match = generateSingleMatch(algorithmPlayers, config, laneCounts);
      if (match) {
        matches.push(match);
      }
    }

    return {
      matches,
      success: matches.length > 0,
      error:
        matches.length === 0
          ? "No valid matches found with current constraints"
          : undefined,
    };
  } catch (error) {
    return {
      matches: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Generate a single match with all constraints applied
 */
function generateSingleMatch(
  players: Array<{ playerId: string | number; name: string; ranks: number[] }>,
  config: MatchmakingConfig,
  laneCounts: Map<string | number, number[]> = new Map()
): MatchResult | null {
  const roles = ["Top", "Jungle", "Mid", "Adc", "Support"];

  // Create fixed pairings from preset lanes
  const fixedPairings: Array<Array<(typeof players)[0] | null>> = roles.map(
    () => [null, null]
  );

  if (config.presetLanes.usePresetLanes) {
    Object.entries(config.presetLanes.lanes).forEach(
      ([, laneConfig], roleIndex) => {
        if (laneConfig.player1 && laneConfig.player2) {
          const player1 = players.find(
            (p) => p.playerId === laneConfig.player1!.account_id
          );
          const player2 = players.find(
            (p) => p.playerId === laneConfig.player2!.account_id
          );

          if (player1 && player2) {
            // If randomize sides is enabled, randomly assign sides
            if (config.presetLanes.randomizeSides && Math.random() < 0.5) {
              fixedPairings[roleIndex][0] = player2;
              fixedPairings[roleIndex][1] = player1;
            } else {
              fixedPairings[roleIndex][0] = player1;
              fixedPairings[roleIndex][1] = player2;
            }
          }
        } else if (laneConfig.player1) {
          const player1 = players.find(
            (p) => p.playerId === laneConfig.player1!.account_id
          );
          if (player1) fixedPairings[roleIndex][0] = player1;
        } else if (laneConfig.player2) {
          const player2 = players.find(
            (p) => p.playerId === laneConfig.player2!.account_id
          );
          if (player2) fixedPairings[roleIndex][1] = player2;
        }
      }
    );
  }

  // Apply avoid role constraints
  const avoidRoleConstraints = new Map<string | number, Set<number>>();
  if (config.avoidRoles.enabled) {
    config.avoidRoles.rules.forEach((rule) => {
      const roleIndex = roles.findIndex(
        (role) => role.toLowerCase() === rule.lane
      );
      if (roleIndex !== -1) {
        if (!avoidRoleConstraints.has(rule.playerId)) {
          avoidRoleConstraints.set(rule.playerId, new Set());
        }
        avoidRoleConstraints.get(rule.playerId)!.add(roleIndex);
      }
    });
  }

  // Apply player combo constraints
  const comboConstraints = new Map<string | number, Set<string | number>>();
  if (config.playerCombos.enabled && config.playerCombos.combos.length > 0) {
    const combo = config.playerCombos.combos[0]; // Only one combo allowed
    combo.players.forEach((player) => {
      const otherPlayers = combo.players.filter(
        (p) => p.account_id !== player.account_id
      );
      comboConstraints.set(
        player.account_id,
        new Set(otherPlayers.map((p) => p.account_id))
      );
    });
  }

  // Try to generate a valid match using local search with role variety
  const maxAttempts = 10000;
  let bestMatch: MatchResult | null = null;
  let bestScore = Infinity;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const match = generateRandomMatch(
      players,
      fixedPairings,
      avoidRoleConstraints,
      comboConstraints,
      laneCounts
    );
    if (match) {
      const score = evaluateMatch(match, config.tolerance);
      if (score < bestScore) {
        bestMatch = match;
        bestScore = score;

        // If we found a perfect match (score = 0), return it immediately
        if (score === 0) {
          break;
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Generate a random match respecting all constraints with role variety
 */
function generateRandomMatch(
  players: Array<{ playerId: string | number; name: string; ranks: number[] }>,
  fixedPairings: Array<Array<(typeof players)[0] | null>>,
  avoidRoleConstraints: Map<string | number, Set<number>>,
  comboConstraints: Map<string | number, Set<string | number>>,
  laneCounts: Map<string | number, number[]> = new Map()
): MatchResult | null {
  const roles = ["Top", "Jungle", "Mid", "Adc", "Support"];
  const solution: Array<(typeof players)[0]> = new Array(10);

  // Place fixed players first
  const usedPlayers = new Set<string | number>();

  for (let roleIndex = 0; roleIndex < 5; roleIndex++) {
    const [player1, player2] = fixedPairings[roleIndex];
    if (player1) {
      solution[roleIndex * 2] = player1;
      usedPlayers.add(player1.playerId);
    }
    if (player2) {
      solution[roleIndex * 2 + 1] = player2;
      usedPlayers.add(player2.playerId);
    }
  }

  // Get available players
  const availablePlayers = players.filter((p) => !usedPlayers.has(p.playerId));

  // Shuffle available players
  for (let i = availablePlayers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availablePlayers[i], availablePlayers[j]] = [
      availablePlayers[j],
      availablePlayers[i],
    ];
  }

  // Fill remaining slots with role variety consideration
  for (let i = 0; i < 10; i++) {
    if (!solution[i]) {
      const roleIndex = Math.floor(i / 2);
      const teamSide = i % 2; // 0 for blue team, 1 for red team

      // Find a player that doesn't violate constraints
      let placed = false;
      let bestPlayer: (typeof players)[0] | null = null;
      let bestScore = Infinity;

      // Try to find a player with role variety preference
      for (let j = 0; j < availablePlayers.length; j++) {
        const player = availablePlayers[j];

        // Check avoid role constraint
        if (
          avoidRoleConstraints.has(player.playerId) &&
          avoidRoleConstraints.get(player.playerId)!.has(roleIndex)
        ) {
          continue;
        }

        // Check combo constraint (players in same combo must be on same team)
        if (comboConstraints.has(player.playerId)) {
          const teammates = comboConstraints.get(player.playerId)!;

          // Check if any teammate is already placed on the opposite team
          let validForCombo = true;
          for (let k = 0; k < i; k++) {
            if (solution[k] && teammates.has(solution[k].playerId)) {
              const teammateSide = k % 2;
              if (teammateSide !== teamSide) {
                validForCombo = false;
                break;
              }
            }
          }

          if (!validForCombo) continue;
        }

        // Calculate role variety score (lower is better)
        const playerLaneCounts =
          laneCounts.get(player.playerId) || Array(5).fill(0);
        const roleVarietyScore = playerLaneCounts[roleIndex]; // How many times they've played this role

        // If this is a good candidate (low role variety score), use it
        if (roleVarietyScore < bestScore) {
          bestPlayer = player;
          bestScore = roleVarietyScore;
        }
      }

      if (bestPlayer) {
        solution[i] = bestPlayer;

        // Update lane counts for role variety tracking
        const playerLaneCounts =
          laneCounts.get(bestPlayer.playerId) || Array(5).fill(0);
        playerLaneCounts[roleIndex]++;
        laneCounts.set(bestPlayer.playerId, playerLaneCounts);

        // Remove player from available list
        const playerIndex = availablePlayers.findIndex(
          (p) => p.playerId === bestPlayer!.playerId
        );
        if (playerIndex !== -1) {
          availablePlayers.splice(playerIndex, 1);
        }

        placed = true;
      }

      if (!placed) {
        return null; // Couldn't place all players
      }
    }
  }

  // Format the result
  const pairingsRoles: {
    [role: string]: Array<{ name: string; rank: number }>;
  } = {};
  const matchScore = { blue: 0, red: 0 };

  for (let i = 0; i < 5; i++) {
    const role = roles[i];
    const player1 = solution[i * 2];
    const player2 = solution[i * 2 + 1];

    pairingsRoles[role] = [
      { name: player1.name, rank: player1.ranks[i] },
      { name: player2.name, rank: player2.ranks[i] },
    ];

    matchScore.blue += player1.ranks[i];
    matchScore.red += player2.ranks[i];
  }

  return {
    pairingsRoles,
    matchScore,
    pairings: solution.map((player) => ({
      account_id: player.playerId,
      name: player.name,
      name_id: player.name.toLowerCase().replace(/\s+/g, ""),
      top: player.ranks[0],
      jungle: player.ranks[1],
      mid: player.ranks[2],
      adc: player.ranks[3],
      support: player.ranks[4],
    })),
  };
}

/**
 * Evaluate a match and return its score (lower is better)
 */
function evaluateMatch(match: MatchResult, tolerance: number): number {
  const roles = ["Top", "Jungle", "Mid", "Adc", "Support"];
  let totalScore = 0;

  // Check lane tolerance
  for (const role of roles) {
    const [player1, player2] = match.pairingsRoles[role];
    const laneDiff = Math.abs(player1.rank - player2.rank);
    if (laneDiff > tolerance) {
      return Infinity; // Invalid match
    }
    totalScore += laneDiff;
  }

  // Check team balance
  const teamDiff = Math.abs(match.matchScore.blue - match.matchScore.red);
  totalScore += teamDiff;

  return totalScore;
}
