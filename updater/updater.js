const download = require('download');
const fetch = require('./fetch');

// 读取当前的版本信息
const corePkg = require('../core/package.json');
const dataPkg = require('../data/package.json');
const updaterPkg = require('./package.json');

const feed_url = 'http://tms.uieee.com/latest/index.json';

module.exports = () => new Promise((resolve, reject) => {
  return resolve('ok');

  fetch(`${feed_url}?version=${new Date().format('yyyyMMdd')}`)
    .then(feed => {
      try {
        return global.FEED_URLS = JSON.parse(feed);
        // console.log(feedUrls);
      } catch (e) {
        return Promise.reject(e);
      }
    })
    // 更新 updater
    .then(urls => {
      return fetch(`${urls.updater}?version=${updaterPkg.version}`);
    })
    .then(updaterFeed => {
      try {
        updaterFeed = JSON.parse(updaterFeed);
        if (updaterFeed.name !== updaterPkg.version) {
          // 需要更新 updater
          return wget(updaterFeed.url);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    })
    .then(file => {
      require('./index.js');
    })
    // 更新 core
    .then(urls => {
      return urls;
    })
    // 更新 data
    .then(urls => {
      return urls;
    })
    .catch(e => {
      const message = 'Got update feed failed. error: ' + e.message;
      console.log(message);
      reject(new Error(message))
    });
});

const wget = module.exports.wget = (url) => new Promise((resolve, reject) => {
  download({ extract: true })
    .get(url)
    .dest('../')
    // .rename('./updater')
    .run((error, files) => {
      if (error) reject(error);
      else resolve(files[0]);
    });
});



// var download = require('electron-download')
// var extract = require('extract-zip')

// module.exports = () => new Promise((resolve, reject) => {
//   resolve('');
// });





// var os = require('os');
// const { app, autoUpdater } = require('electron');

// var platform = os.platform() + '_' + os.arch();
// var version = app.getVersion();

// autoUpdater.setFeedUrl('http://localhost:1337/update/' + platform + '/' + version);

// autoUpdater.on('update-available', (e) => { console.log(e) });
// autoUpdater.on('update-not-available', (e) => { console.log(e) });
