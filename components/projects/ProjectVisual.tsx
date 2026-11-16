"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const OPTIMIZABLE_HOSTS = [
  /\.public\.blob\.vercel-storage\.com$/,
  /^avatars\.githubusercontent\.com$/,
  /^raw\.githubusercontent\.com$/,
  /^opengraph\.githubassets\.com$/,
];

function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const host = new URL(src).hostname;
    return OPTIMIZABLE_HOSTS.some((re) => re.test(host));
  } catch {
    return false;
  }
}

function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Generated cover for projects without an image: a seeded composition of
 * blueprint cells (one red), the project's initials in outline type, and a
 * technical caption — on-brand instead of an empty placeholder.
 */
export function ProjectCover({ title, category, year }: { title: string; category: string; year?: string }) {
  const patternId = `cover-grid-${useId().replace(/:/g, "")}`;
  const cells = useMemo(() => {
    let seed = hash(title || "project");
    const next = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const out: { x: number; y: number; w: number; h: number; o: number; red: boolean }[] = [];
    const redIndex = Math.floor(next() * 6);
    for (let i = 0; i < 7; i++) {
      const w = 1 + Math.floor(next() * 3);
      const h = 1 + Math.floor(next() * 2);
      out.push({
        x: Math.floor(next() * (16 - w)),
        y: Math.floor(next() * (10 - h)),
        w,
        h,
        o: 0.04 + next() * 0.1,
        red: i === redIndex,
      });
    }
    return out;
  }, [title]);

  const initials = (title.match(/[A-Z]/g)?.join("") || title).slice(0, 2).toUpperCase();

  return (
    <div className="absolute inset-0 overflow-hidden bg-canvas-2">
      <svg viewBox="0 0 16 10" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={patternId} width="1" height="1" patternUnits="userSpaceOnUse">
            <path d="M1 0H0V1" fill="none" stroke="currentColor" strokeWidth="0.015" className="text-fg/20" />
          </pattern>
        </defs>
        <rect width="16" height="10" fill={`url(#${patternId})`} className="text-fg" />
        {cells.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={c.w}
            height={c.h}
            className={c.red ? "fill-accent" : "fill-fg"}
            fillOpacity={c.red ? 0.9 : c.o}
          />
        ))}
      </svg>
      <span
        aria-hidden
        className="text-outline absolute -bottom-[0.18em] -right-[0.04em] select-none text-[9rem] font-bold leading-none tracking-tighter md:text-[11rem]"
        style={{ WebkitTextStroke: "1px rgb(var(--fg) / 0.22)" }}
      >
        {initials}
      </span>
      <div className="label absolute bottom-4 left-4 flex gap-2">
        <span className="text-fg/70">{category}</span>
        {year ? <span>/ {year}</span> : null}
      </div>
    </div>
  );
}

export function ProjectVisual({
  title,
  category,
  year,
  image,
  imageAlt,
  sizes,
  priority,
  className,
}: {
  title: string;
  category: string;
  year?: string;
  image?: string;
  imageAlt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!image || failed) return <ProjectCover title={title} category={category} year={year} />;

  return (
    <Image
      src={image}
      alt={imageAlt || `${title} preview`}
      fill
      priority={priority}
      sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
      unoptimized={!canOptimize(image)}
      onError={() => setFailed(true)}
      className={cn("object-cover object-top", className)}
    />
  );
}
