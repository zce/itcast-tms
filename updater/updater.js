const utils = require('./utils');

// 读取当前的版本信息
const packages = {
  core: require(`../${process.env.NODE_ENV === 'production' ? 'core' : 'src'}/package.json`),
  data: require('../data/package.json'),
  updater: require('./package.json'),
};
const keys = Object.keys(packages);

const feed_url = 'http://git.oschina.net/micua/files/raw/master/tms/latest/index.json';

const check = exports.check = () => new Promise((resolve, reject) => {
  utils.fetchUrl(`${feed_url}?version=${new Date().getTime()}`)
    .then(feed => {
      const feedUrls = JSON.parse(feed);
      return Promise.all(keys.map(key => utils.fetchUrl(`${feedUrls[key]}?version=${packages[key].version}`)));
    })
    .then(feeds => {
      // resolve(feeds);
      const need_updates = {};
      keys.forEach((key, i) => {
        const item = JSON.parse(feeds[i]);
        if (packages[key].version !== item.name)
          need_updates[key] = item.url;
      });
      resolve(need_updates);
    })
    .catch(reject);
});

const update = exports.update = (uri, dir, progress) => utils.fetchFile(uri, progress);


// module.exports = () => new Promise((resolve, reject) => {
//   return resolve('ok');

//   fetch(`${feed_url}?version=${new Date().format('yyyyMMdd')}`)
//     .then(feed => {
//       // try {
//       return global.FEED_URLS = JSON.parse(feed);
//       // console.log(feedUrls);
//       // } catch (e) {
//       //   return Promise.reject(e);
//       // }
//     })
//     // 更新 updater
//     .then(urls => {
//       return fetch(`${urls.updater}?version=${updaterPkg.version}`);
//     })
//     .then(updaterFeed => {
//       // try {
//       updaterFeed = JSON.parse(updaterFeed);
//       if (updaterFeed.name !== updaterPkg.version) {
//         // 需要更新 updater
//         return wget(updaterFeed.url);
//       }
//       // } catch (e) {
//       //   return Promise.reject(e);
//       // }
//     })
//     .then(file => {
//       require('./index.js');
//     })
//     // 更新 core
//     .then(urls => {
//       return urls;
//     })
//     // 更新 data
//     .then(urls => {
//       return urls;
//     })
//     .catch(e => {
//       const message = 'Got update feed failed. error: ' + e.message;
//       console.log(message);
//       reject(new Error(message))
//     });
// });



// const updateUpdater = exports.updateUpdater = (url) => new Promise((resolve, reject) => {

// });

// const updateCore = exports.updateCore = (url) => new Promise((resolve, reject) => {

// });

// const updateData = exports.updateData = (url) => new Promise((resolve, reject) => {

// });



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
