/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx}",
  "./src/components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      linkHover: "#21334f",
      darkBlue: "#21334f",
      lightBlue: "#5682c2",
    },
  },
  variants: {
    extend: {},
  },
};
export const plugins = [];
