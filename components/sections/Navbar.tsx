"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { NavItem } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar({ items, initials }: { items: NavItem[]; initials: string }) {
  const scrollTo = useScrollTo();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(items[0]?.href ?? "#home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = items
      .map((n) => document.querySelector(n.href))
      .filter((el): el is Element => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[60] px-4 pt-4 md:px-6"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 border pl-2 pr-2 transition-all duration-500",
            scrolled
              ? "border-fg/10 bg-canvas/75 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <button
            onClick={() => go("#home")}
            className="group flex items-center gap-3 pl-1"
            aria-label="Back to top"
          >
            <span className="relative flex h-9 w-9 items-center justify-center border border-fg/20 text-[0.8rem] font-bold tracking-tight transition-colors group-hover:border-accent">
              {initials}
              <span className="absolute -right-[3px] -top-[3px] h-1.5 w-1.5 bg-accent" />
            </span>
          </button>

          <ul className="hidden items-center md:flex">
            {items.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => go(item.href)}
                    className={cn(
                      "relative px-3.5 py-2 text-[0.82rem] font-medium transition-colors",
                      isActive ? "text-fg" : "text-subtle hover:text-fg",
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-x-3.5 -bottom-[1px] h-[2px] bg-accent"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => go("#contact")} className="btn btn-primary btn-sm hidden md:inline-flex">
              <span>Let&apos;s talk</span>
              <ArrowUpRight size={14} />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center border border-fg/15 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-canvas px-6 pb-10 pt-28 md:hidden"
          >
            <ul className="space-y-1">
              {items.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}
                >
                  <button
                    onClick={() => go(item.href)}
                    className="flex w-full items-baseline gap-4 border-b border-fg/10 py-4 text-left text-4xl font-medium tracking-tight"
                  >
                    <span className="label text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <button onClick={() => go("#contact")} className="btn btn-primary w-full">
              <span>Let&apos;s talk</span>
              <ArrowUpRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
