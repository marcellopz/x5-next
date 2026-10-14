export type SeasonKey = "s2" | "s3" | "s4";

export function getSeasonKey(): SeasonKey {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
  if (projectId.includes("season-2") || projectId.includes("s2")) return "s2";
  if (projectId.includes("season-3") || projectId.includes("s3")) return "s3";
  return "s4";
}
