/**
 * 项目入口文件（基本不变）
 * @Author: iceStone
 * @Date:   2015-11-25 22:37:51
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-02-20 10:59:42
 */

'use strict'

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

/**
 * 设备准备完成事件
 */
app.on('ready', function () {
  // 创建一个窗口
  mainWindow = new BrowserWindow({ width: 1200, height: 720 });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // 打开开发人员工具
  if (process.env.DEBUG) {
    mainWindow.webContents.openDevTools();
  }
  
  // 关闭窗体事件
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});

/**
 * 窗口关闭事件
 */
app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});