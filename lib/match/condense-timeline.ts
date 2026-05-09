import type {
  CondensedMatchTimeline,
  CondensedTimelineEventDot,
  CondensedTimelineEventIconKey,
  CondensedTimelineEventPoint,
  MatchTimelineTeamId,
  MatchTimelineData,
  MatchTimelineEvent,
} from "@/lib/types";

function toTimeLabel(timestamp: number): string {
  const totalSeconds = Math.max(0, Math.floor(timestamp / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function iconFromEvent(event: MatchTimelineEvent): CondensedTimelineEventIconKey {
  if (event.type === "CHAMPION_KILL") return "kill";

  if (event.type === "ELITE_MONSTER_KILL") {
    if (event.monsterType === "DRAGON") return "dragon";
    if (event.monsterType === "BARON_NASHOR") return "baron";
    if (event.monsterType === "RIFTHERALD") return "herald";
    if (event.monsterType === "ATAKHAN") return "atakhan";
    if (event.monsterType === "HORDE") return "horde";
    return "objective";
  }

  if (event.type === "BUILDING_KILL") {
    if (event.buildingType === "INHIBITOR_BUILDING") return "inhibitor";
    return "tower";
  }

  return "objective";
}

function labelFromEvent(event: MatchTimelineEvent): string {
  if (event.type === "CHAMPION_KILL") return "Champion kill";

  if (event.type === "ELITE_MONSTER_KILL") {
    if (event.monsterSubType) {
      return event.monsterSubType.replaceAll("_", " ");
    }
    if (event.monsterType) {
      return event.monsterType.replaceAll("_", " ");
    }
    return "Elite monster";
  }

  if (event.type === "BUILDING_KILL") {
    if (event.towerType) {
      return event.towerType.replaceAll("_", " ");
    }
    if (event.buildingType) {
      return event.buildingType.replaceAll("_", " ");
    }
    return "Structure";
  }

  return "Event";
}

function resolveEventTeamId(event: MatchTimelineEvent): MatchTimelineTeamId {
  if (event.participantId >= 1 && event.participantId <= 5) return 100;
  if (event.participantId >= 6 && event.participantId <= 10) return 200;
  if (event.killerId >= 1 && event.killerId <= 5) return 100;
  if (event.killerId >= 6 && event.killerId <= 10) return 200;
  if (event.teamId === 100 || event.teamId === 200) return event.teamId;
  return 0;
}

export function condenseTimeline(
  timeline: MatchTimelineData | null
): CondensedMatchTimeline | null {
  if (!timeline?.frames?.length) return null;

  const points = timeline.frames
    .map((frame) => {
      let blueGold = 0;
      let redGold = 0;

      for (const participantFrame of frame.participantFrames) {
        if (!participantFrame) continue;

        if (participantFrame.participantId >= 1 && participantFrame.participantId <= 5) {
          blueGold += participantFrame.totalGold;
        } else if (
          participantFrame.participantId >= 6 &&
          participantFrame.participantId <= 10
        ) {
          redGold += participantFrame.totalGold;
        }
      }

      return {
        timestamp: frame.timestamp,
        minute: frame.timestamp / 60000,
        timeLabel: toTimeLabel(frame.timestamp),
        blueGold,
        redGold,
        goldDiff: blueGold - redGold,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  const events: CondensedTimelineEventPoint[] = timeline.frames
    .flatMap((frame) => frame.events ?? [])
    .map((event) => ({
      timestamp: event.timestamp,
      minute: event.timestamp / 60000,
      timeLabel: toTimeLabel(event.timestamp),
      eventType: event.type,
      iconKey: iconFromEvent(event),
      teamId: resolveEventTeamId(event),
      label: labelFromEvent(event),
      killerId: event.killerId,
      victimId: event.victimId,
      position: event.position,
      monsterType: event.monsterType || undefined,
      monsterSubType: event.monsterSubType || undefined,
      buildingType: event.buildingType || undefined,
      laneType: event.laneType || undefined,
      towerType: event.towerType || undefined,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const dotsMap = new Map<string, CondensedTimelineEventDot>();
  for (const event of events) {
    if (event.teamId !== 100 && event.teamId !== 200) continue;

    const minuteStart = Math.floor(event.timestamp / 60000) * 60000;
    const key = `${minuteStart}-${event.teamId}`;
    const existing = dotsMap.get(key);

    if (!existing) {
      dotsMap.set(key, {
        minuteStart,
        timestamp: minuteStart,
        teamId: event.teamId,
        eventCount: 1,
        events: [
          {
            timestamp: event.timestamp,
            label: event.label,
            teamId: event.teamId,
            eventType: event.eventType,
            killerId: event.killerId,
            victimId: event.victimId,
            monsterType: event.monsterType,
            monsterSubType: event.monsterSubType,
            buildingType: event.buildingType,
            towerType: event.towerType,
          },
        ],
      });
      continue;
    }

    existing.eventCount += 1;
    existing.events.push({
      timestamp: event.timestamp,
      label: event.label,
      teamId: event.teamId,
      eventType: event.eventType,
      killerId: event.killerId,
      victimId: event.victimId,
      monsterType: event.monsterType,
      monsterSubType: event.monsterSubType,
      buildingType: event.buildingType,
      towerType: event.towerType,
    });
  }

  const eventDots = [...dotsMap.values()]
    .map((dot) => ({
      ...dot,
      events: [...dot.events].sort((a, b) => a.timestamp - b.timestamp),
    }))
    .sort((a, b) => a.minuteStart - b.minuteStart || a.teamId - b.teamId);

  const maxAbsDiff = points.reduce((max, point) => {
    const absDiff = Math.abs(point.goldDiff);
    return absDiff > max ? absDiff : max;
  }, 0);

  const gameDurationMs = points[points.length - 1]?.timestamp ?? 0;

  return {
    points,
    events,
    eventDots,
    maxAbsDiff,
    gameDurationMs,
  };
}
