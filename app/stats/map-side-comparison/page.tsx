import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";
import { getSummarizedOverallData } from "@/lib/endpoints";
import { MapSideComparison } from "@/components/stats/map-side-comparison";
import { t, getLocale, getTranslations } from "@/lib/i18n";

export async function generateMetadata() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, statRoutes["map-side-comparison"].titleKey),
    t(trans, statRoutes["map-side-comparison"].descriptionKey)
  );
}

export default async function MapSideComparisonPage() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const overallData = await getSummarizedOverallData();

  if (!overallData || !overallData.redSide || !overallData.blueSide) {
    return (
      <div className="mt-6">
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            {t(trans, "stats.noMapSideData")}
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
