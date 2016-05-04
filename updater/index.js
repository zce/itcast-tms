const isProduction = process.env.NODE_ENV === 'production';
process.env.CORE_ROOT = isProduction ? 'core.asar' : 'src';
process.env.DATA_ROOT = isProduction ? 'data.asar' : 'data';
process.env.UPDATER_ROOT = isProduction ? 'updater.asar' : 'updater';

const path = require('path');
const { app, BrowserWindow } = require('electron');

const logger = require('./lib/logger');
const updater = require('./lib/updater');

let mainWindow, webContents;
let updater_updated = false;

app.on('ready', () => {
  updater
    .check()
    .then(needs => {
      const keys = Object.keys(needs);
      if (!(keys && keys.length)) {
        // 不需要需要更新
        return Promise.reject('不需要需要更新');
      }
      // 开始更新
      return beginUpdate(needs, keys);
    })
    .then(files => {

      logger.info(`更新成功，更新了${files.toString()}`);

      if (updater_updated) {

        // 如果更新器更新了，强制重新启动
        webContents.send('update_done', '更新成功，正在退出，请重新启动！');
        // 自动关闭程序
        setTimeout(() => {
          // mainWindow.close();
          app.quit();
        }, 3000);

      } else {

        // 更新核心包和数据 直接启动
        webContents.send('update_done', '更新成功，正在启动，请稍候！');
        for (let key in require.cache) {
          delete require.cache[key];
        }
        try {
          require(`../${process.env.CORE_ROOT}`);
          mainWindow && mainWindow.close();
        } catch (e) {
          logger.fatal(e);
        }

      }

    })
    .catch(error => {

      logger.error(error);
      require(`../${process.env.CORE_ROOT}`);
      mainWindow && mainWindow.close();

    });

});

// 开始更新
function beginUpdate(needs, keys) {
  // 创建窗口显示更新提示
  mainWindow = new BrowserWindow({ width: 600, height: 400, resizable: false, movable: false, frame: false });
  mainWindow.on('closed', () => mainWindow = null);
  // 加载更新提示界面
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  webContents = mainWindow.webContents;
  // 打开开发工具
  isProduction || mainWindow.openDevTools({ detach: true });
  // 更新所有需要更新的包
  return Promise.all(keys.map(key => updater.update(
    needs[key],
    path.resolve(__dirname, '..', key + '.asar'), // !!!!! 自动更新文件位置
    p => {
      webContents.send('update_progress', p);
      switch (key) {
        case 'core':
          webContents.send('update_message', '正在更新系统内核！');
          break;
        case 'data':
          webContents.send('update_message', '正在更新系统数据！');
          break;
        case 'updater':
          updater_updated = true;
          webContents.send('update_message', '正在更新系统更新器！');
          break;
      }
    })));
}

// Crash Reporter
// const crashReporter = require('./crash-reporter');
// app.on('will-finish-launching', () => {
//   crashReporter.init();
// });
