/**
 * 生产环境入口文件
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const path = require('path')
const fs = require('original-fs')
const { app } = require('electron')

const from = path.resolve(__dirname, './cache/updater')
const to = path.resolve(__dirname, './updater.asar')
const start = to
let appReady = false

app.on('ready', () => { appReady = true })

fs.stat(from, (error, state) => {
  if (error) return require(start)(appReady)
  fs.rename(from, to, error => {
    if (error) return require(start)(appReady)
    console.log('更新器完成更新')
    require(start)(appReady)
  })
})
