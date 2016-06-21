const { app, BrowserWindow } = require('electron')
const options = require('./config')

let mainWindow

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// if (process.appReady) {
//   createWindow()
// } else {
//   app.on('ready', createWindow)
// }

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})

app.on('activate', () => {
  // throw new Error('出现错伏了')
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

const createWindow = module.exports = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    minWidth: 1024,
    height: 720,
    minHeight: 720,
    // x: 0,
    // y: 0,
    frame: false,
    show: false
  })

  // Open the DevTools.
  process.env.NODE_ENV !== 'production' && mainWindow.openDevTools({ detach: true })

  // and load the index.html of the app.
  mainWindow.loadURL(options.main_url)
  // mainWindow.loadURL('data:text/html, <h1>Hello world</h1>')

  mainWindow.once('ready-to-show', () => mainWindow.show())

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

// Emitted when the page title updated
// mainWindow.on('page-title-updated', () => {})
}
