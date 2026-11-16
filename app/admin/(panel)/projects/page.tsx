import type { Metadata } from "next";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { requireAdmin } from "@/lib/auth/guard";
import { getContent, isWritable } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function ProjectsPage() {
  await requireAdmin();
  const { projects } = await getContent();
  return <ProjectsManager projects={projects} writable={isWritable()} />;
}
