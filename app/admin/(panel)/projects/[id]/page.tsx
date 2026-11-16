import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { requireAdmin } from "@/lib/auth/guard";
import { getContent, isWritable } from "@/lib/content";

export const metadata: Metadata = { title: "Edit project" };
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const { projects } = await getContent();
  const project = projects.find((p) => p.id === params.id);
  if (!project) notFound();
  const categories = [...new Set(["Web", "Mobile", "AI & Vision", ...projects.map((p) => p.category)])];
  return <ProjectEditor key={project.id} project={project} isNew={false} categories={categories} writable={isWritable()} />;
}
