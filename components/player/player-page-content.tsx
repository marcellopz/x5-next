"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  Player,
  PlayerInfo,
  PlayerPairs,
  PlayerSummary,
  ChampionStats,
} from "@/lib/types";
import { PlayerPageProvider } from "./player-page-context";
import { PlayerBanner } from "./player-banner";
import { PlayerSummaryTab } from "./summary-tab";
import { PlayerChampionsTab } from "./champions-tab";
import { PlayerStatsTab } from "./stats-tab";
import { PlayerRecordsTab } from "./records-tab";

const tabs = [
  { label: "Summary", index: 0 },
  { label: "Champions", index: 1 },
  { label: "Stats", index: 2 },
  { label: "Records", index: 3 },
];

interface PlayerPageContentProps {
  player: Player;
  playerKey: string;
  playerInfo: PlayerInfo;
  playerPairs: PlayerPairs | null;
  playerSummary: PlayerSummary | null;
  champs: ChampionStats[];
}

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return (
    <div role="tabpanel" hidden={value !== index} className="mt-4">
      {value === index && children}
    </div>
  );
}

function PlayerPageContentInner({
  player,
  playerInfo,
  playerPairs,
  playerSummary,
  champs,
}: Omit<PlayerPageContentProps, "playerKey">) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <div>
          <PlayerBanner
            champs={champs}
            playerInfo={playerInfo}
            player={player}
          />

          {/* Tabs */}
          <div className="border-t border-border pt-4 px-6">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.index}
                  variant="ghost"
                  onClick={() => setSelectedTab(tab.index)}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-4 py-2",
                    selectedTab === tab.index
                      ? "border-primary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          <TabPanel index={0} value={selectedTab}>
            <PlayerSummaryTab champs={champs} playerInfo={playerInfo} />
          </TabPanel>

          <TabPanel index={1} value={selectedTab}>
            <PlayerChampionsTab champs={champs} />
          </TabPanel>

          <TabPanel index={2} value={selectedTab}>
            <PlayerStatsTab
              playerInfo={playerInfo}
              playerPairs={playerPairs}
              playerSummary={playerSummary}
            />
          </TabPanel>

          <TabPanel index={3} value={selectedTab}>
            <PlayerRecordsTab records={playerInfo.records} />
          </TabPanel>
        </div>
      </Card>
    </div>
  );
}

export function PlayerPageContent({
  player,
  playerKey,
  playerInfo,
  playerPairs,
  playerSummary,
  champs,
}: PlayerPageContentProps) {
  return (
    <PlayerPageProvider>
      <PlayerPageContentInner
        player={player}
        playerInfo={playerInfo}
        playerPairs={playerPairs}
        playerSummary={playerSummary}
        champs={champs}
      />
    </PlayerPageProvider>
  );
}
