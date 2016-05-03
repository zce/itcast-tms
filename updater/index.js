process.env.CORE_PACKAGE = process.env.NODE_ENV === 'production' ? 'core' : 'src';

const path = require('path');
const { app, BrowserWindow } = require('electron');
const updater = require('./updater');

let mainWindow, webContents;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ /* x: 0, y: 0, */ width: 600, height: 400, resizable: false, movable: false, frame: false });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  process.env.NODE_ENV !== 'production' && mainWindow.openDevTools({ detach: true });
  mainWindow.on('closed', () => mainWindow = null);
  webContents = mainWindow.webContents;
  beginUpdate();
});


function beginUpdate() {
  let updater_updated = false;
  updater
    .check()
    .then(needs => {
      return Promise.all(Object.keys(needs)
        .map(key => updater.update(
          needs[key],
          path.resolve(__dirname, '..', key),
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
    })
    .then(files => {
      console.log('更新成功', files.toString());
      if (updater_updated) {
        webContents.send('update_done', '更新成功，请重新启动！');
        setTimeout(function() {
          mainWindow.close();
        }, 3000);
      } else {
        require(`../${process.env.CORE_PACKAGE}`);
        mainWindow.close();
      }
    })
    .catch(error => {
      console.error(error);
      require(`../${process.env.CORE_PACKAGE}`);
      mainWindow.close();
    });
}
