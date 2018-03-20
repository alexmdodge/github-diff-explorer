const path = require('path');

const config = {
  paths: {
    entry: path.resolve(__dirname, "src/script.js"),
    output: path.resolve(__dirname, "extension/lib"),
  }
}

module.exports = config;