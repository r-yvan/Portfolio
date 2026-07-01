"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY = 5500;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((dir: number) => {
    setState(([i]) => [
      (i + dir + testimonials.length) % testimonials.length,
      dir,
    ]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => paginate(1), AUTOPLAY);
    return () => clearInterval(id);
  }, [paused, paginate, index]);

  const active = testimonials[index];

  return (
    <section className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-5xl">
        <Reveal className="flex justify-center">
          <SectionLabel index="07" title="Kind Words" meta="Testimonials" />
        </Reveal>

        <div
          className="relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Quote
            className="mx-auto mb-8 text-white/10"
            size={56}
            strokeWidth={1}
          />

          <div className="relative min-h-[18rem] overflow-hidden md:min-h-[15rem]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
                transition={{ duration: 0.6, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) paginate(1);
                  else if (info.offset.x > 80) paginate(-1);
                }}
                className="absolute inset-0 flex cursor-grab flex-col items-center text-center active:cursor-grabbing"
              >
                <p className="max-w-3xl font-display text-2xl font-light leading-snug text-ash-100 md:text-[2rem]">
                  &ldquo;{active.quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 font-display text-sm font-bold text-ash-300">
                    {initials(active.name)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">{active.name}</div>
                    <div className="font-mono text-xs uppercase tracking-widest text-ash-500">
                      {active.role} · {active.company}
                    </div>
                  </div>
                </div>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={() => paginate(-1)}
              data-cursor="hover"
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ash-400 transition-colors hover:border-white/30 hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-6 bg-iris-400" : "w-1.5 bg-white/20",
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              data-cursor="hover"
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ash-400 transition-colors hover:border-white/30 hover:text-white"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
