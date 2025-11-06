"use client";

interface WinRateCircularProgressProps {
  value: number; // 0-1 range
  size?: number;
  labelFontSize?: number;
}

export function WinRateCircularProgress({
  value,
  size = 176,
  labelFontSize = 25,
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
          className="text-white font-bold text-center leading-none mb-1"
          style={{ fontSize: `${labelFontSize}px` }}
        >
          {percentage.toFixed(1)}%
        </span>
        <span className="text-white/80 text-sm font-normal text-center">
          Win rate
        </span>
      </div>
    </div>
  );
}
