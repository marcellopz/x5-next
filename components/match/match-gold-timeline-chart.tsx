"use client";

import Image from "next/image";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTheme } from "@/components/home/activity-section/chart-theme";
import { useFormatNumber, useTranslations } from "@/lib/i18n/locale-context";
import {
  baronLoseUrl,
  baronWinUrl,
  CHAMPIONICONURL,
  dragonLoseUrl,
  dragonWinUrl,
  turretLoseUrl,
  turretWinUrl,
} from "@/lib/resources";
import type { CondensedMatchTimeline, CondensedTimelineEventDot } from "@/lib/types";

interface MatchGoldTimelineChartProps {
  timeline: CondensedMatchTimeline;
  participantChampionMap: Record<number, number>;
}

interface EventChartPoint {
  timestamp: number;
  minuteStart: number;
  teamId: 100 | 200;
  eventCount: number;
  events: Array<{
    timestamp: number;
    label: string;
    teamId: 100 | 200;
    eventType: "CHAMPION_KILL" | "ELITE_MONSTER_KILL" | "BUILDING_KILL";
    killerId: number;
    victimId: number;
    monsterType?: string;
    monsterSubType?: string;
    buildingType?: string;
    towerType?: string;
  }>;
  y: number;
}

interface GoldDiffTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: number | string;
  t: (key: string) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
}

const CHART_SYNC_ID = "match-gold-timeline-sync";
const SHARED_Y_AXIS_WIDTH = 30;

function formatTimeLabel(timestamp: number): string {
  const totalSeconds = Math.max(0, Math.floor(timestamp / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function eventColor(teamId: number): string {
  if (teamId === 100) return "#3B82F6";
  if (teamId === 200) return "#EF4444";
  return chartTheme.primary;
}

function EventDot({
  cx,
  cy,
  payload,
}: {
  cx?: number;
  cy?: number;
  payload?: EventChartPoint;
}) {
  if (typeof cx !== "number" || typeof cy !== "number" || !payload) return null;

  const fill = eventColor(payload.teamId);
  const radius = Math.min(12, 4 + payload.eventCount * 1.3);

  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill={fill} opacity={0.85} />
    </g>
  );
}

interface EventTooltipProps {
  payload?: Array<{ payload?: EventChartPoint }>;
  label?: number | string;
  minuteDots: Map<number, EventChartPoint[]>;
  t: (key: string) => string;
  participantChampionMap: Record<number, number>;
}

function getMinuteStart(timestamp: number): number {
  return Math.floor(timestamp / 60000) * 60000;
}

function EventTooltip({
  payload,
  label,
  minuteDots,
  t,
  participantChampionMap,
}: EventTooltipProps) {
  console.log("payload", payload?.map(p => p.payload));
  const payloadPoint = payload?.[0]?.payload;

  const labelTs = typeof label === "number" ? label : Number(label);
  const fallbackTs =
    payloadPoint?.minuteStart ??
    payloadPoint?.timestamp;
  const referenceTs = Number.isFinite(labelTs) ? labelTs : fallbackTs;

  if (referenceTs === undefined || !Number.isFinite(referenceTs)) return null;
  const minuteStart = getMinuteStart(referenceTs);
  const pointsForMinute = minuteDots.get(minuteStart) ?? [];

  const blueEvents = pointsForMinute
    .filter((minutePoint) => minutePoint.teamId === 100)
    .flatMap((minutePoint) => minutePoint.events)
    .sort((a, b) => a.timestamp - b.timestamp);

  const redEvents = pointsForMinute
    .filter((minutePoint) => minutePoint.teamId === 200)
    .flatMap((minutePoint) => minutePoint.events)
    .sort((a, b) => a.timestamp - b.timestamp);

  const objectiveIconByTeam = (teamId: 100 | 200, event: EventChartPoint["events"][number]) => {
    const isBlue = teamId === 100;
    if (event.eventType === "ELITE_MONSTER_KILL") {
      if (event.monsterType === "BARON_NASHOR") {
        return isBlue ? baronWinUrl : baronLoseUrl;
      }
      return isBlue ? dragonWinUrl : dragonLoseUrl;
    }
    if (event.eventType === "BUILDING_KILL") {
      return isBlue ? turretWinUrl : turretLoseUrl;
    }
    return isBlue ? dragonWinUrl : dragonLoseUrl;
  };

  const championIconByParticipant = (participantId: number) => {
    const championId = participantChampionMap[participantId];
    if (!championId) return null;
    return `${CHAMPIONICONURL}${championId}.png`;
  };

  const EventRow = ({
    event,
    rowKey,
  }: {
    event: EventChartPoint["events"][number];
    rowKey: string;
  }) => {
    const killerIcon = championIconByParticipant(event.killerId);
    const targetIcon =
      event.eventType === "CHAMPION_KILL"
        ? championIconByParticipant(event.victimId)
        : objectiveIconByTeam(event.teamId, event);

    return (
      <div
        key={rowKey}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "2px",
        }}
      >
        <span style={{ minWidth: "36px", opacity: 0.8 }}>
          {formatTimeLabel(event.timestamp)}
        </span>
        <span
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "9999px",
            border: "1px solid rgba(139, 115, 85, 0.7)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {killerIcon ? (
            <Image src={killerIcon} alt="Killer champion" width={22} height={22} />
          ) : (
            <span style={{ width: "22px", textAlign: "center" }}>?</span>
          )}
        </span>
        <span>⚔️</span>
        <span
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "9999px",
            border: "1px solid rgba(139, 115, 85, 0.7)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {targetIcon ? (
            <Image src={targetIcon} alt="Victim or objective" width={22} height={22} />
          ) : (
            <span style={{ width: "22px", textAlign: "center" }}>?</span>
          )}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: chartTheme.tooltip.background,
        border: `1px solid ${chartTheme.tooltip.border}`,
        borderRadius: "8px",
        padding: "8px 10px",
        maxWidth: "320px",
      }}
    >
      <p style={{ color: chartTheme.tooltip.text, fontWeight: 600 }}>
        {formatTimeLabel(minuteStart)}
      </p>
      <div style={{ color: chartTheme.tooltip.text, fontSize: "12px", lineHeight: 1.35 }}>
        <div style={{ marginBottom: "4px", color: "#3B82F6", fontWeight: 600 }}>
          {t("team.blueTeam")}
        </div>
        {blueEvents.length > 0 ? (
          blueEvents.map((event, index) => (
            <EventRow
              key={`blue-${event.timestamp}-${index}`}
              event={event}
              rowKey={`blue-${event.timestamp}-${index}`}
            />
          ))
        ) : (
          <div>-</div>
        )}
        <div style={{ margin: "6px 0 4px", color: "#EF4444", fontWeight: 600 }}>
          {t("team.redTeam")}
        </div>
        {redEvents.length > 0 ? (
          redEvents.map((event, index) => (
            <EventRow
              key={`red-${event.timestamp}-${index}`}
              event={event}
              rowKey={`red-${event.timestamp}-${index}`}
            />
          ))
        ) : (
          <div>-</div>
        )}
        {blueEvents.length === 0 && redEvents.length === 0 && (
          <div style={{ marginTop: "6px", color: chartTheme.tooltip.label }}>
            {t("common.noDataAvailable")}
          </div>
        )}
      </div>
    </div>
  );
}

function GoldDiffTooltip({
  active,
  payload,
  label,
  t,
  formatNumber,
}: GoldDiffTooltipProps) {
  if (!active || !payload?.length) return null;

  const diff = Number(payload[0]?.value ?? 0);
  const absGold = formatNumber(Math.round(Math.abs(diff)));

  let statusText = t("match.evenGold");
  if (diff > 0) {
    statusText = t("match.blueTeamUpGold").replace("{{value}}", absGold);
  } else if (diff < 0) {
    statusText = t("match.redTeamUpGold").replace("{{value}}", absGold);
  }

  return (
    <div
      style={{
        backgroundColor: chartTheme.tooltip.background,
        border: `1px solid ${chartTheme.tooltip.border}`,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <p style={{ color: chartTheme.tooltip.text, fontWeight: 600 }}>
        {formatTimeLabel(Number(label ?? 0))}
      </p>
      <p style={{ color: chartTheme.tooltip.label }}>{statusText}</p>
    </div>
  );
}

export function MatchGoldTimelineChart({
  timeline,
  participantChampionMap,
}: MatchGoldTimelineChartProps) {
  const t = useTranslations();
  const formatNumber = useFormatNumber();
  const diffValues = timeline.points.map((point) => point.goldDiff);
  const minDiff = Math.min(...diffValues);
  const maxDiff = Math.max(...diffValues);

  const yExtentRaw = Math.max(3000, timeline.maxAbsDiff || 0);
  const yExtent = Math.ceil(yExtentRaw / 1000) * 1000;
  const yTicks: number[] = [];
  for (let value = -yExtent; value <= yExtent; value += 1000) {
    yTicks.push(value);
  }

  let zeroOffsetPct = 50;
  if (maxDiff > 0 && minDiff < 0) {
    zeroOffsetPct = (maxDiff / (maxDiff - minDiff)) * 100;
  } else if (maxDiff <= 0) {
    zeroOffsetPct = 0;
  } else if (minDiff >= 0) {
    zeroOffsetPct = 100;
  }

  const zeroOffsetLow = Math.max(0, zeroOffsetPct - 0.5);
  const zeroOffsetHigh = Math.min(100, zeroOffsetPct + 0.5);
  const xDomainEnd = Math.max(
    timeline.gameDurationMs,
    timeline.points[timeline.points.length - 1]?.timestamp ?? 0
  );

  const eventData: EventChartPoint[] = (timeline.eventDots ?? []).map(
    (dot: CondensedTimelineEventDot) => ({
      ...dot,
      y: dot.teamId === 100 ? 0.7 : 0.3,
    })
  );

  const minuteDots = new Map<number, EventChartPoint[]>();
  for (const point of eventData) {
    const bucket = minuteDots.get(point.minuteStart);
    if (bucket) {
      bucket.push(point);
    } else {
      minuteDots.set(point.minuteStart, [point]);
    }
  }

  return (
    <div className="h-full border border-border rounded-lg p-4 bg-background/20 flex flex-col min-h-[520px] lg:min-h-0">
      <p className="text-sm font-semibold text-foreground mb-3">
        {t("match.goldDifferenceTimeline")}
      </p>
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="basis-[72%] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={timeline.points}
            syncId={CHART_SYNC_ID}
            syncMethod="value"
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="goldDiffStroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset={`${zeroOffsetLow}%`} stopColor="#3B82F6" />
                <stop offset={`${zeroOffsetHigh}%`} stopColor="#EF4444" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
              <linearGradient id="goldDiffArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                <stop
                  offset={`${zeroOffsetLow}%`}
                  stopColor="#3B82F6"
                  stopOpacity={0.16}
                />
                <stop
                  offset={`${zeroOffsetHigh}%`}
                  stopColor="#EF4444"
                  stopOpacity={0.16}
                />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartTheme.grid}
              opacity={chartTheme.gridOpacity}
            />
            <XAxis
              type="number"
              dataKey="timestamp"
              domain={[0, xDomainEnd]}
              hide
            />
            <YAxis
              domain={[-yExtent, yExtent]}
              ticks={yTicks}
              tick={{ fill: chartTheme.text, fontSize: 11 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              width={SHARED_Y_AXIS_WIDTH}
              tickFormatter={(value) =>
                Number(value) === 0 ? "0" : `${Math.round(Number(value) / 1000)}k`
              }
            />
            <Tooltip content={<GoldDiffTooltip t={t} formatNumber={formatNumber} />} />
            <ReferenceLine y={0} stroke={chartTheme.axis} strokeDasharray="2 2" />
            <Area
              type="monotoneX"
              dataKey="goldDiff"
              stroke="url(#goldDiffStroke)"
              strokeWidth={2}
              fill="url(#goldDiffArea)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>

        <div className="basis-[28%] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            syncId={CHART_SYNC_ID}
            syncMethod="value"
            margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="eventsRedHalf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="eventsBlueHalf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartTheme.grid}
              opacity={0.12}
            />
            <XAxis
              type="number"
              dataKey="timestamp"
              domain={[0, xDomainEnd]}
              tick={{ fill: chartTheme.text, fontSize: 11 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              tickFormatter={(value) => formatTimeLabel(Number(value))}
              minTickGap={28}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 1]}
              width={SHARED_Y_AXIS_WIDTH}
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceArea
              x1={0}
              x2={xDomainEnd}
              y1={0.5}
              y2={1}
              fill="url(#eventsBlueHalf)"
              ifOverflow="extendDomain"
              strokeOpacity={0}
            />
            <ReferenceArea
              x1={0}
              x2={xDomainEnd}
              y1={0}
              y2={0.5}
              fill="url(#eventsRedHalf)"
              ifOverflow="extendDomain"
              strokeOpacity={0}
            />
            <Tooltip
              content={
                <EventTooltip
                  minuteDots={minuteDots}
                  t={t}
                  participantChampionMap={participantChampionMap}
                />
              }
            />
            <Scatter data={eventData} shape={<EventDot />} />
          </ScatterChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
