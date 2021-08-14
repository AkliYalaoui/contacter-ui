module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      textColor: {
        primary: "#00BFA6",
      },
      borderColor: (theme) => ({
        DEFAULT: theme("colors.gray.300", "currentColor"),
        primary: "#00BFA6",
      }),
      backgroundColor: (theme) => ({
        primary: "#00BFA6",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
