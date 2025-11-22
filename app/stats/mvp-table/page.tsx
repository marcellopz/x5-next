import { generatePageMetadata } from "@/lib/metadata";
import { getMVPPlayers } from "@/lib/endpoints";
import { MVPTable } from "@/components/stats/mvp-table";
import { statRoutes } from "../stat-routes";

export const metadata = generatePageMetadata(
  statRoutes["mvp-table"].title,
  statRoutes["mvp-table"].description
);

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
