import type { Role, VictoryStatistics } from "@/lib/types";
import { VictoryPreview } from "./victory-preview";
import { MapPreview } from "./map-preview";
import { PlayerStatRotation } from "./player-stat-rotation";
import Link from "next/link";
import type { SummaryCardItem } from "@/components/stats/victory-statistics/summary-cards";
import type {
  ChampionSpotlightEntry,
  MapSummary,
  NeverPickedChampion,
} from "./types";
export type {
  MapSummary,
  MapObjectiveKey,
  ChampionSpotlightEntry,
  NeverPickedChampion,
} from "./types";
import { SectionHeader } from "./section-header";
import { PlayerHighlightsList } from "./player-highlights-list";
import { RankHighlights } from "./rank-highlights";
import { MvpMiniTable } from "./mvp-mini-table";
import { ChampionMiniSection } from "./champion-mini-section";
import { NeverPickedGrid } from "./never-picked-grid";

export interface PlayerHighlight {
  role: Role;
  name: string;
  tagLine?: string;
  winRate: number;
  games: number;
  summonerId: string | number;
}

export interface VictoryHighlight {
  cards: SummaryCardItem[];
  dragonData: VictoryStatistics["dragons"] | null;
}

export interface RankHighlight {
  name: string;
  changes: number;
  id: string;
}

export interface RankNetWinEntry {
  name: string;
  role: Role;
  wins: number;
  losses: number;
  diff: number;
  id: string;
}

export interface MvpRow {
  name: string;
  wins: number;
  games: number;
  score: number;
  summonerId: string | number;
}

export interface PlayerStatSet {
  id: string;
  role: Role;
  title: string;
  subtitle: string;
  rows: Array<{
    name: string;
    tagLine?: string;
    valueLabel: string;
    detail?: string;
  }>;
}

export interface ChampionPresenceEntry {
  id: string;
  name: string;
  presence: number;
  picks: number;
  bans: number;
}

interface StatsOverviewProps {
  t: (key: string) => string;
  championSpotlight: ChampionSpotlightEntry[];
  neverPickedChampions: NeverPickedChampion[];
  playerHighlights: PlayerHighlight[];
  playerStatSets: PlayerStatSet[];
  victoryHighlight: VictoryHighlight;
  mapSummary: MapSummary | null;
  rankTopMovers: RankHighlight[];
  rankNetWins: RankNetWinEntry[];
  mvpRows: MvpRow[];
}

const detailSectionKeys = [
  { id: "mvp-table", titleKey: "stats.mvpTable.title", descKey: "stats.mvpTable.description", href: "/stats/mvp-table" },
  { id: "player-stats", titleKey: "stats.playerStats.title", descKey: "stats.playerStats.description", href: "/stats/player-stats" },
  { id: "champion-stats", titleKey: "stats.championStats.title", descKey: "stats.championStats.description", href: "/stats/champion-stats" },
  { id: "rank-analysis", titleKey: "stats.rankAnalysis.title", descKey: "stats.rankAnalysis.description", href: "/stats/rank-analysis" },
  { id: "victory-statistics", titleKey: "stats.victoryStatistics.title", descKey: "stats.victoryStatistics.description", href: "/stats/victory-statistics" },
  { id: "map-side-comparison", titleKey: "stats.mapSideComparison.title", descKey: "stats.mapSideComparison.description", href: "/stats/map-side-comparison" },
];

export function StatsOverview({
  t,
  championSpotlight,
  neverPickedChampions,
  playerHighlights,
  playerStatSets,
  victoryHighlight,
  mapSummary,
  rankTopMovers,
  rankNetWins,
  mvpRows,
}: StatsOverviewProps) {
  const roleLabels: Record<Role, string> = {
    top: t("roles.top"),
    jungle: t("roles.jungle"),
    mid: t("roles.mid"),
    adc: t("roles.adc"),
    support: t("roles.support"),
  };
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <SectionHeader
            title={t("stats.victoryDrivers")}
            link="/stats/victory-statistics"
            linkText={t("common.viewAll")}
          />
          <VictoryPreview
            cards={victoryHighlight.cards}
            dragonData={victoryHighlight.dragonData}
          />
        </div>
        <div className="space-y-4 flex flex-col">
          <SectionHeader
            title={t("stats.mapSideComparison.title")}
            link="/stats/map-side-comparison"
            linkText={t("common.viewAll")}
          />
          <MapPreview data={mapSummary} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 flex flex-col">
          <SectionHeader title={t("stats.rankAnalysis.title")} link="/stats/rank-analysis" linkText={t("common.viewAll")} />
          <RankHighlights
            movers={rankTopMovers}
            netWins={rankNetWins}
            roleLabels={roleLabels}
          />
        </div>
        <div className="space-y-4 flex flex-col">
          <SectionHeader title={t("stats.mvpTable.title")} link="/stats/mvp-table" linkText={t("common.viewAll")} />
          <MvpMiniTable rows={mvpRows} />
        </div>
        <div className="space-y-4 flex flex-col">
          <SectionHeader title={t("stats.playerStats.title")} link="/stats/player-stats" />
          <PlayerHighlightsList
            players={playerHighlights}
            roleLabels={roleLabels}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          title={t("stats.championStats.title")}
          link="/stats/champion-stats"
          linkText={t("common.viewAll")}
        />
        <ChampionMiniSection champions={championSpotlight} />
        {neverPickedChampions.length > 0 && (
          <NeverPickedGrid champions={neverPickedChampions} />
        )}
      </section>

      <section className="space-y-4">
        <SectionHeader
          title={t("stats.featuredPlayerMetric")}
          link="/stats/player-stats"
        />
        <PlayerStatRotation statSets={playerStatSets} />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t("stats.title")}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detailSectionKeys.map((section) => (
            <Link key={section.id} href={section.href}>
              <div className="h-full rounded-lg border border-border/70 bg-card/60 p-4 hover:border-primary transition-colors">
                <p className="font-semibold">{t(section.titleKey)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t(section.descKey)}
                </p>
                <p className="text-xs text-primary mt-3">{t("stats.viewFullReport")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
