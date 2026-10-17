/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // corepak components ship prebuilt in node_modules; Tailwind skips node_modules unless listed
    "./node_modules/@funsociety/corepak/dist/pilgrimage/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        alpine: {
          bg: "#041824",
          surface: "#072235",
          card: "#0a2e46",
          hover: "#0e3b59",
          border: "#154e75",
          powder: "#f0fdfa",
          snow: "#ccfbf1",
          ice: "#22d3ee",
          frost: "#06b6d4",
          blizzard: "#00f5d4",
          gold: "#f59e0b",
          goldDim: "#b45309",
          pine: "#10b981",
          muted: "#64748b",
          text: "#e0f2fe",
        },
        ocean: {
          deep: "#041824",
          trench: "#072235",
          reef: "#0a2e46",
          swell: "#0284c7",
          turquoise: "#06b6d4",
          foam: "#f0fdfa",
          sand: "#fde68a",
          sunset: "#f97316",
          coral: "#fb7185",
          kelp: "#10b981",
        }
      },
      fontFamily: {
        mono: [
          "'JetBrains Mono'",
          "'Fira Code'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        'glow-powder': '0 0 25px rgba(240, 253, 250, 0.35)',
        'glow-ice': '0 0 25px rgba(6, 182, 212, 0.45)',
        'glow-blizzard': '0 0 30px rgba(0, 245, 212, 0.45)',
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.45)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'blizzard-spin': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
}
