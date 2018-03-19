const path = require('path');

const config = {
  paths: {
    app: path.resolve(__dirname, "src/index.js"),
    output: path.resolve(__dirname, "lib"),
  }
}

module.exports = config;