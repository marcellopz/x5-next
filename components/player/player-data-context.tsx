"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type {
  Player,
  PlayerInfo,
  PlayerPairs,
  PlayerSummary,
  ChampionStats,
} from "@/lib/types";

interface PlayerDataContextType {
  player: Player;
  playerInfo: PlayerInfo;
  playerPairs: PlayerPairs | null;
  playerSummary: PlayerSummary | null;
  champs: ChampionStats[];
  filteredRole: string;
  setFilteredRole: (role: string) => void;
}

const PlayerDataContext = createContext<PlayerDataContextType | undefined>(
  undefined
);

export function usePlayerData() {
  const context = useContext(PlayerDataContext);
  if (!context) {
    throw new Error("usePlayerData must be used within PlayerDataProvider");
  }
  return context;
}

interface PlayerDataProviderProps {
  children: ReactNode;
  player: Player;
  playerInfo: PlayerInfo;
  playerPairs: PlayerPairs | null;
  playerSummary: PlayerSummary | null;
  champs: ChampionStats[];
}

export function PlayerDataProvider({
  children,
  player,
  playerInfo,
  playerPairs,
  playerSummary,
  champs,
}: PlayerDataProviderProps) {
  const [filteredRole, setFilteredRole] = useState("");

  return (
    <PlayerDataContext.Provider
      value={{
        player,
        playerInfo,
        playerPairs,
        playerSummary,
        champs,
        filteredRole,
        setFilteredRole,
      }}
    >
      {children}
    </PlayerDataContext.Provider>
  );
}
