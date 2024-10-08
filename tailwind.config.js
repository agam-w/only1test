import twReactAriaComponents from "tailwindcss-react-aria-components";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["**/*.{jsx,tsx}"],
  darkMode: "selector",
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [twReactAriaComponents()],
};
