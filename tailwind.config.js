module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        connected: {
          "75%, 100%": {
            opacity: ".5",
          },
        },
      },
      animation: {
        connected: "connected 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      textColor: {
        primary: "#00BFA6",
      },
      borderColor: (theme) => ({
        DEFAULT: theme("colors.gray.300", "currentColor"),
        primary: "#00BFA6",
      }),
      backgroundColor: (theme) => ({
        primary: "#00BFA6",
        dark900: "#27241D",
        dark800: "#423D33",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
