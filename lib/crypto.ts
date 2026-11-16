import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * AES-256-GCM sealing for contact-form messages. Messages hold visitors'
 * emails, so they're encrypted at rest with a key derived from ADMIN_SECRET
 * — even if a storage URL leaked, the payload is unreadable without it.
 */
function key() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 32) return null;
  return createHash("sha256").update(`inbox:v1:${secret}`).digest();
}

export function canSeal() {
  return key() !== null;
}

export function seal(value: unknown): string {
  const k = key();
  if (!k) throw new Error("ADMIN_SECRET is not configured.");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["v1", iv, tag, data].map((p) => (typeof p === "string" ? p : p.toString("base64url"))).join(".");
}

export function unseal<T = unknown>(payload: string): T | null {
  const k = key();
  if (!k) return null;
  const [version, iv, tag, data] = payload.split(".");
  if (version !== "v1" || !iv || !tag || !data) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", k, Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    const plain = Buffer.concat([decipher.update(Buffer.from(data, "base64url")), decipher.final()]);
    return JSON.parse(plain.toString("utf8")) as T;
  } catch {
    return null;
  }
}
