import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";

export const metadata = generatePageMetadata(
  statRoutes["rank-analysis"].title,
  statRoutes["rank-analysis"].description
);

export default function RankAnalysisPage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          Rank Analysis content coming soon...
        </p>
      </div>
    </div>
  );
}
