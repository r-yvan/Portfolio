"use client";

import { motion } from "framer-motion";
import { Box, Cpu, Layers, PenTool, Server, Wrench } from "lucide-react";
import { Crosshairs } from "@/components/ui/Crosshairs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkillIcon } from "@/components/ui/SkillIcon";
import type { SkillGroup } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function iconFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes("front")) return Layers;
  if (n.includes("back") || n.includes("server") || n.includes("data")) return Server;
  if (n.includes("design") || n.includes("ui")) return PenTool;
  if (n.includes("tool") || n.includes("ops")) return Wrench;
  if (n.includes("ai") || n.includes("ml") || n.includes("vision")) return Cpu;
  return Box;
}

function Marquee({ groups }: { groups: SkillGroup[] }) {
  const all = groups.flatMap((g) => g.skills);
  if (all.length === 0) return null;
  const loop = [...all, ...all];
  return (
    <div className="mask-fade-x relative mt-10 overflow-hidden border-y border-fg/10 py-5" aria-hidden>
      <div className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
        {loop.map((s, i) => (
          <span key={`${s.name}-${i}`} className="group/skill flex items-center gap-10">
            <span className="flex items-center gap-3 text-lg font-medium tracking-tight text-subtle transition-colors group-hover/skill:text-fg md:text-xl">
              <SkillIcon slug={s.slug} name={s.name} className="h-5 w-5" />
              {s.name}
            </span>
            <span className="text-accent/70">+</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills({ index, groups }: { index: string; groups: SkillGroup[] }) {
  const odd = groups.length % 2 === 1;
  return (
    <section id="skills" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index={index}
          label="Capabilities"
          meta="The stack"
          title="_The tools I_ think in."
        >
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            A curated stack I reach for to ship fast, expressive products — grouped by where it lives
            in the build.
          </p>
        </SectionHeader>

        <div className="relative mt-16 border border-fg/10">
          <Crosshairs />
          <div className="grid gap-px bg-fg/10 md:grid-cols-2">
            {groups.map((group, gi) => {
              const Icon = iconFor(group.name);
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, delay: (gi % 2) * 0.1, ease: EASE }}
                  className={cn(
                    "group relative overflow-hidden bg-canvas p-7 md:p-10",
                    odd && gi === groups.length - 1 && "md:col-span-2",
                  )}
                >
                  {/* top edge sweep */}
                  <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
                  <span className="text-outline pointer-events-none absolute right-6 top-4 select-none text-7xl font-bold leading-none tracking-tighter md:text-8xl">
                    {String(gi + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex h-11 w-11 items-center justify-center border border-fg/10 text-accent transition-colors duration-500 group-hover:border-accent">
                    <Icon size={18} strokeWidth={1.6} />
                  </div>
                  <h3 className="relative mt-7 text-2xl font-medium tracking-tight md:text-3xl">{group.name}</h3>
                  {group.blurb ? (
                    <p className="relative mt-3 max-w-sm text-sm leading-relaxed text-muted">{group.blurb}</p>
                  ) : null}
                  <div className="relative mt-7 h-px w-full bg-fg/10" />
                  <ul className="relative mt-6 flex flex-wrap gap-2">
                    {group.skills.map((s) => (
                      <li key={s.name} className="chip group/skill hover:border-accent/50 hover:text-fg">
                        <SkillIcon slug={s.slug} name={s.name} className="h-3.5 w-3.5" />
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        <Marquee groups={groups} />
      </div>
    </section>
  );
}
