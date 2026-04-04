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
  InitialRankPlayer,
} from "@/lib/types";
import type { WinLoseSinceLastChangeByRole } from "@/lib/win-loss-since-rank-change";

interface PlayerDataContextType {
  player: Player | null;
  playerInfo: PlayerInfo;
  playerPairs: PlayerPairs | null;
  playerSummary: PlayerSummary | null;
  champs: ChampionStats[];
  matches: MatchWithId[];
  rankChanges: PlayerRankChanges | null;
  initialRanksForPlayer: InitialRankPlayer | null;
  winLoseSinceLastChangeByRole: WinLoseSinceLastChangeByRole;
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
  player: Player | null;
  playerInfo: PlayerInfo;
  playerPairs: PlayerPairs | null;
  playerSummary: PlayerSummary | null;
  champs: ChampionStats[];
  matches: MatchWithId[];
  rankChanges: PlayerRankChanges | null;
  initialRanksForPlayer: InitialRankPlayer | null;
  winLoseSinceLastChangeByRole: WinLoseSinceLastChangeByRole;
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
  initialRanksForPlayer,
  winLoseSinceLastChangeByRole,
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
        initialRanksForPlayer,
        winLoseSinceLastChangeByRole,
        filteredRole,
        setFilteredRole,
      }}
    >
      {children}
    </PlayerDataContext.Provider>
  );
}
