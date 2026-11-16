"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Cpu,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu,
  Quote,
  Route,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { logout } from "@/app/admin/login/actions";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { StorageKind } from "@/lib/content/storage";
import { cn } from "@/lib/utils";
import { Toaster } from "./toast";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/approach", label: "Approach", icon: LayoutTemplate },
  { href: "/admin/skills", label: "Skills", icon: Cpu },
  { href: "/admin/journey", label: "Journey", icon: Route },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const STORAGE_LABEL: Record<StorageKind, { label: string; tone: string }> = {
  local: { label: "Local files", tone: "bg-fg" },
  blob: { label: "Vercel Blob", tone: "bg-fg" },
  readonly: { label: "Read-only", tone: "bg-accent" },
};

export function AdminShell({
  children,
  initials,
  storage,
  inboxCount,
}: {
  children: React.ReactNode;
  initials: string;
  storage: StorageKind;
  inboxCount: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const store = STORAGE_LABEL[storage];

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-fg/10 px-5">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="relative flex h-8 w-8 items-center justify-center border border-fg/20 text-[0.72rem] font-bold">
            {initials}
            <span className="absolute -right-[3px] -top-[3px] h-1.5 w-1.5 bg-accent" />
          </span>
          <span className="label text-fg">Admin</span>
        </Link>
        <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-fg/[0.06] text-fg" : "text-muted hover:bg-fg/[0.03] hover:text-fg",
                  )}
                >
                  {active && <motion.span layoutId="admin-nav" className="absolute inset-y-0 left-0 w-[2px] bg-accent" />}
                  <Icon size={16} strokeWidth={1.7} className={active ? "text-accent" : ""} />
                  <span className="flex-1">{label}</span>
                  {href === "/admin/inbox" && inboxCount > 0 ? (
                    <span className="min-w-[1.25rem] bg-accent px-1.5 py-0.5 text-center text-[0.62rem] font-bold text-accent-fg tabular">
                      {inboxCount > 99 ? "99+" : inboxCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-3 border-t border-fg/10 p-4">
        <div className="label flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5", store.tone)} /> Storage: {store.label}
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm flex-1">
            <span>View site</span>
            <ArrowUpRight size={13} />
          </a>
          <form action={logout}>
            <button type="submit" className="flex h-10 w-10 items-center justify-center border border-fg/15 text-subtle transition-colors hover:border-accent hover:text-accent" aria-label="Sign out" title="Sign out">
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-fg/10 bg-canvas md:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-fg/10 bg-canvas/90 px-4 backdrop-blur-xl md:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex h-9 w-9 items-center justify-center border border-fg/15">
          <Menu size={17} />
        </button>
        <span className="label text-fg">{initials} — Admin</span>
        <ThemeToggle className="h-9 w-9" />
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-fg/10 bg-canvas md:hidden"
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-10 md:py-12">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
