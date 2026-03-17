import { generatePageMetadata } from "@/lib/metadata";
import { getMVPPlayers } from "@/lib/endpoints";
import { MVPTable } from "@/components/stats/mvp-table";
import { statRoutes } from "../stat-routes";
import { t, getLocale, getTranslations } from "@/lib/i18n";

export async function generateMetadata() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, statRoutes["mvp-table"].titleKey),
    t(trans, statRoutes["mvp-table"].descriptionKey)
  );
}

export default async function MVPTablePage() {
  const mvpPlayers = await getMVPPlayers();
  const mvpPlayersArray = Object.values(mvpPlayers ?? {}).sort(
    (a, b) => b.wins - a.wins || b.meanScore - a.meanScore
  );

  return (
    <div className="mt-6">
      <MVPTable players={mvpPlayersArray} />
    </div>
  );
}
