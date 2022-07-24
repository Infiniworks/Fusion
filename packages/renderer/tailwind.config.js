/** @type {import('tailwindcss').Config} */
const path = require("path");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    path.join(__dirname, "./index.html"),
    path.join(__dirname, "./src/**/*.{ts,html,js,svelte}"),
  ],
  theme: {
    extend: {
      fontFamily: {
      sans: ["Inter var", ...defaultTheme.fontFamily.sans],
    },},
  },
  plugins: [],
};
