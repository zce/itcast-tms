'use strict';

// 处理环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { app, BrowserWindow, hideInternalModules } = require('electron');

// 禁用旧版的API
hideInternalModules();

global.CONFIG = {
  app_name: app.getName(),
  app_version: app.getVersion(),
  app_root: app.getAppPath(),
  data_version: '20160418'
};

// crashReporter
// // Module to control application life.
// const app = electron.app;
// // Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow;

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
    frame: false,
    show: false
  });

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'production') {
    mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
  } else {
    mainWindow.loadURL('http://localhost:2016/index.html');
  }

  mainWindow.show();

  // Open the DevTools.
  // if (process.env.NODE_ENV !== 'production')
  //   mainWindow.webContents.openDevTools();

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
