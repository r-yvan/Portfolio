"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Cycles through role titles with a fluid per-character swap (letters rise in,
 * previous letters lift out) — not a typewriter. Used in the hero.
 */
export function RoleRotator({
  roles,
  interval = 2600,
  className,
}: {
  roles: readonly string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % roles.length),
      interval,
    );
    return () => clearInterval(id);
  }, [roles.length, interval]);

  const role = roles[index];

  return (
    <span className={className}>
      <span className="relative inline-flex h-[1.25em] items-center overflow-hidden align-bottom">
        <AnimatePresence mode="wait">
          <motion.span key={role} className="inline-flex">
            {Array.from(role).map((char, i) => (
              <motion.span
                key={`${role}-${i}`}
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-105%", opacity: 0 }}
                transition={{
                  delay: i * 0.022,
                  duration: 0.42,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block whitespace-pre"
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
