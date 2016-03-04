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

// 处理环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

/**
 * 设备准备完成事件
 */
app.on('ready', () => {
  // 创建一个窗口
  mainWindow = new BrowserWindow({ width: 1200, height: 720, show: false });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  const webContents = mainWindow.webContents;
  mainWindow.show();

  const updater = process.env.NODE_ENV === 'development' ? require('../updater') : require('./updater.asar');
  updater.update((p) => {
    mainWindow.setProgressBar(p);
    webContents.send('update_progress', p);
  }, () => {
    // 启动核心服务
    const core = process.env.NODE_ENV === 'development' ? require('../core') : require('./core.asar');
    core.setWindow(mainWindow);
    core.start((url) => {
      mainWindow.loadURL(`${url}update.html?r=/`);
    });
  });

  // 打开开发人员工具
  if (process.env.NODE_ENV === 'development') {
    // webContents.openDevTools();
  }

  // 关闭窗体事件
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

/**
 * 窗口关闭事件
 */
app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});