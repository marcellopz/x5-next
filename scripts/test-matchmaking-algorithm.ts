import { generateMatches } from "@/lib/matchmaking-algorithm";
import type { Player } from "@/lib/types";
import type { MatchmakingConfig } from "@/components/matchmaking/matchmaking-context";

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  iterations: number;
  successRate: number;
}

class MatchmakingTestRunner {
  private results: TestResult[] = [];

  async runTest(
    testName: string,
    testFn: () => boolean,
    iterations: number = 100
  ): Promise<TestResult> {
    let passed = 0;
    let error: string | undefined;

    for (let i = 0; i < iterations; i++) {
      try {
        if (testFn()) {
          passed++;
        }
      } catch (e) {
        error = e instanceof Error ? e.message : "Unknown error";
        break;
      }
    }

    const result: TestResult = {
      testName,
      passed: passed === iterations,
      error,
      iterations,
      successRate: (passed / iterations) * 100,
    };

    this.results.push(result);
    return result;
  }

  generateTestPlayers(): Player[] {
    return [
      {
        account_id: 1,
        name: "Player1",
        name_id: "player1",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
      {
        account_id: 2,
        name: "Player2",
        name_id: "player2",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
      {
        account_id: 3,
        name: "Player3",
        name_id: "player3",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
      {
        account_id: 4,
        name: "Player4",
        name_id: "player4",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
      {
        account_id: 5,
        name: "Player5",
        name_id: "player5",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
      {
        account_id: 6,
        name: "Player6",
        name_id: "player6",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
      {
        account_id: 7,
        name: "Player7",
        name_id: "player7",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
      {
        account_id: 8,
        name: "Player8",
        name_id: "player8",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
      {
        account_id: 9,
        name: "Player9",
        name_id: "player9",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
      {
        account_id: 10,
        name: "Player10",
        name_id: "player10",
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      },
    ];
  }

  getDefaultConfig(): MatchmakingConfig {
    return {
      matchOptions: 5,
      tolerance: 1,
      presetLanes: {
        usePresetLanes: false,
        randomizeSides: false,
        lanes: {
          top: { player1: null, player2: null },
          jungle: { player1: null, player2: null },
          mid: { player1: null, player2: null },
          adc: { player1: null, player2: null },
          support: { player1: null, player2: null },
        },
      },
      avoidRoles: {
        enabled: false,
        rules: [],
      },
      playerCombos: {
        enabled: false,
        combos: [],
      },
    };
  }

  async runAllTests(): Promise<void> {
    console.log("🧪 Starting Matchmaking Algorithm Stress Tests...\n");

    // Basic functionality tests
    await this.runTest(
      "Basic match generation with random players",
      () => {
        const players = this.generateTestPlayers();
        const config = this.getDefaultConfig();
        const result = generateMatches(players, config);
        return result.success && result.matches.length > 0;
      },
      1000
    );

    await this.runTest(
      "Tolerance constraint validation",
      () => {
        const players = this.generateTestPlayers();
        const config = { ...this.getDefaultConfig(), tolerance: 2 };
        const result = generateMatches(players, config);

        if (!result.success) return false;

        return result.matches.every((match) => {
          return Object.values(match.pairingsRoles).every(
            ([player1, player2]) => {
              return Math.abs(player1.rank - player2.rank) <= config.tolerance;
            }
          );
        });
      },
      500
    );

    // Preset lanes tests
    await this.runTest(
      "Preset lanes with random assignments",
      () => {
        const players = this.generateTestPlayers();
        const config = {
          ...this.getDefaultConfig(),
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

        const result = generateMatches(players, config);

        if (!result.success) return false;

        return result.matches.every((match) => {
          const topLane = match.pairingsRoles.Top;
          return (
            topLane[0].name === players[0].name &&
            topLane[1].name === players[1].name
          );
        });
      },
      300
    );

    // Avoid roles tests
    await this.runTest(
      "Avoid roles constraint",
      () => {
        const players = this.generateTestPlayers();
        const config = {
          ...this.getDefaultConfig(),
          avoidRoles: {
            enabled: true,
            rules: [
              { playerId: players[0].account_id, lane: "top" as const },
              { playerId: players[1].account_id, lane: "jungle" as const },
            ],
          },
        };

        const result = generateMatches(players, config);

        if (!result.success) return false;

        return result.matches.every((match) => {
          const topLane = match.pairingsRoles.Top;
          const jungleLane = match.pairingsRoles.Jungle;

          return (
            topLane[0].name !== players[0].name &&
            topLane[1].name !== players[0].name &&
            jungleLane[0].name !== players[1].name &&
            jungleLane[1].name !== players[1].name
          );
        });
      },
      300
    );

    // Player combos tests
    await this.runTest(
      "Player combos constraint",
      () => {
        const players = this.generateTestPlayers();
        const config = {
          ...this.getDefaultConfig(),
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

        const result = generateMatches(players, config);

        if (!result.success) return false;

        return result.matches.every((match) => {
          const comboPlayerIds = new Set([
            players[0].account_id,
            players[1].account_id,
            players[2].account_id,
          ]);

          const teamAssignments = new Map<string | number, number>();
          match.pairings.forEach((player, index) => {
            if (comboPlayerIds.has(player.account_id)) {
              teamAssignments.set(player.account_id, index % 2);
            }
          });

          const teams = Array.from(teamAssignments.values());
          return new Set(teams).size === 1; // All on same team
        });
      },
      300
    );

    // Complex scenario tests
    await this.runTest(
      "All constraints combined",
      () => {
        const players = this.generateTestPlayers();
        const config = {
          ...this.getDefaultConfig(),
          tolerance: 3,
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
            rules: [
              { playerId: players[1].account_id, lane: "jungle" as const },
            ],
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

        const result = generateMatches(players, config);

        if (!result.success) return false;

        return result.matches.every((match) => {
          // Check preset lane
          const topCorrect =
            match.pairingsRoles.Top[0].name === players[0].name;

          // Check avoid role
          const jungleLane = match.pairingsRoles.Jungle;
          const avoidCorrect =
            jungleLane[0].name !== players[1].name &&
            jungleLane[1].name !== players[1].name;

          // Check combo
          const comboPlayerIds = new Set([
            players[2].account_id,
            players[3].account_id,
          ]);
          const teamAssignments = new Map<string | number, number>();
          match.pairings.forEach((player, index) => {
            if (comboPlayerIds.has(player.account_id)) {
              teamAssignments.set(player.account_id, index % 2);
            }
          });
          const teams = Array.from(teamAssignments.values());
          const comboCorrect = new Set(teams).size === 1;

          return topCorrect && avoidCorrect && comboCorrect;
        });
      },
      200
    );

    // Edge case tests
    await this.runTest(
      "Extreme tolerance values",
      () => {
        const players = this.generateTestPlayers();
        const config = { ...this.getDefaultConfig(), tolerance: 10 };
        const result = generateMatches(players, config);
        return result.success;
      },
      100
    );

    await this.runTest(
      "Zero tolerance",
      () => {
        const players = this.generateTestPlayers();
        const config = { ...this.getDefaultConfig(), tolerance: 0 };
        const result = generateMatches(players, config);
        return result.success;
      },
      100
    );

    await this.runTest(
      "High match options count",
      () => {
        const players = this.generateTestPlayers();
        const config = { ...this.getDefaultConfig(), matchOptions: 20 };
        const result = generateMatches(players, config);
        return result.success && result.matches.length <= 20;
      },
      50
    );

    this.printResults();
  }

  printResults(): void {
    console.log("\n📊 Test Results Summary:");
    console.log("=".repeat(60));

    let totalTests = 0;
    let passedTests = 0;
    let totalIterations = 0;
    let totalPassedIterations = 0;

    this.results.forEach((result) => {
      totalTests++;
      if (result.passed) passedTests++;
      totalIterations += result.iterations;
      totalPassedIterations += Math.floor(
        (result.iterations * result.successRate) / 100
      );

      const status = result.passed ? "✅ PASS" : "❌ FAIL";
      console.log(`${status} ${result.testName}`);
      console.log(
        `   Success Rate: ${result.successRate.toFixed(1)}% (${Math.floor(
          (result.iterations * result.successRate) / 100
        )}/${result.iterations})`
      );
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log();
    });

    console.log("=".repeat(60));
    console.log(
      `Overall Test Success Rate: ${((passedTests / totalTests) * 100).toFixed(
        1
      )}% (${passedTests}/${totalTests})`
    );
    console.log(
      `Overall Iteration Success Rate: ${(
        (totalPassedIterations / totalIterations) *
        100
      ).toFixed(1)}% (${totalPassedIterations}/${totalIterations})`
    );

    if (passedTests === totalTests) {
      console.log("\n🎉 All tests passed! The algorithm is working correctly.");
    } else {
      console.log(
        "\n⚠️  Some tests failed. Review the algorithm implementation."
      );
    }
  }
}

// Run the tests
const testRunner = new MatchmakingTestRunner();
testRunner.runAllTests().catch(console.error);
