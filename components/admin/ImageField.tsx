"use client";

import { useRef, useState } from "react";
import { Camera, Github, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { captureScreenshot, importImageFromUrl } from "@/app/admin/actions";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { cn } from "@/lib/utils";
import { toast } from "./toast";

/** Resize + re-encode in the browser so uploads stay small and fast. */
async function compressImage(file: File, maxWidth = 2000, quality = 0.86): Promise<File> {
  if (file.type === "image/gif" || !file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
    let blob = await encode("image/webp");
    if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg");
    if (!blob || blob.size >= file.size) return file;
    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${ext}`, { type: blob.type });
  } catch {
    return file;
  }
}

function githubCard(repoUrl: string) {
  const match = repoUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!match) return null;
  return `https://opengraph.githubassets.com/${Date.now().toString(36)}/${match[1]}/${match[2].replace(/\.git$/, "")}`;
}

export function ImageField({
  value,
  onChange,
  title,
  category,
  year,
  liveUrl,
  repoUrl,
  disabled,
  error,
}: {
  value: string;
  onChange: (url: string) => void;
  title: string;
  category: string;
  year: string;
  liveUrl: string;
  repoUrl: string;
  disabled?: boolean;
  error?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"" | "upload" | "capture" | "github">("");
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("That file isn't an image.");
    setBusy("upload");
    try {
      const small = await compressImage(file);
      const body = new FormData();
      body.append("file", small);
      body.append("name", title || small.name);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || `Upload failed (${res.status}).`);
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy("");
      if (input.current) input.current.value = "";
    }
  };

  const capture = async () => {
    setBusy("capture");
    try {
      const res = await captureScreenshot(liveUrl, title);
      if (res.ok && res.data) {
        onChange(res.data.url);
        toast.success("Screenshot captured");
      } else if (!res.ok) toast.error(res.error);
    } finally {
      setBusy("");
    }
  };

  const useGithub = async () => {
    const card = githubCard(repoUrl);
    if (!card) return toast.error("Add a github.com repository URL first.");
    setBusy("github");
    try {
      const res = await importImageFromUrl(card, `${title}-github`);
      if (res.ok && res.data) {
        onChange(res.data.url);
        toast.success("GitHub card saved");
      } else if (!res.ok) toast.error(res.error);
    } finally {
      setBusy("");
    }
  };

  const off = disabled || busy !== "";

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label text-muted">Image</span>
        <span className="text-[0.65rem] text-subtle">16:10 works best · JPG, PNG, WebP, AVIF, GIF</span>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!off) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && !off) upload(file);
        }}
        className={cn(
          "group relative mt-2 aspect-[16/10] overflow-hidden border transition-colors",
          dragging ? "border-accent" : error ? "border-accent/60" : "border-fg/15",
        )}
      >
        <ProjectVisual title={title || "Untitled"} category={category || "Project"} year={year} image={value} sizes="480px" />
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={off}
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-canvas/70 text-sm opacity-0 backdrop-blur-sm transition-opacity",
            "focus-visible:opacity-100 group-hover:opacity-100",
            (dragging || busy) && "opacity-100",
          )}
        >
          {busy ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
          <span>
            {busy === "upload"
              ? "Uploading…"
              : busy === "capture"
                ? "Capturing screenshot (up to ~30s)…"
                : busy === "github"
                  ? "Fetching GitHub card…"
                  : dragging
                    ? "Drop to upload"
                    : "Click or drop an image"}
          </span>
        </button>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
      {error ? <p className="mt-1.5 text-xs text-accent">{error}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => input.current?.click()} disabled={off} className="btn btn-ghost btn-sm">
          <Upload size={13} />
          <span>Upload</span>
        </button>
        <button
          type="button"
          onClick={capture}
          disabled={off || !liveUrl}
          title={liveUrl ? "Screenshot the live site (via Microlink) and store it" : "Add a live URL first"}
          className="btn btn-ghost btn-sm"
        >
          <Camera size={13} />
          <span>Capture live site</span>
        </button>
        <button
          type="button"
          onClick={useGithub}
          disabled={off || !/github\.com\//i.test(repoUrl)}
          title="Use the repository's GitHub social card"
          className="btn btn-ghost btn-sm"
        >
          <Github size={13} />
          <span>GitHub card</span>
        </button>
        {value ? (
          <button type="button" onClick={() => onChange("")} disabled={off} className="btn btn-danger btn-sm">
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        ) : null}
      </div>
      <input
        className="input mt-3"
        value={value}
        disabled={off}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder="…or paste an image URL (https://…)"
        aria-label="Image URL"
      />
    </div>
  );
}
