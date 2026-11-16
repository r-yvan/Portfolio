import Link from "next/link";
import { ArrowUpRight, CircleAlert, CircleCheck, FolderPlus, ImageIcon, Inbox, UserRound } from "lucide-react";
import { PageHeader } from "@/components/admin/SaveBar";
import { requireAdmin } from "@/lib/auth/guard";
import { authConfig } from "@/lib/auth/session";
import { getContent } from "@/lib/content";
import { defaultContent } from "@/lib/content/defaults";
import { readInbox } from "@/lib/content/inbox";
import { storageKind } from "@/lib/content/storage";

export const dynamic = "force-dynamic";

function relative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d} d ago` : new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function OverviewPage() {
  await requireAdmin();
  const [content, messages] = await Promise.all([getContent(), readInbox(5).catch(() => [])]);
  const kind = storageKind();
  const { projects } = content;
  const visible = projects.filter((p) => p.visible);
  const noImage = visible.filter((p) => !p.image);
  const noLinks = visible.filter((p) => !p.liveUrl && !p.repoUrl);
  const placeholderIds = new Set(defaultContent.testimonials.map((t) => t.id));
  const placeholders =
    content.settings.showTestimonials && content.testimonials.some((t) => placeholderIds.has(t.id));

  const todos = [
    kind === "readonly" && {
      text: "This deployment can't save edits yet — connect a Vercel Blob store.",
      href: "/admin/settings",
    },
    noImage.length > 0 && {
      text: `${noImage.length} project${noImage.length > 1 ? "s use" : " uses"} a generated cover — upload or capture a screenshot.`,
      href: "/admin/projects",
    },
    noLinks.length > 0 && { text: `${noLinks.length} visible project(s) have no links.`, href: "/admin/projects" },
    placeholders && {
      text: "The testimonials are still the placeholder quotes — replace them or hide the section.",
      href: "/admin/testimonials",
    },
    !process.env.ADMIN_SECRET && { text: "ADMIN_SECRET is missing.", href: "/admin/settings" },
  ].filter(Boolean) as { text: string; href: string }[];

  const tiles = [
    { label: "Visible projects", value: `${visible.length}`, sub: `${projects.length} total` },
    { label: "Featured", value: `${projects.filter((p) => p.featured).length}`, sub: "shown large" },
    { label: "Messages", value: `${messages.length}${messages.length >= 5 ? "+" : ""}`, sub: "in your inbox" },
    { label: "Last saved", value: relative(content.updatedAt), sub: kind === "blob" ? "Vercel Blob" : kind === "local" ? "content/portfolio.json" : "bundled file" },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${content.profile.firstName}.`}
        description="Everything on your portfolio is editable from here. Changes go live as soon as you save."
        actions={
          <>
            <Link href="/admin/projects/new" className="btn btn-primary btn-sm">
              <FolderPlus size={14} />
              <span>New project</span>
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              <span>View site</span>
              <ArrowUpRight size={13} />
            </a>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-px border border-fg/10 bg-fg/10 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="bg-surface p-5">
            <div className="label">{t.label}</div>
            <div className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">{t.value}</div>
            <div className="mt-1 truncate text-xs text-subtle">{t.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="border border-fg/10 bg-surface">
          <header className="flex items-center justify-between border-b border-fg/10 px-5 py-4">
            <h2 className="font-medium">To do</h2>
            <span className="label">{todos.length ? `${todos.length} open` : "All clear"}</span>
          </header>
          {todos.length ? (
            <ul className="divide-y divide-fg/10">
              {todos.map((t) => (
                <li key={t.text}>
                  <Link href={t.href} className="group flex items-start gap-3 px-5 py-4 text-sm transition-colors hover:bg-fg/[0.03]">
                    <CircleAlert size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span className="flex-1 leading-relaxed">{t.text}</span>
                    <ArrowUpRight size={14} className="mt-0.5 text-subtle group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-3 px-5 py-6 text-sm text-muted">
              <CircleCheck size={16} className="text-fg" /> Your portfolio is in great shape.
            </p>
          )}
        </section>

        <section className="border border-fg/10 bg-surface">
          <header className="flex items-center justify-between border-b border-fg/10 px-5 py-4">
            <h2 className="font-medium">Latest messages</h2>
            <Link href="/admin/inbox" className="label hover:text-accent">
              Open inbox →
            </Link>
          </header>
          {messages.length ? (
            <ul className="divide-y divide-fg/10">
              {messages.slice(0, 4).map((m) => (
                <li key={m.id} className="px-5 py-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-medium">{m.name}</span>
                    <span className="label shrink-0">{relative(m.receivedAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted">{m.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-3 px-5 py-6 text-sm text-muted">
              <Inbox size={16} /> No messages yet.
            </p>
          )}
        </section>
      </div>

      <div className="mt-8 grid gap-px border border-fg/10 bg-fg/10 sm:grid-cols-3">
        {[
          { href: "/admin/projects", icon: ImageIcon, title: "Projects & images", body: "Add work, upload images, capture screenshots, check links." },
          { href: "/admin/profile", icon: UserRound, title: "Profile & hero", body: "Headline, bio, roles, contact details, socials and stats." },
          { href: "/admin/settings", icon: CircleCheck, title: "Backups & history", body: `Export, restore and roll back. Auth ${authConfig().configured ? "configured" : "NOT configured"}.` },
        ].map(({ href, icon: Icon, title, body }) => (
          <Link key={href} href={href} className="group bg-surface p-5 transition-colors hover:bg-canvas">
            <Icon size={18} className="text-accent" strokeWidth={1.7} />
            <h3 className="mt-4 font-medium">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
