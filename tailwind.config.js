/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        nasa: {
          blue: "#0B3D91",
          red: "#FC3D21",
          dark: "#1a1a1a",
        },
      },
      fontFamily: {
        nasa: ["Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
