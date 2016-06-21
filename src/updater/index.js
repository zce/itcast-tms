/**
 * 更新器入口
 * @param  {[type]} appReady [description]
 * @return {[type]}          [description]
 */
module.exports = (appReady) => {
  const updater = require('./lib/updater')
  if (appReady) {
    updater()
  } else {
    const { app } = require('electron')
    app.on('ready', updater)
  }
}
