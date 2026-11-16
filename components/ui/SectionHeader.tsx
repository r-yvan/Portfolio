"use client";

import { Reveal } from "@/components/ui/Reveal";
import { RichHeading } from "@/components/ui/RichHeading";
import { Scramble } from "@/components/ui/Scramble";
import { cn } from "@/lib/utils";

/** Eyebrow ([01] ABOUT / meta) + two-tone animated section headline. */
export function SectionHeader({
  index,
  label,
  meta,
  title,
  align = "left",
  className,
  children,
}: {
  index: string;
  label: string;
  meta?: string;
  title: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(align === "center" && "flex flex-col items-center text-center", className)}>
      <Reveal y={12} className="label flex items-center gap-3">
        <span className="h-px w-8 bg-fg/25" />
        <span className="text-accent">[{index}]</span>
        <Scramble text={label} />
        {meta ? <span className="hidden text-subtle/70 sm:inline">/ {meta}</span> : null}
      </Reveal>
      <RichHeading
        markup={title}
        className={cn("h-section mt-4 max-w-4xl text-balance", align === "center" && "mx-auto")}
      />
      {children}
    </div>
  );
}
