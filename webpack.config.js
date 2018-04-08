/* Vendor Imports */
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

/* Local Imports */
const path = require('path');
const config = require('./project.config.js');

module.exports = {
  entry: {
    [`${config.name.script}`]: config.paths.entry,
  },

  output: {
    path: config.paths.output,
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: 'babel-preset-env'
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          } , {
            loader: 'sass-loader'
          }
        ]
      }
    ],
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `${config.name.style}.css`,
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      GDE_GLOBAL: {
        IS_DEV: process.env.NODE_ENV === 'development',
      }
    }),
  ],

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],

    extensions: ['.js', '.json', '.css'],
  },
}