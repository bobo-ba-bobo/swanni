import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // hip editorial — white paper, ink black, one fresh mint accent
        bone: {
          DEFAULT: "#ffffff",
          soft: "#f4f5f4",
          card: "#ffffff",
        },
        ink: {
          DEFAULT: "#16150f",
          soft: "#56524a",
          faint: "#9a968d",
        },
        mint: {
          DEFAULT: "#10c8a0",
          soft: "#6fe3ca",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        hard: "4px 4px 0 0 #16150f",
        "hard-lg": "7px 7px 0 0 #16150f",
        "hard-mint": "4px 4px 0 0 #10c8a0",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.2,0.8,0.2,1) both",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
