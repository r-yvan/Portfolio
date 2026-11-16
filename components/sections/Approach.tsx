"use client";

import { motion } from "framer-motion";
import { Crosshairs } from "@/components/ui/Crosshairs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Scramble } from "@/components/ui/Scramble";
import type { Principle } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const draw = (i: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 1.6, delay: 0.2 + i * 0.07, ease: EASE },
});

const rhombus = (cx: number, cy: number, w: number) =>
  `M${cx},${cy - w / 2} L${cx + w},${cy} L${cx},${cy + w / 2} L${cx - w},${cy} Z`;

/** FIG — stacked isometric plates (foundation). */
function FigLayers() {
  const ys = [60, 84, 108, 132];
  return (
    <svg viewBox="0 0 200 180" fill="none" className="h-full w-full">
      {ys.map((cy, i) => (
        <motion.path key={cy} d={rhombus(100, cy, 62)} stroke="currentColor" strokeWidth="1" {...draw(i)} />
      ))}
      <motion.path d="M38,60 L38,132 M162,60 L162,132 M100,91 L100,163" stroke="currentColor" strokeWidth="1" {...draw(5)} />
      <motion.ellipse cx="100" cy="60" rx="28" ry="14" stroke="currentColor" strokeWidth="1" {...draw(6)} />
    </svg>
  );
}

/** FIG — isometric cube cluster (intent). */
function FigCubes() {
  const cube = (cx: number, cy: number, w: number) => {
    const h = w / 2;
    return [
      rhombus(cx, cy, w),
      `M${cx - w},${cy} L${cx - w},${cy + w} L${cx},${cy + h + w} L${cx},${cy + h}`,
      `M${cx + w},${cy} L${cx + w},${cy + w} L${cx},${cy + h + w}`,
    ];
  };
  const paths = [...cube(104, 44, 30), ...cube(70, 92, 26), ...cube(134, 98, 22)];
  return (
    <svg viewBox="0 0 200 180" fill="none" className="h-full w-full">
      {paths.map((d, i) => (
        <motion.path key={i} d={d} stroke="currentColor" strokeWidth="1" {...draw(i)} />
      ))}
    </svg>
  );
}

/** FIG — arch of fins (momentum). */
function FigFins() {
  return (
    <svg viewBox="0 0 220 180" fill="none" className="h-full w-full">
      {Array.from({ length: 11 }, (_, i) => {
        const bx = 30 + i * 13;
        const by = 150 - i * 6;
        const ht = 18 + Math.sin((i / 10) * Math.PI) * 78;
        const d = `M${bx},${by} L${bx + 12},${by - 6} L${bx + 12},${by - 6 - ht} L${bx},${by - ht} Z`;
        return <motion.path key={i} d={d} stroke="currentColor" strokeWidth="1" {...draw(i)} />;
      })}
    </svg>
  );
}

const FIGURES = [FigLayers, FigCubes, FigFins];

export function Approach({ index, principles }: { index: string; principles: Principle[] }) {
  const count = principles.length;
  const highlight = count >= 2 ? 1 : -1;
  const cols =
    count >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : count === 3 ? "md:grid-cols-3" : count === 2 ? "md:grid-cols-2" : "";

  return (
    <section id="approach" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index={index}
          label="Approach"
          meta="How I build"
          title="_Different products, different stacks —_ the same principles."
        />

        <div className="relative mt-16 border border-fg/10">
          <Crosshairs />
          <div className={cn("grid divide-y divide-fg/10 md:divide-y-0", cols, count > 1 && "md:divide-x")}>
            {principles.map((p, i) => {
              const Fig = FIGURES[i % FIGURES.length];
              const hot = i === highlight;
              return (
                <motion.article
                  key={`${p.label}-${i}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
                  className={cn(
                    "group relative flex min-h-[22rem] flex-col justify-between overflow-hidden p-8 md:min-h-[26rem] md:p-9",
                    hot ? "bg-accent text-accent-fg" : "bg-surface/60",
                  )}
                >
                  {/* line-art watermark */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-[54%] h-40 w-40 -translate-y-1/2 md:h-48 md:w-48"
                  >
                    <div
                      className={cn(
                        "h-full w-full transition-transform duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:scale-105",
                        hot ? "text-accent-fg/30" : "text-fg/25",
                      )}
                    >
                      <Fig />
                    </div>
                  </div>

                  <div className="relative">
                    <span className={cn("label", hot && "text-accent-fg/75")}>
                      <Scramble text={p.label} delay={i * 120} />
                    </span>
                    <h3
                      className={cn(
                        "mt-6 max-w-[15ch] text-[1.65rem] font-medium leading-[1.12] tracking-tight md:text-[1.9rem]",
                        hot ? "text-accent-fg" : "text-fg",
                      )}
                    >
                      {p.title}
                    </h3>
                  </div>
                  <p
                    className={cn(
                      "relative mt-10 max-w-[30ch] text-sm leading-relaxed",
                      hot ? "text-accent-fg/80" : "text-muted",
                    )}
                  >
                    {p.body}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
