"use client";

import { forwardRef, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import { Crosshairs } from "@/components/ui/Crosshairs";
import type { Project } from "@/lib/content/schema";
import { cn } from "@/lib/utils";
import { ProjectVisual } from "./ProjectVisual";

const EASE = [0.16, 1, 0.3, 1] as const;

function hostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Sharp project card with real, separate links:
 *  - the whole card opens the primary destination (live site, else source)
 *    via a stretched link on the title — no nested anchors;
 *  - "Live site" and "Source" buttons sit above it and open their own URLs.
 * Subtle 3D tilt on fine pointers; image goes from grey to colour on hover.
 */
type ProjectCardProps = {
  project: Project;
  index: number;
  large?: boolean;
  /** Full-row card (odd featured count) — uses a wider image ratio. */
  wide?: boolean;
  /** Part of an edge-to-edge grid: draws only right/bottom hairlines, no tilt. */
  seamless?: boolean;
  preview?: boolean;
  className?: string;
};

// forwardRef: AnimatePresence (popLayout) needs to measure the card on exit.
export const ProjectCard = forwardRef<HTMLElement, ProjectCardProps>(function ProjectCard(
  { project, index, large = false, wide = false, seamless = false, preview = false, className },
  forwardedRef,
) {
  const ref = useRef<HTMLElement | null>(null);
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });

  const primary = project.liveUrl || project.repoUrl;

  const onMove = (e: React.MouseEvent) => {
    if (preview || seamless || !ref.current || !window.matchMedia("(hover: hover)").matches) return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      ref={setRef}
      layout={!preview}
      initial={preview ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1100 }}
      className={cn(
        "group relative flex h-full flex-col bg-surface transition-colors duration-300",
        seamless ? "border-b border-r border-fg/10 hover:bg-canvas-2" : "border border-fg/10 hover:border-fg/25",
        className,
      )}
    >
      <Crosshairs hover animate={false} />
      {seamless ? (
        <span className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
      ) : null}

      <div
        className={cn(
          "relative overflow-hidden border-b border-fg/10",
          wide ? "aspect-[16/9] md:aspect-[21/8]" : large ? "aspect-[16/9]" : "aspect-[16/10]",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-[transform,filter] duration-700 ease-out-expo group-hover:scale-[1.04]",
            project.image && "md:grayscale-[0.85] md:group-hover:grayscale-0",
          )}
        >
          <ProjectVisual
            title={project.title}
            category={project.category}
            year={project.year}
            image={project.image}
            imageAlt={project.imageAlt}
            sizes={large ? "(max-width: 768px) 100vw, 50vw" : undefined}
          />
        </div>
        <div className="label absolute left-3 top-3 border border-fg/10 bg-canvas/80 px-2 py-1.5 backdrop-blur-md tabular">
          {String(index + 1).padStart(2, "0")}
        </div>
        {project.featured ? (
          <div className="label absolute right-3 top-3 bg-accent px-2 py-1.5 text-accent-fg">Featured</div>
        ) : null}
      </div>

      <div className={cn("flex flex-1 flex-col", large ? "p-6 md:p-8" : "p-5 md:p-6")}>
        <div className="label flex items-center justify-between gap-3">
          <span className="text-fg/70">{project.category}</span>
          <span className="tabular">{project.year}</span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <h3 className={cn("font-medium tracking-tight", large ? "text-2xl md:text-3xl" : "text-xl md:text-2xl")}>
            {primary && !preview ? (
              <a
                href={primary}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-none after:absolute after:inset-0 after:z-[1] after:content-['']"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          {primary ? (
            <ArrowUpRight
              size={20}
              className="mt-1 shrink-0 text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          ) : null}
        </div>

        {project.summary ? (
          <p className={cn("mt-3 text-sm leading-relaxed text-muted", !large && "line-clamp-3")}>{project.summary}</p>
        ) : null}

        {project.tags.length ? (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.slice(0, large ? 6 : 4).map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="relative z-[2] mt-auto flex flex-wrap items-center gap-2 pt-6">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              title={project.liveUrl}
              tabIndex={preview ? -1 : undefined}
            >
              <Globe size={13} />
              <span>Live site</span>
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              title={project.repoUrl}
              tabIndex={preview ? -1 : undefined}
            >
              <Github size={13} />
              <span>Source</span>
            </a>
          ) : null}
          {project.liveUrl ? (
            <span className="label ml-auto hidden truncate normal-case tracking-normal xl:inline">
              {hostLabel(project.liveUrl)}
            </span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
});
