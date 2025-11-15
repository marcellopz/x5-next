import { revalidatePath } from "next/cache";

/**
 * Revalidates all routes in the application
 * This should be called after data changes to ensure all pages reflect the latest data
 */
export async function revalidateAllRoutes() {
  try {
    // Revalidate static routes
    revalidatePath("/");
    revalidatePath("/player-list");
    revalidatePath("/history");
    revalidatePath("/stats");
    revalidatePath("/patch-notes");
    revalidatePath("/matchmaking");

    // Revalidate dynamic routes
    // Using 'page' type to revalidate all pages under these paths
    revalidatePath("/player/[slug]", "page");
    revalidatePath("/match/[matchId]", "page");

    return { success: true };
  } catch (error) {
    console.error("Error revalidating routes:", error);
    throw error;
  }
}
