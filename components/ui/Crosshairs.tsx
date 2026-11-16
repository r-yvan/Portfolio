"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const CORNERS = [
  "-left-[6px] -top-[6px]",
  "-right-[6px] -top-[6px]",
  "-left-[6px] -bottom-[6px]",
  "-right-[6px] -bottom-[6px]",
];

/**
 * The "+" registration marks sitting on the outer corners of a framed grid
 * (straight from the reference). Parent must be `relative`.
 *  - `animate`: marks spin in when scrolled into view
 *  - `hover`:   marks only appear while the parent `.group` is hovered
 */
export function Crosshairs({
  className,
  animate = true,
  hover = false,
}: {
  className?: string;
  animate?: boolean;
  hover?: boolean;
}) {
  return (
    <>
      {CORNERS.map((pos, i) => (
        <motion.span
          key={pos}
          aria-hidden
          initial={animate ? { opacity: 0, rotate: -90, scale: 0.4 } : false}
          whileInView={animate ? { opacity: 1, rotate: 0, scale: 1 } : undefined}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: EASE }}
          className={cn(
            "pointer-events-none absolute z-20 h-[11px] w-[11px] text-fg/45",
            hover && "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            pos,
            className,
          )}
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
        </motion.span>
      ))}
    </>
  );
}
