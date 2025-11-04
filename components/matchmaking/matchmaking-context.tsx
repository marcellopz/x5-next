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
      player1: string | null; // name_id
      player2: string | null; // name_id
    };
  };
}

export interface AvoidRoleRule {
  playerId: string;
  lane: Lane;
}

export interface AvoidRolesConfig {
  enabled: boolean;
  rules: AvoidRoleRule[];
}

export interface PlayerCombo {
  id: string;
  players: string[]; // name_ids
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
  setPlayers: (players: Player[]) => void;
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
    player: string | null // name_id
  ) => void;
  updatePresetLanesConfig: (config: Partial<PresetLanesConfig>) => void;
  expandedSections: string[];
  setExpandedSections: (
    sections: string[] | ((prev: string[]) => string[])
  ) => void;
  matchResults: MatchmakingResult | null;
  setMatchResults: (results: MatchmakingResult | null) => void;
  refreshIndex: number;
  setRefreshIndex: (index: number | ((prev: number) => number)) => void;
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
  players: players_,
}: MatchmakingProviderProps) {
  const [players, setPlayers] = useState<Player[]>(players_);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [config, setConfig] = useState<MatchmakingConfig>(initialConfig);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);
  const [matchResults, setMatchResults] = useState<MatchmakingResult | null>(
    null
  );

  // Sync selectedPlayers based on selectedPlayerIds and players array
  useEffect(() => {
    const availableNameIds = new Set(players.map((p) => p.name_id));

    // Filter out IDs that no longer exist in players array
    const validIds = selectedPlayerIds.filter((id) => availableNameIds.has(id));
    if (validIds.length !== selectedPlayerIds.length) {
      setSelectedPlayerIds(validIds);
    }

    // Update selectedPlayers with current player data
    const updated = players.filter((p) =>
      selectedPlayerIds.includes(p.name_id)
    );
    setSelectedPlayers(updated);
  }, [selectedPlayerIds, players]);

  // Reset all configs to default when player selection changes
  useEffect(() => {
    setConfig(initialConfig);
    setMatchResults(null);
  }, [selectedPlayerIds]);

  // Remove avoid role rules when players are preset in lanes
  useEffect(() => {
    const presetPlayerIds = new Set<string>();

    // Collect all players already assigned in preset lanes
    Object.values(config.presetLanes.lanes).forEach((lane) => {
      if (lane.player1) presetPlayerIds.add(lane.player1);
      if (lane.player2) presetPlayerIds.add(lane.player2);
    });

    // Remove rules where the player is now in preset lanes
    if (presetPlayerIds.size > 0) {
      setConfig((prev) => ({
        ...prev,
        avoidRoles: {
          ...prev.avoidRoles,
          rules: prev.avoidRoles.rules.filter(
            (rule) => !presetPlayerIds.has(rule.playerId)
          ),
        },
      }));
    }
  }, [config.presetLanes]);

  const addPlayer = (player: Player) => {
    setSelectedPlayerIds((prev) => {
      if (prev.includes(player.name_id)) {
        return prev; // Player already selected
      }
      return [...prev, player.name_id];
    });
  };

  const removePlayer = (player: Player) => {
    setSelectedPlayerIds((prev) => prev.filter((id) => id !== player.name_id));
  };

  const updatePresetLane = (
    lane: Lane,
    side: "player1" | "player2",
    player: string | null // name_id
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
        setPlayers,
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
        refreshIndex,
        setRefreshIndex,
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
