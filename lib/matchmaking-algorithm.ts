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
  allMatches: MatchResult[]; // All matches meeting tolerance
  filteredMatches: MatchResult[]; // Matches also meeting advanced constraints
  success: boolean;
  error?: string;
}

const roles = ["Top", "Jungle", "Mid", "Adc", "Support"] as const;

/**
 * Main matchmaking algorithm that generates all valid matches
 */
export function generateMatches(
  players: Player[],
  config: MatchmakingConfig
): MatchmakingResult {
  try {
    // Validate input
    if (players.length !== 10) {
      return {
        allMatches: [],
        filteredMatches: [],
        success: false,
        error: "Exactly 10 players are required for matchmaking",
      };
    }

    // Check if preset lanes violate tolerance
    const hasPresetLanesWithToleranceViolation =
      checkPresetLanesToleranceViolation(players, config);

    // Generate all matches that meet tolerance
    // Use alternative function if preset lanes violate tolerance
    const allMatches = hasPresetLanesWithToleranceViolation
      ? generateMatchesWithPresetLanesTolerance(players, config)
      : generateAllToleranceMatches(players, config.tolerance);

    if (allMatches.length === 0) {
      return {
        allMatches: [],
        filteredMatches: [],
        success: false,
        error: "No valid matches found meeting tolerance requirements",
      };
    }

    // Check if any advanced configs are enabled before filtering
    const hasAdvancedConfigs =
      config.presetLanes.usePresetLanes ||
      (config.avoidRoles.enabled &&
        config.avoidRoles.rules.filter((rule) => rule.playerId !== "").length >
          0) ||
      (config.playerCombos.enabled && config.playerCombos.combos.length > 0);

    // Filter matches by advanced settings only if any are enabled
    const filteredMatches = hasAdvancedConfigs
      ? filterMatchesByConstraints(allMatches, config)
      : allMatches;

    return {
      allMatches,
      filteredMatches,
      success: true,
    };
  } catch (error) {
    return {
      allMatches: [],
      filteredMatches: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Generate all possible matches that meet the tolerance requirement
 * Uses a role-by-role approach for efficiency
 */
function generateAllToleranceMatches(
  players: Player[],
  tolerance: number
): MatchResult[] {
  const matches: MatchResult[] = [];

  // Convert players to internal format
  const playerData = players.map((p) => ({
    player: p,
    ranks: [p.top, p.jungle, p.mid, p.adc, p.support],
  }));

  // For each role, we'll pair blue and red players
  // assignment[roleIndex][0] = blue player, assignment[roleIndex][1] = red player
  const assignment: Array<
    [(typeof playerData)[0] | null, (typeof playerData)[0] | null]
  > = roles.map(() => [null, null]);

  const usedPlayers = new Set<number>();

  function backtrack(roleIndex: number) {
    if (roleIndex === 5) {
      // All roles filled, create match
      // At this point, all assignments are non-null
      const match = createMatchFromRoleAssignment(
        assignment as Array<
          [
            { player: Player; ranks: number[] },
            { player: Player; ranks: number[] }
          ]
        >
      );
      if (match) {
        // Check that team scores are equal (both conditions must be met)
        if (match.matchScore.blue === match.matchScore.red) {
          matches.push(match);
        }
      }
      return;
    }

    // Try all possible blue-red pairs for this role
    for (let blueIdx = 0; blueIdx < playerData.length; blueIdx++) {
      if (usedPlayers.has(blueIdx)) continue;

      const bluePlayer = playerData[blueIdx];
      const blueRank = bluePlayer.ranks[roleIndex];

      for (let redIdx = 0; redIdx < playerData.length; redIdx++) {
        if (blueIdx === redIdx || usedPlayers.has(redIdx)) continue;

        const redPlayer = playerData[redIdx];
        const redRank = redPlayer.ranks[roleIndex];

        // Check lane tolerance (each lane must meet tolerance)
        if (Math.abs(blueRank - redRank) > tolerance) {
          continue;
        }

        // Place both players for this role
        assignment[roleIndex] = [bluePlayer, redPlayer];
        usedPlayers.add(blueIdx);
        usedPlayers.add(redIdx);

        // Continue to next role
        backtrack(roleIndex + 1);

        // Backtrack
        usedPlayers.delete(blueIdx);
        usedPlayers.delete(redIdx);
        assignment[roleIndex] = [null, null];
      }
    }
  }

  backtrack(0);
  return matches;
}

/**
 * Create a MatchResult from a role assignment array
 */
function createMatchFromRoleAssignment(
  assignment: Array<
    [{ player: Player; ranks: number[] }, { player: Player; ranks: number[] }]
  >
): MatchResult | null {
  const pairingsRoles: {
    [role: string]: Array<{ name: string; rank: number }>;
  } = {};
  const matchScore = { blue: 0, red: 0 };
  const pairings: Player[] = [];

  // Process each role
  for (let roleIndex = 0; roleIndex < 5; roleIndex++) {
    const role = roles[roleIndex];
    const [bluePlayer, redPlayer] = assignment[roleIndex];

    if (!bluePlayer || !redPlayer) {
      return null;
    }

    const blueRank = bluePlayer.ranks[roleIndex];
    const redRank = redPlayer.ranks[roleIndex];

    pairingsRoles[role] = [
      { name: bluePlayer.player.name, rank: blueRank },
      { name: redPlayer.player.name, rank: redRank },
    ];

    matchScore.blue += blueRank;
    matchScore.red += redRank;
  }

  // Create pairings array in order: blue team roles, then red team roles
  for (let i = 0; i < 5; i++) {
    pairings.push(assignment[i][0].player);
  }
  for (let i = 0; i < 5; i++) {
    pairings.push(assignment[i][1].player);
  }

  return {
    pairingsRoles,
    matchScore,
    pairings,
  };
}

/**
 * Check if preset lanes violate tolerance requirements
 */
function checkPresetLanesToleranceViolation(
  players: Player[],
  config: MatchmakingConfig
): boolean {
  if (!config.presetLanes.usePresetLanes) {
    return false;
  }

  const roleIndexMap: Record<string, number> = {
    top: 0,
    jungle: 1,
    mid: 2,
    adc: 3,
    support: 4,
  };

  // Check each preset lane for tolerance violations
  for (const [laneKey, laneConfig] of Object.entries(
    config.presetLanes.lanes
  )) {
    if (laneConfig.player1 && laneConfig.player2) {
      const roleIndex = roleIndexMap[laneKey];

      // Get rank for the specific role
      const player1Rank = [
        laneConfig.player1.top,
        laneConfig.player1.jungle,
        laneConfig.player1.mid,
        laneConfig.player1.adc,
        laneConfig.player1.support,
      ][roleIndex];

      const player2Rank = [
        laneConfig.player2.top,
        laneConfig.player2.jungle,
        laneConfig.player2.mid,
        laneConfig.player2.adc,
        laneConfig.player2.support,
      ][roleIndex];

      // If the rank difference exceeds tolerance, we need alternative matching
      if (Math.abs(player1Rank - player2Rank) > config.tolerance) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Generate matches that allow preset lanes to bypass lane tolerance
 * Still ensures team scores are equal and non-preset lanes meet tolerance
 */
function generateMatchesWithPresetLanesTolerance(
  players: Player[],
  config: MatchmakingConfig
): MatchResult[] {
  const matches: MatchResult[] = [];

  // Convert players to internal format
  const playerData = players.map((p) => ({
    player: p,
    ranks: [p.top, p.jungle, p.mid, p.adc, p.support],
  }));

  const roleIndexMap: Record<string, number> = {
    top: 0,
    jungle: 1,
    mid: 2,
    adc: 3,
    support: 4,
  };

  // Helper function to generate matches with a specific preset lane assignment
  function generateWithPresetAssignment(
    presetAssignments: Array<{
      roleIndex: number;
      bluePlayer: (typeof playerData)[0];
      redPlayer: (typeof playerData)[0];
    }>
  ): MatchResult[] {
    const localMatches: MatchResult[] = [];
    const assignment: Array<
      [(typeof playerData)[0] | null, (typeof playerData)[0] | null]
    > = roles.map(() => [null, null]);
    const usedPlayers = new Set<number>();
    const presetLaneIndices = new Set<number>();

    // Apply preset assignments
    for (const preset of presetAssignments) {
      assignment[preset.roleIndex] = [preset.bluePlayer, preset.redPlayer];
      usedPlayers.add(
        playerData.findIndex(
          (p) => p.player.account_id === preset.bluePlayer.player.account_id
        )
      );
      usedPlayers.add(
        playerData.findIndex(
          (p) => p.player.account_id === preset.redPlayer.player.account_id
        )
      );
      presetLaneIndices.add(preset.roleIndex);
    }

    function backtrack(roleIndex: number) {
      if (roleIndex === 5) {
        // All roles filled, create match
        const match = createMatchFromRoleAssignment(
          assignment as Array<
            [
              { player: Player; ranks: number[] },
              { player: Player; ranks: number[] }
            ]
          >
        );
        if (match) {
          // Check that team scores are equal
          if (match.matchScore.blue === match.matchScore.red) {
            localMatches.push(match);
          }
        }
        return;
      }

      // If this role is preset, skip to next role
      if (presetLaneIndices.has(roleIndex)) {
        backtrack(roleIndex + 1);
        return;
      }

      // Try all possible blue-red pairs for this role
      for (let blueIdx = 0; blueIdx < playerData.length; blueIdx++) {
        if (usedPlayers.has(blueIdx)) continue;

        const bluePlayer = playerData[blueIdx];
        const blueRank = bluePlayer.ranks[roleIndex];

        for (let redIdx = 0; redIdx < playerData.length; redIdx++) {
          if (blueIdx === redIdx || usedPlayers.has(redIdx)) continue;

          const redPlayer = playerData[redIdx];
          const redRank = redPlayer.ranks[roleIndex];

          // Check lane tolerance only for non-preset lanes
          if (Math.abs(blueRank - redRank) > config.tolerance) {
            continue;
          }

          // Place both players for this role
          assignment[roleIndex] = [bluePlayer, redPlayer];
          usedPlayers.add(blueIdx);
          usedPlayers.add(redIdx);

          // Continue to next role
          backtrack(roleIndex + 1);

          // Backtrack
          usedPlayers.delete(blueIdx);
          usedPlayers.delete(redIdx);
          assignment[roleIndex] = [null, null];
        }
      }
    }

    backtrack(0);
    return localMatches;
  }

  // Collect preset lane assignments
  const presetLanes = config.presetLanes.lanes;
  const presetAssignments: Array<{
    roleIndex: number;
    bluePlayer: (typeof playerData)[0];
    redPlayer: (typeof playerData)[0];
  }> = [];

  if (config.presetLanes.usePresetLanes) {
    for (const [laneKey, laneConfig] of Object.entries(presetLanes)) {
      if (laneConfig.player1 && laneConfig.player2) {
        const roleIndex = roleIndexMap[laneKey];

        const player1 = playerData.find(
          (p) => p.player.account_id === laneConfig.player1!.account_id
        );
        const player2 = playerData.find(
          (p) => p.player.account_id === laneConfig.player2!.account_id
        );

        if (player1 && player2) {
          if (config.presetLanes.randomizeSides) {
            // Generate both variations: player1 vs player2 and player2 vs player1
            presetAssignments.push({
              roleIndex,
              bluePlayer: player1,
              redPlayer: player2,
            });
            presetAssignments.push({
              roleIndex,
              bluePlayer: player2,
              redPlayer: player1,
            });
          } else {
            // Fixed sides: player1 vs player2
            presetAssignments.push({
              roleIndex,
              bluePlayer: player1,
              redPlayer: player2,
            });
          }
        }
      }
    }
  }

  // Generate matches for each preset assignment combination
  // If there are multiple preset lanes with randomizeSides, we generate all combinations
  if (presetAssignments.length === 0) {
    // No preset lanes, use regular function (shouldn't happen but safety check)
    return generateAllToleranceMatches(players, config.tolerance);
  }

  // Group preset assignments by role to handle multiple preset lanes correctly
  const presetByRole = new Map<
    number,
    Array<{
      bluePlayer: (typeof playerData)[0];
      redPlayer: (typeof playerData)[0];
    }>
  >();

  for (const preset of presetAssignments) {
    if (!presetByRole.has(preset.roleIndex)) {
      presetByRole.set(preset.roleIndex, []);
    }
    presetByRole.get(preset.roleIndex)!.push({
      bluePlayer: preset.bluePlayer,
      redPlayer: preset.redPlayer,
    });
  }

  // Generate all combinations of preset assignments
  const roleIndices = Array.from(presetByRole.keys());
  const combinations: Array<
    Array<{
      roleIndex: number;
      bluePlayer: (typeof playerData)[0];
      redPlayer: (typeof playerData)[0];
    }>
  > = [];

  function generateCombinations(
    roleIdx: number,
    current: Array<{
      roleIndex: number;
      bluePlayer: (typeof playerData)[0];
      redPlayer: (typeof playerData)[0];
    }>
  ) {
    if (roleIdx === roleIndices.length) {
      combinations.push([...current]);
      return;
    }

    const roleIndex = roleIndices[roleIdx];
    const variations = presetByRole.get(roleIndex)!;
    for (const variation of variations) {
      current.push({ roleIndex, ...variation });
      generateCombinations(roleIdx + 1, current);
      current.pop();
    }
  }

  generateCombinations(0, []);

  // Generate matches for each combination
  for (const combination of combinations) {
    const combinationMatches = generateWithPresetAssignment(combination);
    matches.push(...combinationMatches);
  }

  return matches;
}

/**
 * Filter matches by advanced constraints (preset lanes, avoid roles, player combos)
 */
function filterMatchesByConstraints(
  matches: MatchResult[],
  config: MatchmakingConfig
): MatchResult[] {
  return matches.filter((match) => {
    // Check preset lanes constraint
    if (config.presetLanes.usePresetLanes) {
      if (!matchesPresetLanes(match, config.presetLanes)) {
        return false;
      }
    }

    // Check avoid roles constraint
    if (config.avoidRoles.enabled) {
      if (!matchesAvoidRoles(match, config.avoidRoles)) {
        return false;
      }
    }

    // Check player combos constraint
    if (config.playerCombos.enabled && config.playerCombos.combos.length > 0) {
      if (!matchesPlayerCombos(match, config.playerCombos)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Check if a match satisfies preset lanes constraints
 */
function matchesPresetLanes(
  match: MatchResult,
  presetLanesConfig: MatchmakingConfig["presetLanes"]
): boolean {
  const roleIndexMap: Record<string, number> = {
    top: 0,
    jungle: 1,
    mid: 2,
    adc: 3,
    support: 4,
  };

  // Create a map of player account_id to their position in match
  const playerPositions = new Map<
    string | number,
    { roleIndex: number; isBlue: boolean }
  >();

  for (let i = 0; i < match.pairings.length; i++) {
    const player = match.pairings[i];
    const roleIndex = i % 5;
    const isBlue = i < 5;
    playerPositions.set(player.account_id, { roleIndex, isBlue });
  }

  for (const [laneKey, laneConfig] of Object.entries(presetLanesConfig.lanes)) {
    const expectedRoleIndex = roleIndexMap[laneKey];

    if (laneConfig.player1 && laneConfig.player2) {
      // Both players must be in this lane
      const player1Pos = playerPositions.get(laneConfig.player1.account_id);
      const player2Pos = playerPositions.get(laneConfig.player2.account_id);

      if (!player1Pos || !player2Pos) {
        return false;
      }

      // Both must be in the correct role
      if (
        player1Pos.roleIndex !== expectedRoleIndex ||
        player2Pos.roleIndex !== expectedRoleIndex
      ) {
        return false;
      }

      // If randomizeSides is false, check exact positioning
      if (!presetLanesConfig.randomizeSides) {
        if (!player1Pos.isBlue || player2Pos.isBlue) {
          return false; // player1 must be blue, player2 must be red
        }
      }
    } else if (laneConfig.player1) {
      // Only player1 must be in this lane
      const player1Pos = playerPositions.get(laneConfig.player1.account_id);

      if (!player1Pos || player1Pos.roleIndex !== expectedRoleIndex) {
        return false;
      }

      // If randomizeSides is false, must be on blue team
      if (!presetLanesConfig.randomizeSides && !player1Pos.isBlue) {
        return false;
      }
    } else if (laneConfig.player2) {
      // Only player2 must be in this lane
      const player2Pos = playerPositions.get(laneConfig.player2.account_id);

      if (!player2Pos || player2Pos.roleIndex !== expectedRoleIndex) {
        return false;
      }

      // If randomizeSides is false, must be on red team
      if (!presetLanesConfig.randomizeSides && player2Pos.isBlue) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if a match satisfies avoid roles constraints
 */
function matchesAvoidRoles(
  match: MatchResult,
  avoidRolesConfig: MatchmakingConfig["avoidRoles"]
): boolean {
  const roleIndexMap: Record<string, number> = {
    top: 0,
    jungle: 1,
    mid: 2,
    adc: 3,
    support: 4,
  };

  // Create a map of player positions using normalized IDs (strings) for consistent comparison
  const playerPositions = new Map<string, number>();
  for (let i = 0; i < match.pairings.length; i++) {
    const player = match.pairings[i];
    const roleIndex = i % 5;
    // Normalize account_id to string for consistent comparison
    const normalizedId = String(player.account_id);
    playerPositions.set(normalizedId, roleIndex);
  }

  for (const rule of avoidRolesConfig.rules) {
    const avoidedRoleIndex = roleIndexMap[rule.lane];
    // Normalize rule.playerId to string for consistent comparison
    const normalizedPlayerId = String(rule.playerId);
    const playerRoleIndex = playerPositions.get(normalizedPlayerId);

    // If player is in the avoided role, match is invalid
    if (playerRoleIndex !== undefined && playerRoleIndex === avoidedRoleIndex) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a match satisfies player combos constraints
 */
function matchesPlayerCombos(
  match: MatchResult,
  playerCombosConfig: MatchmakingConfig["playerCombos"]
): boolean {
  if (playerCombosConfig.combos.length === 0) {
    return true;
  }

  // Only one combo is allowed
  const combo = playerCombosConfig.combos[0];
  const comboPlayerIds = new Set(combo.players.map((p) => p.account_id));

  // Check if all combo players are on the same team
  // Positions 0-4 are blue team, 5-9 are red team
  const teamAssignments = new Map<number | string, number>();

  for (let i = 0; i < match.pairings.length; i++) {
    const player = match.pairings[i];
    if (comboPlayerIds.has(player.account_id)) {
      const team = i < 5 ? 0 : 1; // 0 = blue, 1 = red
      teamAssignments.set(player.account_id, team);
    }
  }

  // All combo players must be on the same team
  const teams = Array.from(teamAssignments.values());
  if (teams.length === 0) {
    return false; // No combo players found
  }

  const allSameTeam = new Set(teams).size === 1;
  return allSameTeam;
}
