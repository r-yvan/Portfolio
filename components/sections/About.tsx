"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Crosshairs } from "@/components/ui/Crosshairs";
import { LocalTime } from "@/components/ui/LocalTime";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSceneActive, useScenePalette } from "@/components/three/shared";
import type { Profile } from "@/lib/content/schema";

const MapScene = dynamic(() => import("@/components/three/MapScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="label animate-pulse">Loading map…</span>
    </div>
  ),
});

const MAP_MASK = "radial-gradient(ellipse 50% 50% at 50% 50%, #000 52%, transparent 100%)";

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-fg/10 text-subtle transition-colors group-hover:border-accent group-hover:text-accent">
        <Icon size={15} strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="label block">{label}</span>
        <span className="mt-1.5 block truncate text-sm text-fg">{value}</span>
      </span>
      {href ? (
        <ArrowUpRight
          size={15}
          className="text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      ) : null}
    </>
  );
  const cls = "group flex items-center gap-4 border-b border-fg/10 py-3.5";
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function About({ index, profile }: { index: string; profile: Profile }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const active = useSceneActive(mapRef);
  const palette = useScenePalette();
  const { lat, lng } = profile.coordinates;

  return (
    <section id="about" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index={index}
          label="About"
          meta="The human behind the code"
          title="_Where engineering precision meets_ *visual obsession.*"
        />

        <div className="mt-16 grid items-start gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div>
            <div className="max-w-xl space-y-5">
              {profile.bio.map((paragraph, i) => (
                <Reveal key={i} delay={0.08 + i * 0.08}>
                  <p className={i === 0 ? "text-xl leading-relaxed text-fg md:text-2xl" : "text-base leading-relaxed text-muted md:text-lg"}>
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-12 max-w-xl border-t border-fg/10">
              <ContactRow icon={Mail} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
              {profile.phone ? (
                <ContactRow
                  icon={Phone}
                  label="Phone"
                  value={profile.phone}
                  href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                />
              ) : null}
              <ContactRow
                icon={MapPin}
                label="Based in"
                value={
                  <>
                    {profile.area ? `${profile.area} — ` : ""}
                    {profile.location} · <LocalTime timeZone={profile.timezone} className="tabular" /> local
                  </>
                }
              />
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div ref={mapRef} className="relative mx-auto aspect-square w-full max-w-[34rem] border border-fg/10 bg-canvas">
              <Crosshairs />
              <div className="absolute inset-0" style={{ WebkitMaskImage: MAP_MASK, maskImage: MAP_MASK }}>
                <MapScene
                  palette={palette}
                  active={active}
                  home={{ lat, lng }}
                  label={(profile.area || profile.location).split(",")[0]}
                />
              </div>
              <div className="pointer-events-none absolute left-5 top-5">
                <div className="label flex items-center gap-2 text-accent">
                  <span className="h-1.5 w-1.5 bg-accent" /> Home base
                </div>
                <div className="mt-2 text-sm text-fg">{profile.area || profile.location}</div>
                {profile.area ? <div className="mt-0.5 text-xs text-subtle">{profile.location}</div> : null}
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="label absolute right-5 top-5 normal-case tracking-normal text-subtle/80 transition-colors hover:text-accent"
              >
                © OpenStreetMap
              </a>
              <div className="label pointer-events-none absolute bottom-5 right-5 text-right tabular">
                {Math.abs(lat).toFixed(4)}° {lat < 0 ? "S" : "N"} / {Math.abs(lng).toFixed(4)}° {lng < 0 ? "W" : "E"}
              </div>
              <div className="label pointer-events-none absolute bottom-5 left-5">Fig 1.0 — Home</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
