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
        hedon:{
        brown: '#2A1810',
        brass: '#C9A961',
        cream: '#F5EFE0',
        tobacco: '#8B6F47',
              },
        moto: {
          black: "#0A0A0A",
          bone: "#F4F1EC",
          grey: "#6B6B6B",
          line: "#2A2A2A",
          signal: "#E63946",
              },    
      },
      fontFamily: {
        display: ["var(--font-rider)", "sans-serif"],
        body: ["var(--font-almaq)", "sans-serif"],
        sans: ["var(--font-almaq)", "sans-serif"],
        rider: ['Lhopital Rider', 'serif'],
        almaq: ['Almaq Refined', 'sans-serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],

      },
    },
  },
  plugins: [],
} satisfies Config;