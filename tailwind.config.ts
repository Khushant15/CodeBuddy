import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        neon: {
          green: "#00ff87",
          lime: "#a3ff00",
          violet: "#bf5fff",
          cyan: "#00e5ff",
          orange: "#ff6b2b",
          pink: "#ff2d78",
        },
        void: {
          50: "#f0f0f5",
          100: "#d1d0e0",
          200: "#a3a0c8",
          300: "#7570b0",
          400: "#474398",
          500: "#1a1730",
          600: "#13112a",
          700: "#0e0c20",
          800: "#080717",
          900: "#04040e",
          950: "#020208",
        },
      },
      keyframes: {
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "flicker": {
          "0%,100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.4" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.6" },
          "97%": { opacity: "1" },
        },
        "glow-pulse": {
          "0%,100%": { boxShadow: "0 0 5px currentColor, 0 0 20px currentColor" },
          "50%": { boxShadow: "0 0 20px currentColor, 0 0 60px currentColor, 0 0 100px currentColor" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "counter": {
          from: { opacity: "0", transform: "scale(0.8) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "border-spin": {
          "100%": { transform: "rotate(360deg)" },
        },
        "matrix-rain": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(100px)" },
        },
      },
      animation: {
        "scan-line": "scan-line 4s linear infinite",
        "flicker": "flicker 5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-left": "slide-left 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "counter": "counter 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "border-spin": "border-spin 4s linear infinite",
        "matrix-rain": "matrix-rain 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
