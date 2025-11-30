import type { ChampionStatsEntryAll } from "@/lib/types";

export type MapObjectiveKey =
  | "firstBlood"
  | "towerKills"
  | "baronKills"
  | "dragonKills"
  | "voidGrubs"
  | "riftHeraldKills"
  | "atakhan";

export interface MapSummary {
  wins: {
    blue: number;
    red: number;
  };
  kills: {
    blue: number;
    red: number;
  };
  objectives: Record<
    MapObjectiveKey,
    {
      blue: number;
      red: number;
    }
  >;
}

export interface ChampionSpotlightEntry {
  championId: string;
  championName: string;
  picks: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  creepsKilled: number;
  bans: number;
  presence: number;
  playedBy: ChampionStatsEntryAll["playedBy"];
}

export interface NeverPickedChampion {
  championId: string;
  championName: string;
}
