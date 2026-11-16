/**
 * Minimal in-memory sliding-window limiter. On serverless each instance has
 * its own memory, so this is a speed bump (not a wall) — paired with a strong
 * admin password and an artificial delay on failed logins.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  const allowed = hits.length < limit;
  if (allowed) hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    // keep memory bounded
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return allowed;
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
