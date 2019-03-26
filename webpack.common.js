const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { name, paths } = require('./package.json').config;

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
        use: 'babel-loader',
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
        ]
      }
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `${name.style}.css`,
      chunkFilename: '[id].css'
    })
  ],

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],

    extensions: ['.js', '.json', '.css'],
  },
}