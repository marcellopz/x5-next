import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";

export const metadata = generatePageMetadata(
  statRoutes["role-champion-stats"].title,
  statRoutes["role-champion-stats"].description
);

export default function RoleChampionStatsPage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          Role Champion Stats content coming soon...
        </p>
      </div>
    </div>
  );
}
