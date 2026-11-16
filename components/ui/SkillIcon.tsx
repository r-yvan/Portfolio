"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Tech logo from simpleicons.org: neutral grey at rest, red on hover
 * (parent needs `group/skill`). Grey and red read well on both themes, so a
 * single pair of images covers dark and light mode. Falls back to a sharp
 * monogram when the slug is empty or the icon no longer exists.
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

  if (!slug || failed) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center border border-current text-[0.5rem] font-bold leading-none text-subtle transition-colors group-hover/skill:text-accent",
          className,
        )}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <span className={cn("relative inline-block", className)} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/8a8a8a`}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain transition-opacity duration-300 group-hover/skill:opacity-0"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/ff3b3b`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover/skill:opacity-100"
      />
    </span>
  );
}
