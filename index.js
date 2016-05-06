/**
 * 测试环境入口文件
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const { app } = require('electron')

app.on('ready', () => {
  require('./src')
})
