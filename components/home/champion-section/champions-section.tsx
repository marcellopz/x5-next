"use client";

import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { ChampionCard } from "./champion-card";
import { ChampionTable } from "./champion-table";
import { standoutChampions, championTableData } from "./champion-table-data";

export function ChampionsSection() {
  return (
    <CollapsibleSection title="Champion Statistics">
      <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch min-w-0">
        {/* Left side - Standout picks (2x2 grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:content-start">
          {standoutChampions.map((champion, index) => (
            <ChampionCard key={index} {...champion} />
          ))}
        </div>

        {/* Right side - Champions table */}
        <div className="lg:col-span-2 flex min-w-0">
          <ChampionTable data={championTableData} />
        </div>
      </div>
    </CollapsibleSection>
  );
}
