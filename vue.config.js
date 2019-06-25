    
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    open: true,  // 自动打开浏览器
    hot: true, // 实时打包编译
    inline: true,  // 表示实时刷新浏览器
    port: '8020'   // 指定打开浏览器的端口号
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
  }
}