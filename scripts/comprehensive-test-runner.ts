import {
  generateMatches,
  MatchmakingResult,
} from "@/lib/matchmaking-algorithm";
import { TestDataGenerator } from "@/lib/test-data-generator";
import type { TestScenario } from "@/lib/test-data-generator";
import { Player } from "@/lib/types";

interface TestResult {
  scenarioName: string;
  passed: boolean;
  error?: string;
  iterations: number;
  successRate: number;
  averageExecutionTime: number;
  constraintsValidated: boolean;
}

class ComprehensiveTestRunner {
  private results: TestResult[] = [];

  async runScenarioTest(
    scenario: TestScenario,
    iterations: number = 100
  ): Promise<TestResult> {
    let passed = 0;
    let totalTime = 0;
    let constraintsValidated = true;
    let error: string | undefined;

    console.log(`🧪 Testing: ${scenario.name}`);

    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = Date.now();
        const result = generateMatches(scenario.players, scenario.config);
        const endTime = Date.now();

        totalTime += endTime - startTime;

        if (result.success === scenario.expectedBehavior.shouldSucceed) {
          if (result.success) {
            // Validate constraints if specified
            if (scenario.expectedBehavior.constraints) {
              const constraintsMet = this.validateConstraints(result, scenario);
              if (!constraintsMet) {
                constraintsValidated = false;
              }
            }

            // Check match count
            if (
              scenario.expectedBehavior.minMatches &&
              result.matches.length < scenario.expectedBehavior.minMatches
            ) {
              error = `Expected at least ${scenario.expectedBehavior.minMatches} matches, got ${result.matches.length}`;
              break;
            }

            if (
              scenario.expectedBehavior.maxMatches &&
              result.matches.length > scenario.expectedBehavior.maxMatches
            ) {
              error = `Expected at most ${scenario.expectedBehavior.maxMatches} matches, got ${result.matches.length}`;
              break;
            }
          }
          passed++;
        } else {
          error = `Expected success: ${scenario.expectedBehavior.shouldSucceed}, got: ${result.success}`;
          if (result.error) {
            error += ` - ${result.error}`;
          }
          break;
        }
      } catch (e) {
        error = e instanceof Error ? e.message : "Unknown error";
        break;
      }
    }

    const testResult: TestResult = {
      scenarioName: scenario.name,
      passed: passed === iterations && constraintsValidated,
      error,
      iterations,
      successRate: (passed / iterations) * 100,
      averageExecutionTime: totalTime / iterations,
      constraintsValidated,
    };

    this.results.push(testResult);
    return testResult;
  }

  private validateConstraints(
    result: MatchmakingResult,
    scenario: TestScenario
  ): boolean {
    if (!result.success || !result.matches.length) return false;

    const match = result.matches[0];
    const config = scenario.config;

    // Validate preset lanes
    if (config.presetLanes.usePresetLanes) {
      const lanes = config.presetLanes.lanes;
      Object.entries(lanes).forEach(([lane, laneConfig]) => {
        const roleName = lane.charAt(0).toUpperCase() + lane.slice(1);
        const lanePlayers = match.pairingsRoles[roleName];

        if (
          laneConfig.player1 &&
          lanePlayers[0].name !== laneConfig.player1.name
        ) {
          return false;
        }
        if (
          laneConfig.player2 &&
          lanePlayers[1].name !== laneConfig.player2.name
        ) {
          return false;
        }
      });
    }

    // Validate avoid roles
    if (config.avoidRoles.enabled) {
      config.avoidRoles.rules.forEach((rule) => {
        const roleName = rule.lane.charAt(0).toUpperCase() + rule.lane.slice(1);
        const lanePlayers = match.pairingsRoles[roleName];
        const playerName = scenario.players.find(
          (p) => p.account_id === rule.playerId
        )?.name;

        if (
          playerName &&
          (lanePlayers[0].name === playerName ||
            lanePlayers[1].name === playerName)
        ) {
          return false;
        }
      });
    }

    // Validate player combos
    if (config.playerCombos.enabled && config.playerCombos.combos.length > 0) {
      const combo = config.playerCombos.combos[0];
      const comboPlayerIds = new Set(combo.players.map((p) => p.account_id));

      const teamAssignments = new Map();
      match.pairings.forEach((player: Player, index: number) => {
        if (comboPlayerIds.has(player.account_id)) {
          teamAssignments.set(player.account_id, index % 2);
        }
      });

      const teams = Array.from(teamAssignments.values());
      if (new Set(teams).size !== 1) {
        return false;
      }
    }

    return true;
  }

  async runAllScenarios(): Promise<void> {
    console.log("🚀 Starting Comprehensive Matchmaking Algorithm Tests\n");
    console.log("=".repeat(80));

    const scenarios = TestDataGenerator.generateTestScenarios();

    for (const scenario of scenarios) {
      const iterations = scenario.name.includes("Impossible") ? 10 : 100;
      await this.runScenarioTest(scenario, iterations);
    }

    // Run stress tests
    console.log("\n🔥 Running Stress Tests...");
    const stressTestData = TestDataGenerator.generateStressTestData();

    for (let i = 0; i < Math.min(stressTestData.length, 20); i++) {
      const testCase = stressTestData[i];
      const scenario: TestScenario = {
        name: `Stress Test ${i + 1}`,
        players: testCase.players,
        config: testCase.config,
        expectedBehavior: {
          shouldSucceed: true,
          minMatches: 1,
        },
      };

      await this.runScenarioTest(scenario, 50);
    }

    this.printResults();
  }

  private printResults(): void {
    console.log("\n📊 Comprehensive Test Results");
    console.log("=".repeat(80));

    let totalTests = 0;
    let passedTests = 0;
    let totalIterations = 0;
    let totalPassedIterations = 0;
    let totalExecutionTime = 0;

    this.results.forEach((result) => {
      totalTests++;
      if (result.passed) passedTests++;
      totalIterations += result.iterations;
      totalPassedIterations += Math.floor(
        (result.iterations * result.successRate) / 100
      );
      totalExecutionTime += result.averageExecutionTime * result.iterations;

      const status = result.passed ? "✅ PASS" : "❌ FAIL";
      console.log(`${status} ${result.scenarioName}`);
      console.log(
        `   Success Rate: ${result.successRate.toFixed(1)}% (${Math.floor(
          (result.iterations * result.successRate) / 100
        )}/${result.iterations})`
      );
      console.log(
        `   Avg Execution Time: ${result.averageExecutionTime.toFixed(2)}ms`
      );
      console.log(
        `   Constraints Validated: ${result.constraintsValidated ? "✅" : "❌"}`
      );
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log();
    });

    console.log("=".repeat(80));
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
    console.log(
      `Average Execution Time: ${(totalExecutionTime / totalIterations).toFixed(
        2
      )}ms`
    );

    if (passedTests === totalTests) {
      console.log(
        "\n🎉 All tests passed! The algorithm is robust and reliable."
      );
    } else {
      console.log(
        "\n⚠️  Some tests failed. Review the algorithm implementation."
      );
    }

    // Performance analysis
    const avgTime = totalExecutionTime / totalIterations;
    if (avgTime < 100) {
      console.log("⚡ Excellent performance!");
    } else if (avgTime < 500) {
      console.log("✅ Good performance");
    } else if (avgTime < 1000) {
      console.log("⚠️  Acceptable performance, consider optimization");
    } else {
      console.log("🐌 Poor performance, optimization needed");
    }
  }
}

// Run the comprehensive tests
const testRunner = new ComprehensiveTestRunner();
testRunner.runAllScenarios().catch(console.error);
