import {
  getInitialRankChangeLog,
  getPlayerList,
  getRankChangeLog,
  getSummarizedOverallData,
} from "@/lib/endpoints";
import { PlayerCarousel } from "@/components/home/player-carousel";
import { PatchNotes } from "@/components/home/patch-notes";
import { StatsCard } from "@/components/home/stats-card";
import { GraphCard } from "@/components/home/graph-card";
import { getPlayerByAccountId, getTimeElapsed } from "@/lib/utils";

// Serve cached data immediately, then refresh cache in background for next request
export const revalidate = 0;

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight">x5 dos nerds</h1>
          <p className="text-sm text-muted-foreground">
            Custom league of legends analytics dashboard
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <PlayerCarousel />
        </div>
        <div>
          <PatchNotes
            initialRankChangeLog={initialRankChangeLog}
            rankChangeLog={rankChangeLog}
          />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Number of matches"
          value={summarizedOverallData?.numberOfGames || 0}
          description="Number of matches played"
        />
        <StatsCard
          title="Total Players"
          value={totalPlayers}
          description="All registered players"
        />
        <StatsCard
          title="Time since last match"
          value={
            summarizedOverallData?.mostRecentGameTimestamp
              ? getTimeElapsed(summarizedOverallData.mostRecentGameTimestamp)
              : "Unknown"
          }
          description="Time since last match"
        />
        <StatsCard
          title="Recent MVP"
          value={recentMVP?.name || "???"}
          description="Most wins in the last 10 matches"
        />
      </div>

      {/* Graph Cards Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <GraphCard
          title="Games played per month"
          description="Games played per month"
        />
        <GraphCard
          title="Games played by hour of the day"
          description="Games played by hour of the day"
        />
        <GraphCard
          title="Games played by day of the week"
          description="Games played by day of the week"
        />
        <GraphCard
          title="Game duration distribution"
          description="Game duration distribution"
        />
      </div>
    </div>
  );
}
