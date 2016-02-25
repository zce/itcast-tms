/*
 * @Author: iceStone
 * @Date:   2015-11-26 00:19:17
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-02-24 14:26:47
 */

'use strict';

const fs = require('fs');
const path = require('path');
const co = require('co');
const thunkify = require('thunkify');
const fetch = require('../functions/fetch');
const config = require('../config');

let tasks = ['academies.json', 'itcast.json', 'options.json', 'questions.json', 'schools.json', 'subjects.json'];
module.exports = co.wrap(function*(ctx, next) {
  if (ctx.request.url !== '/') {
    return next();
  }

  try {
    yield fetch('http://m.baidu.com/');
    // console.log('online');
    ctx.online = true;
  } catch (e) {
    // console.log('offline');
    ctx.online = false;
  }

  let localContent = yield thunkify(fs.readFile)(path.join(__dirname, '../../data/version.json'));
  let local = JSON.parse(localContent);
  try {
    let remoteContent = yield fetch(config.system.update_root + 'version.json');
    let remote = JSON.parse(remoteContent);
    if (local.latest !== remote.latest) {
      ctx.body = '<h1>正在更新</h1>';
      console.log('需要更新');
      for (let i = 0; i < tasks.length; i++) {
        let temp = yield fetch(`${config.system.update_root}${remote.latest}/${tasks[i]}`);
        yield thunkify(fs.writeFile)(path.join(__dirname, `../../data/${tasks[i]}`), temp, 'utf8');
        console.log(`更新『${tasks[i]}』完成`);
      }
      yield thunkify(fs.writeFile)(path.join(__dirname, '../../data/version.json'), JSON.stringify(remote), 'utf8');
      config.system.data_version = remote.latest;
    }
    return next();
  } catch (e) {
    return next();
  }
});
