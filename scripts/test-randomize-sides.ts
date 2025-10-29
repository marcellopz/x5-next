import { generateMatches } from "@/lib/matchmaking-algorithm";
import { TestDataGenerator } from "@/lib/test-data-generator";

/**
 * Test script to verify randomize sides functionality
 */
function testRandomizeSides() {
  console.log("🎲 Testing Randomize Sides Functionality\n");

  // Create test players
  const players = [
    {
      account_id: 1,
      name: "Player1",
      name_id: "player1",
      top: 5,
      jungle: 3,
      mid: 4,
      adc: 6,
      support: 7,
    },
    {
      account_id: 2,
      name: "Player2",
      name_id: "player2",
      top: 6,
      jungle: 4,
      mid: 5,
      adc: 7,
      support: 8,
    },
    {
      account_id: 3,
      name: "Player3",
      name_id: "player3",
      top: 4,
      jungle: 5,
      mid: 6,
      adc: 8,
      support: 9,
    },
    {
      account_id: 4,
      name: "Player4",
      name_id: "player4",
      top: 7,
      jungle: 6,
      mid: 7,
      adc: 9,
      support: 10,
    },
    {
      account_id: 5,
      name: "Player5",
      name_id: "player5",
      top: 3,
      jungle: 7,
      mid: 8,
      adc: 10,
      support: 11,
    },
    {
      account_id: 6,
      name: "Player6",
      name_id: "player6",
      top: 8,
      jungle: 8,
      mid: 9,
      adc: 11,
      support: 12,
    },
    {
      account_id: 7,
      name: "Player7",
      name_id: "player7",
      top: 9,
      jungle: 9,
      mid: 10,
      adc: 12,
      support: 13,
    },
    {
      account_id: 8,
      name: "Player8",
      name_id: "player8",
      top: 10,
      jungle: 10,
      mid: 11,
      adc: 13,
      support: 14,
    },
    {
      account_id: 9,
      name: "Player9",
      name_id: "player9",
      top: 11,
      jungle: 11,
      mid: 12,
      adc: 14,
      support: 15,
    },
    {
      account_id: 10,
      name: "Player10",
      name_id: "player10",
      top: 12,
      jungle: 12,
      mid: 13,
      adc: 15,
      support: 16,
    },
  ];

  // Test with randomize sides enabled
  console.log("1️⃣ Testing with Randomize Sides ENABLED");
  console.log("-".repeat(50));

  const configWithRandomize = {
    ...TestDataGenerator.getDefaultConfig(),
    matchOptions: 5,
    presetLanes: {
      usePresetLanes: true,
      randomizeSides: true,
      lanes: {
        top: { player1: players[0], player2: players[1] },
        jungle: { player1: players[2], player2: players[3] },
        mid: { player1: null, player2: null },
        adc: { player1: null, player2: null },
        support: { player1: null, player2: null },
      },
    },
  };

  const resultWithRandomize = generateMatches(players, configWithRandomize);

  if (resultWithRandomize.success) {
    console.log(
      `✅ Generated ${resultWithRandomize.matches.length} matches with randomize sides`
    );

    resultWithRandomize.matches.forEach((match, index) => {
      console.log(`\nMatch ${index + 1}:`);
      console.log(
        `  Top: ${match.pairingsRoles.Top[0].name} vs ${match.pairingsRoles.Top[1].name}`
      );
      console.log(
        `  Jungle: ${match.pairingsRoles.Jungle[0].name} vs ${match.pairingsRoles.Jungle[1].name}`
      );
    });
  } else {
    console.log("❌ Failed:", resultWithRandomize.error);
  }

  // Test with randomize sides disabled
  console.log("\n\n2️⃣ Testing with Randomize Sides DISABLED");
  console.log("-".repeat(50));

  const configWithoutRandomize = {
    ...configWithRandomize,
    presetLanes: {
      ...configWithRandomize.presetLanes,
      randomizeSides: false,
    },
  };

  const resultWithoutRandomize = generateMatches(
    players,
    configWithoutRandomize
  );

  if (resultWithoutRandomize.success) {
    console.log(
      `✅ Generated ${resultWithoutRandomize.matches.length} matches without randomize sides`
    );

    resultWithoutRandomize.matches.forEach((match, index) => {
      console.log(`\nMatch ${index + 1}:`);
      console.log(
        `  Top: ${match.pairingsRoles.Top[0].name} vs ${match.pairingsRoles.Top[1].name}`
      );
      console.log(
        `  Jungle: ${match.pairingsRoles.Jungle[0].name} vs ${match.pairingsRoles.Jungle[1].name}`
      );
    });
  } else {
    console.log("❌ Failed:", resultWithoutRandomize.error);
  }

  // Analyze randomization
  console.log("\n\n📊 Randomization Analysis:");
  console.log("-".repeat(50));

  if (resultWithRandomize.success && resultWithoutRandomize.success) {
    const randomizedMatches = resultWithRandomize.matches;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fixedMatches = resultWithoutRandomize.matches;

    // Check if randomization actually occurred
    let randomizationDetected = false;

    randomizedMatches.forEach((match, index) => {
      const topLane = match.pairingsRoles.Top;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const jungleLane = match.pairingsRoles.Jungle;

      // Check if Player1 and Player2 are in different positions than expected
      const player1InTop0 = topLane[0].name === "Player1";
      const player2InTop1 = topLane[1].name === "Player2";

      if (!player1InTop0 || !player2InTop1) {
        randomizationDetected = true;
        console.log(`✅ Randomization detected in Match ${index + 1}:`);
        console.log(`   Top: ${topLane[0].name} vs ${topLane[1].name}`);
      }
    });

    if (!randomizationDetected) {
      console.log(
        "⚠️  No randomization detected - this could be due to random chance"
      );
    }

    // Check team distribution
    console.log("\n🎯 Team Distribution Analysis:");
    const teamAssignments = new Map();

    randomizedMatches.forEach((match) => {
      const topLane = match.pairingsRoles.Top;
      const jungleLane = match.pairingsRoles.Jungle;

      // Track which team Player1 and Player2 are on
      const player1Team = topLane[0].name === "Player1" ? "Blue" : "Red";
      const player2Team = topLane[1].name === "Player2" ? "Red" : "Blue";
      const player3Team = jungleLane[0].name === "Player3" ? "Blue" : "Red";
      const player4Team = jungleLane[1].name === "Player4" ? "Red" : "Blue";

      const key = `${player1Team}-${player2Team}-${player3Team}-${player4Team}`;
      teamAssignments.set(key, (teamAssignments.get(key) || 0) + 1);
    });

    console.log("Team assignment patterns:");
    teamAssignments.forEach((count, pattern) => {
      console.log(`  ${pattern}: ${count} matches`);
    });

    if (teamAssignments.size > 1) {
      console.log(
        "✅ Multiple team assignment patterns detected - randomization is working!"
      );
    } else {
      console.log(
        "⚠️  Only one team assignment pattern - may need more matches to see variation"
      );
    }
  }

  console.log("\n🎉 Randomize sides test completed!");
}

// Run the test
testRandomizeSides();
