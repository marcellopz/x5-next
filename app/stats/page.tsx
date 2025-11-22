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

export const metadata = generatePageMetadata(
  "Stats",
  "Overall statistics, leaderboards, and analytics"
);

const statOptions = [
  {
    id: "mvp-table",
    title: "MVP Table",
    description: "View the most valuable players based on performance metrics",
    href: "/stats/mvp-table",
  },
  {
    id: "role-player-stats",
    title: "Role Player Stats",
    description:
      "Statistics for players by their roles (Top, Jungle, Mid, ADC, Support)",
    href: "/stats/role-player-stats",
  },
  {
    id: "role-champion-stats",
    title: "Role Champion Stats",
    description: "Champion performance statistics broken down by role",
    href: "/stats/role-champion-stats",
  },
  {
    id: "champion-stats",
    title: "Champion Stats",
    description: "Overall champion statistics and performance metrics",
    href: "/stats/champion-stats",
  },
  {
    id: "rank-analysis",
    title: "Rank Analysis",
    description: "Detailed analysis of player rankings and rank changes",
    href: "/stats/rank-analysis",
  },
  {
    id: "victory-statistics",
    title: "Victory Statistics",
    description: "Win rates, victory patterns, and match outcome analytics",
    href: "/stats/victory-statistics",
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
