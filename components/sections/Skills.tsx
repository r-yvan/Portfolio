"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Layers, PenTool, Server, Wrench } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SkillIcon } from "@/components/ui/SkillIcon";
import { skillCategories, skills, type SkillCategory } from "@/lib/skills";

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORY_META: Record<
  SkillCategory,
  { icon: typeof Layers; blurb: string }
> = {
  Frontend: {
    icon: Layers,
    blurb:
      "Pixel-precise, motion-rich interfaces built on modern React and the web platform.",
  },
  Backend: {
    icon: Server,
    blurb:
      "APIs, data models and server logic engineered to stay fast under real-world load.",
  },
  Design: {
    icon: PenTool,
    blurb:
      "Turning rough ideas into clean, intentional visual systems and prototypes.",
  },
  Tools: {
    icon: Wrench,
    blurb:
      "The workflow that ships reliably — version control, deploys and delivery.",
  },
};

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="03" title="Capabilities" meta="The stack" />
        <h2 className="mt-6 text-section-title font-display font-medium text-white">
          The tools I{" "}
          <span className="font-serif font-light italic">think</span> in.
        </h2>
        <p className="mt-5 max-w-md font-light leading-relaxed text-ash-400">
          A curated stack I reach for to ship fast, expressive products —
          grouped by where it lives in the build.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {skillCategories.map((category, ci) => {
            const { icon: Icon, blurb } = CATEGORY_META[category];
            const items = skills.filter((s) => s.category === category);
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: ci * 0.08, ease: EASE }}
                data-cursor="hover"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors duration-500 hover:border-iris-500/40 md:p-9"
              >
                {/* corner glow on hover */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-iris-500/0 blur-3xl transition-all duration-500 group-hover:bg-iris-500/10" />

                {/* giant ghost numeral */}
                <span className="ghost-number absolute right-5 top-1 select-none text-7xl md:text-8xl">
                  {String(ci + 1).padStart(2, "0")}
                </span>

                {/* icon tile */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-iris-300 transition-colors duration-500 group-hover:border-iris-500/40">
                  <Icon size={20} strokeWidth={1.6} />
                </div>

                <h3 className="relative mt-6 font-display text-2xl font-semibold text-white md:text-3xl">
                  {category}
                </h3>
                <p className="relative mt-3 max-w-sm text-sm font-light leading-relaxed text-ash-400">
                  {blurb}
                </p>

                <div className="relative mt-7 h-px w-full bg-white/5" />

                <div className="relative mt-6 flex flex-wrap gap-2.5">
                  {items.map((s) => (
                    <span key={s.name} className="tag group/skill">
                      <SkillIcon
                        slug={s.slug}
                        name={s.name}
                        className="h-3.5 w-3.5"
                      />
                      {s.name}
                    </span>
                  ))}
                </div>

                <ArrowUpRight
                  size={18}
                  className="relative mt-7 text-ash-600 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-iris-300"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
