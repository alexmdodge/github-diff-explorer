const path = require('path');
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
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: 'ts-loader',
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
    extensions: ['.js', '.ts', '.json', '.css'],
  },
}