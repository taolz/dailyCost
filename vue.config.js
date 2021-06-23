const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: "http://47.99.134.126:7008",  // 配置到服务器后端的API头部
        pathRewrite: {
          '^/api': '/api'  // 路径重写，第一个与上面相同，第二个/queue-admin 为server.context-path（服务器的上下文）
        },
        // 以下解决https 访问问题。上面的可以访问http
        changeOrigin: true,
        secure: false
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        algorithm: 'gzip', // 使用gzip压缩
        test: /\.js$|\.html$|\.css$/, // 匹配文件名
        filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
        minRatio: 1, // 压缩率小于1才会压缩
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
      }),
    ]

  }
}