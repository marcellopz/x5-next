import { getPlayerList, getPlayerSummary } from "@/lib/firebase-admin";
import { PlayerListTable } from "@/components/player-list/player-list-table";

// Revalidate the page every request to get fresh data
export const revalidate = 0;

export default async function PlayerListPage() {
  const [playerList, playerSummary] = await Promise.all([
    getPlayerList(),
    getPlayerSummary(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Player List</h1>
          <p className="text-sm text-muted-foreground">
            Overview of all registered players and their statistics
          </p>
        </div>

        <PlayerListTable
          playerList={playerList}
          playerSummary={playerSummary}
        />
      </div>
    </div>
  );
}
