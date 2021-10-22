module.exports = {
  mode: "jit",
  purge: {
    enabled: true,
    content: ["./src/*.tsx", "./src/*.ts"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
