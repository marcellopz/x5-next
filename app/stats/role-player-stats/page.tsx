import { generatePageMetadata } from "@/lib/metadata";
import { getPlayersAverageRoleStats } from "@/lib/endpoints";
import { RolePlayerStats } from "@/components/stats/role-player-stats";

export const metadata = generatePageMetadata(
  "Role Player Stats",
  "Statistics for players by their roles"
);

export default async function RolePlayerStatsPage() {
  const playersAverageRoleStats = await getPlayersAverageRoleStats();

  if (!playersAverageRoleStats) {
    return (
      <div className="mt-6">
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            Unable to load role player statistics right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <RolePlayerStats data={playersAverageRoleStats} />
    </div>
  );
}
