export function PlayerCardSkeleton() {
  return (
    <div
      className="absolute inset-0 w-[250px] h-[340px] rounded-lg bg-muted animate-pulse border-7"
      style={{ borderColor: "rgba(202, 180, 125, 0.3)" }}
    >
      {/* Photo area skeleton */}
      <div
        className="absolute top-[60px] left-[15px] w-[205px] h-[105px] rounded"
        style={{ backgroundColor: "rgba(202, 180, 125, 0.3)" }}
      />

      {/* Name skeleton - row spanning left to right */}
      <div
        className="absolute top-[24px] left-4 right-4 h-5 rounded"
        style={{ backgroundColor: "rgba(202, 180, 125, 0.3)" }}
      />

      {/* Rank numbers skeleton - rows spanning left to right */}
      <div
        className="absolute top-[178px] left-4 right-4 h-5 rounded"
        style={{ backgroundColor: "rgba(202, 180, 125, 0.3)" }}
      />
      <div
        className="absolute top-[207px] left-4 right-4 h-5 rounded"
        style={{ backgroundColor: "rgba(202, 180, 125, 0.3)" }}
      />
      <div
        className="absolute top-[236px] left-4 right-4 h-5 rounded"
        style={{ backgroundColor: "rgba(202, 180, 125, 0.3)" }}
      />
      <div
        className="absolute top-[263px] left-4 right-4 h-5 rounded"
        style={{ backgroundColor: "rgba(202, 180, 125, 0.3)" }}
      />
      <div
        className="absolute top-[290px] left-4 right-4 h-5 rounded"
        style={{ backgroundColor: "rgba(202, 180, 125, 0.3)" }}
      />
    </div>
  );
}
