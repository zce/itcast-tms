;(function ($) {
  $.electron = require('electron')
  $.fs = require('fs')
  $.path = require('path')

  $.options = $.electron.remote.getGlobal('OPTIONS') || {}

  $.data = require('../common/data')

  $.mail = require('../common/mail')

  $.storage = require('../common/storage')

  $.logger = require('../common/logger').renderer

  window.$ = $
}(window.$ || {}))

;(function ($) {
  'use strict'
  Array.prototype.remove = function (item) {
    const index = this.indexOf(item)
    if (index !== -1)
      this.splice(index, 1)
  }
  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
  // (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
  Date.prototype.format = function (format) {
    const o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'H+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      'f+': this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(format))
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o)
      if (new RegExp('(' + k + ')').test(format))
        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return format
  }

  String.getStamp = function (count = $.options.stamp_length) {
    let stamp = ''
    // let chars = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; //随机数
    let chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; // 随机数
    for (let i = 0; i < count; i++) { // 循环操作
      stamp += chars[Math.floor(Math.random() * chars.length)]; // 根据索引取得随机数加到code上
    }
    return stamp.toUpperCase()
  }
}($))
