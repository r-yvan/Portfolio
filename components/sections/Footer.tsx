"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { navItems, site } from "@/lib/site";

function useKigaliTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Africa/Kigali",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Footer() {
  const lenis = useLenis();
  const time = useKigaliTime();
  const year = new Date().getFullYear();

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/10 px-6 py-16 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Top — invitation + back to top */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="section-label mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-iris-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-iris-400" />
              </span>
              Available for work
            </div>
            <h2 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] font-medium leading-[0.95] tracking-tight text-white">
              Let&apos;s create
              <br />
              something{" "}
              <span className="font-serif font-light italic text-ash-100">
                great
              </span>
              .
            </h2>
          </div>

          <button
            onClick={toTop}
            data-cursor="hover"
            className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ash-400 transition-colors hover:text-white"
          >
            Back to top
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-white/40">
              <ArrowUp
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </span>
          </button>
        </div>

        {/* Columns */}
        <div className="mt-16 grid gap-10 border-t border-white/5 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="font-display text-lg font-semibold text-white">
              {site.displayName}
            </div>
            <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-ash-500">
              Software engineer &amp; designer crafting cinematic, performant
              web experiences.
            </p>
          </div>

          <nav className="flex flex-col gap-2.5">
            <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ash-600">
              Navigate
            </div>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-cursor="hover"
                className="w-fit text-sm text-ash-400 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5">
            <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ash-600">
              Elsewhere
            </div>
            {Object.values(site.socials).map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="w-fit text-sm text-ash-400 transition-colors hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ash-600">
              Local time
            </div>
            <div className="font-mono text-sm text-ash-300 tabular-nums">
              {time || "--:--:--"} <span className="text-ash-600">CAT</span>
            </div>
            <div className="text-sm text-ash-500">{site.location}</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/5 pt-6 font-mono text-[0.7rem] uppercase tracking-widest text-ash-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {year} {site.fullName}
          </span>
          <span>Built with Next.js · Three.js · Framer Motion</span>
        </div>
      </div>
    </footer>
  );
}
