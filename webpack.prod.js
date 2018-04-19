const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');        // 代码压缩
const WorkboxPlugin = require('workbox-webpack-plugin');          // service-worker功能
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 从bundle提取文本，或将bundles合成一个独立文件

const prodConfig = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                minimize: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                  plugins: [require('autoprefixer')]
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'production'
    }),
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助 ServiceWorkers 快速启用
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
      importWorkboxFrom: 'local'
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true,    // 用于使用CommonChunksPlugin提取公共代码至独立文件
      ignoreOrder: true,  // 用于css module
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: true,
      automaticNameDelimiter: '-',  // 构成抽取模块名的连接符，默认为~
    }
  }
});

module.exports = prodConfig;
