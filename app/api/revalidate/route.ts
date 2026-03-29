import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { revalidateAllPublicData } from "@/lib/revalidate";

const REVALIDATE_ALLOWED_ORIGIN =
  process.env.REVALIDATE_ALLOWED_ORIGIN ?? "http://localhost:5123";

function getCorsHeaders(origin: string | null) {
  const allowOrigin =
    REVALIDATE_ALLOWED_ORIGIN === "*" ? "*" : origin ?? REVALIDATE_ALLOWED_ORIGIN;

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-revalidate-secret",
    Vary: "Origin",
  };
}

/**
 * API endpoint to trigger cache invalidation for public data
 * Requires either an admin session cookie or a dedicated revalidation secret
 *
 * Authentication methods:
 * 1. Session cookie (for web app): Set via admin login
 * 2. Secret header (for external tools): Send x-revalidate-secret header
 *
 * Example external call:
 * curl -X POST https://your-domain.com/api/revalidate \
 *   -H "x-revalidate-secret: your-revalidation-secret"
 */
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");

  try {
    // Check session cookie first
    const sessionAuth = await isAdminAuthenticated();
    const configuredSecret = process.env.REVALIDATE_SECRET;
    const providedSecret = request.headers.get("x-revalidate-secret");
    const secretAuth =
      Boolean(configuredSecret) &&
      Boolean(providedSecret) &&
      providedSecret === configuredSecret;

    // If no session, require the external secret header
    if (!sessionAuth && !secretAuth) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Provide an admin session cookie or x-revalidate-secret header.",
        },
        {
          status: 401,
          headers: getCorsHeaders(origin),
        }
      );
    }

    const result = await revalidateAllPublicData();

    return NextResponse.json(
      {
        success: true,
        message: "All public data cache invalidated successfully",
        tags: result.tags,
      },
      {
        status: 200,
        headers: getCorsHeaders(origin),
      }
    );
  } catch (error) {
    console.error("Error revalidating public data:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to revalidate public data",
      },
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}
