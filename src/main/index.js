'use strict';

const { app, hideInternalModules } = require('electron');

hideInternalModules(); // 禁用旧版的API

// 日志记录模块
Object.assign(global.OPTIONS, {
  logger: require('./log')
});

// 创建窗口
require('./window');
