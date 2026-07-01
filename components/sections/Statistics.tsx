"use client";

import { Activity, Code2, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Circular progress ring with a centred numeral (project health). */
function RingGauge({
  pct,
  center,
  label,
}: {
  pct: number;
  center: string;
  label: string;
}) {
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative mx-auto aspect-square w-40">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="7"
        />
        <circle
          cx="70"
          cy="70"
          r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-white">
          {center}
        </span>
        <span className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ash-500">
          {label}
        </span>
      </div>
    </div>
  );
}

/** Vertical-line bar chart with a highlighted peak + target threshold. */
function BarChart() {
  const bars = [42, 58, 50, 72, 64, 83, 76, 97];
  const peak = bars.length - 1;
  return (
    <svg viewBox="0 0 268 132" className="h-40 w-full">
      <line
        x1="0"
        y1="26"
        x2="268"
        y2="26"
        stroke="rgba(196,181,253,0.4)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <text
        x="2"
        y="20"
        fill="#C4B5FD"
        style={{ font: "600 9px ui-monospace, monospace", letterSpacing: "1px" }}
      >
        TARGET
      </text>
      {bars.map((h, i) => {
        const x = 18 + i * 33;
        const y = 122 - (h / 100) * 92;
        const isPeak = i === peak;
        return (
          <g key={i}>
            <line
              x1={x}
              y1="122"
              x2={x}
              y2={y}
              stroke={isPeak ? "#A78BFA" : "rgba(255,255,255,0.22)"}
              strokeWidth="2"
            />
            <circle
              cx={x}
              cy={y}
              r={isPeak ? 4 : 2.5}
              fill={isPeak ? "#C4B5FD" : "rgba(255,255,255,0.45)"}
            />
          </g>
        );
      })}
    </svg>
  );
}

/** Half-moon gauge with a centred numeral (code output). */
function SemiGauge({
  pct,
  center,
  label,
}: {
  pct: number;
  center: string;
  label: string;
}) {
  const R = 58;
  const cx = 75;
  const cy = 78;
  const len = Math.PI * R;
  const track = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;
  return (
    <div className="relative mx-auto w-44">
      <svg viewBox="0 0 150 90" className="h-full w-full">
        <path
          d={track}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={track}
          fill="none"
          stroke="url(#semiGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - pct)}
        />
        <defs>
          <linearGradient id="semiGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
        <span className="font-display text-3xl font-bold text-white">
          {center}
        </span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ash-500">
          {label}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  metric,
  subtitle,
  delay,
  children,
}: {
  icon: typeof Activity;
  title: string;
  metric: string;
  subtitle: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="glass relative flex h-full flex-col rounded-2xl p-6 md:p-7">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-iris-300">
              <Icon size={16} strokeWidth={1.7} />
            </span>
            <span className="font-display text-sm font-semibold text-white">
              {title}
            </span>
          </div>
          <span className="font-mono text-xs text-ash-500">{metric}</span>
        </div>
        <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash-600">
          {subtitle}
        </p>
        <div className="mt-6 flex flex-1 items-center justify-center">
          {children}
        </div>
      </div>
    </Reveal>
  );
}

export function Statistics({ projectCount = 20 }: { projectCount?: number }) {
  return (
    <section id="stats" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Reveal>
            <SectionLabel index="05" title="Metrics" meta="By the numbers" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-8 text-section-title font-display font-medium text-white">
              Built for{" "}
              <span className="font-serif font-light italic">performance</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md font-light leading-relaxed text-ash-400">
              A snapshot of how the work performs — shipping cadence, delivery
              reliability and code output across recent projects.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <StatCard
            icon={Activity}
            title="Project Health"
            metric="100%"
            subtitle="Build & deploy status"
            delay={0.1}
          >
            <RingGauge pct={0.86} center={`${projectCount}+`} label="Shipped" />
          </StatCard>
          <StatCard
            icon={TrendingUp}
            title="Delivery Success"
            metric="98.6%"
            subtitle="On-time · on-spec"
            delay={0.18}
          >
            <BarChart />
          </StatCard>
          <StatCard
            icon={Code2}
            title="Code Output"
            metric="1.4k"
            subtitle="Commits this year"
            delay={0.26}
          >
            <SemiGauge pct={0.72} center="1.4k" label="Commits" />
          </StatCard>
        </div>
      </div>
    </section>
  );
}
