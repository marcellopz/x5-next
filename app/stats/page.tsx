import { generatePageMetadata } from "@/lib/metadata";
import {
  getSummarizedOverallData,
  getPlayerList,
  getMVPPlayers,
} from "@/lib/endpoints";
import { StatsCardsSection } from "@/components/home/stats-cards-section";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Player } from "@/lib/types";
import { statRoutes } from "./stat-routes";

export const metadata = generatePageMetadata(
  "Stats",
  "Overall statistics, leaderboards, and analytics"
);

const statOptions = [
  {
    id: "mvp-table",
    title: statRoutes["mvp-table"].title,
    description: statRoutes["mvp-table"].description,
    href: "/stats/mvp-table",
  },
  {
    id: "player-stats",
    title: statRoutes["player-stats"].title,
    description: statRoutes["player-stats"].description,
    href: "/stats/player-stats",
  },
  {
    id: "champion-stats",
    title: statRoutes["champion-stats"].title,
    description: statRoutes["champion-stats"].description,
    href: "/stats/champion-stats",
  },
  {
    id: "rank-analysis",
    title: statRoutes["rank-analysis"].title,
    description: statRoutes["rank-analysis"].description,
    href: "/stats/rank-analysis",
  },
  {
    id: "victory-statistics",
    title: statRoutes["victory-statistics"].title,
    description: statRoutes["victory-statistics"].description,
    href: "/stats/victory-statistics",
  },
  {
    id: "map-side-comparison",
    title: statRoutes["map-side-comparison"].title,
    description: statRoutes["map-side-comparison"].description,
    href: "/stats/map-side-comparison",
  },
];

export default async function StatsPage() {
  const [summarizedOverallData, allPlayersObject, mvpPlayers] =
    await Promise.all([
      getSummarizedOverallData(),
      getPlayerList(),
      getMVPPlayers(),
    ]);

  const playerList: Player[] = allPlayersObject
    ? Object.values(allPlayersObject).filter((player) => !player.hide)
    : [];
  const totalPlayers = playerList ? playerList.length : 0;

  const recentMVP = Object.values(mvpPlayers ?? {}).sort(
    (a, b) => b.wins - a.wins || b.meanScore - a.meanScore
  )[0];

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
      </div>

      <div className="space-y-8">
        {/* General Stats Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">General Statistics</h2>
          <StatsCardsSection
            numberOfGames={summarizedOverallData?.numberOfGames || 0}
            totalPlayers={totalPlayers}
            mostRecentGameTimestamp={
              summarizedOverallData?.mostRecentGameTimestamp
            }
            recentMVP={recentMVP}
          />
        </div>

        {/* Stat Options Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statOptions.map((option) => (
              <Link key={option.id} href={option.href}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
