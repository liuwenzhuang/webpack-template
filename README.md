[CSS Modules]: https://github.com/css-modules/css-modules
[extract-text-webpack-plugin]:https://github.com/webpack-contrib/extract-text-webpack-plugin
[postcss-loader]:https://github.com/postcss/postcss-loader
[common-config]:./webpack.common.js
[webpack-merge]:https://github.com/survivejs/webpack-merge
[workbox-webpack-plugin]:https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
[SplitChunksPlugin]:https://webpack.js.org/plugins/split-chunks-plugin/
# webpack@4.5模板工程

## 运行

```bash
$ npm i
$ npm run start   // 本地测试
$ npm run build   // 生产打包
```

## 结构

`production`和`development`配置分离，抽取[公共配置][common-config]，使用[webpack-merge][webpack-merge]合并配置。

## CSS部分

 - 使用了[CSS Modules][CSS Modules]处理css
 - 使用[extract-text-webpack-plugin@4.0.0-beta.0][extract-text-webpack-plugin]独立出css文件
 - 使用[postcss-loader][postcss-loader]处理样式前缀

-----------------------

# 集成过程中遇到的问题，罗列如下：

## CommonsChunkPlugin

此插件在webpack 4已被移除，使用`optimization.splitChunks`和`optimization.runtimeChunk`选项替代，他们也被称为[SplitChunksPlugin][SplitChunksPlugin]：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: true,
      automaticNameDelimiter: '-',  // 构成抽取模块名的连接符，默认为~
    }
  }
}
```

## extract-text-webpack-plugin

目前在webpack 4以上工程，**需要使用extract-text-webpack-plugin@next版本**：

```bash
$ npm i -D extract-text-webpack-plugin@next
```
### 使用方式

```javascript
// webpack.prod.js
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
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
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true,    // 用于使用CommonChunksPlugin提取公共代码至独立文件
      ignoreOrder: true,  // 用于css module
    }),
  ]
}
```

## workbox-webpack-plugin

[workbox-webpack-plugin][workbox-webpack-plugin]用于启用service-worker功能，使用3.1.0版本，自3.0版本此插件使用方式有些变化：提供`GenerateSW Plugin`和`InjectManifest Plugin`两个独立部分，使用时按需分别配置。

```bash
$ npm i -D workbox-webpack-plugin
```

### 使用方式

```javascript
// webpack.prod.js
const WorkboxPlugin = require('workbox-webpack-plugin');
module.exports = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助 ServiceWorkers 快速启用
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
      // 此选项使用本地Workbox运行库，避免不能访问Google Cloud Storage
      importWorkboxFrom: 'local'
    }),
  ]
}
```

 > 默认情况下，[workbox-webpack-plugin][workbox-webpack-plugin]插件从Google Cloud Storage加载Workbox运行库，但可以将importWorkboxFrom选项设置为'local'，表示使用本地Workbox运行库。
