'use strict'

const { hideInternalModules } = require('electron')

// 禁用旧版的API
hideInternalModules()

// 全局配置选项
const options = require('./config')

// 后台服务
require('./server')

// 日志记录模块
// Object.assign(options, {})

global.OPTIONS = options

// 创建窗口
require('./window')
