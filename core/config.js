'use strict'

const path = require('path');
const fs = require('fs');

var sys_config = {
  debug_port: 2080,
  // 服务端更新
  update_root: 'http://git.oschina.net/micua/files/raw/master/itcast-evaluation/data/',
  // 模板所在的目录
  view_root: path.join(__dirname, 'views'),
  // 静态文件所在的目录
  static_root: path.join(__dirname, 'www'),
  // 缓存文件所在的目录
  data_root: path.join(__dirname, '..', '.eva-data'),
  // log结果文件存储的目录
  log_root: path.join(__dirname, '..', '.eva-logs'),
  // 存放临时文件目录
  temp_root: path.join(__dirname, '..', '.eva-temp'),
};

if (!fs.existsSync(sys_config.log_root)) {
  fs.mkdirSync(sys_config.log_root);
}

exports.system = sys_config;

const get = () => {
  return callback => {
    fs.readFile(path.join(__dirname, '../data/options.json'), 'utf8', function (error, content) {
      let options = JSON.parse(content);
      for (let key in options) {
        sys_config[key] = options[key];
      }
      fs.readFile(path.join(__dirname, '../data/version.json'), 'utf8', function (error, content) {
        let data_version = JSON.parse(content);
        sys_config['data_version'] = data_version.latest;
        fs.readFile(path.join(__dirname, '../version.json'), 'utf8', function (error, content) {
          let app_version = JSON.parse(content);
          sys_config['app_version'] = app_version.latest;
          callback(null, sys_config);
        });
      });
    });
  };
}

const co = require('co');

exports.inject = () => {
  return co.wrap(function* (ctx, next) {
    let config = yield get();
    ctx.config = config;
    return next();
  });
};
