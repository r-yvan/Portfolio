"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/** Access the active Lenis instance. */
export const useLenis = () => useContext(LenisContext);

/** Smooth-scroll to a selector (e.g. "#work") or a y offset, with fallbacks. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (target: string | number) => {
      if (typeof target === "number") {
        if (lenis) lenis.scrollTo(target, { duration: 1.4 });
        else window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }
      const el = document.querySelector(target) as HTMLElement | null;
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.3 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [lenis],
  );
}

/** Weighted, ultra-smooth scrolling (disabled for reduced-motion users). */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    setLenis(instance);

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
