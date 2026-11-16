#!/usr/bin/env node
/**
 * Builds the street-map data used by the About section's 3D map.
 *
 *   node scripts/build-map.mjs [lat] [lng] [radiusMetres] [out]
 *   node scripts/build-map.mjs -1.9697 30.0768 1800 public/map/home.json
 *
 * Streets come from OpenStreetMap via the Overpass API (data © OpenStreetMap
 * contributors, ODbL — the map shows the required attribution). Ways are
 * projected to local metres around the centre, simplified, and split into
 * "major" and "minor" polylines so the client only downloads what it draws.
 */
import fs from "node:fs";
import path from "node:path";

const [lat0 = -1.9697, lng0 = 30.0768, radius = 1800, out = "public/map/home.json"] = process.argv.slice(2);
const LAT0 = Number(lat0);
const LNG0 = Number(lng0);
const R = Number(radius);

const MAJOR = new Set([
  "motorway", "trunk", "primary", "secondary", "tertiary",
  "motorway_link", "trunk_link", "primary_link", "secondary_link", "tertiary_link",
]);
const MINOR = new Set(["unclassified", "residential", "living_street", "road"]);

const M_PER_DEG_LAT = 110_574;
const M_PER_DEG_LNG = 111_320 * Math.cos((LAT0 * Math.PI) / 180);
const dLat = (R * 1.15) / M_PER_DEG_LAT;
const dLng = (R * 1.15) / M_PER_DEG_LNG;
const bbox = [LAT0 - dLat, LNG0 - dLng, LAT0 + dLat, LNG0 + dLng].map((v) => v.toFixed(5)).join(",");

const query = `[out:json][timeout:90];
way["highway"~"^(${[...MAJOR, ...MINOR].join("|")})$"](${bbox});
out geom tags;`;

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

async function fetchOverpass() {
  let wait = 4000;
  for (let attempt = 0; attempt < 8; attempt++) {
    const endpoint = ENDPOINTS[attempt % ENDPOINTS.length];
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "portfolio-map-builder/1.0" },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(120_000),
      });
      const text = await res.text();
      if (res.ok && text.startsWith("{")) return JSON.parse(text);
      console.warn(`  ${endpoint} → ${res.status}, retrying in ${wait / 1000}s`);
    } catch (error) {
      console.warn(`  ${endpoint} → ${error.message}, retrying in ${wait / 1000}s`);
    }
    await new Promise((r) => setTimeout(r, wait));
    wait = Math.min(wait * 2, 60_000);
  }
  throw new Error("Overpass is unavailable — try again later.");
}

const project = (lat, lng) => [(lng - LNG0) * M_PER_DEG_LNG, (lat - LAT0) * M_PER_DEG_LAT];

/** Ramer–Douglas–Peucker on [x, y] points. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const sq = tolerance * tolerance;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = dx * dx + dy * dy || 1;
    let max = 0;
    let index = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len));
      const ex = ax + t * dx - px;
      const ey = ay + t * dy - py;
      const d = ex * ex + ey * ey;
      if (d > max) {
        max = d;
        index = i;
      }
    }
    if (max > sq && index > 0) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

/** Split a polyline into runs that stay inside the square (with margin). */
function clip(points, half) {
  const inside = ([x, y]) => Math.abs(x) <= half && Math.abs(y) <= half;
  const runs = [];
  let run = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (inside(p) || (run.length && inside(points[i - 1]))) run.push(p);
    else if (i + 1 < points.length && inside(points[i + 1])) run.push(p);
    else if (run.length) {
      if (run.length > 1) runs.push(run);
      run = [];
    }
  }
  if (run.length > 1) runs.push(run);
  return runs;
}

console.log(`Fetching streets within ${R} m of ${LAT0}, ${LNG0}…`);
const data = await fetchOverpass();
const major = [];
const minor = [];
for (const el of data.elements) {
  if (el.type !== "way" || !el.geometry?.length) continue;
  const kind = el.tags?.highway;
  const target = MAJOR.has(kind) ? major : MINOR.has(kind) ? minor : null;
  if (!target) continue;
  const pts = simplify(el.geometry.map((g) => project(g.lat, g.lon)), MAJOR.has(kind) ? 2 : 3.5);
  for (const run of clip(pts, R)) target.push(run.flatMap(([x, y]) => [Math.round(x), Math.round(y)]));
}

const payload = {
  center: [LAT0, LNG0],
  radius: R,
  attribution: "© OpenStreetMap contributors",
  generated: new Date().toISOString().slice(0, 10),
  major,
  minor,
};
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(payload));
const points = [...major, ...minor].reduce((n, l) => n + l.length / 2, 0);
console.log(`Wrote ${out}: ${major.length} major + ${minor.length} minor lines, ${points} points, ${(fs.statSync(out).size / 1024).toFixed(1)} KB`);
