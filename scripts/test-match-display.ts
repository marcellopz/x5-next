import type { MatchResult } from "@/lib/matchmaking-algorithm";

/**
 * Test script to verify match display formatting
 */
function testMatchDisplay() {
  console.log("🎮 Testing Match Display Formatting\n");

  // Create sample match data
  const sampleMatches: MatchResult[] = [
    {
      pairingsRoles: {
        Top: [
          { name: "Penta", rank: 6 },
          { name: "Carioca", rank: 6 },
        ],
        Jungle: [
          { name: "Valbim", rank: 7 },
          { name: "Tonho", rank: 6 },
        ],
        Mid: [
          { name: "Loves", rank: 3 },
          { name: "Talita", rank: 3 },
        ],
        Adc: [
          { name: "Vinicim", rank: 9 },
          { name: "Marcello", rank: 9 },
        ],
        Support: [
          { name: "Rafinsk", rank: 6 },
          { name: "Grilha", rank: 7 },
        ],
      },
      matchScore: { blue: 31, red: 31 },
      pairings: [], // Not used in display
    },
    {
      pairingsRoles: {
        Top: [
          { name: "Rafinsk", rank: 7 },
          { name: "Penta", rank: 6 },
        ],
        Jungle: [
          { name: "Valbim", rank: 7 },
          { name: "Carioca", rank: 6 },
        ],
        Mid: [
          { name: "Loves", rank: 3 },
          { name: "Tonho", rank: 4 },
        ],
        Adc: [
          { name: "Vinicim", rank: 9 },
          { name: "Marcello", rank: 9 },
        ],
        Support: [
          { name: "Talita", rank: 6 },
          { name: "Grilha", rank: 7 },
        ],
      },
      matchScore: { blue: 32, red: 32 },
      pairings: [], // Not used in display
    },
  ];

  // Test the formatting function
  const formatMatchText = (matches: MatchResult[]): string => {
    return matches
      .map((match, index) => {
        const roleOrder = ["Top", "Jungle", "Mid", "Adc", "Support"];
        const roleLabels = ["Top:", "Jng:", "Mid:", "Adc:", "Sup:"];

        const roleLines = roleOrder.map((role, roleIndex) => {
          const [player1, player2] = match.pairingsRoles[role];
          return `${roleLabels[roleIndex].padEnd(6)} ${player1.name.padEnd(
            10
          )} (${player1.rank}) x (${player2.rank}) ${player2.name}`;
        });

        const totalScore = match.matchScore.blue + match.matchScore.red;
        const scoreLine = `Score: ${match.matchScore.blue} x ${match.matchScore.red} -> ${totalScore}`;

        return `Match ${index + 1}:\n${roleLines.join("\n")}\n${scoreLine}`;
      })
      .join("\n\n");
  };

  const formattedText = formatMatchText(sampleMatches);

  console.log("📋 Formatted Match Text:");
  console.log("=".repeat(50));
  console.log(formattedText);
  console.log("=".repeat(50));

  console.log(
    "The match display component should render this format correctly."
  );
}

// Run the test
testMatchDisplay();
