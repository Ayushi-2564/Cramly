/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        accent: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        heading: ["Syne", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px rgba(139, 92, 246, 0.35)",
      },
    },
  },
  plugins: [],
};