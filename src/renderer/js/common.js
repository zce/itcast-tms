;(function ($) {
  $.electron = require('electron')
  $.fs = require('fs')
  $.path = require('path')

  $.options = $.electron.remote.getGlobal('OPTIONS') || {}

  $.data = require('../common/data')

  $.mail = require('../common/mail')

  $.storage = require('../common/storage')

  $.logger = require('../common/logger').renderer

  $.confirm = window.confirm
  $.alert = window.alert

  $.formatDate = function (source, format) {
    const o = {
      'M+': source.getMonth() + 1, // 月份
      'd+': source.getDate(), // 日
      'H+': source.getHours(), // 小时
      'm+': source.getMinutes(), // 分
      's+': source.getSeconds(), // 秒
      'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
      'f+': source.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return format
  }

  $.getStamp = function (count = $.options.stamp_length) {
    let stamp = ''
    // let chars = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; //随机数
    let chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    for (let i = 0; i < count; i++) {
      stamp += chars[Math.floor(Math.random() * chars.length)]
    }
    return stamp.toUpperCase()
  }

  window.$ = $
}(window.$ || {}))
