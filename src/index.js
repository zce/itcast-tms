/**
 * 测试环境入口文件
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const path = require('path')
const fs = require('original-fs')
const { app } = require('electron')

const from = path.resolve(__dirname, './cache/updater')
const to = path.resolve(__dirname, './updater.asar')
const start = path.resolve(__dirname, './core')

app.on('ready', () => { process.appReady = true })

fs.stat(from, (error, state) => {
  if (error) return require(start)
  fs.rename(from, to, error => {
    if (error) return require(start)
    console.log('更新器完成更新')
    require(start)
  })
})
