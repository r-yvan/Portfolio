import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { ContentSchema, type Content } from "./schema";
import { defaultContent } from "./defaults";
import {
  READONLY_MESSAGE,
  StorageError,
  readStoredContent,
  readVersion,
  storageKind,
  writeStoredContent,
} from "./storage";

export const CONTENT_TAG = "cms-content";
export const INBOX_TAG = "cms-inbox";

type Section = Exclude<keyof Content, "version" | "updatedAt">;
const SECTIONS = Object.keys(ContentSchema.shape).filter(
  (k) => k !== "version" && k !== "updatedAt",
) as Section[];

/**
 * Validate stored content section by section. A broken or outdated section
 * falls back to its default instead of taking the whole site down.
 */
export function normalizeContent(raw: unknown): Content {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out = { ...defaultContent } as Record<string, unknown>;
  for (const key of SECTIONS) {
    if (!(key in source)) continue;
    const parsed = ContentSchema.shape[key].safeParse(source[key]);
    if (parsed.success) out[key] = parsed.data;
    else console.warn(`[content] "${key}" is invalid — using defaults.`, parsed.error.issues[0]);
  }
  out.version = 1;
  out.updatedAt = typeof source.updatedAt === "string" ? source.updatedAt : defaultContent.updatedAt;
  return out as Content;
}

/** The content/portfolio.json shipped with the build (git-managed seed). */
async function readBundled(): Promise<unknown | null> {
  try {
    if (process.env.NODE_ENV === "production") {
      return (await import("@/content/portfolio.json")).default;
    }
    return JSON.parse(await fs.readFile(path.join(process.cwd(), "content", "portfolio.json"), "utf8"));
  } catch {
    return null;
  }
}

async function readFresh(): Promise<Content> {
  const kind = storageKind();
  const stored = kind === "readonly" ? null : await readStoredContent();
  return normalizeContent(stored ?? (await readBundled()));
}

const readCached = unstable_cache(readFresh, ["cms-content-v1"], { tags: [CONTENT_TAG] });

/** Content for rendering (deduped per request, cached across requests). */
export const getContent = cache(async (): Promise<Content> => {
  try {
    // Local files are cheap to read and must reflect edits immediately.
    return storageKind() === "local" ? await readFresh() : await readCached();
  } catch (error) {
    console.error("[content] read failed — rendering defaults.", error);
    return defaultContent;
  }
});

export function isWritable() {
  return storageKind() !== "readonly";
}

function revalidateSite() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

/**
 * Read-modify-write against the freshest stored copy (never the cache), so
 * saving one admin section can't clobber another.
 */
export async function mutateContent(mutator: (draft: Content) => Content | void): Promise<Content> {
  if (!isWritable()) throw new StorageError(READONLY_MESSAGE);
  const current = await readFresh();
  const draft = structuredClone(current);
  const result = mutator(draft) ?? draft;
  const next = ContentSchema.parse({ ...result, version: 1, updatedAt: new Date().toISOString() });
  await writeStoredContent(next);
  revalidateSite();
  return next;
}

/** Replace everything (backup import / version restore). */
export async function replaceContent(raw: unknown): Promise<Content> {
  if (!isWritable()) throw new StorageError(READONLY_MESSAGE);
  const next = ContentSchema.parse({
    ...(raw as object),
    version: 1,
    updatedAt: new Date().toISOString(),
  });
  await writeStoredContent(next);
  revalidateSite();
  return next;
}

export async function restoreVersion(id: string) {
  const raw = await readVersion(id);
  if (!raw) throw new StorageError("That version no longer exists.");
  return replaceContent(normalizeContent(raw));
}

export function revalidateInbox() {
  revalidateTag(INBOX_TAG);
}
