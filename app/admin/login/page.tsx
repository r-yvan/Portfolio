import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/auth/guard";
import { authConfig, safeAdminPath } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = safeAdminPath(searchParams.next);
  if (await isAdmin()) redirect(next);
  return <LoginForm next={next} configured={authConfig().configured} />;
}
