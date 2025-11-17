import { generatePageMetadata } from "@/lib/metadata";
import { StatsBreadcrumb, StatsPageTitle } from "../layout";

export const metadata = generatePageMetadata(
  "Champion Stats",
  "Overall champion statistics and performance metrics"
);

export default function ChampionStatsPage() {
  return (
    <>
      <StatsBreadcrumb currentPage="champion-stats" />
      <StatsPageTitle title="Champion Stats" />
      
      <div className="mt-6">
        <p className="text-muted-foreground mb-4">
          Overall champion statistics and performance metrics
        </p>
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            Champion Stats content coming soon...
          </p>
        </div>
      </div>
    </>
  );
}

