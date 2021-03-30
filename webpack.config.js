const path = require("path");
module.exports = {
  entry: "./src/background.js",
  output: {
    path: path.resolve("build"),
    filename: "background.js",
  },
};
