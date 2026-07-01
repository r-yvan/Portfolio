"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a tech logo from simpleicons.org as a crisp monochrome SVG: grey at
 * rest, white on hover (parent must set the `group/skill` class). Falls back to
 * a monogram tile if the icon slug is unavailable.
 */
export function SkillIcon({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-white/5 font-display text-sm font-bold text-ash-400",
          className,
        )}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <span className={cn("relative inline-block", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/6b6b6b`}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain transition-opacity duration-300 group-hover/skill:opacity-0"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/f8f8f8`}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover/skill:opacity-100"
      />
    </span>
  );
}
