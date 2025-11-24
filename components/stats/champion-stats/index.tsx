"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ChampionsAverageRoleStats } from "@/lib/types";
import { ChampionsTable } from "./champions-table";
import { ChampionDetailsCard } from "./champion-details-card";
import useIsMobile from "@/lib/hooks/useIsMobile";

type RoleFilter = "all" | "top" | "jungle" | "mid" | "adc" | "support";

interface ChampionStatsProps {
  data: ChampionsAverageRoleStats;
}

const roleLabels: Record<RoleFilter, string> = {
  all: "All",
  top: "Top",
  jungle: "Jungle",
  mid: "Mid",
  adc: "Adc",
  support: "Support",
};

const roleFilters: RoleFilter[] = [
  "all",
  "top",
  "jungle",
  "mid",
  "adc",
  "support",
];

export function ChampionStats({ data }: ChampionStatsProps) {
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("all");
  const [selectedChampionId, setSelectedChampionId] = useState<string | null>(
    null
  );
  const [filterMoreThanFive, setFilterMoreThanFive] = useState(false);
  const isMobile = useIsMobile();

  // Get champions for selected role
  const allChampionsData =
    selectedRole === "all" ? data.all : data[selectedRole];

  // Filter champions based on picks > 5
  const championsData = useMemo(() => {
    if (!filterMoreThanFive) return allChampionsData;

    const filtered: typeof allChampionsData = {};
    Object.entries(allChampionsData).forEach(([championId, champion]) => {
      if (champion.picks > 5) {
        filtered[championId] = champion;
      }
    });
    return filtered;
  }, [allChampionsData, filterMoreThanFive]);

  // Reset selection if selected champion is filtered out
  useEffect(() => {
    if (selectedChampionId && !championsData[selectedChampionId]) {
      setSelectedChampionId(null);
    }
  }, [championsData, selectedChampionId]);

  // Get selected champion data
  const selectedChampion = selectedChampionId
    ? championsData[selectedChampionId]
    : null;

  return (
    <div className="space-y-2 lg:space-y-6">
      {/* Role Filter Buttons and Checkbox */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-wrap gap-2">
          {roleFilters.map((role) => (
            <Button
              size={isMobile ? "xs" : "sm"}
              key={role}
              variant={selectedRole === role ? "default" : "outline"}
              onClick={() => {
                setSelectedRole(role);
                setSelectedChampionId(null); // Reset selection when changing role
              }}
              className={cn(
                "transition-colors rounded-xl!",
                selectedRole === role && "ring-2 ring-primary/50"
              )}
            >
              {roleLabels[role]}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <Checkbox
            id="more-than-five-checkbox"
            checked={filterMoreThanFive}
            onChange={(e) => setFilterMoreThanFive(e.target.checked)}
          />
          <label
            htmlFor="more-than-five-checkbox"
            className="text-sm text-muted-foreground cursor-pointer select-none"
          >
            Filter for more than 5 games
          </label>
        </div>
      </div>

      {/* Content: Table on left, Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Champions Table */}
        <div className="lg:col-span-3 max-h-[300px] lg:max-h-none lg:border-none border border-border rounded-lg overflow-y-auto">
          <ChampionsTable
            champions={championsData}
            selectedChampionId={selectedChampionId}
            onSelectChampion={setSelectedChampionId}
            selectedRole={selectedRole}
          />
        </div>

        {/* Champion Details Card */}
        <div className="lg:col-span-2">
          <ChampionDetailsCard champion={selectedChampion} />
        </div>
      </div>
    </div>
  );
}
