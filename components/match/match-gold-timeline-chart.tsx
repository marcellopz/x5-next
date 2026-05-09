"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
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
import type {
  CondensedMatchTimeline,
  CondensedTimelineEventIconKey,
  CondensedTimelineEventPoint,
} from "@/lib/types";

interface MatchGoldTimelineChartProps {
  timeline: CondensedMatchTimeline;
}

interface EventChartPoint extends CondensedTimelineEventPoint {
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

const EVENT_ICON_LETTER: Record<CondensedTimelineEventIconKey, string> = {
  kill: "K",
  dragon: "D",
  baron: "B",
  herald: "H",
  atakhan: "A",
  horde: "G",
  tower: "T",
  inhibitor: "I",
  objective: "O",
};

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

  const letter = EVENT_ICON_LETTER[payload.iconKey] ?? "O";
  const fill = eventColor(payload.teamId);

  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill={fill} opacity={0.9} />
      <text
        x={cx}
        y={cy + 3}
        textAnchor="middle"
        fill="#ffffff"
        fontSize={9}
        fontWeight={700}
      >
        {letter}
      </text>
    </g>
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

export function MatchGoldTimelineChart({ timeline }: MatchGoldTimelineChartProps) {
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

  const eventData: EventChartPoint[] = timeline.events.map((event, index) => ({
    ...event,
    y: index % 2 === 0 ? 0.3 : 0.7,
  }));

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
            margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
          >
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
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltip.background,
                border: `1px solid ${chartTheme.tooltip.border}`,
                borderRadius: "8px",
              }}
              labelStyle={{ color: chartTheme.tooltip.text, fontWeight: 600 }}
              itemStyle={{ color: chartTheme.tooltip.label }}
              formatter={(_value, _name, item) => {
                const payload = item.payload as EventChartPoint;
                return [payload.label, payload.eventType];
              }}
              labelFormatter={(label) => formatTimeLabel(Number(label ?? 0))}
            />
            <Scatter data={eventData} shape={<EventDot />} />
          </ScatterChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
