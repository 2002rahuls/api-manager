/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background-rgb))",
        foreground: "rgb(var(--foreground-rgb))",
        blue: {
          600: "#2563eb",
          700: "#1d4ed8",
        },
        yellow: {
          500: "#f59e0b",
          600: "#d97706",
        },
        red: {
          600: "#dc2626",
          700: "#b91c1c",
        },
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          600: "#4f46e5",
        },
        gray: {
          50: "#f9fafb",
          300: "#d1d5db",
        },
        dark: {
          primary: "#1a1b26",
          secondary: "#24283b",
          accent: "#7aa2f7",
          text: "#a9b1d6",
          muted: "#565f89",
        },
      },
    },
  },
  plugins: [],
};
