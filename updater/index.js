Date.prototype.format = function(format) {
  const o = { 'M+': this.getMonth() + 1, 'd+': this.getDate(), 'H+': this.getHours(), 'm+': this.getMinutes(), 's+': this.getSeconds(), 'q+': Math.floor((this.getMonth() + 3) / 3), 'f+': this.getMilliseconds() };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return format;
};

const { app, BrowserWindow } = require('electron');


function createWindow() {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // x: 0,
    // y: 0,
    resizable: false,
    movable: false,
    frame: false,
    show: false
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  const updater = require('./updater');

  updater()
    .then((version) => {
      const core = process.env.NODE_ENV === 'production' ? '../core' : '../src';
      require(core);
    })
    .catch(error => {
      throw error;
    });

  mainWindow.show();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);
