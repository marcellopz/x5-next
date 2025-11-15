import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_VALUE = "authenticated";

/**
 * Verify if the provided password matches the admin password
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }
  return password === adminPassword;
}

/**
 * Set the admin session cookie
 */
export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear the admin session cookie
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/**
 * Check if the user is authenticated as admin
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value === ADMIN_SESSION_VALUE;
}

/**
 * Verify if the provided API key matches the admin API key
 */
export function verifyAdminApiKey(apiKey: string): boolean {
  const adminApiKey = process.env.ADMIN_API_KEY;
  if (!adminApiKey) {
    return false; // If no API key is set, reject all API key auth
  }
  return apiKey === adminApiKey;
}

/**
 * Check if the request is authenticated via session cookie or API key
 * For use in API routes where external apps can use API keys
 */
export async function isAdminAuthenticatedOrApiKey(
  apiKey: string | null
): Promise<boolean> {
  // Check session cookie first
  const sessionAuth = await isAdminAuthenticated();
  if (sessionAuth) {
    return true;
  }

  // If no session, check API key
  if (apiKey) {
    return verifyAdminApiKey(apiKey);
  }

  return false;
}
