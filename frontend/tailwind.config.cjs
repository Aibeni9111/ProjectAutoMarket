/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      container: { center: true, padding: "1rem" },
      fontFamily: {
        sans: ["Inter","system-ui","ui-sans-serif","Segoe UI","Roboto","Arial","sans-serif"]
      }
    },
  },
  plugins: [],
}
