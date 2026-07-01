"use client";

import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  GitFork,
  Github,
  Star,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import type { Project, ProjectCategory } from "@/lib/github";

const CATEGORY_ORDER: ProjectCategory[] = [
  "Web",
  "Tool",
  "Experiment",
  "Other",
];
const EASE = [0.16, 1, 0.3, 1] as const;

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 9);
    rx.set(-py * 9);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.a
      ref={ref}
      layout
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="group glass relative flex flex-col rounded-2xl p-6 transition-colors duration-300 hover:border-white/20 hover:shadow-card [transform-style:preserve-3d]"
    >
      <div className="flex items-center justify-between">
        <span className="tag">
          {project.featured && (
            <span className="h-1.5 w-1.5 rounded-[1px] bg-iris-400" />
          )}
          {project.category}
        </span>
        <div className="flex items-center gap-3 font-mono text-xs text-ash-500">
          {project.stars > 0 && (
            <span className="flex items-center gap-1">
              <Star size={13} /> {project.stars}
            </span>
          )}
          {project.forks > 0 && (
            <span className="flex items-center gap-1">
              <GitFork size={13} /> {project.forks}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-start justify-between gap-3 [transform:translateZ(40px)]">
        <h3 className="font-display text-xl font-semibold text-white md:text-2xl">
          {project.title}
        </h3>
        <ArrowUpRight
          size={20}
          className="mt-1 shrink-0 text-ash-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
        />
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm font-light leading-relaxed text-ash-400">
        {project.description}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/5 pt-4 font-mono text-[0.7rem] text-ash-500">
        {project.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-ash-500" />
            {project.language}
          </span>
        )}
        {project.topics.slice(0, 2).map((topic) => (
          <span key={topic} className="text-ash-600">
            #{topic}
          </span>
        ))}
        {project.homepage && (
          <span className="ml-auto flex items-center gap-1 text-ash-400 transition-colors group-hover:text-iris-300">
            <ExternalLink size={12} /> Live
          </span>
        )}
      </div>
    </motion.a>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const present = CATEGORY_ORDER.filter((c) =>
      projects.some((p) => p.category === c),
    );
    return ["All", ...present] as const;
  }, [projects]);

  const [active, setActive] = useState<string>("All");
  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="work" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <SectionLabel
                index="04"
                title="Selected Work"
                meta="Live from GitHub"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-8 max-w-3xl text-section-title font-display font-medium text-white">
                Things I&apos;ve{" "}
                <span className="font-serif font-light italic text-ash-100">
                  built
                </span>
                .
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <a
              href={`https://github.com/${site.githubUser}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ash-400 transition-colors hover:text-white"
            >
              <span className="flex h-1.5 w-1.5">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-iris-400" />
              </span>
              <Github size={15} />@{site.githubUser}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Reveal>
        </div>

        {/* Filter tabs */}
        <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => {
            const count =
              category === "All"
                ? projects.length
                : projects.filter((p) => p.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setActive(category)}
                data-cursor="hover"
                className={cn(
                  "group relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                  active === category
                    ? "border-white/20 bg-white/[0.06] text-white"
                    : "border-white/10 text-ash-400 hover:text-white",
                )}
              >
                {category}
                <span className="font-mono text-[0.65rem] text-ash-600">
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </Reveal>

        {/* Grid */}
        <motion.div
          layout
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
