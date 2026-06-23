import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F9F4F7",
        sand: "#F0E6EE",
        terracotta: "#B64479",
        gold: "#F1A6C5",
        "warm-dark": "#12252D",
        "warm-mid": "#582B59",
        "warm-light": "#687D76",
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
