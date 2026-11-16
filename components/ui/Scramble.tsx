"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789/#+-_";

/**
 * Decoder-style text: characters cycle through glyphs and resolve left to
 * right. Runs when scrolled into view and again whenever `text` changes
 * (which is how the hero role rotator morphs between titles). The final text
 * is always what SSR renders and what screen readers get.
 */
export function Scramble({
  text,
  className,
  duration = 650,
  delay = 0,
  playOnMount = false,
}: {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  playOnMount?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!(inView || playOnMount) || reduced) {
      setOutput(text);
      return;
    }
    let raf = 0;
    let lastFrame = 0;
    let start = 0;
    // Swap to glyphs right away so the old text never sits in the new width.
    setOutput(text.replace(/\S/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]));
    const timeout = window.setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now;
        const progress = Math.min(1, (now - start) / duration);
        if (now - lastFrame > 32 || progress === 1) {
          lastFrame = now;
          const revealed = Math.floor(progress * text.length);
          let next = "";
          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            next += i < revealed || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          setOutput(next);
        }
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, inView, playOnMount, reduced, duration, delay]);

  return (
    <span ref={ref} className={cn("relative inline-block whitespace-nowrap", className)}>
      <span className="sr-only">{text}</span>
      {/* invisible sizer keeps the width stable while glyphs churn */}
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span aria-hidden className="absolute inset-0 text-left">
        {output}
      </span>
    </span>
  );
}
