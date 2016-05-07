process.isProduction = process.env.NODE_ENV === 'production'
const updater = require('./lib/updater')

if (process.appReady) {
  updater()
}  else {
  const { app } = require('electron')
  app.on('ready', updater)
}
