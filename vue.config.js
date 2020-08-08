
const webpack = require('webpack')
const path = require('path')
var Client = require('scp2')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  lintOnSave:false,
  productionSourceMap:false,
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@assets/style/variables.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        return options
      })
  },
  configureWebpack: config => {
    let conf = {
      resolve: {
        alias: {
          '@assets': '@/assets',
          '@imgs': '@/assets/imgs',
          '@c': '@/components',
          '@public': path.resolve(__dirname, './public')
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        }),
      ]
    }
    if (process.env.NODE_ENV === 'production') {
      conf.plugins.push(
        new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            })
        );
    }
    return conf
  },
  devServer: { 
    port:8081
 }
}
