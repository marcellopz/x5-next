"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Player } from "@/lib/types";
import type { MatchmakingResult } from "@/lib/matchmaking-algorithm";

export type Lane = "top" | "jungle" | "mid" | "adc" | "support";

export interface PresetLanesConfig {
  usePresetLanes: boolean;
  randomizeSides: boolean;
  lanes: {
    [key in Lane]: {
      player1: Player | null;
      player2: Player | null;
    };
  };
}

export interface AvoidRoleRule {
  playerId: string | number;
  lane: Lane;
}

export interface AvoidRolesConfig {
  enabled: boolean;
  rules: AvoidRoleRule[];
}

export interface PlayerCombo {
  id: string;
  players: Player[];
}

export interface PlayerCombosConfig {
  enabled: boolean;
  combos: PlayerCombo[];
}

export interface MatchmakingConfig {
  matchOptions: number;
  tolerance: number;
  presetLanes: PresetLanesConfig;
  avoidRoles: AvoidRolesConfig;
  playerCombos: PlayerCombosConfig;
}

interface MatchmakingContextType {
  players: Player[];
  selectedPlayers: Player[];
  setSelectedPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (player: Player) => void;
  config: MatchmakingConfig;
  setConfig: (
    config: MatchmakingConfig | ((prev: MatchmakingConfig) => MatchmakingConfig)
  ) => void;
  updatePresetLane: (
    lane: Lane,
    side: "player1" | "player2",
    player: Player | null
  ) => void;
  updatePresetLanesConfig: (config: Partial<PresetLanesConfig>) => void;
  expandedSections: string[];
  setExpandedSections: (
    sections: string[] | ((prev: string[]) => string[])
  ) => void;
  matchResults: MatchmakingResult | null;
  setMatchResults: (results: MatchmakingResult | null) => void;
}

const MatchmakingContext = createContext<MatchmakingContextType | undefined>(
  undefined
);

const initialConfig: MatchmakingConfig = {
  matchOptions: 5,
  tolerance: 1,
  presetLanes: {
    usePresetLanes: false,
    randomizeSides: true,
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

interface MatchmakingProviderProps {
  children: ReactNode;
  players: Player[];
}

export function MatchmakingProvider({
  children,
  players,
}: MatchmakingProviderProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [config, setConfig] = useState<MatchmakingConfig>(initialConfig);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [matchResults, setMatchResults] = useState<MatchmakingResult | null>(
    null
  );

  // Remove avoid role rules when players are preset in lanes
  useEffect(() => {
    const presetPlayerIds = new Set<string | number>();

    // Collect all players already assigned in preset lanes
    Object.values(config.presetLanes.lanes).forEach((lane) => {
      if (lane.player1) presetPlayerIds.add(lane.player1.account_id);
      if (lane.player2) presetPlayerIds.add(lane.player2.account_id);
    });

    // Remove rules where the player is now in preset lanes
    if (presetPlayerIds.size > 0) {
      setConfig((prev) => ({
        ...prev,
        avoidRoles: {
          ...prev.avoidRoles,
          rules: prev.avoidRoles.rules.filter(
            (rule) => !presetPlayerIds.has(Number(rule.playerId))
          ),
        },
      }));
    }
  }, [config.presetLanes]);

  const addPlayer = (player: Player) => {
    setSelectedPlayers((prev) => {
      if (prev.some((p) => p.account_id === player.account_id)) {
        return prev; // Player already selected
      }
      return [...prev, player];
    });
  };

  const removePlayer = (player: Player) => {
    setSelectedPlayers((prev) =>
      prev.filter((p) => p.account_id !== player.account_id)
    );
  };

  const updatePresetLane = (
    lane: Lane,
    side: "player1" | "player2",
    player: Player | null
  ) => {
    setConfig((prev) => ({
      ...prev,
      presetLanes: {
        ...prev.presetLanes,
        lanes: {
          ...prev.presetLanes.lanes,
          [lane]: {
            ...prev.presetLanes.lanes[lane],
            [side]: player,
          },
        },
      },
    }));
  };

  const updatePresetLanesConfig = (config: Partial<PresetLanesConfig>) => {
    setConfig((prev) => ({
      ...prev,
      presetLanes: {
        ...prev.presetLanes,
        ...config,
      },
    }));
  };

  return (
    <MatchmakingContext.Provider
      value={{
        players,
        selectedPlayers,
        setSelectedPlayers,
        addPlayer,
        removePlayer,
        config,
        setConfig,
        updatePresetLane,
        updatePresetLanesConfig,
        expandedSections,
        setExpandedSections,
        matchResults,
        setMatchResults,
      }}
    >
      {children}
    </MatchmakingContext.Provider>
  );
}

export function useMatchmaking() {
  const context = useContext(MatchmakingContext);
  if (context === undefined) {
    throw new Error("useMatchmaking must be used within a MatchmakingProvider");
  }
  return context;
}
