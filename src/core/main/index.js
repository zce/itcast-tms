/**
 * 主线程入口
 */

// 全局配置选项
const options = require('./config')
global.OPTIONS = options

module.exports = (appReady) => {
  // 后台服务
  require('./server')

  // 创建窗口
  const createWindow = require('./window')
  if (appReady) {
    createWindow()
  } else {
    const { app } = require('electron')
    app.on('ready', createWindow)
  }
}
