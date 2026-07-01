"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin blueviolet line at the very top showing global scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-gradient-to-r from-iris-700 via-iris-400 to-iris-300 shadow-glow-sm"
    />
  );
}
