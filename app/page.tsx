import {
  getInitialRankChangeLog,
  getMVPPlayers,
  getPlayerList,
  getRankChangeLog,
  getSummarizedOverallData,
} from "@/lib/endpoints";
import {
  HeroSection,
  StatsCardsSection,
  ActivitySection,
  ChampionsSection,
  RolesSection,
  PlayerOverallLeaderboard,
} from "@/components/home";
import { PageHeader } from "@/components/ui/page-header";
import { getRoleLeaderboardData } from "@/lib/endpoints";
import { Player } from "@/lib/types";

export default async function Home() {
  const [
    allPlayersObject,
    rankChangeLog,
    summarizedOverallData,
    initialRankChangeLog,
    roleLeaderboard,
    mvpPlayers,
  ] = await Promise.all([
    getPlayerList(),
    getRankChangeLog(),
    getSummarizedOverallData(),
    getInitialRankChangeLog(),
    getRoleLeaderboardData(),
    getMVPPlayers(),
  ]);

  const playerList: Player[] = allPlayersObject
    ? Object.values(allPlayersObject).filter((player) => !player.hide)
    : [];
  // Calculate some basic stats for the cards
  const totalPlayers = playerList ? playerList.length : 0;

  // Get the recent MVP player by account_id
  const recentMVP = Object.values(mvpPlayers ?? {}).sort(
    (a, b) => b.wins - a.wins || b.meanScore - a.meanScore
  )[0];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
      <PageHeader
        title="x5 dos nerds"
        description="Custom league of legends analytics dashboard"
      />

      <HeroSection
        initialRankChangeLog={initialRankChangeLog}
        rankChangeLog={rankChangeLog}
        playerList={playerList}
      />

      <StatsCardsSection
        numberOfGames={summarizedOverallData?.numberOfGames || 0}
        totalPlayers={totalPlayers}
        mostRecentGameTimestamp={summarizedOverallData?.mostRecentGameTimestamp}
        recentMVP={recentMVP}
      />

      <PlayerOverallLeaderboard
        leaderboard={summarizedOverallData?.leaderboard}
      />

      <RolesSection roleLeaderboard={roleLeaderboard} />

      <ChampionsSection
        championLeaderboard={summarizedOverallData?.championLeaderboard}
        championTableData={summarizedOverallData?.champions}
        totalGames={summarizedOverallData?.numberOfGames}
      />

      <ActivitySection
        data={{
          gamesPerMonth: summarizedOverallData?.gamesPerMonth || {},
          gamesPerHour: summarizedOverallData?.hourlyDistribution || [],
          gamesPerDay: summarizedOverallData?.weekDayDistribution || [],
          gameDurationDistribution:
            summarizedOverallData?.gameDurationHistogram || {},
        }}
      />
    </div>
  );
}
