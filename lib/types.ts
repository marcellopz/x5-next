// TypeScript Types for Firebase Data

export interface Player {
  account_id: number | string; // Always a string, empty string "" if not provided
  name: string;
  name_id: string;
  adc: number;
  jungle: number;
  mid: number;
  support: number;
  top: number;
  hide?: boolean; // Some players have this field
  isWildcard?: boolean; // Indicates if this is a wildcard player
}

export interface PlayerList {
  [nameId: string]: Player;
}

export interface RankChangeEntry {
  name_id: string;
  newRank: number;
  oldRank: number;
  player: string;
  role: "adc" | "jungle" | "mid" | "support" | "top";
  timestamp: number;
  type: "rank_change";
  batch_description?: string; // Optional description for batch edits
}

export interface PlayerRankChanges {
  [role: string]: {
    [entryId: string]: RankChangeEntry;
  };
}

export interface RankChangeLog {
  [nameId: string]: PlayerRankChanges;
}

export interface FirebaseData {
  playerList: PlayerList;
  rankChangeLog: RankChangeLog;
}

// Role type for better type safety
export type Role = "adc" | "jungle" | "mid" | "support" | "top";

// Summarized Overall Data Types
export interface TeamSideStats {
  baronKills: number;
  dragonKills: number;
  firstBaron: number;
  firstBlood: number;
  firstDragon: number;
  firstInhibitor: number;
  firstTower: number;
  riftHeraldKills: number;
  towerKills: number;
  wins: number;
}

export interface ChampionStats {
  assists: number;
  bans: number;
  championId: string;
  championName: string;
  creepsKilled: number;
  deaths: number;
  kills: number;
  picks: number;
  wins: number;
  numberOfMatches?: number;
  winRate?: number;
  kda?: number;
  AveragePerMatch?: {
    assists: number;
    creepScore: number;
    damageSelfMitigates: number;
    damageTaken: number;
    damageToChampions: number;
    damageToTurrets: number;
    deaths: number;
    goldEarned: number;
    kills: number;
    visionScore: number;
    visionWardsBought: number;
    [key: string]: unknown;
  };
  [key: string]: unknown; // Allow other properties
}

export interface GameDurationHistogram {
  [durationRange: string]: number; // e.g., "12-15": 2, "15-18": 2
}

export interface GamesPerMonth {
  [monthKey: string]: number; // e.g., "2025-04": 0, "2025-05": 6
}

export interface LeaderboardEntry {
  extra?: string;
  legend_id: string;
  legend_name: string;
  summonerId: string;
  value: number;
}

export interface Leaderboard {
  killParticipation: LeaderboardEntry[];
  numberOfChampionsPlayed: LeaderboardEntry[];
  numberOfGames: LeaderboardEntry[];
  winRate: LeaderboardEntry[];
  winRateLast20Games: LeaderboardEntry[];
}

export interface RoleLeaderboardStats {
  wins: LeaderboardEntry;
  assists: LeaderboardEntry;
  csAt10: LeaderboardEntry;
  csAt15: LeaderboardEntry;
  csAt20: LeaderboardEntry;
  csDiffAt10: LeaderboardEntry;
  csDiffAt15: LeaderboardEntry;
  csDiffAt20: LeaderboardEntry;
  csPerMinute: LeaderboardEntry;
  damageDealtToObjectives: LeaderboardEntry;
  damageDealtToTurrets: LeaderboardEntry;
  damagePerDeath: LeaderboardEntry;
  damagePerGold: LeaderboardEntry;
  damagePerMinute: LeaderboardEntry;
  damageSelfMitigated: LeaderboardEntry;
  damageShare: LeaderboardEntry;
  deaths: LeaderboardEntry;
  doubleKills: LeaderboardEntry;
  earlyGameKP: LeaderboardEntry;
  firstBlood: LeaderboardEntry;
  firstBloodAssist: LeaderboardEntry;
  firstBloodKill: LeaderboardEntry;
  firstTowerAssist: LeaderboardEntry;
  firstTowerKill: LeaderboardEntry;
  goldAt10: LeaderboardEntry;
  goldAt15: LeaderboardEntry;
  goldAt20: LeaderboardEntry;
  goldDiffAt10: LeaderboardEntry;
  goldDiffAt15: LeaderboardEntry;
  goldDiffAt20: LeaderboardEntry;
  goldEarned: LeaderboardEntry;
  goldPerMinute: LeaderboardEntry;
  inhibitorKills: LeaderboardEntry;
  kda: LeaderboardEntry;
  killParticipation: LeaderboardEntry;
  kills: LeaderboardEntry;
  killsAndAssistsPre15: LeaderboardEntry;
  levelAt10: LeaderboardEntry;
  levelAt15: LeaderboardEntry;
  levelAt20: LeaderboardEntry;
  magicDamageDealtToChampions: LeaderboardEntry;
  neutralMinionsKilled: LeaderboardEntry;
  objectiveControlRate: LeaderboardEntry;
  pentaKills: LeaderboardEntry;
  physicalDamageDealtToChampions: LeaderboardEntry;
  quadraKills: LeaderboardEntry;
  roamsSuccessful: LeaderboardEntry;
  soloKills: LeaderboardEntry;
  teamDamage: LeaderboardEntry;
  teamKills: LeaderboardEntry;
  teamKillsPre15: LeaderboardEntry;
  timeCCingOthers: LeaderboardEntry;
  totalCS: LeaderboardEntry;
  totalDamageDealtToChampions: LeaderboardEntry;
  totalDamageTaken: LeaderboardEntry;
  totalHeal: LeaderboardEntry;
  totalMinionsKilled: LeaderboardEntry;
  totalTimeCrowdControlDealt: LeaderboardEntry;
  tripleKills: LeaderboardEntry;
  trueDamageDealtToChampions: LeaderboardEntry;
  turretKills: LeaderboardEntry;
  visionScore: LeaderboardEntry;
  visionScorePerMinute: LeaderboardEntry;
  visionWardsBoughtInGame: LeaderboardEntry;
  wardsKilled: LeaderboardEntry;
  wardsPlaced: LeaderboardEntry;
  xpAt10: LeaderboardEntry;
  xpAt15: LeaderboardEntry;
  xpAt20: LeaderboardEntry;
  xpDiffAt10: LeaderboardEntry;
  xpDiffAt15: LeaderboardEntry;
  xpDiffAt20: LeaderboardEntry;
  score: number;
}

export interface RoleLeaderboardData {
  adc: RoleLeaderboardStats;
  jungle: RoleLeaderboardStats;
  mid: RoleLeaderboardStats;
  support: RoleLeaderboardStats;
  top: RoleLeaderboardStats;
}

export interface RolePlayerInfo {
  summonerId: string;
  gameName: string;
  tagLine: string;
  numberOfGames: number;
}

export interface ParticipantCalculatedAverageStats {
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  totalCS: number;
  csPerMinute: number;
  goldEarned: number;
  goldPerMinute: number;
  totalDamageDealtToChampions: number;
  damagePerMinute: number;
  physicalDamageDealtToChampions: number;
  magicDamageDealtToChampions: number;
  trueDamageDealtToChampions: number;
  visionScore: number;
  visionScorePerMinute: number;
  wardsPlaced: number;
  wardsKilled: number;
  visionWardsBoughtInGame: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  totalDamageTaken: number;
  damageSelfMitigated: number;
  totalHeal: number;
  timeCCingOthers: number;
  totalTimeCrowdControlDealt: number;
  teamKills: number;
  teamDamage: number;
  killParticipation: number;
  damageShare: number;
  goldAt10: number;
  xpAt10: number;
  csAt10: number;
  levelAt10: number;
  goldDiffAt10: number;
  xpDiffAt10: number;
  csDiffAt10: number;
  goldAt15: number;
  xpAt15: number;
  csAt15: number;
  levelAt15: number;
  goldDiffAt15: number;
  xpDiffAt15: number;
  csDiffAt15: number;
  goldAt20: number;
  xpAt20: number;
  csAt20: number;
  levelAt20: number;
  goldDiffAt20: number;
  xpDiffAt20: number;
  csDiffAt20: number;
  soloKills: number;
  firstBlood: number;
  firstBloodKill: number;
  firstBloodAssist: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
  turretKills: number;
  inhibitorKills: number;
  firstTowerKill: number;
  firstTowerAssist: number;
  killsAndAssistsPre15: number;
  teamKillsPre15: number;
  earlyGameKP: number;
  damagePerDeath: number;
  damagePerGold: number;
  objectiveControlRate?: number;
  roamsSuccessful?: number;
  score: number;
}

export interface PlayerAverageRoleStats {
  playerInfo: RolePlayerInfo;
  averageStats: ParticipantCalculatedAverageStats;
}

export type PlayersAverageRoleStats = Record<
  Role,
  Record<string, PlayerAverageRoleStats>
>;

export type RoleStatKey = keyof ParticipantCalculatedAverageStats;

export interface ChampionLeaderboardEntry {
  championId: string;
  championName: string;
  numberOfGames: number;
  value: number;
  winRate: number;
}

export interface ChampionLeaderboard {
  mostBanned: ChampionLeaderboardEntry;
  mostLosses: ChampionLeaderboardEntry;
  mostPlayed: ChampionLeaderboardEntry;
  mostWins: ChampionLeaderboardEntry;
}

export interface SummarizedOverallData {
  blueSide: TeamSideStats;
  redSide: TeamSideStats;
  champions: {
    [championId: string]: ChampionStats;
  };
  gameDurationHistogram: GameDurationHistogram;
  gameDurationTotal: number;
  gamesPerMonth: GamesPerMonth;
  hourlyDistribution: number[]; // Array of 24 numbers (0-23 hours)
  numberOfGames: number;
  weekDayDistribution: number[]; // Array of 7 numbers (Sunday-Saturday)
  mostRecentGameTimestamp: number;
  topRecentPlayer: number;
  leaderboard: Leaderboard;
  championLeaderboard: ChampionLeaderboard;
}

// Initial Ranks Data Types
export interface InitialRankPlayer {
  account_id?: number; // Some players have account_id
  accountId?: number; // Some players have accountId instead
  adc: number;
  jungle: number;
  mid: number;
  name: string;
  name_id: string;
  support: number;
  top: number;
  timestamp?: number; // Some players have timestamp
}

export interface InitialRanksData {
  [nameId: string]: InitialRankPlayer;
}

// Player Summary Data Types
export interface PlayerSummaryData {
  numberOfMatches: number;
  summonerName: string;
  tagLine: string;
  winRate: number;
}

export interface PlayerSummary {
  [accountId: string]: PlayerSummaryData;
}

// All Reduced Data Types (Match History)
export interface ReducedParticipantStats {
  assists: number;
  champLevel: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  deaths: number;
  firstBloodKill: boolean;
  goldEarned: number;
  goldSpent: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  kills: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  magicDamageDealtToChampions: number;
  magicalDamageTaken: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  totalCs: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  trueDamageDealtToChampions: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

export interface ReducedParticipant {
  championId: number;
  championName: string;
  participantId: number;
  spells: string[];
  spellsIds: number[];
  stats: ReducedParticipantStats;
  summonerId: number;
  summonerName: string;
  tagLine: string;
  teamId: number;
  role: string;
}

export interface Ban {
  championId: number;
  pickTurn: number;
}

export interface ReducedTeamData {
  bans: Ban[];
  baronKills: number;
  dominionVictoryScore: number;
  dragonKills: number;
  firstBaron: boolean;
  firstBlood: boolean;
  firstDargon: boolean;
  firstInhibitor: boolean;
  firstTower: boolean;
  hordeKills: number;
  inhibitorKills: number;
  riftHeraldKills: number;
  teamId: number;
  towerKills: number;
  vilemawKills: number;
  win: string;
  goldEarned?: number;
}

export interface ReducedMatchData {
  date: string;
  gameDuration: number;
  gameId: number;
  gameMode: string;
  gameVersion: string;
  participants: ReducedParticipant[];
  teams: ReducedTeamData[];
}

export interface AllReducedData {
  [matchId: string]: ReducedMatchData;
}

export interface MatchWithId extends ReducedMatchData {
  matchId: string;
}

// Player Info Types
export interface PlayerInfo {
  championStats: {
    [championId: string]: ChampionStats;
  };
  summonerId: string | number;
  summonerName?: string;
  tagLine?: string;
  numberOfMatches?: number;
  winRate?: number;
  playerMatchesIds?: string[];
  firstBloods?: number;
  winsArray?: number[];
  matches?: {
    [matchId: string]: unknown; // Match structure - can be defined later
  };
  roleMatches?: {
    [role: string]: {
      games: number;
      wins: number;
    };
  };
  statsPerSide?: {
    blueSide: {
      games: number;
      wins: number;
    };
    redSide: {
      games: number;
      wins: number;
    };
  };
  records?: PlayerRecords;
  [key: string]: unknown; // Allow other properties
}

// Player Records Types
export interface RecordEntry {
  gameId: string;
  n: number;
  win: boolean;
}

export interface PlayerRecords {
  assists?: RecordEntry;
  cs?: RecordEntry;
  csPerMin?: RecordEntry;
  damage?: RecordEntry;
  damageTaken?: RecordEntry;
  deaths?: RecordEntry;
  killingSpree?: RecordEntry;
  kills?: RecordEntry;
  longestGame?: RecordEntry;
  multiKill?: RecordEntry;
  shortestGame?: RecordEntry;
  visionScore?: RecordEntry;
  [key: string]: RecordEntry | undefined; // Allow other properties
}

// Player Pairs Types
export interface PlayerPairs {
  [playerId: string]: unknown;
}

// Match Data Types
export interface MatchParticipantPlayer {
  summonerId: string | number;
  gameName: string;
  tagLine?: string;
}

export interface MatchParticipantIdentity {
  participantId: number;
  player: MatchParticipantPlayer;
}

export interface MatchMetadata {
  gameCreationDate?: string; // 2025-11-13T02:35:27.503Z
  gameCreation?: number; // 1731483327503
  gameDuration?: number;
  gameId?: string;
}

export interface FullMatchData extends MatchMetadata {
  participantIdentities?: MatchParticipantIdentity[];
  [key: string]: unknown;
}

export interface RoleStats {
  top: {
    [summonerId: string]: RoleLeaderboardStats;
  };
  jungle: {
    [summonerId: string]: RoleLeaderboardStats;
  };
  mid: {
    [summonerId: string]: RoleLeaderboardStats;
  };
  support: {
    [summonerId: string]: RoleLeaderboardStats;
  };
  adc: {
    [summonerId: string]: RoleLeaderboardStats;
  };
}

type RoleWins = {
  wins: number;
  numberOfGames: number;
};

export type PlayerMvpPerformanceInGames = {
  wins: number;
  rolesWins: {
    top: RoleWins;
    jungle: RoleWins;
    mid: RoleWins;
    adc: RoleWins;
    support: RoleWins;
  };
  meanScore: number;
  numberOfGames: number;
  gameName: string;
  summonerId: string;
};

export type MvpPlayers = {
  [playerId: string]: PlayerMvpPerformanceInGames;
};
