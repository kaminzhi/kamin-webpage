/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mplus: ["'Noto Sans TC'", "Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
