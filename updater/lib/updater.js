'use strict'
const path = require('path')
const { app, BrowserWindow } = require('electron')
const utils = require('./utils')
const logger = require('./logger')

const isProduction = process.env.NODE_ENV === 'production'
process.env.CORE_ROOT = isProduction ? 'core.asar' : 'src'
process.env.DATA_ROOT = isProduction ? 'data.asar' : 'data'
process.env.UPDATER_ROOT = isProduction ? 'updater.asar' : 'updater'

// 读取当前的版本信息
const packages = {
  core: utils.getFileStamp(path.resolve(__dirname, `../../${process.env.CORE_ROOT}`)),
  data: utils.getFileStamp(path.resolve(__dirname, `../../${process.env.DATA_ROOT}`)),
  updater: utils.getFileStamp(path.resolve(__dirname, `../../${process.env.UPDATER_ROOT}`))
}
const packagesKeys = Object.keys(packages)

// Step 1 检查更新
const check = root => new Promise((resolve, reject) => {
  // 获取更新链接
  utils.fetchUrl(`${root}?version=${Math.floor(Date.now() / 1000 / 60 / 60)}`)
    .then(content => {
      // 分别获取远端信息
      const feed = JSON.parse(content)
      return Promise.all(packagesKeys.map(key => utils.fetchUrl(`${feed[key]}?version=${packages[key]}`)))
    })
    .then(contents => {
      // 比对本地版本校验是否需要更新
      const needs = {}
      packagesKeys.forEach((key, i) => {
        const item = JSON.parse(contents[i])
        if (packages[key] !== item.name) {
          needs[key] = item.url
        }
      })
      return needs
    })
    .then(needs => {
      if (!Object.keys(needs).length) {
        // 不需要需要更新
        return reject('不需要需要更新')
      }
      return resolve(needs)
    })
    .catch(reject)
})

let mainWindow, webContents
// Step 2 开始下载更新
const download = needs => {
  // 创建窗口显示更新提示
  mainWindow = new BrowserWindow({ width: 600, height: 400, resizable: false, movable: false, frame: false })
  mainWindow.on('closed', () => { mainWindow = null })
  // 加载更新提示界面
  mainWindow.loadURL(`file://${__dirname}/../index.html`)
  webContents = mainWindow.webContents
  // 打开开发工具
  isProduction || mainWindow.openDevTools({ detach: true })
  const tasks = Object.keys(needs).map(key => utils.fetchFile(needs[key], key, progress(key)))
  return Promise.all(tasks)
}

// let updaterUpdated = false
const progress = key => p => {
  webContents.send('update_progress', p)
  switch (key) {
    case 'core':
      webContents.send('update_message', '正在更新系统内核！')
      break
    case 'data':
      webContents.send('update_message', '正在更新系统数据！')
      break
    case 'updater':
      // updaterUpdated = true
      webContents.send('update_message', '正在更新系统更新器！')
      break
  }
}

// Step 3 更新完成
const done = (files) => {
  logger.info(`更新成功，更新了『${files.toString()}』`)
  if (files.includes('updater_updated')) {
    // 如果更新器更新了，强制重新启动
    console.log('更新的是更新器，需要重启动')
    webContents.send('update_done', '更新成功（需要重启软件），正在退出，请重新启动！')
    // 自动关闭程序
    setTimeout(() => app.quit(), 3000)
    return
  }
  // 更新核心包和数据 直接启动
  webContents.send('update_done', '更新成功，正在启动，请稍候！')
  for (let key in require.cache) {
    delete require.cache[key]
  }
  launch()
}

// failed
const failed = error => {
  if (typeof error !== 'string') {
    logger.error(error)
  } else {
    console.log(error)
  }
  launch()
}

const launch = () => {
  try {
    require(`../../${process.env.CORE_ROOT}`)
    mainWindow && mainWindow.close()
  } catch (e) {
    logger.fatal(e)
  }
}

const manifest = 'http://git.oschina.net/micua/tms/raw/master/latest/index.json'

module.exports = () => {
  process.env.APP_READY = true
  console.time('updater')

  // 检查更新
  check(manifest)
    .then((needs) => {
      console.timeEnd('updater')
      // console.log(needs)
      return needs
    })
    // 下载更新
    .then(download)
    // 更新完成
    .then(done)
    // 更新失败
    .catch(failed)

  // const online = require('./online')
  // online()
  //   // 检查更新
  //   .then(() => check(manifest))
  //   .then((needs) => {
  //     console.timeEnd('updater')
  //     console.log(needs)
  //     return needs
  //   })
  //   // 下载更新
  //   .then(download)
  //   // 更新完成
  //   .then(done)
  //   // 更新失败
  //   .catch(failed)
}
