"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Github, Instagram, Mail } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { useLenis } from "@/components/providers/SmoothScroll";
import { site } from "@/lib/site";

// Three.js scene is browser-only — load without SSR to avoid hydration issues.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const socials = [
  { icon: Github, ...site.socials.github },
  { icon: Instagram, ...site.socials.instagram },
  { icon: Mail, ...site.socials.email },
];

export function Hero() {
  const lenis = useLenis();

  const go = (href: string) => {
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-24 pt-32 md:px-12"
    >
      {/* 3D nebula + crystalline core */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-b from-transparent to-ink-950" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ink-950 via-ink-950/85 to-transparent" />

      {/* Corner technical tag (Linear reference) */}
      <div className="pointer-events-none absolute right-6 top-28 z-10 hidden font-mono text-[0.7rem] uppercase tracking-[0.3em] text-ash-700 md:block">
        FIG 0.1 / HERO
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="section-label mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-iris-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-iris-400" />
          </span>
          {site.displayName} — Software Engineer & Designer
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="font-display text-[clamp(2.6rem,7.4vw,6.4rem)] font-medium leading-[0.94] tracking-tight text-white"
        >
          <span className="block">
            I build{" "}
            <span className="font-serif font-light italic text-ash-100">
              digital
            </span>
          </span>
          <span className="block">
            <span className="relative font-serif font-light italic text-ash-100">
              experiences
              <span className="absolute -bottom-1 left-0 h-px w-full bg-iris-400/70" />
            </span>{" "}
            for
          </span>
          <span className="block">
            <span className="relative font-serif font-light italic text-ash-100">
              ambitious
              <span className="absolute -bottom-1 left-0 h-px w-full bg-iris-400/70" />
            </span>{" "}
            ideas<span className="text-ash-500">.</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
          className="mt-8 max-w-md font-body text-base font-light leading-relaxed text-ash-400/90 md:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic strength={0.4}>
            <button
              onClick={() => go("#work")}
              data-cursor="hover"
              className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink-950 transition-colors hover:bg-ash-100"
            >
              View my work
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </Magnetic>
          <Magnetic strength={0.4}>
            <button
              onClick={() => go("#contact")}
              data-cursor="hover"
              className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-ash-200 transition-colors hover:border-white/30 hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-iris-400" />
              Get in touch
            </button>
          </Magnetic>

          <div className="ml-2 flex items-center gap-1">
            {socials.map(({ icon: Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ash-500 transition-colors hover:text-white"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-6 font-mono text-xs text-ash-500"
        >
          {[
            { v: "3+", l: "Years building" },
            { v: "20+", l: "Projects shipped" },
            { v: "15+", l: "Technologies" },
          ].map((s) => (
            <div key={s.l} className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-[1px] bg-iris-400" />
              <span className="text-base font-semibold text-white">{s.v}</span>
              <span className="uppercase tracking-widest">{s.l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => go("#about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ash-500"
        aria-label="Scroll to about"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.4em]">
          Scroll
        </span>
        <span className="relative flex h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-iris-400 to-transparent"
          />
        </span>
        <ArrowDown size={14} className="text-ash-500" />
      </motion.button>
    </section>
  );
}
