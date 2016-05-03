process.env.CORE_PACKAGE = process.env.NODE_ENV === 'production' ? 'core' : 'src';

const path = require('path');
const { app, BrowserWindow } = require('electron');
const updater = require('./updater');

let mainWindow, webContents;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ x: 0, y: 0, width: 600, height: 400, resizable: false, movable: false, frame: false });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  process.env.NODE_ENV !== 'production' && mainWindow.openDevTools({ detach: true });
  mainWindow.on('closed', () => mainWindow = null);
  webContents = mainWindow.webContents;
  beginUpdate();
});


function beginUpdate() {
  updater
    .check()
    .then(needs => {
      return Promise.all(Object.key(needs)
        .map(key => updater.update(needs[key], path.resolve(__dirname, '..', 'test', key), p => {
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
              webContents.send('update_message', '正在更新系统更新器！');
              break;
          }
        })));
    })
    .then(files => {
      console.log('更新成功', files);
      require(`../${process.env.CORE_PACKAGE}`);
    })
    .catch(error => {
      require(`../${process.env.CORE_PACKAGE}`);
    });
}


// setTimeout(function() {
//   let p = 0;
//   const interval = setInterval(() => {
//     p += 0.05;
//     if (p > 1) {
//       clearInterval(interval);
//       mainWindow.setProgressBar(-1);
//       webContents.send('update_progress', 1);
//       return;
//     }
//     mainWindow.setProgressBar(p);
//     webContents.send('update_progress', p);
//   }, 200);
// }, 5000);
