"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Crosshairs } from "@/components/ui/Crosshairs";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Project } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

/**
 * Empty cells that complete the last row of the edge-to-edge grid so the
 * frame always closes. Visibility is per breakpoint (2 cols on sm, 3 on lg);
 * the first filler doubles as a "more on GitHub" link.
 */
function Fillers({ count, githubUser }: { count: number; githubUser: string }) {
  const sm = (2 - (count % 2)) % 2;
  const lg = (3 - (count % 3)) % 3;
  const total = Math.max(sm, lg);
  return (
    <>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={`filler-${i}`}
          aria-hidden={i > 0 || !githubUser}
          className={cn(
            "hidden min-h-[16rem] border-b border-r border-fg/10",
            i < sm ? "sm:flex" : "sm:hidden",
            i < lg ? "lg:flex" : "lg:hidden",
          )}
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgb(var(--fg) / 0.035) 0 1px, transparent 1px 11px)",
          }}
        >
          {i === 0 && githubUser ? (
            <a
              href={`https://github.com/${githubUser}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full flex-col justify-between p-6 transition-colors hover:bg-canvas-2 md:p-8"
            >
              <span className="label">Archive</span>
              <span>
                <span className="flex items-center gap-2 text-2xl font-medium tracking-tight">
                  More on GitHub
                  <ArrowUpRight
                    size={20}
                    className="text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </span>
                <span className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <Github size={14} /> @{githubUser}
                </span>
              </span>
            </a>
          ) : null}
        </div>
      ))}
    </>
  );
}

export function Work({
  index,
  projects,
  githubUser,
}: {
  index: string;
  projects: Project[];
  githubUser: string;
}) {
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const p of projects) if (!seen.includes(p.category)) seen.push(p.category);
    return ["All", ...seen];
  }, [projects]);

  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);
  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);
  const position = (p: Project) => projects.indexOf(p);

  return (
    <section id="work" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeader
            index={index}
            label="Selected work"
            meta={`${projects.length} projects`}
            title="_Things I've_ built."
          />
          {githubUser ? (
            <Reveal delay={0.1}>
              <a
                href={`https://github.com/${githubUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost group"
              >
                <Github size={15} />
                <span>@{githubUser}</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          ) : null}
        </div>

        {categories.length > 2 && (
          <Reveal delay={0.1} className="mt-12">
            <div role="tablist" aria-label="Filter projects" className="no-scrollbar inline-flex max-w-full overflow-x-auto border border-fg/10">
              {categories.map((category) => {
                const count =
                  category === "All" ? projects.length : projects.filter((p) => p.category === category).length;
                const selected = active === category;
                return (
                  <button
                    key={category}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(category)}
                    className={cn(
                      "relative flex shrink-0 items-center gap-2.5 border-r border-fg/10 px-5 py-3 text-sm font-medium transition-colors last:border-r-0",
                      selected ? "text-accent-fg" : "text-subtle hover:text-fg",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="work-filter"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        className="absolute inset-0 bg-accent"
                      />
                    )}
                    <span className="relative">{category}</span>
                    <span className={cn("relative text-[0.65rem] tabular", selected ? "text-accent-fg/70" : "text-subtle/70")}>
                      {String(count).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* Edge-to-edge grid: the frame draws top/left, every cell right/bottom */}
        {filtered.length > 0 ? (
          <div className="relative mt-10 border-l border-t border-fg/10">
            <Crosshairs />
            <LayoutGroup>
              {featured.length > 0 && (
                <motion.div layout className="grid md:grid-cols-2">
                  <AnimatePresence mode="popLayout">
                    {featured.map((project, i) => {
                      const wide = featured.length % 2 === 1 && i === featured.length - 1;
                      return (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={position(project)}
                          large
                          wide={wide}
                          seamless
                          className={wide ? "md:col-span-2" : undefined}
                        />
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
              {rest.length > 0 && (
                <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {rest.map((project) => (
                      <ProjectCard key={project.id} project={project} index={position(project)} seamless />
                    ))}
                  </AnimatePresence>
                  <Fillers count={rest.length} githubUser={githubUser} />
                </motion.div>
              )}
            </LayoutGroup>
          </div>
        ) : (
          <p className="mt-10 border border-dashed border-fg/15 p-10 text-center text-muted">Nothing here yet.</p>
        )}
      </div>
    </section>
  );
}
