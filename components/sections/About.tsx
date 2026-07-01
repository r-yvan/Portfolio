"use client";

import dynamic from "next/dynamic";
import { Mail, MapPin, Phone } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { site } from "@/lib/site";

const Globe = dynamic(() => import("@/components/three/Globe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full bg-iris-600/20 blur-xl" />
    </div>
  ),
});

/** Decorative L-shaped corner brackets (armory reference). */
function Corners() {
  const base = "absolute h-4 w-4 border-iris-500/40";
  return (
    <>
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

export function About() {
  return (
    <section id="about" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel
            index="01"
            title="About"
            meta="The human behind the code"
          />
        </Reveal>

        <Reveal delay={0.05} className="mt-8 max-w-4xl">
          <h2 className="text-section-title font-display font-medium text-white">
            Where engineering precision meets{" "}
            <span className="font-serif font-normal italic text-ash-100">
              visual obsession
            </span>
            .
          </h2>
        </Reveal>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">
          {/* Narrative + stats + contact */}
          <div>
            <div className="max-w-xl space-y-5">
              {site.bio.map((paragraph, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <p className="text-lg font-light leading-relaxed text-ash-400">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 xl:grid-cols-4">
              {site.stats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={i * 0.08}
                  className="bg-ink-900/60 p-5"
                >
                  <div className="font-display text-3xl font-bold text-white md:text-4xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-widest text-ash-500">
                    {stat.label}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal
              delay={0.2}
              className="mt-10 flex flex-col gap-3 font-mono text-sm text-ash-400"
            >
              <a
                href={`mailto:${site.email}`}
                className="flex w-fit items-center gap-3 transition-colors hover:text-iris-300"
              >
                <Mail size={16} className="text-iris-400" />
                {site.email}
              </a>
              <a
                href={`tel:${site.phone}`}
                className="flex w-fit items-center gap-3 transition-colors hover:text-iris-300"
              >
                <Phone size={16} className="text-iris-400" />
                {site.phone}
              </a>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-iris-400" />
                {site.location}
              </div>
            </Reveal>
          </div>

          {/* 3D Globe */}
          <Reveal delay={0.15} className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-md p-6">
              <Corners />
              <div className="absolute inset-0">
                <Globe />
              </div>
              <div className="pointer-events-none absolute left-6 top-6 font-mono text-[0.62rem] uppercase tracking-widest text-ash-500">
                <div className="text-iris-400">● Home base</div>
                <div className="mt-1 text-ash-400">{site.location}</div>
              </div>
              <div className="pointer-events-none absolute bottom-6 right-6 text-right font-mono text-[0.58rem] uppercase tracking-widest text-ash-600">
                {site.coordinates.lat}° S / {site.coordinates.lng}° E
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
