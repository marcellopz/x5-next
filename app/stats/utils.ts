import type {
  ChampionStats as ChampionStatsType,
  ChampionsAverageRoleStats,
  MvpPlayers,
  PlayerList,
  PlayerMvpPerformanceInGames,
  PlayerRankChangeStats,
  PlayersAverageRoleStats,
  Role,
  SummarizedOverallData,
  VictoryStatistics,
} from "@/lib/types";
import type {
  ChampionSpotlightEntry,
  NeverPickedChampion,
} from "@/components/stats/stats-overview/types";
import { championIds } from "@/lib/resources";
import type {
  MapSummary,
  MvpRow,
  PlayerHighlight,
  PlayerStatSet,
  RankHighlight,
  RankNetWinEntry,
  VictoryHighlight,
} from "@/components/stats/stats-overview";
import type { SummaryCardItem } from "@/components/stats/victory-statistics/summary-cards";

const LANES: Role[] = ["top", "jungle", "mid", "adc", "support"];

export function extractChampionData(
  stats: ChampionsAverageRoleStats | null,
  championsOverAllData: Record<string, ChampionStatsType> | null,
  totalGames: number
): {
  spotlight: ChampionSpotlightEntry[];
  neverPicked: NeverPickedChampion[];
} {
  const spotlight: ChampionSpotlightEntry[] = stats?.all
    ? Object.values(stats.all)
        .filter((champ) => champ.picks > 0)
        .map((champ) => {
          const championData = championsOverAllData?.[champ.championId];
          const bans = championData?.bans ?? champ.bans ?? 0;
          const presence =
            totalGames > 0 && championData
              ? ((championData.picks + bans) / totalGames) * 100
              : champ.presence ?? 0;

          return {
            championId: champ.championId,
            championName: champ.championName,
            picks: champ.picks,
            wins: champ.wins,
            kills: champ.kills,
            deaths: champ.deaths,
            assists: champ.assists,
            creepsKilled: champ.creepsKilled ?? 0,
            bans,
            presence,
            playedBy: champ.playedBy,
          };
        })
        .sort((a, b) => a.championName.localeCompare(b.championName))
    : [];

  // Get all picked champion IDs
  const pickedChampionIds = new Set(spotlight.map((champ) => champ.championId));

  // Find never-picked champions
  const neverPicked: NeverPickedChampion[] = Object.entries(championIds)
    .filter(([id]) => !pickedChampionIds.has(id))
    .map(([id, name]) => ({
      championId: id,
      championName: name,
    }))
    .sort((a, b) => a.championName.localeCompare(b.championName));

  return { spotlight, neverPicked };
}

export function extractPlayerHighlights(
  data: PlayersAverageRoleStats | null
): PlayerHighlight[] {
  if (!data) return [];
  const highlights: PlayerHighlight[] = [];

  for (const lane of LANES) {
    const laneData = data[lane];
    if (!laneData) continue;

    const candidates: PlayerHighlight[] = [];
    for (const player of Object.values(laneData)) {
      const games = player.playerInfo.numberOfGames ?? 0;
      if (games < 5) continue;
      const wins = player.averageStats.wins ?? 0;
      candidates.push({
        role: lane,
        name: player.playerInfo.gameName,
        tagLine: player.playerInfo.tagLine,
        winRate: games > 0 ? wins : 0,
        games,
        summonerId: player.playerInfo.summonerId ?? "",
      });
    }

    if (candidates.length) {
      candidates.sort((a, b) => b.winRate - a.winRate);
      highlights.push(candidates[0]);
    }
  }

  return highlights;
}

type PlayerStatField =
  keyof PlayersAverageRoleStats["top"][string]["averageStats"];

const PLAYER_STAT_CONFIG: Array<{
  id: string;
  role: Role;
  title: string;
  subtitle: string;
  field: PlayerStatField;
  format: (value: number) => string;
}> = [
  // Top Lane (6 stats)
  {
    id: "top-kda",
    role: "top",
    title: "Top Lane KDA",
    subtitle: "Kill/Death/Assist ratio",
    field: "kda",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "top-dpm",
    role: "top",
    title: "Top Lane DPM",
    subtitle: "Damage per minute",
    field: "damagePerMinute",
    format: (value: number) => value.toFixed(0),
  },
  {
    id: "top-cs",
    role: "top",
    title: "Top Lane CS/Min",
    subtitle: "Creep score per minute",
    field: "csPerMinute",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "top-solo-kills",
    role: "top",
    title: "Top Lane Solo Kills",
    subtitle: "Average solo kills per game",
    field: "soloKills",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "top-turret-damage",
    role: "top",
    title: "Top Lane Turret Damage",
    subtitle: "Average damage to turrets",
    field: "damageDealtToTurrets",
    format: (value: number) => `${(value / 1000).toFixed(1)}k`,
  },
  {
    id: "top-gold",
    role: "top",
    title: "Top Lane Gold/Min",
    subtitle: "Gold earned per minute",
    field: "goldPerMinute",
    format: (value: number) => value.toFixed(0),
  },
  // Jungle (6 stats)
  {
    id: "jungle-objectives",
    role: "jungle",
    title: "Jungle Objective Damage",
    subtitle: "Average damage to objectives",
    field: "damageDealtToObjectives",
    format: (value: number) => `${(value / 1000).toFixed(1)}k`,
  },
  {
    id: "jungle-vision",
    role: "jungle",
    title: "Jungle Vision Score",
    subtitle: "Average vision score per game",
    field: "visionScore",
    format: (value: number) => value.toFixed(1),
  },
  {
    id: "jungle-kp",
    role: "jungle",
    title: "Jungle Kill Participation",
    subtitle: "Percentage of team kills",
    field: "killParticipation",
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
  },
  {
    id: "jungle-early-kp",
    role: "jungle",
    title: "Jungle Early Game KP",
    subtitle: "Kill participation pre-15min",
    field: "earlyGameKP",
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
  },
  {
    id: "jungle-gold",
    role: "jungle",
    title: "Jungle Gold/Min",
    subtitle: "Gold earned per minute",
    field: "goldPerMinute",
    format: (value: number) => value.toFixed(0),
  },
  {
    id: "jungle-dpm",
    role: "jungle",
    title: "Jungle DPM",
    subtitle: "Damage per minute",
    field: "damagePerMinute",
    format: (value: number) => value.toFixed(0),
  },
  // Mid Lane (6 stats)
  {
    id: "mid-dpm",
    role: "mid",
    title: "Mid Lane DPM",
    subtitle: "Damage per minute",
    field: "damagePerMinute",
    format: (value: number) => value.toFixed(0),
  },
  {
    id: "mid-kda",
    role: "mid",
    title: "Mid Lane KDA",
    subtitle: "Kill/Death/Assist ratio",
    field: "kda",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "mid-kp",
    role: "mid",
    title: "Mid Lane Kill Participation",
    subtitle: "Percentage of team kills",
    field: "killParticipation",
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
  },
  {
    id: "mid-gold",
    role: "mid",
    title: "Mid Lane Gold/Min",
    subtitle: "Gold earned per minute",
    field: "goldPerMinute",
    format: (value: number) => value.toFixed(0),
  },
  {
    id: "mid-cs",
    role: "mid",
    title: "Mid Lane CS/Min",
    subtitle: "Creep score per minute",
    field: "csPerMinute",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "mid-solo-kills",
    role: "mid",
    title: "Mid Lane Solo Kills",
    subtitle: "Average solo kills per game",
    field: "soloKills",
    format: (value: number) => value.toFixed(2),
  },
  // ADC (6 stats)
  {
    id: "adc-cs",
    role: "adc",
    title: "ADC CS/Min",
    subtitle: "Creep score per minute",
    field: "csPerMinute",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "adc-dpm",
    role: "adc",
    title: "ADC DPM",
    subtitle: "Damage per minute",
    field: "damagePerMinute",
    format: (value: number) => value.toFixed(0),
  },
  {
    id: "adc-gold",
    role: "adc",
    title: "ADC Gold/Min",
    subtitle: "Gold earned per minute",
    field: "goldPerMinute",
    format: (value: number) => value.toFixed(0),
  },
  {
    id: "adc-kda",
    role: "adc",
    title: "ADC KDA",
    subtitle: "Kill/Death/Assist ratio",
    field: "kda",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "adc-damage-share",
    role: "adc",
    title: "ADC Damage Share",
    subtitle: "Percentage of team damage",
    field: "damageShare",
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
  },
  {
    id: "adc-cs-10",
    role: "adc",
    title: "ADC CS @ 10min",
    subtitle: "Average CS at 10 minutes",
    field: "csAt10",
    format: (value: number) => value.toFixed(1),
  },
  // Support (6 stats)
  {
    id: "support-vision",
    role: "support",
    title: "Support Vision Score",
    subtitle: "Average vision score per game",
    field: "visionScore",
    format: (value: number) => value.toFixed(1),
  },
  {
    id: "support-kp",
    role: "support",
    title: "Support Kill Participation",
    subtitle: "Percentage of team kills",
    field: "killParticipation",
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
  },
  {
    id: "support-assists",
    role: "support",
    title: "Support Assists",
    subtitle: "Average assists per game",
    field: "assists",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "support-vision-per-min",
    role: "support",
    title: "Support Vision/Min",
    subtitle: "Vision score per minute",
    field: "visionScorePerMinute",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "support-wards",
    role: "support",
    title: "Support Wards Placed",
    subtitle: "Average wards placed per game",
    field: "wardsPlaced",
    format: (value: number) => value.toFixed(1),
  },
  {
    id: "support-early-kp",
    role: "support",
    title: "Support Early Game KP",
    subtitle: "Kill participation pre-15min",
    field: "earlyGameKP",
    format: (value: number) => `${(value * 100).toFixed(1)}%`,
  },
];

export function extractPlayerStatSets(
  data: PlayersAverageRoleStats | null
): PlayerStatSet[] {
  if (!data) return [];
  const sets: PlayerStatSet[] = [];

  PLAYER_STAT_CONFIG.forEach((config) => {
    const roleData = data[config.role];
    if (!roleData) return;

    const rows = Object.values(roleData)
      .map((player) => {
        const games = player.playerInfo.numberOfGames ?? 0;
        if (games < 5) return null; // Filter for 5+ games
        const raw = player.averageStats[config.field];
        if (typeof raw !== "number") return null;
        return {
          name: player.playerInfo.gameName,
          tagLine: player.playerInfo.tagLine,
          summonerId: player.playerInfo.summonerId ?? "",
          value: raw,
          valueLabel: config.format(raw),
          detail: `${games} games`,
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    if (rows.length > 0) {
      sets.push({
        id: config.id,
        role: config.role,
        title: config.title,
        subtitle: config.subtitle,
        rows,
      });
    }
  });

  return sets;
}

export function extractVictoryHighlight(
  data: VictoryStatistics | null
): VictoryHighlight {
  if (!data) {
    return {
      cards: [],
      dragonData: null,
    };
  }

  const cards: SummaryCardItem[] = [
    {
      title: "First Blood",
      description: `${data.firstBlood.wins}/${data.firstBlood.total} wins`,
      entry: {
        total: data.firstBlood.total,
        wins: data.firstBlood.wins,
        winRate: data.firstBlood.winRate ?? 0,
      },
      icon: "sword",
    },
    {
      title: "First Tower",
      description: `${data.firstTower.wins}/${data.firstTower.total} wins`,
      entry: {
        total: data.firstTower.total,
        wins: data.firstTower.wins,
        winRate: data.firstTower.winRate ?? 0,
      },
      icon: "towerControl",
    },
    {
      title: "First Dragon",
      description: `${data.firstDragon.wins}/${data.firstDragon.total} wins`,
      entry: {
        total: data.firstDragon.total,
        wins: data.firstDragon.wins,
        winRate: data.firstDragon.winRate ?? 0,
      },
      icon: "origami",
    },
    {
      title: "Atakhan",
      description: `${data.atakhan.wins}/${data.atakhan.total} wins`,
      entry: {
        total: data.atakhan.total,
        wins: data.atakhan.wins,
        winRate: data.atakhan.winRate ?? 0,
      },
      icon: "skull",
    },
  ];

  return { cards, dragonData: data.dragons };
}

export function extractMapSummary(
  data: SummarizedOverallData | null
): MapSummary | null {
  if (!data) return null;

  const toPair = (blueValue?: number, redValue?: number) => ({
    blue: blueValue ?? 0,
    red: redValue ?? 0,
  });

  return {
    wins: toPair(data.blueSide?.wins, data.redSide?.wins),
    kills: toPair(data.blueSide?.kills, data.redSide?.kills),
    objectives: {
      firstBlood: toPair(data.blueSide?.firstBlood, data.redSide?.firstBlood),
      towerKills: toPair(data.blueSide?.towerKills, data.redSide?.towerKills),
      baronKills: toPair(data.blueSide?.baronKills, data.redSide?.baronKills),
      dragonKills: toPair(
        data.blueSide?.dragonKills,
        data.redSide?.dragonKills
      ),
      voidGrubs: toPair(data.blueSide?.voidGrubs, data.redSide?.voidGrubs),
      riftHeraldKills: toPair(
        data.blueSide?.riftHeraldKills,
        data.redSide?.riftHeraldKills
      ),
      atakhan: toPair(data.blueSide?.atakhans, data.redSide?.atakhans),
    },
  };
}

export function extractRankTopMovers(
  data: PlayerRankChangeStats | null,
  playerList: PlayerList | null
): RankHighlight[] {
  if (!data) return [];
  return Object.entries(data.number_of_changes ?? {})
    .map(([nameId, changes]) => ({
      name: playerList?.[nameId]?.name ?? nameId,
      changes,
      id: nameId,
    }))
    .sort((a, b) => b.changes - a.changes)
    .slice(0, 3);
}

export function extractRankNetWins(
  data: PlayerRankChangeStats | null,
  playerList: PlayerList | null
): RankNetWinEntry[] {
  if (!data) return [];
  const entries: RankNetWinEntry[] = [];

  LANES.forEach((lane) => {
    const roleData = data.win_loses_since_last_change?.[lane];
    if (!roleData) return;
    Object.entries(roleData).forEach(([nameId, record]) => {
      const diff = (record.wins ?? 0) - (record.loses ?? 0);
      if (diff >= 3) {
        entries.push({
          name: playerList?.[nameId]?.name ?? nameId,
          role: lane,
          wins: record.wins,
          losses: record.loses,
          diff,
          id: nameId,
        });
      }
    });
  });

  return entries.sort((a, b) => b.diff - a.diff).slice(0, 8);
}

export function extractMvpRows(data: MvpPlayers | null): MvpRow[] {
  if (!data) return [];
  return Object.values(data)
    .map((entry: PlayerMvpPerformanceInGames) => ({
      name: entry.gameName,
      wins: entry.wins,
      games: entry.numberOfGames,
      score: entry.meanScore,
      summonerId: entry.summonerId,
    }))
    .sort((a, b) => {
      if (b.wins === a.wins) {
        return b.score - a.score;
      }
      return b.wins - a.wins;
    })
    .slice(0, 5);
}
