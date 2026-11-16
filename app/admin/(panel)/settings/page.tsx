import type { Metadata } from "next";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { requireAdmin } from "@/lib/auth/guard";
import { listVersions, storageKind, type VersionInfo } from "@/lib/content/storage";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();
  let versions: VersionInfo[] = [];
  try {
    versions = await listVersions();
  } catch (error) {
    console.error("[admin] could not list versions", error);
  }

  const env = [
    { name: "ADMIN_PASSWORD", set: (process.env.ADMIN_PASSWORD ?? "").length >= 8, required: true, note: "Your admin password (8+ characters; longer is better)." },
    { name: "ADMIN_SECRET", set: (process.env.ADMIN_SECRET ?? "").length >= 32, required: true, note: "Random 32+ character string. Signs sessions and encrypts inbox messages." },
    { name: "BLOB_READ_WRITE_TOKEN", set: !!process.env.BLOB_READ_WRITE_TOKEN, required: false, note: "Added automatically when you connect a Vercel Blob store. Required to edit on the live site." },
    { name: "GITHUB_TOKEN", set: !!process.env.GITHUB_TOKEN, required: false, note: "Raises GitHub API rate limits for repo import." },
    { name: "MICROLINK_API_KEY", set: !!process.env.MICROLINK_API_KEY, required: false, note: "Only needed if you capture more than ~50 screenshots a day." },
    { name: "NEXT_PUBLIC_SITE_URL", set: !!process.env.NEXT_PUBLIC_SITE_URL, required: false, note: "Canonical URL for metadata (defaults to https://r-yvan.vercel.app)." },
  ];

  return <SettingsPanel storage={storageKind()} env={env} versions={versions} />;
}
