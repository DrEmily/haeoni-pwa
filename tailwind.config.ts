import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "system-ui", "sans-serif"],
      },
      animation: {
        "slide-up": "slideUp 280ms ease-out both",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "spin-slow": "spin 1.2s linear infinite",
        "wave-1": "waveFlow1 8s linear infinite",
        "wave-2": "waveFlow2 11s linear infinite",
        "sway-light": "sway 4s ease-in-out infinite",
        "sway-medium": "sway 2.4s ease-in-out infinite",
        "sway-strong": "sway 1.4s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "pop-in": "popIn 360ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        waveFlow1: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        waveFlow2: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 1px 8px rgba(15,23,42,0.04)",
        "card-hover":
          "0 6px 24px rgba(56,189,248,0.16), 0 1px 2px rgba(15,23,42,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
