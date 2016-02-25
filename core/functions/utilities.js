/*
 * @Author: iceStone
 * @Date:   2016-01-07 20:58:18
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-01-07 22:37:52
 */

'use strict';

require('./proto');

/**
 * 获取时间
 * @return {[type]} [description]
 */
exports.getDateTime = function () {
  return new Date().format('yyyy-MM-dd HH:mm');
};

/**
 * 获取新的戳
 */
exports.getStamp = function (count) {
  let stamp = '';
  let chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; //随机数
  for (let i = 0; i < count; i++) { //循环操作
    let index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
    stamp += chars[index]; //根据索引取得随机数加到code上
  }
  return stamp;
};

var arr = [
  {name: 'zhangsan', age: 18},
  {name: 'zhangsan', age: 18},
  {name: 'zhangsan', age: 18},
  {name: 'zhangsan', age: 18},
  {name: 'zhangsan', age: 18}
]

/*
* 数组对象去重
* */
exports.distinctArr = function (arr) {
  let unique = {};
  let result = [];
  arr.forEach(function (item) {
    unique[JSON.stringify(item)] = item;
  });
  result = Object.keys(unique).map(function (u) {
    return JSON.parse(u);
  });
  return result;
};
