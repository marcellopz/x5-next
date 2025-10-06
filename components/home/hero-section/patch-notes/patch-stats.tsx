interface PatchStatsProps {
  patches: number;
  buffs: number;
  nerfs: number;
  newPlayers: number;
}

export function PatchStats({
  patches,
  buffs,
  nerfs,
  newPlayers,
}: PatchStatsProps) {
  const quickStats = [
    {
      label: "Patches",
      delta: patches.toString(),
      trend: "up" as const,
    },
    { label: "Buffs", delta: buffs.toString(), trend: "up" as const },
    { label: "Nerfs", delta: nerfs.toString(), trend: "down" as const },
    {
      label: "Players",
      delta: newPlayers.toString(),
      trend: "up" as const,
    },
  ];

  return (
    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {quickStats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-background/40 px-2.5 py-2 text-xs"
        >
          <div className="text-muted-foreground">{stat.label}</div>
          <div
            className={`${
              stat.trend === "down" ? "text-red-400" : "text-emerald-400"
            } font-medium`}
          >
            {stat.trend === "down" ? "▼" : "▲"} {stat.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
