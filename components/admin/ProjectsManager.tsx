"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import {
  Eye,
  EyeOff,
  Github,
  Globe,
  GripVertical,
  Link2,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import {
  checkLinks,
  deleteProject,
  importGithubRepos,
  listGithubCandidates,
  reorderProjects,
  setProjectFlag,
} from "@/app/admin/actions";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import type { LinkStatus, RepoCandidate } from "@/lib/admin-types";
import type { Project } from "@/lib/content/schema";
import { cn } from "@/lib/utils";
import { IconButton } from "./ListEditor";
import { Notice, PageHeader } from "./SaveBar";
import { toast } from "./toast";
import { useAction } from "./useAction";

function StatusDot({ status }: { status?: LinkStatus }) {
  if (!status) return null;
  return (
    <span
      title={status.ok ? `OK (${status.status})` : status.error ?? `HTTP ${status.status}`}
      className={cn("h-1.5 w-1.5 shrink-0", status.ok ? "bg-fg" : "bg-accent")}
    />
  );
}

function Row({
  project,
  index,
  links,
  writable,
  onToggle,
  onDelete,
  onDragEnd,
}: {
  project: Project;
  index: number;
  links: Record<string, LinkStatus>;
  writable: boolean;
  onToggle: (id: string, flag: "featured" | "visible", value: boolean) => void;
  onDelete: (project: Project) => void;
  onDragEnd: () => void;
}) {
  const controls = useDragControls();
  const broken = [project.liveUrl, project.repoUrl].some((u) => u && links[u] && !links[u].ok);
  return (
    <Reorder.Item
      value={project}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className={cn("relative flex items-center gap-3 border-b border-fg/10 bg-surface px-3 py-3 last:border-b-0", !project.visible && "opacity-60")}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        onPointerDown={(e) => writable && controls.start(e)}
        className="flex h-9 w-6 shrink-0 cursor-grab touch-none items-center justify-center text-subtle hover:text-fg active:cursor-grabbing"
      >
        <GripVertical size={15} />
      </button>
      <span className="label w-6 shrink-0 tabular">{String(index + 1).padStart(2, "0")}</span>
      <div className="relative hidden aspect-[16/10] w-24 shrink-0 overflow-hidden border border-fg/10 sm:block">
        <ProjectVisual title={project.title} category={project.category} image={project.image} sizes="96px" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link href={`/admin/projects/${project.id}`} className="truncate font-medium hover:text-accent">
            {project.title}
          </Link>
          {project.featured ? <span className="label bg-accent px-1.5 py-1 text-[0.58rem] text-accent-fg">Featured</span> : null}
          {broken ? <span className="label border border-accent px-1.5 py-1 text-[0.58rem] text-accent">Broken link</span> : null}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-subtle">
          <span>
            {project.category}
            {project.year ? ` · ${project.year}` : ""}
          </span>
          {project.liveUrl ? (
            <span className="flex items-center gap-1.5">
              <StatusDot status={links[project.liveUrl]} />
              <Globe size={11} /> Live
            </span>
          ) : null}
          {project.repoUrl ? (
            <span className="flex items-center gap-1.5">
              <StatusDot status={links[project.repoUrl]} />
              <Github size={11} /> Source
            </span>
          ) : null}
          {!project.image ? <span>Generated cover</span> : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center">
        <IconButton
          label={project.featured ? "Unfeature" : "Feature"}
          disabled={!writable}
          onClick={() => onToggle(project.id, "featured", !project.featured)}
          className={project.featured ? "text-accent" : ""}
        >
          <Star size={14} fill={project.featured ? "currentColor" : "none"} />
        </IconButton>
        <IconButton
          label={project.visible ? "Hide from site" : "Show on site"}
          disabled={!writable}
          onClick={() => onToggle(project.id, "visible", !project.visible)}
        >
          {project.visible ? <Eye size={14} /> : <EyeOff size={14} />}
        </IconButton>
        <Link
          href={`/admin/projects/${project.id}`}
          aria-label="Edit"
          title="Edit"
          className="flex h-8 w-8 items-center justify-center text-subtle transition-colors hover:bg-fg/10 hover:text-fg"
        >
          <Pencil size={14} />
        </Link>
        <IconButton label="Delete" danger disabled={!writable} onClick={() => onDelete(project)}>
          <Trash2 size={14} />
        </IconButton>
      </div>
    </Reorder.Item>
  );
}

function GithubImporter({ onClose }: { onClose: () => void }) {
  const [repos, setRepos] = useState<RepoCandidate[] | null>(null);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const importer = useAction(importGithubRepos);

  useEffect(() => {
    listGithubCandidates().then((res) => {
      if (res.ok) setRepos(res.data ?? []);
      else setError(res.error);
    });
  }, []);

  const toggle = (name: string) => setPicked((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));
  const run = async () => {
    const res = await importer.run(picked);
    if (res.ok) onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Import from GitHub"
        className="flex max-h-[85vh] w-full max-w-2xl flex-col border border-fg/15 bg-surface"
      >
        <header className="flex items-center justify-between border-b border-fg/10 px-5 py-4">
          <h2 className="flex items-center gap-2 font-medium">
            <Github size={16} /> Import from GitHub
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-subtle hover:text-fg">
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto" data-lenis-prevent>
          {error ? <p className="p-5 text-sm text-accent">{error}</p> : null}
          {!repos && !error ? (
            <p className="flex items-center gap-2 p-5 text-sm text-muted">
              <Loader2 size={14} className="animate-spin" /> Loading repositories…
            </p>
          ) : null}
          {repos?.length === 0 ? <p className="p-5 text-sm text-muted">No public repositories found.</p> : null}
          <ul className="divide-y divide-fg/10">
            {repos?.map((r) => (
              <li key={r.name}>
                <label className={cn("flex cursor-pointer items-start gap-3 px-5 py-3.5 hover:bg-fg/[0.03]", r.imported && "cursor-default opacity-50")}>
                  <input
                    type="checkbox"
                    className="mt-1 accent-[rgb(var(--accent))]"
                    disabled={r.imported}
                    checked={picked.includes(r.name)}
                    onChange={() => toggle(r.name)}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {r.name}
                      {r.imported ? <span className="label text-[0.58rem]">Already added</span> : null}
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-xs text-subtle">{r.description || "No description"}</span>
                    <span className="mt-1 block text-[0.68rem] text-subtle">
                      {[r.language, `★ ${r.stars}`, r.homepage && "has live URL"].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <footer className="flex items-center justify-between gap-3 border-t border-fg/10 px-5 py-4">
          <span className="text-xs text-subtle">Imported projects start with the repo description — edit them after.</span>
          <button onClick={run} disabled={!picked.length || importer.pending} className="btn btn-primary btn-sm">
            {importer.pending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            <span>Import {picked.length || ""}</span>
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsManager({ projects, writable }: { projects: Project[]; writable: boolean }) {
  const [items, setItems] = useState(projects);
  const [links, setLinks] = useState<Record<string, LinkStatus>>({});
  const [importing, setImporting] = useState(false);
  const order = useRef(projects.map((p) => p.id).join());
  const reorder = useAction(reorderProjects);
  const flag = useAction(setProjectFlag);
  const remove = useAction(deleteProject);
  const check = useAction(checkLinks);

  useEffect(() => {
    setItems(projects);
    order.current = projects.map((p) => p.id).join();
  }, [projects]);

  const persistOrder = () => {
    const ids = items.map((p) => p.id);
    if (ids.join() === order.current) return;
    order.current = ids.join();
    reorder.run(ids);
  };

  const toggle = async (id: string, key: "featured" | "visible", value: boolean) => {
    setItems((list) => list.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
    const res = await flag.run(id, key, value);
    if (!res.ok) setItems(projects);
  };

  const del = async (project: Project) => {
    if (!window.confirm(`Delete “${project.title}”? You can still restore an older version from Settings.`)) return;
    await remove.run(project.id);
  };

  const runCheck = async () => {
    const urls = items.flatMap((p) => [p.liveUrl, p.repoUrl]).filter(Boolean);
    const res = await check.run(urls);
    if (res.ok && res.data) {
      setLinks(res.data);
      const broken = Object.values(res.data).filter((s) => !s.ok).length;
      if (broken) toast.error(`${broken} of ${urls.length} links are broken — marked in red.`);
      else toast.success(`All ${urls.length} links work.`);
    }
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Drag to reorder, star to feature, hide to keep a draft off the site. The order here is the order on your portfolio."
        actions={
          <>
            <button onClick={runCheck} disabled={check.pending || !items.length} className="btn btn-ghost btn-sm">
              {check.pending ? <Loader2 size={13} className="animate-spin" /> : <Link2 size={13} />}
              <span>{check.pending ? "Checking…" : "Check links"}</span>
            </button>
            <button onClick={() => setImporting(true)} disabled={!writable} className="btn btn-ghost btn-sm">
              <Github size={13} />
              <span>Import from GitHub</span>
            </button>
            <Link href="/admin/projects/new" className="btn btn-primary btn-sm">
              <Plus size={13} />
              <span>New project</span>
            </Link>
          </>
        }
      />
      {!writable ? <Notice tone="warn">This deployment is read-only — see Settings to enable saving.</Notice> : null}

      {items.length ? (
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="border border-fg/10">
          {items.map((project, i) => (
            <Row
              key={project.id}
              project={project}
              index={i}
              links={links}
              writable={writable}
              onToggle={toggle}
              onDelete={del}
              onDragEnd={persistOrder}
            />
          ))}
        </Reorder.Group>
      ) : (
        <div className="border border-dashed border-fg/20 p-10 text-center">
          <p className="text-muted">No projects yet. While this list is empty the site shows your GitHub repos.</p>
          <Link href="/admin/projects/new" className="btn btn-primary btn-sm mt-5">
            <Plus size={13} />
            <span>Add your first project</span>
          </Link>
        </div>
      )}

      <AnimatePresence>{importing ? <GithubImporter onClose={() => setImporting(false)} /> : null}</AnimatePresence>
    </>
  );
}
