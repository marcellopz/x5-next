import { generateMatches } from "@/lib/matchmaking-algorithm";
import { TestDataGenerator } from "@/lib/test-data-generator";

/**
 * Test script to verify role variety is working
 */
function testRoleVariety() {
  console.log("🎯 Testing Role Variety Algorithm\n");

  // Create players with distinct role strengths
  const players = [
    {
      account_id: 1,
      name: "TopMain",
      name_id: "topmain",
      top: 9,
      jungle: 2,
      mid: 3,
      adc: 4,
      support: 5,
    },
    {
      account_id: 2,
      name: "JungleMain",
      name_id: "junglemain",
      top: 2,
      jungle: 9,
      mid: 3,
      adc: 4,
      support: 5,
    },
    {
      account_id: 3,
      name: "MidMain",
      name_id: "midmain",
      top: 2,
      jungle: 3,
      mid: 9,
      adc: 4,
      support: 5,
    },
    {
      account_id: 4,
      name: "AdcMain",
      name_id: "adcmain",
      top: 2,
      jungle: 3,
      mid: 4,
      adc: 9,
      support: 5,
    },
    {
      account_id: 5,
      name: "SupportMain",
      name_id: "supportmain",
      top: 2,
      jungle: 3,
      mid: 4,
      adc: 5,
      support: 9,
    },
    {
      account_id: 6,
      name: "Flex1",
      name_id: "flex1",
      top: 5,
      jungle: 5,
      mid: 5,
      adc: 5,
      support: 5,
    },
    {
      account_id: 7,
      name: "Flex2",
      name_id: "flex2",
      top: 5,
      jungle: 5,
      mid: 5,
      adc: 5,
      support: 5,
    },
    {
      account_id: 8,
      name: "Flex3",
      name_id: "flex3",
      top: 5,
      jungle: 5,
      mid: 5,
      adc: 5,
      support: 5,
    },
    {
      account_id: 9,
      name: "Flex4",
      name_id: "flex4",
      top: 5,
      jungle: 5,
      mid: 5,
      adc: 5,
      support: 5,
    },
    {
      account_id: 10,
      name: "Flex5",
      name_id: "flex5",
      top: 5,
      jungle: 5,
      mid: 5,
      adc: 5,
      support: 5,
    },
  ];

  const config = TestDataGenerator.getDefaultConfig();
  config.matchOptions = 10; // Generate more matches to see variety

  console.log("Players:");
  players.forEach((player) => {
    console.log(
      `  ${player.name}: T${player.top} J${player.jungle} M${player.mid} A${player.adc} S${player.support}`
    );
  });

  const result = generateMatches(players, config);

  if (result.success) {
    console.log(`\n✅ Generated ${result.matches.length} matches\n`);

    // Analyze role variety for each player
    const playerRoleCounts = new Map<string, Map<string, number>>();

    // Initialize counts
    players.forEach((player) => {
      playerRoleCounts.set(
        player.name,
        new Map([
          ["Top", 0],
          ["Jungle", 0],
          ["Mid", 0],
          ["Adc", 0],
          ["Support", 0],
        ])
      );
    });

    // Count role assignments
    result.matches.forEach((match, matchIndex) => {
      console.log(`Match ${matchIndex + 1}:`);

      Object.entries(match.pairingsRoles).forEach(
        ([role, [player1, player2]]) => {
          console.log(
            `  ${role}: ${player1.name} (${player1.rank}) vs ${player2.name} (${player2.rank})`
          );

          // Update role counts
          const player1Counts = playerRoleCounts.get(player1.name)!;
          const player2Counts = playerRoleCounts.get(player2.name)!;

          player1Counts.set(role, player1Counts.get(role)! + 1);
          player2Counts.set(role, player2Counts.get(role)! + 1);
        }
      );

      console.log(
        `  Team Scores: Blue ${match.matchScore.blue} vs Red ${match.matchScore.red}`
      );
      console.log();
    });

    // Show role variety analysis
    console.log("🎭 Role Variety Analysis:");
    console.log("=".repeat(50));

    players.forEach((player) => {
      const counts = playerRoleCounts.get(player.name)!;
      const roleDistribution = Array.from(counts.entries())
        .map(([role, count]) => `${role}:${count}`)
        .join(" ");

      console.log(`${player.name.padEnd(12)} | ${roleDistribution}`);
    });

    // Check if role variety is working
    console.log("\n📊 Variety Check:");
    let hasVariety = false;

    players.forEach((player) => {
      const counts = playerRoleCounts.get(player.name)!;
      const roleCounts = Array.from(counts.values());
      const maxCount = Math.max(...roleCounts);
      const minCount = Math.min(...roleCounts);

      if (maxCount - minCount > 0) {
        hasVariety = true;
        console.log(
          `✅ ${player.name}: Variety detected (${minCount}-${maxCount} roles)`
        );
      } else {
        console.log(`⚠️  ${player.name}: No variety (all roles equal)`);
      }
    });

    if (hasVariety) {
      console.log(
        "\n🎉 Role variety is working! Players are getting different roles across matches."
      );
    } else {
      console.log(
        "\n⚠️  No role variety detected. Algorithm may need adjustment."
      );
    }
  } else {
    console.log("❌ Failed to generate matches:", result.error);
  }
}

// Run the test
testRoleVariety();
