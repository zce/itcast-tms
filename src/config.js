const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const options = {
  // 应用程序名
  app_name: app.getName(),
  // 主版本
  app_version: app.getVersion(),
  // 程序所在目录
  app_root: app.getAppPath(),
  // 数据文件所在目录
  data_root: path.resolve(__dirname, '../data'),
  // 数据文件版本
  data_version: require('../data/package.json').version,
  // 临时目录
  temp_root: path.resolve(__dirname, '../../temp'),
  // 日志文件目录
  log_root: path.resolve(__dirname, '../../log'),
  // 日志扩展名
  log_ext: '.tms',
  // 服务器信息
  server_ip: utils.getLocalAreaIp()
};

module.exports = {
  development: Object.assign(options, {
    main_url: `http://localhost:3000/splash.html`,
    // 服务器信息
    server_port: 8080
  }),
  production: Object.assign(options, {
    main_url: `file://${path.resolve(__dirname, 'renderer')}/splash.html`,
    // 服务器信息
    server_port: 8080
  })
}[process.env.NODE_ENV];

// ===== 目录不存在 则创建 =====
fs.existsSync(module.exports.log_root) || fs.mkdir(module.exports.log_root);
// fs.existsSync(module.exports.temp_root) || fs.mkdir(module.exports.temp_root);
