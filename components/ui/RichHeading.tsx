"use client";

import { createElement, useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { parseMarkup, stripMarkup, toneClass } from "@/lib/content/markup";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Headline with the site's markup (*accent italic*, _muted_) where every word
 * rises out of a hard mask with a slight blur, staggered.
 */
export function RichHeading({
  markup,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.045,
  immediate = false,
}: {
  markup: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();
  const show = immediate || inView;

  const words = useMemo(() => {
    const out: { text: string; className: string; space: boolean }[] = [];
    for (const token of parseMarkup(markup)) {
      const parts = token.text.split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          if (out.length) out[out.length - 1].space = true;
          continue;
        }
        out.push({ text: part, className: toneClass[token.tone], space: false });
      }
    }
    return out;
  }, [markup]);

  return createElement(
    as,
    { ref, className, "aria-label": stripMarkup(markup) },
    <span aria-hidden>
      {words.map((word, i) => (
        <span key={i}>
          {/* extra bottom room so descenders survive the tight line-height */}
          <span className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom">
            <motion.span
              className={cn("inline-block", word.className)}
              initial={reduced ? false : { y: "110%", filter: "blur(6px)" }}
              animate={show ? { y: "0%", filter: "blur(0px)" } : undefined}
              transition={{ duration: 0.95, delay: delay + i * stagger, ease: EASE }}
            >
              {word.text}
            </motion.span>
          </span>
          {word.space ? " " : null}
        </span>
      ))}
    </span>,
  );
}
