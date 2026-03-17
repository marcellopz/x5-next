import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";
import { getPlayerRankChangeStats, getPlayerList } from "@/lib/endpoints";
import { RankAnalysis } from "@/components/stats/rank-analysis";
import { t, getLocale, getTranslations } from "@/lib/i18n";

export async function generateMetadata() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, statRoutes["rank-analysis"].titleKey),
    t(trans, statRoutes["rank-analysis"].descriptionKey)
  );
}

export default async function RankAnalysisPage() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const [playerRankChangeStats, playerList] = await Promise.all([
    getPlayerRankChangeStats(),
    getPlayerList(),
  ]);

  if (!playerRankChangeStats) {
    return (
      <div className="mt-6">
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            {t(trans, "stats.noRankChangeStats")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <RankAnalysis data={playerRankChangeStats} playerList={playerList} />
    </div>
  );
}
