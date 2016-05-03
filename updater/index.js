process.env.CORE_PACKAGE = process.env.NODE_ENV === 'production' ? 'core' : 'src';

const path = require('path');
const { app, BrowserWindow } = require('electron');

// const crashReporter = require('./crash-reporter');
// app.on('will-finish-launching', () => {
//   crashReporter.init();
// });

const updater = require('./updater');
let mainWindow, webContents;

app.on('ready', () => {

  let updater_updated = false;
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
      // console.log(`更新成功，更新了${files.toString()}`);
      if (updater_updated) {
        webContents.send('update_done', '更新成功，请重新启动！');
        // 自动关闭程序
        setTimeout(() => {
          // mainWindow.close();
          app.quit();
        }, 3000);
      } else {
        require(`../${process.env.CORE_PACKAGE}`);
        mainWindow && mainWindow.close();
      }
    })
    .catch(error => {
      console.log(error);
      require(`../${process.env.CORE_PACKAGE}`);
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
    path.resolve(__dirname, '..', key), // !!!!! 自动更新文件位置
    p => {
      webContents.send('update_progress', p);
      switch (key) {
        case 'core':
        case 'src':
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
