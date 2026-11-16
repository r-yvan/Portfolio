import { z } from "zod";

/**
 * Content schema — the single source of truth for everything the admin
 * portal can edit and the public site renders. Validation runs on every
 * save (server actions) and on every read (so a hand-edited or outdated
 * JSON file can never crash the site; bad sections fall back to defaults).
 */

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !!url.hostname;
  } catch {
    return false;
  }
}

export function isValidTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const text = (max: number) => z.string().trim().max(max, `Keep it under ${max} characters`);
const required = (max: number, label = "This field") =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `Keep it under ${max} characters`);

const id = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes");

const httpUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(isHttpUrl, "Enter a full URL starting with https://");

const optionalHttpUrl = z.union([z.literal(""), httpUrl]).default("");

/** Uploaded image (/uploads/…) or any http(s) image URL. */
const imageSrc = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (v) => v === "" || /^\/uploads\/[\w.-]+$/.test(v) || isHttpUrl(v),
    "Use an uploaded image or a full https:// image URL",
  )
  .default("");

/** Social / contact link: https, mailto: or tel:. */
const linkUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (v) => isHttpUrl(v) || /^mailto:\S+@\S+$/i.test(v) || /^tel:[+\d\s().-]+$/i.test(v),
    "Use an https://, mailto: or tel: link",
  );

/* ------------------------------------------------------------------ */

export const ProjectSchema = z.object({
  id,
  title: required(80, "Title"),
  summary: text(320).default(""),
  category: required(32, "Category").default("Web"),
  tags: z.array(required(32, "Tag")).max(12, "Up to 12 tags").default([]),
  year: text(16).default(""),
  role: text(80).default(""),
  image: imageSrc,
  imageAlt: text(200).default(""),
  liveUrl: optionalHttpUrl,
  repoUrl: optionalHttpUrl,
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
});

export const ProfileSchema = z.object({
  firstName: required(40, "First name"),
  lastName: required(40, "Last name"),
  fullName: required(80, "Full name"),
  displayName: required(60, "Display name"),
  initials: required(4, "Initials"),
  title: required(80, "Title"),
  roles: z.array(required(48, "Role")).min(1, "Add at least one role").max(8),
  headline: required(160, "Headline"),
  tagline: required(260, "Tagline"),
  bio: z.array(required(900, "Paragraph")).min(1, "Add at least one paragraph").max(6),
  location: required(80, "Location"),
  /** Neighbourhood shown on the About map, e.g. "Gikondo, Kicukiro". */
  area: text(80).default(""),
  timezone: required(64, "Time zone").refine(isValidTimeZone, "Unknown IANA time zone"),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  email: z.string().trim().email("Enter a valid email"),
  phone: text(32).default(""),
  available: z.boolean().default(true),
  availability: text(60).default("Available for work"),
  githubUser: z
    .string()
    .trim()
    .max(39)
    .regex(/^[a-zA-Z0-9-]*$/, "Letters, numbers and dashes only")
    .default(""),
  resumeUrl: optionalHttpUrl,
});

export const SocialSchema = z.object({
  id,
  label: required(24, "Label"),
  handle: text(80).default(""),
  url: linkUrl,
});

export const StatSchema = z.object({
  label: required(32, "Label"),
  value: z.number().int().min(0).max(1_000_000),
  suffix: text(4).default(""),
});

export const PrincipleSchema = z.object({
  label: required(40, "Label"),
  title: required(90, "Statement"),
  body: required(320, "Body"),
});

export const SkillSchema = z.object({
  name: required(32, "Skill name"),
  slug: z
    .string()
    .trim()
    .max(48)
    .regex(/^[a-z0-9.-]*$/, "Lowercase simpleicons slug, e.g. nextdotjs")
    .default(""),
});

export const SkillGroupSchema = z.object({
  id,
  name: required(32, "Group name"),
  blurb: text(220).default(""),
  skills: z.array(SkillSchema).max(30),
});

export const MilestoneSchema = z.object({
  id,
  year: required(12, "Year"),
  title: required(80, "Title"),
  subtitle: text(80).default(""),
  description: text(600).default(""),
  tags: z.array(required(24, "Tag")).max(8).default([]),
  current: z.boolean().default(false),
});

export const TestimonialSchema = z.object({
  id,
  quote: required(600, "Quote"),
  name: required(60, "Name"),
  role: text(60).default(""),
  company: text(60).default(""),
});

export const SettingsSchema = z.object({
  showJourney: z.boolean().default(true),
  showTestimonials: z.boolean().default(true),
});

export const ContentSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string(),
  profile: ProfileSchema,
  socials: z.array(SocialSchema).max(10),
  stats: z.array(StatSchema).max(4),
  principles: z.array(PrincipleSchema).min(1).max(4),
  skillGroups: z.array(SkillGroupSchema).max(8),
  projects: z.array(ProjectSchema).max(80),
  milestones: z.array(MilestoneSchema).max(24),
  testimonials: z.array(TestimonialSchema).max(24),
  settings: SettingsSchema,
});

export type Project = z.infer<typeof ProjectSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Social = z.infer<typeof SocialSchema>;
export type Stat = z.infer<typeof StatSchema>;
export type Principle = z.infer<typeof PrincipleSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type Content = z.infer<typeof ContentSchema>;

/** Flatten zod issues to { "path.to.field": "message" } for form display. */
export function issuesToFieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Turn a title into a URL-safe id. */
export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "item"
  );
}

/** Make `base` unique against `taken` by appending -2, -3, … */
export function uniqueId(base: string, taken: Iterable<string>) {
  const set = new Set(taken);
  const root = slugify(base);
  if (!set.has(root)) return root;
  let n = 2;
  while (set.has(`${root}-${n}`)) n++;
  return `${root}-${n}`;
}
