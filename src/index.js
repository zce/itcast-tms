'use strict';

const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const { app, BrowserWindow, hideInternalModules } = require('electron');

// 禁用旧版的API
hideInternalModules();

// 全局配置选项
global.OPTIONS = {
  app_name: app.getName(),
  app_version: app.getVersion(),
  app_root: app.getAppPath(),

  data_root: path.resolve(__dirname, './data'),
  data_version: '20160418',

  temp_root: path.resolve(__dirname, '../temp'),
  log_root: path.resolve(__dirname, '../log'),
  log_ext: '.tms'
};

// ===== 目录不存在 则创建 =====
fs.existsSync(OPTIONS.temp_root) || fs.mkdir(OPTIONS.temp_root);
fs.existsSync(OPTIONS.log_root) || fs.mkdir(OPTIONS.log_root);

// ===== 日志记录 =====
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: path.join(OPTIONS.log_root, 'frontend.log'), category: 'frontend' },
    { type: 'file', filename: path.join(OPTIONS.log_root, 'backend.log'), category: 'backend' }
  ]
});

global.LOGGER = log4js.getLogger('frontend');
const logger = log4js.getLogger('backend');
logger.setLevel('ALL');

// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');


// crashReporter
// // Module to control application life.
// const app = electron.app;
// // Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow;
//

// fix animate
// app.commandLine.appendSwitch('disable-renderer-backgrounding')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    minWidth: 1024,
    height: 720,
    minHeight: 720,
    x: 0,
    y: 0,
    frame: false,
    show: false
  });

  // Open the DevTools.
  if (process.env.NODE_ENV !== 'production')
    mainWindow.webContents.openDevTools();

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'production') {
    mainWindow.loadURL('file://' + __dirname + '/index.html');
  } else {
    mainWindow.loadURL('http://localhost:2016/index.html');
  }

  mainWindow.show();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Emitted when the page title updated
  mainWindow.on('page-title-updated', () => {

  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
