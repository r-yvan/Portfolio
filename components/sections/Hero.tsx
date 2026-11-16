"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { Counter } from "@/components/ui/Counter";
import { Crosshairs } from "@/components/ui/Crosshairs";
import { Magnetic } from "@/components/ui/Magnetic";
import { RichHeading } from "@/components/ui/RichHeading";
import { Scramble } from "@/components/ui/Scramble";
import { useSceneActive, useScenePalette } from "@/components/three/shared";
import type { Profile, Stat } from "@/lib/content/schema";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (roles.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2800);
    return () => window.clearInterval(id);
  }, [roles.length]);
  return <Scramble text={roles[index] ?? ""} playOnMount duration={600} />;
}

const STAT_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

export function Hero({ profile, stats }: { profile: Profile; stats: Stat[] }) {
  const scrollTo = useScrollTo();
  const sectionRef = useRef<HTMLElement>(null);
  const active = useSceneActive(sectionRef);
  const palette = useScenePalette();

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pb-12 pt-28 md:px-12 md:pt-32"
    >
      {/* 3D: grey cube wave field (on solid black — no grid behind it) */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.2 }}
        className="absolute inset-0 z-0"
      >
        <HeroScene palette={palette} active={active} />
      </motion.div>
      {/* legibility: soft radial scrim behind the copy + bottom fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 50% 54%, rgb(var(--canvas) / 0.82), rgb(var(--canvas) / 0.35) 60%, transparent 85%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-b from-transparent to-canvas"
      />

      {/* Centered copy — weighted toward the lower part of the viewport */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center text-center">
        <div aria-hidden className="min-h-10 flex-[1.7]" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="label mb-3 inline-flex items-center gap-2 border border-fg/10 bg-canvas/60 px-2.5 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            {profile.available && (
              <span className="absolute inline-flex h-full w-full animate-ping-square bg-accent" />
            )}
            <span className={profile.available ? "relative h-2 w-2 bg-accent" : "relative h-2 w-2 bg-subtle"} />
          </span>
          <span className="text-fg/80">{profile.available ? profile.availability : profile.title}</span>
        </motion.div>

        <RichHeading
          as="h1"
          markup={profile.headline}
          immediate
          delay={0.45}
          stagger={0.06}
          className="h-display max-w-[15ch] text-balance"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="label mt-3 flex items-center gap-1.5 text-muted"
        >
          <span className="text-accent">[</span>
          <RoleRotator roles={profile.roles} />
          <span className="text-accent">]</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
          className="mt-2 max-w-md text-[0.95rem] leading-snug text-muted md:text-base"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          <Magnetic strength={0.3}>
            <button onClick={() => scrollTo("#work")} className="btn btn-primary btn-sm group h-10 px-4">
              <span>View my work</span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </Magnetic>
          <Magnetic strength={0.3}>
            <button onClick={() => scrollTo("#contact")} className="btn btn-ghost btn-sm h-10 bg-canvas/40 px-4 backdrop-blur-md">
              <span>Get in touch</span>
            </button>
          </Magnetic>
        </motion.div>
        <div aria-hidden className="flex-[0.3]" />
      </div>

      {/* Stats strip — framed grid with registration marks */}
      {stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.45, ease: EASE }}
          className="relative z-10 mx-auto mt-7 w-full max-w-4xl"
        >
          <div className="relative border border-fg/10 bg-canvas/55 backdrop-blur-md">
            <Crosshairs />
            <dl className={`grid divide-x divide-fg/10 ${STAT_COLS[Math.min(stats.length, 4)]}`}>
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={i > 1 ? "hidden px-4 py-3 text-left sm:block" : "px-4 py-3 text-left"}
                >
                  <dt className="label">{stat.label}</dt>
                  <dd className="mt-1.5 text-xl font-medium tracking-tight tabular md:text-2xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      )}
    </section>
  );
}
