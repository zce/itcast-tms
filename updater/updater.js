const fs = require('fs-extra');
const utils = require('./utils');

// 读取当前的版本信息
const packages = {};
packages['core'] = require(`../${process.env.CORE_PACKAGE}/package.json`);
packages['data'] = require('../data/package.json');
packages['updater'] = require('./package.json');

const keys = Object.keys(packages);

const feed_url = 'http://git.oschina.net/micua/files/raw/master/tms/latest/index.json';

/**
 * 检查更新
 * @param  {Function} ) [description]
 * @return {[type]}     [description]
 */
const check = exports.check = () => new Promise((resolve, reject) => {
  // 获取更新链接
  utils.fetchUrl(`${feed_url}?version=${new Date().getTime()}`)
    .then(feed => {
      // 分别获取远端版本
      const feedUrls = JSON.parse(feed);
      return Promise.all(keys.map(key => utils.fetchUrl(`${feedUrls[key]}?version=${packages[key].version}`)));
    })
    .then(feeds => {
      // 比对本地版本校验是否需要更新
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

/**
 * 更新指定地址
 * @param  {[type]} uri       [description]
 * @param  {[type]} to        [description]
 * @param  {[type]} progress) [description]
 * @return {[type]}           [description]
 */
const update = exports.update = (uri, to, progress) => new Promise((resolve, reject) => {
  utils.fetchFile(uri, progress)
    .then(file => {
      fs.move(file.path, to, { clobber: true }, error => {
        if (error)
          reject(error);
        else
          resolve(to);
      });
      // resolve(file);
    })
    .catch(reject);
});


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
