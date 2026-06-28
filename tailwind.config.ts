import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 하늘하늘 dreamy palette — soft sky, lavender, peach
        sky: {
          mist: "#eaf3fb",
          soft: "#d6e8f7",
          dream: "#b9d6f2",
        },
        lavender: {
          mist: "#f1ecfb",
          soft: "#e3d8f6",
          dream: "#cdbcf0",
        },
        peach: {
          mist: "#fdeef0",
          soft: "#fbdde4",
        },
        ink: {
          DEFAULT: "#3a3a44",
          soft: "#6b6b7a",
          faint: "#a3a3b0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Pretendard", "system-ui", "sans-serif"],
      },
      boxShadow: {
        dream: "0 10px 40px -12px rgba(150, 170, 220, 0.35)",
        glow: "0 0 30px -8px rgba(185, 214, 242, 0.7)",
      },
      backgroundImage: {
        "sky-wash":
          "linear-gradient(160deg, #eaf3fb 0%, #f1ecfb 45%, #fdeef0 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-24px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        shimmer: "shimmer 8s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
