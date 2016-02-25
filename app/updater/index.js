/*
 * @Author: iceStone
 * @Date:   2015-11-05 09:47:45
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-11-05 15:00:21
 */

'use strict';

const fetch = require('./fetch');
const path = require('path');
const fs = require('fs');
const http = require('http');

// fetch.getFile('http://itcast-evaluation.wedn.net/core/core.asar', path.join(__dirname, 'core.asar'), function (p) {
//   console.log(p);
// });

let uri = 'http://itcast-evaluation.wedn.net/core/core.asar';
let save = path.join(__dirname, 'core.asar');

var writer = fs.createWriteStream(save);


// 文件接收中
writer.on('drain', (e) => {
  console.log('文件接收中');
  console.log(e);
});
// 文件接收错误
writer.on('error', () => {
  console.log('文件接收错误');
});
// 文件接收完毕
writer.on('finish', () => {
  console.log('文件接收完毕');
});

http.get(uri, function (response) {
  response.pipe(writer);
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});