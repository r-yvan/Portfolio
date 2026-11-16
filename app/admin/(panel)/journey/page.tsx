import type { Metadata } from "next";
import { JourneyEditor } from "@/components/admin/SectionEditors";
import { requireAdmin } from "@/lib/auth/guard";
import { getContent, isWritable } from "@/lib/content";

export const metadata: Metadata = { title: "Journey" };
export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  await requireAdmin();
  const { milestones, settings } = await getContent();
  return <JourneyEditor initial={{ milestones, show: settings.showJourney }} writable={isWritable()} />;
}
