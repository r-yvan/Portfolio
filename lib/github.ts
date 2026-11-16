import "server-only";
import type { Project } from "@/lib/content/schema";
import { isHttpUrl, slugify } from "@/lib/content/schema";

export type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  updated_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
};

const WEB = ["JavaScript", "TypeScript", "HTML", "CSS", "Vue", "Svelte", "PHP"];
const MOBILE_HINTS = ["react-native", "expo", "flutter", "android", "ios", "mobile"];
const VISION_HINTS = ["opencv", "vision", "ml", "ai", "detection", "recognition"];

function categorize(repo: GitHubRepo) {
  const hay = [...(repo.topics ?? []), repo.name.toLowerCase(), (repo.description ?? "").toLowerCase()].join(" ");
  if (MOBILE_HINTS.some((h) => hay.includes(h)) || repo.language === "Dart" || repo.language === "Kotlin" || repo.language === "Swift")
    return "Mobile";
  if (VISION_HINTS.some((h) => hay.includes(h)) || repo.language === "Python") return "AI & Vision";
  if (repo.language && WEB.includes(repo.language)) return "Web";
  return "Other";
}

export function repoToProject(repo: GitHubRepo, takenIds: Iterable<string> = []): Project {
  const taken = new Set(takenIds);
  let id = slugify(repo.name);
  for (let n = 2; taken.has(id); n++) id = `${slugify(repo.name)}-${n}`;
  const homepage = repo.homepage?.trim() ?? "";
  return {
    id,
    title: repo.name,
    summary: (repo.description ?? "").slice(0, 320),
    category: categorize(repo),
    tags: [repo.language, ...(repo.topics ?? [])].filter((t): t is string => !!t).slice(0, 5),
    year: repo.created_at.slice(0, 4),
    role: "",
    image: "",
    imageAlt: "",
    liveUrl: homepage && isHttpUrl(homepage) && !homepage.includes("github.com") ? homepage : "",
    repoUrl: repo.html_url,
    featured: false,
    visible: true,
  };
}

/** Public, non-fork, non-archived repos for a user (most recently updated first). */
export async function fetchRepos(user: string): Promise<GitHubRepo[]> {
  if (!user) return [];
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-cms",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`, {
    headers,
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}${res.status === 403 ? " (rate limited — set GITHUB_TOKEN)" : ""}.`);
  const repos = (await res.json()) as GitHubRepo[];
  if (!Array.isArray(repos)) return [];
  return repos.filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== user.toLowerCase());
}

/** Fallback list for the public site when no curated projects exist. */
export async function githubFallbackProjects(user: string): Promise<Project[]> {
  try {
    const repos = await fetchRepos(user);
    const ids: string[] = [];
    return repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.updated_at) - +new Date(a.updated_at))
      .slice(0, 12)
      .map((r) => {
        const p = repoToProject(r, ids);
        ids.push(p.id);
        return p;
      });
  } catch {
    return [];
  }
}
