/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darlMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mplus: ["Noto Sans TC", "sans-serif", "Verdana"],
      },
    },
  },
  plugins: [],
};
