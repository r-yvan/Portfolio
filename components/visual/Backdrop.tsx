/**
 * Global atmosphere behind every section: two hairline "rails" aligned to the
 * content column (they tie the sharp frames together, blueprint-style), film
 * grain and a vignette. The square grid lives only inside the hero now.
 */
export function Backdrop() {
  return (
    <div aria-hidden className="grain pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Content-column rails (match max-w-7xl + section padding) */}
      <span
        className="absolute inset-y-0 w-px bg-fg/[0.06]"
        style={{ left: "max(var(--rail), calc((100vw - 80rem) / 2))" }}
      />
      <span
        className="absolute inset-y-0 w-px bg-fg/[0.06]"
        style={{ right: "max(var(--rail), calc((100vw - 80rem) / 2))" }}
      />

      {/* Vignette — dark theme only */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
