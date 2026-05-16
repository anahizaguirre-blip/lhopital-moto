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
        hedon: {
          brown: "#2A1810",
          brass: "#C9A961",
          cream: "#F5EFE0",
          tobacco: "#8B6F47",
        },
        moto: {
          black: "#0A0A0A",
          bone: "#F4F1EC",
          grey: "#6B6B6B",
          line: "#2A2A2A",
          signal: "#FF6B35",
        },
      },
      fontFamily: {
        // ─── GLOBALES (Hedon + home dependen de esto) ───
        display: ["var(--font-rider)", "sans-serif"],
        body: ["var(--font-almaq)", "sans-serif"],
        sans: ["var(--font-almaq)", "sans-serif"],
        rider: ["var(--font-rider)", "serif"],
        almaq: ["var(--font-almaq)", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        "hedon-display": ["var(--font-cormorant)", "serif"],
        // ─── MOTO II (clases nuevas, no chocan con nada) ───
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;