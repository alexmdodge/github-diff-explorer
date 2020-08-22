const webpack = require('webpack')
const common = require('./webpack.common');
const { merge } = require('webpack-merge')

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      GDE_GLOBAL: {
        IS_DEV: true,
      }
    }),
  ],
})