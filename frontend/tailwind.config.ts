import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#06080D",
          secondary: "#0A0F16",
          surface: "#0E141D",
          elevated: "#121A24",
          card: "#0E141D",
          hover: "#182230"
        },
        accent: {
          cyan: "#00E5FF",
          blue: "#4F8CFF",
          glow: "rgba(0, 229, 255, 0.15)",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#CBD5E1",
          muted: "#64748B"
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(0, 229, 255, 0.35)",
          active: "#00E5FF"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 229, 255, 0.25)',
        'cyan-sm': '0 0 10px rgba(0, 229, 255, 0.15)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
};
export default config;
