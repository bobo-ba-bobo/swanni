import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // hip editorial — bone paper, ink black, one loud flame accent
        bone: {
          DEFAULT: "#ece7dd",
          soft: "#f4f0e8",
          card: "#fbf8f2",
        },
        ink: {
          DEFAULT: "#16150f",
          soft: "#56524a",
          faint: "#928c7e",
        },
        flame: {
          DEFAULT: "#ff4a1c",
          soft: "#ff7a52",
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
        "hard-flame": "4px 4px 0 0 #ff4a1c",
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
