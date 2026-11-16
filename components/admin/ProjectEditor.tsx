"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ExternalLink, Loader2, Save, Trash2, X } from "lucide-react";
import { checkLinks, deleteProject, saveProject } from "@/app/admin/actions";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { LinkStatus } from "@/lib/admin-types";
import type { Project } from "@/lib/content/schema";
import { Field, FormSection, TagInput, TextArea, TextInput, Toggle } from "./fields";
import { ImageField } from "./ImageField";
import { Notice, PageHeader, SaveBar } from "./SaveBar";
import { toast } from "./toast";
import { useAction, useDirty } from "./useAction";

function normalizeUrl(value: string) {
  const v = value.trim();
  if (!v) return "";
  return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
}

function LinkField({
  label,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
}) {
  const [status, setStatus] = useState<LinkStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const test = async () => {
    if (!value) return;
    setTesting(true);
    setStatus(null);
    const res = await checkLinks([value]);
    setTesting(false);
    if (res.ok && res.data) setStatus(res.data[value] ?? null);
    else if (!res.ok) toast.error(res.error);
  };
  return (
    <Field label={label} error={error} hint={status ? undefined : hint}>
      <div className="flex">
        <input
          className={error ? "input border-accent" : "input"}
          value={value}
          placeholder="https://"
          onChange={(e) => {
            setStatus(null);
            onChange(e.target.value);
          }}
          onBlur={(e) => onChange(normalizeUrl(e.target.value))}
          inputMode="url"
        />
        <button
          type="button"
          onClick={test}
          disabled={!value || testing}
          className="flex shrink-0 items-center gap-1.5 border border-l-0 border-fg/15 px-3 text-xs text-muted transition-colors hover:text-fg disabled:opacity-40"
        >
          {testing ? <Loader2 size={12} className="animate-spin" /> : null} Test
        </button>
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open link"
            className="flex shrink-0 items-center border border-l-0 border-fg/15 px-3 text-muted hover:text-fg"
          >
            <ExternalLink size={13} />
          </a>
        ) : null}
      </div>
      {status ? (
        <p className={status.ok ? "mt-1.5 flex items-center gap-1.5 text-xs text-fg" : "mt-1.5 flex items-center gap-1.5 text-xs text-accent"}>
          {status.ok ? <Check size={12} /> : <X size={12} />}
          {status.ok ? `Works (${status.status})` : `Broken — ${status.error ?? `HTTP ${status.status}`}`}
        </p>
      ) : null}
    </Field>
  );
}

export function ProjectEditor({
  project,
  isNew,
  categories,
  writable,
}: {
  project: Project;
  isNew: boolean;
  categories: string[];
  writable: boolean;
}) {
  const router = useRouter();
  const [baseline, setBaseline] = useState(project);
  const [form, setForm] = useState(project);
  const dirty = useDirty(form, baseline);
  const save = useAction(saveProject);
  const remove = useAction(deleteProject);
  const e = save.fieldErrors;

  const set = <K extends keyof Project>(key: K, value: Project[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onSave = async () => {
    const payload = { ...form, liveUrl: normalizeUrl(form.liveUrl), repoUrl: normalizeUrl(form.repoUrl) };
    const res = await save.run(payload, isNew ? null : project.id);
    if (res.ok && res.data) {
      setBaseline(payload);
      setForm(payload);
      if (isNew) router.replace(`/admin/projects/${res.data.id}`);
    }
  };

  const onDelete = async () => {
    if (!window.confirm(`Delete “${project.title}”? This can't be undone (but you can restore an older version in Settings).`)) return;
    const res = await remove.run(project.id);
    if (res.ok) router.push("/admin/projects");
  };

  return (
    <>
      <Link href="/admin/projects" className="label mb-6 inline-flex items-center gap-2 hover:text-fg">
        <ArrowLeft size={13} /> All projects
      </Link>
      <PageHeader
        title={isNew ? "New project" : form.title || "Untitled project"}
        description={isNew ? "Fill in the details — the preview on the right updates as you type." : `/${project.id}`}
        actions={
          <>
            {!isNew ? (
              <button type="button" onClick={onDelete} disabled={remove.pending || !writable} className="btn btn-danger btn-sm">
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            ) : null}
            <button type="button" onClick={onSave} disabled={save.pending || !writable || (!dirty && !isNew)} className="btn btn-primary btn-sm">
              {save.pending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              <span>{isNew ? "Create project" : "Save"}</span>
            </button>
          </>
        }
      />
      {!writable ? <Notice tone="warn">This deployment is read-only — see Settings to enable saving.</Notice> : null}

      <div className="grid gap-8 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <FormSection title="Details">
            <TextInput label="Title" value={form.title} onChange={(v) => set("title", v)} error={e.title} max={80} placeholder="e.g. PicDeck" />
            <TextArea
              label="Summary"
              value={form.summary}
              onChange={(v) => set("summary", v)}
              error={e.summary}
              max={320}
              rows={3}
              hint="One or two sentences — what it is and what it's built with."
            />
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Category" error={e.category}>
                <input className="input" list="project-categories" value={form.category} onChange={(ev) => set("category", ev.target.value)} />
                <datalist id="project-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <TextInput label="Year" value={form.year} onChange={(v) => set("year", v)} error={e.year} placeholder="2026" />
              <TextInput label="Role" value={form.role} onChange={(v) => set("role", v)} error={e.role} placeholder="Design & development" />
            </div>
            <TagInput label="Tech / tags" value={form.tags} onChange={(v) => set("tags", v)} error={e.tags} placeholder="React, Next.js…" />
          </FormSection>

          <FormSection title="Links" description="Each card gets a “Live site” and a “Source” button. Use Test to make sure they work.">
            <LinkField label="Live site" value={form.liveUrl} onChange={(v) => set("liveUrl", v)} error={e.liveUrl} hint="Leave empty if there's no public deployment." />
            <LinkField label="Source code" value={form.repoUrl} onChange={(v) => set("repoUrl", v)} error={e.repoUrl} hint="GitHub, GitLab… (optional)" />
          </FormSection>

          <FormSection title="Image">
            <ImageField
              value={form.image}
              onChange={(v) => set("image", v)}
              title={form.title}
              category={form.category}
              year={form.year}
              liveUrl={normalizeUrl(form.liveUrl)}
              repoUrl={normalizeUrl(form.repoUrl)}
              disabled={!writable}
              error={e.image}
            />
            <TextInput
              label="Alt text"
              value={form.imageAlt}
              onChange={(v) => set("imageAlt", v)}
              error={e.imageAlt}
              hint="Describe the image for screen readers."
            />
          </FormSection>

          <FormSection title="Display">
            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle label="Visible" description="Show this project on the site" checked={form.visible} onChange={(v) => set("visible", v)} />
              <Toggle label="Featured" description="Show it large at the top" checked={form.featured} onChange={(v) => set("featured", v)} />
            </div>
          </FormSection>
        </div>

        <aside className="xl:sticky xl:top-8 xl:self-start">
          <div className="label mb-3">Live preview</div>
          <ProjectCard project={{ ...form, title: form.title || "Untitled project" }} index={0} preview />
        </aside>
      </div>

      <SaveBar dirty={dirty && !isNew} pending={save.pending} onSave={onSave} onDiscard={() => setForm(baseline)} disabled={!writable} />
    </>
  );
}
