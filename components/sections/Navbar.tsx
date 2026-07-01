"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems } from "@/lib/site";
import { useLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

export function Navbar() {
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((n) => document.querySelector(n.href))
      .filter((el): el is Element => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-4">
        <nav
          className={cn(
            "flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border px-3 py-2.5 transition-all duration-500",
            scrolled
              ? "glass-strong border-white/10 shadow-glow-sm"
              : "border-white/5 bg-white/[0.02] backdrop-blur-md",
          )}
        >
          <button
            onClick={() => go("#home")}
            className="group flex items-center gap-2 pl-2 text-sm font-semibold tracking-tight text-white"
          >
            <span className="font-display text-base">RY</span>
            <span className="h-1.5 w-1.5 rounded-full bg-iris-500 shadow-glow-sm transition group-hover:scale-150" />
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => go(item.href)}
                  className={cn(
                    "group relative px-3 py-1.5 text-sm transition-colors",
                    active === item.href
                      ? "text-white"
                      : "text-ash-400 hover:text-white",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px origin-center bg-iris-400 transition-transform duration-300",
                      active === item.href
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => go("#contact")}
            className="hidden rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink-950 transition-colors hover:bg-iris-300 md:block"
          >
            Let&apos;s talk
          </button>

          <button
            className="p-2 text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.href}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => go(item.href)}
                className="font-display text-4xl font-medium text-ash-100 transition-colors hover:text-iris-400"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
