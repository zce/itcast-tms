process.env.CORE_ROOT = process.env.NODE_ENV === 'production' ? 'core.asar' : 'src';
process.env.DATA_ROOT = process.env.NODE_ENV === 'production' ? 'data.asar' : 'data';
process.env.UPDATER_ROOT = process.env.NODE_ENV === 'production' ? 'updater.asar' : 'updater';

const path = require('path');
const { app, BrowserWindow } = require('electron');

// const crashReporter = require('./crash-reporter');
// app.on('will-finish-launching', () => {
//   crashReporter.init();
// });

const updater = require('./updater');
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
      return beginUpdate(needs, keys);
    })
    .then(files => {
      console.log(`更新成功，更新了${files.toString()}`, updater_updated);
      if (updater_updated) {
        webContents.send('update_done', '更新成功，正在重新启动，请稍候！');
        // 自动关闭程序
        setTimeout(() => {
          // mainWindow.close();
          app.quit();
        }, 3000);
      } else {
        require(`../${process.env.CORE_ROOT}`);
        mainWindow && mainWindow.close();
      }
    })
    .catch(error => {
      console.log(error);
      require(`../${process.env.CORE_ROOT}`);
      mainWindow && mainWindow.close();
    });

});

function beginUpdate(needs, keys) {
  // 窗口开始更新
  mainWindow = new BrowserWindow({ /* x: 0, y: 0, */ width: 600, height: 400, resizable: false, movable: false, frame: false });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  process.env.NODE_ENV !== 'production' && mainWindow.openDevTools({ detach: true });
  mainWindow.on('closed', () => mainWindow = null);
  webContents = mainWindow.webContents;
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
