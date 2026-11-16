import type { Metadata } from "next";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { requireAdmin } from "@/lib/auth/guard";
import { getContent, isWritable } from "@/lib/content";
import type { Project } from "@/lib/content/schema";

export const metadata: Metadata = { title: "New project" };
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function NewProjectPage() {
  await requireAdmin();
  const { projects } = await getContent();
  const blank: Project = {
    id: "",
    title: "",
    summary: "",
    category: "Web",
    tags: [],
    year: String(new Date().getFullYear()),
    role: "",
    image: "",
    imageAlt: "",
    liveUrl: "",
    repoUrl: "",
    featured: false,
    visible: true,
  };
  const categories = [...new Set(["Web", "Mobile", "AI & Vision", ...projects.map((p) => p.category)])];
  return <ProjectEditor project={blank} isNew categories={categories} writable={isWritable()} />;
}
