import { PlayerSummaryTab } from "./summary-tab";
import { PlayerChampionsTab } from "./champions-tab";
import { PlayerStatsTab } from "./stats-tab";
import { PlayerRecordsTab } from "./records-tab";

interface PlayerPageContentProps {
  tab: string;
}

const tabMap: Record<string, number> = {
  "": 0, // Summary (default)
  champions: 1,
  stats: 2,
  records: 3,
};

export function PlayerPageContent({ tab }: PlayerPageContentProps) {
  const selectedTab = tabMap[tab] ?? 0;

  return (
    <>
      {selectedTab === 0 && <PlayerSummaryTab />}

      {selectedTab === 1 && <PlayerChampionsTab />}

      {selectedTab === 2 && <PlayerStatsTab />}

      {selectedTab === 3 && <PlayerRecordsTab />}
    </>
  );
}
