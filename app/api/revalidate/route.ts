import { NextResponse } from "next/server";
import { isAdminAuthenticated, verifyAdminPassword } from "@/lib/admin-auth";
import { revalidateAllRoutes } from "@/lib/revalidate";

/**
 * API endpoint to trigger revalidation of all routes
 * Requires admin authentication via session cookie OR password in header
 *
 * Authentication methods:
 * 1. Session cookie (for web app): Set via admin login
 * 2. Password in header (for external apps): Send password in Authorization header
 *
 * Example external call:
 * curl -X POST https://your-domain.com/api/revalidate \
 *   -H "Authorization: your-admin-password-here"
 */
export async function POST(request: Request) {
  try {
    // Check session cookie first
    const sessionAuth = await isAdminAuthenticated();

    // If no session, check password in Authorization header
    if (!sessionAuth) {
      const authHeader = request.headers.get("authorization");
      if (!authHeader || !verifyAdminPassword(authHeader)) {
        return NextResponse.json(
          {
            error:
              "Unauthorized. Provide admin session cookie or password in Authorization header.",
          },
          { status: 401 }
        );
      }
    }

    // Revalidate all routes
    await revalidateAllRoutes();

    return NextResponse.json(
      { success: true, message: "All routes revalidated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating routes:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to revalidate routes",
      },
      { status: 500 }
    );
  }
}
