/**
 * Global layer behind every section: two hairline "rails" running the full
 * height of the page, set a little outside the content column, and in dark
 * mode a soft vignette. The page itself is pure black — no grid, no grain.
 */
// Content edge = max(section padding, centred 80rem column); rails sit 2rem
// further out, but never closer than 0.75rem to the viewport edge.
const RAIL_OFFSET = "max(0.75rem, calc(max(var(--rail), calc((100vw - 80rem) / 2)) - 2rem))";

export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <span className="absolute inset-y-0 w-px bg-fg/[0.07]" style={{ left: RAIL_OFFSET }} />
      <span className="absolute inset-y-0 w-px bg-fg/[0.07]" style={{ right: RAIL_OFFSET }} />

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
