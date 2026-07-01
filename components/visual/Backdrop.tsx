// Irregular line positions (%) — non-uniform on purpose so the viewport reads
// as large editorial tiles rather than a repeating grid.
const V_LINES = [13, 27, 41, 59, 73, 88];
const H_LINES = [19, 44, 67, 85];

// A handful of intersections get a faint corner bracket + node dot for the
// "UI panel" feel from the reference.
const NODES = [
  { x: 13, y: 19 },
  { x: 59, y: 19 },
  { x: 88, y: 44 },
  { x: 27, y: 67 },
  { x: 73, y: 85 },
];

/**
 * Global atmospheric layer rendered once behind all content. The viewport is
 * divided by a few thin, low-opacity lines at irregular positions — reading as
 * large editorial "tiles" — accented with faint corner brackets and node dots,
 * ambient blueviolet glows, a vignette and film grain.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Irregular dividing lines → editorial tiles */}
      <div className="absolute inset-0">
        {V_LINES.map((left, i) => (
          <span
            key={`v-${left}`}
            className="mask-fade-y absolute top-0 h-full w-px"
            style={{
              left: `${left}%`,
              background:
                i % 2 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
            }}
          />
        ))}
        {H_LINES.map((top, i) => (
          <span
            key={`h-${top}`}
            className="mask-fade-x absolute left-0 h-px w-full"
            style={{
              top: `${top}%`,
              background:
                i % 2 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
            }}
          />
        ))}
        {NODES.map(({ x, y }) => (
          <span
            key={`n-${x}-${y}`}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-white/15" />
            <span className="absolute -left-[1.5px] -top-[1.5px] h-[3px] w-[3px] rounded-full bg-iris-400/40" />
          </span>
        ))}
      </div>

      {/* Ambient iris glows */}
      <div
        className="absolute -top-[20vh] left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(160,160,170,0.05), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-10vh] right-[-10vw] h-[55vh] w-[45vw] rounded-full blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.05), transparent 70%)",
        }}
      />
      <div
        className="absolute left-[-10vw] top-[40vh] h-[45vh] w-[35vw] rounded-full blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(140,140,150,0.04), transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </div>
  );
}
