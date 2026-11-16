"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Sharp cursor: a red square that tracks instantly plus a lagging square
 * frame that grows and turns 45° over anything interactive. Fine pointers only.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const frameX = useSpring(x, { stiffness: 420, damping: 32, mass: 0.35 });
  const frameY = useSpring(y, { stiffness: 420, damping: 32, mass: 0.35 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mq.matches || reduced) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const interactive =
      "a, button, input, textarea, select, label, [role='button'], [data-cursor='hover']";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      setHovered(!!target?.closest(interactive));
    };
    const leave = () => setVisible(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x, y, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3px] -mt-[3px] h-1.5 w-1.5 bg-accent"
      />
      <motion.div
        aria-hidden
        style={{ x: frameX, y: frameY, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
      >
        <motion.div
          animate={{
            scale: hovered ? 1.55 : down ? 0.7 : 1,
            rotate: hovered ? 45 : 0,
            opacity: hovered ? 1 : 0.55,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="-ml-4 -mt-4 h-8 w-8 border border-fg/60"
        />
      </motion.div>
    </>
  );
}
