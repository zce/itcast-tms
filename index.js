/**
 * 测试环境入口文件
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const path = require('path')
const fs = require('original-fs')
const { app } = require('electron')

const from = path.resolve(__dirname, './cache/updater')
const to = path.resolve(__dirname, './updater.asar')
const start = path.resolve(__dirname, './src')

app.on('ready', () => { process.appReady = true })

fs.stat(from, (error, state) => {
  if (error) return require(start)
  fs.rename(from, to, error => {
    if (error) return require(start)
    console.log('更新器完成更新')
    require(start)
  })
})



// try {
//   fs.statSync(from)
//   fs.renameSync(from, to)
//   console.log('更新器完成更新')
//   require(start)
// } catch(e) {
//   require(start)
// }



// const { app } = require('electron')

// app.on('ready', () => {
//   require('./src')
// })
