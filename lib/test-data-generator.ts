import type { Player } from "@/lib/types";
import type { MatchmakingConfig } from "@/components/matchmaking/matchmaking-context";

export interface TestScenario {
  name: string;
  players: Player[];
  config: MatchmakingConfig;
  expectedBehavior: {
    shouldSucceed: boolean;
    minMatches?: number;
    maxMatches?: number;
    constraints?: string[];
  };
}

export class TestDataGenerator {
  /**
   * Generate players with random ranks
   */
  static generateRandomPlayers(count: number = 10): Player[] {
    const players: Player[] = [];

    for (let i = 1; i <= count; i++) {
      players.push({
        account_id: i,
        name: `Player${i}`,
        name_id: `player${i}`,
        top: Math.floor(Math.random() * 10) + 1,
        jungle: Math.floor(Math.random() * 10) + 1,
        mid: Math.floor(Math.random() * 10) + 1,
        adc: Math.floor(Math.random() * 10) + 1,
        support: Math.floor(Math.random() * 10) + 1,
      });
    }

    return players;
  }

  /**
   * Generate players with specific rank patterns
   */
  static generateBalancedPlayers(): Player[] {
    return [
      {
        account_id: 1,
        name: "HighTop",
        name_id: "hightop",
        top: 9,
        jungle: 3,
        mid: 4,
        adc: 5,
        support: 6,
      },
      {
        account_id: 2,
        name: "LowTop",
        name_id: "lowtop",
        top: 2,
        jungle: 7,
        mid: 6,
        adc: 5,
        support: 4,
      },
      {
        account_id: 3,
        name: "HighJungle",
        name_id: "highjungle",
        top: 4,
        jungle: 9,
        mid: 3,
        adc: 6,
        support: 5,
      },
      {
        account_id: 4,
        name: "LowJungle",
        name_id: "lowjungle",
        top: 6,
        jungle: 2,
        mid: 7,
        adc: 4,
        support: 5,
      },
      {
        account_id: 5,
        name: "HighMid",
        name_id: "highmid",
        top: 5,
        jungle: 4,
        mid: 9,
        adc: 3,
        support: 6,
      },
      {
        account_id: 6,
        name: "LowMid",
        name_id: "lowmid",
        top: 5,
        jungle: 6,
        mid: 2,
        adc: 7,
        support: 4,
      },
      {
        account_id: 7,
        name: "HighAdc",
        name_id: "highadc",
        top: 6,
        jungle: 5,
        mid: 4,
        adc: 9,
        support: 3,
      },
      {
        account_id: 8,
        name: "LowAdc",
        name_id: "lowadc",
        top: 4,
        jungle: 5,
        mid: 6,
        adc: 2,
        support: 7,
      },
      {
        account_id: 9,
        name: "HighSupport",
        name_id: "highsupport",
        top: 3,
        jungle: 6,
        mid: 5,
        adc: 4,
        support: 9,
      },
      {
        account_id: 10,
        name: "LowSupport",
        name_id: "lowsupport",
        top: 7,
        jungle: 4,
        mid: 5,
        adc: 6,
        support: 2,
      },
    ];
  }

  /**
   * Generate players with extreme rank differences
   */
  static generateExtremePlayers(): Player[] {
    return [
      {
        account_id: 1,
        name: "GodTop",
        name_id: "godtop",
        top: 10,
        jungle: 1,
        mid: 1,
        adc: 1,
        support: 1,
      },
      {
        account_id: 2,
        name: "NoobTop",
        name_id: "noobtop",
        top: 1,
        jungle: 10,
        mid: 10,
        adc: 10,
        support: 10,
      },
      {
        account_id: 3,
        name: "GodJungle",
        name_id: "godjungle",
        top: 1,
        jungle: 10,
        mid: 1,
        adc: 1,
        support: 1,
      },
      {
        account_id: 4,
        name: "NoobJungle",
        name_id: "noobjungle",
        top: 10,
        jungle: 1,
        mid: 10,
        adc: 10,
        support: 10,
      },
      {
        account_id: 5,
        name: "GodMid",
        name_id: "godmid",
        top: 1,
        jungle: 1,
        mid: 10,
        adc: 1,
        support: 1,
      },
      {
        account_id: 6,
        name: "NoobMid",
        name_id: "noobmid",
        top: 10,
        jungle: 10,
        mid: 1,
        adc: 10,
        support: 10,
      },
      {
        account_id: 7,
        name: "GodAdc",
        name_id: "godadc",
        top: 1,
        jungle: 1,
        mid: 1,
        adc: 10,
        support: 1,
      },
      {
        account_id: 8,
        name: "NoobAdc",
        name_id: "noobadc",
        top: 10,
        jungle: 10,
        mid: 10,
        adc: 1,
        support: 10,
      },
      {
        account_id: 9,
        name: "GodSupport",
        name_id: "godsupport",
        top: 1,
        jungle: 1,
        mid: 1,
        adc: 1,
        support: 10,
      },
      {
        account_id: 10,
        name: "NoobSupport",
        name_id: "noobsupport",
        top: 10,
        jungle: 10,
        mid: 10,
        adc: 10,
        support: 1,
      },
    ];
  }

  /**
   * Generate players with identical ranks
   */
  static generateIdenticalPlayers(): Player[] {
    const baseRanks = { top: 5, jungle: 5, mid: 5, adc: 5, support: 5 };

    return Array.from({ length: 10 }, (_, i) => ({
      account_id: i + 1,
      name: `Player${i + 1}`,
      name_id: `player${i + 1}`,
      ...baseRanks,
    }));
  }

  /**
   * Generate wildcard players
   */
  static generateWildcardPlayers(): Player[] {
    const regularPlayers = this.generateRandomPlayers(8);
    const wildcardPlayers: Player[] = [
      {
        account_id: "wildcard1",
        name: "Wildcard1",
        name_id: "wildcard1",
        top: 5,
        jungle: 5,
        mid: 5,
        adc: 5,
        support: 5,
        isWildcard: true,
      },
      {
        account_id: "wildcard2",
        name: "Wildcard2",
        name_id: "wildcard2",
        top: 5,
        jungle: 5,
        mid: 5,
        adc: 5,
        support: 5,
        isWildcard: true,
      },
    ];

    return [...regularPlayers, ...wildcardPlayers];
  }

  /**
   * Get default matchmaking config
   */
  static getDefaultConfig(): MatchmakingConfig {
    return {
      matchOptions: 5,
      tolerance: 1,
      presetLanes: {
        usePresetLanes: false,
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

  /**
   * Generate comprehensive test scenarios
   */
  static generateTestScenarios(): TestScenario[] {
    const scenarios: TestScenario[] = [];

    // Basic scenarios
    scenarios.push({
      name: "Random Players - Basic Config",
      players: this.generateRandomPlayers(),
      config: this.getDefaultConfig(),
      expectedBehavior: {
        shouldSucceed: true,
        minMatches: 1,
        maxMatches: 5,
      },
    });

    scenarios.push({
      name: "Balanced Players - Low Tolerance",
      players: this.generateBalancedPlayers(),
      config: { ...this.getDefaultConfig(), tolerance: 0 },
      expectedBehavior: {
        shouldSucceed: true,
        minMatches: 1,
        constraints: ["Perfect lane balance"],
      },
    });

    scenarios.push({
      name: "Extreme Players - High Tolerance",
      players: this.generateExtremePlayers(),
      config: { ...this.getDefaultConfig(), tolerance: 5 },
      expectedBehavior: {
        shouldSucceed: true,
        minMatches: 1,
        constraints: ["High tolerance required"],
      },
    });

    scenarios.push({
      name: "Identical Players - Perfect Balance",
      players: this.generateIdenticalPlayers(),
      config: this.getDefaultConfig(),
      expectedBehavior: {
        shouldSucceed: true,
        minMatches: 1,
        constraints: ["Perfect team balance expected"],
      },
    });

    scenarios.push({
      name: "Wildcard Players",
      players: this.generateWildcardPlayers(),
      config: this.getDefaultConfig(),
      expectedBehavior: {
        shouldSucceed: true,
        minMatches: 1,
        constraints: ["Wildcard players included"],
      },
    });

    // Preset lanes scenarios
    const balancedPlayers = this.generateBalancedPlayers();
    scenarios.push({
      name: "Preset Lanes - Top Lane Fixed",
      players: balancedPlayers,
      config: {
        ...this.getDefaultConfig(),
        presetLanes: {
          usePresetLanes: true,
          lanes: {
            top: { player1: balancedPlayers[0], player2: balancedPlayers[1] },
            jungle: { player1: null, player2: null },
            mid: { player1: null, player2: null },
            adc: { player1: null, player2: null },
            support: { player1: null, player2: null },
          },
        },
      },
      expectedBehavior: {
        shouldSucceed: true,
        minMatches: 1,
        constraints: ["Top lane players fixed"],
      },
    });

    // Avoid roles scenarios
    scenarios.push({
      name: "Avoid Roles - Multiple Constraints",
      players: balancedPlayers,
      config: {
        ...this.getDefaultConfig(),
        avoidRoles: {
          enabled: true,
          rules: [
            { playerId: balancedPlayers[0].account_id, lane: "top" },
            { playerId: balancedPlayers[1].account_id, lane: "jungle" },
            { playerId: balancedPlayers[2].account_id, lane: "mid" },
          ],
        },
      },
      expectedBehavior: {
        shouldSucceed: true,
        minMatches: 1,
        constraints: ["3 avoid role rules"],
      },
    });

    // Player combos scenarios
    scenarios.push({
      name: "Player Combos - 3 Player Team",
      players: balancedPlayers,
      config: {
        ...this.getDefaultConfig(),
        playerCombos: {
          enabled: true,
          combos: [
            {
              id: "combo1",
              players: [
                balancedPlayers[0],
                balancedPlayers[1],
                balancedPlayers[2],
              ],
            },
          ],
        },
      },
      expectedBehavior: {
        shouldSucceed: true,
        minMatches: 1,
        constraints: ["3 players must be on same team"],
      },
    });

    // Complex scenarios
    scenarios.push({
      name: "All Constraints Combined",
      players: balancedPlayers,
      config: {
        ...this.getDefaultConfig(),
        tolerance: 2,
        presetLanes: {
          usePresetLanes: true,
          lanes: {
            top: { player1: balancedPlayers[0], player2: null },
            jungle: { player1: null, player2: null },
            mid: { player1: null, player2: null },
            adc: { player1: null, player2: null },
            support: { player1: null, player2: null },
          },
        },
        avoidRoles: {
          enabled: true,
          rules: [{ playerId: balancedPlayers[1].account_id, lane: "jungle" }],
        },
        playerCombos: {
          enabled: true,
          combos: [
            {
              id: "combo1",
              players: [balancedPlayers[2], balancedPlayers[3]],
            },
          ],
        },
      },
      expectedBehavior: {
        shouldSucceed: true,
        minMatches: 1,
        constraints: ["Preset lanes", "Avoid roles", "Player combos"],
      },
    });

    // Edge cases
    scenarios.push({
      name: "Impossible Constraints",
      players: balancedPlayers,
      config: {
        ...this.getDefaultConfig(),
        tolerance: 0,
        presetLanes: {
          usePresetLanes: true,
          lanes: {
            top: { player1: balancedPlayers[0], player2: balancedPlayers[1] },
            jungle: {
              player1: balancedPlayers[2],
              player2: balancedPlayers[3],
            },
            mid: { player1: balancedPlayers[4], player2: balancedPlayers[5] },
            adc: { player1: balancedPlayers[6], player2: balancedPlayers[7] },
            support: {
              player1: balancedPlayers[8],
              player2: balancedPlayers[9],
            },
          },
        },
        avoidRoles: {
          enabled: true,
          rules: [{ playerId: balancedPlayers[0].account_id, lane: "top" }],
        },
      },
      expectedBehavior: {
        shouldSucceed: false,
        constraints: ["Conflicting constraints"],
      },
    });

    return scenarios;
  }

  /**
   * Generate stress test data
   */
  static generateStressTestData(): {
    players: Player[];
    config: MatchmakingConfig;
  }[] {
    const testCases = [];

    // Test with different tolerance values
    for (let tolerance = 0; tolerance <= 10; tolerance++) {
      testCases.push({
        players: this.generateRandomPlayers(),
        config: { ...this.getDefaultConfig(), tolerance },
      });
    }

    // Test with different match options
    for (let matchOptions = 1; matchOptions <= 20; matchOptions++) {
      testCases.push({
        players: this.generateRandomPlayers(),
        config: { ...this.getDefaultConfig(), matchOptions },
      });
    }

    // Test with different player combinations
    const playerTypes = [
      this.generateRandomPlayers(),
      this.generateBalancedPlayers(),
      this.generateExtremePlayers(),
      this.generateIdenticalPlayers(),
      this.generateWildcardPlayers(),
    ];

    playerTypes.forEach((players) => {
      testCases.push({
        players,
        config: this.getDefaultConfig(),
      });
    });

    return testCases;
  }
}
