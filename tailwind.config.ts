import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: { sweep: "sweep 3s linear infinite" },
      keyframes: { sweep: { to: { transform: "rotate(360deg)" } } },
      colors: {
        base: { DEFAULT: "#0B0B14", raised: "#14141F", line: "#2A2A3C" },
        surface: "#14141F",
        primary: "#FF2E88",
        secondary: "#00E5FF",
        accent: "#FFB300",
        ink: "#F2F2F7",
        "ink-faint": "#8E8EA3", "ink-dim": "#B4B4C4", signal: { DEFAULT: "#00E5FF", soft: "#00E5FF22" }, conf: { official: "#3ED598", multi: "#4C9AFF", probable: "#E8C23A", rumor: "#E8813A", leak: "#B478F0", unverified: "#5C616D" },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(255, 46, 136, 0.3)",
        "neon-cyan": "0 0 20px rgba(0, 229, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
