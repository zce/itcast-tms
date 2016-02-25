/*
 * @Author: iceStone
 * @Date:   2015-11-05 09:47:45
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-11-05 15:00:21
 */

'use strict';

const root = 'http://itcast-evaluation.wedn.net/core/';

const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, '..', 'version.json');

const checking = (callback) => {
  fs.readFile(filepath, 'utf8', function (error, data) {
    if (error) {
      // 本地文件读取失败
      callback(error);
      return false;
    }
    const localVersion = JSON.parse(data);
    const http = require('http');
    http.get(`${root}version.json`, function (result) {
      let content = '';
      result.on('data', function (data) {
        content += data;
      });
      result.on('end', function (error) {
        const remoteVersion = JSON.parse(content);
        if (localVersion.latest !== remoteVersion.latest) {
          callback(undefined, remoteVersion);
        } else {
          callback(undefined, false);
        }
      });
    }).on('error', function (error) {
      callback(error);
    });
  });
};

const update = (progress, callback) => {
  checking((error, version) => {
    if (error) {
      callback(error);
      return false;
    }
    if (!version) {
      callback('don\'t need');
      return false;
    }
    const cacheDir = path.join(__dirname, '../cache/');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }
    const wget = require('wget');
    const output = path.join(__dirname, '../cache/core.zip');
    const options = {};
    const download = wget.download(`${root}${version.latest}/core.zip`, output, options);
    download.on('progress', progress);
    download.on('error', callback);
    download.on('end', () => {
      // 解压 electron中无法创建asar文件，可以重命名
      const unzip = require('unzip');
      fs.createReadStream(output)
        .pipe(unzip.Extract({ path: cacheDir }))
        .on('close', (error) => {
          if (error) {
            callback(error);
            return false;
          }
          fs.unlink(output);
          const destPath = path.join(__dirname, '../core.asar');
          // 移动 
          fs.rename(path.join(__dirname, '../cache/core'), destPath, function (error) {
            if (error) {
              callback(error);
              return false;
            }
            fs.stat(destPath, function (error, stats) {
              if (error) {
                callback(error);
                return false;
              }
              callback(destPath);
              fs.writeFile(filepath, JSON.stringify(version), 'utf8');
            });
          });
        });

    });
  });
};

module.exports = { update };