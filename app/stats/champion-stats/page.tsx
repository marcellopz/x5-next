import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";

export const metadata = generatePageMetadata(
  statRoutes["champion-stats"].title,
  statRoutes["champion-stats"].description
);

export default function ChampionStatsPage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          Champion Stats content coming soon...
        </p>
      </div>
    </div>
  );
}
