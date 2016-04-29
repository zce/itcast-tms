const { app } = require('electron');

const path = require('path');
const utils = require('./utils');
const config = require('../config');

const options = {};

Object.assign(options, config, {
  // 应用程序名
  app_name: app.getName(),
  // 主版本
  app_version: app.getVersion(),
  // 程序所在目录
  app_root: app.getAppPath(),
  // 服务器信息
  main_url: `file://${path.resolve(__dirname, '../renderer')}/splash.html`,
  // main_url: `http://localhost:2016/renderer/splash.html`,
  // 服务IP
  server_ip: utils.getLocalAreaIp(),
  // 服务Port
  server_port: 8080
});

module.exports = options;
