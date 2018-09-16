/* Vendor Imports */
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

/* Local Imports */
const path = require('path');
const { name, paths } = require('./package.json').config;

console.log('Variables are: ', name, paths);

module.exports = {
  entry: {
    [`${name.script}`]: paths.entry,
  },

  output: {
    path: path.resolve(__dirname, paths.output),
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
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { 
            loader: 'css-loader', 
            options: { 
              importLoaders: 1 
            } 
          },
          'postcss-loader'
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
      filename: `${name.style}.css`,
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