// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'omni-emerald': '#10B981', // Your luminous accent green
        'omni-dark': '#111827',     // Main background dark
        'omni-dark-card': '#1F2937', // Slightly lighter dark for components
      },
    },
  },
  plugins: [],
}