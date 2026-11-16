import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { del, get, list, put } from "@vercel/blob";

/**
 * Storage drivers for CMS content, uploaded images and inbox messages.
 *
 *  local    — `next dev` / self-hosted: writes content/portfolio.json and
 *             public/uploads/. Edits show up in git, so you can commit them.
 *  blob     — production on Vercel with a connected Blob store
 *             (BLOB_READ_WRITE_TOKEN). Content is saved as immutable,
 *             versioned snapshots, which doubles as version history.
 *  readonly — deployed on Vercel without a Blob store: the site renders the
 *             bundled content/portfolio.json and the admin explains how to
 *             enable editing.
 */
export type StorageKind = "local" | "blob" | "readonly";

export function storageKind(): StorageKind {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.VERCEL) return "readonly";
  return "local";
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export const READONLY_MESSAGE =
  "Editing is disabled: this deployment has no writable storage. In Vercel open Storage → Create → Blob, connect it to this project, then redeploy.";

export type VersionInfo = { id: string; savedAt: string; size: number };
export type StoredMessage = { id: string; receivedAt: string; payload: string };

const MAX_VERSIONS = 25;
const ROOT = process.cwd();
const CONTENT_FILE = path.join(ROOT, "content", "portfolio.json");
const HISTORY_DIR = path.join(ROOT, "content", ".history");
const INBOX_DIR = path.join(ROOT, "content", ".inbox");
const UPLOAD_DIR = path.join(ROOT, "public", "uploads");

const BLOB = {
  content: "cms/content/",
  uploads: "cms/uploads/",
  inbox: "cms/inbox/",
} as const;

/** Newest-first sortable stamp: lexical order == reverse chronological. */
function invertedStamp() {
  return String(9_999_999_999_999 - Date.now()).padStart(13, "0");
}

function stampToIso(stamp: string) {
  const ms = 9_999_999_999_999 - Number(stamp.slice(0, 13));
  return Number.isFinite(ms) ? new Date(ms).toISOString() : new Date(0).toISOString();
}

const SAFE_ID = /^[0-9]{13}-[a-f0-9]{8,32}$/;
const SAFE_UPLOAD = /^[\w.-]{1,120}$/;

function isMissing(error: unknown) {
  return (error as NodeJS.ErrnoException)?.code === "ENOENT";
}

async function readBlobText(urlOrPath: string): Promise<string | null> {
  const res = await get(urlOrPath, { access: "public" });
  if (!res || res.statusCode !== 200) return null;
  return new Response(res.stream).text();
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

/** Content currently stored (null when nothing has been saved yet). */
export async function readStoredContent(): Promise<unknown | null> {
  const kind = storageKind();
  if (kind === "blob") {
    const versions = await listBlobVersions();
    if (!versions.length) return null;
    const text = await readBlobText(versions[0].url);
    return text ? JSON.parse(text) : null;
  }
  if (kind === "local") {
    try {
      return JSON.parse(await fs.readFile(CONTENT_FILE, "utf8"));
    } catch (error) {
      if (isMissing(error)) return null;
      throw error;
    }
  }
  return null; // readonly → caller falls back to the bundled file
}

export async function writeStoredContent(data: unknown): Promise<void> {
  const kind = storageKind();
  if (kind === "readonly") throw new StorageError(READONLY_MESSAGE);
  const json = `${JSON.stringify(data, null, 2)}\n`;
  const stamp = `${invertedStamp()}-${randomBytes(4).toString("hex")}`;

  if (kind === "blob") {
    await put(`${BLOB.content}${stamp}.json`, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    const versions = await listBlobVersions();
    const stale = versions.slice(MAX_VERSIONS).map((v) => v.url);
    if (stale.length) await del(stale);
    return;
  }

  // local: atomic write + snapshot for version history
  await fs.mkdir(path.dirname(CONTENT_FILE), { recursive: true });
  const tmp = `${CONTENT_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, json, "utf8");
  await fs.rename(tmp, CONTENT_FILE);
  await fs.mkdir(HISTORY_DIR, { recursive: true });
  await fs.writeFile(path.join(HISTORY_DIR, `${stamp}.json`), json, "utf8");
  const files = (await fs.readdir(HISTORY_DIR)).filter((f) => f.endsWith(".json")).sort();
  await Promise.all(
    files.slice(MAX_VERSIONS).map((f) => fs.rm(path.join(HISTORY_DIR, f), { force: true })),
  );
}

async function listBlobVersions() {
  const { blobs } = await list({ prefix: BLOB.content, limit: 1000 });
  return blobs
    .filter((b) => b.pathname.endsWith(".json"))
    .sort((a, b) => a.pathname.localeCompare(b.pathname)); // newest first
}

export async function listVersions(): Promise<VersionInfo[]> {
  const kind = storageKind();
  if (kind === "blob") {
    return (await listBlobVersions()).map((b) => {
      const id = b.pathname.slice(BLOB.content.length, -".json".length);
      return { id, savedAt: new Date(b.uploadedAt).toISOString(), size: b.size };
    });
  }
  if (kind === "local") {
    try {
      const files = (await fs.readdir(HISTORY_DIR)).filter((f) => f.endsWith(".json")).sort();
      return Promise.all(
        files.map(async (f) => {
          const id = f.slice(0, -".json".length);
          const stat = await fs.stat(path.join(HISTORY_DIR, f));
          return { id, savedAt: stampToIso(id), size: stat.size };
        }),
      );
    } catch (error) {
      if (isMissing(error)) return [];
      throw error;
    }
  }
  return [];
}

export async function readVersion(id: string): Promise<unknown | null> {
  if (!SAFE_ID.test(id)) return null;
  const kind = storageKind();
  if (kind === "blob") {
    const text = await readBlobText(`${BLOB.content}${id}.json`);
    return text ? JSON.parse(text) : null;
  }
  if (kind === "local") {
    try {
      return JSON.parse(await fs.readFile(path.join(HISTORY_DIR, `${id}.json`), "utf8"));
    } catch (error) {
      if (isMissing(error)) return null;
      throw error;
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */

/** Stores an image and returns its public URL. */
export async function storeImage(name: string, data: Buffer, contentType: string) {
  if (!SAFE_UPLOAD.test(name)) throw new StorageError("Invalid file name.");
  const kind = storageKind();
  if (kind === "readonly") throw new StorageError(READONLY_MESSAGE);
  if (kind === "blob") {
    const blob = await put(`${BLOB.uploads}${name}`, data, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return blob.url;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), data);
  return `/uploads/${name}`;
}

/** Best-effort removal of an image this CMS uploaded (ignores foreign URLs). */
export async function removeImage(url: string) {
  if (!url) return;
  try {
    const kind = storageKind();
    if (kind === "blob" && /\.public\.blob\.vercel-storage\.com\/cms\/uploads\//.test(url)) {
      await del(url);
    } else if (kind === "local" && url.startsWith("/uploads/")) {
      const name = url.slice("/uploads/".length);
      if (SAFE_UPLOAD.test(name)) await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
    }
  } catch (error) {
    console.warn("[storage] could not remove image", url, error);
  }
}

/* ------------------------------------------------------------------ */
/* Inbox (payload is AES-GCM ciphertext — see lib/crypto.ts)           */
/* ------------------------------------------------------------------ */

export async function storeMessage(payload: string): Promise<string> {
  const kind = storageKind();
  if (kind === "readonly") throw new StorageError(READONLY_MESSAGE);
  const id = `${invertedStamp()}-${randomBytes(16).toString("hex")}`;
  const record: StoredMessage = { id, receivedAt: new Date().toISOString(), payload };
  const json = JSON.stringify(record);
  if (kind === "blob") {
    await put(`${BLOB.inbox}${id}.json`, json, {
      access: "public", // unguessable path + encrypted payload
      contentType: "application/json",
      addRandomSuffix: false,
    });
  } else {
    await fs.mkdir(INBOX_DIR, { recursive: true });
    await fs.writeFile(path.join(INBOX_DIR, `${id}.json`), json, "utf8");
  }
  return id;
}

export async function listMessages(limit = 200): Promise<StoredMessage[]> {
  const kind = storageKind();
  if (kind === "blob") {
    const { blobs } = await list({ prefix: BLOB.inbox, limit: 1000 });
    const newest = blobs
      .filter((b) => b.pathname.endsWith(".json"))
      .sort((a, b) => a.pathname.localeCompare(b.pathname))
      .slice(0, limit);
    const records = await Promise.all(
      newest.map(async (b) => {
        try {
          const text = await readBlobText(b.url);
          return text ? (JSON.parse(text) as StoredMessage) : null;
        } catch {
          return null;
        }
      }),
    );
    return records.filter((r): r is StoredMessage => !!r);
  }
  if (kind === "local") {
    try {
      const files = (await fs.readdir(INBOX_DIR)).filter((f) => f.endsWith(".json")).sort();
      const records = await Promise.all(
        files.slice(0, limit).map(async (f) => {
          try {
            return JSON.parse(await fs.readFile(path.join(INBOX_DIR, f), "utf8")) as StoredMessage;
          } catch {
            return null;
          }
        }),
      );
      return records.filter((r): r is StoredMessage => !!r);
    } catch (error) {
      if (isMissing(error)) return [];
      throw error;
    }
  }
  return [];
}

export async function countMessages(): Promise<number> {
  const kind = storageKind();
  if (kind === "blob") {
    const { blobs } = await list({ prefix: BLOB.inbox, limit: 1000 });
    return blobs.filter((b) => b.pathname.endsWith(".json")).length;
  }
  if (kind === "local") {
    try {
      return (await fs.readdir(INBOX_DIR)).filter((f) => f.endsWith(".json")).length;
    } catch (error) {
      if (isMissing(error)) return 0;
      throw error;
    }
  }
  return 0;
}

export async function deleteMessage(id: string) {
  if (!SAFE_ID.test(id)) throw new StorageError("Invalid message id.");
  const kind = storageKind();
  if (kind === "readonly") throw new StorageError(READONLY_MESSAGE);
  if (kind === "blob") {
    await del(`${BLOB.inbox}${id}.json`);
  } else {
    await fs.rm(path.join(INBOX_DIR, `${id}.json`), { force: true });
  }
}
