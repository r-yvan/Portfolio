"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { LocalTime } from "@/components/ui/LocalTime";
import { Magnetic } from "@/components/ui/Magnetic";
import { RichHeading } from "@/components/ui/RichHeading";
import { useSceneActive, useScenePalette } from "@/components/three/shared";
import type { Profile, Social } from "@/lib/content/schema";
import type { NavItem } from "@/lib/site-config";

const ShardsScene = dynamic(() => import("@/components/three/ShardsScene"), { ssr: false });

export function Footer({ profile, socials, nav }: { profile: Profile; socials: Social[]; nav: NavItem[] }) {
  const scrollTo = useScrollTo();
  const stageRef = useRef<HTMLDivElement>(null);
  const active = useSceneActive(stageRef);
  const palette = useScenePalette();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-fg/10">
      {/* 3D stage: floating faceted shards */}
      <div ref={stageRef} className="relative">
        <div className="absolute inset-0">
          <ShardsScene palette={palette} active={active} />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 45% 42% at 50% 50%, rgb(var(--canvas) / 0.9), rgb(var(--canvas) / 0.5) 60%, transparent 90%)",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center md:px-12 md:py-44">
          <span className="label inline-flex items-center gap-2.5 border border-fg/10 bg-canvas/60 px-3 py-2 backdrop-blur-md">
            <span className={profile.available ? "h-2 w-2 bg-accent" : "h-2 w-2 bg-subtle"} />
            {profile.available ? profile.availability : "Currently booked"}
          </span>
          <RichHeading
            markup="Let's create _something_ *great.*"
            className="mt-8 max-w-[14ch] text-balance text-[clamp(2.75rem,8.5vw,7.5rem)] font-medium leading-[0.88] tracking-tightest"
          />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Magnetic strength={0.3}>
              <a href={`mailto:${profile.email}`} className="btn btn-primary group">
                <span>Start a project</span>
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <button onClick={() => scrollTo(0)} className="btn btn-ghost bg-canvas/40 backdrop-blur-md">
                <ArrowUp size={15} />
                <span>Back to top</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="relative border-t border-fg/10 bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 md:px-12 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center border border-fg/20 text-[0.8rem] font-bold">
                {profile.initials}
                <span className="absolute -right-[3px] -top-[3px] h-1.5 w-1.5 bg-accent" />
              </span>
              <span className="font-medium">{profile.displayName}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{profile.title}. {profile.location}.</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2.5">
            <span className="label mb-2">Navigate</span>
            {nav.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="w-fit text-sm text-muted transition-colors hover:text-accent"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5">
            <span className="label mb-2">Elsewhere</span>
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target={s.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
              >
                {s.label}
                <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="label mb-2">Local time</span>
            <LocalTime timeZone={profile.timezone} withSeconds showZone className="text-sm tabular" />
            <span className="text-sm text-muted">{profile.location}</span>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-fg/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:px-12">
          <span className="label">
            © {year} {profile.fullName}
          </span>
          <span className="label">
            Next.js · Three.js · Framer Motion · Map data ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              OpenStreetMap contributors
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
