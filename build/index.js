const path = require('path')
const fs = require('original-fs')

process.env.NODE_ENV = 'production'

const from = path.resolve(__dirname, './cache/updater')
const to = path.resolve(__dirname, './updater.asar')

fs.stat(from, (error, state) => {
  if (error) {
    require(to)
    return false
  }
  fs.rename(from, to, error => {
    if (error) throw error
    console.log('更新器完成更新')
    require(to)
  })
})
