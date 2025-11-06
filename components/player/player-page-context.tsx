"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PlayerPageContextType {
  filteredRole: string;
  setFilteredRole: (role: string) => void;
}

const PlayerPageContext = createContext<PlayerPageContextType | undefined>(
  undefined
);

export function usePlayerPage() {
  const context = useContext(PlayerPageContext);
  if (!context) {
    throw new Error("usePlayerPage must be used within PlayerPageProvider");
  }
  return context;
}

interface PlayerPageProviderProps {
  children: ReactNode;
}

export function PlayerPageProvider({ children }: PlayerPageProviderProps) {
  const [filteredRole, setFilteredRole] = useState("");

  return (
    <PlayerPageContext.Provider value={{ filteredRole, setFilteredRole }}>
      {children}
    </PlayerPageContext.Provider>
  );
}
