"use client";

interface WinRateCircularProgressProps {
  value: number; // 0-1 range
  size?: number;
  labelFontSize?: number;
  wins?: number;
  losses?: number;
  showWinsLossesInside?: boolean; // If false, wins/losses won't be shown inside the circle
  showLabel?: boolean; // If false, "Win rate" label won't be shown
}

export function WinRateCircularProgress({
  value,
  size = 176,
  labelFontSize = 25,
  wins,
  losses,
  showWinsLossesInside = true,
  showLabel = true,
}: WinRateCircularProgressProps) {
  const percentage = Math.min(Math.max(value * 100, 0), 100);
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ position: "absolute" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(42, 60%, 42%)"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.4}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(42, 60%, 52%)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
        <span
          className="text-foreground font-bold text-center leading-none"
          style={{ fontSize: `${labelFontSize}px` }}
        >
          {percentage.toFixed(1)}%
        </span>
        {showLabel && (
          <span className="text-muted-foreground text-sm font-normal text-center mt-1">
            Win rate
          </span>
        )}
        {showWinsLossesInside &&
          (wins !== undefined || losses !== undefined) && (
            <span className="text-muted-foreground text-sm font-normal text-center mt-0.5">
              {wins ?? 0}W {losses ?? 0}L
            </span>
          )}
      </div>
    </div>
  );
}
