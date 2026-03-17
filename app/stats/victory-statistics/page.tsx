import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";
import { getVictoryStatistics } from "@/lib/endpoints";
import { VictoryStatisticsView } from "@/components/stats/victory-statistics";
import { t, getLocale, getTranslations } from "@/lib/i18n";

export async function generateMetadata() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, statRoutes["victory-statistics"].titleKey),
    t(trans, statRoutes["victory-statistics"].descriptionKey)
  );
}

export default async function VictoryStatisticsPage() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const victoryStats = await getVictoryStatistics();

  if (!victoryStats) {
    return (
      <div className="mt-6">
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            {t(trans, "stats.noVictoryStats")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <VictoryStatisticsView data={victoryStats} />
    </div>
  );
}
