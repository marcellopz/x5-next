import type { Metadata } from "next";

// Helper function to get season prefix from project ID
export function getSeasonPrefix(): string {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
  if (projectId.includes("season-3") || projectId.includes("s3")) {
    return "x5s3";
  } else if (projectId.includes("season-2") || projectId.includes("s2")) {
    return "x5s2";
  }
  // Default fallback
  return "x5";
}

// Helper function to get season name
export function getSeasonName(): string {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
  if (projectId.includes("season-3") || projectId.includes("s3")) {
    return "Season 3";
  } else if (projectId.includes("season-2") || projectId.includes("s2")) {
    return "Season 2";
  }
  return "Season";
}

// Helper function to generate page metadata
export function generatePageMetadata(
  pageTitle: string,
  description?: string
): Metadata {
  const prefix = getSeasonPrefix();
  const seasonName = getSeasonName();
  const defaultDescription = `x5 ${seasonName} - Custom League of Legends analytics dashboard`;

  return {
    title: `${prefix} - ${pageTitle}`,
    description: description
      ? `x5 ${seasonName} - ${description}`
      : defaultDescription,
  };
}
