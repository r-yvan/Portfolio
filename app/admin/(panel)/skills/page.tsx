import type { Metadata } from "next";
import { SkillsEditor } from "@/components/admin/SectionEditors";
import { requireAdmin } from "@/lib/auth/guard";
import { getContent, isWritable } from "@/lib/content";

export const metadata: Metadata = { title: "Skills" };
export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  await requireAdmin();
  const { skillGroups } = await getContent();
  return <SkillsEditor initial={skillGroups} writable={isWritable()} />;
}
