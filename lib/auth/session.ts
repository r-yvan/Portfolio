/**
 * Single-user admin sessions — Web Crypto only, so this file runs in the
 * Edge middleware and in Node route handlers / server actions alike.
 *
 * Token: base64url(payload) "." base64url(HMAC-SHA256(ADMIN_SECRET, payload))
 * The payload carries a fingerprint of ADMIN_PASSWORD, so changing the
 * password (or ADMIN_SECRET) instantly signs out every existing session.
 */
export const SESSION_COOKIE = "ry_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();
const decoder = new TextDecoder();

type SessionPayload = { sub: "admin"; iat: number; exp: number; pv: string };

export function authConfig() {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SECRET ?? "";
  return {
    password,
    secret,
    configured: password.length >= 8 && secret.length >= 32,
  };
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

async function sha256(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

/** Constant-time comparison of two byte arrays. */
function bytesEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function passwordFingerprint(password: string, secret: string) {
  return toBase64Url((await hmac(secret, `pw-fingerprint:${password}`)).slice(0, 12));
}

export async function checkPassword(input: string) {
  const { password, configured } = authConfig();
  if (!configured) return false;
  // Hash both sides so the comparison is constant-time regardless of length.
  return bytesEqual(await sha256(input), await sha256(password));
}

export async function createSessionToken() {
  const { password, secret, configured } = authConfig();
  if (!configured) throw new Error("Admin auth is not configured.");
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: "admin",
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    pv: await passwordFingerprint(password, secret),
  };
  const data = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = toBase64Url(await hmac(secret, `session:${data}`));
  return `${data}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  const { password, secret, configured } = authConfig();
  if (!configured || !token) return false;
  const [data, signature, extra] = token.split(".");
  if (!data || !signature || extra !== undefined) return false;
  try {
    const expected = await hmac(secret, `session:${data}`);
    if (!bytesEqual(expected, fromBase64Url(signature))) return false;
    const payload = JSON.parse(decoder.decode(fromBase64Url(data))) as Partial<SessionPayload>;
    if (payload.sub !== "admin" || typeof payload.exp !== "number") return false;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return false;
    return payload.pv === (await passwordFingerprint(password, secret));
  } catch {
    return false;
  }
}

/** Only allow redirects back into the admin (no open redirects). */
export function safeAdminPath(next: string | null | undefined) {
  if (!next || !next.startsWith("/admin") || next.startsWith("//") || next.includes("\\")) {
    return "/admin";
  }
  return next.startsWith("/admin/login") ? "/admin" : next;
}
