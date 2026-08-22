import type { Metadata } from "next";

export const BRAND_NAME = "x5 de Graves";

export function generatePageMetadata(
  pageTitle: string,
  description?: string
): Metadata {
  const defaultDescription = `${BRAND_NAME} - Custom League of Legends analytics dashboard`;

  return {
    title: `${BRAND_NAME} - ${pageTitle}`,
    description: description
      ? `${BRAND_NAME} - ${description}`
      : defaultDescription,
  };
}
