const path = require('path');

const config = {
  name: {
    script: 'gde_script',
    style: 'gde_styles',
  },
  paths: {
    entry: path.resolve(__dirname, 'src/script.js'),
    vendor: path.resolve(__dirname, 'src/vendor.js'),
    output: path.resolve(__dirname, 'extension/lib')
  }
}

module.exports = config;