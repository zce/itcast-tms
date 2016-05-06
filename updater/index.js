const { app } = require('electron')
const updater = require('./lib/updater')

app.on('ready', updater)
