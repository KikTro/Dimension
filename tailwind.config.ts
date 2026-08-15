import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBFBF9",
        foreground: "#121417",
        paper: {
          50: "#FFFFFF",
          100: "#FBFBF9",
          200: "#F4F3EE",
          300: "#EBEAE4",
          400: "#DDD9CE",
          500: "#C4BFB2",
        },
        ink: {
          DEFAULT: "#121417",
          muted: "#4A4F58",
          subtle: "#767C87",
          faint: "#A5ABB5",
        },
        terracotta: {
          DEFAULT: "#B85834",
          hover: "#A04A27",
          light: "#F9ECE6",
          faint: "rgba(184, 88, 52, 0.08)",
        },
        prussian: {
          DEFAULT: "#1E2C3A",
          dark: "#141E28",
          light: "#2C3F52",
        },
        studio: {
          black: "#111214",
          surface: "#181A1D",
          border: "#282B30",
          grid: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Instrument Serif", "Playfair Display", "serif"],
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "editorial": "0 20px 40px -15px rgba(18, 20, 23, 0.07)",
        "subtle": "0 1px 3px 0 rgba(18, 20, 23, 0.04), 0 1px 2px -1px rgba(18, 20, 23, 0.03)",
        "elevated": "0 10px 30px -5px rgba(18, 20, 23, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
