import {
  getInitialRankChangeLog,
  getPlayerList,
  getRankChangeLog,
  getSummarizedOverallData,
} from "@/lib/endpoints";
import {
  HeroSection,
  StatsCardsSection,
  PlayerStatsSection,
  AnalyticsSection,
} from "@/components/home";
import { PageHeader } from "@/components/ui/page-header";
import { getPlayerByAccountId } from "@/lib/utils";

export default async function Home() {
  const playerList = await getPlayerList();
  const rankChangeLog = await getRankChangeLog();
  const summarizedOverallData = await getSummarizedOverallData();
  const initialRankChangeLog = await getInitialRankChangeLog();

  // Calculate some basic stats for the cards
  const totalPlayers = playerList ? Object.keys(playerList).length : 0;

  // Get the recent MVP player by account_id
  const recentMVP = summarizedOverallData?.topRecentPlayer
    ? getPlayerByAccountId(playerList, summarizedOverallData.topRecentPlayer)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
      <PageHeader
        title="x5 dos nerds"
        description="Custom league of legends analytics dashboard"
      />

      <HeroSection
        initialRankChangeLog={initialRankChangeLog}
        rankChangeLog={rankChangeLog}
      />

      <StatsCardsSection
        numberOfGames={summarizedOverallData?.numberOfGames || 0}
        totalPlayers={totalPlayers}
        mostRecentGameTimestamp={summarizedOverallData?.mostRecentGameTimestamp}
        recentMVP={recentMVP?.name || "???"}
      />

      <PlayerStatsSection />

      <AnalyticsSection />
    </div>
  );
}
