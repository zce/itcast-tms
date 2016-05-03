const { app, BrowserWindow } = require('electron');

let mainWindow, webContents;
app.on('ready', () => {
  mainWindow = new BrowserWindow({ x: 0, y: 0, width: 600, height: 400, resizable: false, movable: false, frame: false });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  process.env.NODE_ENV !== 'production' && mainWindow.openDevTools({ detach: true });
  mainWindow.on('closed', () => mainWindow = null);
  webContents = mainWindow.webContents;
  update();
});

const updater = require('./updater');

function update() {
  updater()
    .then((version) => {
      console.log('update to ' + version);
      require(process.env.NODE_ENV === 'production' ? '../core' : '../src');
      mainWindow.close();
    })
    .catch(error => {
      console.log(error);
      require(process.env.NODE_ENV === 'production' ? '../core' : '../src');
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
