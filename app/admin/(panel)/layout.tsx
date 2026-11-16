import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/guard";
import { getContent } from "@/lib/content";
import { inboxCount } from "@/lib/content/inbox";
import { storageKind } from "@/lib/content/storage";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const [content, count] = await Promise.all([getContent(), inboxCount()]);
  return (
    <AdminShell initials={content.profile.initials} storage={storageKind()} inboxCount={count}>
      {children}
    </AdminShell>
  );
}
