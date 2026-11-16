import type { Metadata } from "next";
import { ApproachEditor } from "@/components/admin/SectionEditors";
import { requireAdmin } from "@/lib/auth/guard";
import { getContent, isWritable } from "@/lib/content";

export const metadata: Metadata = { title: "Approach" };
export const dynamic = "force-dynamic";

export default async function ApproachPage() {
  await requireAdmin();
  const { principles } = await getContent();
  return <ApproachEditor initial={principles} writable={isWritable()} />;
}
