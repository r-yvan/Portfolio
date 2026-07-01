import { cn } from "@/lib/utils";

/**
 * Monospace section eyebrow, e.g. [02] SELECTED WORK / 2024 — 2026.
 * Inspired by the wibify / minhpham technical labelling system.
 */
export function SectionLabel({
  index,
  title,
  meta,
  className,
}: {
  index: string;
  title: string;
  meta?: string;
  className?: string;
}) {
  return (
    <div className={cn("section-label", className)}>
      <span className="h-px w-8 bg-ash-700" />
      <span className="text-iris-400">[{index}]</span>
      <span>{title}</span>
      {meta ? <span className="text-ash-700">/ {meta}</span> : null}
    </div>
  );
}
