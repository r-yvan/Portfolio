"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  /** Split unit for the staggered reveal. */
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  once?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic text reveal: each word/char rises into view from behind a mask
 * with a staggered cascade. Wrap in a semantic heading for accessibility,
 * e.g. <h2><AnimatedText text="..." /></h2>.
 */
export function AnimatedText({
  text,
  className,
  by = "word",
  delay = 0,
  stagger = 0.045,
  once = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px" });
  const units = by === "word" ? text.split(" ") : Array.from(text);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: { y: "115%" },
    show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <span
      ref={ref}
      aria-label={text}
      className={cn("inline-flex flex-wrap", className)}
    >
      <motion.span
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="inline-flex flex-wrap"
        aria-hidden
      >
        {units.map((unit, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
            <motion.span variants={child} className="inline-block whitespace-pre">
              {unit}
              {by === "word" && i < units.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </span>
  );
}
