const flexbugsFixes = require('postcss-flexbugs-fixes');
const cssnext = require('postcss-cssnext');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');

module.exports = {
  plugins: [
    postcssImport,
    postcssUrl,
    cssnext,
    flexbugsFixes,
  ],
};
