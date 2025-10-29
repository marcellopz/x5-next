import { generateMatches } from "@/lib/matchmaking-algorithm";
import { TestDataGenerator } from "@/lib/test-data-generator";
import type { MatchmakingConfig } from "@/components/matchmaking/matchmaking-context";

/**
 * Demo script showing how to use the matchmaking algorithm
 */
function runDemo() {
  console.log("🎮 Matchmaking Algorithm Demo\n");

  // Example 1: Basic matchmaking
  console.log("1. Basic Matchmaking");
  console.log("-".repeat(40));

  const players = TestDataGenerator.generateBalancedPlayers();
  const basicConfig = TestDataGenerator.getDefaultConfig();

  const result1 = generateMatches(players, basicConfig);

  if (result1.success) {
    console.log(`✅ Generated ${result1.matches.length} matches`);
    const match = result1.matches[0];
    console.log("First match team scores:", match.matchScore);
    console.log(
      "Top lane:",
      match.pairingsRoles.Top.map((p) => `${p.name} (${p.rank})`).join(" vs ")
    );
  } else {
    console.log("❌ Failed:", result1.error);
  }

  // Example 2: With preset lanes
  console.log("\n2. Matchmaking with Preset Lanes");
  console.log("-".repeat(40));

  const presetConfig: MatchmakingConfig = {
    ...basicConfig,
    presetLanes: {
      usePresetLanes: true,
      randomizeSides: false,
      lanes: {
        top: { player1: players[0], player2: players[1] },
        jungle: { player1: null, player2: null },
        mid: { player1: null, player2: null },
        adc: { player1: null, player2: null },
        support: { player1: null, player2: null },
      },
    },
  };

  const result2 = generateMatches(players, presetConfig);

  if (result2.success) {
    console.log(
      `✅ Generated ${result2.matches.length} matches with preset top lane`
    );
    const match = result2.matches[0];
    console.log(
      "Top lane (preset):",
      match.pairingsRoles.Top.map((p) => `${p.name} (${p.rank})`).join(" vs ")
    );
  } else {
    console.log("❌ Failed:", result2.error);
  }

  // Example 3: With avoid roles
  console.log("\n3. Matchmaking with Avoid Roles");
  console.log("-".repeat(40));

  const avoidConfig: MatchmakingConfig = {
    ...basicConfig,
    avoidRoles: {
      enabled: true,
      rules: [
        { playerId: players[0].account_id, lane: "top" },
        { playerId: players[1].account_id, lane: "jungle" },
      ],
    },
  };

  const result3 = generateMatches(players, avoidConfig);

  if (result3.success) {
    console.log(
      `✅ Generated ${result3.matches.length} matches with avoid roles`
    );
    const match = result3.matches[0];
    console.log(
      "Top lane (avoided):",
      match.pairingsRoles.Top.map((p) => `${p.name} (${p.rank})`).join(" vs ")
    );
    console.log(
      "Jungle lane (avoided):",
      match.pairingsRoles.Jungle.map((p) => `${p.name} (${p.rank})`).join(
        " vs "
      )
    );
  } else {
    console.log("❌ Failed:", result3.error);
  }

  // Example 4: With player combos
  console.log("\n4. Matchmaking with Player Combos");
  console.log("-".repeat(40));

  const comboConfig: MatchmakingConfig = {
    ...basicConfig,
    playerCombos: {
      enabled: true,
      combos: [
        {
          id: "combo1",
          players: [players[0], players[1], players[2]],
        },
      ],
    },
  };

  const result4 = generateMatches(players, comboConfig);

  if (result4.success) {
    console.log(
      `✅ Generated ${result4.matches.length} matches with player combo`
    );
    const match = result4.matches[0];

    // Check which team the combo players are on
    const comboPlayerIds = new Set([
      players[0].account_id,
      players[1].account_id,
      players[2].account_id,
    ]);
    const teamAssignments = new Map();

    match.pairings.forEach((player, index) => {
      if (comboPlayerIds.has(player.account_id)) {
        teamAssignments.set(player.name, index % 2 === 0 ? "Blue" : "Red");
      }
    });

    console.log("Combo players team assignments:");
    teamAssignments.forEach((team, playerName) => {
      console.log(`  ${playerName}: ${team} team`);
    });
  } else {
    console.log("❌ Failed:", result4.error);
  }

  // Example 5: Complex scenario
  console.log("\n5. Complex Scenario (All Constraints)");
  console.log("-".repeat(40));

  const complexConfig: MatchmakingConfig = {
    ...basicConfig,
    tolerance: 2,
    presetLanes: {
      usePresetLanes: true,
      randomizeSides: false,
      lanes: {
        top: { player1: players[0], player2: null },
        jungle: { player1: null, player2: null },
        mid: { player1: null, player2: null },
        adc: { player1: null, player2: null },
        support: { player1: null, player2: null },
      },
    },
    avoidRoles: {
      enabled: true,
      rules: [{ playerId: players[1].account_id, lane: "jungle" }],
    },
    playerCombos: {
      enabled: true,
      combos: [
        {
          id: "combo1",
          players: [players[2], players[3]],
        },
      ],
    },
  };

  const result5 = generateMatches(players, complexConfig);

  if (result5.success) {
    console.log(
      `✅ Generated ${result5.matches.length} matches with all constraints`
    );
    const match = result5.matches[0];

    console.log("Constraints applied:");
    console.log("  ✅ Preset top lane:", match.pairingsRoles.Top[0].name);
    console.log(
      "  ✅ Avoided jungle:",
      match.pairingsRoles.Jungle.map((p) => p.name).join(", ")
    );

    // Check combo
    const comboPlayerIds = new Set([
      players[2].account_id,
      players[3].account_id,
    ]);
    const teamAssignments = new Map();
    match.pairings.forEach((player, index) => {
      if (comboPlayerIds.has(player.account_id)) {
        teamAssignments.set(player.name, index % 2 === 0 ? "Blue" : "Red");
      }
    });

    const teams = Array.from(teamAssignments.values());
    console.log(
      "  ✅ Combo players on same team:",
      new Set(teams).size === 1 ? "Yes" : "No"
    );
  } else {
    console.log("❌ Failed:", result5.error);
  }

  console.log("\n🎉 Demo completed!");
  console.log("\nTo run comprehensive tests:");
  console.log("npm run test:matchmaking:comprehensive");
}

// Run the demo
runDemo();
