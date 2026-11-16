"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Milestone } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Path({ index, milestones }: { index: string; milestones: Milestone[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const first = milestones[0]?.year;
  const last = milestones[milestones.length - 1]?.year;

  return (
    <section id="path" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index={index}
          label="The path"
          meta={first && last ? `${first} — ${last}` : undefined}
          title="_A journey of_ relentless curiosity."
        />

        <div ref={ref} className="relative mt-20">
          <div className="absolute left-[7px] top-0 h-full w-px bg-fg/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute left-[7px] top-0 h-full w-px origin-top bg-accent md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="space-y-14 md:space-y-20">
            {milestones.map((m, i) => {
              const left = i % 2 === 0;
              return (
                <li key={m.id} className="relative grid md:grid-cols-2 md:gap-16">
                  <motion.span
                    initial={{ scale: 0, rotate: 0 }}
                    whileInView={{ scale: 1, rotate: 45 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className={cn(
                      "absolute left-[2px] top-1.5 z-10 h-[11px] w-[11px] border md:left-1/2 md:-ml-[5.5px]",
                      m.current ? "border-accent bg-accent" : "border-fg/30 bg-canvas",
                    )}
                  >
                    {m.current && <span className="absolute inset-0 animate-ping-square border border-accent" />}
                  </motion.span>

                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className={cn("pl-10 md:pl-0", left ? "md:pr-16 md:text-right" : "md:col-start-2 md:pl-16")}
                  >
                    <div className="label text-accent tabular">{m.year}</div>
                    <h3 className="mt-3 text-2xl font-medium tracking-tight">{m.title}</h3>
                    {m.subtitle ? <div className="label mt-2">{m.subtitle}</div> : null}
                    {m.description ? <p className="mt-4 leading-relaxed text-muted">{m.description}</p> : null}
                    {m.tags.length ? (
                      <ul className={cn("mt-5 flex flex-wrap gap-2", left && "md:justify-end")}>
                        {m.tags.map((tag) => (
                          <li key={tag} className="chip">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
