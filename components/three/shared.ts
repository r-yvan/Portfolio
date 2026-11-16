"use client";

import { useEffect, useState, type RefObject } from "react";
import { useInView } from "framer-motion";
import { useTheme } from "next-themes";

/* ------------------------------------------------------------------ */
/* Global pointer (canvases sit under HTML overlays, so R3F's own      */
/* pointer events never fire — we track the window instead).           */
/* ------------------------------------------------------------------ */

const pointer = { x: 0, y: 0, active: false };
let listening = false;

function ensurePointerListener() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
}

export function usePointer() {
  useEffect(ensurePointerListener, []);
  return pointer;
}

/** Pointer in NDC (-1…1) relative to an element's rect (0,0 if inactive). */
export function pointerNdc(rect: DOMRect, out: { x: number; y: number }) {
  if (!pointer.active || rect.width === 0) {
    out.x = 0;
    out.y = 0;
    return false;
  }
  out.x = ((pointer.x - rect.left) / rect.width) * 2 - 1;
  out.y = -(((pointer.y - rect.top) / rect.height) * 2 - 1);
  return pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
}

/* ------------------------------------------------------------------ */
/* Theme palettes — grey shades, red only where it means something.    */
/* ------------------------------------------------------------------ */

export type ScenePalette = {
  dark: boolean;
  bg: string;
  low: string;
  high: string;
  line: string;
  dots: string;
  accent: string;
  ambient: number;
  key: number;
};

export const DARK_PALETTE: ScenePalette = {
  dark: true,
  bg: "#000000",
  low: "#1a1a1a",
  high: "#9a9a9a",
  line: "#7a7a7a",
  dots: "#5a5a5a",
  accent: "#ff3b3b",
  ambient: 0.55,
  key: 1.6,
};

export const LIGHT_PALETTE: ScenePalette = {
  dark: false,
  bg: "#fafaf9",
  low: "#b9b9b6",
  high: "#ffffff",
  line: "#8d8d8a",
  dots: "#a3a3a0",
  accent: "#d91e1e",
  ambient: 1.05,
  key: 1.25,
};

export function useScenePalette() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "light" ? LIGHT_PALETTE : DARK_PALETTE;
}

/* ------------------------------------------------------------------ */
/* Render only while on screen and the tab is visible.                 */
/* ------------------------------------------------------------------ */

export function useSceneActive(ref: RefObject<Element>) {
  const inView = useInView(ref, { margin: "120px 0px" });
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === "visible");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return inView && visible;
}

export function useReducedMotionPref() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Coarse device tier → instance counts. */
export function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(mq.matches || (navigator.hardwareConcurrency ?? 8) <= 4);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}

/** Deterministic PRNG so layouts are stable between renders. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
