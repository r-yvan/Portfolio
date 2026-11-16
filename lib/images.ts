import "server-only";
import { randomBytes } from "node:crypto";
import { slugify } from "@/lib/content/schema";
import { storeImage } from "@/lib/content/storage";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

type ImageType = { mime: string; ext: string };

/** Identify an image by its magic bytes (never trust the declared type). */
export function sniffImage(buf: Buffer): ImageType | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return { mime: "image/png", ext: "png" };
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return { mime: "image/webp", ext: "webp" };
  if (buf.toString("ascii", 0, 6) === "GIF87a" || buf.toString("ascii", 0, 6) === "GIF89a")
    return { mime: "image/gif", ext: "gif" };
  const brand = buf.toString("ascii", 4, 12);
  if (brand === "ftypavif" || brand === "ftypavis") return { mime: "image/avif", ext: "avif" };
  return null;
}

/** Validate + store an image buffer under a readable, collision-free name. */
export async function saveImageBuffer(buf: Buffer, baseName: string) {
  if (buf.length > MAX_IMAGE_BYTES) throw new Error("Images must be 8 MB or smaller.");
  const type = sniffImage(buf);
  if (!type) throw new Error("Unsupported image. Use JPG, PNG, WebP, AVIF or GIF.");
  const name = `${slugify(baseName).slice(0, 40) || "image"}-${randomBytes(4).toString("hex")}.${type.ext}`;
  return storeImage(name, buf, type.mime);
}

const PRIVATE_HOST =
  /^(localhost|.*\.local|.*\.internal|0\.0\.0\.0|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+|\[?::1\]?|\[?f[cd][0-9a-f]{2}:.*)$/i;

export function isPublicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !PRIVATE_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

/** Download a remote image (with size + type checks) into storage. */
export async function importRemoteImage(url: string, baseName: string) {
  if (!isPublicHttpUrl(url)) throw new Error("That image URL isn't reachable from the server.");
  const res = await fetch(url, {
    signal: AbortSignal.timeout(20_000),
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (portfolio-cms)" },
  });
  if (!res.ok) throw new Error(`Image download failed (${res.status}).`);
  const declared = Number(res.headers.get("content-length") ?? 0);
  if (declared > MAX_IMAGE_BYTES) throw new Error("That image is larger than 8 MB.");
  const buf = Buffer.from(await res.arrayBuffer());
  return saveImageBuffer(buf, baseName);
}
