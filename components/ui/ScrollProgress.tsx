"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline red bar along the top edge showing page progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-accent"
    />
  );
}
