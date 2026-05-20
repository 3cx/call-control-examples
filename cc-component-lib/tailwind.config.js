/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#212121",
        darklight: "#403f3f",
        bghover: "#666565",
        tsxblue: "#2196f3",
      }
    },
  },
  plugins: [],
}