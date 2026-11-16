"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clientIp } from "@/lib/auth/guard";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  authConfig,
  checkPassword,
  createSessionToken,
  safeAdminPath,
} from "@/lib/auth/session";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

export type LoginResult = { error: string } | undefined;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(formData: FormData): Promise<LoginResult> {
  if (!authConfig().configured) {
    return { error: "Admin isn't configured yet — set ADMIN_PASSWORD and ADMIN_SECRET (see README)." };
  }

  const key = `login:${clientIp()}`;
  if (!rateLimit(key, 6, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Wait a few minutes and try again." };
  }

  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) {
    await sleep(700);
    return { error: "That password isn't right." };
  }

  resetRateLimit(key);
  cookies().set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect(safeAdminPath(String(formData.get("next") ?? "")));
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect("/admin/login");
}
