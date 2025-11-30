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

const roleLabels: Record<Role, string> = {
  top: "Top",
  jungle: "Jungle",
  mid: "Mid",
  adc: "ADC",
  support: "Support",
};

const detailSections = [
  {
    id: "mvp-table",
    title: "MVP Leaderboard",
    description: "Identify consistent impact performers across the split",
    href: "/stats/mvp-table",
  },
  {
    id: "player-stats",
    title: "Player Statistics",
    description: "Deep dive by lane, metric, and sample size",
    href: "/stats/player-stats",
  },
  {
    id: "champion-stats",
    title: "Champion Statistics",
    description: "Pick/ban trends and per-role standouts",
    href: "/stats/champion-stats",
  },
  {
    id: "rank-analysis",
    title: "Rank Analysis",
    description: "Ladder movement and role-based win/loss deltas",
    href: "/stats/rank-analysis",
  },
  {
    id: "victory-statistics",
    title: "Victory Statistics",
    description: "Objective control and what closes out games",
    href: "/stats/victory-statistics",
  },
  {
    id: "map-side-comparison",
    title: "Map Side Comparison",
    description: "Blue vs red performance and objective control",
    href: "/stats/map-side-comparison",
  },
];

export function StatsOverview({
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
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <SectionHeader
            title="Victory Drivers"
            link="/stats/victory-statistics"
          />
          <VictoryPreview
            cards={victoryHighlight.cards}
            dragonData={victoryHighlight.dragonData}
          />
        </div>
        <div className="space-y-4 flex flex-col">
          <SectionHeader
            title="Map Side Comparison"
            link="/stats/map-side-comparison"
          />
          <MapPreview data={mapSummary} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 flex flex-col">
          <SectionHeader title="Rank Movers" link="/stats/rank-analysis" />
          <RankHighlights
            movers={rankTopMovers}
            netWins={rankNetWins}
            roleLabels={roleLabels}
          />
        </div>
        <div className="space-y-4 flex flex-col">
          <SectionHeader title="MVP Board" link="/stats/mvp-table" />
          <MvpMiniTable rows={mvpRows} />
        </div>
        <div className="space-y-4 flex flex-col">
          <SectionHeader title="Role Standouts" link="/stats/player-stats" />
          <PlayerHighlightsList
            players={playerHighlights}
            roleLabels={roleLabels}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Champion Highlights"
          link="/stats/champion-stats"
        />
        <ChampionMiniSection champions={championSpotlight} />
        {neverPickedChampions.length > 0 && (
          <NeverPickedGrid champions={neverPickedChampions} />
        )}
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Featured Player Metric"
          link="/stats/player-stats"
        />
        <PlayerStatRotation statSets={playerStatSets} />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Detailed Stats</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detailSections.map((section) => (
            <Link key={section.id} href={section.href}>
              <div className="h-full rounded-lg border border-border/70 bg-card/60 p-4 hover:border-primary transition-colors">
                <p className="font-semibold">{section.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {section.description}
                </p>
                <p className="text-xs text-primary mt-3">View full report →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
