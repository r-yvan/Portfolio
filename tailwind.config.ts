import type { Config } from "tailwindcss";

/**
 * Design tokens for Yvan Rubuto's portfolio.
 * Palette derived from the brief: deep blacks (ink), greyscale (ash),
 * and a blueviolet accent spectrum (iris). Typography pairs a geometric
 * display face (Lay Grotesk) with Space Grotesk for body + UI.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050505",
          900: "#0A0A0A",
          850: "#0D0D0D",
          800: "#111113",
        },
        ash: {
          900: "#1A1A1A",
          800: "#2C2C2C",
          700: "#3D3D3D",
          500: "#6B6B6B",
          400: "#A0A0A0",
          100: "#F8F8F8",
        },
        iris: {
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7B5EA7",
          700: "#6D28D9",
        },
      },
      fontFamily: {
        display: [
          '"Lay Grotesk"',
          '"Space Grotesk"',
          "system-ui",
          "sans-serif",
        ],
        body: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(139,92,246,0.45)",
        "glow-sm": "0 0 24px -8px rgba(139,92,246,0.55)",
        "glow-lg": "0 0 140px -20px rgba(139,92,246,0.40)",
        card: "0 20px 60px -25px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "iris-radial":
          "radial-gradient(circle at center, rgba(139,92,246,0.18), transparent 70%)",
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-reverse": "marquee-reverse 38s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 22s linear infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
