import { generatePageMetadata } from "@/lib/metadata";
import { StatsBreadcrumb, StatsPageTitle } from "../layout";

export const metadata = generatePageMetadata(
  "Victory Statistics",
  "Win rates, victory patterns, and match outcome analytics"
);

export default function VictoryStatisticsPage() {
  return (
    <>
      <StatsBreadcrumb currentPage="victory-statistics" />
      <StatsPageTitle title="Victory Statistics" />
      
      <div className="mt-6">
        <p className="text-muted-foreground mb-4">
          Win rates, victory patterns, and match outcome analytics
        </p>
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            Victory Statistics content coming soon...
          </p>
        </div>
      </div>
    </>
  );
}

