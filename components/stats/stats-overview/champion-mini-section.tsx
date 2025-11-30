"use client";

import { useEffect, useState } from "react";
import type { ChampionSpotlightEntry } from "./types";
import { PlaceholderCard } from "./placeholder-card";
import { ChampionPortraitGrid } from "./champion-portrait-grid";
import { ChampionMiniCard } from "./champion-mini-card";

interface ChampionMiniSectionProps {
  champions: ChampionSpotlightEntry[];
}

export function ChampionMiniSection({ champions }: ChampionMiniSectionProps) {
  const orderedChampions = champions;

  const [selectedId, setSelectedId] = useState<string | null>(
    orderedChampions[0]?.championId ?? null
  );

  useEffect(() => {
    if (!orderedChampions.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId) {
      setSelectedId(orderedChampions[0].championId);
      return;
    }
    const exists = orderedChampions.some(
      (champ) => champ.championId === selectedId
    );
    if (!exists) {
      setSelectedId(orderedChampions[0].championId);
    }
  }, [orderedChampions, selectedId]);

  if (!orderedChampions.length) {
    return <PlaceholderCard message="Champion stats coming soon" />;
  }

  const selectedChampion =
    orderedChampions.find((champ) => champ.championId === selectedId) ??
    orderedChampions[0];

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <ChampionPortraitGrid
        champions={orderedChampions}
        selectedId={selectedChampion.championId}
        onSelect={setSelectedId}
      />
      <ChampionMiniCard champion={selectedChampion} />
    </div>
  );
}

