const path = require('path');
const config = require('./project.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'gdfe_script': config.paths.entry
  },

  output: {
    path: config.paths.output,
    filename: "[name].js",
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
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        })
      }
    ],
  },

  plugins: [
    new ExtractTextPlugin("gdfe_styles.css"),
  ],

  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],

    extensions: [".js", ".json", ".css"],
  },

  devtool: "source-map",
}