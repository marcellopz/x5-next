import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";

export const metadata = generatePageMetadata(
  statRoutes["victory-statistics"].title,
  statRoutes["victory-statistics"].description
);

export default function VictoryStatisticsPage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          Victory Statistics content coming soon...
        </p>
      </div>
    </div>
  );
}
