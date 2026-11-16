import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/**
 * Defense in depth: middleware already gates /admin and /api/admin, but every
 * page, server action and route handler re-verifies the session itself.
 */
export async function isAdmin() {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
}

/** For admin pages: bounce to the login screen when not signed in. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Your session has expired. Sign in again.");
    this.name = "UnauthorizedError";
  }
}

/** For server actions / route handlers. */
export async function assertAdmin() {
  if (!(await isAdmin())) throw new UnauthorizedError();
}

/** Same-origin check for state-changing route handlers. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = headers().get("x-forwarded-host") ?? headers().get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Client IP (best effort) for rate limiting. */
export function clientIp() {
  const forwarded = headers().get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headers().get("x-real-ip") || "local";
}
