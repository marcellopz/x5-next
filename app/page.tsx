import { getPlayerList, getRankChangeLog } from "@/lib/firebase-admin";
import { PlayerCarousel } from "@/components/home/player-carousel";
import { RecentChanges } from "@/components/home/recent-changes";
import { StatsCard } from "@/components/home/stats-card";
import { GraphCard } from "@/components/home/graph-card";

export default async function Home() {
  const playerList = await getPlayerList();
  const rankChangeLog = await getRankChangeLog();

  // Calculate some basic stats for the cards
  const totalPlayers = playerList ? Object.keys(playerList).length : 0;
  const visiblePlayers = playerList
    ? Object.values(playerList).filter((player) => !player.hide).length
    : 0;

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
          <RecentChanges rankChangeLog={rankChangeLog} />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Number of matches"
          value={visiblePlayers}
          description="Number of matches played"
        />
        <StatsCard
          title="Total Players"
          value={totalPlayers}
          description="All registered players"
        />
        <StatsCard title="???" value="???" description="???" />
        <StatsCard title="???" value="???" description="???" />
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
