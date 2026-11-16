import type { Config } from "tailwindcss";

/**
 * Design tokens — red / black / grey, sharp edges, Satoshi everywhere.
 *
 * Every colour is a CSS variable (see app/globals.css) so the same class
 * names render correctly in both the dark and the light theme:
 *   canvas   — page background (canvas-2: alternate band)
 *   surface  — raised panels / cards
 *   fg       — primary text + hairlines (use fg/10 etc. for borders)
 *   muted    — secondary text
 *   subtle   — tertiary text, labels, muted headline lead-ins
 *   accent   — the red (accent-fg is the text colour placed on it)
 */
const withAlpha = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Sharp UI: every radius collapses to 0 except `full` (tiny status dots).
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "9999px",
    },
    extend: {
      colors: {
        canvas: {
          DEFAULT: withAlpha("--canvas"),
          2: withAlpha("--canvas-2"),
        },
        surface: withAlpha("--surface"),
        fg: withAlpha("--fg"),
        muted: withAlpha("--muted"),
        subtle: withAlpha("--subtle"),
        accent: {
          DEFAULT: withAlpha("--accent"),
          deep: withAlpha("--accent-deep"),
          fg: withAlpha("--accent-fg"),
        },
      },
      fontFamily: {
        sans: [
          "Satoshi",
          '"Satoshi Fallback"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      // Tighter than Tailwind's defaults across the board — Satoshi at
      // display sizes wants negative tracking.
      letterSpacing: {
        tight: "-0.045em",
        tighter: "-0.06em",
        tightest: "-0.072em",
      },
      // Tighter text blocks site-wide.
      lineHeight: {
        snug: "1.28",
        relaxed: "1.5",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "scan-y": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "ping-square": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "scan-y": "scan-y 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        blink: "blink 1.1s steps(1) infinite",
        "ping-square": "ping-square 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
