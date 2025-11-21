import { revalidatePath } from "next/cache";

/**
 * Revalidates all routes in the application
 * This should be called after data changes to ensure all pages reflect the latest data
 */
export async function revalidateAllRoutes() {
  try {
    // Revalidate static routes
    revalidatePath("/", "layout");
    // revalidatePath("/");
    // revalidatePath("/player-list");
    // revalidatePath("/history");
    // revalidatePath("/stats");
    // revalidatePath("/patch-notes");
    // revalidatePath("/matchmaking");
    // revalidatePath("/admin");

    // // Revalidate dynamic routes
    // // For dynamic routes, revalidate the layout to ensure all pages are updated
    // // Using 'layout' type revalidates all pages under that route segment
    // revalidatePath("/player/[slug]", "layout");
    // revalidatePath("/match/[matchId]", "layout");

    // // Also revalidate the parent paths to ensure route handlers are updated
    // revalidatePath("/player");
    // revalidatePath("/match");

    return { success: true };
  } catch (error) {
    console.error("Error revalidating routes:", error);
    throw error;
  }
}
