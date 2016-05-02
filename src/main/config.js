const { app } = require('electron');

const path = require('path');
const config = require('../config');

const options = {};

Object.assign(options, config, {
  // 应用程序名
  app_name: app.getName(),
  // 主版本
  app_version: app.getVersion(),
  // 程序所在目录
  app_root: app.getAppPath()
});

module.exports = options;
