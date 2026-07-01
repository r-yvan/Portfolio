"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/* Isometric rhombus (the flat "top" face of an iso shape). */
const rhombus = (cx: number, cy: number, w: number) => {
  const h = w / 2;
  return `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
};

/** FIG 0.1 — stacked isometric plates with a disc accent (built to last). */
function FigLayers() {
  const cx = 100;
  const w = 60;
  const h = w / 2;
  const ys = [54, 80, 106, 132];
  return (
    <svg viewBox="0 0 200 180" fill="none" className="h-full w-full">
      <line
        x1={cx - w}
        y1={ys[0]}
        x2={cx - w}
        y2={ys[ys.length - 1]}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <line
        x1={cx + w}
        y1={ys[0]}
        x2={cx + w}
        y2={ys[ys.length - 1]}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <line
        x1={cx}
        y1={ys[0] + h}
        x2={cx}
        y2={ys[ys.length - 1] + h}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      {ys.map((cy, i) => (
        <polygon
          key={cy}
          points={rhombus(cx, cy, w)}
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.3 + i * 0.14}
        />
      ))}
      <ellipse
        cx={cx}
        cy={ys[0]}
        rx={w * 0.46}
        ry={w * 0.23}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
      <ellipse
        cx={cx}
        cy={ys[0]}
        rx={w * 0.22}
        ry={w * 0.11}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

/** A single isometric cube (top + two side faces) with a node dot. */
function Cube({
  cx,
  cy,
  w,
  ht,
  o,
}: {
  cx: number;
  cy: number;
  w: number;
  ht: number;
  o: number;
}) {
  const h = w / 2;
  const left = `${cx - w},${cy} ${cx},${cy + h} ${cx},${cy + h + ht} ${cx - w},${cy + ht}`;
  const right = `${cx + w},${cy} ${cx},${cy + h} ${cx},${cy + h + ht} ${cx + w},${cy + ht}`;
  return (
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <polygon points={rhombus(cx, cy, w)} opacity={o} />
      <polygon points={left} opacity={o * 0.65} />
      <polygon points={right} opacity={o * 0.45} />
      <circle cx={cx} cy={cy - 1} r="2.4" fill="currentColor" stroke="none" opacity={o} />
    </g>
  );
}

/** FIG 0.2 — cluster of isometric cubes (composed with intent). */
function FigCubes() {
  return (
    <svg viewBox="0 0 200 180" fill="none" className="h-full w-full">
      <Cube cx={104} cy={46} w={30} ht={30} o={0.55} />
      <Cube cx={72} cy={92} w={26} ht={26} o={0.46} />
      <Cube cx={130} cy={98} w={22} ht={22} o={0.38} />
    </svg>
  );
}

/** FIG 0.3 — arch of isometric fins (built for speed / velocity). */
function FigFins() {
  const fins = Array.from({ length: 11 }, (_, i) => i);
  const d = 12;
  return (
    <svg viewBox="0 0 220 180" fill="none" className="h-full w-full">
      {fins.map((i) => {
        const bx = 30 + i * 13;
        const by = 150 - i * 6;
        const ht = 18 + Math.sin((i / 10) * Math.PI) * 78;
        const pts = `${bx},${by} ${bx + d},${by - d / 2} ${bx + d},${by - d / 2 - ht} ${bx},${by - ht}`;
        return (
          <polygon
            key={i}
            points={pts}
            stroke="currentColor"
            strokeWidth="1"
            opacity={0.25 + (i / 10) * 0.45}
          />
        );
      })}
    </svg>
  );
}

const FIGURES = [
  {
    fig: "FIG 0.1",
    title: "Engineered to last",
    body: "Clean, typed foundations and tested architecture — so the work keeps scaling long after launch day.",
    Svg: FigLayers,
  },
  {
    fig: "FIG 0.2",
    title: "Designed with intent",
    body: "Structure, hierarchy and motion composed as one deliberate system — never decoration for its own sake.",
    Svg: FigCubes,
  },
  {
    fig: "FIG 0.3",
    title: "Built for speed",
    body: "Performance is a feature: fast loads, fluid interaction and real momentum on every device.",
    Svg: FigFins,
  },
] as const;

export function Approach() {
  return (
    <section id="approach" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel index="02" title="Approach" meta="How I build" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-3xl text-section-title font-display font-medium text-white">
            Principles I{" "}
            <span className="font-serif font-light italic">build</span> by.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8">
          {FIGURES.map((f, i) => (
            <Reveal key={f.title} delay={0.1 + i * 0.1}>
              <div className="group">
                <div className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.32em] text-ash-600">
                  {f.fig}
                </div>
                <div className="relative h-52 w-full text-iris-400/75 transition-colors duration-500 group-hover:text-iris-300">
                  <f.Svg />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-ash-400">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
