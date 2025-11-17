import { generatePageMetadata } from "@/lib/metadata";
import { StatsBreadcrumb, StatsPageTitle } from "../layout";

export const metadata = generatePageMetadata(
  "Role Player Stats",
  "Statistics for players by their roles"
);

export default function RolePlayerStatsPage() {
  return (
    <>
      <StatsBreadcrumb currentPage="role-player-stats" />
      <StatsPageTitle title="Role Player Stats" />

      <div className="mt-6">
        <p className="text-muted-foreground mb-4">
          Statistics for players by their roles
        </p>
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            Role Player Stats content coming soon...
          </p>
        </div>
      </div>
    </>
  );
}
