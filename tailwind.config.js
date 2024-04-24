/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx}",
  "./src/components/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  fontFamily: {
    sans: ["var(--font-roboto)"],
  },
  extend: {
    colors: {
      darkBlue: "#5682c2",
      lightBlue: "#416394",
      // hoverColor: "",
    },
  },
  variants: {
    extend: {},
  },
};
export const plugins = [];
