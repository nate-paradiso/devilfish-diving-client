/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx}",
  "./src/components/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      sans: ["var(--font-roboto)", "sans-serif"],
      oleoScript: ["Oleo Script", "cursive"],
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    colors: {
      darkBlue: "#5682c2",
      lightBlue: "#416394",
      hoverColor: "#929292",
      nav: "#094898",
    },
    backgroundImage: {
      "dark-to-light": "linear-gradient(to bottom, #063168, #0a53b0)",
    },
  },
  variants: {
    extend: {},
  },
};
export const plugins = [];
