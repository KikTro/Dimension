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
        admin: {
          bg: "#0B0D11",
          card: "#12151C",
          surface: "#181D26",
          border: "#232A36",
          hover: "#1D232E",
          text: "#E2E8F0",
          muted: "#8A94A6",
          accent: "#2563EB",
          danger: "#DC2626",
          success: "#16A34A",
          warning: "#D97706",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
