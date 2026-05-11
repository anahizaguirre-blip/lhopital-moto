import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["var(--font-rider)", "sans-serif"],
        body: ["var(--font-almaq)", "sans-serif"],
        sans: ["var(--font-almaq)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;