import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";
import { getSummarizedOverallData } from "@/lib/endpoints";
import { MapSideComparison } from "@/components/stats/map-side-comparison";

export const metadata = generatePageMetadata(
  statRoutes["map-side-comparison"].title,
  statRoutes["map-side-comparison"].description
);

export default async function MapSideComparisonPage() {
  const overallData = await getSummarizedOverallData();

  if (!overallData || !overallData.redSide || !overallData.blueSide) {
    return (
      <div className="mt-6">
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            No map side comparison data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <MapSideComparison
        redSide={overallData.redSide}
        blueSide={overallData.blueSide}
      />
    </div>
  );
}
