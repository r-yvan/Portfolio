"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Crosshairs } from "@/components/ui/Crosshairs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Testimonial } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 6000;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials({ index, items }: { index: string; items: Testimonial[] }) {
  const [[current, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback(
    (dir: number) => setState(([i]) => [(i + dir + items.length) % items.length, dir]),
    [items.length],
  );

  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = window.setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [paused, paginate, current, items.length]);

  const active = items[current];
  if (!active) return null;

  return (
    <section id="kind-words" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionHeader index={index} label="Kind words" meta="Testimonials" title="_What it's like_ to work together." />

        <div
          className="relative mt-14 border border-fg/10 bg-surface/60"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Crosshairs />
          <div className="relative min-h-[20rem] overflow-hidden p-8 md:min-h-[17rem] md:p-14">
            <span aria-hidden className="pointer-events-none absolute -top-6 left-6 select-none text-[10rem] font-bold leading-none text-accent/15">
              &ldquo;
            </span>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={current}
                initial={{ opacity: 0, x: direction >= 0 ? 50 : -50, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: direction >= 0 ? -50 : 50, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) paginate(1);
                  else if (info.offset.x > 80) paginate(-1);
                }}
                className="relative cursor-grab active:cursor-grabbing"
              >
                <blockquote className="text-2xl font-medium leading-snug tracking-tight md:text-[2rem]">
                  {active.quote}
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center border border-fg/15 text-sm font-bold">
                    {initials(active.name)}
                  </span>
                  <span>
                    <span className="block font-medium">{active.name}</span>
                    <span className="label mt-1.5 block">
                      {[active.role, active.company].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="flex items-stretch border-t border-fg/10">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="flex w-14 items-center justify-center border-r border-fg/10 text-subtle transition-colors hover:bg-fg hover:text-canvas"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex flex-1 items-center gap-2 px-5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setState([i, i > current ? 1 : -1])}
                  aria-label={`Show testimonial ${i + 1}`}
                  className="relative h-[3px] flex-1 overflow-hidden bg-fg/10"
                >
                  {i === current ? (
                    <motion.span
                      key={`${current}-${paused}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: paused ? 0.0001 : 1 }}
                      transition={{ duration: paused ? 0.2 : AUTOPLAY_MS / 1000, ease: "linear" }}
                      className="absolute inset-0 origin-left bg-accent"
                    />
                  ) : (
                    <span className={cn("absolute inset-0", i < current ? "bg-fg/30" : "")} />
                  )}
                </button>
              ))}
            </div>
            <span className="label flex items-center px-4 tabular">
              {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="flex w-14 items-center justify-center border-l border-fg/10 text-subtle transition-colors hover:bg-fg hover:text-canvas"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
