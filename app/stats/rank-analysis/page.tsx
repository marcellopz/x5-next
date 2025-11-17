import { generatePageMetadata } from "@/lib/metadata";
import { StatsBreadcrumb, StatsPageTitle } from "../layout";

export const metadata = generatePageMetadata(
  "Rank Analysis",
  "Detailed analysis of player rankings and rank changes"
);

export default function RankAnalysisPage() {
  return (
    <>
      <StatsBreadcrumb currentPage="rank-analysis" />
      <StatsPageTitle title="Rank Analysis" />
      
      <div className="mt-6">
        <p className="text-muted-foreground mb-4">
          Detailed analysis of player rankings and rank changes
        </p>
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            Rank Analysis content coming soon...
          </p>
        </div>
      </div>
    </>
  );
}

