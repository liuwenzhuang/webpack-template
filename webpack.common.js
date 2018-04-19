const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
      main: './src/index.js',
      print: './src/print.js',
      another: './src/another-entry.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'webapck demo',
        template: path.resolve(__dirname, './src/index.ejs'),
      }),
      new CleanWebpackPlugin('./dist')
    ]
}
