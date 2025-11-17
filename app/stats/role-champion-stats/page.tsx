import { generatePageMetadata } from "@/lib/metadata";
import { StatsBreadcrumb, StatsPageTitle } from "../layout";

export const metadata = generatePageMetadata(
  "Role Champion Stats",
  "Champion performance statistics broken down by role"
);

export default function RoleChampionStatsPage() {
  return (
    <>
      <StatsBreadcrumb currentPage="role-champion-stats" />
      <StatsPageTitle title="Role Champion Stats" />
      
      <div className="mt-6">
        <p className="text-muted-foreground mb-4">
          Champion performance statistics broken down by role
        </p>
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            Role Champion Stats content coming soon...
          </p>
        </div>
      </div>
    </>
  );
}

