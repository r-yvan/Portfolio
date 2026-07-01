"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { milestones } from "@/lib/education";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Education() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"],
  });

  return (
    <section id="education" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="06" title="The Path" meta="2020 — Now" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-3xl text-section-title font-display font-medium text-white">
            A journey of{" "}
            <span className="font-serif font-light italic text-ash-100">
              relentless
            </span>{" "}
            curiosity.
          </h2>
        </Reveal>

        <div ref={timelineRef} className="relative mt-20">
          {/* Static rail */}
          <div className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-white/10 md:left-1/2" />
          {/* Drawn progress */}
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute left-4 top-0 h-full w-px -translate-x-1/2 origin-top bg-gradient-to-b from-iris-400/70 via-iris-400/30 to-transparent md:left-1/2"
          />

          <div className="space-y-14 md:space-y-20">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={m.year + m.title}
                  className="relative grid md:grid-cols-2 md:gap-16"
                >
                  {/* Node */}
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0.4 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute left-4 top-1 z-10 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border border-white/20 bg-ink-900 md:left-1/2"
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        m.kind === "now" ? "bg-iris-400" : "bg-ash-400",
                      )}
                    />
                    {m.kind === "now" && (
                      <span className="absolute inset-0 animate-ping rounded-full border border-iris-400/50" />
                    )}
                  </motion.span>

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className={cn(
                      "pl-12 md:pl-0",
                      isLeft
                        ? "md:pr-16 md:text-right"
                        : "md:col-start-2 md:pl-16",
                    )}
                  >
                    <div className="font-mono text-xs uppercase tracking-[0.3em] text-iris-300/80">
                      {m.year}
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                      {m.title}
                    </h3>
                    <div className="mt-1 font-mono text-xs uppercase tracking-widest text-ash-500">
                      {m.subtitle}
                    </div>
                    <p className="mt-4 font-light leading-relaxed text-ash-400">
                      {m.description}
                    </p>
                    <div
                      className={cn(
                        "mt-5 flex flex-wrap gap-2",
                        isLeft && "md:justify-end",
                      )}
                    >
                      {m.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
