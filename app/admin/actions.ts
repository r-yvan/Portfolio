"use server";

import { z } from "zod";
import { UnauthorizedError, assertAdmin } from "@/lib/auth/guard";
import { mutateContent, replaceContent, restoreVersion, revalidateInbox } from "@/lib/content";
import { deleteMessage, removeImage, StorageError } from "@/lib/content/storage";
import {
  ContentSchema,
  MilestoneSchema,
  PrincipleSchema,
  ProfileSchema,
  ProjectSchema,
  SkillGroupSchema,
  SocialSchema,
  StatSchema,
  TestimonialSchema,
  issuesToFieldErrors,
  uniqueId,
  type Project,
} from "@/lib/content/schema";
import { fetchRepos, repoToProject } from "@/lib/github";
import { importRemoteImage, isPublicHttpUrl } from "@/lib/images";
import type { ActionResult, LinkStatus, RepoCandidate } from "@/lib/admin-types";

/* ------------------------------------------------------------------ */
/* Plumbing                                                            */
/* ------------------------------------------------------------------ */

class FormError extends Error {
  constructor(public fieldErrors: Record<string, string>) {
    super("Please fix the highlighted fields.");
  }
}

function parse<S extends z.ZodType>(schema: S, value: unknown, prefix = ""): z.output<S> {
  const result = schema.safeParse(value);
  if (!result.success) {
    const errors = issuesToFieldErrors(result.error);
    throw new FormError(
      Object.fromEntries(Object.entries(errors).map(([k, v]) => [prefix ? `${prefix}.${k}` : k, v])),
    );
  }
  return result.data;
}

async function run<T>(fn: () => Promise<T>, message?: string): Promise<ActionResult<T>> {
  try {
    await assertAdmin();
    const data = await fn();
    return { ok: true, message, data };
  } catch (error) {
    if (error instanceof FormError) return { ok: false, error: error.message, fieldErrors: error.fieldErrors };
    if (error instanceof z.ZodError)
      return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: issuesToFieldErrors(error) };
    if (error instanceof StorageError || error instanceof UnauthorizedError)
      return { ok: false, error: error.message };
    if (error instanceof Error && error.name === "UserFacingError") return { ok: false, error: error.message };
    console.error("[admin] action failed", error);
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

function fail(message: string): never {
  const e = new Error(message);
  e.name = "UserFacingError";
  throw e;
}

/** Give list items without ids stable, unique ones derived from a label. */
function withIds<T extends { id?: string }>(items: T[], label: (item: T) => string) {
  const taken: string[] = [];
  return items.map((item) => {
    const base = item.id && /^[a-z0-9-]+$/.test(item.id) && !taken.includes(item.id) ? item.id : label(item);
    const id = uniqueId(base, taken);
    taken.push(id);
    return { ...item, id };
  });
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export async function saveProject(input: unknown, originalId: string | null) {
  return run(async () => {
    const raw = (input ?? {}) as Partial<Project>;
    let savedId = "";
    let replacedImage = "";
    await mutateContent((draft) => {
      const others = draft.projects.filter((p) => p.id !== originalId);
      const id =
        originalId ?? uniqueId(raw.id || raw.title || "project", others.map((p) => p.id));
      const project = parse(ProjectSchema, { ...raw, id });
      const index = originalId ? draft.projects.findIndex((p) => p.id === originalId) : -1;
      if (originalId && index === -1) fail("That project no longer exists — it may have been deleted.");
      if (index >= 0) {
        if (draft.projects[index].image !== project.image) replacedImage = draft.projects[index].image;
        draft.projects[index] = project;
      } else {
        draft.projects.unshift(project);
      }
      savedId = project.id;
    });
    if (replacedImage) await removeImage(replacedImage);
    return { id: savedId };
  }, "Project saved");
}

export async function deleteProject(id: string) {
  return run(async () => {
    let image = "";
    await mutateContent((draft) => {
      const project = draft.projects.find((p) => p.id === id);
      if (!project) fail("That project was already deleted.");
      image = project.image;
      draft.projects = draft.projects.filter((p) => p.id !== id);
    });
    if (image) await removeImage(image);
  }, "Project deleted");
}

export async function reorderProjects(ids: string[]) {
  return run(async () => {
    await mutateContent((draft) => {
      const byId = new Map(draft.projects.map((p) => [p.id, p]));
      const ordered = ids.map((id) => byId.get(id)).filter((p): p is Project => !!p);
      const rest = draft.projects.filter((p) => !ids.includes(p.id));
      draft.projects = [...ordered, ...rest];
    });
  }, "Order saved");
}

export async function setProjectFlag(id: string, flag: "featured" | "visible", value: boolean) {
  return run(async () => {
    await mutateContent((draft) => {
      const project = draft.projects.find((p) => p.id === id);
      if (!project) fail("That project no longer exists.");
      project[flag] = value;
    });
  });
}

export async function listGithubCandidates() {
  return run(async (): Promise<RepoCandidate[]> => {
    const { getContent } = await import("@/lib/content");
    const content = await getContent();
    const user = content.profile.githubUser;
    if (!user) fail("Add your GitHub username in Profile first.");
    const repos = await fetchRepos(user);
    const existing = new Set(content.projects.map((p) => p.repoUrl.toLowerCase().replace(/\/$/, "")));
    return repos.map((r) => ({
      name: r.name,
      description: r.description ?? "",
      url: r.html_url,
      homepage: r.homepage ?? "",
      language: r.language ?? "",
      stars: r.stargazers_count,
      updatedAt: r.updated_at,
      imported: existing.has(r.html_url.toLowerCase()),
    }));
  });
}

export async function importGithubRepos(names: string[]) {
  return run(async () => {
    const { getContent } = await import("@/lib/content");
    const user = (await getContent()).profile.githubUser;
    const repos = (await fetchRepos(user)).filter((r) => names.includes(r.name));
    if (!repos.length) fail("None of the selected repositories were found.");
    let added = 0;
    await mutateContent((draft) => {
      const existing = new Set(draft.projects.map((p) => p.repoUrl.toLowerCase()));
      for (const repo of repos) {
        if (existing.has(repo.html_url.toLowerCase())) continue;
        draft.projects.push(repoToProject(repo, draft.projects.map((p) => p.id)));
        added++;
      }
    });
    return { added };
  }, "Imported from GitHub");
}

/* ------------------------------------------------------------------ */
/* Links + images                                                      */
/* ------------------------------------------------------------------ */

const PROBE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; PortfolioLinkCheck/1.0)",
  Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
};

async function probe(url: string): Promise<LinkStatus> {
  if (!isPublicHttpUrl(url)) return { ok: false, status: 0, error: "Not a public URL" };
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      headers: PROBE_HEADERS,
      signal: AbortSignal.timeout(9000),
    });
    if ([403, 405, 501].includes(res.status)) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        headers: PROBE_HEADERS,
        signal: AbortSignal.timeout(9000),
      });
    }
    return { ok: res.ok, status: res.status };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return { ok: false, status: 0, error: timedOut ? "Timed out" : "Unreachable" };
  }
}

export async function checkLinks(urls: string[]) {
  return run(async () => {
    const unique = [...new Set(urls.filter(Boolean))].slice(0, 60);
    const results: Record<string, LinkStatus> = {};
    // small batches keep it polite and inside function time limits
    for (let i = 0; i < unique.length; i += 8) {
      const batch = unique.slice(i, i + 8);
      const statuses = await Promise.all(batch.map(probe));
      batch.forEach((url, j) => (results[url] = statuses[j]));
    }
    return results;
  });
}

/** Screenshot a live site (via Microlink) and store it in our own storage. */
export async function captureScreenshot(url: string, title: string) {
  return run(async () => {
    if (!isPublicHttpUrl(url)) fail("Add a valid, public live URL first.");
    const key = process.env.MICROLINK_API_KEY;
    const api = new URL(key ? "https://pro.microlink.io/" : "https://api.microlink.io/");
    api.searchParams.set("url", url);
    api.searchParams.set("screenshot", "true");
    api.searchParams.set("meta", "false");
    const res = await fetch(api, {
      cache: "no-store",
      headers: key ? { "x-api-key": key } : undefined,
      signal: AbortSignal.timeout(45_000),
    });
    const json = (await res.json().catch(() => null)) as
      | { status?: string; message?: string; data?: { screenshot?: { url?: string } } }
      | null;
    const shot = json?.data?.screenshot?.url;
    if (!res.ok || json?.status !== "success" || !shot) {
      fail(json?.message || `Screenshot service responded ${res.status}. Try again in a minute.`);
    }
    return { url: await importRemoteImage(shot, `${title || "project"}-screenshot`) };
  }, "Screenshot captured");
}

export async function importImageFromUrl(url: string, title: string) {
  return run(async () => ({ url: await importRemoteImage(url, title || "image") }), "Image saved");
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

export async function saveProfile(input: { profile: unknown; socials: unknown; stats: unknown }) {
  return run(async () => {
    const profile = parse(ProfileSchema, input.profile, "profile");
    const socials = parse(
      z.array(SocialSchema).max(10),
      withIds((input.socials as { id?: string; label?: string }[]) ?? [], (s) => s.label || "link"),
      "socials",
    );
    const stats = parse(z.array(StatSchema).max(4), input.stats, "stats");
    await mutateContent((draft) => {
      draft.profile = profile;
      draft.socials = socials;
      draft.stats = stats;
    });
  }, "Profile saved");
}

export async function savePrinciples(input: unknown) {
  return run(async () => {
    const principles = parse(z.array(PrincipleSchema).min(1, "Keep at least one").max(4), input, "principles");
    await mutateContent((draft) => {
      draft.principles = principles;
    });
  }, "Approach saved");
}

export async function saveSkills(input: unknown) {
  return run(async () => {
    const groups = parse(
      z.array(SkillGroupSchema).max(8),
      withIds((input as { id?: string; name?: string }[]) ?? [], (g) => g.name || "group"),
      "groups",
    );
    await mutateContent((draft) => {
      draft.skillGroups = groups;
    });
  }, "Skills saved");
}

export async function saveJourney(input: { milestones: unknown; show: boolean }) {
  return run(async () => {
    const milestones = parse(
      z.array(MilestoneSchema).max(24),
      withIds((input.milestones as { id?: string; title?: string }[]) ?? [], (m) => m.title || "milestone"),
      "milestones",
    );
    await mutateContent((draft) => {
      draft.milestones = milestones;
      draft.settings.showJourney = Boolean(input.show);
    });
  }, "Journey saved");
}

export async function saveTestimonials(input: { testimonials: unknown; show: boolean }) {
  return run(async () => {
    const testimonials = parse(
      z.array(TestimonialSchema).max(24),
      withIds((input.testimonials as { id?: string; name?: string }[]) ?? [], (t) => t.name || "testimonial"),
      "testimonials",
    );
    await mutateContent((draft) => {
      draft.testimonials = testimonials;
      draft.settings.showTestimonials = Boolean(input.show);
    });
  }, "Testimonials saved");
}

/* ------------------------------------------------------------------ */
/* Inbox, history, backups                                             */
/* ------------------------------------------------------------------ */

export async function deleteInboxMessage(id: string) {
  return run(async () => {
    await deleteMessage(id);
    revalidateInbox();
  }, "Message deleted");
}

export async function restoreContentVersion(id: string) {
  return run(async () => {
    await restoreVersion(id);
  }, "Version restored");
}

export async function importContentBackup(json: string) {
  return run(async () => {
    let raw: unknown;
    try {
      raw = JSON.parse(json);
    } catch {
      fail("That file isn't valid JSON.");
    }
    const parsed = ContentSchema.safeParse({ ...(raw as object), version: 1, updatedAt: new Date().toISOString() });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      fail(`Backup is invalid at "${first?.path.join(".")}": ${first?.message}`);
    }
    await replaceContent(parsed.data);
  }, "Backup restored");
}
