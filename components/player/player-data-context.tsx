"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type {
  Player,
  PlayerInfo,
  PlayerPairs,
  PlayerSummary,
  ChampionStats,
  MatchWithId,
  PlayerRankChanges,
} from "@/lib/types";

interface PlayerDataContextType {
  player: Player;
  playerInfo: PlayerInfo;
  playerPairs: PlayerPairs | null;
  playerSummary: PlayerSummary | null;
  champs: ChampionStats[];
  matches: MatchWithId[];
  rankChanges: PlayerRankChanges | null;
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
  matches: MatchWithId[];
  rankChanges: PlayerRankChanges | null;
}

export function PlayerDataProvider({
  children,
  player,
  playerInfo,
  playerPairs,
  playerSummary,
  champs,
  matches,
  rankChanges,
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
        matches,
        rankChanges,
        filteredRole,
        setFilteredRole,
      }}
    >
      {children}
    </PlayerDataContext.Provider>
  );
}
