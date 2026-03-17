import { generatePageMetadata } from "@/lib/metadata";
import { getPlayersAverageRoleStats } from "@/lib/endpoints";
import { RolePlayerStats } from "@/components/stats/player-stats";
import { statRoutes } from "../stat-routes";
import { t, getLocale, getTranslations } from "@/lib/i18n";

export async function generateMetadata() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, statRoutes["player-stats"].titleKey),
    t(trans, statRoutes["player-stats"].descriptionKey)
  );
}

export default async function RolePlayerStatsPage() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const playersAverageRoleStats = await getPlayersAverageRoleStats();

  if (!playersAverageRoleStats) {
    return (
      <div className="mt-6">
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            {t(trans, "stats.unableToLoadPlayerStats")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <RolePlayerStats data={playersAverageRoleStats} />
    </div>
  );
}
