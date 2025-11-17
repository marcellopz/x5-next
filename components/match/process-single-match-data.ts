interface Participant {
  participantId: number;
  teamId: number;
  championId: number;
  championName: string;
  spell1Id: number;
  spell2Id: number;
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    win: boolean;
    champLevel: number;
    goldEarned: number;
    totalMinionsKilled: number;
    neutralMinionsKilled: number;
    visionScore: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
  };
}

interface ParticipantIdentity {
  participantId: number;
  player: {
    summonerId: string | number;
    gameName: string;
    tagLine?: string;
  };
}

interface Team {
  teamId: number;
  baronKills: number;
  dragonKills: number;
  towerKills: number;
  bans: Array<{ championId: number }>;
}

interface MatchData {
  participants: Participant[];
  participantIdentities: ParticipantIdentity[];
  teams: Team[];
}

export interface ProcessedTeam {
  players: Array<Participant & { identity: ParticipantIdentity }>;
  stats: {
    kills: number;
    deaths: number;
    assists: number;
  };
  win: boolean;
  teamStats: Team;
  teamId: number;
}

const processTeam = (teamId: number, match: MatchData): ProcessedTeam => {
  const players = match.participants.filter((p) => p.teamId === teamId);
  players.forEach((player) => {
    const identity = match.participantIdentities.find(
      (id) => id.participantId === player.participantId
    );
    if (identity) {
      (player as Participant & { identity: ParticipantIdentity }).identity =
        identity;
    }
  });

  const teamStats = match.teams.find((t) => t.teamId === teamId);
  if (!teamStats) {
    throw new Error(`Team ${teamId} not found`);
  }

  return {
    players: players as Array<Participant & { identity: ParticipantIdentity }>,
    stats: {
      kills: players.reduce((a, b) => a + b.stats.kills, 0),
      deaths: players.reduce((a, b) => a + b.stats.deaths, 0),
      assists: players.reduce((a, b) => a + b.stats.assists, 0),
    },
    win: players[0]?.stats.win ?? false,
    teamStats,
    teamId,
  };
};

export function processMatchData(match: MatchData | null | undefined) {
  const blueTeam = match ? processTeam(100, match) : null;
  const redTeam = match ? processTeam(200, match) : null;

  return { blueTeam, redTeam };
}
