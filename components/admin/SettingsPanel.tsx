"use client";

import { useRef } from "react";
import { Check, Download, History, Loader2, LogOut, Minus, RotateCcw, Upload, X } from "lucide-react";
import { importContentBackup, restoreContentVersion } from "@/app/admin/actions";
import { logout } from "@/app/admin/login/actions";
import type { StorageKind, VersionInfo } from "@/lib/content/storage";
import { cn } from "@/lib/utils";
import { FormSection } from "./fields";
import { PageHeader } from "./SaveBar";
import { useAction } from "./useAction";

type EnvCheck = { name: string; set: boolean; required: boolean; note: string };

const STORAGE_COPY: Record<StorageKind, { title: string; body: string }> = {
  local: {
    title: "Local files",
    body: "Edits are written to content/portfolio.json and images to public/uploads/. Commit those files and the next deploy will ship them.",
  },
  blob: {
    title: "Vercel Blob",
    body: "Edits are saved to your Blob store and go live immediately — no redeploy needed. Every save is kept as a version below.",
  },
  readonly: {
    title: "Read-only",
    body: "This deployment has no writable storage, so the site shows the bundled content/portfolio.json and saving is disabled.",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function SettingsPanel({
  storage,
  env,
  versions,
}: {
  storage: StorageKind;
  env: EnvCheck[];
  versions: VersionInfo[];
}) {
  const file = useRef<HTMLInputElement>(null);
  const restore = useAction(restoreContentVersion);
  const importer = useAction(importContentBackup);
  const writable = storage !== "readonly";
  const copy = STORAGE_COPY[storage];

  const onRestore = async (v: VersionInfo) => {
    if (!window.confirm(`Restore the version saved ${formatDate(v.savedAt)}? Your current content is kept as a version too.`)) return;
    await restore.run(v.id);
  };

  const onImport = async (f: File) => {
    if (!window.confirm(`Replace ALL content with “${f.name}”? The current content stays in version history.`)) return;
    await importer.run(await f.text());
    if (file.current) file.current.value = "";
  };

  return (
    <>
      <PageHeader title="Settings" description="Storage, environment, backups and version history." />

      <div className="space-y-6">
        <FormSection title="Storage" aside={<span className={cn("label px-2 py-1.5", writable ? "bg-fg text-canvas" : "bg-accent text-accent-fg")}>{copy.title}</span>}>
          <p className="text-sm leading-relaxed text-muted">{copy.body}</p>
          {storage === "readonly" ? (
            <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed">
              <li>Open your project on vercel.com → <b>Storage</b> → <b>Create Database</b> → <b>Blob</b>.</li>
              <li>Connect it to this project (all environments). Vercel adds <code>BLOB_READ_WRITE_TOKEN</code> for you.</li>
              <li>Redeploy. The admin switches to Vercel Blob automatically, seeded from your current content.</li>
            </ol>
          ) : null}
        </FormSection>

        <FormSection title="Environment" description="Set these in .env.local for development and in Vercel → Settings → Environment Variables for production.">
          <ul className="divide-y divide-fg/10 border border-fg/10">
            {env.map((v) => (
              <li key={v.name} className="flex items-start gap-3 px-4 py-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center",
                    v.set ? "bg-fg text-canvas" : v.required ? "bg-accent text-accent-fg" : "border border-fg/20 text-subtle",
                  )}
                >
                  {v.set ? <Check size={12} /> : v.required ? <X size={12} /> : <Minus size={12} />}
                </span>
                <span className="min-w-0 flex-1">
                  <code className="text-sm font-medium">{v.name}</code>
                  <span className="ml-2 text-xs text-subtle">{v.required ? "required" : "optional"}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">{v.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </FormSection>

        <FormSection title="Backup" description="Download everything as JSON, or restore from a previous download.">
          <div className="flex flex-wrap gap-2">
            <a href="/api/admin/export" className="btn btn-ghost btn-sm">
              <Download size={13} />
              <span>Download backup</span>
            </a>
            <button onClick={() => file.current?.click()} disabled={!writable || importer.pending} className="btn btn-ghost btn-sm">
              {importer.pending ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              <span>Restore from file</span>
            </button>
            <input
              ref={file}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImport(f);
              }}
            />
          </div>
        </FormSection>

        <FormSection
          title="Version history"
          description="The last 25 saves. Restoring creates a new version, so nothing is ever lost."
          aside={<History size={16} className="text-subtle" />}
        >
          {versions.length ? (
            <ul className="divide-y divide-fg/10 border border-fg/10">
              {versions.map((v, i) => (
                <li key={v.id} className="flex items-center gap-4 px-4 py-3">
                  <span className="label w-6 tabular">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-sm">
                    {formatDate(v.savedAt)}
                    {i === 0 ? <span className="label ml-3 text-accent">Current</span> : null}
                  </span>
                  <span className="hidden text-xs text-subtle tabular sm:inline">{(v.size / 1024).toFixed(1)} KB</span>
                  <button
                    onClick={() => onRestore(v)}
                    disabled={!writable || restore.pending || i === 0}
                    className="btn btn-ghost btn-sm"
                  >
                    <RotateCcw size={12} />
                    <span>Restore</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No saved versions yet — they appear after your first save.</p>
          )}
        </FormSection>

        <FormSection title="Session" description="Sessions last 7 days. Changing ADMIN_PASSWORD or ADMIN_SECRET signs out every device.">
          <form action={logout}>
            <button type="submit" className="btn btn-danger btn-sm">
              <LogOut size={13} />
              <span>Sign out</span>
            </button>
          </form>
        </FormSection>
      </div>
    </>
  );
}
