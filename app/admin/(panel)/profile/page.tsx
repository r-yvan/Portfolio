import type { Metadata } from "next";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { requireAdmin } from "@/lib/auth/guard";
import { getContent, isWritable } from "@/lib/content";

export const metadata: Metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  await requireAdmin();
  const { profile, socials, stats } = await getContent();
  return <ProfileEditor initial={{ profile, socials, stats }} writable={isWritable()} />;
}
