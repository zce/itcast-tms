/*
 * @Author: iceStone
 * @Date:   2015-11-26 00:19:17
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-02-24 14:26:47
 */

'use strict';

const fs = require('fs');
const path = require('path');
const wget = require('wget');
const co = require('co');
const thunkify = require('thunkify');
const fetch = require('../functions/fetch');
const config = require('../config');

const tasks = ['academies.json', 'itcast.json', 'options.json', 'questions.json', 'schools.json', 'subjects.json'];

const tmpFile = path.join(__dirname, '../../cache/t.txt');

const update = (ctx, callback) => {
  const download = wget.download('http://m.baidu.com', tmpFile);
  download.on('error', () => {
    ctx.online = false;
    fs.exists(tmpFile, (e) => { e && fs.unlink(tmpFile); });
    callback(null, false);
  });
  download.on('end', () => {
    ctx.online = true;
    fs.exists(tmpFile, (e) => { e && fs.unlink(tmpFile); });
    const localFile = path.join(__dirname, '../../data/version.json');
    fs.readFile(localFile, 'utf8', (error, content) => {
      const local = JSON.parse(content);
      fetch(config.system.update_root + 'version.json')((error, content) => {
        const remote = JSON.parse(content);
        if (local.latest !== remote.latest) {
          console.log(`数据需要更新到『${remote.latest}』`);
          let count = tasks.length;
          tasks.forEach((item) => {
            fetch(`${config.system.update_root}${remote.latest}/${item}`)((error, content) => {
              fs.writeFile(path.join(__dirname, `../../data/${item}`), content, 'utf8', (error) => {
                console.log(`『${item}』更新完成`);
                if (!--count) {
                  fs.writeFile(localFile, JSON.stringify(remote), 'utf8', (error) => {
                    console.log(`全部数据更新完成`);
                    callback(null, true);
                  });
                }
              });
            });
          });
        } else {
          callback(null, false);
        }
      });
    });
  });
}

module.exports = co.wrap(function* (ctx, next) {
  if (ctx.request.url !== '/') {
    return next();
  }
  yield thunkify(update)(ctx);
  return next();
});
