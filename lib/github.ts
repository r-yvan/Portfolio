import { site } from "@/lib/site";

export type ProjectCategory = "Web" | "Tool" | "Experiment" | "Other";

export type Project = {
  id: number;
  name: string;
  title: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  category: ProjectCategory;
  featured: boolean;
  image: string | null;
};

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

const WEB_LANGS = ["JavaScript", "TypeScript", "HTML", "CSS", "Vue", "Svelte"];

function prettify(name: string) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bApi\b/g, "API")
    .replace(/\bUi\b/g, "UI")
    .replace(/\b3d\b/gi, "3D");
}

function categorize(repo: GitHubRepo): ProjectCategory {
  const topics = repo.topics ?? [];
  const has = (...t: string[]) => t.some((x) => topics.includes(x));
  if (has("experiment", "demo", "3d", "shader", "generative", "webgl"))
    return "Experiment";
  if (has("cli", "tool", "library", "package", "npm")) return "Tool";
  if (
    has("website", "portfolio", "web", "nextjs", "react", "webapp", "app") ||
    (repo.language && WEB_LANGS.includes(repo.language))
  )
    return "Web";
  return "Other";
}

/** Curated fallback so the section never renders empty (offline / rate-limited). */
const FALLBACK: Project[] = [
  {
    id: 1,
    name: "portfolio",
    title: "Portfolio",
    description:
      "This site — a Three.js-driven personal portfolio with a custom motion system, built in Next.js.",
    url: `https://github.com/${site.githubUser}`,
    homepage: null,
    language: "TypeScript",
    topics: ["nextjs", "threejs", "framer-motion"],
    stars: 0,
    forks: 0,
    updatedAt: new Date().toISOString(),
    category: "Web",
    featured: true,
    image: null,
  },
];

/**
 * Fetches public repos from GitHub, transforms + ranks them for display.
 * Server-side with ISR caching; set GITHUB_TOKEN to raise the rate limit.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${site.githubUser}/repos?per_page=100&sort=updated`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) return FALLBACK;

    const repos = (await res.json()) as GitHubRepo[];
    if (!Array.isArray(repos)) return FALLBACK;

    const projects = repos
      .filter((r) => !r.fork && !r.archived && r.name !== site.githubUser)
      .map<Project>((r) => ({
        id: r.id,
        name: r.name,
        title: prettify(r.name),
        description: r.description ?? "No description provided.",
        url: r.html_url,
        homepage: r.homepage && r.homepage.trim() ? r.homepage : null,
        language: r.language,
        topics: r.topics ?? [],
        stars: r.stargazers_count,
        forks: r.forks_count,
        updatedAt: r.updated_at,
        category: categorize(r),
        featured: false,
        image: null,
      }))
      .sort(
        (a, b) =>
          b.stars - a.stars ||
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

    if (!projects.length) return FALLBACK;
    // Mark the strongest few as featured for emphasis.
    projects.slice(0, 2).forEach((p) => (p.featured = true));
    return projects.slice(0, 12);
  } catch {
    return FALLBACK;
  }
}
